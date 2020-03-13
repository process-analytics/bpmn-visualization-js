import { expect } from 'chai';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyProperties(object: any, propertiesToHave: string[], propertiesNotToHave: string[]): void {
  expect(object).to.be.a('object');
  propertiesToHave.map(property => expect(object).to.have.property(property)); // TODO msg on failure
  propertiesNotToHave.map(property => expect(object).not.to.have.property(property)); // TODO msg on failure
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyIsNotEmptyArray(object: any, message: string): void {
  expect(object).to.be.a('array');
  expect(object).to.have.length.greaterThan(1, message);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyBounds(shape: any, x: number, y: number, width: number, height: number): void {
  const bounds = shape.Bounds;
  expect(bounds.x).eq(x);
  expect(bounds.y).eq(y);
  expect(bounds.width).eq(width);
  expect(bounds.height).eq(height);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyDefinitions(json: any): void {
  verifyProperties(json, ['definitions'], []);
  verifyProperties(json.definitions, ['process', 'BPMNDiagram'], []);
}
