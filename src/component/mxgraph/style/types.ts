/*
Copyright 2024 Bonitasoft S.A.

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

import type { CellStateStyle, CellStyle } from '@maxgraph/core';
import type {
  AssociationDirectionKind,
  FlowKind,
  GlobalTaskKind,
  SequenceFlowKind,
  ShapeBpmnElementKind,
  ShapeBpmnEventBasedGatewayKind,
  ShapeBpmnEventDefinitionKind,
  ShapeBpmnMarkerKind,
  ShapeBpmnSubProcessKind,
} from '../../../model/bpmn/internal';

export interface BpmnCellStyleExtension {
  associationDirectionKind?: AssociationDirectionKind;
  eventDefinitionKind?: ShapeBpmnEventDefinitionKind;
  extraCssClasses?: string[];
  gatewayKind?: ShapeBpmnEventBasedGatewayKind;
  globalTaskKind?: GlobalTaskKind;
  isInitiating?: boolean;
  isInstantiating?: boolean;
  isInterrupting?: boolean;
  kind?: ShapeBpmnElementKind | FlowKind;
  markers?: ShapeBpmnMarkerKind[];
  sequenceFlowKind?: SequenceFlowKind;
  subProcessKind?: ShapeBpmnSubProcessKind;
}

// TODO migration maxGraph@0.10.2 check if we can use interface augmentation on CellStyle/CellStateStyle instead of extending the type. This would avoid to cast CellStyle/CellStateStyle everywhere in the code
export interface BpmnCellStyle extends CellStyle {
  bpmn?: BpmnCellStyleExtension;
}

export interface BpmnCellStateStyle extends CellStateStyle {
  bpmn?: BpmnCellStyleExtension;
}
