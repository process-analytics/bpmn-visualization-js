import { JsonObject, JsonProperty } from 'json2typescript';
import ShapeBpmnElement from './ShapeBpmnElement';
import { ShapeBpmnElementConverter } from '../../../component/parser/json/converter/ShapeModelConverter';
import Bounds from '../Bounds';

@JsonObject('BPMNShape')
export default class Shape {
  @JsonProperty('id', String)
  private readonly _id: string;

  @JsonProperty('bpmnElement', ShapeBpmnElementConverter)
  private readonly _bpmnElement: ShapeBpmnElement;

  @JsonProperty('Bounds', Bounds)
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
