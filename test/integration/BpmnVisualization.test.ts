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
import { BpmnVisualization, FitType } from '../../src/bpmn-visualization';
import { readFileSync } from '../helpers/file-helper';
import { insertBpmnContainer } from './helpers/dom-utils';

export const bpmnVisualization = new BpmnVisualization({ container: insertBpmnContainer('bpmn-container'), navigation: { enabled: true } });

describe('BpmnVisualization', () => {
  it('Load malformed file', async () => {
    expect(() => bpmnVisualization.load(readFileSync('../fixtures/bpmn/malformed-bpmn-diagram.txt'))).toThrowError(`Cannot read property 'category' of undefined`);
  });

  describe('Fit', () => {
    it('Fit no options', async () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
      bpmnVisualization.fit();
    });

    it.each`
      fitType
      ${undefined}
      ${null}
      ${FitType.Center}
      ${FitType.Horizontal}
      ${FitType.HorizontalVertical}
      ${FitType.None}
      ${FitType.Vertical}
    `('Fit with $fitType', ({ fitType }: { fitType: FitType }) => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
      // ensure not error
      bpmnVisualization.fit({ type: fitType });
    });
  });
});
