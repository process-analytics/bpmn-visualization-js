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
import { parseJsonAndExpectOnlyEdges, parseJsonAndExpectOnlyFlowNodes, verifyLabelFont } from './JsonTestUtils';
import each from 'jest-each';
import { TProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/rootElement';

describe('parse bpmn as json for label font', () => {
  jest.spyOn(console, 'warn');

  afterEach(() => {
    jest.clearAllMocks();
  });

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
  ]).it('json containing a BPMNShape who references a label style with font in a %s', sourceKind => {
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
              BPMNLabel: {
                id: 'label_id',
                labelStyle: 'style_id',
              },
            },
          },
          BPMNLabelStyle: {
            id: 'style_id',
            Font: {
              name: 'Arial',
              size: 11.0,
            },
          },
        },
      },
    };
    (json.definitions.process as TProcess)[`${sourceKind}`] = { id: 'source_id_0', name: `${sourceKind}_id_0` };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyLabelFont(model.flowNodes[0].label, { name: 'Arial', size: 11.0 });
  });

  it('json containing a BPMNEdge who references a label style with font', () => {
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
                id: 'label_id',
                labelStyle: 'style_id',
              },
            },
          },
          BPMNLabelStyle: {
            id: 'style_id',
            Font: {
              name: 'Arial',
              size: 11.0,
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyLabelFont(model.edges[0].label, { name: 'Arial', size: 11.0 });
  });

  it('json containing several BPMNShapes who reference the same label style', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          task: {
            id: 'task_id_0',
            name: 'task name',
          },
          userTask: {
            id: 'user_task_id_0',
            name: 'user task name',
          },
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNShape: [
              {
                id: 'BPMNShape_id_0',
                bpmnElement: 'task_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
                BPMNLabel: {
                  labelStyle: 'style_id_1',
                },
              },
              {
                id: 'BPMNShape_id_1',
                bpmnElement: 'user_task_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
                BPMNLabel: {
                  labelStyle: 'style_id_1',
                },
              },
            ],
          },
          BPMNLabelStyle: {
            id: 'style_id_1',
            Font: {
              name: 'Arial',
              size: 11.0,
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyLabelFont(model.flowNodes[0].label, { name: 'Arial', size: 11.0 });
    verifyLabelFont(model.flowNodes[1].label, { name: 'Arial', size: 11.0 });
  });

  it('json containing several BPMNEdges who reference the same label style', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: '',
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: [
              {
                id: 'BPMNEdge_id_0',
                waypoint: [{ x: 10, y: 10 }],
                BPMNLabel: {
                  labelStyle: 'style_id_1',
                },
              },
              {
                id: 'BPMNEdge_id_1',
                waypoint: [{ x: 10, y: 10 }],
                BPMNLabel: {
                  labelStyle: 'style_id_1',
                },
              },
            ],
          },
          BPMNLabelStyle: {
            id: 'style_id_1',
            Font: {
              name: 'Arial',
              size: 11.0,
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyLabelFont(model.edges[0].label, { name: 'Arial', size: 11.0 });
    verifyLabelFont(model.edges[1].label, { name: 'Arial', size: 11.0 });
  });

  it('json containing an array of label styles and BPMNShapes who reference a label style with font with/without all attributes', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          task: {
            id: 'task_id_0',
            name: 'task name',
          },
          userTask: {
            id: 'user_task_id_0',
            name: 'user task name',
          },
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNShape: [
              {
                id: 'BPMNShape_id_0',
                bpmnElement: 'task_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
                BPMNLabel: {
                  id: 'label_id_1',
                  labelStyle: 'style_id_1',
                },
              },
              {
                id: 'BPMNShape_id_1',
                bpmnElement: 'user_task_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
                BPMNLabel: {
                  id: 'label_id_2',
                  labelStyle: 'style_id_2',
                },
              },
            ],
          },
          BPMNLabelStyle: [
            {
              id: 'style_id_1',
              Font: {
                id: '1',
                isBold: false,
                isItalic: false,
                isStrikeThrough: false,
                isUnderline: false,
                name: 'Arial',
                size: 11.0,
              },
            },
            {
              id: 'style_id_2',
              Font: '',
            },
          ],
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyLabelFont(model.flowNodes[0].label, { name: 'Arial', size: 11.0, isBold: false, isItalic: false, isStrikeThrough: false, isUnderline: false });
    expect(model.flowNodes[1].label).toBeUndefined();
  });

  it('json containing an array of label styles and BPMNEdges who reference a label style with font with/without all attributes', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: '',
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: [
              {
                id: 'BPMNEdge_id_0',
                waypoint: [{ x: 10, y: 10 }],
                BPMNLabel: {
                  id: 'label_id_1',
                  labelStyle: 'style_id_1',
                },
              },
              {
                id: 'BPMNEdge_id_1',
                waypoint: [{ x: 10, y: 10 }],
                BPMNLabel: {
                  id: 'label_id_2',
                  labelStyle: 'style_id_2',
                },
              },
            ],
          },
          BPMNLabelStyle: [
            {
              id: 'style_id_1',
              Font: {
                id: '1',
                isBold: false,
                isItalic: false,
                isStrikeThrough: false,
                isUnderline: false,
                name: 'Arial',
                size: 11.0,
              },
            },
            {
              id: 'style_id_2',
              Font: '',
            },
          ],
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyLabelFont(model.edges[0].label, { name: 'Arial', size: 11.0, isBold: false, isItalic: false, isStrikeThrough: false, isUnderline: false });
    expect(model.edges[1].label).toBeUndefined();
  });

  it('json containing a BPMNShape who references a label style without font', () => {
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
                id: 'label_id',
                labelStyle: 'style_id',
              },
            },
          },
          BPMNLabelStyle: {
            id: 'style_id',
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    expect(model.flowNodes[0].label).toBeUndefined();
  });

  it('json containing a BPMNEdge who references a label style without font', () => {
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
                id: 'label_id',
                labelStyle: 'style_id',
              },
            },
          },
          BPMNLabelStyle: {
            id: 'style_id',
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    expect(model.edges[0].label).toBeUndefined();
  });

  it('json containing a BPMNShape who references a non-existing label style', () => {
    console.warn = jest.fn();
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
                id: 'label_id',
                labelStyle: 'non-existing_style_id',
              },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    expect(model.flowNodes[0].label).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith('Unable to assign font from style %s to shape/edge %s', 'non-existing_style_id', 'BPMNShape_id_0');
  });

  it('json containing a BPMNEdge who references a non-existing label style', () => {
    console.warn = jest.fn();
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
                id: 'label_id',
                labelStyle: 'non-existing_style_id',
              },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    expect(model.edges[0].label).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith('Unable to assign font from style %s to shape/edge %s', 'non-existing_style_id', 'BPMNEdge_id_0');
  });
});
