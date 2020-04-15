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
export function verifyDiagram(json: any, withStyle = true, withName = true): any {
  const diagram = json.definitions.BPMNDiagram;

  verifyProperties(diagram, ['id', 'BPMNPlane']);

  if (withStyle) {
    verifyProperties(diagram, ['BPMNLabelStyle']);
  }
  if (withName) {
    verifyProperties(diagram, ['name']);
  }
  return diagram;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyEdges(json: any, expected: number, edgeIndexToVerify: number, withStyle = true, withLabel = true): void {
  const diagram = json.definitions.BPMNDiagram;
  verifyIsNotEmptyArray(diagram.BPMNPlane.BPMNEdge, expected);

  const edge = diagram.BPMNPlane.BPMNEdge[edgeIndexToVerify];
  verifyProperties(edge, ['id', 'bpmnElement', 'waypoint']);
  verifyIsNotEmptyArray(edge.waypoint, 3);

  if (withLabel) {
    verifyProperties(edge, ['BPMNLabel']);
    verifyProperties(edge.BPMNLabel, ['Bounds']);
    verifyProperties(edge.BPMNLabel.Bounds, ['height', 'width', 'x', 'y']);
    if (withStyle) {
      verifyProperties(edge.BPMNLabel, ['labelStyle']);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyStyle(json: any, expected: number, firstName: string) {
  const diagram = json.definitions.BPMNDiagram;
  verifyIsNotEmptyArray(diagram.BPMNLabelStyle, expected);
  const style = diagram.BPMNLabelStyle[0];
  verifyProperties(style, ['Font']);
  expect(style.Font.name).toEqual(firstName);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyIoSpecification(process: any, expectedInputSetId: string, expectedOutputSetId: string) {
  verifyProperties(process.ioSpecification, ['id', 'inputSet', 'outputSet']);
  expect(process.ioSpecification.inputSet.id).toEqual(expectedInputSetId);
  expect(process.ioSpecification.outputSet.id).toEqual(expectedOutputSetId);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifySequenceFlow(process: any, expected: number) {
  verifyIsNotEmptyArray(process.sequenceFlow, expected);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyExclusiveGateway(process: any, expected: number) {
  verifyIsNotEmptyArray(process.exclusiveGateway, expected);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyStartEvent(process: any, expectedOutgoing?: string, verifyEventExtensions?: (extensionElements: any) => void): void {
  const startEvent = process.startEvent;
  verifyProperties(startEvent, ['id', 'name'], ['incoming']);

  if (expectedOutgoing) {
    verifyProperties(startEvent, ['outgoing']);
    expect(startEvent.outgoing).toEqual(expectedOutgoing);
  }

  if (verifyEventExtensions) {
    verifyProperties(startEvent, ['extensionElements']);
    verifyEventExtensions(startEvent.extensionElements);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyEndEvent(process: any, expectedIncomings?: string[], verifyEventExtensions?: (extensionElements: any) => void): void {
  const endEvent = process.endEvent;
  verifyProperties(endEvent, ['id', 'name'], ['outgoing']);

  if (expectedIncomings) {
    verifyProperties(endEvent, ['incoming']);
    expectedIncomings.forEach((expectedIncoming, index) => expect(endEvent.incoming[index]).toEqual(expectedIncoming));
  }

  if (verifyEventExtensions) {
    verifyProperties(endEvent, ['extensionElements']);
    verifyEventExtensions(endEvent.extensionElements);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyTask(process: any, expected: number) {
  verifyIsNotEmptyArray(process.task, expected);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyUserTask(process: any, expected: number) {
  verifyIsNotEmptyArray(process.userTask, expected);
}
