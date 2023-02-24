/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/* eslint-disable no-console */

import { mxStyleChange } from 'mxgraph';
import type {
  mxEventObject,
  mxUndoableEdit,
  mxGeometryChange,
  mxChildChange,
  mxCollapseChange,
  mxValueChange,
  mxCurrentRootChange,
  mxTerminalChange,
  mxVisibleChange,
} from 'mxgraph';
import type { Opacity } from './opacity';
import type { Color } from './color';
import { UndoManager } from './undoManager';
import GraphConfigurator from './mxgraph/GraphConfigurator';
import { newBpmnRenderer } from './mxgraph/BpmnRenderer';
import { newBpmnParser } from './parser/BpmnParser';
import type { BpmnGraph } from './mxgraph/BpmnGraph';
import type { GlobalOptions, LoadOptions } from './options';
import type { BpmnElementsRegistry } from './registry';
import { newBpmnElementsRegistry } from './registry/bpmn-elements-registry';
import { BpmnModelRegistry } from './registry/bpmn-model-registry';
import { htmlElement } from './helpers/dom-utils';
import { Navigation } from './navigation';
import { version, type Version } from './version';
import { ensureIsArray } from './helpers/array-utils';
import { mxgraph } from './mxgraph/initializer';
import { ShapeBpmnElementKind } from '../model/bpmn/internal';

// -------------------------- STYLE AT LIB CONFIGURATION --------------------------
type Shadow<C extends string> = {
  /**
   * Defines the color to be used to draw shadows in shapes and windows.
   *
   * @default 'gray'
   */
  color?: Color<C>;

  /**
   * Specifies the x-offset of the shadow.
   *
   * @default 2
   */
  offsetX?: number;

  /**
   * Specifies the y-offset of the shadow.
   *
   * @default 3
   */
  offsetY?: number;

  /**
   * Defines the opacity for shadows.
   *
   * @default 1
   */
  opacity?: Opacity;
};

type Arrow = {
  /**
   * Defines the spacing between the arrow shape and its terminals.
   *
   * @default 0
   */
  spacing?: number;

  /**
   * Defines the width of the arrow shape.
   *
   * @default 30
   */
  width?: number;

  /**
   * Defines the size of the arrowhead in the arrow shape.
   *
   * @default 30
   */
  size?: number;
};

// --------------------------  DYNAMIC STYLE --------------------------

type Label<C extends string> = {
  /**
   * The width of the label if the label position is not 'center'.
   */
  width?: string;

  /**
   * The horizontal label position of vertices.
   * The label align defines the position of the label relative to the cell.
   * ALIGN_LEFT means the entire label bounds is placed completely just to the left of the vertex, ALIGN_RIGHT means adjust to the right and ALIGN_CENTER means the label bounds are vertically aligned with the bounds of the vertex.
   * Note: this value doesn’t affect the positioning of label within the label bounds, to move the label horizontally within the label bounds, use STYLE_ALIGN.
   *
   * @default mxgraph.mxConstants.ALIGN_CENTER
   */
  horizontalPosition?: mxgraph.mxConstants.ALIGN_LEFT | mxgraph.mxConstants.ALIGN_CENTER | mxgraph.mxConstants.ALIGN_RIGHT;

  /**
   * The vertical label position of vertices.
   * The label align defines the position of the label relative to the cell.
   * ALIGN_TOP means the entire label bounds is placed completely just on the top of the vertex, ALIGN_BOTTOM means adjust on the bottom and ALIGN_MIDDLE means the label bounds are horizontally aligned with the bounds of the vertex.
   * Note: this value doesn’t affect the positioning of label within the label bounds, to move the label vertically within the label bounds, use STYLE_VERTICAL_ALIGN.
   *
   * @default mxgraph.mxConstants.ALIGN_MIDDLE
   */
  verticalPosition?: mxgraph.mxConstants.ALIGN_TOP | mxgraph.mxConstants.ALIGN_BOTTOM | mxgraph.mxConstants.ALIGN_MIDDLE;

  /**
   * Possible values are all HTML color names or HEX codes.
   */
  backgroundColor?: Color<C>;

  /**
   * Possible values are all HTML color names or HEX codes.
   */
  borderColor?: Color<C>;

  /**
   * The label padding, i.e. the space between the label border and the label.
   */
  padding?: string;
};

type Spacing = {
  /**
   * The value represents the spacing, in pixels, added to each side of a label in a vertex (style applies to vertices only).
   */
  eachSide?: number;
  /**
   * The value represents the spacing, in pixels, added to the top side of a label in a vertex (style applies to vertices only).
   */
  top?: number;
  /**
   * The value represents the spacing, in pixels, added to the left side of a label in a vertex (style applies to vertices only).
   */
  left?: number;
  /**
   * The value represents the spacing, in pixels, added to the bottom side of a label in a vertex (style applies to vertices only).
   */
  bottom?: number;
  /**
   * The value represents the spacing, in pixels, added to the right side of a label in a vertex (style applies to vertices only).
   */
  right?: number;
};

type Font<C extends string> = {
  color?: Color<C>;
  opacity?: Opacity;
  spacing?: Spacing;

  /**
   *  The type of the value is int (in px).
   */
  size?: number;
  family?: 'Arial' | 'Dialog' | 'Verdana' | 'Times New Roman';
  /**
   *  Default: false
   */
  isBold?: boolean;
  /**
   *  Default: false
   */
  isItalic?: boolean;
  /**
   *  Default: false
   */
  isUnderline?: boolean;
  /**
   *  Default: false
   */
  isStrikeThrough?: boolean;
};

type Fill<C extends string> = {
  /**
   *  Possible values are all HTML color names or HEX codes, as well as special keywords such as ‘swimlane‘, ‘inherit’ to use the color code of a related cell.
   */
  color: Color<C> | 'swimlane';
  opacity?: Opacity;
};

type Stroke<C extends string> = {
  /**
   *  Possible values are all HTML color names or HEX codes, as well as special keywords such as ‘swimlane‘, ‘inherit’ to use the color code of a related cell or ‘none’ for no color.
   */
  color: Color<C> | 'swimlane' | 'none';
  /**
   The type of the value is numeric and the possible range is any non-negative value larger or equal to 1.
   The value defines the stroke width in pixels.
   Note: To hide a stroke use strokeColor 'none'.
   */
  width?: number;
  opacity?: Opacity;

  /**
   * The type of this value is a space separated list of numbers that specify a custom-defined dash pattern.
   * Dash styles are defined in terms of the length of the dash (the drawn part of the stroke) and the length of the space between the dashes.
   * The lengths are relative to the line width: a length of “1” is equal to the line width.
   * This style is only used in the mxConnector shape.
   */
  dashPattern?: string;
};

type Gradient<C extends string> = {
  /**
   *  Possible values are all HTML color names or HEX codes, as well as special keywords such as ‘swimlane‘, ‘inherit’ to use the color code of a related cell.
   *  This is ignored if no fill color is defined.
   */
  color: Color<C> | 'swimlane';
  /**
   * Generally, and by default in mxGraph, gradient painting is done from the value of STYLE_FILLCOLOR to the value of STYLE_GRADIENTCOLOR.
   * Taking the example of DIRECTION_NORTH, this means STYLE_FILLCOLOR color at the bottom of paint pattern and STYLE_GRADIENTCOLOR at top, with a gradient in-between.
   *
   * @default DIRECTION_SOUTH
   */
  direction: mxgraph.mxConstants.DIRECTION_EAST | mxgraph.mxConstants.DIRECTION_WEST | mxgraph.mxConstants.DIRECTION_NORTH | mxgraph.mxConstants.DIRECTION_SOUTH;
};

type Image = {
  /**
   *  This is the path to the image that is to be displayed within the label of a vertex.
   *  Data URLs should use the following format: 'data:image/png,xyz' where xyz is the base64 encoded data (without the “base64”-prefix).
   *  Note: that Data URLs are only supported in modern browsers.
   */
  url?: string;

  /**
   * The type of this value is int.
   * The value is the image width in pixels and must be greater than 0.
   */
  width?: number;

  /**
   * The type of this value is int.
   * The value is the image height in pixels and must be greater than 0.
   */
  height?: number;

  /**
   * The value defines how any image in the vertex label is aligned horizontally within the label bounds of a SHAPE_LABEL shape.
   */
  horizontalAlign?: mxgraph.mxConstants.ALIGN_LEFT | mxgraph.mxConstants.ALIGN_CENTER | mxgraph.mxConstants.ALIGN_RIGHT;

  /**
   * The value defines how any image in the vertex label is aligned vertically within the label bounds of a SHAPE_LABEL shape.
   */
  verticalAlign?: mxgraph.mxConstants.ALIGN_TOP | mxgraph.mxConstants.ALIGN_BOTTOM | mxgraph.mxConstants.ALIGN_MIDDLE;
};

export type ShapeStyleUpdate<C extends string> = {
  font?: Font<C>;
  opacity?: Opacity;
  fill?: Fill<C>;
  stroke?: Stroke<C>;
  gradient?: Gradient<C>;
  label?: Label<C>;

  /**
   *   Possible values are all HTML color names or HEX codes.
   *   This style is only used for POOL and LANE.
   */
  separatorColor: Color<C>;

  withShadow?: boolean;

  image?: Image;

  // TODO: need to move at the lib config
  shadow?: Shadow<C>;
};

export type EdgeStyleUpdate<C extends string> = {
  font?: Font<C>;
  opacity?: Opacity;
  stroke?: Stroke<C>;
  gradient?: Gradient<C>;
  label?: Label<C>;
  withShadow?: boolean;
  image?: Image;

  // TODO: need to move at the lib config
  arrow?: Arrow;
  shadow?: Shadow<C>;
};

/**
 * Let initialize `bpmn-visualization`. It requires at minimum to pass the HTMLElement in the page where the BPMN diagram is rendered.
 * ```javascript
 * const bpmnVisualization = new BpmnVisualization({ container: 'bpmn-container' });
 * ```
 * For more options, see {@link GlobalOptions}
 *
 * @category Initialization & Configuration
 */
export class BpmnVisualization {
  /**
   * Direct access to the `mxGraph` instance that powers `bpmn-visualization`.
   * It is for **advanced users**, so please use the lib API first and access to the `mxGraph` instance only when there is no alternative.
   *
   * **WARN**: subject to change, could be removed or made available in another way.
   *
   * @experimental
   */
  readonly graph: BpmnGraph;

  /**
   * Perform BPMN diagram navigation.
   *
   * **WARN**: subject to change, feedback welcome.
   *
   * @experimental
   * @since 0.24.0
   */
  readonly navigation: Navigation;

  /**
   * Interact with BPMN diagram elements rendered in the page.
   *
   * **WARN**: subject to change, feedback welcome.
   *
   * @experimental
   */
  readonly bpmnElementsRegistry: BpmnElementsRegistry;

  private readonly bpmnModelRegistry: BpmnModelRegistry;

  private readonly undoManager: UndoManager;

  constructor(options: GlobalOptions) {
    // mxgraph configuration
    const configurator = new GraphConfigurator(htmlElement(options?.container));
    this.graph = configurator.configure(options);
    // other configurations
    this.navigation = new Navigation(this.graph);
    this.bpmnModelRegistry = new BpmnModelRegistry();
    this.bpmnElementsRegistry = newBpmnElementsRegistry(this.bpmnModelRegistry, this.graph);

    this.undoManager = new UndoManager();
    this.installUndoHandler();
  }

  /**
   * Load and render the BPMN diagram.
   * @param xml The BPMN content as xml string
   * @param options Let decide how to load the model and render the diagram
   * @throws `Error` when loading fails. This is generally due to a parsing error caused by a malformed BPMN content
   */
  load(xml: string, options?: LoadOptions): void {
    const bpmnModel = newBpmnParser().parse(xml);
    const renderedModel = this.bpmnModelRegistry.load(bpmnModel, options?.modelFilter);
    newBpmnRenderer(this.graph).render(renderedModel, options?.fit);
  }

  getVersion(): Version {
    return version();
  }

  private isMxStyleChange(
    change: mxGeometryChange | mxChildChange | mxStyleChange | mxVisibleChange | mxCollapseChange | mxValueChange | mxTerminalChange | mxCurrentRootChange,
  ): change is mxStyleChange {
    console.log(change);
    console.log(typeof change === 'object'); // true
    // console.log(change instanceof mxgraph.mxStyleChange); // TypeError: invalid 'instanceof' operand (intermediate value).mxStyleChange
    // console.log(change instanceof mxStyleChange); // TypeError: invalid 'instanceof' operand mxStyleChange
    console.log(change.constructor === mxgraph.mxStyleChange); // false
    console.log(change.constructor === mxStyleChange); // false
    console.log(change.constructor); // function mxStyleChange(model, cell, style)
    console.log(change.constructor.name); // mxStyleChange
    return change && typeof change === 'object' && change.constructor.name === 'mxStyleChange';
  }

  private installUndoHandler(): void {
    const listener = mxgraph.mxUtils.bind(this, (sender: object, evt: mxEventObject) => {
      const edit: mxUndoableEdit = evt.getProperty('edit');
      const array: Array<mxGeometryChange | mxChildChange | mxStyleChange | mxVisibleChange | mxCollapseChange | mxValueChange | mxTerminalChange | mxCurrentRootChange> =
        edit.changes;
      const filter = array.filter(change => this.isMxStyleChange(change));
      console.log(filter);

      if (filter.length >= 1) {
        // See https://github.com/jgraph/mxgraph/blob/ff141aab158417bd866e2dfebd06c61d40773cd2/javascript/src/js/view/mxGraph.js#L2114
        this.undoManager.registerUndoable((<mxStyleChange>filter[0]).cell, edit);
      }
    });

    // Mandatory
    this.graph.getModel().addListener(mxgraph.mxEvent.UNDO, listener);
    this.graph.getView().addListener(mxgraph.mxEvent.UNDO, listener);
  }

  updateStyle<C extends string>(bpmnElementIds: string | string[], style: ShapeStyleUpdate<C> | EdgeStyleUpdate<C>): void {
    this.graph.getModel().beginUpdate();
    try {
      ensureIsArray<string>(bpmnElementIds).forEach(bpmnElementId => {
        const cell = this.graph.getModel().getCell(bpmnElementId);
        let cellStyle = cell.getStyle();

        console.log('old style = %s', cellStyle);
        console.log(`---- new style -----`);
        console.log(style);

        cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_OPACITY, style.opacity);
        cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_SHADOW, Number(style.withShadow));

        const font = style.font;
        if (font) {
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTCOLOR, font.color);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTSIZE, font.size);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTFAMILY, font.family);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTSTYLE, BpmnVisualization.getFontStyleValue(font));
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_TEXT_OPACITY, font.opacity);
        }

        const label = style.label;
        if (label) {
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_LABEL_WIDTH, label.width);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_LABEL_POSITION, label.horizontalPosition);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_VERTICAL_LABEL_POSITION, label.verticalPosition);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, label.backgroundColor);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_LABEL_BORDERCOLOR, label.borderColor);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_LABEL_PADDING, label.padding);
        }

        const stroke = style.stroke;
        if (stroke) {
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKECOLOR, stroke.color);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKEWIDTH, stroke.width);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKE_OPACITY, stroke.opacity);

          if (stroke.dashPattern) {
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_DASHED, 1);
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_DASH_PATTERN, stroke.dashPattern);
          }
        }

        const gradient = style.gradient;
        if (gradient) {
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_GRADIENTCOLOR, gradient.color);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_GRADIENT_DIRECTION, gradient.direction);
        }

        const shadow = style.shadow;
        if (shadow) {
          mxgraph.mxConstants.SHADOWCOLOR = shadow.color;
          mxgraph.mxConstants.SHADOW_OFFSET_X = shadow.offsetX;
          mxgraph.mxConstants.SHADOW_OFFSET_Y = shadow.offsetY;
          mxgraph.mxConstants.SHADOW_OPACITY = shadow.opacity;
        }

        const image = style.image;
        if (image) {
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_IMAGE, image.url);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_IMAGE_WIDTH, image.width);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_IMAGE_HEIGHT, image.height);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_IMAGE_ALIGN, image.horizontalAlign);
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_IMAGE_VERTICAL_ALIGN, image.verticalAlign);
        }

        if (this.isShapeStyleUpdate(style)) {
          const fill = style.fill;
          if (fill) {
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FILLCOLOR, fill.color);
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FILL_OPACITY, fill.opacity);

            if (cellStyle.includes(ShapeBpmnElementKind.POOL) || cellStyle.includes(ShapeBpmnElementKind.LANE)) {
              // Possible values are all HTML color names or HEX codes.
              cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_SWIMLANE_FILLCOLOR, fill.color);
            }
          }

          if (cellStyle.includes(ShapeBpmnElementKind.POOL) || cellStyle.includes(ShapeBpmnElementKind.LANE)) {
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_SEPARATORCOLOR, style.separatorColor);
          }

          const spacing = style?.font.spacing;
          if (spacing) {
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_SPACING, spacing.eachSide);
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_SPACING_TOP, spacing.top);
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_SPACING_LEFT, spacing.left);
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_SPACING_BOTTOM, spacing.bottom);
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_SPACING_RIGHT, spacing.right);
          }
        } else {
          const arrow = style.arrow;
          if (arrow) {
            mxgraph.mxConstants.ARROW_SPACING = arrow.spacing;
            mxgraph.mxConstants.ARROW_WIDTH = arrow.width;
            mxgraph.mxConstants.ARROW_SIZE = arrow.size;
          }
        }

        this.graph.model.setStyle(cell, cellStyle);
      });

      // Allow to save the style in a new state
      this.graph.refresh();
    } finally {
      this.graph.getModel().endUpdate();
    }
  }

  private isShapeStyleUpdate<C extends string>(style: ShapeStyleUpdate<C> | EdgeStyleUpdate<C>): style is ShapeStyleUpdate<C> {
    return style && typeof style === 'object' && ('fill' in style || 'stroke' in style || 'strokeWidth' in style);
  }

  // ----------- DUPLICATION WITH StyleComputer class -------------
  private static getFontStyleValue<C extends string>(font: Font<C>): number {
    let value = 0;
    if (font.isBold) {
      value += mxgraph.mxConstants.FONT_BOLD;
    }
    if (font.isItalic) {
      value += mxgraph.mxConstants.FONT_ITALIC;
    }
    if (font.isStrikeThrough) {
      value += mxgraph.mxConstants.FONT_STRIKETHROUGH;
    }
    if (font.isUnderline) {
      value += mxgraph.mxConstants.FONT_UNDERLINE;
    }
    return value;
  }
  // ----------- END OF DUPLICATION -------------

  resetStyle(bpmnElementIds: string | string[]): void {
    this.graph.getModel().beginUpdate();
    try {
      ensureIsArray<string>(bpmnElementIds).forEach(bpmnElementId => {
        this.undoManager.undo(this.graph.getModel().getCell(bpmnElementId));
      });
      // Redraw the graph with the updated style
      this.graph.refresh();
    } finally {
      this.graph.getModel().endUpdate();
    }
  }
}

/* eslint-enable no-console */
