import { ShapeBpmnElementKind } from './ShapeBpmnElementKind';

export default class ShapeBpmnElement {
  constructor(readonly id: string, readonly name: string, readonly kind: ShapeBpmnElementKind, public parentId?: string) {}
}

export class Participant {
  // TODO check which arg must be public
  constructor(readonly id: string, public readonly name?: string, public processRef?: string) {}
}
