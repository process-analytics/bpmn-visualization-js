import ShapeBpmnElement from './ShapeBpmnElement';
import Bounds from '../Bounds';

export default class Shape {
  private readonly _id: string;

  private readonly _bpmnElement: ShapeBpmnElement;

  private readonly _bounds: Bounds;

  constructor(id?: string, bpmnElement?: ShapeBpmnElement, bounds?: Bounds) {
    this._id = id;
    this._bpmnElement = bpmnElement;
    this._bounds = bounds;
  }

  get id(): string {
    return this._id;
  }

  get bpmnElement(): ShapeBpmnElement {
    return this._bpmnElement;
  }

  get bounds(): Bounds {
    return this._bounds;
  }
}
