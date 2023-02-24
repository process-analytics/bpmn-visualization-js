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

import { BpmnVisualization, type GlobalOptions } from '../../../src/bpmn-visualization';
import { insertBpmnContainer, insertBpmnContainerWithoutId } from './dom-utils';

export type GlobalOptionsWithoutContainer<C extends string> = Omit<GlobalOptions<C>, 'container'>;

export const initializeBpmnVisualizationWithContainerId = <C extends string>(
  bpmnContainerId = 'bpmn-visualization-container',
  globalOptions?: GlobalOptionsWithoutContainer<C>,
): BpmnVisualization<C> => {
  return initializeBpmnVisualization(bpmnContainerId, globalOptions);
};

export const initializeBpmnVisualizationWithHtmlElement = <C extends string>(
  bpmnContainerId = 'bpmn-visualization-container-alternative',
  withNavigation = false,
): BpmnVisualization<C> => {
  return initializeBpmnVisualization(bpmnContainerId, { navigation: { enabled: withNavigation } });
};

export const initializeBpmnVisualization = <C extends string>(bpmnContainerId?: string, globalOptions?: GlobalOptionsWithoutContainer<C>): BpmnVisualization<C> => {
  const options = { container: insertBpmnContainer(bpmnContainerId), ...globalOptions };
  return new BpmnVisualization(options);
};

export const initializeBpmnVisualizationWithoutId = <C extends string>(globalOptions?: GlobalOptionsWithoutContainer<C>): BpmnVisualization<C> => {
  const options = { container: insertBpmnContainerWithoutId(), ...globalOptions };
  return new BpmnVisualization(options);
};
