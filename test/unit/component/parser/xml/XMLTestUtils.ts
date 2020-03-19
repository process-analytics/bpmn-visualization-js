// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyProperties(object: any, propertiesToHave: string[], propertiesNotToHave: string[]): void {
  expect(typeof object === 'object').toBeTruthy();
  propertiesToHave.map(property => expect(object).toHaveProperty(property)); // TODO msg on failure
  propertiesNotToHave.map(property => expect(object).not.toHaveProperty(property)); // TODO msg on failure
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyIsNotEmptyArray(object: any): void {
  expect(Array.isArray(object)).toBeTruthy();
  expect(object.length).toBeGreaterThan(1);
}

// TODO remove the message argt (useless after jest introduction)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyIsNotArray(object: any, message?: string): void {
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
export function verifyAndGetBPMNShape(json: any): any | Array<any> {
  const diagram = json.definitions.BPMNDiagram;
  verifyProperties(diagram, ['BPMNPlane'], []);
  const plane = diagram.BPMNPlane;
  verifyProperties(plane, ['BPMNShape'], []);
  const shapes = plane.BPMNShape;
  verifyIsNotEmptyArray(shapes);
  return shapes;
}
