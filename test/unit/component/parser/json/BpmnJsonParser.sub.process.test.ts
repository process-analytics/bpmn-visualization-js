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
import { parseJsonAndExpectOnlySubProcess, verifyShape } from './JsonTestUtils';
import each from 'jest-each';
import { ShapeBpmnSubProcessKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnSubProcessKind';
import { TProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/rootElement';

describe('parse bpmn as json for sub-process', () => {
  each([
    ['embedded', false, ShapeBpmnSubProcessKind.EMBEDDED],
    ['event', true, ShapeBpmnSubProcessKind.EVENT],
  ]).describe('parse bpmn as json for %s sub-process', (bpmnSubProcessKind: string, triggeredByEvent: boolean, expectedShapeBpmnSubProcessKind: ShapeBpmnSubProcessKind) => {
    each([
      ['expanded', true],
      ['collapsed', false],
    ]).describe(`parse bpmn as json for %s ${bpmnSubProcessKind} sub-process`, (expandedKind: string, isExpanded: boolean) => {
      const processWithSubProcessAsObject = {} as TProcess;
      processWithSubProcessAsObject['subProcess'] = {
        id: `sub-process_id_0`,
        name: `sub-process name`,
        triggeredByEvent: triggeredByEvent,
      };

      it.each([
        ['object', processWithSubProcessAsObject],
        ['array', [processWithSubProcessAsObject]],
      ])(
        `should convert as Shape, when a ${expandedKind} ${bpmnSubProcessKind} sub-process is an attribute (as object) of 'process' (as %s)`,
        (title: string, processJson: TProcess) => {
          const json = {
            definitions: {
              targetNamespace: '',
              process: processJson,
              BPMNDiagram: {
                name: 'process 0',
                BPMNPlane: {
                  BPMNShape: {
                    id: `shape_sub-process_id_0`,
                    bpmnElement: `sub-process_id_0`,
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                    isExpanded: isExpanded,
                  },
                },
              },
            },
          };

          const model = parseJsonAndExpectOnlySubProcess(json, expectedShapeBpmnSubProcessKind, 1);

          verifyShape(model.flowNodes[0], {
            shapeId: 'shape_sub-process_id_0',
            bpmnElementId: 'sub-process_id_0',
            bpmnElementName: 'sub-process name',
            bpmnElementKind: ShapeBpmnElementKind.SUB_PROCESS,
            bounds: {
              x: 362,
              y: 232,
              width: 36,
              height: 45,
            },
            isExpanded: isExpanded,
          });
        },
      );
    });

    it(`should convert as Shape, when a ${bpmnSubProcessKind} sub-process (with/without name & isExpanded) is an attribute (as array) of 'process'`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {
            subProcess: [
              {
                id: 'sub-process_id_0',
                name: 'sub-process name',
                triggeredByEvent: triggeredByEvent,
              },
              {
                id: 'sub-process_id_1',
                triggeredByEvent: triggeredByEvent,
              },
            ],
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_sub-process_id_0',
                  bpmnElement: 'sub-process_id_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  isExpanded: false,
                },
                {
                  id: 'shape_sub-process_id_1',
                  bpmnElement: 'sub-process_id_1',
                  Bounds: { x: 365, y: 235, width: 35, height: 46 },
                },
              ],
            },
          },
        },
      };

      const model = parseJsonAndExpectOnlySubProcess(json, expectedShapeBpmnSubProcessKind, 2);

      verifyShape(model.flowNodes[0], {
        shapeId: 'shape_sub-process_id_0',
        bpmnElementId: 'sub-process_id_0',
        bpmnElementName: 'sub-process name',
        bpmnElementKind: ShapeBpmnElementKind.SUB_PROCESS,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
        isExpanded: false,
      });
      verifyShape(model.flowNodes[1], {
        shapeId: 'shape_sub-process_id_1',
        bpmnElementId: 'sub-process_id_1',
        bpmnElementName: undefined,
        bpmnElementKind: ShapeBpmnElementKind.SUB_PROCESS,
        bounds: {
          x: 365,
          y: 235,
          width: 35,
          height: 46,
        },
        isExpanded: false,
      });
    });

    if (expectedShapeBpmnSubProcessKind === ShapeBpmnSubProcessKind.EMBEDDED) {
      it(`should convert as Shape, when a embedded sub-process (with/without triggeredByEvent) is an attribute (as object) of 'process'`, () => {
        const json = {
          definitions: {
            targetNamespace: '',
            process: {
              subProcess: {
                id: 'sub-process_id_1',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_sub-process_id_1',
                  bpmnElement: 'sub-process_id_1',
                  Bounds: { x: 365, y: 235, width: 35, height: 46 },
                },
              },
            },
          },
        };

        const model = parseJsonAndExpectOnlySubProcess(json, expectedShapeBpmnSubProcessKind, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: 'shape_sub-process_id_1',
          bpmnElementId: 'sub-process_id_1',
          bpmnElementName: undefined,
          bpmnElementKind: ShapeBpmnElementKind.SUB_PROCESS,
          bounds: {
            x: 365,
            y: 235,
            width: 35,
            height: 46,
          },
          isExpanded: false,
        });
      });
    }
  });
});
