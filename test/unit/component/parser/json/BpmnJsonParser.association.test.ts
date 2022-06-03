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
import { parseJsonAndExpectOnlyEdges, verifyEdge } from './JsonTestUtils';
import { Waypoint } from '../../../../../src/model/bpmn/internal/edge/edge';
import type { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';

describe('parse bpmn as json for association', () => {
  const processJsonAsObjectWithAssociationJsonAsObject = {
    association: {
      id: 'association_id_0',
      sourceRef: 'Activity_01',
      targetRef: 'Annotation_01',
    },
    task: [{ id: 'Activity_01' }, { id: 'Annotation_01' }],
  };

  it.each([
    ['object', processJsonAsObjectWithAssociationJsonAsObject],
    ['array', [processJsonAsObjectWithAssociationJsonAsObject]],
  ])(`should convert as Edge, when an association is an attribute (as object) of 'process' (as %s)`, (title: string, processJson: TProcess | TProcess[]) => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: processJson,
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNEdge: {
              id: 'edge_association_id_0',
              bpmnElement: 'association_id_0',
              waypoint: [{ x: 362, y: 232 }],
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_association_id_0',
      bpmnElementId: 'association_id_0',
      bpmnElementSourceRefId: 'Activity_01',
      bpmnElementTargetRefId: 'Annotation_01',
      waypoints: [new Waypoint(362, 232)],
    });
  });

  it(`should convert as Edge, when an association is an attribute (as array) of 'process'`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          task: [{ id: 'Activity_01' }, { id: 'Annotation_01' }, { id: 'Activity_02' }, { id: 'Annotation_02' }],
          association: [
            {
              id: 'association_id_0',
              sourceRef: 'Activity_01',
              targetRef: 'Annotation_01',
            },
            {
              id: 'association_id_1',
              instantiate: true,
              sourceRef: 'Activity_02',
              targetRef: 'Annotation_02',
            },
          ],
        },
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNEdge: [
              {
                id: 'edge_association_id_0',
                bpmnElement: 'association_id_0',
                waypoint: [{ x: 362, y: 232 }],
              },
              {
                id: 'edge_association_id_1',
                bpmnElement: 'association_id_1',
                waypoint: [{ x: 362, y: 232 }],
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_association_id_0',
      bpmnElementId: 'association_id_0',
      bpmnElementSourceRefId: 'Activity_01',
      bpmnElementTargetRefId: 'Annotation_01',
      waypoints: [new Waypoint(362, 232)],
    });

    verifyEdge(model.edges[1], {
      edgeId: 'edge_association_id_1',
      bpmnElementId: 'association_id_1',
      bpmnElementSourceRefId: 'Activity_02',
      bpmnElementTargetRefId: 'Annotation_02',
      waypoints: [new Waypoint(362, 232)],
    });
  });

  it('should convert as Edge, when BPMNDiagram is an array', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: processJsonAsObjectWithAssociationJsonAsObject,
        BPMNDiagram: [
          {
            name: 'process 0',
            BPMNPlane: {
              BPMNEdge: {
                id: 'edge_association_id_0',
                bpmnElement: 'association_id_0',
                waypoint: [{ x: 362, y: 232 }],
              },
            },
          },
        ],
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(model.edges[0], {
      edgeId: `edge_association_id_0`,
      bpmnElementId: `association_id_0`,
      bpmnElementSourceRefId: 'Activity_01',
      bpmnElementTargetRefId: 'Annotation_01',
      waypoints: [new Waypoint(362, 232)],
    });
  });
});
