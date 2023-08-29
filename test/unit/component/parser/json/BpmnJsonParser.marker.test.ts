/*
Copyright 2020 Bonitasoft S.A.

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

import { parseJsonAndExpectOnlyFlowNodes } from '../../../helpers/JsonTestUtils';
import { getExpectedMarkers, verifyShape } from '../../../helpers/bpmn-model-expect';

import type { BpmnJsonModel } from '@lib/model/bpmn/json/bpmn20';
import type { TProcess } from '@lib/model/bpmn/json/baseElement/rootElement/rootElement';
import type { TMultiInstanceLoopCharacteristics, TStandardLoopCharacteristics } from '@lib/model/bpmn/json/baseElement/loopCharacteristics';
import { ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnMarkerKind } from '@lib/model/bpmn/internal';

describe.each([
  ['callActivity', ShapeBpmnElementKind.CALL_ACTIVITY],
  ['subProcess', ShapeBpmnElementKind.SUB_PROCESS],
  ['adHocSubProcess', ShapeBpmnElementKind.SUB_PROCESS],
  ['transaction', ShapeBpmnElementKind.SUB_PROCESS],
  ['task', ShapeBpmnElementKind.TASK],
  ['serviceTask', ShapeBpmnElementKind.TASK_SERVICE],
  ['userTask', ShapeBpmnElementKind.TASK_USER],
  ['receiveTask', ShapeBpmnElementKind.TASK_RECEIVE],
  ['sendTask', ShapeBpmnElementKind.TASK_SEND],
  ['manualTask', ShapeBpmnElementKind.TASK_MANUAL],
  ['scriptTask', ShapeBpmnElementKind.TASK_SCRIPT],
  ['businessRuleTask', ShapeBpmnElementKind.TASK_BUSINESS_RULE],
] as [keyof TProcess, ShapeBpmnElementKind][])(`parse bpmn as json for '%s'`, (bpmnSemanticType: keyof TProcess, expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
  describe.each([
    ['standardLoopCharacteristics', ShapeBpmnMarkerKind.LOOP],
    ['multiInstanceLoopCharacteristics', ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
  ])(`parse bpmn as json for '${bpmnSemanticType}' with '%s'`, (bpmnLoopCharacteristicsKind: string, expectedMarkerKind: ShapeBpmnMarkerKind) => {
    it.each([
      ['empty string', ''],
      ['empty object', {}],
      ['array with empty string & object', ['', {}]],
    ])(
      `should convert as Shape with ${expectedMarkerKind} marker, when '${bpmnLoopCharacteristicsKind}' is an attribute (as %s) of '${bpmnSemanticType}' and BPMNShape is expanded`,
      (
        title: string,
        loopCharacteristics:
          | string
          | TStandardLoopCharacteristics
          | TMultiInstanceLoopCharacteristics
          | (string | TStandardLoopCharacteristics | TMultiInstanceLoopCharacteristics)[],
      ) => {
        const json: BpmnJsonModel = {
          definitions: {
            targetNamespace: '',
            process: {
              [bpmnSemanticType]: { id: `${bpmnSemanticType}_id_0`, name: `${bpmnSemanticType} name`, [bpmnLoopCharacteristicsKind]: loopCharacteristics },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: `shape_${bpmnSemanticType}_id_0`,
                  bpmnElement: `${bpmnSemanticType}_id_0`,
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  isExpanded: true,
                },
              },
            },
          },
        };

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          parentId: expectedShapeBpmnElementKind === ShapeBpmnElementKind.CALL_ACTIVITY ? `${bpmnSemanticType}_id_0` : undefined,
          shapeId: `shape_${bpmnSemanticType}_id_0`,
          bpmnElementId: `${bpmnSemanticType}_id_0`,
          bpmnElementName: `${bpmnSemanticType} name`,
          bpmnElementKind: expectedShapeBpmnElementKind,
          bpmnElementMarkers: getExpectedMarkers([expectedMarkerKind], bpmnSemanticType),
          bpmnElementCallActivityKind: expectedShapeBpmnElementKind === ShapeBpmnElementKind.CALL_ACTIVITY ? ShapeBpmnCallActivityKind.CALLING_PROCESS : undefined,
          bounds: { x: 362, y: 232, width: 36, height: 45 },
        });
      },
    );

    if (expectedShapeBpmnElementKind === ShapeBpmnElementKind.SUB_PROCESS) {
      it(`should convert as Shape with ${expectedMarkerKind} & expand markers, when '${bpmnLoopCharacteristicsKind}' is an attribute of '${bpmnSemanticType}' and BPMNShape is NOT expanded`, () => {
        const json: BpmnJsonModel = {
          definitions: {
            targetNamespace: '',
            process: {
              [bpmnSemanticType]: {
                id: `${bpmnSemanticType}_id_0`,
                name: `${bpmnSemanticType} name`,
                [bpmnLoopCharacteristicsKind]: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: `shape_${bpmnSemanticType}_id_0`,
                  bpmnElement: `${bpmnSemanticType}_id_0`,
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  isExpanded: false,
                },
              },
            },
          },
        };

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_${bpmnSemanticType}_id_0`,
          bpmnElementId: `${bpmnSemanticType}_id_0`,
          bpmnElementName: `${bpmnSemanticType} name`,
          bpmnElementKind: expectedShapeBpmnElementKind,
          bpmnElementMarkers: getExpectedMarkers([expectedMarkerKind, ShapeBpmnMarkerKind.EXPAND], bpmnSemanticType),
          bounds: { x: 362, y: 232, width: 36, height: 45 },
        });
      });
    }
  });
  describe.each([
    [true, ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
    [false, ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
  ])(`parse bpmn as json for '${bpmnSemanticType}' with 'multiInstanceLoopCharacteristics'`, (isSequential: boolean, expectedMarkerKind: ShapeBpmnMarkerKind) => {
    it.each([
      ['object', { isSequential }],
      ['array with object', [{ isSequential }]],
    ])(
      `should convert as Shape with ${expectedMarkerKind} marker, when 'isSequential' is an attribute (as ${isSequential}) of 'multiInstanceLoopCharacteristics' (as %s) of '${bpmnSemanticType}'  and BPMNShape is expanded`,
      (title: string, loopCharacteristics: TMultiInstanceLoopCharacteristics | TMultiInstanceLoopCharacteristics[]) => {
        const json: BpmnJsonModel = {
          definitions: {
            targetNamespace: '',
            process: {
              [bpmnSemanticType]: {
                id: `${bpmnSemanticType}_id_0`,
                name: `${bpmnSemanticType} name`,
                multiInstanceLoopCharacteristics: loopCharacteristics,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: `shape_${bpmnSemanticType}_id_0`,
                  bpmnElement: `${bpmnSemanticType}_id_0`,
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  isExpanded: true,
                },
              },
            },
          },
        };

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          parentId: expectedShapeBpmnElementKind === ShapeBpmnElementKind.CALL_ACTIVITY ? `${bpmnSemanticType}_id_0` : undefined,
          shapeId: `shape_${bpmnSemanticType}_id_0`,
          bpmnElementId: `${bpmnSemanticType}_id_0`,
          bpmnElementName: `${bpmnSemanticType} name`,
          bpmnElementKind: expectedShapeBpmnElementKind,
          bpmnElementMarkers: getExpectedMarkers([expectedMarkerKind], bpmnSemanticType),
          bpmnElementCallActivityKind: expectedShapeBpmnElementKind === ShapeBpmnElementKind.CALL_ACTIVITY ? ShapeBpmnCallActivityKind.CALLING_PROCESS : undefined,
          bounds: { x: 362, y: 232, width: 36, height: 45 },
        });
      },
    );

    if (expectedShapeBpmnElementKind === ShapeBpmnElementKind.SUB_PROCESS || expectedShapeBpmnElementKind === ShapeBpmnElementKind.CALL_ACTIVITY) {
      it(`should convert as Shape with ${expectedMarkerKind} & expand markers, when 'isSequential' is an attribute (as ${isSequential}) of 'multiInstanceLoopCharacteristics' of '${bpmnSemanticType}' and BPMNShape is NOT expanded`, () => {
        const json: BpmnJsonModel = {
          definitions: {
            targetNamespace: '',
            process: {
              [bpmnSemanticType]: {
                id: `${bpmnSemanticType}_id_0`,
                name: `${bpmnSemanticType} name`,
                multiInstanceLoopCharacteristics: { isSequential },
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: `shape_${bpmnSemanticType}_id_0`,
                  bpmnElement: `${bpmnSemanticType}_id_0`,
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  isExpanded: false,
                },
              },
            },
          },
        };

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          parentId: expectedShapeBpmnElementKind === ShapeBpmnElementKind.CALL_ACTIVITY ? `${bpmnSemanticType}_id_0` : undefined,
          shapeId: `shape_${bpmnSemanticType}_id_0`,
          bpmnElementId: `${bpmnSemanticType}_id_0`,
          bpmnElementName: `${bpmnSemanticType} name`,
          bpmnElementKind: expectedShapeBpmnElementKind,
          bpmnElementMarkers: getExpectedMarkers([expectedMarkerKind, ShapeBpmnMarkerKind.EXPAND], bpmnSemanticType),
          bpmnElementCallActivityKind: expectedShapeBpmnElementKind === ShapeBpmnElementKind.CALL_ACTIVITY ? ShapeBpmnCallActivityKind.CALLING_PROCESS : undefined,
          bounds: { x: 362, y: 232, width: 36, height: 45 },
        });
      });
    }
  });
});
