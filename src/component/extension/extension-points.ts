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

import type { Edge } from '../../model/bpmn/internal/edge/edge';
import type Shape from '../../model/bpmn/internal/shape/Shape';
import type { BPMNEdge, BPMNShape } from '../../model/bpmn/json/bpmndi';

/**
 * Extension point called during BPMN parsing to allow custom processing of deserialized elements.
 *
 * @since 0.48.0
 * @internal
 */
export interface ParsingExtensionPoint {
  /**
   * Called after a shape has been deserialized from the BPMN XML.
   *
   * @param shape The internal shape model built from the BPMN semantic and diagram data.
   * @param bpmnShape The raw BPMN diagram shape from the XML.
   */
  onShapeDeserialized?(shape: Shape, bpmnShape: BPMNShape): void;

  /**
   * Called after an edge has been deserialized from the BPMN XML.
   *
   * @param edge The internal edge model built from the BPMN semantic and diagram data.
   * @param bpmnEdge The raw BPMN diagram edge from the XML.
   */
  onEdgeDeserialized?(edge: Edge, bpmnEdge: BPMNEdge): void;

  // We have to rework label handling — currently uses hasLabelExtensionData which is a workaround to ensure
  // Labels are created when extensions need them (e.g., color). Find a more generic approach.
  // Current issue: labels set to a shape or edge are immutable, so extensions cannot add a label if not already present. hasLabelExtensionData is used to check if a label should be created for the shape or edge during deserialization.
  // See ADR for more details
  /**
   * Returns `true` if the given BPMN label data requires a label to be created during deserialization.
   *
   * This is a workaround: labels are immutable once set on a shape or edge, so extensions that need a label
   * (e.g., to apply color) must signal that requirement here so the label is created upfront.
   *
   * @param bpmnLabel The raw label data from the BPMN diagram.
   */
  hasLabelExtensionData?(bpmnLabel: unknown): boolean;
}

/**
 * Extension point for enriching the computed style of BPMN elements before they are rendered.
 *
 * @since 0.48.0
 * @internal
 */
export interface StyleExtensionPoint {
  /**
   * Enriches the style values computed for a shape before rendering.
   *
   * @param shape The internal shape model.
   * @param styleValues The mutable map of style key/value pairs to enrich.
   */
  enrichShapeStyle?(shape: Shape, styleValues: Map<string, string | number>): void;

  /**
   * Enriches the style values computed for an edge before rendering.
   *
   * @param edge The internal edge model.
   * @param styleValues The mutable map of style key/value pairs to enrich.
   */
  enrichEdgeStyle?(edge: Edge, styleValues: Map<string, string | number>): void;

  /**
   * Enriches the style values computed for the message flow icon of an edge before rendering.
   *
   * The message flow icon is a distinct visual element painted on a message flow edge.
   *
   * @param edge The internal edge model carrying the message flow icon.
   * @param styleValues The mutable map of style key/value pairs to enrich.
   */
  enrichMessageFlowIconStyle?(edge: Edge, styleValues: Map<string, string | number>): void;
}
