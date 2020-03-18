import ShapeBpmnElement from '../../../model/bpmn/shape/ShapeBpmnElement';
import { JsonObject, JsonProperty } from 'json2typescript';
import SequenceFlow from '../../../model/bpmn/edge/SequenceFlow';
import BpmnModel from '../../../model/bpmn/BpmnModel';
import DiagramConverter from './converter/DiagramConverter';
import ProcessConverter from './converter/ProcessConverter';
import CollaborationConverter from './converter/CollaborationConverter';

@JsonObject('definitions')
export class Definitions {
  @JsonProperty('collaboration', CollaborationConverter)
  private readonly _collaboration: Collaboration;

  @JsonProperty('process', ProcessConverter)
  private readonly _process: Process;

  @JsonProperty('BPMNDiagram', DiagramConverter)
  private readonly _bpmnModel: BpmnModel;

  // bpmnModel must be the last argument as it requires data built by the other converter.
  constructor(collaboration?: Collaboration, process?: Process, bpmnModel?: BpmnModel) {
    this._collaboration = collaboration;
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

// only define a type to fill data used to build the BpmnModel
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Collaboration {}
