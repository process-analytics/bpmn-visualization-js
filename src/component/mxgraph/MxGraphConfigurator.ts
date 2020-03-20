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

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Configure mxgraph
 * <ul>
 *     <li>styles
 *     <li>shapes
 */
export default class MxGraphConfigurator {
  private mxClient: any = MxGraphFactoryService.getMxGraphProperty('mxClient');
  private mxGraph: any = MxGraphFactoryService.getMxGraphProperty('mxGraph');
  private mxGraphModel: any = MxGraphFactoryService.getMxGraphProperty('mxGraphModel');

  private readonly graph: mxgraph.mxGraph;

  constructor(container: Element) {
    this.initMxGraphPrototype();
    this.graph = new this.mxGraph(container, new this.mxGraphModel());
    const styleConfigurator = new StyleConfigurator(this.graph);
    styleConfigurator.configureStyles();
    const shapeConfigurator = new ShapeConfigurator();
    shapeConfigurator.initMxShapePrototype(this.mxClient.IS_FF);
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
