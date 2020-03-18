import { ShapeBpmnElementKind } from './ShapeBpmnElementKind';

export default class ShapeBpmnElement {
  constructor(readonly id: string, readonly name: string, readonly kind: ShapeBpmnElementKind, public parentId?: string) {}
}

export class Participant {
  constructor(readonly id: string, readonly name?: string, public processRef?: string) {}
}
