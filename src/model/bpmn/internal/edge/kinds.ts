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

/**
 * The real name of the field in the BPMN XSD
 * @internal
 */
export enum AssociationDirectionKind {
  NONE = 'None',
  ONE = 'One',
  BOTH = 'Both',
}

/**
 * The real name of the field in the BPMN XSD.
 * @category BPMN
 */
export enum FlowKind {
  SEQUENCE_FLOW = 'sequenceFlow',
  MESSAGE_FLOW = 'messageFlow',
  ASSOCIATION_FLOW = 'association',
}

/**
 * The real value of the visible message field in the BPMN XSD, except 'None'.
 * @category BPMN
 */
export enum MessageVisibleKind {
  NONE = 'none',
  INITIATING = 'initiating',
  NON_INITIATING = 'non_initiating',
}

/**
 * @internal
 */
export enum SequenceFlowKind {
  NORMAL = 'normal',
  DEFAULT = 'default',
  CONDITIONAL_FROM_ACTIVITY = 'conditional_from_activity',
  CONDITIONAL_FROM_GATEWAY = 'conditional_from_gateway',
}
