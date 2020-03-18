import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import Shape from '../../../../../src/model/bpmn/shape/Shape';
import BpmnJsonParser from '../../../../../src/component/parser/json/BpmnJsonParser';
import Edge from '../../../../../src/model/bpmn/edge/Edge';
import BpmnModel from '../../../../../src/model/bpmn/BpmnModel';
import Waypoint from '../../../../../src/model/bpmn/edge/Waypoint';

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

export interface ExpectedEdge {
  edgeId: string;
  bpmnElementId: string;
  bpmnElementName: string;
  bpmnElementSourceRefId: string;
  bpmnElementTargetRefId: string;
  waypoints?: Waypoint[];
}

export function parseJson(json: string): BpmnModel {
  return BpmnJsonParser.parse(JSON.parse(json));
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
}
