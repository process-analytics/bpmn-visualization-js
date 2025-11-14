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

import { BpmnGraph } from './BpmnGraph';
import { registerEdgeMarkers, registerShapes } from './config/register-style-definitions';
import { StyleConfigurator } from './config/StyleConfigurator';

/**
 * Configure the {@link BpmnGraph} graph that can be used by the lib
 * <ul>
 *     <li>styles
 *     <li>shapes
 *     <li>markers
 * @internal
 */
export default class GraphConfigurator {
  private readonly graph: BpmnGraph;

  constructor(container: HTMLElement) {
    this.graph = new BpmnGraph(container);
  }

  configure(): BpmnGraph {
    this.configureGraph();
    new StyleConfigurator(this.graph).configureStyles();
    registerShapes();
    registerEdgeMarkers();
    return this.graph;
  }

  private configureGraph(): void {
    this.graph.setCellsLocked(true);
    this.graph.setCellsSelectable(false);
    this.graph.setEdgeLabelsMovable(false);

    this.graph.options.allowHtmlLabel = true; // required for wrapping

    // To have the boundary event on the border of a task
    this.graph.options.constrainChildrenOnResize = false;
    this.graph.options.extendParentsOnAdd = false;

    // Disable folding for container cells (pool, lane, sub process, call activity) because we don't need it.
    // This also prevents requesting unavailable images (see #185) as we don't override BpmnGraph folding default images.
    this.graph.options.foldingEnabled = false;
  }
}
