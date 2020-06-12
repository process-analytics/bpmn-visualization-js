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
import { mxgraph } from 'ts-mxgraph';
import StyleConfigurator from './StyleConfigurator';
import ShapeConfigurator from './ShapeConfigurator';
import MarkerConfigurator from './MarkerConfigurator';
import MxClientConfigurator from './MxClientConfigurator';
import BpmnVisuOptions from '../BpmnVisuOptions';

declare const mxGraph: typeof mxgraph.mxGraph;
declare const mxGraphModel: typeof mxgraph.mxGraphModel;

/**
 * Configure the mxGraph graph that can be used by the lib
 * <ul>
 *     <li>styles
 *     <li>shapes
 *     <li>markers
 */
export default class MxGraphConfigurator {
  private readonly graph: mxgraph.mxGraph;

  constructor(container: Element, options?: BpmnVisuOptions) {
    this.graph = new mxGraph(container, new mxGraphModel());
    this.configureGraph(options);

    new StyleConfigurator(this.graph).configureStyles();
    new ShapeConfigurator().configureShapes();
    new MarkerConfigurator().configureMarkers();
    new MxClientConfigurator().configureMxCodec();
  }

  public getGraph(): mxgraph.mxGraph {
    return this.graph;
  }

  private configureGraph(options?: BpmnVisuOptions): void {
    this.graph.setEdgeLabelsMovable(false);
    this.graph.setVertexLabelsMovable(false);
    this.graph.setCellsLocked(false); // true value prevents panning to work
    // the following is needed when cells are not locked for panning
    this.graph.setCellsSelectable(false);
    this.graph.setCellsMovable(false);

    this.graph.setHtmlLabels(true); // required for wrapping

    // To have the boundary event on the border of a task
    this.graph.setConstrainChildren(false);
    this.graph.setExtendParents(false);

    // Disable folding for container mxCell (pool, lane, sub process, call activity) because we don't need it.
    // This also prevents requesting unavailable images (see #185) as we don't override mxGraph folding default images.
    this.graph.foldingEnabled = false;

    // panning configuration
    this.graph.panningHandler.useLeftButtonForPanning = true;
    this.graph.panningHandler.ignoreCell = true; // Specifies if panning should be active even if there is a cell under the mouse pointer

    // TODO experiment this settings because currently panning increases makes scrollbars to appears when going right and/or bottom
    // Specifies if the size of the graph should be automatically extended if the mouse goes near the container edge while dragging.
    // This is only taken into account if the container has scrollbars.  Default is true.  See autoScroll.
    //this.graph.autoExtend = false;

    // Specifies if scrollbars should be used for panning in panGraph if any scrollbars are available.  If scrollbars are
    // enabled in CSS, but no scrollbars appear because the graph is smaller than the container size, then no panning occurs if this is true.
    // Default is true.
    // this.graph.useScrollbarsForPanning = false;

    // this.graph.scroautoExtend = false;
    //this.graph.translateToScrollPosition = false;

    // Specifies if the graph should automatically scroll if the mouse goes near the container edge while dragging.  This is only taken into account if the container has scrollbars.  Default is true.
    //
    // If you need this to work without scrollbars then set ignoreScrollbars to true.  Please consult the ignoreScrollbars for details.  In general, with no scrollbars, the use of allowAutoPanning is recommended.
    // this.graph.autoscroll = true;

    // ignoreScrollbars
    // Specifies if the graph should automatically scroll regardless of the scrollbars.  This will scroll the container using positive values for scroll positions (ie usually only rightwards and downwards).  To avoid possible conflicts with panning, set translateToScrollPosition to true.
    // this.graph.ignoreScrollbars = true;

    // allowAutoPanning
    // Specifies if panning via panGraph should be allowed to implement autoscroll if no scrollbars are available in scrollPointToVisible.  To enable panning inside the container, near the edge, set mxPanningManager.border to a positive value.  Default is false.

    // TODO dynamic option to move elsewhere
    if (options?.activatePanning) {
      // eslint-disable-next-line no-console
      console.info('activate panning');
      this.graph.setPanning(true);
    }
    // this.graph.centerZoom = true;
  }
}
