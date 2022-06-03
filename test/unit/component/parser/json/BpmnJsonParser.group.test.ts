/**
 * Copyright 2021 Bonitasoft S.A.
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

import {
  expectAsWarning,
  parseJsonAndExpectOnlyFlowNodes,
  parseJsonAndExpectOnlyPools,
  parseJsonAndExpectOnlyPoolsAndFlowNodes,
  parseJsonAndExpectOnlyWarnings,
  parsingMessageCollector,
} from '../../../helpers/JsonTestUtils';
import { verifyShape } from '../../../helpers/bpmn-model-expect';
import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/internal';
import { GroupUnknownCategoryValueWarning, ShapeUnknownBpmnElementWarning } from '../../../../../src/component/parser/json/warnings';

describe('parse bpmn as json for group', () => {
  it('Single Group with label in process', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          id: 'process_0',
          group: {
            id: 'Group_0',
            categoryValueRef: 'CategoryValue_0',
          },
        },
        category: {
          categoryValue: {
            id: 'CategoryValue_0',
            value: 'Group 0 label',
          },
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: {
              id: 'Group_0_di',
              bpmnElement: 'Group_0',
              Bounds: {
                x: 160,
                y: 110,
                width: 300,
                height: 300,
              },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: 'Group_0_di',
      bpmnElementId: 'Group_0',
      bpmnElementName: 'Group 0 label',
      bpmnElementKind: ShapeBpmnElementKind.GROUP,
      parentId: 'process_0',
      bounds: {
        x: 160,
        y: 110,
        width: 300,
        height: 300,
      },
    });
  });

  it('Several Groups with or without label in process', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {
          id: 'process_1',
          group: [
            {
              id: 'Group_0',
              categoryValueRef: 'CategoryValue_0',
            },
            {
              id: 'Group_1',
              categoryValueRef: 'CategoryValue_1',
            },
          ],
        },
        category: [
          {
            categoryValue: {
              id: 'CategoryValue_0',
              value: 'Another Group 0 label',
            },
          },
          {
            categoryValue: {
              id: 'CategoryValue_1',
            },
          },
        ],
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'Group_0_di',
                bpmnElement: 'Group_0',
                Bounds: {
                  x: 160,
                  y: 110,
                  width: 300,
                  height: 300,
                },
              },
              {
                id: 'Group_1_di',
                bpmnElement: 'Group_1',
                Bounds: {
                  x: 1160,
                  y: 1110,
                  width: 600,
                  height: 400,
                },
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: 'Group_0_di',
      bpmnElementId: 'Group_0',
      bpmnElementName: 'Another Group 0 label',
      bpmnElementKind: ShapeBpmnElementKind.GROUP,
      parentId: 'process_1',
      bounds: {
        x: 160,
        y: 110,
        width: 300,
        height: 300,
      },
    });
    verifyShape(model.flowNodes[1], {
      shapeId: 'Group_1_di',
      bpmnElementId: 'Group_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.GROUP,
      parentId: 'process_1',
      bounds: {
        x: 1160,
        y: 1110,
        width: 600,
        height: 400,
      },
    });
  });

  it('Single Group with label in collaboration', () => {
    const json = {
      definitions: {
        targetNamespace: '',
        collaboration: {
          id: 'Collaboration_0',
          participant: {
            id: 'Participant_0',
            processRef: 'Process_0',
          },
          group: {
            id: 'Group_0',
            categoryValueRef: 'CategoryValue_0',
          },
        },
        process: {
          id: 'Process_0',
        },
        category: {
          categoryValue: [
            {
              id: 'CategoryValue_0',
              value: 'Group as collaboration',
            },
            {
              id: 'CategoryValue_1',
              value: 'not used value',
            },
          ],
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: [
              {
                id: 'Participant_0_di',
                bpmnElement: 'Participant_0',
                Bounds: {
                  x: 160,
                  y: 80,
                  width: 890,
                  height: 650,
                },
              },
              {
                id: 'Group_0_di',
                bpmnElement: 'Group_0',
                Bounds: {
                  x: 350,
                  y: 160,
                  width: 480,
                  height: 400,
                },
              },
            ],
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyPoolsAndFlowNodes(json, 1, 1);
    verifyShape(model.flowNodes[0], {
      shapeId: 'Group_0_di',
      bpmnElementId: 'Group_0',
      bpmnElementName: 'Group as collaboration',
      bpmnElementKind: ShapeBpmnElementKind.GROUP,
      parentId: undefined, // not linked to any process
      bounds: {
        x: 350,
        y: 160,
        width: 480,
        height: 400,
      },
    });
  });

  describe('Robustness', () => {
    it('Single Group in process without matching categoryValueRef', () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {
            id: 'process_0',
            group: {
              id: 'Group_0',
              categoryValueRef: 'unknown_CategoryValue_0',
            },
          },
          BPMNDiagram: {
            BPMNPlane: {
              BPMNShape: {
                id: 'Group_0_di',
                bpmnElement: 'Group_0',
                Bounds: {
                  x: 160,
                  y: 110,
                  width: 300,
                  height: 300,
                },
              },
            },
          },
        },
      };

      parseJsonAndExpectOnlyWarnings(json, 2);
      expectWarnings();
    });

    function expectWarnings(): void {
      const warnings = parsingMessageCollector.getWarnings();

      const warning0 = expectAsWarning<GroupUnknownCategoryValueWarning>(warnings[0], GroupUnknownCategoryValueWarning);
      expect(warning0.groupBpmnElementId).toBe('Group_0');
      expect(warning0.categoryValueRef).toBe('unknown_CategoryValue_0');

      const warning1 = expectAsWarning<ShapeUnknownBpmnElementWarning>(warnings[1], ShapeUnknownBpmnElementWarning);
      expect(warning1.bpmnElementId).toBe('Group_0');
    }

    it('Single Group in collaboration without matching categoryValueRef', () => {
      const json = {
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'Collaboration_0',
            participant: {
              id: 'Participant_0',
              processRef: 'Process_0',
            },
            group: {
              id: 'Group_0',
              categoryValueRef: 'unknown_CategoryValue_0',
            },
          },
          process: {
            id: 'Process_0',
          },
          category: {
            id: 'Category_without_id_0',
          },
          BPMNDiagram: {
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'Participant_0_di',
                  bpmnElement: 'Participant_0',
                  Bounds: {
                    x: 160,
                    y: 80,
                    width: 890,
                    height: 650,
                  },
                },
                {
                  id: 'Group_0_di',
                  bpmnElement: 'Group_0',
                  Bounds: {
                    x: 350,
                    y: 160,
                    width: 480,
                    height: 400,
                  },
                },
              ],
            },
          },
        },
      };

      parseJsonAndExpectOnlyPools(json, 1, 2);
      expectWarnings();
    });
  });
});
