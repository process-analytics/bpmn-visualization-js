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
import { ShapeBpmnElementType } from '../../../../../src/model/bpmn/internal/shape/ShapeBpmnElementType';
import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { TProcess } from '../../../../../src/model/bpmn/json-xsd/baseElement/rootElement/rootElement';

describe.each([
  ['task', ShapeBpmnElementType.TASK],
  ['serviceTask', ShapeBpmnElementType.TASK_SERVICE],
  ['userTask', ShapeBpmnElementType.TASK_USER],
  ['receiveTask', ShapeBpmnElementType.TASK_RECEIVE],
  ['sendTask', ShapeBpmnElementType.TASK_SEND],
  ['manualTask', ShapeBpmnElementType.TASK_MANUAL],
  ['businessRuleTask', ShapeBpmnElementType.TASK_BUSINESS_RULE],
  ['scriptTask', ShapeBpmnElementType.TASK_SCRIPT],
  ['exclusiveGateway', ShapeBpmnElementType.GATEWAY_EXCLUSIVE],
  ['inclusiveGateway', ShapeBpmnElementType.GATEWAY_INCLUSIVE],
  ['parallelGateway', ShapeBpmnElementType.GATEWAY_PARALLEL],
])('parse bpmn as json for %s', (bpmnKind: string, expectedShapeBpmnElementKind: ShapeBpmnElementType) => {
  const processWithFlowNodeAsObject = {} as TProcess;
  processWithFlowNodeAsObject[`${bpmnKind}`] = {
    id: `${bpmnKind}_id_0`,
    name: `${bpmnKind} name`,
  };

  it.each([
    ['object', processWithFlowNodeAsObject],
    ['array', [processWithFlowNodeAsObject]],
  ])(`should convert as Shape, when a ${bpmnKind} is an attribute (as object) of 'process' (as %s)`, (title: string, processJson: TProcess) => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: processJson,
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

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}_id_0`,
      bpmnElementId: `${bpmnKind}_id_0`,
      bpmnElementName: `${bpmnKind} name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it(`should convert as Shape, when a ${bpmnKind} (with/without name) is an attribute (as array) of 'process'`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {},
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: [
              {
                id: `shape_${bpmnKind}_id_0`,
                bpmnElement: `${bpmnKind}_id_0`,
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
              {
                id: `shape_${bpmnKind}_id_1`,
                bpmnElement: `${bpmnKind}_id_1`,
                Bounds: { x: 365, y: 235, width: 35, height: 46 },
              },
            ],
          },
        },
      },
    };
    (json.definitions.process as TProcess)[`${bpmnKind}`] = [
      {
        id: `${bpmnKind}_id_0`,
        name: `${bpmnKind} name`,
      },
      {
        id: `${bpmnKind}_id_1`,
      },
    ];

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}_id_0`,
      bpmnElementId: `${bpmnKind}_id_0`,
      bpmnElementName: `${bpmnKind} name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
    verifyShape(model.flowNodes[1], {
      shapeId: `shape_${bpmnKind}_id_1`,
      bpmnElementId: `${bpmnKind}_id_1`,
      bpmnElementName: undefined,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 365,
        y: 235,
        width: 35,
        height: 46,
      },
    });
  });

  if (expectedShapeBpmnElementKind === ShapeBpmnElementType.TASK_RECEIVE) {
    it(`should convert as Shape, when a ${bpmnKind} (with/without instantiate) is an attribute (as array) of 'process'`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {},
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: `shape_${bpmnKind}_id_0`,
                  bpmnElement: `${bpmnKind}_id_0`,
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
                {
                  id: `shape_${bpmnKind}_id_1`,
                  bpmnElement: `${bpmnKind}_id_1`,
                  Bounds: { x: 365, y: 235, width: 35, height: 46 },
                },
              ],
            },
          },
        },
      };
      (json.definitions.process as TProcess)[`${bpmnKind}`] = [
        {
          id: `${bpmnKind}_id_0`,
        },
        {
          id: `${bpmnKind}_id_1`,
          instantiate: true,
        },
      ];

      const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_${bpmnKind}_id_0`,
        bpmnElementId: `${bpmnKind}_id_0`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
      });
      expect(model.flowNodes[0].bpmnElement.instantiate).toBeFalsy();

      verifyShape(model.flowNodes[1], {
        shapeId: `shape_${bpmnKind}_id_1`,
        bpmnElementId: `${bpmnKind}_id_1`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 365,
          y: 235,
          width: 35,
          height: 46,
        },
      });
      expect(model.flowNodes[1].bpmnElement.instantiate).toBeTruthy();
    });
  }
});
