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
import type { Bounds, Point } from './DC';
import type { BPMNEdge, BPMNLabel, BPMNShape } from './BPMNDI';
import type { TExtension } from './Semantic';

// <xsd:any namespace="##other" minOccurs="0" maxOccurs="unbounded" />
export interface DiagramElement {
  id?: string;
  extension?: TExtension | TExtension[];
}

export interface Diagram {
  name?: string;
  documentation?: string;
  resolution?: number;
  id?: string;
}

export type Node = DiagramElement;

export interface Edge extends DiagramElement {
  waypoint: Point[];
}

export type LabeledEdge = Edge;

export interface Shape extends Node {
  Bounds: Bounds;
}

export type LabeledShape = Shape;

export interface Label extends Node {
  Bounds?: Bounds;
}

export interface Plane extends Node {
  BPMNEdge?: BPMNEdge | BPMNEdge[];
  BPMNShape?: BPMNShape | BPMNShape[];
  BPMNLabel?: BPMNLabel | BPMNLabel[];
}

export interface Style {
  id: string;
}
