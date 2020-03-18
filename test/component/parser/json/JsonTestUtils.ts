import { expect } from 'chai';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import Shape from '../../../../src/model/bpmn/shape/Shape';
import BpmnJsonParser from '../../../../src/component/parser/json/BpmnJsonParser';
import Edge from '../../../../src/model/bpmn/edge/Edge';
import BpmnModel from '../../../../src/model/bpmn/BpmnModel';

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
}

function expectEdges(model: BpmnModel, numberOfExpectedEdges: number): void {
  expect(model.edges).to.have.lengthOf(numberOfExpectedEdges, 'edges');
}

function expectNoEdges(model: BpmnModel): void {
  expectEdges(model, 0);
}

function expectFlowNodes(model: BpmnModel, numberOfExpectedFlowNodes: number): void {
  expect(model.flowNodes).to.have.lengthOf(numberOfExpectedFlowNodes, 'flow nodes');
}

function expectNoFlowNodes(model: BpmnModel): void {
  expectFlowNodes(model, 0);
}

function expectLanes(model: BpmnModel, numberOfExpectedLanes: number): void {
  expect(model.lanes).to.have.lengthOf(numberOfExpectedLanes, 'lanes');
}

function expectNoLanes(model: BpmnModel): void {
  expectLanes(model, 0);
}

function expectPools(model: BpmnModel, numberOfExpectedPools: number): void {
  expect(model.pools).to.have.lengthOf(numberOfExpectedPools, 'pools');
}

export function parseJson(json: string): BpmnModel {
  return BpmnJsonParser.parse(JSON.parse(json));
}

export function parseJsonAndExpectOnlyLanes(json: string, numberOfExpectedLanes: number): BpmnModel {
  const model = parseJson(json);
  expectLanes(model, numberOfExpectedLanes);
  // TODO we should expect no pool here
  expectNoEdges(model);
  expectNoFlowNodes(model);
  return model;
}

export function parseJsonAndExpectOnlyPoolsAndLanes(json: string, numberOfExpectedPools: number, numberOfExpectedLanes: number): BpmnModel {
  const model = parseJson(json);
  expectLanes(model, numberOfExpectedLanes);
  expectPools(model, numberOfExpectedPools);
  expectNoEdges(model);
  expectNoFlowNodes(model);
  return model;
}

export function parseJsonAndExpectOnlyPools(json: string, numberOfExpectedPools: number): BpmnModel {
  const model = parseJson(json);
  expectPools(model, numberOfExpectedPools);
  expectNoEdges(model);
  expectNoFlowNodes(model);
  expectNoLanes(model);
  return model;
}

export function parseJsonAndExpectOnlyPoolsAndFlowNodes(json: string, numberOfExpectedPools: number, numberOfExpectedFlowNodes: number): BpmnModel {
  const model = parseJson(json);
  expectFlowNodes(model, numberOfExpectedFlowNodes);
  expectPools(model, numberOfExpectedPools);
  expectNoEdges(model);
  expectNoFlowNodes(model);
  expectNoLanes(model);
  return model;
}

export function parseJsonAndExpectOnlyFlowNodes(json: string, numberOfExpectedFlowNodes: number): BpmnModel {
  const model = parseJson(json);
  expectFlowNodes(model, numberOfExpectedFlowNodes);
  // TODO we should expect no pool here
  expectNoEdges(model);
  expectNoLanes(model);
  return model;
}

export function parseJsonAndExpectOnlyEdges(json: string, numberOfExpectedEdges: number): BpmnModel {
  const model = parseJson(json);
  expectEdges(model, numberOfExpectedEdges);
  // TODO we should expect no pool here
  expectNoFlowNodes(model);
  expectNoLanes(model);
  return model;
}

export function verifyShape(shape: Shape, expectedValue: ExpectedShape): void {
  expect(shape.id).to.be.equal(expectedValue.shapeId, 'shape id');

  const bpmnElement = shape.bpmnElement;
  expect(bpmnElement.id).to.be.equal(expectedValue.bpmnElementId, 'bpmn element id');
  expect(bpmnElement.name).to.be.equal(expectedValue.bpmnElementName, 'bpmn element name');
  expect(bpmnElement.kind).to.be.equal(expectedValue.bpmnElementKind, 'bpmn element kind');
  expect(bpmnElement.parentId).to.be.equal(expectedValue.parentId, 'bpmn element parentId');

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
