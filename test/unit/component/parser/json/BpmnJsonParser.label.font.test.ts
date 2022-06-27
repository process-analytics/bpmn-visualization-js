/**
 * @jest-environment jsdom
 */
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
import { expectAsWarning, parseJsonAndExpectOnlyEdges, parseJsonAndExpectOnlyFlowNodes, parsingMessageCollector, verifyLabelFont } from '../../../helpers/JsonTestUtils';
import type { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import { shapeBpmnElementKindForLabelTests } from '../../../helpers/TestUtils';
import { LabelStyleMissingFontWarning } from '../../../../../src/component/parser/json/warnings';

function expectMissingFontWarning(shapeOrEdgeId: string, labelStyleId: string): void {
  const warning = expectAsWarning<LabelStyleMissingFontWarning>(parsingMessageCollector.getWarnings()[0], LabelStyleMissingFontWarning);
  expect(warning.shapeOrEdgeId).toEqual(shapeOrEdgeId);
  expect(warning.labelStyleId).toEqual(labelStyleId);
}

describe('parse bpmn as json for label font', () => {
  it.each(shapeBpmnElementKindForLabelTests)(
    "should convert as Shape with Font, when a BPMNShape (attached to %s & who references a BPMNLabelStyle with font) is an attribute (as object) of 'BPMNPlane' (as object)",
    sourceKind => {
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
    },
  );

  it("should convert as Edge with Font, when a BPMNEdge (which references a BPMNLabelStyle with font) is an attribute (as object) of 'BPMNPlane' (as object)", () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          sequenceFlow: {
            id: 'sequenceFlow_id_0',
            sourceRef: 'sourceRef',
            targetRef: 'targetRef',
          },
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: {
              id: 'BPMNEdge_id_0',
              bpmnElement: 'sequenceFlow_id_0',
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

  it("should convert as Shape[] with Font, when several BPMNShapes (who reference the same BPMNLabelStyle) are an attribute (as array) of 'BPMNPlane' (as object)", () => {
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

  it("should convert as Edge[] with Font, when several BPMNEdges (who reference the same BPMNLabelStyle) are an attribute (as array) of 'BPMNPlane' (as object)", () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          sequenceFlow: [
            {
              id: 'sequenceFlow_id_0',
              sourceRef: 'sourceRef_0',
              targetRef: 'targetRef_0',
            },
            {
              id: 'sequenceFlow_id_1',
              sourceRef: 'sourceRef_1',
              targetRef: 'targetRef_1',
            },
          ],
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: [
              {
                id: 'BPMNEdge_id_0',
                bpmnElement: 'sequenceFlow_id_0',
                waypoint: [{ x: 10, y: 10 }],
                BPMNLabel: {
                  labelStyle: 'style_id_1',
                },
              },
              {
                id: 'BPMNEdge_id_1',
                bpmnElement: 'sequenceFlow_id_1',
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

  it("should convert as Shape[] without Font, when BPMNShapes (who reference a BPMNLabelStyle) are an attribute (as array) of 'BPMNPlane' (as object) & BPMNLabelStyle (with font with/without all attributes) is an attribute (as array) of 'BPMNDiagram' (as object)", () => {
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

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2, 1);

    verifyLabelFont(model.flowNodes[0].label, { name: 'Arial', size: 11.0, isBold: false, isItalic: false, isStrikeThrough: false, isUnderline: false });
    expect(model.flowNodes[1].label).toBeUndefined();
    expectMissingFontWarning('BPMNShape_id_1', 'style_id_2');
  });

  it("should convert as Edge[] without Font, when BPMNEdges (which reference a BPMNLabelStyle) are an attribute (as array) of 'BPMNPlane' (as object) & BPMNLabelStyle (with font with/without all attributes) is an attribute (as array) of 'BPMNDiagram' (as object)", () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          sequenceFlow: [
            {
              id: 'sequenceFlow_id_0',
              sourceRef: 'sourceRef_0',
              targetRef: 'targetRef_0',
            },
            {
              id: 'sequenceFlow_id_1',
              sourceRef: 'sourceRef_1',
              targetRef: 'targetRef_1',
            },
          ],
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: [
              {
                id: 'BPMNEdge_id_0',
                bpmnElement: 'sequenceFlow_id_0',
                waypoint: [{ x: 10, y: 10 }],
                BPMNLabel: {
                  id: 'label_id_1',
                  labelStyle: 'style_id_1',
                },
              },
              {
                id: 'BPMNEdge_id_1',
                bpmnElement: 'sequenceFlow_id_1',
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

    const model = parseJsonAndExpectOnlyEdges(json, 2, 1);

    verifyLabelFont(model.edges[0].label, { name: 'Arial', size: 11.0, isBold: false, isItalic: false, isStrikeThrough: false, isUnderline: false });
    expect(model.edges[1].label).toBeUndefined();
    expectMissingFontWarning('BPMNEdge_id_1', 'style_id_2');
  });

  it("should convert as Shape without Font, when a BPMNShape (who references a BPMNLabelStyle without font) is an attribute (as object) of 'BPMNPlane' (as object)", () => {
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

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1, 1);

    expect(model.flowNodes[0].label).toBeUndefined();
    expectMissingFontWarning('BPMNShape_id_0', 'style_id');
  });

  it("should convert as Edge without Font, when a BPMNEdge (which references a BPMNLabelStyle without font) is an attribute (as object) of 'BPMNPlane' (as object)", () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          sequenceFlow: {
            id: 'sequenceFlow_id_0',
            sourceRef: 'sourceRef_0',
            targetRef: 'targetRef_0',
          },
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: {
              id: 'BPMNEdge_id_0',
              bpmnElement: 'sequenceFlow_id_0',
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

    const model = parseJsonAndExpectOnlyEdges(json, 1, 1);

    expect(model.edges[0].label).toBeUndefined();
    expectMissingFontWarning('BPMNEdge_id_0', 'style_id');
  });

  it("should convert as Shape without Font, when a BPMNShape (who references a non-existing BPMNLabelStyle) is an attribute (as object) of 'BPMNPlane' (as object)", () => {
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

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1, 1);

    expect(model.flowNodes[0].label).toBeUndefined();
    expectMissingFontWarning('BPMNShape_id_0', 'non-existing_style_id');
  });

  it("should convert as Edge without Font, when a BPMNEdge (which references a non-existing BPMNLabelStyle) is an attribute (as object) of 'BPMNPlane' (as object)", () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          sequenceFlow: {
            id: 'sequenceFlow_id_0',
            sourceRef: 'sourceRef_0',
            targetRef: 'targetRef_0',
          },
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: {
              id: 'BPMNEdge_id_0',
              bpmnElement: 'sequenceFlow_id_0',
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

    const model = parseJsonAndExpectOnlyEdges(json, 1, 1);

    expect(model.edges[0].label).toBeUndefined();
    expectMissingFontWarning('BPMNEdge_id_0', 'non-existing_style_id');
  });
});
