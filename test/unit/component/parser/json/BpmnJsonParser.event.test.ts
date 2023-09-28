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
import type { TEventDefinition } from '@lib/model/bpmn/json/baseElement/rootElement/eventDefinition';

import { verifyShape } from '../../../helpers/bpmn-model-expect';
import { buildDefinitions, EventDefinitionOn } from '../../../helpers/JsonBuilder';
import { parseJsonAndExpectEvent } from '../../../helpers/JsonTestUtils';

import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '@lib/model/bpmn/internal';
import { eventDefinitionsParameters, executeEventCommonTests, testMustConvertShapes } from 'test/unit/component/parser/json/BpmnJsonParser.event-utils';

describe.each([
  [['message', 'timer', 'conditional', 'signal'], ShapeBpmnElementKind.EVENT_START],
  [['message', 'error', 'escalation', 'cancel', 'compensate', 'signal', 'terminate'], ShapeBpmnElementKind.EVENT_END],
  [['message', 'timer', 'conditional', 'link', 'signal'], ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH],
  [['message', 'escalation', 'compensate', 'link', 'signal'], ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW],
])('for %ss', (allDefinitionKinds: string[], expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
  describe.each(eventDefinitionsParameters)(`for %s ${expectedShapeBpmnElementKind}`, (eventDefinitionKind: string, expectedEventDefinitionKind: ShapeBpmnEventDefinitionKind) => {
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
        { bpmnKind: expectedShapeBpmnElementKind as OtherBuildEventKind | 'startEvent', eventDefinitionParameter: { eventDefinitionKind, eventDefinitionOn } },
        {
          bpmnElementKind: expectedShapeBpmnElementKind,
          bpmnElementName: undefined,
          eventDefinitionKind: expectedEventDefinitionKind,
        },
        titleForEventDefinitionIsAttributeOf,
      );

      it.each([
        ['empty string', ''],
        ['object', { id: `${eventDefinitionKind}EventDefinition_1` }],
      ])(
        `should convert as Shape, when '${eventDefinitionKind}EventDefinition' is %s, ${titleForEventDefinitionIsAttributeOf}`,
        (title: string, eventDefinition: string | TEventDefinition) => {
          testMustConvertShapes(
            {
              bpmnKind: expectedShapeBpmnElementKind as OtherBuildEventKind | 'startEvent',
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
  });

  describe(`for none ${expectedShapeBpmnElementKind}`, () => {
    // Only for events that support the NONE event kind
    if (expectedShapeBpmnElementKind === ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH) {
      // Not supported in BPMN specification
      return;
    }

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
});
