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

import type { CellStyle } from '@maxgraph/core';
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

// TODO maxgraph@0.1.0 rename for consistent naming BPMNCellStyle --> BpmnCellStyle (apply to other places)
//  a BpmnCellStyle exists in tests. Try to use this one instead
// TODO maxgraph@0.1.0 sort properties in alphabetical order for clarity (and as done in maxGraph CellStyle) and provide documentation about each property
export interface BPMNCellStyle extends CellStyle {
  bpmn?: {
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
  };
}
