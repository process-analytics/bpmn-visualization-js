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
// import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { verifyShape } from './JsonTestUtils';
import { TProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/rootElement';
import { defaultBpmnJsonParser } from '../../../../../src/component/parser/json/BpmnJsonParser';
import { BpmnJsonModel } from '../../../../../src/component/parser/xml/bpmn-json-model/BPMN20';

describe.each([
  ['exclusive', ShapeBpmnElementKind.GATEWAY_EXCLUSIVE],
  ['inclusive', ShapeBpmnElementKind.GATEWAY_INCLUSIVE],
  ['parallel', ShapeBpmnElementKind.GATEWAY_PARALLEL],
])('parse bpmn as json for %s gateway', (bpmnKind: string, expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
  const processJsonAsObjectWithGatewayJsonAsObject = {} as TProcess;
  processJsonAsObjectWithGatewayJsonAsObject[`${bpmnKind}Gateway`] = {
    id: `${bpmnKind}Gateway_id_0`,
    name: `${bpmnKind}Gateway name`,
  };

  it.each([
    ['object', processJsonAsObjectWithGatewayJsonAsObject],
    ['array', [processJsonAsObjectWithGatewayJsonAsObject]],
  ])(`should convert as Shape, when a ${bpmnKind} gateway is an attribute (as object) of 'process' (as %s)`, (title: string, processJson: TProcess | TProcess[]) => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: processJson,
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: {
              id: `shape_${bpmnKind}Gateway_id_0`,
              bpmnElement: `${bpmnKind}Gateway_id_0`,
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          },
        },
      },
    };

    //const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    const model = defaultBpmnJsonParser().parse(json);
    expect(model.lanes).toHaveLength(0);
    expect(model.pools).toHaveLength(0);
    expect(model.flowNodes).toHaveLength(1);
    expect(model.edges).toHaveLength(0);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}Gateway_id_0`,
      bpmnElementId: `${bpmnKind}Gateway_id_0`,
      bpmnElementName: `${bpmnKind}Gateway name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it(`should convert as Shape, when a ${bpmnKind} gateway (with/without name) is an attribute (as array) of 'process'`, () => {
    const json: BpmnJsonModel = {
      definitions: {
        targetNamespace: '',
        process: {},
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: [
              {
                id: `shape_${bpmnKind}Gateway_id_0`,
                bpmnElement: `${bpmnKind}Gateway_id_0`,
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
              {
                id: `shape_${bpmnKind}Gateway_id_1`,
                bpmnElement: `${bpmnKind}Gateway_id_1`,
                Bounds: { x: 365, y: 235, width: 35, height: 46 },
              },
            ],
          },
        },
      },
    };
    (json.definitions.process as TProcess)[`${bpmnKind}Gateway`] = [
      {
        id: `${bpmnKind}Gateway_id_0`,
        name: `${bpmnKind}Gateway name`,
      },
      {
        id: `${bpmnKind}Gateway_id_1`,
      },
    ];

    //const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    const model = defaultBpmnJsonParser().parse(json);
    expect(model.lanes).toHaveLength(0);
    expect(model.pools).toHaveLength(0);
    expect(model.flowNodes).toHaveLength(2);
    expect(model.edges).toHaveLength(0);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}Gateway_id_0`,
      bpmnElementId: `${bpmnKind}Gateway_id_0`,
      bpmnElementName: `${bpmnKind}Gateway name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
    verifyShape(model.flowNodes[1], {
      shapeId: `shape_${bpmnKind}Gateway_id_1`,
      bpmnElementId: `${bpmnKind}Gateway_id_1`,
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
});
