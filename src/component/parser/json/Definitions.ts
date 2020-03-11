import Shape from '../../../model/bpmn/shape/Shape';
import ShapeBpmnElement from '../../../model/bpmn/shape/ShapeBpmnElement';
import { JsonObject, JsonProperty } from 'json2typescript';
import ShapeModelConverter from './converter/ShapeModelConverter';
import { LaneConverter, ShapeConverter } from './converter/ShapeConverter';
import Edge from '../../../model/bpmn/edge/Edge';
import SequenceFlow from '../../../model/bpmn/edge/SequenceFlow';
import EdgeModelConverter from './converter/EdgeModelConverter';
import EdgeConverter from './converter/EdgeConverter';

@JsonObject('definitions')
export class Definitions {
  @JsonProperty('process', ShapeModelConverter)
  private readonly _shapeBpmnElements: ShapeBpmnElement[];

  @JsonProperty('BPMNDiagram', ShapeConverter)
  private readonly _shapes: Shape[];

  @JsonProperty('process', EdgeModelConverter)
  private readonly _sequenceFlows: SequenceFlow[];

  @JsonProperty('BPMNDiagram', EdgeConverter)
  private readonly _edges: Edge[];

  @JsonProperty('BPMNDiagram', LaneConverter)
  private readonly _lanes: Shape[];

  constructor(shapeBpmnElements?: ShapeBpmnElement[], shapes?: Shape[], lanes?: Shape[], sequenceFlows?: SequenceFlow[], edges?: Edge[]) {
    this._shapeBpmnElements = shapeBpmnElements;
    this._shapes = shapes;
    this._lanes = lanes;
    this._sequenceFlows = sequenceFlows;
    this._edges = edges;
  }

  public get shapes(): Shape[] {
    return this._shapes;
  }

  public get edges(): Edge[] {
    return this._edges;
  }

  public get lanes(): Shape[] {
    return this._lanes;
  }
}
