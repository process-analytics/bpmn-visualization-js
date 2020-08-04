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
import BpmnModel from '../../../model/bpmn/BpmnModel';
import { BpmnJsonModel, TDefinitions } from '../xml/bpmn-json-model/BPMN20';
import CollaborationConverter from './converter/CollaborationConverter';
import ProcessConverter from './converter/ProcessConverter';
import DiagramConverter from './converter/DiagramConverter';

export default class BpmnJsonParser {
  constructor(readonly collaborationConverter: CollaborationConverter, readonly processConverter: ProcessConverter, readonly diagramConverter: DiagramConverter) {}

  public parse(json: BpmnJsonModel): BpmnModel {
    const definitions: TDefinitions = json.definitions;

    this.collaborationConverter.deserialize(definitions.collaboration);
    this.processConverter.deserialize(definitions.process);
    return this.diagramConverter.deserialize(definitions.BPMNDiagram);
  }
}

export function defaultBpmnJsonParser(): BpmnJsonParser {
  // TODO replace the function by dependency injection, see #110
  return new BpmnJsonParser(new CollaborationConverter(), new ProcessConverter(), new DiagramConverter());
}
