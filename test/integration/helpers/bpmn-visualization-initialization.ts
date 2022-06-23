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
import { insertBpmnContainer } from './dom-utils';

export type GlobalOptionsWithoutContainer = Omit<GlobalOptions, 'container'>;

export const initializeBpmnVisualization = (containerId?: string, options?: GlobalOptionsWithoutContainer): BpmnVisualization => {
  const bpmnContainerId = containerId ?? 'bpmn-visualization-container';
  insertBpmnContainer(bpmnContainerId);
  return new BpmnVisualization({ container: bpmnContainerId, ...options });
};

export const initializeBpmnVisualizationWithHtmlElement = (containerId?: string, withNavigation = false): BpmnVisualization => {
  const bpmnContainerId = containerId ?? 'bpmn-visualization-container-alternative';
  const options = { container: insertBpmnContainer(bpmnContainerId), navigation: { enabled: withNavigation } };
  return new BpmnVisualization(options);
};
