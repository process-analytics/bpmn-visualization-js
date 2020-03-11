import Shape from '../../../model/bpmn/shape/Shape';
import ShapeBpmnElement from '../../../model/bpmn/shape/ShapeBpmnElement';
import { JsonObject, JsonProperty } from 'json2typescript';
import ShapeModelConverter from './converter/ShapeModelConverter';
import { LaneConverter, FlowNodeConverter } from './converter/ShapeConverter';
import Edge from '../../../model/bpmn/edge/Edge';
import SequenceFlow from '../../../model/bpmn/edge/SequenceFlow';
import EdgeModelConverter from './converter/EdgeModelConverter';
import EdgeConverter from './converter/EdgeConverter';

@JsonObject('definitions')
export class Definitions {
  @JsonProperty('process', ShapeModelConverter)
  private readonly _shapeBpmnElements: ShapeBpmnElement[];

  @JsonProperty('BPMNDiagram', FlowNodeConverter)
  private readonly _flowNodes: Shape[];

  @JsonProperty('process', EdgeModelConverter)
  private readonly _sequenceFlows: SequenceFlow[];

  @JsonProperty('BPMNDiagram', EdgeConverter)
  private readonly _edges: Edge[];

  @JsonProperty('BPMNDiagram', LaneConverter)
  private readonly _lanes: Shape[];

  // Need to have shapeBpmnElements before flowNodes & lanes, because we reference shapeBpmnElements in them. Idem for edges
  constructor(shapeBpmnElements?: ShapeBpmnElement[], flowNodes?: Shape[], lanes?: Shape[], sequenceFlows?: SequenceFlow[], edges?: Edge[]) {
    this._shapeBpmnElements = shapeBpmnElements;
    this._flowNodes = flowNodes;
    this._lanes = lanes;
    this._sequenceFlows = sequenceFlows;
    this._edges = edges;
  }

  public get flowNodes(): Shape[] {
    return this._flowNodes;
  }

  public get edges(): Edge[] {
    return this._edges;
  }

  public get lanes(): Shape[] {
    return this._lanes;
  }
}
