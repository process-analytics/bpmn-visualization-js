import { JsonObject, JsonProperty } from 'json2typescript';
import SequenceFlow from './SequenceFlow';
import { SequenceFlowConverter, WaypointConverter } from '../../../component/parser/json/converter/SemanticConverter';
import Waypoint from './Waypoint';

@JsonObject('BPMNEdge')
export default class Edge {
  @JsonProperty('id', String)
  private readonly _id: string;

  @JsonProperty('bpmnElement', SequenceFlowConverter)
  private readonly _bpmnElement: SequenceFlow;

  @JsonProperty('waypoint', WaypointConverter, true)
  private readonly _waypoints: Waypoint[];

  constructor(id?: string, bpmnElement?: SequenceFlow, waypoints?: Waypoint[]) {
    this._id = id;
    this._bpmnElement = bpmnElement;
    this._waypoints = waypoints;
  }

  public get id(): string {
    return this._id;
  }

  public get bpmnElement(): SequenceFlow {
    return this._bpmnElement;
  }

  public get waypoints(): Waypoint[] {
    return this._waypoints;
  }
}
