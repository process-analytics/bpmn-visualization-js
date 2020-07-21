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
import { defaultBpmnJsonParser } from '../../../../../src/component/parser/json/BpmnJsonParser';
import { TProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/rootElement';

describe('parse bpmn as json for call activity', () => {
  const processJsonAsObjectWithCallActivityJsonAsObject = {
    callActivity: {
      id: 'callActivity_id_0',
      name: 'callActivity name',
    },
  };

  it.each([
    ['object', processJsonAsObjectWithCallActivityJsonAsObject],
    ['array', [processJsonAsObjectWithCallActivityJsonAsObject]],
  ])(`should convert as Shape, when a callActivity is an attribute (as object) of 'process' (as %s)`, (title: string, processJson: TProcess | TProcess[]) => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: processJson,
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: {
              id: 'shape_callActivity_id_0',
              bpmnElement: 'callActivity_id_0',
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
      shapeId: `shape_callActivity_id_0`,
      bpmnElementId: `callActivity_id_0`,
      bpmnElementName: `callActivity name`,
      bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it('json containing one process with an array of call activities with/without name', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          callActivity: [
            {
              id: 'callActivity_id_0',
              name: 'callActivity name',
            },
            {
              id: 'callActivity_id_1',
              instantiate: true,
            },
          ],
        },
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'shape_callActivity_id_0',
                bpmnElement: 'callActivity_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
              {
                id: 'shape_callActivity_id_1',
                bpmnElement: 'callActivity_id_1',
                Bounds: { x: 365, y: 235, width: 35, height: 46 },
              },
            ],
          },
        },
      },
    };

    //const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    const model = defaultBpmnJsonParser().parse(json);
    expect(model.lanes).toHaveLength(0);
    expect(model.pools).toHaveLength(0);
    expect(model.flowNodes).toHaveLength(2);
    expect(model.edges).toHaveLength(0);

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_callActivity_id_0',
      bpmnElementId: 'callActivity_id_0',
      bpmnElementName: 'callActivity name',
      bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });

    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_callActivity_id_1',
      bpmnElementId: 'callActivity_id_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
      bounds: {
        x: 365,
        y: 235,
        width: 35,
        height: 46,
      },
    });
  });

  it('should convert as Shape, when BPMNDiagram is an array', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: processJsonAsObjectWithCallActivityJsonAsObject,
        BPMNDiagram: [
          {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_callActivity_id_0',
                bpmnElement: 'callActivity_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
            },
          },
        ],
      },
    };

    //const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    const model = defaultBpmnJsonParser().parse(json);
    expect(model.lanes).toHaveLength(0);
    expect(model.pools).toHaveLength(0);
    expect(model.flowNodes).toHaveLength(1);
    expect(model.edges).toHaveLength(0);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_callActivity_id_0`,
      bpmnElementId: `callActivity_id_0`,
      bpmnElementName: `callActivity name`,
      bpmnElementKind: ShapeBpmnElementKind.CALL_ACTIVITY,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });
});
