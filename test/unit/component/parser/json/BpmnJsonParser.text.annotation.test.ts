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
import { parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/internal';
import { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';

describe('parse bpmn as json for text annotation', () => {
  const processWithArtifactAsObject = {} as TProcess;
  processWithArtifactAsObject['textAnnotation'] = {
    id: `textAnnotation_id_0`,
    text: `textAnnotation name`,
  };

  it.each([
    ['object', processWithArtifactAsObject],
    ['array', [processWithArtifactAsObject]],
  ])(`should convert as Shape, when a text annotation is an attribute (as object) of 'process' (as %s)`, (title: string, processJson: TProcess) => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: processJson,
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: {
              id: `shape_textAnnotation_id_0`,
              bpmnElement: `textAnnotation_id_0`,
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_textAnnotation_id_0`,
      bpmnElementId: `textAnnotation_id_0`,
      bpmnElementName: `textAnnotation name`,
      bpmnElementKind: ShapeBpmnElementKind.TEXT_ANNOTATION,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });

  it(`should convert as Shape, when a text annotation (with/without text) is an attribute (as array) of 'process'`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
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
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'TextAnnotation_01_di',
                bpmnElement: 'TextAnnotation_01',
                Bounds: {
                  x: 430,
                  y: 160,
                  width: 100,
                  height: 30,
                },
              },
              {
                id: 'TextAnnotation_02_di',
                bpmnElement: 'TextAnnotation_02',
                Bounds: {
                  x: 180,
                  y: 80,
                  width: 270,
                  height: 54,
                },
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: 'TextAnnotation_01_di',
      bpmnElementId: 'TextAnnotation_01',
      bpmnElementName: 'Task Annotation',
      bpmnElementKind: ShapeBpmnElementKind.TEXT_ANNOTATION,
      bounds: {
        x: 430,
        y: 160,
        width: 100,
        height: 30,
      },
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'TextAnnotation_02_di',
      bpmnElementId: 'TextAnnotation_02',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.TEXT_ANNOTATION,
      bounds: {
        x: 180,
        y: 80,
        width: 270,
        height: 54,
      },
    });
  });
});
