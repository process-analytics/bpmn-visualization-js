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
// TODO maxgraph@0.23.0 replace `@since 0.x.y` in this file by the version that ships the maxGraph migration

/**
 * The BPMN specific properties of a maxGraph style.
 *
 * They are declared at the top level of the style, with the `bv` prefix showing they belong to bpmn-visualization, as
 * recommended by maxGraph to extend its styles (see https://github.com/maxGraph/maxGraph/blob/b612af2f016e7b18051d6b28bf9363921e75c2b2/packages/website/docs/guides/extend-maxgraph.md#keep-your-custom-properties-flat).
 *
 * They replace the custom `bpmn.*` string keys that were stored in mxGraph style strings: each former key is now a
 * typed property. Booleans replace the former `'true'`/`'false'` strings and arrays replace the former delimited
 * strings (`bvMarkers`, `bvCssClasses`).
 *
 * They are merged into the maxGraph `CellStyle` and `CellStateStyle` types by module augmentation, so they can be read
 * and written on any maxGraph style, without casting it.
 *
 * **WARN**: This is part of the BPMN Theme customization surface. The way the default BPMN theme can be modified is
 * subject to change.
 *
 * @category BPMN Theme
 * @experimental
 * @since 0.x.y
 */
export interface BpmnCellStyleExtension {
  bvAssociationDirectionKind?: AssociationDirectionKind;
  bvCssClasses?: string[];
  bvEventDefinitionKind?: ShapeBpmnEventDefinitionKind;
  bvGatewayKind?: ShapeBpmnEventBasedGatewayKind;
  bvGlobalTaskKind?: GlobalTaskKind;
  bvIsInitiating?: boolean;
  bvIsInstantiating?: boolean;
  bvIsInterrupting?: boolean;
  bvKind?: ShapeBpmnElementKind | FlowKind;
  bvMarkers?: ShapeBpmnMarkerKind[];
  bvSequenceFlowKind?: SequenceFlowKind;
  bvSubProcessKind?: ShapeBpmnSubProcessKind;
}

declare module '@maxgraph/core' {
  // Augment CellStateStyle rather than CellStyle: CellStyle extends CellStateStyle, so the BPMN properties are available on
  // both, and on everything built on CellStateStyle (CellState.style, Shape.style, the Stylesheet default and named styles).
  // API Extractor drops this block from the public declarations: the "generate-types:add-module-augmentation" script adds
  // it back, and test/typescript-support checks that a consumer sees the BPMN properties on the maxGraph style types.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- the interface is declared to merge the BPMN properties into the maxGraph one
  interface CellStateStyle extends BpmnCellStyleExtension {}
}
