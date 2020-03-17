import ShapeBpmnElement from '../../../model/bpmn/shape/ShapeBpmnElement';
import { JsonObject, JsonProperty } from 'json2typescript';
import SequenceFlow from '../../../model/bpmn/edge/SequenceFlow';
import BpmnModel from '../../../model/bpmn/BpmnModel';
import DiagramConverter from './converter/DiagramConverter';
import SemanticConverter from './converter/SemanticConverter';

@JsonObject('definitions')
export class Definitions {
  @JsonProperty('process', SemanticConverter)
  private readonly _semantic: Semantic;

  @JsonProperty('BPMNDiagram', DiagramConverter)
  private readonly _bpmnModel: BpmnModel;

  // Need to have _semantic before _bpmnModel, because we reference _semantic in _bpmnModel.
  constructor(semantic?: Semantic, bpmnModel?: BpmnModel) {
    this._semantic = semantic;
    this._bpmnModel = bpmnModel;
  }

  public get bpmnModel(): BpmnModel {
    return this._bpmnModel;
  }
}

export interface Semantic {
  shapeBpmnElements: ShapeBpmnElement[];
  sequenceFlows: SequenceFlow[];
}
