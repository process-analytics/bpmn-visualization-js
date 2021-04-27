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

import {mxgraph} from '../initializer';
import {mxCellOverlay, mxCellRenderer, mxCellState, mxImageShape, mxShape} from 'mxgraph'; // for types
import {ShapeBpmnElementKind} from '../../../model/bpmn/internal/shape';
import {BoundaryEventShape, CatchIntermediateEventShape, EndEventShape, StartEventShape, ThrowIntermediateEventShape} from '../shape/event-shapes';
import {EventBasedGatewayShape, ExclusiveGatewayShape, InclusiveGatewayShape, ParallelGatewayShape} from '../shape/gateway-shapes';
import {
  BusinessRuleTaskShape,
  CallActivityShape,
  ManualTaskShape,
  ReceiveTaskShape,
  ScriptTaskShape,
  SendTaskShape,
  ServiceTaskShape,
  SubProcessShape,
  TaskShape,
  UserTaskShape,
} from '../shape/activity-shapes';
import {TextAnnotationShape} from '../shape/text-annotation-shapes';
import {MessageFlowIconShape} from '../shape/flow-shapes';
import {StyleIdentifier} from '../StyleUtils';
import {computeAllBpmnClassNames, extractBpmnKindFromStyle} from '../style-helper';
import {MxGraphCustomOverlay} from '../overlay/custom-overlay';

function createOverlayShape(overlay: mxCellOverlay, state: mxCellState, mxCellRenderer: mxCellRenderer): mxShape {
  let overlayShape: mxShape;

  // START bpmn-visualization CUSTOMIZATION
  if (overlay instanceof MxGraphCustomOverlay) {
    const style = overlay.style;
    let shapeConstructor = mxCellRenderer.getShape(style.shape);
    if (shapeConstructor == null) {
      shapeConstructor = mxCellRenderer.defaultVertexShape;
    }
    // @ts-ignore
    overlayShape = new shapeConstructor();
    overlayShape.bounds = new mxgraph.mxRectangle(0, 0, 0, 0);
    overlayShape.fill = style.fill.color;
    overlayShape.fillOpacity = style.fill.opacity;
    overlayShape.stroke = style.stroke.color;
    overlayShape.strokewidth = style.stroke.width;
  } else {
    overlayShape = new mxgraph.mxImageShape(new mxgraph.mxRectangle(0, 0, 0, 0), overlay.image.src);
    (<mxImageShape>overlayShape).preserveImageAspect = false;
  }
  // END bpmn-visualization CUSTOMIZATION

  overlayShape.dialect = state.view.graph.dialect;
  overlayShape.overlay = overlay;

  // The 'initializeOverlay' signature forces us to hardly cast the overlayShape
  mxCellRenderer.initializeOverlay(state, <mxImageShape>overlayShape);
  mxCellRenderer.installCellOverlayListeners(state, overlay, overlayShape);

  if (overlay.cursor != null) {
    overlayShape.node.style.cursor = overlay.cursor;
  }

  // START bpmn-visualization CUSTOMIZATION
  if (overlay instanceof MxGraphCustomOverlay) {
    overlayShape.node.classList.add('overlay-badge');
    overlayShape.node.setAttribute('data-bpmn-id', state.cell.id);
  }
  // END bpmn-visualization CUSTOMIZATION

  return overlayShape;
}

function createOverlayLabel(overlay: mxCellOverlay, overlayShape: mxShape): void {
  // overlay.label
  //     overlayShape.color = style.font.color;
  //     overlayShape.size = style.font.size;
  if (!(overlay instanceof MxGraphCustomOverlay)) {
    return;
  }

  // state.text = new MxText(overlay.label, new mxgraph.mxRectangle(0, 0, 0, 0));


  var graph = state.view.graph;
  var value = overlay.label;
  var wrapping = graph.isWrapping(state.cell);
  var clipping = graph.isLabelClipped(state.cell);
  var isForceHtml = (state.view.graph.isHtmlLabel(state.cell) || (value != null && mxUtils.isNode(value)));
  var dialect = (isForceHtml) ? mxConstants.DIALECT_STRICTHTML : state.view.graph.dialect;
  var overflow = state.style[mxConstants.STYLE_OVERFLOW] || 'visible';

  if (state.text != null && (state.text.wrap != wrapping || state.text.clipped != clipping ||
    state.text.overflow != overflow || state.text.dialect != dialect)) {
    state.text.destroy();
    state.text = null;
  }

  if (state.text == null && value != null && (mxUtils.isNode(value) || value.length > 0)) {
    createLabel(state, value);
  } else if (state.text != null && (value == null || value.length == 0)) {
    state.text.destroy();
    state.text = null;
  }

  if (state.text != null) {
    // Forced is true if the style has changed, so to get the updated
    // result in getLabelBounds we apply the new style to the shape
    if (forced) {
      // Checks if a full repaint is needed
      if (state.text.lastValue != null && this.isTextShapeInvalid(state, state.text)) {
        // Forces a full repaint
        state.text.lastValue = null;
      }

      state.text.resetStyles();
      state.text.apply(state);

      // Special case where value is obtained via hook in graph
      state.text.valign = graph.getVerticalAlign(state);
    }

    var bounds = this.getLabelBounds(state);
    var nextScale = this.getTextScale(state);

    //     overlayShape.color = style.font.color;
    //     overlayShape.size = style.font.size;

    if (forced || state.text.value != value || state.text.isWrapping != wrapping ||
      state.text.overflow != overflow || state.text.isClipping != clipping ||
      state.text.scale != nextScale || state.text.dialect != dialect ||
      state.text.bounds == null || !state.text.bounds.equals(bounds)) {
      state.text.dialect = dialect;
      state.text.value = value;
      state.text.bounds = bounds;
      state.text.scale = nextScale;
      state.text.wrap = wrapping;
      state.text.clipped = clipping;
      state.text.overflow = overflow;

      // Preserves visible state
      var vis = state.text.node.style.visibility;
      state.text.redraw();
      state.text.node.style.visibility = vis;
    }
  }
}

/**
 * Function: createLabel
 *
 * Creates the label for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the label should be created.
 */
function createLabel(state, value) {
  var graph = state.view.graph;
  var isEdge = graph.getModel().isEdge(state.cell);

  if (state.style[mxConstants.STYLE_FONTSIZE] > 0 || state.style[mxConstants.STYLE_FONTSIZE] == null) {
    // Avoids using DOM node for empty labels
    var isForceHtml = (graph.isHtmlLabel(state.cell) || (value != null && mxUtils.isNode(value)));

    state.text = new this.defaultTextShape(value, new mxRectangle(),
      (state.style[mxConstants.STYLE_ALIGN] || mxConstants.ALIGN_CENTER),
      graph.getVerticalAlign(state),
      state.style[mxConstants.STYLE_FONTCOLOR],
      state.style[mxConstants.STYLE_FONTFAMILY],
      state.style[mxConstants.STYLE_FONTSIZE],
      state.style[mxConstants.STYLE_FONTSTYLE],
      state.style[mxConstants.STYLE_SPACING],
      state.style[mxConstants.STYLE_SPACING_TOP],
      state.style[mxConstants.STYLE_SPACING_RIGHT],
      state.style[mxConstants.STYLE_SPACING_BOTTOM],
      state.style[mxConstants.STYLE_SPACING_LEFT],
      state.style[mxConstants.STYLE_HORIZONTAL],
      state.style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR],
      state.style[mxConstants.STYLE_LABEL_BORDERCOLOR],
      graph.isWrapping(state.cell) && graph.isHtmlLabel(state.cell),
      graph.isLabelClipped(state.cell),
      state.style[mxConstants.STYLE_OVERFLOW],
      state.style[mxConstants.STYLE_LABEL_PADDING],
      mxUtils.getValue(state.style, mxConstants.STYLE_TEXT_DIRECTION, mxConstants.DEFAULT_TEXT_DIRECTION));
    state.text.opacity = mxUtils.getValue(state.style, mxConstants.STYLE_TEXT_OPACITY, 100);
    state.text.dialect = (isForceHtml) ? mxConstants.DIALECT_STRICTHTML : state.view.graph.dialect;
    state.text.style = state.style;
    state.text.state = state;
    initializeLabel(state, state.text);

    // Workaround for touch devices routing all events for a mouse gesture
    // (down, move, up) via the initial DOM node. IE additionally redirects
    // the event via the initial DOM node but the event source is the node
    // under the mouse, so we need to check if this is the case and force
    // getCellAt for the subsequent mouseMoves and the final mouseUp.
    var forceGetCell = false;

    var getState = function (evt) {
      var result = state;

      if (mxClient.IS_TOUCH || forceGetCell) {
        var x = mxEvent.getClientX(evt);
        var y = mxEvent.getClientY(evt);

        // Dispatches the drop event to the graph which
        // consumes and executes the source function
        var pt = mxUtils.convertPoint(graph.container, x, y);
        result = graph.view.getState(graph.getCellAt(pt.x, pt.y));
      }

      return result;
    };

    // TODO: Add handling for special touch device gestures
    mxEvent.addGestureListeners(state.text.node,
      mxUtils.bind(this, function (evt) {
        if (this.isLabelEvent(state, evt)) {
          graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, state));
          forceGetCell = graph.dialect != mxConstants.DIALECT_SVG &&
            mxEvent.getSource(evt).nodeName == 'IMG';
        }
      }),
      mxUtils.bind(this, function (evt) {
        if (this.isLabelEvent(state, evt)) {
          graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, getState(evt)));
        }
      }),
      mxUtils.bind(this, function (evt) {
        if (this.isLabelEvent(state, evt)) {
          graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, getState(evt)));
          forceGetCell = false;
        }
      })
    );

    // Uses double click timeout in mxGraph for quirks mode
    if (graph.nativeDblClickEnabled) {
      mxEvent.addListener(state.text.node, 'dblclick',
        mxUtils.bind(this, function (evt) {
          if (this.isLabelEvent(state, evt)) {
            graph.dblClick(evt, state.cell);
            mxEvent.consume(evt);
          }
        })
      );
    }
  }
}


/**
 * Function: initializeLabel
 *
 * Initiailzes the label with a suitable container.
 *
 * Parameters:
 *
 * state - <mxCellState> whose label should be initialized.
 */
function initializeLabel(state, shape) {
  if (mxClient.IS_SVG && mxClient.NO_FO && shape.dialect != mxConstants.DIALECT_SVG) {
    shape.init(state.view.graph.container);
  } else {
    shape.init(state.view.getDrawPane());
  }
}

/**
 * Function: getLabelBounds
 *
 * Returns the bounds to be used to draw the label of the given state.
 *
 * Parameters:
 *
 * state - <mxCellState> whose label bounds should be returned.
 */
function getLabelBounds(state) {
  var graph = state.view.graph;
  var scale = state.view.scale;
  var isEdge = graph.getModel().isEdge(state.cell);
  var bounds = new mxRectangle(state.absoluteOffset.x, state.absoluteOffset.y);

  if (isEdge) {
    var spacing = state.text.getSpacing();
    bounds.x += spacing.x * scale;
    bounds.y += spacing.y * scale;

    var geo = graph.getCellGeometry(state.cell);

    if (geo != null) {
      bounds.width = Math.max(0, geo.width * scale);
      bounds.height = Math.max(0, geo.height * scale);
    }
  } else {
    // Inverts label position
    if (state.text.isPaintBoundsInverted()) {
      var tmp = bounds.x;
      bounds.x = bounds.y;
      bounds.y = tmp;
    }

    bounds.x += state.x;
    bounds.y += state.y;

    // Minimum of 1 fixes alignment bug in HTML labels
    bounds.width = Math.max(1, state.width);
    bounds.height = Math.max(1, state.height);
  }

  if (state.text.isPaintBoundsInverted()) {
    // Rotates around center of state
    var t = (state.width - state.height) / 2;
    bounds.x += t;
    bounds.y -= t;
    var tmp = bounds.width;
    bounds.width = bounds.height;
    bounds.height = tmp;
  }

  // Shape can modify its label bounds
  if (state.shape != null) {
    var hpos = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
    var vpos = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);

    if (hpos == mxConstants.ALIGN_CENTER && vpos == mxConstants.ALIGN_MIDDLE) {
      bounds = state.shape.getLabelBounds(bounds);
    }
  }

  // Label width style overrides actual label width
  var lw = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_WIDTH, null);

  if (lw != null) {
    bounds.width = parseFloat(lw) * scale;
  }

  if (!isEdge) {
    this.rotateLabelBounds(state, bounds);
  }

  return bounds;
}

/**
 * Function: rotateLabelBounds
 *
 * Adds the shape rotation to the given label bounds and
 * applies the alignment and offsets.
 *
 * Parameters:
 *
 * state - <mxCellState> whose label bounds should be rotated.
 * bounds - <mxRectangle> the rectangle to be rotated.
 */
function rotateLabelBounds (state, bounds)
{
  bounds.y -= state.text.margin.y * bounds.height;
  bounds.x -= state.text.margin.x * bounds.width;

  if (!this.legacySpacing || (state.style[mxConstants.STYLE_OVERFLOW] != 'fill' && state.style[mxConstants.STYLE_OVERFLOW] != 'width'))
  {
    var s = state.view.scale;
    var spacing = state.text.getSpacing();
    bounds.x += spacing.x * s;
    bounds.y += spacing.y * s;

    var hpos = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
    var vpos = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
    var lw = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_WIDTH, null);

    bounds.width = Math.max(0, bounds.width - ((hpos == mxConstants.ALIGN_CENTER && lw == null) ? (state.text.spacingLeft * s + state.text.spacingRight * s) : 0));
    bounds.height = Math.max(0, bounds.height - ((vpos == mxConstants.ALIGN_MIDDLE) ? (state.text.spacingTop * s + state.text.spacingBottom * s) : 0));
  }

  var theta = state.text.getTextRotation();

  // Only needed if rotated around another center
  if (theta != 0 && state != null && state.view.graph.model.isVertex(state.cell))
  {
    var cx = state.getCenterX();
    var cy = state.getCenterY();

    if (bounds.x != cx || bounds.y != cy)
    {
      var rad = theta * (Math.PI / 180);
      var pt = mxUtils.getRotatedPoint(new mxPoint(bounds.x, bounds.y),
        Math.cos(rad), Math.sin(rad), new mxPoint(cx, cy));

      bounds.x = pt.x;
      bounds.y = pt.y;
    }
  }
}


mxCellRenderer.prototype.destroy = function(state)
{
  if (state.shape != null)
  {
    if (state.text != null)
    {
      state.text.destroy();
      state.text = null;
    }

    if (state.overlays != null)
    {
      state.overlays.visit(function(id, shape)
      {
        shape.destroy();
      });

      state.overlays = null;
    }

    if (state.control != null)
    {
      state.control.destroy();
      state.control = null;
    }

    state.shape.destroy();
    state.shape = null;
  }
};


/**
 * @internal
 */
export default class ShapeConfigurator {
  public configureShapes(): void {
    this.initMxShapePrototype();
    this.initMxCellRendererCreateCellOverlays();
    this.registerShapes();
  }

  private registerShapes(): void {
    // events
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_END, EndEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_START, StartEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ThrowIntermediateEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, CatchIntermediateEventShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_BOUNDARY, BoundaryEventShape);
    // gateways
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_EVENT_BASED, EventBasedGatewayShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, ExclusiveGatewayShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_INCLUSIVE, InclusiveGatewayShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_PARALLEL, ParallelGatewayShape);
    // activities
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.SUB_PROCESS, SubProcessShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.CALL_ACTIVITY, CallActivityShape);
    // tasks
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK, TaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SERVICE, ServiceTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_USER, UserTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_RECEIVE, ReceiveTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SEND, SendTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_MANUAL, ManualTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SCRIPT, ScriptTaskShape);
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_BUSINESS_RULE, BusinessRuleTaskShape);
    // artifacts
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.TEXT_ANNOTATION, TextAnnotationShape);

    // shapes for flows
    mxgraph.mxCellRenderer.registerShape(StyleIdentifier.BPMN_STYLE_MESSAGE_FLOW_ICON, MessageFlowIconShape);
  }

  private initMxShapePrototype(): void {
    // The following is copied from the mxgraph mxShape implementation then converted to TypeScript and enriched for bpmn-visualization
    // It is needed for adding the custom attributes that permits identification of the BPMN elements in the DOM
    mxgraph.mxShape.prototype.createSvgCanvas = function () {
      const canvas = new mxgraph.mxSvgCanvas2D(this.node, false);
      canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
      canvas.pointerEventsValue = this.svgPointerEvents;
      // TODO remove this commented code (has been removed in mxgraph@4.1.1
      //((canvas as unknown) as mxgraph.mxSvgCanvas2D).blockImagePointerEvents = isFF;
      const off = this.getSvgScreenOffset();

      if (off != 0) {
        this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
      } else {
        this.node.removeAttribute('transform');
      }

      // START bpmn-visualization CUSTOMIZATION
      // add attributes to be able to identify elements in DOM
      if (this.state && this.state.cell) {
        // 'this.state.style' = the style definition associated with the cell
        // 'this.state.cell.style' = the style applied to the cell: 1st element: style name = bpmn shape name
        const cell = this.state.cell;
        // dialect = strictHtml is set means that current node holds an html label
        let allBpmnClassNames = computeAllBpmnClassNames(extractBpmnKindFromStyle(cell), this.dialect === mxgraph.mxConstants.DIALECT_STRICTHTML);
        const extraCssClasses = this.state.style[StyleIdentifier.BPMN_STYLE_EXTRA_CSS_CLASSES];
        if (extraCssClasses) {
          allBpmnClassNames = allBpmnClassNames.concat(extraCssClasses);
        }

        this.node.setAttribute('class', allBpmnClassNames.join(' '));
        this.node.setAttribute('data-bpmn-id', this.state.cell.id);
      }
      // END bpmn-visualization CUSTOMIZATION
      canvas.minStrokeWidth = this.minSvgStrokeWidth;

      if (!this.antiAlias) {
        // Rounds all numbers in the SVG output to integers
        canvas.format = function (value: string) {
          return Math.round(parseFloat(value));
        };
      }

      return canvas;
    };
  }

  private initMxCellRendererCreateCellOverlays(): void {
    mxgraph.mxCellRenderer.prototype.createCellOverlays = function (state: mxCellState) {
      const graph = state.view.graph;
      const overlays = graph.getCellOverlays(state.cell);
      let dict = null;

      if (overlays != null) {
        dict = new mxgraph.mxDictionary<mxShape>();

        for (let currentOverlay of overlays) {
          const shape = (state.overlays != null) ? state.overlays.remove(currentOverlay) : null;
          if (shape != null) {
            dict.put(currentOverlay, shape);
            continue;
          }
          const overlayShape = createOverlayShape(currentOverlay, state, this);
          dict.put(currentOverlay, overlayShape);

          // START bpmn-visualization CUSTOMIZATION
          if (overlayShape != null) {
            createOverlayLabel(currentOverlay, overlayShape);
          }
          // END bpmn-visualization CUSTOMIZATION
        }
      }

      // Removes unused
      if (state.overlays != null) {
        state.overlays.visit(function (id: string, shape: mxShape) {
          shape.destroy();
        });
      }

      state.overlays = dict;
    };
  }
}
