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

export type ShapeStyleUpdate<C extends string> = {
  label?: { color?: Color<C>; fill?: Color<C> };
  fill?: Color<C>;
  opacity?: number;
  stroke?: Color<C>;
  /**
   The type of the value is numeric and the possible range is any non-negative value larger or equal to 1.
   The value defines the stroke width in pixels.
   Note: To hide a stroke use strokeColor none.  Value is “strokeWidth”.
   */
  strokeWidth?: number;

  hover?: {
    filter?: string;
  };
};
export type EdgeStyleUpdate<C extends string> = {
  label?: { color?: Color<C> };
  opacity?: number;
  stroke?: Color<C>;
  /**
  The type of the value is numeric and the possible range is any non-negative value larger or equal to 1.
  The value defines the stroke width in pixels.
  Note: To hide a stroke use strokeColor none.  Value is “strokeWidth”.
  */
  strokeWidth?: number;

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

        cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FONTCOLOR, style.label?.color);
        cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_OPACITY, style.opacity);
        cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKECOLOR, style.stroke);
        cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_STROKEWIDTH, style.strokeWidth);

        if (this.isShapeStyleUpdate(style)) {
          cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_FILLCOLOR, style.fill);

          if (cellStyle.includes(ShapeBpmnElementKind.POOL) || cellStyle.includes(ShapeBpmnElementKind.LANE)) {
            cellStyle = mxgraph.mxUtils.setStyle(cellStyle, mxgraph.mxConstants.STYLE_SWIMLANE_FILLCOLOR, style.fill);
          }

          /*
            label?: {  fill?: string // Zone for lane & pool };
            hover?: {
              filter?: string;
            };
          */
        } else {
          /*
            icon?: {
              fill?: string;
              stroke?: string;
              strokeWidth?: number;
            };

            hover?: {
              strokeWidth?: string;
            };
          */
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
