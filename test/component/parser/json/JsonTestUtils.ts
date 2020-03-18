import { expect } from 'chai';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import Shape from '../../../../src/model/bpmn/shape/Shape';
import BpmnJsonParser from '../../../../src/component/parser/json/BpmnJsonParser';
import Edge from '../../../../src/model/bpmn/edge/Edge';

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
  expect(model.lanes).to.have.lengthOf(numberOfExpectedLanes, 'lanes');
  expect(model.edges).to.have.lengthOf(0, 'edges');
  expect(model.flowNodes).to.have.lengthOf(0, 'flowNodes');
  return model;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonAndExpectOnlyPoolsAndLanes(json: string, numberOfExpectedPools: number, numberOfExpectedLanes: number): any {
  const model = parseJsonAndExpectOnlyLanes(json, numberOfExpectedLanes);
  expect(model.pools).to.have.lengthOf(numberOfExpectedPools, 'pools');
  return model;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonAndExpectOnlyFlowNodes(json: string, numberOfExpectedFlowNodes: number): any {
  const model = BpmnJsonParser.parse(JSON.parse(json));
  expect(model.lanes).to.have.lengthOf(0, 'lanes');
  expect(model.flowNodes).to.have.lengthOf(numberOfExpectedFlowNodes, 'flow nodes');
  expect(model.edges).to.have.lengthOf(0, 'edges');
  return model;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonAndExpectOnlyEdges(json: string, numberOfExpectedEdges: number): any {
  const model = BpmnJsonParser.parse(JSON.parse(json));
  expect(model.lanes).to.have.lengthOf(0, 'lanes');
  expect(model.flowNodes).to.have.lengthOf(0, 'flowNodes');
  expect(model.edges).to.have.lengthOf(numberOfExpectedEdges, 'edges');
  return model;
}

export function verifyShape(shape: Shape, expectedValue: ExpectedShape): void {
  expect(shape.id).to.be.equal(expectedValue.shapeId, 'shape id');

  const bpmnElement = shape.bpmnElement;
  expect(bpmnElement.id).to.be.equal(expectedValue.bpmnElementId, 'bpmn element id');
  expect(bpmnElement.name).to.be.equal(expectedValue.bpmnElementName, 'bpmn element name');
  expect(bpmnElement.kind).to.be.equal(expectedValue.bpmnElementKind, 'bpmn element kind');

  const bounds = shape.bounds;
  expect(bounds.x).to.be.equal(expectedValue.boundsX, 'bounds x');
  expect(bounds.y).to.be.equal(expectedValue.boundsY, 'bounds y');
  expect(bounds.width).to.be.equal(expectedValue.boundsWidth, 'bounds width');
  expect(bounds.height).to.be.equal(expectedValue.boundsHeight, 'bounds height');
}

export function verifyEdge(edge: Edge, expectedValue: ExpectedEdge): void {
  expect(edge.id).to.be.equal(expectedValue.edgeId, 'edges id');

  const bpmnElement = edge.bpmnElement;
  expect(bpmnElement.id).to.be.equal(expectedValue.bpmnElementId, 'bpmn element id');
  expect(bpmnElement.name).to.be.equal(expectedValue.bpmnElementName, 'bpmn element name');
  expect(bpmnElement.sourceRefId).to.be.equal(expectedValue.bpmnElementSourceRefId, 'bpmn element sourceRef');
  expect(bpmnElement.targetRefId).to.be.equal(expectedValue.bpmnElementTargetRefId, 'bpmn element targetRef');
}
