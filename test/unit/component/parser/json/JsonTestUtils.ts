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
import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import Shape from '../../../../../src/model/bpmn/shape/Shape';
import { defaultBpmnJsonParser } from '../../../../../src/component/parser/json/BpmnJsonParser';
import Edge from '../../../../../src/model/bpmn/edge/Edge';
import BpmnModel from '../../../../../src/model/bpmn/BpmnModel';
import Waypoint from '../../../../../src/model/bpmn/edge/Waypoint';
import { ShapeBpmnBoundaryEvent, ShapeBpmnEvent, ShapeBpmnSubProcess } from '../../../../../src/model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnEventKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnEventKind';
import { SequenceFlowKind } from '../../../../../src/model/bpmn/edge/SequenceFlowKind';
import Label from '../../../../../src/model/bpmn/Label';
import { ShapeBpmnSubProcessKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnSubProcessKind';

export interface ExpectedShape {
  shapeId: string;
  bpmnElementId: string;
  bpmnElementName: string;
  bpmnElementKind: ShapeBpmnElementKind;
  parentId?: string;
  bounds?: ExpectedBounds;
  isExpanded?: boolean;
}

export interface ExpectedEdge {
  edgeId: string;
  bpmnElementId: string;
  bpmnElementName: string;
  bpmnElementSourceRefId: string;
  bpmnElementTargetRefId: string;
  bpmnElementKind?: SequenceFlowKind;
  waypoints?: Waypoint[];
}

export interface ExpectedFont {
  name?: string;
  size?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikeThrough?: boolean;
}

export interface ExpectedBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function parseJson(json: string): BpmnModel {
  return defaultBpmnJsonParser().parse(JSON.parse(json));
}

export function parseJsonAndExpect(
  json: string,
  numberOfExpectedPools: number,
  numberOfExpectedLanes: number,
  numberOfExpectedFlowNodes: number,
  numberOfExpectedEdges: number,
): BpmnModel {
  const model = parseJson(json);
  expect(model.lanes).toHaveLength(numberOfExpectedLanes);
  expect(model.pools).toHaveLength(numberOfExpectedPools);
  expect(model.flowNodes).toHaveLength(numberOfExpectedFlowNodes);
  expect(model.edges).toHaveLength(numberOfExpectedEdges);
  return model;
}

export function parseJsonAndExpectOnlyLanes(json: string, numberOfExpectedLanes: number): BpmnModel {
  return parseJsonAndExpect(json, 0, numberOfExpectedLanes, 0, 0);
}

export function parseJsonAndExpectOnlyPoolsAndLanes(json: string, numberOfExpectedPools: number, numberOfExpectedLanes: number): BpmnModel {
  return parseJsonAndExpect(json, numberOfExpectedPools, numberOfExpectedLanes, 0, 0);
}

export function parseJsonAndExpectOnlyPools(json: string, numberOfExpectedPools: number): BpmnModel {
  return parseJsonAndExpect(json, numberOfExpectedPools, 0, 0, 0);
}

export function parseJsonAndExpectOnlyPoolsAndFlowNodes(json: string, numberOfExpectedPools: number, numberOfExpectedFlowNodes: number): BpmnModel {
  return parseJsonAndExpect(json, numberOfExpectedPools, 0, numberOfExpectedFlowNodes, 0);
}

export function parseJsonAndExpectOnlyFlowNodes(json: string, numberOfExpectedFlowNodes: number): BpmnModel {
  return parseJsonAndExpect(json, 0, 0, numberOfExpectedFlowNodes, 0);
}

export function parseJsonAndExpectOnlyEdges(json: string, numberOfExpectedEdges: number): BpmnModel {
  return parseJsonAndExpect(json, 0, 0, 0, numberOfExpectedEdges);
}

export function parseJsonAndExpectOnlyEdgesAndFlowNodes(json: string, numberOfExpectedEdges: number, numberOfExpectedFlowNodes: number): BpmnModel {
  return parseJsonAndExpect(json, 0, 0, numberOfExpectedFlowNodes, numberOfExpectedEdges);
}

export function verifyShape(shape: Shape, expectedShape: ExpectedShape): void {
  expect(shape.id).toEqual(expectedShape.shapeId);

  if (shape.isExpanded) {
    expect(shape.isExpanded).toEqual(expectedShape.isExpanded);
  } else {
    expect(shape.isExpanded).toBeFalsy();
  }

  const bpmnElement = shape.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedShape.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedShape.bpmnElementName);
  expect(bpmnElement.kind).toEqual(expectedShape.bpmnElementKind);
  expect(bpmnElement.parentId).toEqual(expectedShape.parentId);

  const bounds = shape.bounds;
  const expectedBounds = expectedShape.bounds;
  expect(bounds.x).toEqual(expectedBounds.x);
  expect(bounds.y).toEqual(expectedBounds.y);
  expect(bounds.width).toEqual(expectedBounds.width);
  expect(bounds.height).toEqual(expectedBounds.height);
}

export function verifyEdge(edge: Edge, expectedValue: ExpectedEdge): void {
  expect(edge.id).toEqual(expectedValue.edgeId);
  expect(edge.waypoints).toEqual(expectedValue.waypoints);

  const bpmnElement = edge.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedValue.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedValue.bpmnElementName);
  expect(bpmnElement.sourceRefId).toEqual(expectedValue.bpmnElementSourceRefId);
  expect(bpmnElement.targetRefId).toEqual(expectedValue.bpmnElementTargetRefId);

  if (expectedValue.bpmnElementKind) {
    expect(bpmnElement.kind).toEqual(expectedValue.bpmnElementKind);
  } else {
    expect(bpmnElement.kind).toEqual(SequenceFlowKind.NORMAL);
  }
}

export function verifyEvent(model: BpmnModel, kind: ShapeBpmnEventKind, expectedNumber: number): void {
  const events = model.flowNodes.filter(shape => {
    const bpmnElement = shape.bpmnElement;
    return bpmnElement instanceof ShapeBpmnEvent && (bpmnElement as ShapeBpmnEvent).eventKind === kind;
  });
  expect(events).toHaveLength(expectedNumber);
}

export function verifyBoundaryEvent(model: BpmnModel, kind: ShapeBpmnEventKind, expectedNumber: number, isInterrupting?: boolean): void {
  const events = model.flowNodes.filter(shape => {
    const bpmnElement = shape.bpmnElement;
    return (
      bpmnElement instanceof ShapeBpmnBoundaryEvent &&
      (bpmnElement as ShapeBpmnBoundaryEvent).eventKind === kind &&
      (bpmnElement as ShapeBpmnBoundaryEvent).isInterrupting === isInterrupting
    );
  });
  expect(events).toHaveLength(expectedNumber);
}

export function verifySubProcess(model: BpmnModel, kind: ShapeBpmnSubProcessKind, expectedNumber: number): void {
  const events = model.flowNodes.filter(shape => {
    const bpmnElement = shape.bpmnElement;
    return bpmnElement instanceof ShapeBpmnSubProcess && (bpmnElement as ShapeBpmnSubProcess).subProcessKind === kind;
  });
  expect(events).toHaveLength(expectedNumber);
}

export function verifyLabelFont(label: Label, expectedFont?: ExpectedFont): void {
  expect(label).toBeDefined();

  const font = label.font;
  if (expectedFont) {
    expect(font.isBold).toEqual(expectedFont.isBold);
    expect(font.isItalic).toEqual(expectedFont.isItalic);
    expect(font.isStrikeThrough).toEqual(expectedFont.isStrikeThrough);
    expect(font.isUnderline).toEqual(expectedFont.isUnderline);
    expect(font.name).toEqual(expectedFont.name);
    expect(font.size).toEqual(expectedFont.size);
  } else {
    expect(font).toBeUndefined();
  }
}

export function verifyLabelBounds(label: Label, expectedBounds?: ExpectedBounds): void {
  expect(label).toBeDefined();

  const bounds = label.bounds;
  if (expectedBounds) {
    expect(bounds.x).toEqual(expectedBounds.x);
    expect(bounds.y).toEqual(expectedBounds.y);
    expect(bounds.width).toEqual(expectedBounds.width);
    expect(bounds.height).toEqual(expectedBounds.height);
  } else {
    expect(bounds).toBeUndefined();
  }
}

export function parseJsonAndExpectOnlyEvent(json: string, kind: ShapeBpmnEventKind, expectedNumber: number): BpmnModel {
  const model = parseJson(json);

  expect(model.lanes).toHaveLength(0);
  expect(model.pools).toHaveLength(0);
  expect(model.edges).toHaveLength(0);

  verifyEvent(model, kind, expectedNumber);

  return model;
}

export function parseJsonAndExpectOnlyBoundaryEvent(json: string, kind: ShapeBpmnEventKind, expectedNumber: number, isInterrupting?: boolean): BpmnModel {
  const model = parseJson(json);

  expect(model.lanes).toHaveLength(0);
  expect(model.pools).toHaveLength(0);
  expect(model.edges).toHaveLength(0);

  verifyBoundaryEvent(model, kind, expectedNumber, isInterrupting);

  return model;
}
export function parseJsonAndExpectOnlySubProcess(json: string, kind: ShapeBpmnSubProcessKind, expectedNumber: number): BpmnModel {
  const model = parseJson(json);

  expect(model.lanes).toHaveLength(0);
  expect(model.pools).toHaveLength(0);
  expect(model.edges).toHaveLength(0);

  verifySubProcess(model, kind, expectedNumber);

  return model;
}
