import Shape from '../../../model/bpmn/shape/Shape';
import ShapeBpmnElement from '../../../model/bpmn/shape/ShapeBpmnElement';
import { JsonObject, JsonProperty } from 'json2typescript';
import ShapeModelConverter from './converter/ShapeModelConverter';
import { ShapeConverter } from './converter/ShapeConverter';

@JsonObject('definitions')
export class Definitions {
  @JsonProperty('process', ShapeModelConverter)
  private readonly _shapeBpmnElements: ShapeBpmnElement[];

  @JsonProperty('BPMNDiagram', ShapeConverter)
  private readonly _shapes: Shape[];

  constructor(shapeBpmnElements?: ShapeBpmnElement[], shapes?: Shape[]) {
    this._shapeBpmnElements = shapeBpmnElements;
    this._shapes = shapes;
  }

  public get shapes(): Shape[] {
    return this._shapes;
  }
}
