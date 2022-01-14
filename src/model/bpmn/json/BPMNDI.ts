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
import type { Diagram, Label, LabeledEdge, LabeledShape, Plane, Style } from './DI';
import type { Font } from './DC';

export interface BPMNDiagram extends Diagram {
  BPMNPlane: BPMNPlane;
  BPMNLabelStyle?: BPMNLabelStyle | BPMNLabelStyle[];
}

export interface BPMNPlane extends Plane {
  bpmnElement?: string;
}

export interface BPMNEdge extends LabeledEdge {
  BPMNLabel?: string | BPMNLabel;
  bpmnElement?: string;
  sourceElement?: string;
  targetElement?: string;
  messageVisibleKind?: MessageVisibleKind;
}

export interface BPMNShape extends LabeledShape {
  BPMNLabel?: string | BPMNLabel;
  bpmnElement?: string;
  isHorizontal?: boolean;
  isExpanded?: boolean;
  isMarkerVisible?: boolean;
  isMessageVisible?: boolean;
  participantBandKind?: ParticipantBandKind;
  choreographyActivityShape?: string;
}

export interface BPMNLabel extends Label {
  labelStyle?: string;
}

export interface BPMNLabelStyle extends Style {
  Font?: string | Font | (string | Font)[];
}

export enum ParticipantBandKind {
  topInitiating = 'top_initiating',
  middleInitiating = 'middle_initiating',
  bottomInitiating = 'bottom_initiating',
  topNonInitiating = 'top_non_initiating',
  middleNonInitiating = 'middle_non_initiating',
  bottomNonInitiating = 'bottom_non_initiating',
}

export enum MessageVisibleKind {
  initiating = 'initiating',
  nonInitiating = 'non_initiating',
}
