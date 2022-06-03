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

import { ShapeBpmnElementKind, ShapeUtil } from '../../../../../src/model/bpmn/internal';

/** Internal model */
import { Waypoint } from '../../../../../src/model/bpmn/internal/edge/edge';
import { MessageVisibleKind } from '../../../../../src/model/bpmn/internal/edge/kinds';

/** Json model */
import type { BpmnJsonModel } from '../../../../../src/model/bpmn/json/BPMN20';
import * as bpmndi from '../../../../../src/model/bpmn/json/BPMNDI';

/** Test utils */
import { parseJson, parseJsonAndExpectOnlyEdges } from '../../../helpers/JsonTestUtils';
import type { BuildEventParameter, BuildProcessParameter } from '../../../helpers/JsonBuilder';
import { buildDefinitions, EventDefinitionOn } from '../../../helpers/JsonBuilder';
import { verifyEdge } from '../../../helpers/bpmn-model-expect';

describe('parse bpmn as json for message flow', () => {
  it(`should convert as Edge, when an message flow is an attribute (as object) of 'collaboration' (as object)`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          id: 'collaboration_id_0',
          messageFlow: {
            id: 'messageFlow_id_0',
            name: 'Message Flow 0',
            sourceRef: 'sourceRef_id',
            targetRef: 'targetRef_id',
          },
        },
        process: '',
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: {
              id: 'edge_messageFlow_id_0',
              bpmnElement: 'messageFlow_id_0',
              waypoint: [{ x: 10, y: 10 }],
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_messageFlow_id_0',
      bpmnElementId: 'messageFlow_id_0',
      bpmnElementName: 'Message Flow 0',
      bpmnElementSourceRefId: 'sourceRef_id',
      bpmnElementTargetRefId: 'targetRef_id',
      waypoints: [new Waypoint(10, 10)],
    });
  });

  it(`should convert as Edge, when an message flow (with/without name) is an attribute (as array) of 'collaboration'`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          id: 'collaboration_id_0',
          messageFlow: [
            {
              id: 'messageFlow_id_0',
              name: 'Message Flow 0',
              sourceRef: 'sourceRef_id',
              targetRef: 'targetRef_id',
            },
            {
              id: 'messageFlow_id_1',
              sourceRef: 'messageFlow_id_1',
              targetRef: 'targetRef_id_1',
            },
          ],
        },
        process: '',
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: [
              {
                id: 'edge_messageFlow_id_0',
                bpmnElement: 'messageFlow_id_0',
                waypoint: [{ x: 10, y: 10 }],
              },
              {
                id: 'edge_messageFlow_id_1',
                bpmnElement: 'messageFlow_id_1',
                waypoint: [{ x: 10, y: 10 }],
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_messageFlow_id_0',
      bpmnElementId: 'messageFlow_id_0',
      bpmnElementName: 'Message Flow 0',
      bpmnElementSourceRefId: 'sourceRef_id',
      bpmnElementTargetRefId: 'targetRef_id',
      waypoints: [new Waypoint(10, 10)],
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_messageFlow_id_1',
      bpmnElementId: 'messageFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'messageFlow_id_1',
      bpmnElementTargetRefId: 'targetRef_id_1',
      waypoints: [new Waypoint(10, 10)],
    });
  });

  it(`should convert as Edge, when an message flow (with one & several waypoints) is an attribute (as array) of 'collaboration'`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          id: 'collaboration_id_0',
          messageFlow: [
            {
              id: 'messageFlow_id_0',
              sourceRef: 'sourceRef_id',
              targetRef: 'targetRef_id',
            },
            {
              id: 'messageFlow_id_1',
              sourceRef: 'sourceRef_id_1',
              targetRef: 'targetRef_id_1',
            },
          ],
        },
        process: '',
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: [
              {
                id: 'edge_messageFlow_id_0',
                bpmnElement: 'messageFlow_id_0',
                waypoint: [
                  {
                    x: 1,
                    y: 1,
                  },
                ],
              },
              {
                id: 'edge_messageFlow_id_1',
                bpmnElement: 'messageFlow_id_1',
                waypoint: [
                  {
                    x: 2,
                    y: 2,
                  },
                  {
                    x: 3,
                    y: 3,
                  },
                ],
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_messageFlow_id_0',
      bpmnElementId: 'messageFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id',
      bpmnElementTargetRefId: 'targetRef_id',
      waypoints: [new Waypoint(1, 1)],
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_messageFlow_id_1',
      bpmnElementId: 'messageFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id_1',
      bpmnElementTargetRefId: 'targetRef_id_1',
      waypoints: [new Waypoint(2, 2), new Waypoint(3, 3)],
    });
  });

  it(`should convert as Edge, when none/initiating/non-initiating message flows are an attribute (as array) of 'collaboration'`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          id: 'collaboration_id_0',
          messageFlow: [
            {
              id: 'messageFlow_id_0',
              sourceRef: 'sourceRef_id',
              targetRef: 'targetRef_id',
            },
            {
              id: 'messageFlow_id_1',
              sourceRef: 'sourceRef_id_1',
              targetRef: 'targetRef_id_1',
            },
            {
              id: 'messageFlow_id_2',
              sourceRef: 'sourceRef_id_2',
              targetRef: 'targetRef_id_2',
            },
          ],
        },
        process: '',
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: [
              {
                id: 'edge_messageFlow_id_0',
                bpmnElement: 'messageFlow_id_0',
                waypoint: [{ x: 10, y: 10 }],
              },
              {
                id: 'edge_messageFlow_id_1',
                bpmnElement: 'messageFlow_id_1',
                messageVisibleKind: bpmndi.MessageVisibleKind.nonInitiating,
                waypoint: [{ x: 10, y: 10 }],
              },
              {
                id: 'edge_messageFlow_id_2',
                bpmnElement: 'messageFlow_id_2',
                messageVisibleKind: bpmndi.MessageVisibleKind.initiating,
                waypoint: [{ x: 10, y: 10 }],
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 3);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_messageFlow_id_0',
      bpmnElementId: 'messageFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id',
      bpmnElementTargetRefId: 'targetRef_id',
      messageVisibleKind: MessageVisibleKind.NONE,
      waypoints: [new Waypoint(10, 10)],
    });
    verifyEdge(model.edges[1], {
      edgeId: 'edge_messageFlow_id_1',
      bpmnElementId: 'messageFlow_id_1',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id_1',
      bpmnElementTargetRefId: 'targetRef_id_1',
      messageVisibleKind: MessageVisibleKind.NON_INITIATING,
      waypoints: [new Waypoint(10, 10)],
    });
    verifyEdge(model.edges[2], {
      edgeId: 'edge_messageFlow_id_2',
      bpmnElementId: 'messageFlow_id_2',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'sourceRef_id_2',
      bpmnElementTargetRefId: 'targetRef_id_2',
      messageVisibleKind: MessageVisibleKind.INITIATING,
      waypoints: [new Waypoint(10, 10)],
    });
  });

  describe('Various combinations of source and target', () => {
    it.each([
      [ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.EVENT_START],
      [ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.POOL],
      [ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.TASK],
      [ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.CALL_ACTIVITY],
      [ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
      [ShapeBpmnElementKind.TASK, ShapeBpmnElementKind.EVENT_START],
      [ShapeBpmnElementKind.TASK, ShapeBpmnElementKind.POOL],
      [ShapeBpmnElementKind.TASK, ShapeBpmnElementKind.TASK],
      [ShapeBpmnElementKind.TASK, ShapeBpmnElementKind.CALL_ACTIVITY],
      [ShapeBpmnElementKind.TASK, ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
      [ShapeBpmnElementKind.CALL_ACTIVITY, ShapeBpmnElementKind.EVENT_START],
      [ShapeBpmnElementKind.CALL_ACTIVITY, ShapeBpmnElementKind.POOL],
      [ShapeBpmnElementKind.CALL_ACTIVITY, ShapeBpmnElementKind.TASK],
      [ShapeBpmnElementKind.CALL_ACTIVITY, ShapeBpmnElementKind.CALL_ACTIVITY],
      [ShapeBpmnElementKind.CALL_ACTIVITY, ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
      [ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ShapeBpmnElementKind.EVENT_START],
      [ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ShapeBpmnElementKind.POOL],
      [ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ShapeBpmnElementKind.TASK],
      [ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ShapeBpmnElementKind.CALL_ACTIVITY],
      [ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
      [ShapeBpmnElementKind.EVENT_BOUNDARY, ShapeBpmnElementKind.EVENT_START],
      [ShapeBpmnElementKind.EVENT_BOUNDARY, ShapeBpmnElementKind.POOL],
      [ShapeBpmnElementKind.EVENT_BOUNDARY, ShapeBpmnElementKind.TASK],
      [ShapeBpmnElementKind.EVENT_BOUNDARY, ShapeBpmnElementKind.CALL_ACTIVITY],
      [ShapeBpmnElementKind.EVENT_BOUNDARY, ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
      [ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.EVENT_START],
      [ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.POOL],
      [ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.TASK],
      [ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.CALL_ACTIVITY],
      [ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
    ])(`should convert as Edge, when an message flow has %s as source and %s as target`, (sourceKind, targetKind) => {
      const json: BpmnJsonModel = buildDefinitions({
        withParticipant: true,
        messageFlows: {
          id: 'messageFlow_id_0',
          name: 'Message Flow 0',
          sourceRef: 'sourceRef_id',
          targetRef: 'targetRef_id',
        },
        process: [buildProcessParameter(sourceKind, 'sourceRef_id'), buildProcessParameter(targetKind, 'targetRef_id')],
      });

      const model = parseJson(json);
      expect(model.edges).toHaveLength(1);

      verifyEdge(model.edges[0], {
        edgeId: 'edge_messageFlow_id_0',
        bpmnElementId: 'messageFlow_id_0',
        bpmnElementName: 'Message Flow 0',
        bpmnElementSourceRefId: 'sourceRef_id',
        bpmnElementTargetRefId: 'targetRef_id',
        waypoints: [new Waypoint(567, 345), new Waypoint(587, 345)],
      });
    });
  });

  function buildProcessParameter(kind: ShapeBpmnElementKind, id: string): BuildProcessParameter {
    if (kind === ShapeBpmnElementKind.POOL) {
      return {
        id,
      };
    } else if (ShapeUtil.isEvent(kind)) {
      const isBoundaryEvent = kind === ShapeBpmnElementKind.EVENT_BOUNDARY;
      const eventParameter: BuildEventParameter = isBoundaryEvent
        ? {
            bpmnKind: kind,
            isInterrupting: true,
            attachedToRef: 'task_id_0',
            eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT },
          }
        : {
            bpmnKind: kind,
            eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT },
          };

      return {
        event: eventParameter,
        task: isBoundaryEvent ? { id: 'task_id_0' } : undefined,
      };
    } else {
      return {
        task: { id },
      };
    }
  }
});
