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

import { BpmnVisualization } from '@lib/component/BpmnVisualization';
import { readFileSync } from '@test/shared/file-helper';

const additionalXmlAttributeProcessor = (val: string): string => {
  val = val.replace(/&#174;/g, '®');
  val = val.replace(/&#9824;/g, '♠');
  val = val.replace(/&#x00D8;/g, 'Ø');
  val = val.replace(/&#10741;/g, '⧵');
  return val;
};

describe('From BPMN diagram with entities in attributes', () => {
  describe.each([false, true])('XML parser with additional attribute processor: %s', (useAdditionalXmlAttributeProcessor: boolean) => {
    const bpmnVisualization = useAdditionalXmlAttributeProcessor
      ? new BpmnVisualization({ container: null, parser: { additionalXmlAttributeProcessor } })
      : new BpmnVisualization(null);
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/xml-parsing/special/start-tasks-end_entities_in_attributes.bpmn'));

    const expectElementLabel = (id: string): jest.JestMatchers<string> => {
      const model = bpmnVisualization.graph.getDataModel();
      const cell = model.getCell(id);
      expect(cell).toBeDefined();
      // eslint-disable-next-line jest/valid-expect -- util function
      return expect(String(cell.getValue()));
    };

    test('start event', () => {
      expectElementLabel('StartEvent_1').toBe(useAdditionalXmlAttributeProcessor ? '®Start Event 1 &reg;\nbuilt with ♠' : '&#174;Start Event 1 &reg;\nbuilt with &#9824;');
    });
    test('task', () => {
      expectElementLabel('Activity_1').toBe(useAdditionalXmlAttributeProcessor ? 'Task 1&nbsp;or task 2&#x2215;3⧵4' : 'Task 1&nbsp;or task 2&#x2215;3&#10741;4');
    });
    test('end event', () => {
      expectElementLabel('EndEvent_1').toBe(
        useAdditionalXmlAttributeProcessor ? '&unknown; End Event & 1/2\\3 Ø \n &yen; / &#165;' : '&unknown; End Event & 1/2\\3 &#x00D8; \n &yen; / &#165;',
      );
    });
    test('sequence flow 1', () => {
      expectElementLabel('Flow_1').toBe('<Sequence> Flow 1&2');
    });
    test('sequence flow 2', () => {
      expectElementLabel('Flow_2').toBe('Sequence \'Flow" 2');
    });
  });
});
