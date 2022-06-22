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
      ${'Pool filter with id and name undefined'}                     | ${{ pools: { id: undefined, name: undefined } }}
      ${'Pools array with id undefined and name undefined'}           | ${{ pools: [{ id: undefined }, { name: undefined }] }}
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
    // TODO rework error message in implementation first, and if relevant use it.each
    it('Filter several pool by id - non existing pool id', () => {
      expect(() =>
        modelFiltering.filter(poolInModel('1', 'Pool 1'), {
          pools: [{ id: 'i_do_not_exist-1' }, { id: 'i_do_not_exist-2' }],
        }),
      ).toThrow(`no existing pool with ids i_do_not_exist-1,i_do_not_exist-2`);
    });

    it('Filter several pool by name - no existing pool', () => {
      expect(() =>
        modelFiltering.filter(poolInModel('1', 'Pool 1'), {
          pools: [{ name: 'name_do_not_exist-1' }, { name: 'name_do_not_exist-2' }],
        }),
      ).toThrow(`no existing pool with names name_do_not_exist-1,name_do_not_exist-2`);
    });

    it('Filter several pool by id and name - no existing pool', () => {
      expect(() =>
        modelFiltering.filter(poolInModel('1', 'Pool 1'), {
          pools: [{ id: 'id_do_not_exist' }, { name: 'name_do_not_exist' }, { id: 'id_do_not_exist_other' }],
        }),
      ).toThrow(`no existing pool with ids id_do_not_exist,id_do_not_exist_other with names name_do_not_exist`);
    });

    it('Filter model that does not have participant', () => {
      // generated from node ./scripts/utils/dist/utils.mjs test/fixtures/bpmn/simple-start-task-end.bpmn --output model
      const originalBpmnModel = toBpmnModel({
        process: {
          id: 'process_id',
          startEvents: {
            id: 'startEvent_1',
            name: 'Start Event 1',
          },
          tasks: {
            id: 'task_1',
            name: 'Task 1',
          },
          sequenceFlows: {
            id: 'sequence_flow_1',
            source: 'startEvent_1',
            target: 'task_1',
          },
        },
      });
      expect(originalBpmnModel.flowNodes).toHaveLength(2);
      expect(originalBpmnModel.edges).toHaveLength(1);
      expect(originalBpmnModel.pools).toHaveLength(0);
      expect(originalBpmnModel.lanes).toHaveLength(0);
      expect(() =>
        modelFiltering.filter(originalBpmnModel, {
          pools: { id: 'process_id' },
        }),
      ).toThrow(`no existing pool with ids process_id`);
    });

    // it.each`
    //   propertyName     | type  | poolFilters
    //   ${'id'}          | ${''} | ${''}
    //   ${'name'}        | ${''} | ${''}
    //   ${'id and name'} | ${''} | ${''}
    // `(`Filter by $propertyName - no matching pool`, (poolFilters: PoolFilter[]) => {
    //   expect(() =>
    //     modelFiltering.filter(poolInModel('1', 'Pool 1'), {
    //       pools: poolFilters,
    //     }),
    //   ).toThrow(`no existing pool with ${propertyName}s do_not_exist-1,do_not_exist-2`);
    // });
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

    it(`Filter by ${propertyName} a model containing existing pool and skip the others`, () => {
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

      const poolFilter =
        propertyName === 'id'
          ? [{ id: 'not exist_0' }, { id: 'participant_id_1' }, { id: 'not exist_1' }, { id: 'not exist_2' }]
          : [{ name: 'not exist_0' }, { name: 'Participant 1' }, { name: 'not exist_1' }, { name: 'not exist_2' }];
      const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: poolFilter });

      expect(bpmnModel.pools).toHaveLength(1);
      verifyShape(bpmnModel.pools[0], {
        bpmnElementId: 'participant_id_1',
        bpmnElementName: 'Participant 1',
        bpmnElementKind: ShapeBpmnElementKind.POOL,
      });
    });
  });

  it('Filter by existing id and different name a model containing a single pool', () => {
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

    const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: { id: 'participant_id_1', name: 'not exist_1' } });

    expect(bpmnModel).toStrictEqual(originalBpmnModel);
  });

  describe('Filter pool containing BPMN elements', () => {
    it('Filter pool containing boundary event', () => {
      const originalBpmnModel = toBpmnModel({
        pools: {
          id: 'participant_id_1',
          name: 'Participant 1',
          tasks: {
            id: 'task_1',
            name: 'Task 1',
            boundaryEvents: {
              id: 'boundary_event_1',
              name: 'Boundary Event 1',
            },
          },
        },
      });

      const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: { id: 'participant_id_1' } });

      expect(bpmnModel).toStrictEqual(originalBpmnModel);
    });

    it('Filter pool containing lane with lane', () => {
      const originalBpmnModel = toBpmnModel({
        pools: {
          id: 'participant_id_1',
          name: 'Participant 1',
          lanes: {
            id: 'lane_1',
            name: 'Lane 1',
            lanes: {
              id: 'lane_2',
              name: 'Lane 2',
            },
          },
        },
      });

      const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: { id: 'participant_id_1' } });

      expect(bpmnModel).toStrictEqual(originalBpmnModel);
    });

    it('Filter pool containing lane with sub-process containing lane and task', () => {
      const originalBpmnModel = toBpmnModel({
        pools: {
          id: 'participant_id_1',
          name: 'Participant 1',
          lanes: {
            id: 'lane_1',
            name: 'Lane 1',
            subProcesses: {
              id: 'sub_process_1',
              name: 'Sub Process 1',
              lanes: {
                id: 'lane_2',
                name: 'Lane 2',
                startEvents: {
                  id: 'start_event_1',
                  name: 'Start Event 1',
                },
              },
              tasks: {
                id: 'task_1',
                name: 'Task 1',
              },
            },
          },
        },
      });

      const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: { id: 'participant_id_1' } });

      expect(bpmnModel).toStrictEqual(originalBpmnModel);
    });

    it('Filter pool containing expanded sub-process containing lane, task and sequenceFlow', () => {
      const originalBpmnModel = toBpmnModel({
        pools: {
          id: 'participant_id_1',
          name: 'Participant 1',
          subProcesses: {
            id: 'sub_process_1',
            name: 'Sub Process 1',
            isExpanded: true,
            lanes: {
              id: 'lane_2',
              name: 'Lane 2',
              startEvents: {
                id: 'start_event_1',
                name: 'Start Event 1',
              },
            },
            tasks: {
              id: 'task_1',
              name: 'Task 1',
            },
            sequenceFlows: {
              id: 'sequence_flow_1',
              source: 'start_event_1',
              target: 'task_1',
            },
          },
        },
      });

      const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: { id: 'participant_id_1' } });

      expect(bpmnModel).toStrictEqual(originalBpmnModel);
    });

    it('Filter pool containing expanded callActivity containing task, event and sequenceFlow', () => {
      const originalBpmnModel = toBpmnModel({
        pools: {
          id: 'participant_id_1',
          name: 'Participant 1',
          callActivities: {
            id: 'call_activity_1',
            name: 'Call Activity 1',
            isExpanded: true,
            tasks: {
              id: 'task_1',
              name: 'Task 1',
            },
            startEvents: {
              id: 'start_event_1',
            },
            sequenceFlows: {
              id: 'sequence_flow_1',
              source: 'start_event_1',
              target: 'task_1',
            },
          },
        },
      });

      const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: { id: 'participant_id_1' } });

      expect(bpmnModel).toStrictEqual(originalBpmnModel);
    });
  });
});

it('Filter by name or id', () => {
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
      {
        id: 'participant_id_3',
        name: 'Participant 3',
      },
    ],
  });

  const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: [{ id: 'participant_id_1' }, { name: 'Participant 2' }] });
  expect(bpmnModel.pools).toHaveLength(2);
  verifyShape(bpmnModel.pools[0], {
    bpmnElementId: 'participant_id_1',
    bpmnElementName: 'Participant 1',
    bpmnElementKind: ShapeBpmnElementKind.POOL,
  });
  verifyShape(bpmnModel.pools[1], {
    bpmnElementId: 'participant_id_2',
    bpmnElementName: 'Participant 2',
    bpmnElementKind: ShapeBpmnElementKind.POOL,
  });
});

it('Filter pool twice by name and id', () => {
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

  const bpmnModel = modelFiltering.filter(originalBpmnModel, { pools: [{ id: 'participant_id_1' }, { name: 'Participant 1' }] });
  expect(bpmnModel.pools).toHaveLength(1);
  verifyShape(bpmnModel.pools[0], {
    bpmnElementId: 'participant_id_1',
    bpmnElementName: 'Participant 1',
    bpmnElementKind: ShapeBpmnElementKind.POOL,
  });
});
