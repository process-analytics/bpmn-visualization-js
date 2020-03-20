/**
 * Copyright 2020 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { JsonObject, JsonProperty } from 'json2typescript';
import SequenceFlow from './SequenceFlow';
import Waypoint from './Waypoint';
import { SequenceFlowConverter, WaypointConverter } from '../../../component/parser/json/converter/ProcessConverter';

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
