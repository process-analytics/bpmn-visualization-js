import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import Shape from '../../../../../src/model/bpmn/shape/Shape';
import BpmnJsonParser from '../../../../../src/component/parser/json/BpmnJsonParser';
import Edge from '../../../../../src/model/bpmn/edge/Edge';

export interface ExpectedShape {
  shapeId: string;
  bpmnElementId: string;
  bpmnElementName: string;
  bpmnElementKind: ShapeBpmnElementKind;
  boundsX: number;
  boundsY: number;
  boundsWidth: number;
  boundsHeight: number;
}

export interface ExpectedEdge {
  edgeId: string;
  bpmnElementId: string;
  bpmnElementName: string;
  bpmnElementSourceRefId: string;
  bpmnElementTargetRefId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJson(json: string): any {
  return BpmnJsonParser.parse(JSON.parse(json));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonAndExpectOnlyLanes(json: string, numberOfExpectedLanes: number): any {
  const model = BpmnJsonParser.parse(JSON.parse(json));
  expect(model.lanes).toHaveLength(numberOfExpectedLanes);
  expect(model.edges).toHaveLength(0);
  expect(model.flowNodes).toHaveLength(0);
  return model;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonAndExpectOnlyFlowNodes(json: string, numberOfExpectedFlowNodes: number): any {
  const model = BpmnJsonParser.parse(JSON.parse(json));
  expect(model.lanes).toHaveLength(0);
  expect(model.flowNodes).toHaveLength(numberOfExpectedFlowNodes);
  expect(model.edges).toHaveLength(0);
  return model;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonAndExpectOnlyEdges(json: string, numberOfExpectedEdges: number): any {
  const model = BpmnJsonParser.parse(JSON.parse(json));
  expect(model.lanes).toHaveLength(0);
  expect(model.flowNodes).toHaveLength(0);
  expect(model.edges).toHaveLength(numberOfExpectedEdges);
  return model;
}

export function verifyShape(shape: Shape, expectedValue: ExpectedShape): void {
  expect(shape.id).toEqual(expectedValue.shapeId);

  const bpmnElement = shape.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedValue.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedValue.bpmnElementName);
  expect(bpmnElement.kind).toEqual(expectedValue.bpmnElementKind);

  const bounds = shape.bounds;
  expect(bounds.x).toEqual(expectedValue.boundsX);
  expect(bounds.y).toEqual(expectedValue.boundsY);
  expect(bounds.width).toEqual(expectedValue.boundsWidth);
  expect(bounds.height).toEqual(expectedValue.boundsHeight);
}

export function verifyEdge(edge: Edge, expectedValue: ExpectedEdge): void {
  expect(edge.id).toEqual(expectedValue.edgeId);

  const bpmnElement = edge.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedValue.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedValue.bpmnElementName);
  expect(bpmnElement.sourceRefId).toEqual(expectedValue.bpmnElementSourceRefId);
  expect(bpmnElement.targetRefId).toEqual(expectedValue.bpmnElementTargetRefId);
}
