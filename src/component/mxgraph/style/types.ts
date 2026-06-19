/*
Copyright 2026 Bonitasoft S.A.

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
import type { CellStateStyle, CellStyle } from '@maxgraph/core';

/**
 * The BPMN specific data attached to a maxGraph style under the {@link BpmnCellStyle.bpmn} property.
 *
 * It replaces the custom `bpmn.*` string keys that were stored in mxGraph style strings: each former key is now a
 * typed property. Booleans replace the former `'true'`/`'false'` strings and arrays replace the former delimited
 * strings (`markers`, `extraCssClasses`).
 *
 * **WARN**: This is part of the BPMN Theme customization surface. The way the default BPMN theme can be modified is
 * subject to change.
 *
 * @category BPMN Theme
 * @experimental
 * @since 0.48.0
 */
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

// TODO maxgraph@0.24.0 check if we can use interface augmentation on CellStyle/CellStateStyle instead of extending the type.
// This would avoid having to cast CellStyle/CellStateStyle everywhere in the code. We'd have to check whether the
// augmentation is visible to libraries consuming bpmn-visualization, otherwise it's useless.

/**
 * A maxGraph {@link CellStyle} enriched with the BPMN specific data carried under the {@link bpmn} property.
 *
 * It is the maxGraph object replacement for the former mxGraph style strings produced by bpmn-visualization.
 *
 * **WARN**: This is part of the BPMN Theme customization surface and is subject to change.
 *
 * @category BPMN Theme
 * @experimental
 * @since 0.48.0
 */
export interface BpmnCellStyle extends CellStyle {
  bpmn?: BpmnCellStyleExtension;
}

/**
 * A maxGraph {@link CellStateStyle} enriched with the BPMN specific data carried under the {@link bpmn} property.
 *
 * It is the resolved (cell state) counterpart of {@link BpmnCellStyle}, used when reading the style of a rendered cell.
 *
 * **WARN**: This is part of the BPMN Theme customization surface and is subject to change.
 *
 * @category BPMN Theme
 * @experimental
 * @since 0.48.0
 */
export interface BpmnCellStateStyle extends CellStateStyle {
  bpmn?: BpmnCellStyleExtension;
}
