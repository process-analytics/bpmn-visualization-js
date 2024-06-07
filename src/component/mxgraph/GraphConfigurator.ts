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

import type { GlobalOptions } from '../options';
import type { mxMouseEvent } from 'mxgraph';

import { BpmnGraph } from './BpmnGraph';
import MarkerConfigurator from './config/MarkerConfigurator';
import ShapeConfigurator from './config/ShapeConfigurator';
import { StyleConfigurator } from './config/StyleConfigurator';
import { mxEvent } from './initializer';

/**
 * Configure the BpmnMxGraph graph that can be used by the lib
 * <ul>
 *     <li>styles
 *     <li>shapes
 *     <li>markers
 * @internal
 */
export default class GraphConfigurator {
  private readonly graph: BpmnGraph;

  constructor(readonly container: HTMLElement) {
    this.graph = new BpmnGraph(container);
  }

  configure(options: GlobalOptions): BpmnGraph {
    this.configureGraph();
    this.configureNavigationSupport(options);
    new StyleConfigurator(this.graph).configureStyles();
    new ShapeConfigurator().configureShapes();
    new MarkerConfigurator().configureMarkers();
    return this.graph;
  }

  private configureGraph(): void {
    this.graph.setCellsLocked(true);
    this.graph.setCellsSelectable(false);
    this.graph.setEdgeLabelsMovable(false);

    this.graph.setHtmlLabels(true); // required for wrapping

    // To have the boundary event on the border of a task
    this.graph.setConstrainChildren(false);
    this.graph.setExtendParents(false);

    // Disable folding for container mxCell (pool, lane, sub process, call activity) because we don't need it.
    // This also prevents requesting unavailable images (see #185) as we don't override BpmnMxGraph folding default images.
    this.graph.foldingEnabled = false;
  }

  private configureNavigationSupport(options: GlobalOptions): void {
    const panningHandler = this.graph.panningHandler;
    if (options?.navigation?.enabled) {
      // Pan configuration
      panningHandler.addListener(mxEvent.PAN_START, setContainerCursor(this.graph, 'grab'));
      panningHandler.addListener(mxEvent.PAN_END, setContainerCursor(this.graph, 'default'));

      panningHandler.usePopupTrigger = false; // only use the left button to trigger panning
      // Reimplement the function as we also want to trigger 'panning on cells' (ignoreCell to true) and only on left-click
      // The mxGraph standard implementation doesn't ignore right click in this case, so do it by ourselves
      panningHandler.isForcePanningEvent = (me): boolean => mxEvent.isLeftMouseButton(me.getEvent()) || mxEvent.isMultiTouchEvent(me.getEvent());
      this.graph.setPanning(true);

      // Zoom configuration
      this.graph.registerMouseWheelZoomListeners(options.navigation.zoom);
    } else {
      this.graph.setPanning(false);
      // Disable gesture support for zoom
      panningHandler.setPinchEnabled(false);
      // Disable panning on touch device
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
      panningHandler.isForcePanningEvent = (_me: mxMouseEvent): boolean => false;
    }
  }
}

function setContainerCursor(graph: BpmnGraph, cursor: 'grab' | 'default'): () => void {
  return (): void => {
    graph.isEnabled() && (graph.container.style.cursor = cursor);
  };
}
