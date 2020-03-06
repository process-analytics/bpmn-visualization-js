/*
import { JsonConverter, JsonCustomConvert, JsonObject, JsonProperty } from 'json2typescript';
import SequenceFlow from "./SequenceFlow";
import {EdgeBpmnElementConverter} from "../../../component/parser/json/converter/EdgeModelConverter";

/!*@JsonConverter
export class EdgeBpmnElementConverter implements JsonCustomConvert<SequenceFlow> {
  deserialize(data: any): SequenceFlow {
    if (data !== undefined && data !== null && data !== '') {
      return findEdgeBpmnElement(data);
    }
  }

  serialize(data: SequenceFlow): any {
    console.log('Not implemented !!');
  }
}*!/

@JsonObject('BPMNEdge')
export default class Edge {

  @JsonProperty('id', String)
  private _id: string;

  @JsonProperty('bpmnElement', EdgeBpmnElementConverter)
  private readonly _bpmnElement: SequenceFlow;

  constructor(id?: string, bpmnElement?: SequenceFlow) {
    this._id = id;
    this._bpmnElement = bpmnElement;
  }

  getId(): string {
    return this._id;
  }

  get bpmnElement(): SequenceFlow {
    return this._bpmnElement;
  }
}
*/
