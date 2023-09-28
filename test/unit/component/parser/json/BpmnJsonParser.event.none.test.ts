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

import type { OtherBuildEventKind } from '../../../helpers/JsonBuilder';

import { verifyShape } from '../../../helpers/bpmn-model-expect';
import { buildDefinitions, EventDefinitionOn } from '../../../helpers/JsonBuilder';
import { parseJsonAndExpectEvent } from '../../../helpers/JsonTestUtils';

import { executeEventCommonTests } from './BpmnJsonParser.event-utils';

import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '@lib/model/bpmn/internal';

// None intermediateCatchEvent not supported in BPMN specification
describe.each([
  [ShapeBpmnElementKind.EVENT_START, ['message', 'timer', 'conditional', 'signal']],
  [ShapeBpmnElementKind.EVENT_END, ['message', 'error', 'escalation', 'cancel', 'compensate', 'signal', 'terminate']],
  [ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ['message', 'escalation', 'compensate', 'link', 'signal']],
])('for none %s', (expectedShapeBpmnElementKind: ShapeBpmnElementKind, allDefinitionKinds: string[]) => {
  executeEventCommonTests(
    {
      bpmnKind: expectedShapeBpmnElementKind as OtherBuildEventKind | 'startEvent',
      eventDefinitionParameter: { eventDefinitionKind: 'none', eventDefinitionOn: EventDefinitionOn.NONE },
    },
    {
      bpmnElementKind: expectedShapeBpmnElementKind,
      bpmnElementName: undefined,
      eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
    },
    `'${expectedShapeBpmnElementKind}' has no 'eventDefinition' & no 'eventDefinitionRef'`,
  );

  it(`should convert as NONE Shape only the '${expectedShapeBpmnElementKind}' without 'eventDefinition' & without 'eventDefinitionRef', when an array of '${expectedShapeBpmnElementKind}' (without/with one or several event definition) is an attribute of 'process'`, () => {
    const json = buildDefinitions({
      process: {
        event: [
          {
            id: `none_${expectedShapeBpmnElementKind}_id`,
            name: `none ${expectedShapeBpmnElementKind}`,
            bpmnKind: expectedShapeBpmnElementKind as OtherBuildEventKind | 'startEvent',
            eventDefinitionParameter: { eventDefinitionOn: EventDefinitionOn.NONE },
          },
          {
            bpmnKind: expectedShapeBpmnElementKind as OtherBuildEventKind | 'startEvent',
            eventDefinitionParameter: {
              eventDefinitionKind: 'message',
              eventDefinitionOn: EventDefinitionOn.EVENT,
              withDifferentDefinition: true,
            },
          },
          {
            bpmnKind: expectedShapeBpmnElementKind as OtherBuildEventKind | 'startEvent',
            eventDefinitionParameter: {
              eventDefinitionKind: 'message',
              eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
              withDifferentDefinition: true,
            },
          },
          {
            bpmnKind: expectedShapeBpmnElementKind as OtherBuildEventKind | 'startEvent',
            eventDefinitionParameter: {
              eventDefinitionKind: 'message',
              eventDefinitionOn: EventDefinitionOn.BOTH,
              withDifferentDefinition: true,
            },
          },

          ...allDefinitionKinds.map((definitionKind, index) => ({
            id: `${definitionKind}_${expectedShapeBpmnElementKind}_id_${index}`,
            bpmnKind: expectedShapeBpmnElementKind as OtherBuildEventKind | 'startEvent',
            eventDefinitionParameter: {
              eventDefinitionKind: definitionKind,
              eventDefinitionOn: EventDefinitionOn.EVENT,
            },
          })),
        ],
      },
    });

    const model = parseJsonAndExpectEvent(json, ShapeBpmnEventDefinitionKind.NONE, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_none_${expectedShapeBpmnElementKind}_id`,
      bpmnElementId: `none_${expectedShapeBpmnElementKind}_id`,
      bpmnElementName: `none ${expectedShapeBpmnElementKind}`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
  });
});
