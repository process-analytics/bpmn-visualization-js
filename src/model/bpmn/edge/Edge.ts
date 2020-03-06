import { JsonObject, JsonProperty } from 'json2typescript';
import SequenceFlow from './SequenceFlow';
import { SequenceFlowConverter } from '../../../component/parser/json/converter/EdgeModelConverter';

@JsonObject('BPMNEdge')
export default class Edge {
  @JsonProperty('id', String)
  private readonly _id: string;

  @JsonProperty('bpmnElement', SequenceFlowConverter)
  private readonly _bpmnElement: SequenceFlow;

  constructor(id?: string, bpmnElement?: SequenceFlow) {
    this._id = id;
    this._bpmnElement = bpmnElement;
  }

  get id(): string {
    return this._id;
  }

  get bpmnElement(): SequenceFlow {
    return this._bpmnElement;
  }
}
