import ShapeBpmnElement from '../../../model/bpmn/shape/ShapeBpmnElement';
import { JsonObject, JsonProperty } from 'json2typescript';
import ShapeModelConverter from './converter/ShapeModelConverter';
import SequenceFlow from '../../../model/bpmn/edge/SequenceFlow';
import EdgeModelConverter from './converter/EdgeModelConverter';
import BpmnModel from '../../../model/bpmn/BpmnModel';
import DiagramConverter from './converter/DiagramConverter';

@JsonObject('definitions')
export class Definitions {
  @JsonProperty('process', ShapeModelConverter)
  private readonly _shapeBpmnElements: ShapeBpmnElement[];

  @JsonProperty('process', EdgeModelConverter)
  private readonly _sequenceFlows: SequenceFlow[];

  @JsonProperty('BPMNDiagram', DiagramConverter)
  private readonly _bpmnModel: BpmnModel;

  // Need to have shapeBpmnElements before _bpmnModel, because we reference shapeBpmnElements in them.
  constructor(shapeBpmnElements?: ShapeBpmnElement[], sequenceFlows?: SequenceFlow[], bpmnModel?: BpmnModel) {
    this._shapeBpmnElements = shapeBpmnElements;
    this._sequenceFlows = sequenceFlows;
    this._bpmnModel = bpmnModel;
  }

  public get bpmnModel(): BpmnModel {
    return this._bpmnModel;
  }
}
