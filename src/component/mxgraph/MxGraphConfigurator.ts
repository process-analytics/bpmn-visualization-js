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
import StyleConfigurator from './config/StyleConfigurator';
import ShapeConfigurator from './config/ShapeConfigurator';
import MarkerConfigurator from './config/MarkerConfigurator';
import MxClientConfigurator from './config/MxClientConfigurator';
import { BpmnVisualizationOptions } from '../BpmnVisualization';
import { mxgraph } from 'ts-mxgraph';
// TODO unable to load mxClient from mxgraph-type-definitions@1.0.4
declare const mxClient: typeof mxgraph.mxClient;

/**
 * Configure the mxGraph graph that can be used by the lib
 * <ul>
 *     <li>styles
 *     <li>shapes
 *     <li>markers
 */
export default class MxGraphConfigurator {
  private readonly graph: mxGraph;

  constructor(readonly container: HTMLElement) {
    this.graph = new mxGraph(container);
  }

  public configure(): mxGraph {
    this.configureGraph();
    new StyleConfigurator(this.graph).configureStyles();
    new ShapeConfigurator().configureShapes();
    new MarkerConfigurator().configureMarkers();
    new MxClientConfigurator().configureMxCodec();
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
    // This also prevents requesting unavailable images (see #185) as we don't override mxGraph folding default images.
    this.graph.foldingEnabled = false;
  }

  configureMouseNavigationSupport(options?: BpmnVisualizationOptions): void {
    const mouseNavigationSupport = options?.mouseNavigationSupport;
    // Pan configuration
    if (mouseNavigationSupport) {
      this.graph.panningHandler.useLeftButtonForPanning = true;
      this.graph.panningHandler.ignoreCell = true; // ok here as we cannot select cells
      this.graph.setPanning(true);
    } else {
      this.graph.setPanning(false);
      this.graph.panningHandler.setPinchEnabled(false); // ensure gesture support is disabled (pan and zoom)
    }

    this.configureMouseEvent(mouseNavigationSupport);
  }

  private configureMouseEvent(activated = false): void {
    if (!activated) {
      return;
    }

    mxEvent.addMouseWheelListener((event: Event, up: boolean) => {
      // TODO review type: this hack is due to the introduction of mxgraph-type-definitions
      const evt = (event as unknown) as MouseEvent;
      if (mxEvent.isConsumed((evt as unknown) as mxMouseEvent)) {
        return;
      }
      // only the ctrl key or the meta key on mac
      const isZoomWheelEvent = (evt.ctrlKey || (mxClient.IS_MAC && evt.metaKey)) && !evt.altKey && !evt.shiftKey;
      if (isZoomWheelEvent) {
        this.zoom(up);
        mxEvent.consume(evt);
      }
    }, this.container);
  }

  private zoom(zoomIn: boolean): void {
    if (zoomIn) {
      this.graph.zoomIn();
    } else {
      this.graph.zoomOut();
    }
  }
}
