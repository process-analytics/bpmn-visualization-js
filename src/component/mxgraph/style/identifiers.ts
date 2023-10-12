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

/**
 * Define BPMN specific keys used in mxGraph styles. Use constants defined in this class instead of hard coded string values.
 *
 * **WARN**: You may use it to customize the BPMN Theme as suggested in the examples. But be aware that the way the default BPMN theme can be modified is subject to change.
 *
 * @category BPMN Theme
 * @experimental
 */
export const BpmnStyleIdentifier = {
  // edge
  EDGE: 'bpmn.edge',
  EDGE_START_FILL_COLOR: 'bpmn.edge.startFillColor',
  EDGE_END_FILL_COLOR: 'bpmn.edge.endFillColor',

  // kind
  EVENT_BASED_GATEWAY_KIND: 'bpmn.gatewayKind',
  EVENT_DEFINITION_KIND: 'bpmn.eventDefinitionKind',
  GLOBAL_TASK_KIND: 'bpmn.globalTaskKind',
  SUB_PROCESS_KIND: 'bpmn.subProcessKind',

  // state
  IS_INITIATING: 'bpmn.isInitiating',
  IS_INSTANTIATING: 'bpmn.isInstantiating',
  IS_INTERRUPTING: 'bpmn.isInterrupting',

  // other identifiers
  EXTRA_CSS_CLASSES: 'bpmn.extra.css.classes',
  MARKERS: 'bpmn.markers',
  MESSAGE_FLOW_ICON: 'bpmn.messageFlowIcon',
};

/**
 * **WARN**: You may use it to customize the BPMN Theme as suggested in the examples. But be aware that the way the default BPMN theme can be modified is subject to change.
 *
 * @category BPMN Theme
 * @experimental
 */
export const MarkerIdentifier = {
  ARROW_DASH: 'bpmn.dash',
};
