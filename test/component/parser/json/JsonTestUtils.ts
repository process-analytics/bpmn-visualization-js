import { expect } from 'chai';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import Shape from '../../../../src/model/bpmn/shape/Shape';
import BpmnJsonParser from '../../../../src/component/parser/json/BpmnJsonParser';

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

export function parseJson(json: string): any {
  return BpmnJsonParser.parse(JSON.parse(json));
}

export function parseJsonAndExpectOnlyLanes(json: string): any {
  const model = BpmnJsonParser.parse(JSON.parse(json));
  expect(model.edges).to.have.lengthOf(0, 'edges');
  expect(model.flowNodes).to.have.lengthOf(0, 'flowNodes');
  return model;
}

export function parseJsonAndExpectOnlyFlowNodes(json: string): any {
  const model = BpmnJsonParser.parse(JSON.parse(json));
  expect(model.edges).to.have.lengthOf(0, 'edges');
  expect(model.lanes).to.have.lengthOf(0, 'lanes');
  return model;
}

export function parseJsonAndExpectOnlyEdgesAndFlowNodes(json: string): any {
  const model = BpmnJsonParser.parse(JSON.parse(json));
  expect(model.lanes).to.have.lengthOf(0, 'lanes');
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
