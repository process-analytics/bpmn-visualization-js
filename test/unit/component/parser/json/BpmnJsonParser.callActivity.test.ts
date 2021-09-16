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
import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { TCallActivity } from '../../../../../src/model/bpmn/json/baseElement/flowNode/activity/activity';
import { ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnMarkerKind } from '../../../../../src/model/bpmn/internal/shape';
import { GlobalTaskKind } from '../../../../../src/model/bpmn/internal/shape/shape-utils';

describe('parse bpmn as json for callActivity', () => {
  describe('parse bpmn as json for callActivity calling process', () => {
    describe.each([
      ['expanded', true, []],
      ['collapsed', false, [ShapeBpmnMarkerKind.EXPAND]],
    ])('parse bpmn as json for %s callActivity calling process', (expandedKind: string, isExpanded: boolean, expectedBpmnElementMarkers: ShapeBpmnMarkerKind[]) => {
      const callActivityJson = {
        id: `call_activity_id_0`,
        name: `call activity name`,
        calledElement: 'process_2_id',
      };
      it.each([
        ['object', callActivityJson],
        ['array', [callActivityJson]],
      ])(
        `should convert as Shape, when a ${expandedKind} call activity (calling process) is an attribute (as %s) of 'process' (as array)`,
        (title, callActivity: TCallActivity | TCallActivity[]) => {
          const json = {
            definitions: {
              targetNamespace: '',
              process: [
                {
                  id: 'process 1',
                  callActivity: callActivity,
                },
                { id: 'process_2_id' },
              ],
              BPMNDiagram: {
                BPMNPlane: {
                  BPMNShape: {
                    id: `shape_call_activity_id_0`,
                    bpmnElement: `call_activity_id_0`,
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                    isExpanded: isExpanded,
                  },
                },
              },
            },
          };

          const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

          verifyShape(model.flowNodes[0], {
            shapeId: 'shape_call_activity_id_0',
            parentId: 'process 1',
            bpmnElementId: 'call_activity_id_0',
            bpmnElementName: 'call activity name',
            bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
            bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
            bpmnElementMarkers: expectedBpmnElementMarkers,
            bounds: {
              x: 362,
              y: 232,
              width: 36,
              height: 45,
            },
          });
        },
      );

      it(`should convert as Shape, when a ${expandedKind} call activity (calling process) (with/without name) is an attribute of 'process'`, () => {
        const json = {
          definitions: {
            targetNamespace: '',
            process: [
              {
                id: 'process 1',
                callActivity: [
                  {
                    id: `call_activity_id_0`,
                    name: `call activity name`,
                    calledElement: 'process_2_id',
                  },
                  {
                    id: `call_activity_id_1`,
                    calledElement: 'process_2_id',
                  },
                ],
              },
              { id: 'process_2_id' },
            ],
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: `shape_call_activity_id_0`,
                    bpmnElement: `call_activity_id_0`,
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                    isExpanded: true,
                  },
                  {
                    id: `shape_call_activity_id_1`,
                    bpmnElement: `call_activity_id_1`,
                    Bounds: { x: 365, y: 235, width: 35, height: 46 },
                    isExpanded: true,
                  },
                ],
              },
            },
          },
        };

        const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_call_activity_id_0`,
          parentId: 'process 1',
          bpmnElementId: `call_activity_id_0`,
          bpmnElementName: `call activity name`,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bounds: {
            x: 362,
            y: 232,
            width: 36,
            height: 45,
          },
        });
        verifyShape(model.flowNodes[1], {
          shapeId: `shape_call_activity_id_1`,
          parentId: 'process 1',
          bpmnElementId: `call_activity_id_1`,
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
          bounds: {
            x: 365,
            y: 235,
            width: 35,
            height: 46,
          },
        });
      });
    });
  });

  describe('parse bpmn as json for callActivity calling global task', () => {
    it.each([['globalTask'], ['globalBusinessRuleTask'], ['globalManualTask'], ['globalScriptTask'], ['globalUserTask']])(
      `should convert, when a call activity (calling %s) is an attribute of 'process'`,
      (globalTaskKind: string) => {
        const json = {
          definitions: {
            targetNamespace: '',
            process: {
              id: 'process 1',
              callActivity: {
                id: `call_activity_id_0`,
                name: `call activity name`,
                calledElement: 'task_id',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: `shape_call_activity_id_0`,
                  bpmnElement: `call_activity_id_0`,
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        json.definitions[globalTaskKind] = { id: 'task_id' };

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_call_activity_id_0`,
          parentId: 'process 1',
          bpmnElementId: `call_activity_id_0`,
          bpmnElementName: `call activity name`,
          bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
          bpmnElementCallActivityKind: ShapeBpmnCallActivityKind.CALLING_GLOBAL_TASK,
          bpmnElementGlobalTaskKind: globalTaskKind as GlobalTaskKind,
          bounds: {
            x: 362,
            y: 232,
            width: 36,
            height: 45,
          },
        });
      },
    );
  });
});
