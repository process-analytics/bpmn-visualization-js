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

export type ShapeStyleUpdate = {
  label?: { color?: string; fill?: string };
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;

  hover?: {
    filter?: string;
  };
};
export type EdgeStyleUpdate = {
  label?: { color?: string };
  arrow?: { fill?: string };
  opacity?: number;
  line?: {
    stroke?: string;
    strokeWidth?: number;
  };
  icon?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };

  hover?: {
    strokeWidth?: string;
  };
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

  constructor(options: GlobalOptions) {
    // mxgraph configuration
    const configurator = new GraphConfigurator(htmlElement(options?.container));
    this.graph = configurator.configure(options);
    // other configurations
    this.navigation = new Navigation(this.graph);
    this.bpmnModelRegistry = new BpmnModelRegistry();
    this.bpmnElementsRegistry = newBpmnElementsRegistry(this.bpmnModelRegistry, this.graph);
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

  // updateStyle(bpmnElementIds: string | string[], style: ShapeStyleUpdate | EdgeStyleUpdate): void {
  updateStyle(bpmnElementIds: string | string[], style: ShapeStyleUpdate): void {
    ensureIsArray<string>(bpmnElementIds).forEach(bpmnElementId => {
      const cell = this.graph.getModel().getCell(bpmnElementId);
      let cellStyle = cell.getStyle();

      /*      label?: {  fill?: string // Zone for lane & pool };

      hover?: {
        filter?: string;
      };*/

      cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTCOLOR, style.label?.color);
      cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FILLCOLOR, style.fill);
      cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKECOLOR, style.stroke);
      cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKEWIDTH, style.strokeWidth);
      cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_OPACITY, style.opacity);

      //this.graph.styleForCellChanged update & return the previous style.

      this.graph.setCellStyle(cellStyle, [cell]);
      this.graph.refresh();
    });
  }

  /*  function updateStyle(state, hover)
  {
    if (hover)
    {
      state.style[mxConstants.STYLE_FILLCOLOR] = '#ff0000';
    }

    // Sets rounded style for both cases since the rounded style
    // is not set in the default style and is therefore inherited
    // once it is set, whereas the above overrides the default value
    state.style[mxConstants.STYLE_ROUNDED] = (hover) ? '1' : '0';
    state.style[mxConstants.STYLE_STROKEWIDTH] = (hover) ? '4' : '1';
    state.style[mxConstants.STYLE_FONTSTYLE] = (hover) ? mxConstants.FONT_BOLD : '0';
  };

  // Changes fill color to red on mouseover
  graph.addMouseListener(
    {
      currentState: null,
      previousStyle: null,
      mouseDown: function(sender, me)
{
  if (this.currentState != null)
{
  this.dragLeave(me.getEvent(), this.currentState);
  this.currentState = null;
}
},
mouseMove: function(sender, me)
{
  if (this.currentState != null && me.getState() == this.currentState)
  {
    return;
  }

  var tmp = graph.view.getState(me.getCell());

  // Ignores everything but vertices
  if (graph.isMouseDown || (tmp != null && !
    graph.getModel().isVertex(tmp.cell)))
  {
    tmp = null;
  }

  if (tmp != this.currentState)
  {
    if (this.currentState != null)
    {
      this.dragLeave(me.getEvent(), this.currentState);
    }

    this.currentState = tmp;

    if (this.currentState != null)
    {
      this.dragEnter(me.getEvent(), this.currentState);
    }
  }
},
mouseUp: function(sender, me) { },
dragEnter: function(evt, state)
{
  if (state != null)
  {
    this.previousStyle = state.style;
    state.style = mxUtils.clone(state.style);
    updateStyle(state, true);
    state.shape.apply(state);
    state.shape.redraw();

    if (state.text != null)
    {
      state.text.apply(state);
      state.text.redraw();
    }
  }
},
dragLeave: function(evt, state)
{
  if (state != null)
  {
    state.style = this.previousStyle;
    updateStyle(state, false);
    state.shape.apply(state);
    state.shape.redraw();

    if (state.text != null)
    {
      state.text.apply(state);
      state.text.redraw();
    }
  }
}
});*/

  resetStyle(bpmnElementIds: string | string[]): void {
    ensureIsArray<string>(bpmnElementIds).forEach(bpmnElementId => {
      /*      const cell = this.graph.getModel().getCell(bpmnElementId);
      const shape = cell.getShape();
      const defaultStyle = mxgraph.mxStyleRegistry.getValue(shape.style.shape);
      const newStyle = mxgraph.mxUtils.clone(defaultStyle);
      cell.setStyle(newStyle);
      cell.refresh();*/

      const cell = this.graph.getModel().getCell(bpmnElementId);

      // Get the default style for the cell
      const defaultStyle = this.graph.getCellStyle(cell);

      // mxgraph.mxUtils.getStyleString(defaultStyle.getStyle());

      // Reset the cell's style
      const style = mxgraph.mxUtils.toString(defaultStyle);
      console.log(style);
      this.graph.setCellStyle(style, [cell]);

      // Redraw the graph with the updated style
      this.graph.refresh();
    });
  }
}
