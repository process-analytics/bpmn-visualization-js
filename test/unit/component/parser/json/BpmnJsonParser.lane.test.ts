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
import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/internal';
import { expectAsWarning, parseJson, parseJsonAndExpectOnlyLanes, parsingMessageCollector, verifyShape } from './JsonTestUtils';
import { LaneUnknownFlowNodeRefWarning } from '../../../../../src/component/parser/json/warnings';

describe('parse bpmn as json for lane', () => {
  it('json containing one process with a single lane without flowNodeRef', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          lane: { id: 'Lane_12u5n6x' },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: {
              id: 'Lane_1h5yeu4_di',
              bpmnElement: 'Lane_12u5n6x',
              isHorizontal: true,
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyLanes(json, 1);

    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isHorizontal: true,
    });
  });

  it('json containing one process with a single lane with flowNodeRef as object & flowNode already parsed', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          lane: { id: 'Lane_12u5n6x', flowNodeRef: 'event_id_0' },
          startEvent: { id: 'event_id_0' },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'Lane_1h5yeu4_di',
                bpmnElement: 'Lane_12u5n6x',
                isHorizontal: true,
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
              {
                id: 'event_id_0_di',
                bpmnElement: 'event_id_0',
                Bounds: { x: 11, y: 11, width: 11, height: 11 },
              },
            ],
          },
        },
      },
    };

    const model = parseJson(json);

    expect(model.lanes).toHaveLength(1);
    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isHorizontal: true,
    });

    expect(model.flowNodes).toHaveLength(1);
    expect(model.flowNodes[0].bpmnElement.parentId).toBe('Lane_12u5n6x');
  });

  it('json containing one process with a single lane with flowNodeRef as object & flowNode not parsed', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          lane: { id: 'Lane_12u5n6x', flowNodeRef: 'event_id_0' },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: {
              id: 'Lane_1h5yeu4_di',
              bpmnElement: 'Lane_12u5n6x',
              isHorizontal: true,
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyLanes(json, 1, 1);

    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isHorizontal: true,
    });

    const warning = expectAsWarning<LaneUnknownFlowNodeRefWarning>(parsingMessageCollector.getWarnings()[0], LaneUnknownFlowNodeRefWarning);
    expect(warning.laneId).toBe('Lane_12u5n6x');
    expect(warning.flowNodeRef).toBe('event_id_0');
  });

  it('json containing one process with a single lane with flowNodeRef as object & flowNode not parsed', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          lane: { id: 'Lane_12u5n6x', flowNodeRef: 'event_id_0' },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: {
              id: 'Lane_1h5yeu4_di',
              bpmnElement: 'Lane_12u5n6x',
              isHorizontal: true,
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          },
        },
      },
    };

    const model = parseJson(json);

    expect(model.lanes).toHaveLength(1);
    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isHorizontal: true,
    });
  });

  it('json containing one process with a single lane with flowNodeRef as array', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          lane: { id: 'Lane_12u5n6x', flowNodeRef: ['event_id_0'] },
          startEvent: { id: 'event_id_0' },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'Lane_1h5yeu4_di',
                bpmnElement: 'Lane_12u5n6x',
                isHorizontal: true,
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
              {
                id: 'event_id_0_di',
                bpmnElement: 'event_id_0',
                Bounds: { x: 11, y: 11, width: 11, height: 11 },
              },
            ],
          },
        },
      },
    };

    const model = parseJson(json);

    expect(model.lanes).toHaveLength(1);
    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isHorizontal: true,
    });

    expect(model.flowNodes).toHaveLength(1);
    expect(model.flowNodes[0].bpmnElement.parentId).toBe('Lane_12u5n6x');
  });

  it('json containing one process declared as array with a laneSet', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: [
          {
            laneSet: {
              id: 'LaneSet_1i59xiy',
              lane: { id: 'Lane_12u5n6x' },
            },
          },
        ],
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: {
              id: 'Lane_1h5yeu4_di',
              bpmnElement: 'Lane_12u5n6x',
              isHorizontal: true,
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyLanes(json, 1);

    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isHorizontal: true,
    });
  });

  it('json containing one process with an array of lanes with & without name', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          laneSet: {
            id: 'LaneSet_1i59xiy',
            lane: [
              {
                id: 'Lane_164yevk',
                name: 'Customer',
                flowNodeRef: 'event_id_0',
              },
              { id: 'Lane_12u5n6x' },
            ],
          },
          startEvent: { id: 'event_id_0' },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'Lane_164yevk_di',
                bpmnElement: 'Lane_164yevk',
                isHorizontal: true,
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
              {
                id: 'Lane_12u5n6x_di',
                bpmnElement: 'Lane_12u5n6x',
                isHorizontal: true,
                Bounds: { x: 666, y: 222, width: 22, height: 33 },
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyLanes(json, 2);

    verifyShape(model.lanes[0], {
      shapeId: 'Lane_164yevk_di',
      bpmnElementId: 'Lane_164yevk',
      bpmnElementName: 'Customer',
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isHorizontal: true,
    });
    verifyShape(model.lanes[1], {
      shapeId: 'Lane_12u5n6x_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      bounds: {
        x: 666,
        y: 222,
        width: 22,
        height: 33,
      },
      isHorizontal: true,
    });
  });

  describe.each([
    ['vertical', false],
    ['horizontal', true],
  ])('parse bpmn as json for %s lane', (title: string, isHorizontal: boolean) => {
    it(`json containing one process declared as array with a ${title} laneSet with childLaneSet`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: [
            {
              id: 'Process_07bsa3h',
              laneSet: {
                id: 'LaneSet_1rqtug0',
                lane: [
                  {
                    id: 'Lane_040h8y5',
                    childLaneSet: {
                      id: 'LaneSet_1pyljtf',
                      lane: [
                        {
                          id: 'Lane_06so1v5',
                        },
                        {
                          id: 'Lane_0amyaod',
                          childLaneSet: {
                            id: 'LaneSet_0lzaj18',
                          },
                        },
                      ],
                    },
                  },
                  {
                    id: 'Lane_1gdg64y',
                  },
                ],
              },
            },
          ],
          BPMNDiagram: {
            id: 'BPMNDiagram_1',
            BPMNPlane: {
              id: 'BPMNPlane_1',
              bpmnElement: 'Collaboration_0um5kdl',
              BPMNShape: [
                {
                  id: 'Lane_1gdg64y_di',
                  bpmnElement: 'Lane_1gdg64y',
                  isHorizontal: isHorizontal,
                  Bounds: {
                    x: 186,
                    y: 340,
                    width: 584,
                    height: 200,
                  },
                },
                {
                  id: 'Lane_040h8y5_di',
                  bpmnElement: 'Lane_040h8y5',
                  isHorizontal: isHorizontal,
                  Bounds: {
                    x: 186,
                    y: 80,
                    width: 584,
                    height: 260,
                  },
                },
                {
                  id: 'Lane_0amyaod_di',
                  bpmnElement: 'Lane_0amyaod',
                  isHorizontal: isHorizontal,
                  Bounds: {
                    x: 216,
                    y: 214,
                    width: 554,
                    height: 126,
                  },
                },
                {
                  id: 'Lane_06so1v5_di',
                  bpmnElement: 'Lane_06so1v5',
                  isHorizontal: isHorizontal,
                  Bounds: {
                    x: 216,
                    y: 80,
                    width: 554,
                    height: 134,
                  },
                },
              ],
            },
          },
        },
      };

      const model = parseJsonAndExpectOnlyLanes(json, 4);

      verifyShape(model.lanes[0], {
        shapeId: 'Lane_1gdg64y_di',
        bpmnElementId: 'Lane_1gdg64y',
        bpmnElementName: undefined,
        parentId: 'Process_07bsa3h',
        bpmnElementKind: ShapeBpmnElementKind.LANE,
        bounds: {
          x: 186,
          y: 340,
          width: 584,
          height: 200,
        },
        isHorizontal: isHorizontal,
      });

      verifyShape(model.lanes[1], {
        shapeId: 'Lane_040h8y5_di',
        bpmnElementId: 'Lane_040h8y5',
        bpmnElementName: undefined,
        parentId: 'Process_07bsa3h',
        bpmnElementKind: ShapeBpmnElementKind.LANE,
        bounds: {
          x: 186,
          y: 80,
          width: 584,
          height: 260,
        },
        isHorizontal: isHorizontal,
      });

      verifyShape(model.lanes[2], {
        shapeId: 'Lane_0amyaod_di',
        bpmnElementId: 'Lane_0amyaod',
        bpmnElementName: undefined,
        parentId: 'Lane_040h8y5',
        bpmnElementKind: ShapeBpmnElementKind.LANE,
        bounds: {
          x: 216,
          y: 214,
          width: 554,
          height: 126,
        },
        isHorizontal: isHorizontal,
      });

      verifyShape(model.lanes[3], {
        shapeId: 'Lane_06so1v5_di',
        bpmnElementId: 'Lane_06so1v5',
        bpmnElementName: undefined,
        parentId: 'Lane_040h8y5',
        bpmnElementKind: ShapeBpmnElementKind.LANE,
        bounds: {
          x: 216,
          y: 80,
          width: 554,
          height: 134,
        },
        isHorizontal: isHorizontal,
      });
    });

    it(`json containing one process with a ${title} lane`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {
            lane: { id: 'Lane_12u5n6x' },
          },
          BPMNDiagram: {
            BPMNPlane: {
              BPMNShape: {
                id: 'Lane_1h5yeu4_di',
                bpmnElement: 'Lane_12u5n6x',
                isHorizontal: isHorizontal,
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
            },
          },
        },
      };

      const model = parseJsonAndExpectOnlyLanes(json, 1);

      verifyShape(model.lanes[0], {
        shapeId: 'Lane_1h5yeu4_di',
        bpmnElementId: 'Lane_12u5n6x',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.LANE,
        parentId: undefined,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
        isHorizontal: isHorizontal,
      });
    });
  });

  it("json containing one process with a lane without 'isHorizontal' attribute", () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          lane: { id: 'Lane_12u5n6x' },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: {
              id: 'Lane_1h5yeu4_di',
              bpmnElement: 'Lane_12u5n6x',
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyLanes(json, 1);

    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      parentId: undefined,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
      isHorizontal: true,
    });
  });
});
