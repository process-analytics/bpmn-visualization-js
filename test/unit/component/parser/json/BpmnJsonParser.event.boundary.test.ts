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

import type { BuildDefinitionParameter, BuildEventDefinition } from '../../../helpers/JsonBuilder';

import { buildDefinitions, EventDefinitionOn } from '../../../helpers/JsonBuilder';
import { expectAsWarning, parseJsonAndExpectOnlyFlowNodes, parsingMessageCollector } from '../../../helpers/JsonTestUtils';
import { getEventShapes } from '../../../helpers/TestUtils';
import { eventDefinitionsParameters, executeEventCommonTests, testMustConvertShapes } from '../../../helpers/TestUtils.BpmnJsonParser.event';

import { BoundaryEventNotAttachedToActivityWarning, ShapeUnknownBpmnElementWarning } from '@lib/component/parser/json/warnings';
import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '@lib/model/bpmn/internal';

function testMustNotConvertBoundaryEvent(definitionParameter: BuildDefinitionParameter, numberOfExpectedFlowNodes = 1): void {
  const json = buildDefinitions(definitionParameter);

  const bpmnModel = parseJsonAndExpectOnlyFlowNodes(json, numberOfExpectedFlowNodes, 2);

  expect(getEventShapes(bpmnModel)).toHaveLength(0);
  const warnings = parsingMessageCollector.getWarnings();

  const warning0 = expectAsWarning<BoundaryEventNotAttachedToActivityWarning>(warnings[0], BoundaryEventNotAttachedToActivityWarning);
  expect(warning0.bpmnElementId).toBe('event_id_0_0');
  expect(warning0.attachedToReference).toEqual(numberOfExpectedFlowNodes == 0 ? 'unexisting_activity_id_0' : 'not_activity_id_0');
  expect(warning0.attachedToKind).toEqual(numberOfExpectedFlowNodes == 0 ? undefined : ShapeBpmnElementKind.GATEWAY_EXCLUSIVE);

  const warning1 = expectAsWarning<ShapeUnknownBpmnElementWarning>(warnings[1], ShapeUnknownBpmnElementWarning);
  expect(warning1.bpmnElementId).toBe('event_id_0_0');
}

describe('for boundaryEvents', () => {
  describe.each(eventDefinitionsParameters)(`for %s boundaryEvent`, (eventDefinitionKind: BuildEventDefinition, expectedEventDefinitionKind: ShapeBpmnEventDefinitionKind) => {
    if (
      expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.NONE ||
      expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.LINK ||
      expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.TERMINATE
    ) {
      // Not supported in BPMN specification
      return;
    }

    const titlesForEventDefinitionIsAttributeOf: [string, EventDefinitionOn][] = [
      [`'boundaryEvent' has '${eventDefinitionKind}EventDefinition' & no 'eventDefinitionRef'`, EventDefinitionOn.EVENT],
      [
        `'definitions' has '${eventDefinitionKind}EventDefinition' and 'boundaryEvent' has no '${eventDefinitionKind}EventDefinition' & 'eventDefinitionRef'`,
        EventDefinitionOn.DEFINITIONS,
      ],
    ];

    describe.each([[true], [false]])(`for %s ${eventDefinitionKind} intermediate boundary events`, (isInterrupting: boolean) => {
      if (
        (!isInterrupting && expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.ERROR) ||
        expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.CANCEL ||
        expectedEventDefinitionKind === ShapeBpmnEventDefinitionKind.COMPENSATION
      ) {
        // Not supported in BPMN specification
        return;
      }

      describe.each(titlesForEventDefinitionIsAttributeOf)(`when %s`, (titleForEventDefinitionIsAttributeOf: string, eventDefinitionOn: EventDefinitionOn) => {
        const isInterruptingTitle = isInterrupting ? 'interrupting' : 'non-interrupting';

        executeEventCommonTests(
          {
            bpmnKind: 'boundaryEvent',
            eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn },
            isInterrupting,
            attachedToRef: 'task_id_0_0',
          },
          {
            parentId: 'task_id_0_0',
            bpmnElementKind: ShapeBpmnElementKind.EVENT_BOUNDARY,
            bpmnElementName: undefined,
            eventDefinitionKind: expectedEventDefinitionKind,
            isInterrupting,
          },
          `'boundaryEvent' is ${isInterruptingTitle} & attached to an 'activity', (${titleForEventDefinitionIsAttributeOf})`,
        );

        if (isInterrupting) {
          it(`should convert as Shape, when 'boundaryEvent' has no 'cancelActivity' & is attached to an 'activity', ${titleForEventDefinitionIsAttributeOf}'`, () => {
            testMustConvertShapes(
              {
                bpmnKind: 'boundaryEvent',
                eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn },
                isInterrupting: undefined,
                attachedToRef: 'task_id_0_0',
              },
              {
                parentId: 'task_id_0_0',
                bpmnElementKind: ShapeBpmnElementKind.EVENT_BOUNDARY,
                bpmnElementName: undefined,
                eventDefinitionKind: expectedEventDefinitionKind,
                isInterrupting,
              },
            );
          });
        }

        it(`should NOT convert, when 'boundaryEvent' is ${isInterruptingTitle} & attached to anything than an 'activity', ${titleForEventDefinitionIsAttributeOf}`, () => {
          testMustNotConvertBoundaryEvent({
            process: {
              event: {
                bpmnKind: 'boundaryEvent',
                eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn },
                isInterrupting,
                attachedToRef: 'not_activity_id_0',
              },
              gateway: {
                id: 'not_activity_id_0',
                bpmnKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
              },
            },
          });
        });

        it(`should NOT convert, when 'boundaryEvent' is ${isInterruptingTitle} & attached to unexisting activity, ${titleForEventDefinitionIsAttributeOf}`, () => {
          testMustNotConvertBoundaryEvent(
            {
              process: {
                event: {
                  bpmnKind: 'boundaryEvent',
                  eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn },
                  isInterrupting,
                  attachedToRef: 'unexisting_activity_id_0',
                },
              },
            },
            0,
          );
        });
      });
    });
  });
});
