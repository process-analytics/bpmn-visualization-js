/*
Copyright 2021 Bonitasoft S.A.

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

import type { BpmnVisualization } from '@lib/bpmn-visualization';

import {
  initializeBpmnVisualizationWithContainerId,
  initializeBpmnVisualizationWithHtmlElement,
  initializeBpmnVisualizationWithoutId,
} from './helpers/bpmn-visualization-initialization';
import { HtmlElementLookup } from './helpers/html-utilities';

import { ShapeBpmnEventDefinitionKind } from '@lib/bpmn-visualization';
import { readFileSync } from '@test/shared/file-helper';

describe.each`
  bpmnVisualization                               | type
  ${initializeBpmnVisualizationWithContainerId()} | ${'html id'}
  ${initializeBpmnVisualizationWithHtmlElement()} | ${'html element'}
  ${initializeBpmnVisualizationWithoutId()}       | ${'html element without id'}
`('Resulting DOM after diagram load - container set with "$type"', ({ bpmnVisualization }: { bpmnVisualization: BpmnVisualization }) => {
  const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

  it('DOM should contains BPMN elements when loading simple-start-task-end.bpmn', () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

    htmlElementLookup.expectStartEvent('StartEvent_1', ShapeBpmnEventDefinitionKind.NONE, { label: 'Start Event 1' });
    htmlElementLookup.expectTask('Activity_1', { label: 'Task 1' });
    htmlElementLookup.expectEndEvent('EndEvent_1', ShapeBpmnEventDefinitionKind.NONE, { label: 'End Event 1' });
  });

  it('DOM should contains BPMN elements when loading model-complete-semantic.bpmn', () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-complete-semantic.bpmn'));

    htmlElementLookup.expectPool('participant_1_id', { label: 'Pool 1' });
    htmlElementLookup.expectLane('lane_4_1_id', { label: 'Lane with child lanes' });

    htmlElementLookup.expectStartEvent('start_event_signal_id', ShapeBpmnEventDefinitionKind.SIGNAL, { label: 'Signal Start Event' });
    htmlElementLookup.expectIntermediateThrowEvent('intermediate_throw_event_message_id', ShapeBpmnEventDefinitionKind.MESSAGE, { label: 'Throw Message Intermediate Event' });
  });
});
