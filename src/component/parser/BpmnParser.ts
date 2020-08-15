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
import ShapeUtil from '../../model/bpmn/shape/ShapeUtil';
import ShapeBpmnElement from '../../model/bpmn/shape/ShapeBpmnElement';

class FlowNodesStatistics {
  private activities = 0;
  private events = 0;
  private gateways = 0;
  private others = 0;

  addActivity(element: ShapeBpmnElement): void {
    this.activities++;
  }

  addEvent(element: ShapeBpmnElement): void {
    this.events++;
  }

  addGateway(element: ShapeBpmnElement): void {
    this.gateways++;
  }

  addOther(element: ShapeBpmnElement): void {
    this.others++;
  }
}
// class EdgesStatistics {}

class ModelStatistics {
  private readonly globals: {
    pools: number;
    lanes: number;
    flowNodes: number;
    edges: number;
  };
  private readonly flowNodes = new FlowNodesStatistics();

  constructor(bpmnModel: BpmnModel) {
    this.globals = {
      pools: bpmnModel.pools.length,
      lanes: bpmnModel.lanes.length,
      flowNodes: bpmnModel.flowNodes.length,
      edges: bpmnModel.edges.length,
    };

    this.computeFlowNodesStatistics(bpmnModel);
  }

  log(logger: Logger): void {
    const msg = `BpmnModel Statistics: ${JSON.stringify(this, undefined, 2)}`;
    logger.info(msg);
  }

  private computeFlowNodesStatistics(bpmnModel: BpmnModel): void {
    // const activityKinds = ShapeUtil.activityKinds();
    // const eventTypes = ShapeUtil.topLevelBpmnEventKinds();
    // Object.values(ShapeBpmnEventKind)
    bpmnModel.flowNodes.forEach(flowNode => {
      const bpmnElement = flowNode.bpmnElement;
      const kind = bpmnElement.kind;
      if (ShapeUtil.isActivity(kind)) {
        this.flowNodes.addActivity(bpmnElement);
      } else if (ShapeUtil.isEvent(kind)) {
        this.flowNodes.addEvent(bpmnElement);
      } else if (ShapeUtil.isGateway(kind)) {
        this.flowNodes.addGateway(bpmnElement);
      } else {
        this.flowNodes.addOther(bpmnElement);
      }
    });
  }
}

class BpmnParser {
  private log: Logger = new Logger('BpmnParser');

  constructor(readonly jsonParser: BpmnJsonParser, readonly xmlParser: BpmnXmlParser) {}

  parse(bpmnAsXml: string): BpmnModel {
    const initialStartTime = performance.now();
    this.log.info(`Start xml parsing, string length ${bpmnAsXml.length}`);

    const json = this.xmlParser.parse(bpmnAsXml);
    this.log.info(`Xml parsing done in ${performance.now() - initialStartTime} ms`);

    const jsonStartTime = performance.now();
    const bpmnModel = this.jsonParser.parse(json);
    this.log.info(`Json parsing done in ${performance.now() - jsonStartTime} ms`);

    this.log.info(`Full parsing done in ${performance.now() - initialStartTime} ms`);
    new ModelStatistics(bpmnModel).log(this.log);
    return bpmnModel;
  }
}

export function defaultBpmnParser(): BpmnParser {
  // TODO replace the function by dependency injection, see #110
  return new BpmnParser(defaultBpmnJsonParser(), new BpmnXmlParser());
}
