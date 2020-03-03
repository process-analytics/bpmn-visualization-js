import { ShapeBpmnElementKind } from './ShapeBpmnElementKind';

export default class ShapeBpmnElement {
  constructor(readonly id: string, readonly name: string, readonly kind: ShapeBpmnElementKind) {}
}
