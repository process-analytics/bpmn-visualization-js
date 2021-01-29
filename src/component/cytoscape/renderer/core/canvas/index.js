/**
 * Copyright 2020 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global OffscreenCanvas */

import * as util from 'cytoscape/src/util';
import * as is from 'cytoscape/src/is';
import * as math from 'cytoscape/src/math';
import ElementTextureCache from './ele-texture-cache';
import LayeredTextureCache from './layered-texture-cache';

import arrowShapes from './arrow-shapes';
import drawingElements from './drawing-elements';
import drawingEdges from './drawing-edges';
import drawingImages from './drawing-images';
import drawingLabelText from './drawing-label-text';
import drawingNodes from './drawing-nodes';
import drawingRedraw from './drawing-redraw';
import drawingShapes from './drawing-shapes';
import exportImage from './export-image';
import nodeShapes from './node-shapes';

var CR = CanvasRenderer;
var CRp = CanvasRenderer.prototype;

CRp.CANVAS_LAYERS = 3;
//
CRp.SELECT_BOX = 0;
CRp.DRAG = 1;
CRp.NODE = 2;

CRp.BUFFER_COUNT = 3;
//
CRp.TEXTURE_BUFFER = 0;
CRp.MOTIONBLUR_BUFFER_NODE = 1;
CRp.MOTIONBLUR_BUFFER_DRAG = 2;

function CanvasRenderer(options) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  var r = this;

  // eslint-disable-next-line no-console
  console.log(this.nodeShapes);

  // TODO: this is needed to extend property from BaseRenderer (the property is set while creating the extension Renderer 'custom')
  this.nodeShapes['new-shape'] = {
    renderer: this,

    name: 'new-shape',

    points: math.generateUnitNgonPointsFitToSquare(4, 0),

    draw: function (context, centerX, centerY, width, height) {
      this.renderer.nodeShapeImpl(this.name, context, centerX, centerY, width, height);
    },

    intersectLine: function (nodeX, nodeY, width, height, x, y, padding) {
      // use two fixed t values for the bezier curve approximation

      var t0 = 0.15;
      var t1 = 0.5;
      var t2 = 0.85;

      var bPts = this.generateBarrelBezierPts(width + 2 * padding, height + 2 * padding, nodeX, nodeY);

      var approximateBarrelCurvePts = pts => {
        // approximate curve pts based on the two t values
        var m0 = math.qbezierPtAt({ x: pts[0], y: pts[1] }, { x: pts[2], y: pts[3] }, { x: pts[4], y: pts[5] }, t0);
        var m1 = math.qbezierPtAt({ x: pts[0], y: pts[1] }, { x: pts[2], y: pts[3] }, { x: pts[4], y: pts[5] }, t1);
        var m2 = math.qbezierPtAt({ x: pts[0], y: pts[1] }, { x: pts[2], y: pts[3] }, { x: pts[4], y: pts[5] }, t2);

        return [pts[0], pts[1], m0.x, m0.y, m1.x, m1.y, m2.x, m2.y, pts[4], pts[5]];
      };

      var pts = [].concat(
        approximateBarrelCurvePts(bPts.topLeft),
        approximateBarrelCurvePts(bPts.topRight),
        approximateBarrelCurvePts(bPts.bottomRight),
        approximateBarrelCurvePts(bPts.bottomLeft),
      );

      return math.polygonIntersectLine(x, y, pts, nodeX, nodeY);
    },

    generateBarrelBezierPts: function (width, height, centerX, centerY) {
      var hh = height / 2;
      var hw = width / 2;
      var xBegin = centerX - hw;
      var xEnd = centerX + hw;
      var yBegin = centerY - hh;
      var yEnd = centerY + hh;

      var curveConstants = math.getBarrelCurveConstants(width, height);
      var hOffset = curveConstants.heightOffset;
      var wOffset = curveConstants.widthOffset;
      var ctrlPtXOffset = curveConstants.ctrlPtOffsetPct * width;

      // points are in clockwise order, inner (imaginary) control pt on [4, 5]
      var pts = {
        topLeft: [xBegin, yBegin + hOffset, xBegin + ctrlPtXOffset, yBegin, xBegin + wOffset, yBegin],
        topRight: [xEnd - wOffset, yBegin, xEnd - ctrlPtXOffset, yBegin, xEnd, yBegin + hOffset],
        bottomRight: [xEnd, yEnd - hOffset, xEnd - ctrlPtXOffset, yEnd, xEnd - wOffset, yEnd],
        bottomLeft: [xBegin + wOffset, yEnd, xBegin + ctrlPtXOffset, yEnd, xBegin, yEnd - hOffset],
      };

      pts.topLeft.isTop = true;
      pts.topRight.isTop = true;
      pts.bottomLeft.isBottom = true;
      pts.bottomRight.isBottom = true;

      return pts;
    },

    checkPoint: function (x, y, padding, width, height, centerX, centerY) {
      var curveConstants = math.getBarrelCurveConstants(width, height);
      var hOffset = curveConstants.heightOffset;
      var wOffset = curveConstants.widthOffset;

      // Check hBox
      if (math.pointInsidePolygon(x, y, this.points, centerX, centerY, width, height - 2 * hOffset, [0, -1], padding)) {
        return true;
      }

      // Check vBox
      if (math.pointInsidePolygon(x, y, this.points, centerX, centerY, width - 2 * wOffset, height, [0, -1], padding)) {
        return true;
      }

      var barrelCurvePts = this.generateBarrelBezierPts(width, height, centerX, centerY);

      var getCurveT = function (x, y, curvePts) {
        var x0 = curvePts[4];
        var x1 = curvePts[2];
        var x2 = curvePts[0];
        var y0 = curvePts[5];
        // var y1 = curvePts[ 3 ];
        var y2 = curvePts[1];

        var xMin = Math.min(x0, x2);
        var xMax = Math.max(x0, x2);
        var yMin = Math.min(y0, y2);
        var yMax = Math.max(y0, y2);

        if (xMin <= x && x <= xMax && yMin <= y && y <= yMax) {
          var coeff = math.bezierPtsToQuadCoeff(x0, x1, x2);
          var roots = math.solveQuadratic(coeff[0], coeff[1], coeff[2], x);

          var validRoots = roots.filter(function (r) {
            return 0 <= r && r <= 1;
          });

          if (validRoots.length > 0) {
            return validRoots[0];
          }
        }
        return null;
      };

      var curveRegions = Object.keys(barrelCurvePts);
      for (var i = 0; i < curveRegions.length; i++) {
        var corner = curveRegions[i];
        var cornerPts = barrelCurvePts[corner];
        var t = getCurveT(x, y, cornerPts);

        if (t == null) {
          continue;
        }

        var y0 = cornerPts[5];
        var y1 = cornerPts[3];
        var y2 = cornerPts[1];
        var bezY = math.qbezierAt(y0, y1, y2, t);

        if (cornerPts.isTop && bezY <= y) {
          return true;
        }
        if (cornerPts.isBottom && y <= bezY) {
          return true;
        }
      }
      return false;
    },
  };

  // eslint-disable-next-line no-console
  console.log(this.nodeShapes);

  r.data = {
    canvases: new Array(CRp.CANVAS_LAYERS),
    contexts: new Array(CRp.CANVAS_LAYERS),
    canvasNeedsRedraw: new Array(CRp.CANVAS_LAYERS),

    bufferCanvases: new Array(CRp.BUFFER_COUNT),
    bufferContexts: new Array(CRp.CANVAS_LAYERS),
  };

  var tapHlOffAttr = '-webkit-tap-highlight-color';
  var tapHlOffStyle = 'rgba(0,0,0,0)';
  r.data.canvasContainer = document.createElement('div'); // eslint-disable-line no-undef
  var containerStyle = r.data.canvasContainer.style;
  r.data.canvasContainer.style[tapHlOffAttr] = tapHlOffStyle;
  containerStyle.position = 'relative';
  containerStyle.zIndex = '0';
  containerStyle.overflow = 'hidden';

  var container = options.cy.container();
  container.appendChild(r.data.canvasContainer);
  container.style[tapHlOffAttr] = tapHlOffStyle;

  var styleMap = {
    '-webkit-user-select': 'none',
    '-moz-user-select': '-moz-none',
    'user-select': 'none',
    '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
    'outline-style': 'none',
  };

  if (is.ms()) {
    styleMap['-ms-touch-action'] = 'none';
    styleMap['touch-action'] = 'none';
  }

  for (var i = 0; i < CRp.CANVAS_LAYERS; i++) {
    var canvas = (r.data.canvases[i] = document.createElement('canvas')); // eslint-disable-line no-undef
    r.data.contexts[i] = canvas.getContext('2d');
    Object.keys(styleMap).forEach(k => {
      canvas.style[k] = styleMap[k];
    });
    canvas.style.position = 'absolute';
    canvas.setAttribute('data-id', 'layer' + i);
    canvas.style.zIndex = String(CRp.CANVAS_LAYERS - i);
    r.data.canvasContainer.appendChild(canvas);

    r.data.canvasNeedsRedraw[i] = false;
  }
  r.data.topCanvas = r.data.canvases[0];

  r.data.canvases[CRp.NODE].setAttribute('data-id', 'layer' + CRp.NODE + '-node');
  r.data.canvases[CRp.SELECT_BOX].setAttribute('data-id', 'layer' + CRp.SELECT_BOX + '-selectbox');
  r.data.canvases[CRp.DRAG].setAttribute('data-id', 'layer' + CRp.DRAG + '-drag');

  for (var i = 0; i < CRp.BUFFER_COUNT; i++) {
    r.data.bufferCanvases[i] = document.createElement('canvas'); // eslint-disable-line no-undef
    r.data.bufferContexts[i] = r.data.bufferCanvases[i].getContext('2d');
    r.data.bufferCanvases[i].style.position = 'absolute';
    r.data.bufferCanvases[i].setAttribute('data-id', 'buffer' + i);
    r.data.bufferCanvases[i].style.zIndex = String(-i - 1);
    r.data.bufferCanvases[i].style.visibility = 'hidden';
    //r.data.canvasContainer.appendChild(r.data.bufferCanvases[i]);
  }

  r.pathsEnabled = true;

  let emptyBb = math.makeBoundingBox();

  let getBoxCenter = bb => ({ x: (bb.x1 + bb.x2) / 2, y: (bb.y1 + bb.y2) / 2 });

  let getCenterOffset = bb => ({ x: -bb.w / 2, y: -bb.h / 2 });

  let backgroundTimestampHasChanged = ele => {
    let _p = ele[0]._private;
    let same = _p.oldBackgroundTimestamp === _p.backgroundTimestamp;

    return !same;
  };

  let getStyleKey = ele => ele[0]._private.nodeKey;
  let getLabelKey = ele => ele[0]._private.labelStyleKey;
  let getSourceLabelKey = ele => ele[0]._private.sourceLabelStyleKey;
  let getTargetLabelKey = ele => ele[0]._private.targetLabelStyleKey;

  let drawElement = (context, ele, bb, scaledLabelShown, useEleOpacity) => r.drawElement(context, ele, bb, false, false, useEleOpacity);
  let drawLabel = (context, ele, bb, scaledLabelShown, useEleOpacity) => r.drawElementText(context, ele, bb, scaledLabelShown, 'main', useEleOpacity);
  let drawSourceLabel = (context, ele, bb, scaledLabelShown, useEleOpacity) => r.drawElementText(context, ele, bb, scaledLabelShown, 'source', useEleOpacity);
  let drawTargetLabel = (context, ele, bb, scaledLabelShown, useEleOpacity) => r.drawElementText(context, ele, bb, scaledLabelShown, 'target', useEleOpacity);

  let getElementBox = ele => {
    ele.boundingBox();
    return ele[0]._private.bodyBounds;
  };
  let getLabelBox = ele => {
    ele.boundingBox();
    return ele[0]._private.labelBounds.main || emptyBb;
  };
  let getSourceLabelBox = ele => {
    ele.boundingBox();
    return ele[0]._private.labelBounds.source || emptyBb;
  };
  let getTargetLabelBox = ele => {
    ele.boundingBox();
    return ele[0]._private.labelBounds.target || emptyBb;
  };

  let isLabelVisibleAtScale = (ele, scaledLabelShown) => scaledLabelShown;

  let getElementRotationPoint = ele => getBoxCenter(getElementBox(ele));

  let addTextMargin = (prefix, pt, ele) => {
    let pre = prefix ? prefix + '-' : '';

    return {
      x: pt.x + ele.pstyle(pre + 'text-margin-x').pfValue,
      y: pt.y + ele.pstyle(pre + 'text-margin-y').pfValue,
    };
  };

  let getRsPt = (ele, x, y) => {
    let rs = ele[0]._private.rscratch;

    return { x: rs[x], y: rs[y] };
  };

  let getLabelRotationPoint = ele => addTextMargin('', getRsPt(ele, 'labelX', 'labelY'), ele);
  let getSourceLabelRotationPoint = ele => addTextMargin('source', getRsPt(ele, 'sourceLabelX', 'sourceLabelY'), ele);
  let getTargetLabelRotationPoint = ele => addTextMargin('target', getRsPt(ele, 'targetLabelX', 'targetLabelY'), ele);

  let getElementRotationOffset = ele => getCenterOffset(getElementBox(ele));
  let getSourceLabelRotationOffset = ele => getCenterOffset(getSourceLabelBox(ele));
  let getTargetLabelRotationOffset = ele => getCenterOffset(getTargetLabelBox(ele));

  let getLabelRotationOffset = ele => {
    let bb = getLabelBox(ele);
    let p = getCenterOffset(getLabelBox(ele));

    if (ele.isNode()) {
      switch (ele.pstyle('text-halign').value) {
        case 'left':
          p.x = -bb.w;
          break;
        case 'right':
          p.x = 0;
          break;
      }

      switch (ele.pstyle('text-valign').value) {
        case 'top':
          p.y = -bb.h;
          break;
        case 'bottom':
          p.y = 0;
          break;
      }
    }

    return p;
  };

  let eleTxrCache = (r.data.eleTxrCache = new ElementTextureCache(r, {
    getKey: getStyleKey,
    doesEleInvalidateKey: backgroundTimestampHasChanged,
    drawElement: drawElement,
    getBoundingBox: getElementBox,
    getRotationPoint: getElementRotationPoint,
    getRotationOffset: getElementRotationOffset,
    allowEdgeTxrCaching: false,
    allowParentTxrCaching: false,
  }));

  let lblTxrCache = (r.data.lblTxrCache = new ElementTextureCache(r, {
    getKey: getLabelKey,
    drawElement: drawLabel,
    getBoundingBox: getLabelBox,
    getRotationPoint: getLabelRotationPoint,
    getRotationOffset: getLabelRotationOffset,
    isVisible: isLabelVisibleAtScale,
  }));

  let slbTxrCache = (r.data.slbTxrCache = new ElementTextureCache(r, {
    getKey: getSourceLabelKey,
    drawElement: drawSourceLabel,
    getBoundingBox: getSourceLabelBox,
    getRotationPoint: getSourceLabelRotationPoint,
    getRotationOffset: getSourceLabelRotationOffset,
    isVisible: isLabelVisibleAtScale,
  }));

  let tlbTxrCache = (r.data.tlbTxrCache = new ElementTextureCache(r, {
    getKey: getTargetLabelKey,
    drawElement: drawTargetLabel,
    getBoundingBox: getTargetLabelBox,
    getRotationPoint: getTargetLabelRotationPoint,
    getRotationOffset: getTargetLabelRotationOffset,
    isVisible: isLabelVisibleAtScale,
  }));

  let lyrTxrCache = (r.data.lyrTxrCache = new LayeredTextureCache(r));

  r.onUpdateEleCalcs(function invalidateTextureCaches(willDraw, eles) {
    // each cache should check for sub-key diff to see that the update affects that cache particularly
    eleTxrCache.invalidateElements(eles);
    lblTxrCache.invalidateElements(eles);
    slbTxrCache.invalidateElements(eles);
    tlbTxrCache.invalidateElements(eles);

    // any change invalidates the layers
    lyrTxrCache.invalidateElements(eles);

    // update the old bg timestamp so diffs can be done in the ele txr caches
    for (let i = 0; i < eles.length; i++) {
      let _p = eles[i]._private;

      _p.oldBackgroundTimestamp = _p.backgroundTimestamp;
    }
  });

  let refineInLayers = reqs => {
    for (var i = 0; i < reqs.length; i++) {
      lyrTxrCache.enqueueElementRefinement(reqs[i].ele);
    }
  };

  eleTxrCache.onDequeue(refineInLayers);
  lblTxrCache.onDequeue(refineInLayers);
  slbTxrCache.onDequeue(refineInLayers);
  tlbTxrCache.onDequeue(refineInLayers);
}

CRp.redrawHint = function (group, bool) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  var r = this;

  switch (group) {
    case 'eles':
      r.data.canvasNeedsRedraw[CRp.NODE] = bool;
      break;
    case 'drag':
      r.data.canvasNeedsRedraw[CRp.DRAG] = bool;
      break;
    case 'select':
      r.data.canvasNeedsRedraw[CRp.SELECT_BOX] = bool;
      break;
  }
};

// whether to use Path2D caching for drawing
var pathsImpld = typeof Path2D !== 'undefined';

CRp.path2dEnabled = function (on) {
  if (on === undefined) {
    return this.pathsEnabled;
  }

  this.pathsEnabled = on ? true : false;
};

CRp.usePaths = function () {
  return pathsImpld && this.pathsEnabled;
};

CRp.setImgSmoothing = function (context, bool) {
  if (context.imageSmoothingEnabled != null) {
    context.imageSmoothingEnabled = bool;
  } else {
    context.webkitImageSmoothingEnabled = bool;
    context.mozImageSmoothingEnabled = bool;
    context.msImageSmoothingEnabled = bool;
  }
};

CRp.getImgSmoothing = function (context) {
  if (context.imageSmoothingEnabled != null) {
    return context.imageSmoothingEnabled;
  } else {
    return context.webkitImageSmoothingEnabled || context.mozImageSmoothingEnabled || context.msImageSmoothingEnabled;
  }
};

CRp.makeOffscreenCanvas = function (width, height) {
  let canvas;

  if (typeof OffscreenCanvas !== typeof undefined) {
    canvas = new OffscreenCanvas(width, height);
  } else {
    canvas = document.createElement('canvas'); // eslint-disable-line no-undef
    canvas.width = width;
    canvas.height = height;
  }

  return canvas;
};

[arrowShapes, drawingElements, drawingEdges, drawingImages, drawingLabelText, drawingNodes, drawingRedraw, drawingShapes, exportImage, nodeShapes].forEach(function (props) {
  util.extend(CRp, props);
});

export default CR;
