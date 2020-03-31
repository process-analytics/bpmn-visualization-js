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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyProperties(object: any, propertiesToHave: string[], propertiesNotToHave: string[]): void {
  expect(typeof object === 'object').toBeTruthy();
  propertiesToHave.map(property => expect(object).toHaveProperty(property)); // TODO msg on failure
  propertiesNotToHave.map(property => expect(object).not.toHaveProperty(property)); // TODO msg on failure
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyPropertiesValues(object: any, properties: Map<string, string>): void {
  expect(typeof object === 'object').toBeTruthy();
  properties.forEach((value: string, key: string) => expect(object).toHaveProperty(key, value)); // TODO msg on failure
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyIsNotEmptyArray(object: any): void {
  expect(Array.isArray(object)).toBeTruthy();
  expect(object.length).toBeGreaterThan(1);
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
