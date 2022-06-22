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
import type Shape from '../../../../src/model/bpmn/internal/shape/Shape';
import type { Edge } from '../../../../src/model/bpmn/internal/edge/edge';
import type { ModelFilter } from '../../../../src/component/options';

import { buildEdgeId, buildShapeId, poolInModel, toBpmnModel } from '../../helpers/bpmn-model-utils';
import type { ExpectedEdge, ExpectedShape } from '../../helpers/bpmn-model-expect';
import { verifyEdge as baseVerifyEdge, verifyShape as baseVerifyShape } from '../../helpers/bpmn-model-expect';

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
  describe('No filter', () => {
    it.each`
      name                                                            | modelFilter
      ${'No filter object'}                                           | ${undefined}
      ${'Empty filter object'}                                        | ${{}}
      ${'Undefined pools filter object'}                              | ${{ pools: undefined }}
      ${'Empty pools object in filter'}                               | ${{ pools: {} }}
      ${'Empty pools array in filter'}                                | ${{ pools: [] }}
      ${'Pools array with only empty or undefined objects in filter'} | ${{ pools: [{}, undefined, {}] }}
    `('$name', ({ modelFilter }: { modelFilter: ModelFilter }) => {
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
      const bpmnModel = modelFiltering.filter(originalBpmnModel, modelFilter);
      expect(bpmnModel).toStrictEqual(originalBpmnModel);
    });
  });

  describe('Error management', () => {
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

    // TODO implement error management involving names
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Filter several pool by name - no existing pool', () => {
      expect(() =>
        modelFiltering.filter(poolInModel('1', 'Pool 1'), {
          pools: [{ name: 'name_do_not_exist-1' }, { name: 'name_do_not_exist-2' }],
        }),
      ).toThrow(`no existing pool with names i_do_not_exist-1,i_do_not_exist-2`);
    });

    // TODO implement error management involving names
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Filter several pool by id and name - no existing pool', () => {
      expect(() =>
        modelFiltering.filter(poolInModel('1', 'Pool 1'), {
          pools: [{ id: 'id_do_not_exist' }, { name: 'name_do_not_exist' }],
        }),
      ).toThrow(`no existing pool with names i_do_not_exist-1,i_do_not_exist-2`);
    });
  });

  describe.each([['id'], ['name']])(`Filter by %s`, (propertyName: string) => {
    it(`Filter by ${propertyName} a model containing a single pool`, () => {
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

      const poolFilter = propertyName === 'id' ? { id: 'participant_id_1' } : { name: 'Participant 1' };
      const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: poolFilter });

      expect(bpmnModel).toStrictEqual(originalBpmnModel);
    });

    it(`Filter by ${propertyName} a model containing a single pool with a group`, () => {
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

      const poolFilter = propertyName === 'id' ? { id: 'participant_id_1' } : { name: 'Participant 1' };
      const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: poolFilter });

      expect(bpmnModel).toStrictEqual(originalBpmnModel);

      expect(bpmnModel.flowNodes).toHaveLength(2);
      verifyShape(bpmnModel.flowNodes[1], {
        parentId: 'participant_id_1',
        bpmnElementId: 'group_1',
        bpmnElementName: 'Group 1',
        bpmnElementKind: ShapeBpmnElementKind.GROUP,
      });
    });

    it(`Filter by ${propertyName} a model containing several pools`, () => {
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
          {
            id: 'participant_id_3',
            name: 'Participant 3 (black box)',
          },
        ],
      });
      const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: { id: 'participant_id_2' } });

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
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.TASK,
      });

      expect(bpmnModel.edges).toHaveLength(1);
      verifyEdge(bpmnModel.edges[0], {
        bpmnElementId: 'sequence_flow_1',
        bpmnElementSourceRefId: 'startEvent_2',
        bpmnElementTargetRefId: 'task_1',
      });
    });

    it(`Filter by ${propertyName} a model containing several pools - non existing pool ${propertyName}`, () => {
      expect(() =>
        modelFiltering.filter(poolInModel('1', 'Pool 1'), {
          pools: [{ [propertyName]: 'do_not_exist-1' }, { [propertyName]: 'do_not_exist-2' }],
        }),
      ).toThrow(`no existing pool with ${propertyName}s do_not_exist-1,do_not_exist-2`);
    });

    it(`Filter by ${propertyName} all pools of a model, with message flows`, () => {
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

      const poolFilter = propertyName === 'id' ? [{ id: 'participant_id_1' }, { id: 'participant_id_2' }] : [{ name: 'Participant 1' }, { name: 'Participant 2' }];
      const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: poolFilter });

      expect(bpmnModel).toStrictEqual(originalBpmnModel);
      expect(bpmnModel.edges).toHaveLength(1);
      verifyEdge(bpmnModel.edges[0], {
        bpmnElementId: 'message_flow_1',
        bpmnElementSourceRefId: 'startEvent_2',
        bpmnElementTargetRefId: 'participant_id_1',
      });
    });
  });
});

it('Filter a model containing existing pool and skipped the others', () => {
  const originalBpmnModel = toBpmnModel({
    pools: [
      {
        id: 'participant_id_1',
        name: 'Participant 1',
      },
      {
        id: 'participant_id_2',
        name: 'Participant 2',
      },
    ],
  });

  const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: [{ id: 'not exist_0' }, { id: 'participant_id_1' }, { id: 'not exist_1' }, { id: 'not exist_2' }] });
  expect(bpmnModel.pools).toHaveLength(1);
  verifyShape(bpmnModel.pools[0], {
    bpmnElementId: 'participant_id_1',
    bpmnElementName: 'Participant 1',
    bpmnElementKind: ShapeBpmnElementKind.POOL,
  });
});
