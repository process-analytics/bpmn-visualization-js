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
import { expectPoolLaneEdgeFlowNode } from '../../helpers/JsonTestUtils';
import { newBpmnParser } from '../../../../src/component/parser/BpmnParser';
import { readFileSync } from '../../../helpers/file-helper';

describe('parse xml to model', () => {
  it('Single process with no participant', () => {
    const model = newBpmnParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/miwg-A.1.0.bpmn'));

    expectPoolLaneEdgeFlowNode(model, 0, 0, 4, 5);
  });

  describe('error management', () => {
    const parsingErrorMessage = `XML parsing failed. Unable to retrieve 'definitions' from the BPMN source.`;

    it('Parse a text file', () => {
      expect(() => newBpmnParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/text-only.txt'))).toThrow(parsingErrorMessage);
    });

    it('Parse a truncated diagram file', () => {
      // we don't have xml validation so the parsing is done. The parser tries to extract the most it can from the xml.
      const model = newBpmnParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/simple-start-task-end_truncated.bpmn'));
      expect(model.flowNodes).toHaveLength(2);
      // This element is truncated in the source xml file
      const activities = model.flowNodes.filter(shape => shape.id == 'BPMNShape_Activity_1');
      expect(activities[0].bpmnElement.id).toBe('Activity_1');
    });

    it('Parse a xml file which is not a BPMN diagram', () => {
      expect(() => newBpmnParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/xml-but-not-bpmn.xml'))).toThrow(parsingErrorMessage);
    });
  });
});
