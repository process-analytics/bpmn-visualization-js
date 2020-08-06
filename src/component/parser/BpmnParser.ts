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
import BpmnModel from '../../model/bpmn/BpmnModel';
import BpmnXmlParser from './xml/BpmnXmlParser';
import BpmnJsonParser, { defaultBpmnJsonParser } from './json/BpmnJsonParser';
import Logger from '../Logger';

class BpmnParser {
  private log: Logger = new Logger('BpmnParser');

  constructor(readonly jsonParser: BpmnJsonParser, readonly xmlParser: BpmnXmlParser) {}

  parse(bpmnAsXml: string): BpmnModel {
    const initialStartTime = performance.now();
    this.log.info(`start xml parsing, string length ${bpmnAsXml.length}`);

    const json = this.xmlParser.parse(bpmnAsXml);
    this.log.info(`xml parsing done in ${performance.now() - initialStartTime} ms`);

    const jsonStartTime = performance.now();
    const bpmnModel = this.jsonParser.parse(json);
    this.log.info(`json parsing done in ${performance.now() - jsonStartTime} ms`);

    this.log.info(`full parsing done in ${performance.now() - initialStartTime} ms`);
    this.logModelStats(bpmnModel);
    return bpmnModel;
  }

  logModelStats(bpmnModel: BpmnModel): void {
    const msg = `Created BpmnModel:
  Pools: ${bpmnModel.pools.length}
  Lanes: ${bpmnModel.lanes.length}
  FlowNodes: ${bpmnModel.flowNodes.length}
  Edges: ${bpmnModel.edges.length}
`;
    this.log.info(msg);
  }
}

export function defaultBpmnParser(): BpmnParser {
  // TODO replace the function by dependency injection, see #110
  return new BpmnParser(defaultBpmnJsonParser(), new BpmnXmlParser());
}
