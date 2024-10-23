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

import type { ExpectedShape } from '../../../helpers/bpmn-model-expect';
import type { BuildProcessParameter } from '../../../helpers/JsonBuilder';
import type { BpmnJsonModel } from '@lib/model/bpmn/json/bpmn20';
import type { BPMNEdge, BPMNShape } from '@lib/model/bpmn/json/bpmndi';

import { verifyShape } from '../../../helpers/bpmn-model-expect';
import { buildDefinitions } from '../../../helpers/JsonBuilder';
import { parseJsonAndExpectOnlyEdgesAndFlowNodes, parseJsonAndExpectOnlyFlowNodes } from '../../../helpers/JsonTestUtils';

import { ShapeBpmnElementKind } from '@lib/model/bpmn/internal';

function expectedTextAnnotation(base: Pick<ExpectedShape, 'bpmnElementId' | 'bpmnElementName' | 'bpmnElementIncomingIds' | 'bpmnElementOutgoingIds'>): ExpectedShape {
  return {
    shapeId: `shape_${base.bpmnElementId}`, // generated in JsonBuilder
    bpmnElementId: base.bpmnElementId,
    bpmnElementName: base.bpmnElementName,
    bpmnElementKind: ShapeBpmnElementKind.TEXT_ANNOTATION,
    bounds: { x: 456, y: 23, width: 78, height: 54 }, // hardcoded in JsonBuilder
    bpmnElementIncomingIds: base.bpmnElementIncomingIds,
    bpmnElementOutgoingIds: base.bpmnElementOutgoingIds,
  };
}

function buildBPMNEdge(id: string): BPMNEdge {
  return {
    id: `edge_${id}`,
    bpmnElement: id,
    waypoint: [
      { x: 45, y: 78 },
      { x: 51, y: 78 },
    ],
  };
}

function buildBPMNShape(id: string): BPMNShape {
  return {
    id: `shape_${id}`,
    bpmnElement: id,
    Bounds: { x: 456, y: 23, width: 78, height: 54 },
  };
}

describe('parse bpmn as json for text annotation defined in a process', () => {
  const processWithArtifactAsObject = {
    textAnnotation: {
      id: `textAnnotation_id_0`,
      text: `textAnnotation name`,
    },
  };

  it.each([
    ['object', processWithArtifactAsObject],
    ['array', [processWithArtifactAsObject]],
  ])(
    `should convert as Shape, when a text annotation is an attribute (as object) of 'process' (as %s)`,
    (_title: string, processParameter: BuildProcessParameter | BuildProcessParameter[]) => {
      const json = buildDefinitions({ process: processParameter });

      const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

      verifyShape(
        model.flowNodes[0],
        expectedTextAnnotation({
          bpmnElementId: `textAnnotation_id_0`,
          bpmnElementName: `textAnnotation name`,
        }),
      );
    },
  );

  it(`should convert as Shape, when a text annotation (with/without text) is an attribute (as array) of 'process'`, () => {
    const json = buildDefinitions({
      process: {
        textAnnotation: [
          {
            id: 'TextAnnotation_01',
            text: 'Task Annotation',
          },
          {
            id: 'TextAnnotation_02',
          },
        ],
      },
    });

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(
      model.flowNodes[0],
      expectedTextAnnotation({
        bpmnElementId: `TextAnnotation_01`,
        bpmnElementName: `Task Annotation`,
      }),
    );
    verifyShape(
      model.flowNodes[1],
      expectedTextAnnotation({
        bpmnElementId: 'TextAnnotation_02',
        bpmnElementName: undefined,
      }),
    );
  });

  describe(`incoming/outgoing management for text annotation in process`, () => {
    it.each`
      title         | expectedAttribute
      ${'incoming'} | ${'bpmnElementIncomingIds'}
      ${'outgoing'} | ${'bpmnElementOutgoingIds'}
    `(
      `should convert as Shape, when a process contains a text annotation with $title association`,
      ({ title, expectedAttribute }: { title: string; expectedAttribute: keyof ExpectedShape }) => {
        const json = buildDefinitions({
          process: {
            textAnnotation: { id: `text_annotation_id_0` },
            association: {
              id: `flow_${title}`,
              sourceRef: title === 'incoming' ? 'unknown' : 'text_annotation_id_0',
              targetRef: title === 'incoming' ? 'text_annotation_id_0' : 'unknown',
            },
          },
        });

        const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

        verifyShape(
          model.flowNodes[0],
          expectedTextAnnotation({
            bpmnElementId: `text_annotation_id_0`,
            bpmnElementName: undefined,
            [expectedAttribute]: [`flow_${title}`],
          }),
        );
      },
    );

    it(`should convert as Shape, when a process contains a text annotation with incoming/outgoing associations`, () => {
      const json = buildDefinitions({
        process: {
          textAnnotation: { id: `text_annotation_id_0` },
          association: [
            { id: 'flow_in_1', sourceRef: 'unknown', targetRef: 'text_annotation_id_0' },
            { id: 'flow_in_2', sourceRef: 'unknown', targetRef: 'text_annotation_id_0' },
            { id: 'flow_out_2', sourceRef: 'text_annotation_id_0', targetRef: 'unknown' },
            { id: 'flow_out_3', sourceRef: 'text_annotation_id_0', targetRef: 'unknown' },
          ],
        },
      });

      const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 4, 1);

      verifyShape(
        model.flowNodes[0],
        expectedTextAnnotation({
          bpmnElementId: `text_annotation_id_0`,
          bpmnElementName: undefined,
          bpmnElementIncomingIds: ['flow_in_1', 'flow_in_2'],
          bpmnElementOutgoingIds: ['flow_out_2', 'flow_out_3'],
        }),
      );
    });
  });
});

describe('parse bpmn as json for text annotation defined in "collaboration"', () => {
  it(`should convert as Shape a single text annotation (as object)`, () => {
    const json: BpmnJsonModel = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          textAnnotation: {
            id: 'textAnnotation_in_collaboration_id_0',
            text: 'textAnnotation name',
          },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [buildBPMNShape('textAnnotation_in_collaboration_id_0')],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(
      model.flowNodes[0],
      expectedTextAnnotation({
        bpmnElementId: `textAnnotation_in_collaboration_id_0`,
        bpmnElementName: `textAnnotation name`,
      }),
    );
  });

  it(`should convert as Shape several text annotations (as array)`, () => {
    const json: BpmnJsonModel = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          textAnnotation: [
            {
              id: 'textAnnotation_in_collaboration_id_1',
              text: 'textAnnotation name 1',
            },
            {
              id: 'textAnnotation_in_collaboration_id_2',
              text: 'textAnnotation name 2',
            },
          ],
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [buildBPMNShape('textAnnotation_in_collaboration_id_1'), buildBPMNShape('textAnnotation_in_collaboration_id_2')],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(
      model.flowNodes[0],
      expectedTextAnnotation({
        bpmnElementId: `textAnnotation_in_collaboration_id_1`,
        bpmnElementName: `textAnnotation name 1`,
      }),
    );
    verifyShape(
      model.flowNodes[1],
      expectedTextAnnotation({
        bpmnElementId: `textAnnotation_in_collaboration_id_2`,
        bpmnElementName: `textAnnotation name 2`,
      }),
    );
  });

  it(`should convert as Shape, when a process contains a text annotation with incoming/outgoing associations`, () => {
    const json: BpmnJsonModel = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          textAnnotation: { id: `text_annotation_id_0` },
          association: [
            { id: 'flow_in_1', sourceRef: 'unknown', targetRef: 'text_annotation_id_0' },
            { id: 'flow_in_2', sourceRef: 'unknown', targetRef: 'text_annotation_id_0' },
            { id: 'flow_out_1', sourceRef: 'text_annotation_id_0', targetRef: 'unknown' },
            { id: 'flow_out_2', sourceRef: 'text_annotation_id_0', targetRef: 'unknown' },
          ],
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'shape_text_annotation_id_0',
                bpmnElement: 'text_annotation_id_0',
                Bounds: { x: 456, y: 23, width: 78, height: 54 },
              },
            ],
            BPMNEdge: [buildBPMNEdge('flow_in_1'), buildBPMNEdge('flow_in_2'), buildBPMNEdge('flow_out_1'), buildBPMNEdge('flow_out_2')],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 4, 1);

    verifyShape(
      model.flowNodes[0],
      expectedTextAnnotation({
        bpmnElementId: `text_annotation_id_0`,
        bpmnElementName: undefined,
        bpmnElementIncomingIds: ['flow_in_1', 'flow_in_2'],
        bpmnElementOutgoingIds: ['flow_out_1', 'flow_out_2'],
      }),
    );
  });
});
