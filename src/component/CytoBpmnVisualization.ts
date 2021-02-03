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
import { newBpmnParser } from './parser/BpmnParser';
import { CytoscapeConfigurator } from './cytoscape/CytoscapeConfigurator';
import { Core } from 'cytoscape';
import { CytoscapeConverter } from './cytoscape/CytoscapeConverter';

export default class CytoBpmnVisualization {
  private graph: Core;

  constructor(readonly container: string) {
    document.getElementById(container);
    this.graph = new CytoscapeConfigurator(container).initializeGraph();
  }

  public load(xml: string): void {
    const bpmnModel = newBpmnParser().parse(xml);
    new CytoscapeConverter(this.graph).convertToCytoscapeModel(bpmnModel);
  }
}
