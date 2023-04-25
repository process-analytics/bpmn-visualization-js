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

import { buildDefinitions } from '../../../helpers/JsonBuilder';
import type { BuildProcessParameter } from '../../../helpers/JsonBuilder';
import { parseJsonAndExpectOnlyFlowNodes } from '../../../helpers/JsonTestUtils';
import { verifyShape } from '../../../helpers/bpmn-model-expect';

import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/internal';

describe('parse bpmn as json for text annotation', () => {
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
    (title: string, processParameter: BuildProcessParameter | BuildProcessParameter[]) => {
      const json = buildDefinitions({ process: processParameter });

      const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_textAnnotation_id_0`,
        bpmnElementId: `textAnnotation_id_0`,
        bpmnElementName: `textAnnotation name`,
        bpmnElementKind: ShapeBpmnElementKind.TEXT_ANNOTATION,
        bounds: { x: 456, y: 23, width: 78, height: 54 },
      });
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

    verifyShape(model.flowNodes[0], {
      shapeId: 'shape_TextAnnotation_01',
      bpmnElementId: 'TextAnnotation_01',
      bpmnElementName: 'Task Annotation',
      bpmnElementKind: ShapeBpmnElementKind.TEXT_ANNOTATION,
      bounds: { x: 456, y: 23, width: 78, height: 54 },
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'shape_TextAnnotation_02',
      bpmnElementId: 'TextAnnotation_02',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.TEXT_ANNOTATION,
      bounds: { x: 456, y: 23, width: 78, height: 54 },
    });
  });
});
