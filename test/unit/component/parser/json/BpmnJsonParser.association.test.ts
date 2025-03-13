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

import type { BuildProcessParameter } from '../../../helpers/JsonBuilder';
import type { BpmnJsonModel } from '@lib/model/bpmn/json/bpmn20';
import type { BPMNEdge } from '@lib/model/bpmn/json/bpmndi';
import type { Point } from '@lib/model/bpmn/json/dc';

import { type ExpectedEdge, verifyEdge } from '../../../helpers/bpmn-model-expect';
import { buildDefinitions } from '../../../helpers/JsonBuilder';
import { parseJsonAndExpectOnlyEdges } from '../../../helpers/JsonTestUtilities';

import { FlowKind } from '@lib/model/bpmn/internal';
import { Waypoint } from '@lib/model/bpmn/internal/edge/edge';

type ExpectedAssociationParameter = Pick<ExpectedEdge, 'bpmnElementId' | 'bpmnElementName' | 'bpmnElementSourceRefId' | 'bpmnElementTargetRefId'> & { waypoints?: Waypoint[] };

function expectedAssociation(base: ExpectedAssociationParameter): ExpectedEdge {
  return {
    edgeId: `edge_${base.bpmnElementId}`, // generated in JsonBuilder
    bpmnElementId: base.bpmnElementId,
    bpmnElementName: base.bpmnElementName,
    bpmnElementKind: FlowKind.ASSOCIATION_FLOW,
    bpmnElementSourceRefId: base.bpmnElementSourceRefId,
    bpmnElementTargetRefId: base.bpmnElementTargetRefId,
    waypoints: base.waypoints ?? [new Waypoint(45, 78), new Waypoint(51, 78)], // hardcoded in JsonBuilder
  };
}

function buildBPMNEdge(id: string, waypoints?: Point[]): BPMNEdge {
  return {
    id: `edge_${id}`,
    bpmnElement: id,
    waypoint: waypoints ?? [
      { x: 45, y: 78 },
      { x: 51, y: 78 },
    ],
  };
}

describe('parse bpmn as json for associations defined in process', () => {
  const processJsonAsObjectWithAssociationJsonAsObject = {
    association: {
      id: 'association_id_0',
      sourceRef: 'Activity_01',
      targetRef: 'Annotation_01',
    },
  };

  it.each([
    ['object', processJsonAsObjectWithAssociationJsonAsObject],
    ['array', [processJsonAsObjectWithAssociationJsonAsObject]],
  ])(
    `should convert as Edge, when an association is an attribute (as object) of 'process' (as %s)`,
    (_title: string, processParameter: BuildProcessParameter | BuildProcessParameter[]) => {
      const json = buildDefinitions({ process: processParameter });

      const model = parseJsonAndExpectOnlyEdges(json, 1);

      verifyEdge(
        model.edges[0],
        expectedAssociation({
          bpmnElementId: 'association_id_0',
          bpmnElementSourceRefId: 'Activity_01',
          bpmnElementTargetRefId: 'Annotation_01',
        }),
      );
    },
  );

  it(`should convert as Edge, when an association is an attribute (as array) of 'process'`, () => {
    const json = buildDefinitions({
      process: {
        association: [
          {
            id: 'association_id_0',
            sourceRef: 'Activity_01',
            targetRef: 'Annotation_01',
          },
          {
            id: 'association_id_1',
            sourceRef: 'Activity_02',
            targetRef: 'Annotation_02',
          },
        ],
      },
    });

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(
      model.edges[0],
      expectedAssociation({
        bpmnElementId: 'association_id_0',
        bpmnElementSourceRefId: 'Activity_01',
        bpmnElementTargetRefId: 'Annotation_01',
      }),
    );

    verifyEdge(
      model.edges[1],
      expectedAssociation({
        bpmnElementId: 'association_id_1',
        bpmnElementSourceRefId: 'Activity_02',
        bpmnElementTargetRefId: 'Annotation_02',
      }),
    );
  });

  it('should convert as Edge, when BPMNDiagram is an array', () => {
    const json: BpmnJsonModel = {
      definitions: {
        targetNamespace: '',
        process: processJsonAsObjectWithAssociationJsonAsObject,
        BPMNDiagram: [
          {
            name: 'process 0',
            BPMNPlane: {
              BPMNEdge: buildBPMNEdge('association_id_0', [{ x: 362, y: 232 }]),
            },
          },
        ],
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(
      model.edges[0],
      expectedAssociation({
        bpmnElementId: `association_id_0`,
        bpmnElementSourceRefId: 'Activity_01',
        bpmnElementTargetRefId: 'Annotation_01',
        waypoints: [new Waypoint(362, 232)],
      }),
    );
  });
});

describe('parse bpmn as json for associations defined in collaboration', () => {
  it(`should convert as Edge a single association (as object)`, () => {
    const json: BpmnJsonModel = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          association: {
            id: 'association_id_0',
            sourceRef: 'Activity_01',
            targetRef: 'Annotation_01',
          },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNEdge: buildBPMNEdge('association_id_0', [{ x: 362, y: 232 }]),
          },
        },
      },
    };
    const model = parseJsonAndExpectOnlyEdges(json, 1);

    verifyEdge(
      model.edges[0],
      expectedAssociation({
        bpmnElementId: `association_id_0`,
        bpmnElementSourceRefId: 'Activity_01',
        bpmnElementTargetRefId: 'Annotation_01',
        waypoints: [new Waypoint(362, 232)],
      }),
    );
  });

  it(`should convert as Edge several associations (as array)`, () => {
    const json: BpmnJsonModel = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          association: [
            {
              id: 'association_id_0',
              sourceRef: 'Activity_01',
              targetRef: 'Annotation_01',
            },
            {
              id: 'association_id_1',
              sourceRef: 'Activity_02',
              targetRef: 'Annotation_02',
            },
          ],
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNEdge: [buildBPMNEdge('association_id_0'), buildBPMNEdge('association_id_1')],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdges(json, 2);

    verifyEdge(
      model.edges[0],
      expectedAssociation({
        bpmnElementId: 'association_id_0',
        bpmnElementSourceRefId: 'Activity_01',
        bpmnElementTargetRefId: 'Annotation_01',
      }),
    );

    verifyEdge(
      model.edges[1],
      expectedAssociation({
        bpmnElementId: 'association_id_1',
        bpmnElementSourceRefId: 'Activity_02',
        bpmnElementTargetRefId: 'Annotation_02',
      }),
    );
  });
});

it(`parse bpmn as json for associations defined in both process and collaboration`, () => {
  const json: BpmnJsonModel = {
    definitions: {
      targetNamespace: '',
      collaboration: {
        association: {
          id: 'association_id_1',
          sourceRef: 'Activity_01',
          targetRef: 'Annotation_01',
        },
      },
      process: {
        association: {
          id: 'association_id_2',
          sourceRef: 'Activity_02',
          targetRef: 'Annotation_02',
        },
      },
      BPMNDiagram: {
        BPMNPlane: {
          BPMNEdge: [buildBPMNEdge('association_id_1'), buildBPMNEdge('association_id_2')],
        },
      },
    },
  };
  const model = parseJsonAndExpectOnlyEdges(json, 2);

  verifyEdge(
    model.edges[0],
    expectedAssociation({
      bpmnElementId: `association_id_1`,
      bpmnElementSourceRefId: 'Activity_01',
      bpmnElementTargetRefId: 'Annotation_01',
    }),
  );
  verifyEdge(
    model.edges[1],
    expectedAssociation({
      bpmnElementId: `association_id_2`,
      bpmnElementSourceRefId: 'Activity_02',
      bpmnElementTargetRefId: 'Annotation_02',
    }),
  );
});
