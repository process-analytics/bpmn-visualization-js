/*
Copyright 2021 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { EdgeBpmnSemantic, ShapeBpmnSemantic } from '@lib/component/registry';

import {
  associationFlowInModel,
  intermediateCatchEventInModel,
  intermediateThrowEventInModel,
  laneInModel,
  messageFlowInModel,
  poolInModel,
  sequenceFlowInModel,
  startEventInModel,
} from '../../helpers/bpmn-model-utils';

import { BpmnModelRegistry } from '@lib/component/registry/bpmn-model-registry';
import { ShapeBpmnEventDefinitionKind } from '@lib/model/bpmn/internal';
import {
  expectAssociationFlow,
  expectIntermediateCatchEvent,
  expectIntermediateThrowEvent,
  expectLane,
  expectMessageFlow,
  expectPool,
  expectSequenceFlow,
  expectStartEvent,
} from '@test/shared/model/bpmn-semantic-utils';

const bpmnModelRegistry = new BpmnModelRegistry();

describe('Bpmn Model registry', () => {
  it('callback is called on model load', () => {
    const bpmnModelRegistry = new BpmnModelRegistry();
    const callback = jest.fn();
    bpmnModelRegistry.registerOnLoadCallback(callback);
    bpmnModelRegistry.load(startEventInModel('id', 'name'));
    expect(callback).toHaveBeenCalledOnce();
  });

  it('search sequence flow', () => {
    bpmnModelRegistry.load(sequenceFlowInModel('seq_flow_id', 'seq flow name', 'sourceRefId', 'targetRefId'));
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('seq_flow_id') as EdgeBpmnSemantic;
    expectSequenceFlow(bpmnSemantic, { id: 'seq_flow_id', name: 'seq flow name', source: 'sourceRefId', target: 'targetRefId' });
  });
  it('search message flow', () => {
    bpmnModelRegistry.load(messageFlowInModel('msg_flow_id', 'msg flow name', 'sourceRefId', 'targetRefId'));
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('msg_flow_id') as EdgeBpmnSemantic;
    expectMessageFlow(bpmnSemantic, { id: 'msg_flow_id', name: 'msg flow name', source: 'sourceRefId', target: 'targetRefId' });
  });
  it('search association flow', () => {
    bpmnModelRegistry.load(associationFlowInModel('association_flow_id', 'association flow name', 'sourceRefId', 'targetRefId'));
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('association_flow_id') as EdgeBpmnSemantic;
    expectAssociationFlow(bpmnSemantic, { id: 'association_flow_id', name: 'association flow name', source: 'sourceRefId', target: 'targetRefId' });
  });

  it('search flowNode', () => {
    bpmnModelRegistry.load(startEventInModel('start event id', 'start event name', { incomingIds: ['incoming_1'], outgoingIds: ['outgoing_1', 'outgoing_2'] }));
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('start event id') as ShapeBpmnSemantic;

    expectStartEvent(bpmnSemantic, {
      id: 'start event id',
      name: 'start event name',
      incoming: ['incoming_1'],
      outgoing: ['outgoing_1', 'outgoing_2'],
      parentId: 'parentId',
      eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
    });
  });

  it('search intermediate catch event', () => {
    bpmnModelRegistry.load(
      intermediateCatchEventInModel('intermediate catch event id', 'intermediate catch event name', { incomingIds: ['incoming_1'], outgoingIds: ['outgoing_1', 'outgoing_2'] }, [
        'sourceId',
      ]),
    );
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('intermediate catch event id') as ShapeBpmnSemantic;

    expectIntermediateCatchEvent(bpmnSemantic, {
      id: 'intermediate catch event id',
      name: 'intermediate catch event name',
      incoming: ['incoming_1'],
      outgoing: ['outgoing_1', 'outgoing_2'],
      parentId: 'parentId',
      eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
      linkEventSourceIds: ['sourceId'],
    });
  });

  it('search intermediate throw event', () => {
    bpmnModelRegistry.load(
      intermediateThrowEventInModel(
        'intermediate throw event id',
        'intermediate throw event name',
        { incomingIds: ['incoming_1'], outgoingIds: ['outgoing_1', 'outgoing_2'] },
        'targetId',
      ),
    );
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('intermediate throw event id') as ShapeBpmnSemantic;

    expectIntermediateThrowEvent(bpmnSemantic, {
      id: 'intermediate throw event id',
      name: 'intermediate throw event name',
      incoming: ['incoming_1'],
      outgoing: ['outgoing_1', 'outgoing_2'],
      parentId: 'parentId',
      eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
      linkEventTargetId: 'targetId',
    });
  });

  it('search lane', () => {
    bpmnModelRegistry.load(laneInModel('lane id', 'lane name'));
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('lane id');
    expectLane(bpmnSemantic, { id: 'lane id', name: 'lane name' });
  });

  it('search pool', () => {
    bpmnModelRegistry.load(poolInModel('pool id', 'pool name'));
    const bpmnSemantic = bpmnModelRegistry.getBpmnSemantic('pool id');
    expectPool(bpmnSemantic, { id: 'pool id', name: 'pool name' });
  });
});
