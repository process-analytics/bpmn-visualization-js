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

import { BpmnVisualization, type GlobalOptions } from '../../../src/bpmn-visualization';
import { insertBpmnContainer, insertBpmnContainerWithoutId } from './dom-utils';

export type GlobalOptionsWithoutContainer = Omit<GlobalOptions, 'container'>;

export const initializeBpmnVisualizationWithContainerId = (bpmnContainerId = 'bpmn-visualization-container', globalOptions?: GlobalOptionsWithoutContainer): BpmnVisualization => {
  return initializeBpmnVisualization(bpmnContainerId, globalOptions);
};

export const initializeBpmnVisualizationWithHtmlElement = (bpmnContainerId = 'bpmn-visualization-container-alternative', withNavigation = false): BpmnVisualization => {
  return initializeBpmnVisualization(bpmnContainerId, { navigation: { enabled: withNavigation } });
};

export const initializeBpmnVisualization = (bpmnContainerId?: string, globalOptions?: GlobalOptionsWithoutContainer): BpmnVisualization => {
  const options = { container: insertBpmnContainer(bpmnContainerId), ...globalOptions };
  return new BpmnVisualization(options);
};

export const initializeBpmnVisualizationWithoutId = (globalOptions?: GlobalOptionsWithoutContainer): BpmnVisualization => {
  const options = { container: insertBpmnContainerWithoutId(), ...globalOptions };
  return new BpmnVisualization(options);
};
