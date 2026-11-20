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

// TODO maxgraph@0.23.0 replace `@since 0.x.y` in this file by the version that ships the maxGraph migration

// TODO maxgraph@0.23.0 flatten the BPMN style properties instead of nesting them under the `bpmn` object.
// The maxGraph recommendation is to declare each custom property at the top level of the style, with a shared prefix
// showing they belong together, see https://github.com/maxGraph/maxGraph/blob/b612af2f016e7b18051d6b28bf9363921e75c2b2/packages/website/docs/guides/extend-maxgraph.md#keep-your-custom-properties-flat
// Use the `bv` prefix (for instance `bvKind`, `bvMarkers`).

/**
 * The BPMN specific data attached to a maxGraph style under the {@link BpmnCellStyle.bpmn} property.
 *
 * It replaces the custom `bpmn.*` string keys that were stored in mxGraph style strings: each former key is now a
 * typed property. Booleans replace the former `'true'`/`'false'` strings and arrays replace the former delimited
 * strings (`markers`, `cssClasses`).
 *
 * **WARN**: This is part of the BPMN Theme customization surface. The way the default BPMN theme can be modified is
 * subject to change.
 *
 * @category BPMN Theme
 * @experimental
 * @since 0.x.y
 */
export interface BpmnCellStyleExtension {
  associationDirectionKind?: AssociationDirectionKind;
  eventDefinitionKind?: ShapeBpmnEventDefinitionKind;
  cssClasses?: string[];
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

// TODO maxgraph@0.24.0 use module augmentation on CellStyle/CellStateStyle instead of extending the type, available
// since maxGraph 0.25.0 (https://github.com/maxGraph/maxGraph/pull/1147), so apply it when upgrading to maxGraph 0.25.0
// or later. This would avoid having to cast CellStyle/CellStateStyle everywhere in the code. We'd have to check whether
// the augmentation is visible to libraries consuming bpmn-visualization, otherwise it's useless.
// Verify it in test/typescript-support, in a dedicated file, as maxGraph does in its ts-support package, see
// https://github.com/maxGraph/maxGraph/blob/b612af2f016e7b18051d6b28bf9363921e75c2b2/packages/ts-support/src/module-augmentation.ts

/**
 * A maxGraph {@link CellStyle} enriched with the BPMN specific data carried under the {@link bpmn} property.
 *
 * It is the maxGraph object replacement for the former mxGraph style strings produced by bpmn-visualization.
 *
 * **WARN**: This is part of the BPMN Theme customization surface and is subject to change.
 *
 * @category BPMN Theme
 * @experimental
 * @since 0.x.y
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
 * @since 0.x.y
 */
export interface BpmnCellStateStyle extends CellStateStyle {
  bpmn?: BpmnCellStyleExtension;
}
