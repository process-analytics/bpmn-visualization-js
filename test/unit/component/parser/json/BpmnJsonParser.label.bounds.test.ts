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
import { parseJsonAndExpectOnlyEdges, parseJsonAndExpectOnlyFlowNodes, verifyLabelBounds } from './JsonTestUtils';
import { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import { shapeBpmnElementKindForLabelTests } from './TestUtils';

describe('parse bpmn as json for label bounds', () => {
  describe.each(shapeBpmnElementKindForLabelTests)('parse bpmn as json for label bounds on %s', sourceKind => {
    it(`should convert as Shape, when a BPMNShape (attached to ${sourceKind} & with bounds with all attributes) is an attribute (as object) of 'BPMNPlane' (as object)`, () => {
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
                  Bounds: { x: 25, y: 26, width: 27, height: 28 },
                },
              },
            },
          },
        },
      };
      (json.definitions.process as TProcess)[`${sourceKind}`] = { id: 'source_id_0', name: `${sourceKind}_id_0` };

      const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

      verifyLabelBounds(model.flowNodes[0].label, { x: 25, y: 26, width: 27, height: 28 });
    });

    it(`should convert as Shape, when a BPMNShape (attached to ${sourceKind} & without bounds) is an attribute (as object) of 'BPMNPlane' (as object)`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {},
          BPMNDiagram: {
            id: 'BpmnDiagram_1',
            BPMNPlane: {
              id: 'BpmnPlane_1',
              BPMNShape: {
                id: 'BPMNShape_id_0',
                bpmnElement: 'source_id_0',
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
                BPMNLabel: {
                  id: 'label_id',
                },
              },
            },
          },
        },
      };
      (json.definitions.process as TProcess)[`${sourceKind}`] = { id: 'source_id_0', name: `${sourceKind}_id_0` };

      const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

      expect(model.flowNodes[0].label).toBeUndefined();
    });
  });

  it(`should convert as Edge, when a BPMNEdge (with bounds with all attributes) is an attribute (as object) of 'BPMNPlane' (as object)`, () => {
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
                Bounds: { x: 25, y: 26, width: 27, height: 28 },
              },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyLabelBounds(model.edges[0].label, { x: 25, y: 26, width: 27, height: 28 });
  });

  it(`should convert as Edge, when a BPMNEdge (without bounds) is an attribute (as object) of 'BPMNPlane' (as object)`, () => {
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
              },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    expect(model.edges[0].label).toBeUndefined();
  });
});
