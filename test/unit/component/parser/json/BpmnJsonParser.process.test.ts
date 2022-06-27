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

import { parseJsonAndExpect, parseJsonAndExpectOnlyPools, parseJsonAndExpectOnlyPoolsAndFlowNodes, parseJsonAndExpectOnlyPoolsAndLanes } from '../../../helpers/JsonTestUtils';
import { verifyShape } from '../../../helpers/bpmn-model-expect';
import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/internal';
import type { BpmnJsonModel } from '../../../../../src/model/bpmn/json/BPMN20';

describe('parse bpmn as json for process/pool', () => {
  describe.each([
    ['vertical', false],
    ['horizontal', true],
  ])('Dedicated tests for %s orientation', (title: string, isHorizontal: boolean) => {
    it(`json containing one ${title} participant referencing a process`, () => {
      const json: BpmnJsonModel = {
        definitions: {
          targetNamespace: '',
          collaboration: {
            participant: { id: 'Participant_1', processRef: 'Process_1' },
          },
          process: {
            id: 'Process_1',
            isExecutable: false,
          },
          BPMNDiagram: {
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_Participant_1',
                  bpmnElement: 'Participant_1',
                  isHorizontal: isHorizontal,
                  Bounds: { x: 158, y: 50, width: 1620, height: 430 },
                },
              ],
            },
          },
        },
      };

      const model = parseJsonAndExpectOnlyPoolsAndLanes(json, 1, 0);

      const pool = model.pools[0];
      verifyShape(pool, {
        shapeId: 'shape_Participant_1',
        bpmnElementId: 'Participant_1',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.POOL,
        parentId: undefined,
        bounds: {
          x: 158,
          y: 50,
          width: 1620,
          height: 430,
        },
        isHorizontal: isHorizontal,
      });
    });

    it(`json containing one ${title} participant without related process`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          collaboration: {
            participant: { id: 'Participant_1', name: 'Participant without process ref' },
          },
          BPMNDiagram: {
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_Participant_1',
                  bpmnElement: 'Participant_1',
                  isHorizontal: isHorizontal,
                  Bounds: { x: 158, y: 50, width: 1620, height: 430 },
                },
              ],
            },
          },
        },
      };

      const model = parseJsonAndExpectOnlyPoolsAndLanes(json, 1, 0);

      const pool = model.pools[0];
      verifyShape(pool, {
        shapeId: 'shape_Participant_1',
        bpmnElementId: 'Participant_1',
        bpmnElementName: 'Participant without process ref',
        bpmnElementKind: ShapeBpmnElementKind.POOL,
        parentId: undefined,
        isHorizontal: isHorizontal,
        bounds: {
          x: 158,
          y: 50,
          width: 1620,
          height: 430,
        },
      });
    });
  });

  it("json containing one participant referencing a process without 'isHorizontal' attribute", () => {
    const json: BpmnJsonModel = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          participant: { id: 'Participant_1', processRef: 'Process_1' },
        },
        process: {
          id: 'Process_1',
          isExecutable: false,
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'shape_Participant_1',
                bpmnElement: 'Participant_1',
                Bounds: { x: 158, y: 50, width: 1620, height: 430 },
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyPoolsAndLanes(json, 1, 0);

    const pool = model.pools[0];
    verifyShape(pool, {
      shapeId: 'shape_Participant_1',
      bpmnElementId: 'Participant_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.POOL,
      parentId: undefined,
      bounds: {
        x: 158,
        y: 50,
        width: 1620,
        height: 430,
      },
      isHorizontal: true,
    });
  });

  it('json containing one participant without name and the related process has a name', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          participant: { id: 'Participant_1', processRef: 'Process_1' },
        },
        process: {
          id: 'Process_1',
          name: 'Process 1',
          isExecutable: false,
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'shape_Participant_1',
                bpmnElement: 'Participant_1',
                isHorizontal: true,
                Bounds: { x: 158, y: 50, width: 1620, height: 430 },
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyPoolsAndLanes(json, 1, 0);

    const pool = model.pools[0];
    verifyShape(pool, {
      shapeId: 'shape_Participant_1',
      bpmnElementId: 'Participant_1',
      bpmnElementName: 'Process 1',
      bpmnElementKind: ShapeBpmnElementKind.POOL,
      parentId: undefined,
      isHorizontal: true,
      bounds: {
        x: 158,
        y: 50,
        width: 1620,
        height: 430,
      },
    });
  });

  it('json containing one process with pool and a single lane without flowNodeRef', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          participant: { id: 'Participant_0nuvj8r', name: 'Pool 1', processRef: 'Process_0vbjbkf' },
        },
        process: {
          id: 'Process_0vbjbkf',
          name: 'RequestLoan',
          isExecutable: false,
          lane: { id: 'Lane_12u5n6x' },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'shape_Participant_0nuvj8r',
                bpmnElement: 'Participant_0nuvj8r',
                isHorizontal: true,
                Bounds: { x: 158, y: 50, width: 1620, height: 430 },
              },
              {
                id: 'shape_Lane_1h5yeu4',
                bpmnElement: 'Lane_12u5n6x',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyPoolsAndLanes(json, 1, 1);

    const pool = model.pools[0];
    verifyShape(pool, {
      shapeId: 'shape_Participant_0nuvj8r',
      bpmnElementId: 'Participant_0nuvj8r',
      bpmnElementName: 'Pool 1',
      bpmnElementKind: ShapeBpmnElementKind.POOL,
      parentId: undefined,
      isHorizontal: true,
      bounds: {
        x: 158,
        y: 50,
        width: 1620,
        height: 430,
      },
    });

    const lane = model.lanes[0];
    verifyShape(lane, {
      shapeId: 'shape_Lane_1h5yeu4',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      parentId: 'Participant_0nuvj8r',
      isHorizontal: true,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it('json containing several processes and participants (with lane or laneset)', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          participant: [
            { id: 'Participant_1', name: 'Pool 1', processRef: 'Process_1' },
            { id: 'Participant_2', name: 'Pool 2', processRef: 'Process_2' },
          ],
        },
        process: [
          {
            id: 'Process_1',
            name: 'process 1',
            isExecutable: false,
            lane: { id: 'Lane_1_1' },
          },
          {
            id: 'Process_2',
            name: 'process 2',
            isExecutable: true,
            laneSet: {
              id: 'LaneSet_2',
              lane: { id: 'Lane_2_1' },
            },
          },
        ],
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'shape_Participant_1',
                bpmnElement: 'Participant_1',
                isHorizontal: true,
                Bounds: { x: 158, y: 50, width: 1620, height: 430 },
              },
              {
                id: 'shape_Lane_1_1',
                bpmnElement: 'Lane_1_1',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
              {
                id: 'Participant_2_di',
                bpmnElement: 'Participant_2',
                isHorizontal: true,
                Bounds: { x: 158, y: 1050, width: 1620, height: 430 },
              },
              {
                id: 'shape_Lane_2_1',
                bpmnElement: 'Lane_2_1',
                Bounds: { x: 362, y: 1232, width: 36, height: 45 },
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyPoolsAndLanes(json, 2, 2);

    verifyShape(model.pools[0], {
      shapeId: 'shape_Participant_1',
      bpmnElementId: 'Participant_1',
      bpmnElementName: 'Pool 1',
      bpmnElementKind: ShapeBpmnElementKind.POOL,
      parentId: undefined,
      isHorizontal: true,
      bounds: {
        x: 158,
        y: 50,
        width: 1620,
        height: 430,
      },
    });
    verifyShape(model.pools[1], {
      shapeId: 'Participant_2_di',
      bpmnElementId: 'Participant_2',
      bpmnElementName: 'Pool 2',
      bpmnElementKind: ShapeBpmnElementKind.POOL,
      parentId: undefined,
      isHorizontal: true,
      bounds: {
        x: 158,
        y: 1050,
        width: 1620,
        height: 430,
      },
    });

    verifyShape(model.lanes[0], {
      shapeId: 'shape_Lane_1_1',
      bpmnElementId: 'Lane_1_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      parentId: 'Participant_1',
      isHorizontal: true,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
    verifyShape(model.lanes[1], {
      shapeId: 'shape_Lane_2_1',
      bpmnElementId: 'Lane_2_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      parentId: 'Participant_2',
      isHorizontal: true,
      bounds: {
        x: 362,
        y: 1232,
        width: 36,
        height: 45,
      },
    });
  });

  it('participant without processRef are not considered as pool', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          participant: [
            { id: 'Participant_1', name: 'Pool 1', processRef: 'Process_1' },
            { id: 'Participant_2', name: 'Not a process' },
          ],
        },
        process: {
          id: 'Process_1',
          name: 'Process 1',
          isExecutable: false,
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'shape_Participant_1',
                bpmnElement: 'Participant_1',
                isHorizontal: true,
                Bounds: { x: 158, y: 50, width: 1620, height: 430 },
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyPools(json, 1);

    const pool = model.pools[0];
    verifyShape(pool, {
      shapeId: 'shape_Participant_1',
      bpmnElementId: 'Participant_1',
      bpmnElementName: 'Pool 1',
      bpmnElementKind: ShapeBpmnElementKind.POOL,
      parentId: undefined,
      isHorizontal: true,
      bounds: {
        x: 158,
        y: 50,
        width: 1620,
        height: 430,
      },
    });
  });

  it('json containing one process and flownode without lane and related participant', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          participant: [
            { id: 'Participant_1', name: 'Pool 1', processRef: 'Process_1' },
            { id: 'Participant_2', name: 'Not a process' },
          ],
        },
        process: {
          id: 'Process_1',
          name: 'Process 1',
          isExecutable: false,
          startEvent: { id: 'event_id_0' },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'shape_Participant_1',
                bpmnElement: 'Participant_1',
                isHorizontal: true,
                Bounds: { x: 158, y: 50, width: 1620, height: 630 },
              },
              {
                id: 'shape_startEvent_id_0',
                bpmnElement: 'event_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyPoolsAndFlowNodes(json, 1, 1);

    const pool = model.pools[0];
    verifyShape(pool, {
      shapeId: 'shape_Participant_1',
      bpmnElementId: 'Participant_1',
      bpmnElementName: 'Pool 1',
      bpmnElementKind: ShapeBpmnElementKind.POOL,
      parentId: undefined,
      isHorizontal: true,
      bounds: {
        x: 158,
        y: 50,
        width: 1620,
        height: 630,
      },
    });

    const flowNode = model.flowNodes[0];
    verifyShape(flowNode, {
      shapeId: 'shape_startEvent_id_0',
      bpmnElementId: 'event_id_0',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      parentId: 'Participant_1',
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it('json containing one process, bpmn elements but no participant', () => {
    // json generated from https://github.com/bpmn-miwg/bpmn-miwg-test-suite/blob/b1569235563b58d7216caa880c447bafee3e23cf/Reference/A.1.0.bpmn
    const json = {
      definitions: {
        id: '_1373649849716',
        name: 'A.1.0',
        targetNamespace: 'http://www.trisotech.com/definitions/_1373649849716',
        process: {
          isExecutable: false,
          id: 'WFP-6-',
          startEvent: {
            name: 'Start Event',
            id: '_93c466ab-b271-4376-a427-f4c353d55ce8',
            outgoing: '_e16564d7-0c4c-413e-95f6-f668a3f851fb',
          },
          task: [
            {
              completionQuantity: 1,
              isForCompensation: false,
              startQuantity: 1,
              name: 'Task 1',
              id: '_ec59e164-68b4-4f94-98de-ffb1c58a84af',
              incoming: '_e16564d7-0c4c-413e-95f6-f668a3f851fb',
              outgoing: '_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599',
            },
            {
              completionQuantity: 1,
              isForCompensation: false,
              startQuantity: 1,
              name: 'Task 2',
              id: '_820c21c0-45f3-473b-813f-06381cc637cd',
              incoming: '_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599',
              outgoing: '_2aa47410-1b0e-4f8b-ad54-d6f798080cb4',
            },
            {
              completionQuantity: 1,
              isForCompensation: false,
              startQuantity: 1,
              name: 'Task 3',
              id: '_e70a6fcb-913c-4a7b-a65d-e83adc73d69c',
              incoming: '_2aa47410-1b0e-4f8b-ad54-d6f798080cb4',
              outgoing: '_8e8fe679-eb3b-4c43-a4d6-891e7087ff80',
            },
          ],
          endEvent: {
            name: 'End Event',
            id: '_a47df184-085b-49f7-bb82-031c84625821',
            incoming: '_8e8fe679-eb3b-4c43-a4d6-891e7087ff80',
          },
          sequenceFlow: [
            {
              sourceRef: '_93c466ab-b271-4376-a427-f4c353d55ce8',
              targetRef: '_ec59e164-68b4-4f94-98de-ffb1c58a84af',
              name: '',
              id: '_e16564d7-0c4c-413e-95f6-f668a3f851fb',
            },
            {
              sourceRef: '_ec59e164-68b4-4f94-98de-ffb1c58a84af',
              targetRef: '_820c21c0-45f3-473b-813f-06381cc637cd',
              name: '',
              id: '_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599',
            },
            {
              sourceRef: '_820c21c0-45f3-473b-813f-06381cc637cd',
              targetRef: '_e70a6fcb-913c-4a7b-a65d-e83adc73d69c',
              name: '',
              id: '_2aa47410-1b0e-4f8b-ad54-d6f798080cb4',
            },
            {
              sourceRef: '_e70a6fcb-913c-4a7b-a65d-e83adc73d69c',
              targetRef: '_a47df184-085b-49f7-bb82-031c84625821',
              name: '',
              id: '_8e8fe679-eb3b-4c43-a4d6-891e7087ff80',
            },
          ],
        },
        BPMNDiagram: {
          documentation: '',
          id: 'Trisotech_Visio-_6',
          name: 'A.1.0',
          resolution: 96.00000267028808,
          BPMNPlane: {
            bpmnElement: 'WFP-6-',
            BPMNShape: [
              {
                bpmnElement: '_93c466ab-b271-4376-a427-f4c353d55ce8',
                id: 'S1373649849857__93c466ab-b271-4376-a427-f4c353d55ce8',
                Bounds: {
                  height: 30,
                  width: 30,
                  x: 186,
                  y: 336,
                },
                BPMNLabel: {
                  labelStyle: 'LS1373649849858',
                  Bounds: {
                    height: 12.804751171875008,
                    width: 94.93333333333335,
                    x: 153.67766754457273,
                    y: 371.3333333333333,
                  },
                },
              },
              {
                bpmnElement: '_ec59e164-68b4-4f94-98de-ffb1c58a84af',
                id: 'S1373649849859__ec59e164-68b4-4f94-98de-ffb1c58a84af',
                Bounds: {
                  height: 68,
                  width: 83,
                  x: 258,
                  y: 317,
                },
                BPMNLabel: {
                  labelStyle: 'LS1373649849858',
                  Bounds: {
                    height: 12.804751171875008,
                    width: 72.48293963254594,
                    x: 263.3333333333333,
                    y: 344.5818763825664,
                  },
                },
              },
              {
                bpmnElement: '_820c21c0-45f3-473b-813f-06381cc637cd',
                id: 'S1373649849860__820c21c0-45f3-473b-813f-06381cc637cd',
                Bounds: {
                  height: 68,
                  width: 83,
                  x: 390,
                  y: 317,
                },
                BPMNLabel: {
                  labelStyle: 'LS1373649849858',
                  Bounds: {
                    height: 12.804751171875008,
                    width: 72.48293963254594,
                    x: 395.3333333333333,
                    y: 344.5818763825664,
                  },
                },
              },
              {
                bpmnElement: '_e70a6fcb-913c-4a7b-a65d-e83adc73d69c',
                id: 'S1373649849861__e70a6fcb-913c-4a7b-a65d-e83adc73d69c',
                Bounds: {
                  height: 68,
                  width: 83,
                  x: 522,
                  y: 317,
                },
                BPMNLabel: {
                  labelStyle: 'LS1373649849858',
                  Bounds: {
                    height: 12.804751171875008,
                    width: 72.48293963254594,
                    x: 527.3333333333334,
                    y: 344.5818763825664,
                  },
                },
              },
              {
                bpmnElement: '_a47df184-085b-49f7-bb82-031c84625821',
                id: 'S1373649849862__a47df184-085b-49f7-bb82-031c84625821',
                Bounds: {
                  height: 32,
                  width: 32,
                  x: 648,
                  y: 335,
                },
                BPMNLabel: {
                  labelStyle: 'LS1373649849858',
                  Bounds: {
                    height: 12.804751171875008,
                    width: 94.93333333333335,
                    x: 616.5963254593177,
                    y: 372.3333333333333,
                  },
                },
              },
            ],
            BPMNEdge: [
              {
                bpmnElement: '_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599',
                id: 'E1373649849864__d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599',
                waypoint: [
                  {
                    x: 342,
                    y: 351,
                  },
                  {
                    x: 390,
                    y: 351,
                  },
                ],
                BPMNLabel: '',
              },
              {
                bpmnElement: '_e16564d7-0c4c-413e-95f6-f668a3f851fb',
                id: 'E1373649849865__e16564d7-0c4c-413e-95f6-f668a3f851fb',
                waypoint: [
                  {
                    x: 216,
                    y: 351,
                  },
                  {
                    x: 234,
                    y: 351,
                  },
                  {
                    x: 258,
                    y: 351,
                  },
                ],
                BPMNLabel: '',
              },
              {
                bpmnElement: '_2aa47410-1b0e-4f8b-ad54-d6f798080cb4',
                id: 'E1373649849866__2aa47410-1b0e-4f8b-ad54-d6f798080cb4',
                waypoint: [
                  {
                    x: 474,
                    y: 351,
                  },
                  {
                    x: 522,
                    y: 351,
                  },
                ],
                BPMNLabel: '',
              },
              {
                bpmnElement: '_8e8fe679-eb3b-4c43-a4d6-891e7087ff80',
                id: 'E1373649849867__8e8fe679-eb3b-4c43-a4d6-891e7087ff80',
                waypoint: [
                  {
                    x: 606,
                    y: 351,
                  },
                  {
                    x: 624,
                    y: 351,
                  },
                  {
                    x: 648,
                    y: 351,
                  },
                ],
                BPMNLabel: '',
              },
            ],
          },
          BPMNLabelStyle: {
            id: 'LS1373649849858',
            Font: {
              isBold: false,
              isItalic: false,
              isStrikeThrough: false,
              isUnderline: false,
              name: 'Arial',
              size: 11,
            },
          },
        },
      },
    };

    const model = parseJsonAndExpect(json, 0, 0, 5, 4);

    model.flowNodes.map(flowNode => flowNode.bpmnElement).forEach(bpmnElement => expect(bpmnElement.parentId).toBe('WFP-6-'));
  });
});
