import { JsonObject, JsonProperty } from 'json2typescript';
import ShapeBpmnElement from './ShapeBpmnElement';
import { ShapeBpmnElementConverter } from '../../../component/parser/json/converter/ShapeModelConverter';

@JsonObject('BPMNShape')
export default class Shape {
  @JsonProperty('id', String)
  private readonly _id: string;

  @JsonProperty('bpmnElement', ShapeBpmnElementConverter)
  private readonly _bpmnElement: ShapeBpmnElement;

  constructor(id?: string, bpmnElement?: ShapeBpmnElement) {
    this._id = id;
    this._bpmnElement = bpmnElement;
  }

  get id(): string {
    return this._id;
  }

  get bpmnElement(): ShapeBpmnElement {
    return this._bpmnElement;
  }
}
