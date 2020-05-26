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
 * Configure mxgraph
 * <ul>
 *     <li>styles
 *     <li>shapes
 */
export default class MxGraphConfigurator {
  private mxGraph: typeof mxgraph.mxGraph = MxGraphFactoryService.getMxGraphProperty('mxGraph');
  private mxGraphModel: typeof mxgraph.mxGraphModel = MxGraphFactoryService.getMxGraphProperty('mxGraphModel');

  private readonly graph: mxgraph.mxGraph;

  constructor(container: Element) {
    this.initMxGraphPrototype();
    this.graph = new this.mxGraph(container, new this.mxGraphModel());
    new StyleConfigurator(this.graph).configureStyles();
    new ShapeConfigurator().configureShapes();
    new MarkerConfigurator().configureMarkers();
  }

  public getGraph(): mxgraph.mxGraph {
    return this.graph;
  }

  private initMxGraphPrototype(): void {
    this.mxGraph.prototype.edgeLabelsMovable = false;
    this.mxGraph.prototype.cellsLocked = true;
    this.mxGraph.prototype.cellsSelectable = false;
  }
}
