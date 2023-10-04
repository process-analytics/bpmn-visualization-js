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

import type { BuildEventDefinition, BuildNotBoundaryEventKind } from '../../../helpers/JsonBuilder';
import type { TEventDefinition } from '@lib/model/bpmn/json/baseElement/rootElement/eventDefinition';

import { EventDefinitionOn } from '../../../helpers/JsonBuilder';
import { eventDefinitionsParameters, executeEventCommonTests, testMustConvertShapes } from '../../../helpers/TestUtils.BpmnJsonParser.event';

import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '@lib/model/bpmn/internal';

describe.each([ShapeBpmnElementKind.EVENT_START, ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW])(
  'for %ss',
  (expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
    describe.each(eventDefinitionsParameters)(
      `for %s ${expectedShapeBpmnElementKind}`,
      (eventDefinitionKind: BuildEventDefinition, expectedEventDefinitionKind: ShapeBpmnEventDefinitionKind) => {
        if (
          (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_START &&
            (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ERROR ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ESCALATION ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CANCEL ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.COMPENSATION ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.LINK ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TERMINATE)) ||
          (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH &&
            (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.NONE ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ERROR ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ESCALATION ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CANCEL ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.COMPENSATION ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TERMINATE)) ||
          (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW &&
            (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TIMER ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ERROR ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CANCEL ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CONDITIONAL ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TERMINATE)) ||
          (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_END &&
            (expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TIMER ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CONDITIONAL ||
              expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.LINK))
        ) {
          // Not supported in BPMN specification
          return;
        }

        const titlesForEventDefinitionIsAttributeOf: [string, EventDefinitionOn][] = [
          [`'${expectedEventDefinitionKind}' has '${eventDefinitionKind}EventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.EVENT],
          [
            `'definitions' has '${eventDefinitionKind}EventDefinition' and '${expectedEventDefinitionKind}' has no '${eventDefinitionKind}EventDefinition' & 'eventDefinitionRef'`,
            EventDefinitionOn.DEFINITIONS,
          ],
        ];
        describe.each(titlesForEventDefinitionIsAttributeOf)(`when %s`, (titleForEventDefinitionIsAttributeOf: string, eventDefinitionOn: EventDefinitionOn) => {
          executeEventCommonTests(
            { bpmnKind: expectedShapeBpmnElementKind as BuildNotBoundaryEventKind, eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn } },
            {
              bpmnElementKind: expectedShapeBpmnElementKind,
              bpmnElementName: undefined,
              eventDefinitionKind: expectedEventDefinitionKind,
            },
            titleForEventDefinitionIsAttributeOf,
          );

          const eventDefinitionParameters: [[string, string | TEventDefinition]] = [['object', { id: `${eventDefinitionKind}EventDefinition_1` }]];
          if (eventDefinitionOn === EventDefinitionOn.EVENT) {
            eventDefinitionParameters.push(['empty string', '']); // Not possible to link an event to an EventDefinition without id, when the EventDefinition is not defined in the event
          }

          it.each(eventDefinitionParameters)(
            `should convert as Shape, when '${eventDefinitionKind}EventDefinition' is %s, ${titleForEventDefinitionIsAttributeOf}`,
            (title: string, eventDefinition: string | TEventDefinition) => {
              testMustConvertShapes(
                {
                  bpmnKind: expectedShapeBpmnElementKind as BuildNotBoundaryEventKind,
                  eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn, eventDefinition },
                },
                {
                  bpmnElementKind: expectedShapeBpmnElementKind,
                  bpmnElementName: undefined,
                  eventDefinitionKind: expectedEventDefinitionKind,
                },
              );
            },
          );
        });
      },
    );
  },
);
