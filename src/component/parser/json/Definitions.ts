import ShapeBpmnElement from '../../../model/bpmn/shape/ShapeBpmnElement';
import { JsonObject, JsonProperty } from 'json2typescript';
import SequenceFlow from '../../../model/bpmn/edge/SequenceFlow';
import BpmnModel from '../../../model/bpmn/BpmnModel';
import DiagramConverter from './converter/DiagramConverter';
import ProcessConverter from './converter/ProcessConverter';

@JsonObject('definitions')
export class Definitions {
  @JsonProperty('process', ProcessConverter)
  private readonly _process: Process;

  @JsonProperty('BPMNDiagram', DiagramConverter)
  private readonly _bpmnModel: BpmnModel;

  // Need to have process before _bpmnModel, because we reference process in _bpmnModel.
  constructor(process?: Process, bpmnModel?: BpmnModel) {
    this._process = process;
    this._bpmnModel = bpmnModel;
  }

  public get bpmnModel(): BpmnModel {
    return this._bpmnModel;
  }
}

export interface Process {
  shapeBpmnElements: ShapeBpmnElement[];
  sequenceFlows: SequenceFlow[];
}
