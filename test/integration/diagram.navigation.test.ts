/**
 * Copyright 2022 Bonitasoft S.A.
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

import { initializeBpmnVisualizationWithHtmlElement } from './helpers/bpmn-visualization-initialization';
import { readFileSync } from '../helpers/file-helper';
import { allTestedFitTypes } from './helpers/fit-utils';
import { type FitType, ZoomType } from '../../src/component/options';

const bpmnVisualization = initializeBpmnVisualizationWithHtmlElement('bpmn-container', true);

describe('diagram navigation', () => {
  beforeEach(() => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
  });

  // The following tests ensure there is no error when calling the fit method
  describe('Fit', () => {
    it('Fit no options', async () => {
      bpmnVisualization.navigation.fit();
    });

    it.each(allTestedFitTypes)('Fit with %s', (fitType: string) => {
      bpmnVisualization.navigation.fit({ type: <FitType>fitType });
    });
  });

  describe('Zoom', () => {
    it.each`
      zoomType
      ${undefined}
      ${null}
      ${ZoomType.In}
      ${ZoomType.Out}
      ${'invalid'}
    `('Zoom with $zoomType', ({ zoomType }: { zoomType: ZoomType }) => {
      // ensure no error
      bpmnVisualization.navigation.zoom(zoomType);
    });
  });
});
