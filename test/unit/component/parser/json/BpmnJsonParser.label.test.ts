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
// import { parseJsonAndExpectOnlyEdges, parseJsonAndExpectOnlyFlowNodes } from './JsonTestUtils';
import each from 'jest-each';
import { TProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/rootElement';
import { defaultBpmnJsonParser } from '../../../../../src/component/parser/json/BpmnJsonParser';

describe('parse bpmn as json for label font', () => {
  each([
    ['exclusiveGateway'],
    ['inclusiveGateway'],
    ['task'],
    ['userTask'],
    ['serviceTask'],
    ['callActivity'],
    ['receiveTask'],
    ['subProcess'],
    ['textAnnotation'],
    // TODO: To uncomment when we support complex gateway
    //['complexGateway'],
    // TODO: To uncomment when we support manualTask
    //['manualTask'],
    // TODO: To uncomment when we support scriptTask
    //['scriptTask'],
    // TODO: To uncomment when we support sendTask
    //['sendTask'],
    // TODO: To uncomment when we support businessRuleTask
    //['businessRuleTask'],
  ]).it('json containing a BPMNShape with empty label in a %s', sourceKind => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          id: 'Process_1',
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNShape: {
              id: 'shape_source_id_0',
              bpmnElement: 'source_id_0',
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
              BPMNLabel: '',
            },
          },
        },
      },
    };
    (json.definitions.process as TProcess)[`${sourceKind}`] = { id: 'source_id_0', name: `${sourceKind}_id_0` };

    //const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    const model = defaultBpmnJsonParser().parse(json);
    expect(model.lanes).toHaveLength(0);
    expect(model.pools).toHaveLength(0);
    expect(model.flowNodes).toHaveLength(1);
    expect(model.edges).toHaveLength(0);

    expect(model.flowNodes[0].label).toBeUndefined();
  });

  it('json containing a BPMNEdge with empty label', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: '',
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: {
              id: 'BPMNEdge_id_0',
              waypoint: [{ x: 10, y: 10 }],
              BPMNLabel: '',
            },
          },
        },
      },
    };

    // const model = parseJsonAndExpectOnlyEdges(json, 1);

    const model = defaultBpmnJsonParser().parse(json);
    expect(model.lanes).toHaveLength(0);
    expect(model.pools).toHaveLength(0);
    expect(model.flowNodes).toHaveLength(0);
    expect(model.edges).toHaveLength(1);

    expect(model.edges[0].label).toBeUndefined();
  });

  it('json containing a BPMNShape with label with just id', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          task: {
            id: 'task_id_0',
            name: 'task name',
          },
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNShape: {
              id: 'BPMNShape_id_0',
              bpmnElement: 'task_id_0',
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
              BPMNLabel: {
                id: '',
              },
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

    expect(model.flowNodes[0].label).toBeUndefined();
  });

  it('json containing a BPMNEdge with empty label with just id', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: '',
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: {
              id: 'BPMNEdge_id_0',
              waypoint: [{ x: 10, y: 10 }],
              BPMNLabel: {
                id: '',
              },
            },
          },
        },
      },
    };

    // const model = parseJsonAndExpectOnlyEdges(json, 1);

    const model = defaultBpmnJsonParser().parse(json);
    expect(model.lanes).toHaveLength(0);
    expect(model.pools).toHaveLength(0);
    expect(model.flowNodes).toHaveLength(0);
    expect(model.edges).toHaveLength(1);

    expect(model.edges[0].label).toBeUndefined();
  });

  it('json containing a BPMNShape without label', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          task: {
            id: 'task_id_0',
            name: 'task name',
          },
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNShape: {
              id: 'BPMNShape_id_0',
              bpmnElement: 'task_id_0',
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

    expect(model.flowNodes[0].label).toBeUndefined();
  });

  it('json containing a BPMNEdge without label', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: '',
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: {
              id: 'BPMNEdge_id_0',
              waypoint: [{ x: 10, y: 10 }],
            },
          },
        },
      },
    };

    // const model = parseJsonAndExpectOnlyEdges(json, 1);

    const model = defaultBpmnJsonParser().parse(json);
    expect(model.lanes).toHaveLength(0);
    expect(model.pools).toHaveLength(0);
    expect(model.flowNodes).toHaveLength(0);
    expect(model.edges).toHaveLength(1);

    expect(model.edges[0].label).toBeUndefined();
  });
});
