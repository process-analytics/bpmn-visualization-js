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
import cytoscape, { NodeSingular } from 'cytoscape';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import * as math from 'cytoscape/src/math.js';
import customRenderer from './cytoscape/renderer/index';
import { newBpmnParser } from './parser/BpmnParser';

export default class CytoBpmnVisualization {
  constructor(readonly container: string) {
    document.getElementById(container);
  }

  // private extendCytoscape(cy: cytoscape.Core): cytoscape.Core {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   const CanvasRenderer = cy.extension('renderer', 'canvas');
  //   CanvasRenderer.prototype.nodeShapeImpl = function (name: any, context: any, centerX: any, centerY: any, width: any, height: any, points: any) {
  //     // eslint-disable-next-line no-console
  //     console.log('____________________________________EXTENDED___________________________________');
  //     switch (name) {
  //       case 'ellipse':
  //         return this.drawEllipsePath(context, centerX, centerY, width, height);
  //       case 'polygon':
  //         return this.drawPolygonPath(context, centerX, centerY, width, height, points);
  //       case 'round-polygon':
  //         return this.drawRoundPolygonPath(context, centerX, centerY, width, height, points);
  //       case 'roundrectangle':
  //       case 'round-rectangle':
  //         return this.drawRoundRectanglePath(context, centerX, centerY, width, height);
  //       case 'cutrectangle':
  //       case 'cut-rectangle':
  //         return this.drawCutRectanglePath(context, centerX, centerY, width, height);
  //       case 'bottomroundrectangle':
  //       case 'bottom-round-rectangle':
  //         return this.drawBottomRoundRectanglePath(context, centerX, centerY, width, height);
  //       case 'barrel':
  //         return this.drawBarrelPath(context, centerX, centerY, width, height);
  //       case 'newShape':
  //         return this.drawBarrelPath(context, centerX, centerY, width, height);
  //     }
  //   };
  //   // CanvasRenderer.prototype.nodeShapes['newShape'] = {
  //   //   renderer: this,
  //   //   name: 'barrel',
  //   //   points: math.generateUnitNgonPointsFitToSquare(4, 0),
  //   //   draw: function (context: any, centerX: any, centerY: any, width: any, height: any) {
  //   //     this.renderer.nodeShapeImpl(this.name, context, centerX, centerY, width, height);
  //   //   },
  //   //   intersectLine: function (nodeX: any, nodeY: any, width: number, height: number, x: any, y: any, padding: number) {
  //   //     // use two fixed t values for the bezier curve approximation
  //   //
  //   //     const t0 = 0.15;
  //   //     const t1 = 0.5;
  //   //     const t2 = 0.85;
  //   //
  //   //     const bPts = this.generateBarrelBezierPts(width + 2 * padding, height + 2 * padding, nodeX, nodeY);
  //   //
  //   //     const approximateBarrelCurvePts = (pts: number[]) => {
  //   //       // approximate curve pts based on the two t values
  //   //       const m0 = math.qbezierPtAt({ x: pts[0], y: pts[1] }, { x: pts[2], y: pts[3] }, { x: pts[4], y: pts[5] }, t0);
  //   //       const m1 = math.qbezierPtAt({ x: pts[0], y: pts[1] }, { x: pts[2], y: pts[3] }, { x: pts[4], y: pts[5] }, t1);
  //   //       const m2 = math.qbezierPtAt({ x: pts[0], y: pts[1] }, { x: pts[2], y: pts[3] }, { x: pts[4], y: pts[5] }, t2);
  //   //
  //   //       return [pts[0], pts[1], m0.x, m0.y, m1.x, m1.y, m2.x, m2.y, pts[4], pts[5]];
  //   //     };
  //   //
  //   //     const pts = [].concat(
  //   //       approximateBarrelCurvePts(bPts.topLeft),
  //   //       approximateBarrelCurvePts(bPts.topRight),
  //   //       approximateBarrelCurvePts(bPts.bottomRight),
  //   //       approximateBarrelCurvePts(bPts.bottomLeft),
  //   //     );
  //   //
  //   //     return math.polygonIntersectLine(x, y, pts, nodeX, nodeY);
  //   //   },
  //   //
  //   //   generateBarrelBezierPts: function (width: number, height: number, centerX: number, centerY: number) {
  //   //     const hh = height / 2;
  //   //     const hw = width / 2;
  //   //     const xBegin = centerX - hw;
  //   //     const xEnd = centerX + hw;
  //   //     const yBegin = centerY - hh;
  //   //     const yEnd = centerY + hh;
  //   //
  //   //     const curveConstants = math.getBarrelCurveConstants(width, height);
  //   //     const hOffset = curveConstants.heightOffset;
  //   //     const wOffset = curveConstants.widthOffset;
  //   //     const ctrlPtXOffset = curveConstants.ctrlPtOffsetPct * width;
  //   //
  //   //     // points are in clockwise order, inner (imaginary) control pt on [4, 5]
  //   //     const pts = {
  //   //       topLeft: [xBegin, yBegin + hOffset, xBegin + ctrlPtXOffset, yBegin, xBegin + wOffset, yBegin],
  //   //       topRight: [xEnd - wOffset, yBegin, xEnd - ctrlPtXOffset, yBegin, xEnd, yBegin + hOffset],
  //   //       bottomRight: [xEnd, yEnd - hOffset, xEnd - ctrlPtXOffset, yEnd, xEnd - wOffset, yEnd],
  //   //       bottomLeft: [xBegin + wOffset, yEnd, xBegin + ctrlPtXOffset, yEnd, xBegin, yEnd - hOffset],
  //   //     };
  //   //
  //   //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   //     // @ts-ignore
  //   //     pts.topLeft.isTop = true;
  //   //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   //     // @ts-ignore
  //   //     pts.topRight.isTop = true;
  //   //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   //     // @ts-ignore
  //   //     pts.bottomLeft.isBottom = true;
  //   //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   //     // @ts-ignore
  //   //     pts.bottomRight.isBottom = true;
  //   //
  //   //     return pts;
  //   //   },
  //   //
  //   //   checkPoint: function (x: any, y: number, padding: any, width: number, height: number, centerX: any, centerY: any) {
  //   //     const curveConstants = math.getBarrelCurveConstants(width, height);
  //   //     const hOffset = curveConstants.heightOffset;
  //   //     const wOffset = curveConstants.widthOffset;
  //   //
  //   //     // Check hBox
  //   //     if (math.pointInsidePolygon(x, y, this.points, centerX, centerY, width, height - 2 * hOffset, [0, -1], padding)) {
  //   //       return true;
  //   //     }
  //   //
  //   //     // Check vBox
  //   //     if (math.pointInsidePolygon(x, y, this.points, centerX, centerY, width - 2 * wOffset, height, [0, -1], padding)) {
  //   //       return true;
  //   //     }
  //   //
  //   //     const barrelCurvePts = this.generateBarrelBezierPts(width, height, centerX, centerY);
  //   //
  //   //     const getCurveT = function (x: number, y: number, curvePts: any[]) {
  //   //       const x0 = curvePts[4];
  //   //       const x1 = curvePts[2];
  //   //       const x2 = curvePts[0];
  //   //       const y0 = curvePts[5];
  //   //       // var y1 = curvePts[ 3 ];
  //   //       const y2 = curvePts[1];
  //   //
  //   //       const xMin = Math.min(x0, x2);
  //   //       const xMax = Math.max(x0, x2);
  //   //       const yMin = Math.min(y0, y2);
  //   //       const yMax = Math.max(y0, y2);
  //   //
  //   //       if (xMin <= x && x <= xMax && yMin <= y && y <= yMax) {
  //   //         const coeff = math.bezierPtsToQuadCoeff(x0, x1, x2);
  //   //         const roots = math.solveQuadratic(coeff[0], coeff[1], coeff[2], x);
  //   //
  //   //         const validRoots = roots.filter(function (r: number) {
  //   //           return 0 <= r && r <= 1;
  //   //         });
  //   //
  //   //         if (validRoots.length > 0) {
  //   //           return validRoots[0];
  //   //         }
  //   //       }
  //   //       return null;
  //   //     };
  //   //
  //   //     const curveRegions = Object.keys(barrelCurvePts);
  //   //     for (let i = 0; i < curveRegions.length; i++) {
  //   //       const corner = curveRegions[i];
  //   //       const cornerPts = barrelCurvePts[corner];
  //   //       const t = getCurveT(x, y, cornerPts);
  //   //
  //   //       if (t == null) {
  //   //         continue;
  //   //       }
  //   //
  //   //       const y0 = cornerPts[5];
  //   //       const y1 = cornerPts[3];
  //   //       const y2 = cornerPts[1];
  //   //       const bezY = math.qbezierAt(y0, y1, y2, t);
  //   //
  //   //       if (cornerPts.isTop && bezY <= y) {
  //   //         return true;
  //   //       }
  //   //       if (cornerPts.isBottom && y <= bezY) {
  //   //         return true;
  //   //       }
  //   //     }
  //   //     return false;
  //   //   },
  //   // };
  //   return cy;
  // }

  public load(xml: string) {
    const bpmnModel = newBpmnParser().parse(xml);
    // eslint-disable-next-line no-console
    console.log('____________________BPMN MODEL___________________', bpmnModel);
    // cytoscape.use(anywherePanning);
    cytoscape.use(customRenderer);
    const cy = cytoscape({
      container: document.getElementById('graph-cyto'),
      renderer: {
        name: 'custom',
      },
      style: [
        {
          selector: 'node',
          style: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            shape: function (ele: NodeSingular) {
              // eslint-disable-next-line no-console,prefer-rest-params
              console.log(arguments);
              const kind = ele.data().kind;
              // eslint-disable-next-line no-console,prefer-rest-params
              console.log(kind);
              if (kind && kind.endsWith('Event')) {
                return 'ellipse';
              } else if (kind && kind.indexOf('Gateway') !== -1) {
                return 'new-shape';
              }
              return 'round-rectangle';
            },
            'background-color': '#FFF',
            'background-opacity': 0,
            'border-color': '#000',
            'border-width': '3',
            'border-style': 'solid',
            label: 'data(label)',
            height: 'data(height)',
            width: 'data(width)',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#059',
            'target-arrow-color': '#059',
            'target-arrow-shape': 'triangle',
            'curve-style': 'straight',
          },
        },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
    });

    // const newCy = this.extendCytoscape(cy);
    // // eslint-disable-next-line no-console
    // console.log(newCy);
    cy.add(
      bpmnModel.flowNodes.map(function (flowNode) {
        return {
          group: 'nodes',
          data: {
            id: flowNode.bpmnElement.id,
            label: flowNode.bpmnElement.name,
            kind: flowNode.bpmnElement.kind,
            height: flowNode.bounds.height,
            width: flowNode.bounds.width,
          },
          position: { x: flowNode.bounds.x, y: flowNode.bounds.y },
        };
      }),
    );
    cy.add(
      bpmnModel.edges.map(function (edge) {
        return { group: 'edges', data: { id: edge.id, label: edge.bpmnElement.name, source: edge.bpmnElement.sourceRefId, target: edge.bpmnElement.targetRefId } };
      }),
    );
    // eslint-disable-next-line no-console
    console.log('_______________________CY_____________________', cy);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-console
    console.log('_______________________CY_____________________', cy._private.renderer);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-console
    console.log('_______________________CY_____________________', cy._private.renderer.nodeShapes);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-console
    console.log('_______________________CY_____________________', cy._private.style.properties.shape);

    // TODO: this hack is needed as for any additional style properties there is a check on predefined set of allowed properties @see Style.parseImplWarn
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cy._private.style.properties.shape.type.enums.push('new-shape');

    // cy._private.renderer.nodeShapes.test = function () {
    //
    // };

    // cy.anywherePanning();
    //
    // // An event which is emitted when panning has started.
    // // The second argument is an event for "vmousedown".
    // cy.on('awpanstart', function (evt, evt2) {
    //   // eslint-disable-next-line no-console
    //   console.log('_____PANNING______started');
    // });
    //
    // // An event which is emitted when the cursor has moved during panning.
    // // The second argument is an event for "vmousemove".
    // cy.on('awpanmove', function (evt, evt2) {
    //   // eslint-disable-next-line no-console
    //   console.log('_____PANNING______moving');
    // });
    //
    // // An event which is emitted when the panning has ended.
    // // The second argument is an event for "vmouseup".
    // cy.on('awpanend', function (evt, evt2) {
    //   // eslint-disable-next-line no-console
    //   console.log('_____PANNING______ended');
    // });
  }
}
