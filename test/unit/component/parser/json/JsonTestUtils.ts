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
import { ShapeBpmnEvent } from '../../../../../src/model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnEventKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnEventKind';
import { SequenceFlowKind } from '../../../../../src/model/bpmn/edge/SequenceFlowKind';

export interface ExpectedShape {
  shapeId: string;
  bpmnElementId: string;
  bpmnElementName: string;
  bpmnElementKind: ShapeBpmnElementKind;
  boundsX: number;
  boundsY: number;
  boundsWidth: number;
  boundsHeight: number;
  parentId?: string;
}

export interface ExpectedEvent {
  kind: ShapeBpmnEventKind;
  expectedNumber: number;
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

export function verifyShape(shape: Shape, expectedValue: ExpectedShape): void {
  expect(shape.id).toEqual(expectedValue.shapeId);

  const bpmnElement = shape.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedValue.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedValue.bpmnElementName);
  expect(bpmnElement.kind).toEqual(expectedValue.bpmnElementKind);
  expect(bpmnElement.parentId).toEqual(expectedValue.parentId);

  const bounds = shape.bounds;
  expect(bounds.x).toEqual(expectedValue.boundsX);
  expect(bounds.y).toEqual(expectedValue.boundsY);
  expect(bounds.width).toEqual(expectedValue.boundsWidth);
  expect(bounds.height).toEqual(expectedValue.boundsHeight);
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

export function verifyEvents(model: BpmnModel, expectedEvents: ExpectedEvent[]): void {
  expectedEvents.forEach(expectedEvent => {
    verifyEvent(model, expectedEvent.kind, expectedEvent.expectedNumber);
  });
}

export function parseJsonAndExpectOnlyEvent(json: string, kind: ShapeBpmnEventKind, expectedNumber: number): BpmnModel {
  const model = parseJson(json);

  expect(model.lanes).toHaveLength(0);
  expect(model.pools).toHaveLength(0);
  expect(model.edges).toHaveLength(0);

  verifyEvent(model, kind, expectedNumber);

  return model;
}
