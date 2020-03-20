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
import ShapeBpmnElement from '../../../model/bpmn/shape/ShapeBpmnElement';
import { JsonObject, JsonProperty } from 'json2typescript';
import SequenceFlow from '../../../model/bpmn/edge/SequenceFlow';
import BpmnModel from '../../../model/bpmn/BpmnModel';
import DiagramConverter from './converter/DiagramConverter';
import ProcessConverter from './converter/ProcessConverter';
import CollaborationConverter from './converter/CollaborationConverter';

@JsonObject('definitions')
export class Definitions {
  @JsonProperty('collaboration', CollaborationConverter, true)
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
