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

import { StyleConfigurator } from './config/StyleConfigurator';
import ShapeConfigurator from './config/ShapeConfigurator';
import MarkerConfigurator from './config/MarkerConfigurator';
import { GlobalOptions } from '../options';
import { BpmnMxGraph } from './BpmnMxGraph';
import { mxgraph } from './initializer';
import { mxMouseEvent } from 'mxgraph'; // for types

/**
 * Configure the BpmnMxGraph graph that can be used by the lib
 * <ul>
 *     <li>styles
 *     <li>shapes
 *     <li>markers
 * @internal
 */
export default class MxGraphConfigurator {
  private readonly graph: BpmnMxGraph;

  constructor(readonly container: HTMLElement) {
    this.graph = new BpmnMxGraph(container);
  }

  configure(options: GlobalOptions): BpmnMxGraph {
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
      panningHandler.addListener(mxgraph.mxEvent.PAN_START, this.getPanningHandler('grab'));
      panningHandler.addListener(mxgraph.mxEvent.PAN_END, this.getPanningHandler('default'));

      this.graph.panningHandler.usePopupTrigger = false; // only use the left button to trigger panning
      // Reimplement the function as we also want to trigger 'panning on cells' (ignoreCell to true) and only on left click
      // The mxGraph standard implementation doesn't ignore right click in this case, so do it by ourself
      panningHandler.isForcePanningEvent = (me): boolean => mxgraph.mxEvent.isLeftMouseButton(me.getEvent()) || mxgraph.mxEvent.isMultiTouchEvent(me.getEvent());
      this.graph.setPanning(true);

      // Zoom configuration
      this.graph.createMouseWheelZoomExperience(options?.navigation?.zoom);
    } else {
      this.graph.setPanning(false);
      // Disable gesture support for zoom
      panningHandler.setPinchEnabled(false);
      // Disable panning on touch device
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      panningHandler.isForcePanningEvent = (me: mxMouseEvent): boolean => false;
    }
  }

  private getPanningHandler(cursor: 'grab' | 'default'): OmitThisParameter<(this: BpmnMxGraph) => void> {
    return this.getPanningHandlerCallback(cursor).bind(this.graph);
  }

  private getPanningHandlerCallback(cursor: 'grab' | 'default'): () => void {
    return function (this: BpmnMxGraph): void {
      this.isEnabled() && (this.container.style.cursor = cursor);
    };
  }
}
