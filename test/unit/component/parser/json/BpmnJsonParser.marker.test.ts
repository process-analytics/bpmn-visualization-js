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
import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { TProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/rootElement';
import { TStandardLoopCharacteristics } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/loopCharacteristics';
import { ShapeBpmnMarkerKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnMarkerKind';

describe.each([
  ['callActivity', ShapeBpmnElementKind.CALL_ACTIVITY],
  ['subProcess', ShapeBpmnElementKind.SUB_PROCESS],
  ['task', ShapeBpmnElementKind.TASK],
  ['serviceTask', ShapeBpmnElementKind.TASK_SERVICE],
  ['userTask', ShapeBpmnElementKind.TASK_USER],
  ['receiveTask', ShapeBpmnElementKind.TASK_RECEIVE],

  // TODO: To uncomment when it's supported
  //['sendTask', ShapeBpmnElementKind.TASK_SEND],
  //['manualTask', ShapeBpmnElementKind.MANUAL_TASK],
  //['businessRuleTask', ShapeBpmnElementKind.BUSINESS_RULE_TASK],
  //['scriptTask', ShapeBpmnElementKind.SCRIPT_TASK],
  //['adHocSubProcess', ShapeBpmnElementKind.AD_HOC_SUB_PROCESS],
  //['transaction', ShapeBpmnElementKind.TRANSACTION],
])('parse bpmn as json for %s', (bpmnKind: string, expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
  it.each([
    ['empty string', ''],
    ['object', {}],
    ['array', ['', {}]],
  ])(
    `should convert as Shape with Loop marker, when 'standardLoopCharacteristics' is an attribute (as %s) of '${bpmnKind}'`,
    (title: string, standardLoopCharacteristics: string | TStandardLoopCharacteristics | (string | TStandardLoopCharacteristics)[]) => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {},
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: `shape_${bpmnKind}_id_0`,
                bpmnElement: `${bpmnKind}_id_0`,
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
            },
          },
        },
      };
      (json.definitions.process as TProcess)[bpmnKind] = {
        id: `${bpmnKind}_id_0`,
        name: `${bpmnKind} name`,
        standardLoopCharacteristics: standardLoopCharacteristics,
      };

      const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_${bpmnKind}_id_0`,
        bpmnElementId: `${bpmnKind}_id_0`,
        bpmnElementName: `${bpmnKind} name`,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bpmnElementMarker: ShapeBpmnMarkerKind.LOOP,
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
