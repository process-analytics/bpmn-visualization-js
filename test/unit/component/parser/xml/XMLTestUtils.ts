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
import any = jasmine.any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyProperties(object: any, propertiesToHave: string[], propertiesNotToHave: string[] = []): void {
  expect(typeof object === 'object').toBeTruthy();
  propertiesToHave.map(property => expect(object).toHaveProperty(property)); // TODO msg on failure
  propertiesNotToHave.map(property => expect(object).not.toHaveProperty(property)); // TODO msg on failure
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyPropertiesValues(object: any, properties: Map<string, string | string[]>): void {
  expect(typeof object === 'object').toBeTruthy();
  properties.forEach((value: string, key: string) => expect(object).toHaveProperty(key, value)); // TODO msg on failure
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyIsNotEmptyArray(object: any, length = 2): void {
  expect(Array.isArray(object)).toBeTruthy();
  expect(object.length).toBeGreaterThanOrEqual(length);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyIsNotArray(object: any): void {
  expect(Array.isArray(object)).toBeFalsy();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyBounds(shape: any, x: number, y: number, width: number, height: number): void {
  const bounds = shape.Bounds;
  expect(bounds.x).toEqual(x);
  expect(bounds.y).toEqual(y);
  expect(bounds.width).toEqual(width);
  expect(bounds.height).toEqual(height);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyDefinitions(json: any): void {
  verifyProperties(json, ['definitions'], []);
  verifyProperties(json.definitions, ['process', 'BPMNDiagram'], []);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyDefinitionsWithCollaboration(json: any): void {
  verifyProperties(json, ['definitions'], []);
  verifyProperties(json.definitions, ['collaboration', 'process', 'BPMNDiagram'], []);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyAndGetBPMNShape(json: any): Array<any> {
  const diagram = json.definitions.BPMNDiagram;
  verifyProperties(diagram, ['BPMNPlane'], []);
  const plane = diagram.BPMNPlane;
  verifyProperties(plane, ['BPMNShape'], []);
  const shapes = plane.BPMNShape;
  verifyIsNotEmptyArray(shapes);
  return shapes;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyShapes(json: any, expected: number, withLabel = true) {
  const diagram = json.definitions.BPMNDiagram;
  verifyIsNotEmptyArray(diagram.BPMNPlane.BPMNShape, expected);

  const shape = diagram.BPMNPlane.BPMNShape[0];
  if (withLabel) {
    verifyProperties(shape, ['id', 'bpmnElement', 'Bounds', 'BPMNLabel']);

    verifyProperties(shape.BPMNLabel, ['id', 'labelStyle', 'Bounds']);
    verifyProperties(shape.BPMNLabel.Bounds, ['height', 'width', 'x', 'y']);
  } else {
    verifyProperties(shape, ['id', 'bpmnElement', 'Bounds']);
  }
  verifyProperties(shape.Bounds, ['height', 'width', 'x', 'y']);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyPlane(json: any) {
  const diagram = json.definitions.BPMNDiagram;
  verifyProperties(diagram.BPMNPlane, ['bpmnElement', 'BPMNShape', 'BPMNEdge']);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyDiagram(json: any, withStyle = true): any {
  const diagram = json.definitions.BPMNDiagram;
  if (withStyle) {
    verifyProperties(diagram, ['id', 'name', 'BPMNPlane', 'BPMNLabelStyle']);
  } else {
    verifyProperties(diagram, ['id', 'name', 'BPMNPlane']);
  }
  return diagram;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyEdges(json: any, expected: number, edgeIndexToVerify: number, withStyle = true): void {
  const diagram = json.definitions.BPMNDiagram;
  verifyIsNotEmptyArray(diagram.BPMNPlane.BPMNEdge, expected);

  const edge = diagram.BPMNPlane.BPMNEdge[edgeIndexToVerify];
  verifyProperties(edge, ['id', 'bpmnElement', 'waypoint', 'BPMNLabel']);
  verifyIsNotEmptyArray(edge.waypoint, 3);
  if (withStyle) {
    verifyProperties(edge.BPMNLabel, ['labelStyle', 'Bounds']);
  } else {
    verifyProperties(edge.BPMNLabel, ['Bounds']);
  }
  verifyProperties(edge.BPMNLabel.Bounds, ['height', 'width', 'x', 'y']);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyStyle(json: any, expected: number) {
  const diagram = json.definitions.BPMNDiagram;
  verifyIsNotEmptyArray(diagram.BPMNLabelStyle, expected);
  const style = diagram.BPMNLabelStyle[0];
  verifyProperties(style, ['Font']);
  expect(style.Font.name).toEqual('Segoe UI');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyIoSpecification(json: any, expectedInputSetId: string, expectedOutputSetId: string) {
  const process = json.definitions.process;
  verifyProperties(process.ioSpecification, ['id', 'inputSet', 'outputSet']);
  expect(process.ioSpecification.inputSet.id).toEqual(expectedInputSetId);
  expect(process.ioSpecification.outputSet.id).toEqual(expectedOutputSetId);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifySequenceFlow(json: any, expected: number) {
  const process = json.definitions.process;
  verifyIsNotEmptyArray(process.sequenceFlow, expected);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyExclusiveGateway(json: any, expected: number) {
  const process = json.definitions.process;
  verifyIsNotEmptyArray(process.exclusiveGateway, expected);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyStartEvent(json: any, expectedOutgoing: string, verifyEventExtensions: (extensionElements: any) => void): void {
  const startEvent = json.definitions.process.startEvent;
  verifyProperties(startEvent, ['id', 'name', 'extensionElements', 'outgoing'], ['incoming']);
  expect(startEvent.outgoing).toEqual(expectedOutgoing);
  verifyEventExtensions(startEvent.extensionElements);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyEndEvent(json: any, expectedIncomings: string[], verifyEventExtensions: (extensionElements: any) => void): void {
  const endEvent = json.definitions.process.endEvent;
  verifyProperties(endEvent, ['id', 'name', 'extensionElements', 'incoming'], ['outgoing']);

  expectedIncomings.forEach((expectedIncoming, index) => expect(endEvent.incoming[index]).toEqual(expectedIncoming));

  verifyEventExtensions(endEvent.extensionElements);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyTask(json: any, expected: number) {
  const process = json.definitions.process;
  verifyIsNotEmptyArray(process.task, expected);
}
