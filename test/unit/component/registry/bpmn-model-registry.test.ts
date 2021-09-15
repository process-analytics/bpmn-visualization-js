/**
 * Copyright 2021 Bonitasoft S.A.
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

import { BpmnModelRegistry } from '../../../../src/component/registry/bpmn-model-registry';
import BpmnModel from '../../../../src/model/bpmn/internal/BpmnModel';
import Edge from '../../../../src/model/bpmn/internal/edge/Edge';
import { SequenceFlow } from '../../../../src/model/bpmn/internal/edge/Flow';
import Shape from '../../../../src/model/bpmn/internal/shape/Shape';
import { ShapeBpmnElementKind, ShapeBpmnEventKind } from '../../../../src/model/bpmn/internal/shape';
import ShapeBpmnElement, { ShapeBpmnStartEvent } from '../../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import { expectLane, expectPool, expectSequenceFlow, expectStartEvent } from '../../helpers/bpmn-semantic-utils';

const bpmnModelRegistry = new BpmnModelRegistry();

function newBpmnModel(): BpmnModel {
  return {
    edges: [],
    flowNodes: [],
    lanes: [],
    pools: [],
  };
}

function sequenceFlowInModel(id: string, name: string): BpmnModel {
  const bpmnModel = newBpmnModel();
  bpmnModel.edges.push(new Edge(`Edge_${id}`, new SequenceFlow(id, name)));
  return bpmnModel;
}

function startEventInModel(id: string, name: string): BpmnModel {
  const bpmnModel = newBpmnModel();
  bpmnModel.flowNodes.push(new Shape(`Shape_${id}`, new ShapeBpmnStartEvent(id, name, ShapeBpmnEventKind.TIMER, 'parentId')));
  return bpmnModel;
}

function laneInModel(id: string, name: string): BpmnModel {
  const bpmnModel = newBpmnModel();
  bpmnModel.lanes.push(new Shape(`Shape_${id}`, new ShapeBpmnElement(id, name, ShapeBpmnElementKind.LANE)));
  return bpmnModel;
}

function poolInModel(id: string, name: string): BpmnModel {
  const bpmnModel = newBpmnModel();
  bpmnModel.pools.push(new Shape(`Shape_${id}`, new ShapeBpmnElement(id, name, ShapeBpmnElementKind.POOL)));
  return bpmnModel;
}

describe('Bpmn Model registry', () => {
  it('search edge', () => {
    bpmnModelRegistry.computeRenderedModel(sequenceFlowInModel('seq flow id', 'seq flow name'));
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('seq flow id');
    expectSequenceFlow(bpmnSemantic, { id: 'seq flow id', name: 'seq flow name' });
  });
  it('search flownode', () => {
    bpmnModelRegistry.computeRenderedModel(startEventInModel('start event id', 'start event name'));
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('start event id');
    expectStartEvent(bpmnSemantic, { id: 'start event id', name: 'start event name' });
  });
  it('search lane', () => {
    bpmnModelRegistry.computeRenderedModel(laneInModel('lane id', 'lane name'));
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('lane id');
    expectLane(bpmnSemantic, { id: 'lane id', name: 'lane name' });
  });
  it('search pool', () => {
    bpmnModelRegistry.computeRenderedModel(poolInModel('pool id', 'pool name'));
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('pool id');
    expectPool(bpmnSemantic, { id: 'pool id', name: 'pool name' });
  });
});
