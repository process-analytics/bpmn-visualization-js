/**
 * Copyright 2022 Bonitasoft S.A.
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

import { ModelFiltering } from '../../../../src/component/registry/bpmn-model-filters';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/internal';
import { buildEdgeId, buildShapeId, poolInModel, toBpmnModel } from '../../helpers/bpmn-model-utils';
import type { ExpectedEdge, ExpectedShape } from '../../helpers/bpmn-model-expect';
import { verifyEdge as baseVerifyEdge, verifyShape as baseVerifyShape } from '../../helpers/bpmn-model-expect';
import type Shape from '../../../../src/model/bpmn/internal/shape/Shape';
import type { Edge } from '../../../../src/model/bpmn/internal/edge/edge';

// use a single instance to detect any side effects
const modelFiltering = new ModelFiltering();

type CustomExpectedShape = Omit<ExpectedShape, 'shapeId'>;
const verifyShape = (shape: Shape, expectedShape: CustomExpectedShape): void => {
  baseVerifyShape(shape, { ...expectedShape, shapeId: buildShapeId(expectedShape.bpmnElementId) });
};

type CustomExpectedEdge = Omit<ExpectedEdge, 'edgeId' | 'waypoints'>;
const verifyEdge = (shape: Edge, expectedEdge: CustomExpectedEdge): void => {
  baseVerifyEdge(shape, { ...expectedEdge, edgeId: buildEdgeId(expectedEdge.bpmnElementId), waypoints: undefined });
};

describe('Bpmn Model filters', () => {
  // TODO undefined as well? notice that we are not passing such values, so these tests have limited interest
  // we should remove it
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Passing a null BpmnModel does not generate error', () => {
    expect(modelFiltering.filter(toBpmnModel(null))).toBeNull();
  });

  // here we check the error message - use it.each if necessary
  it('Filter several pool by id - non existing pool id', () => {
    expect(() =>
      modelFiltering.filter(poolInModel('1', 'Pool 1'), {
        pools: [{ id: 'i_do_not_exist-1' }, { id: 'i_do_not_exist-2' }],
      }),
    ).toThrow(`no existing pool with ids i_do_not_exist-1,i_do_not_exist-2`);
  });

  it('No filter', () => {
    const originalBpmnModel = toBpmnModel({
      pools: {
        id: 'participant_id_1',
        name: 'Participant 1',
        startEvents: {
          id: 'startEvent_1',
          name: 'Start Event 1',
        },
      },
    });
    const bpmnModel = modelFiltering.filter(originalBpmnModel);
    expect(bpmnModel).toStrictEqual(originalBpmnModel);
  });

  it('Filter a model containing a single pool', () => {
    const originalBpmnModel = toBpmnModel({
      pools: {
        id: 'participant_id_1',
        name: 'Participant 1',
        startEvents: {
          id: 'startEvent_1',
          name: 'Start Event 1',
        },
      },
    });
    const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: { id: 'participant_id_1' } });
    expect(bpmnModel).toStrictEqual(originalBpmnModel);
  });

  it('Filter a model containing several pool', () => {
    const originalBpmnModel = toBpmnModel({
      pools: [
        {
          id: 'participant_id_1',
          name: 'Participant 1',
          startEvents: {
            id: 'startEvent_1',
            name: 'Start Event 1',
          },
        },
        {
          id: 'participant_id_2',
          name: 'Participant 2',
          startEvents: {
            id: 'startEvent_2',
            name: 'Start Event 2',
          },
          tasks: {
            id: 'task_1',
          },
          sequenceFlows: {
            id: 'sequence_flow_1',
            source: 'startEvent_2',
            target: 'task_1',
          },
        },
      ],
    });
    const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: { id: 'participant_id_2' } });

    // TODO here we want to ensure the elements are in the model, I am not sure we want to test the elements order
    expect(bpmnModel.pools).toHaveLength(1);
    verifyShape(bpmnModel.pools[0], {
      bpmnElementId: 'participant_id_2',
      bpmnElementName: 'Participant 2',
      bpmnElementKind: ShapeBpmnElementKind.POOL,
    });

    expect(bpmnModel.flowNodes).toHaveLength(2);
    verifyShape(bpmnModel.flowNodes[0], {
      parentId: 'participant_id_2',
      bpmnElementId: 'startEvent_2',
      bpmnElementName: 'Start Event 2',
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
    });
    verifyShape(bpmnModel.flowNodes[1], {
      parentId: 'participant_id_2',
      bpmnElementId: 'task_1',
      bpmnElementName: undefined, // TODO this shouldn't be mandatory here
      bpmnElementKind: ShapeBpmnElementKind.TASK,
    });

    expect(bpmnModel.edges).toHaveLength(1);
    verifyEdge(bpmnModel.edges[0], {
      bpmnElementId: 'sequence_flow_1',
      bpmnElementSourceRefId: 'startEvent_2',
      bpmnElementTargetRefId: 'task_1',
    });
  });

  it('Filter all pools of a model, with message flows', () => {
    const originalBpmnModel = toBpmnModel({
      pools: [
        {
          id: 'participant_id_1',
          name: 'Participant 1',
          startEvents: {
            id: 'startEvent_1',
            name: 'Start Event 1',
          },
        },
        {
          id: 'participant_id_2',
          name: 'Participant 2',
          startEvents: {
            id: 'startEvent_2',
            name: 'Start Event 2',
          },
        },
      ],
      messageFlows: {
        id: 'message_flow_1',
        source: 'startEvent_2',
        target: 'participant_id_1',
      },
    });
    const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: [{ id: 'participant_id_1' }, { id: 'participant_id_2' }] });
    expect(bpmnModel).toStrictEqual(originalBpmnModel);
    expect(bpmnModel.edges).toHaveLength(1);
    verifyEdge(bpmnModel.edges[0], {
      bpmnElementId: 'message_flow_1',
      bpmnElementSourceRefId: 'startEvent_2',
      bpmnElementTargetRefId: 'participant_id_1',
    });
  });

  it('Filter a model containing a single pool with a group', () => {
    const originalBpmnModel = toBpmnModel({
      pools: {
        id: 'participant_id_1',
        name: 'Participant 1',
        startEvents: {
          id: 'startEvent_1',
          name: 'Start Event 1',
        },
        groups: {
          id: 'group_1',
          name: 'Group 1',
        },
      },
    });
    expect(originalBpmnModel.flowNodes).toHaveLength(2);

    const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: { id: 'participant_id_1' } });
    expect(bpmnModel).toStrictEqual(originalBpmnModel);

    expect(bpmnModel.flowNodes).toHaveLength(2);
    verifyShape(bpmnModel.flowNodes[1], {
      parentId: 'participant_id_1',
      bpmnElementId: 'group_1',
      bpmnElementName: 'Group 1',
      bpmnElementKind: ShapeBpmnElementKind.GROUP,
    });
  });
});
