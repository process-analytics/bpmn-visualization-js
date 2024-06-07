/*
Copyright 2023 Bonitasoft S.A.

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

import { verifyShape } from '../../../helpers/bpmn-model-expect';
import { buildDefinitions, EventDefinitionOn } from '../../../helpers/JsonBuilder';
import { parseJsonAndExpectOnlyFlowNodes } from '../../../helpers/JsonTestUtils';
import { expectedBounds } from '../../../helpers/TestUtils.BpmnJsonParser.event';

import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '@lib/model/bpmn/internal';

describe('parse bpmn as json for link events', () => {
  describe.each([
    ['event with eventDefinitionRef attribute', EventDefinitionOn.DEFINITIONS],
    ['event with eventDefinition object', EventDefinitionOn.EVENT],
  ] as [string, EventDefinitionOn][])(`%s`, (titleSuffix: string, eventDefinitionOn: EventDefinitionOn) => {
    it(`should convert with one source and one target, ${titleSuffix}`, () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              id: 'source_id',
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'link',
                eventDefinitionOn,
                target: 'link_target_id', // event definition id of 'target_id'
              },
            },
            {
              id: 'target_id',
              bpmnKind: 'intermediateCatchEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'link',
                eventDefinitionOn,
                source: 'link_source_id', // event definition id of 'source_id'
              },
            },
          ],
        },
      });

      const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_source_id`,
        bpmnElementId: `source_id`,
        bounds: expectedBounds,
        bpmnElementKind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
        bpmnElementName: undefined,
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
        targetId: 'target_id',
      });
      verifyShape(model.flowNodes[1], {
        shapeId: `shape_target_id`,
        bpmnElementId: `target_id`,
        bounds: expectedBounds,
        bpmnElementKind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
        bpmnElementName: undefined,
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
        sourceIds: ['source_id'],
      });
    });

    it(`should convert with several sources, ${titleSuffix}`, () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              id: 'source_1_id',
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'link',
                eventDefinitionOn,
                target: 'link_target_id', // event definition id of 'target_id'
              },
            },
            {
              id: 'source_2_id',
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'link',
                eventDefinitionOn,
                target: 'link_target_id', // event definition id of 'target_id'
              },
            },
            {
              id: 'target_id',
              bpmnKind: 'intermediateCatchEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'link',
                eventDefinitionOn,
                source: ['link_source_1_id', 'link_source_2_id'], // event definition id of 'source_1_id' & 'source_2_id'
              },
            },
          ],
        },
      });

      const model = parseJsonAndExpectOnlyFlowNodes(json, 3);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_source_1_id`,
        bpmnElementId: `source_1_id`,
        bounds: expectedBounds,
        bpmnElementKind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
        bpmnElementName: undefined,
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
        targetId: 'target_id',
      });
      verifyShape(model.flowNodes[1], {
        shapeId: `shape_source_2_id`,
        bpmnElementId: `source_2_id`,
        bounds: expectedBounds,
        bpmnElementKind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
        bpmnElementName: undefined,
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
        targetId: 'target_id',
      });
      verifyShape(model.flowNodes[2], {
        shapeId: `shape_target_id`,
        bpmnElementId: `target_id`,
        bounds: expectedBounds,
        bpmnElementKind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
        bpmnElementName: undefined,
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
        sourceIds: ['source_1_id', 'source_2_id'],
      });
    });
  });
});
