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
import { MxGraphFactoryService } from '../../service/MxGraphFactoryService';
import StyleConfigurator from './StyleConfigurator';
import ShapeConfigurator from './ShapeConfigurator';
import MarkerConfigurator from './MarkerConfigurator';

/**
 * Configure the mxGraph graph that can be used by the lib
 * <ul>
 *     <li>styles
 *     <li>shapes
 *     <li>markers
 */
export default class MxGraphConfigurator {
  private mxGraph: typeof mxgraph.mxGraph = MxGraphFactoryService.getMxGraphProperty('mxGraph');
  private mxGraphModel: typeof mxgraph.mxGraphModel = MxGraphFactoryService.getMxGraphProperty('mxGraphModel');

  private readonly graph: mxgraph.mxGraph;

  constructor(container: Element) {
    this.graph = new this.mxGraph(container, new this.mxGraphModel());
    this.configureGraph();
    new StyleConfigurator(this.graph).configureStyles();
    new ShapeConfigurator().configureShapes();
    new MarkerConfigurator().configureMarkers();
  }

  public getGraph(): mxgraph.mxGraph {
    return this.graph;
  }

  private configureGraph(): void {
    this.graph.setCellsLocked(true);
    this.graph.setCellsSelectable(false);
    this.graph.setEdgeLabelsMovable(false);

    this.graph.setHtmlLabels(true); // required for wrapping

    // TODO temp for label position fine tuning
    this.graph.setCellsLocked(false);
    this.graph.setCellsSelectable(true);
    this.graph.setVertexLabelsMovable(true);
  }
}
