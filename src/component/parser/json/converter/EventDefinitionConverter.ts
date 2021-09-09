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

import { TDefinitions } from '../../../../model/bpmn/json/BPMN20';
import { bpmnEventKinds } from '../../../../model/bpmn/internal/shape';
import { TEventDefinition } from '../../../../model/bpmn/json/baseElement/rootElement/eventDefinition';
import { ConvertedElements } from './utils';
import { ensureIsArray } from '../../../helpers/array-utils';

/**
 * @internal
 */
export default class EventDefinitionConverter {
  constructor(private convertedElements: ConvertedElements) {}

  deserialize(definitions: TDefinitions): void {
    bpmnEventKinds.forEach(eventKind => {
      // sometimes eventDefinition is simple and therefore it is parsed as empty string "", in that case eventDefinition will be converted to an empty object
      const eventDefinitions: string | TEventDefinition | (string | TEventDefinition)[] = definitions[eventKind + 'EventDefinition'];
      ensureIsArray<TEventDefinition>(eventDefinitions, true).forEach(eventDefinition =>
        this.convertedElements.registerEventDefinitionsOfDefinition(eventDefinition.id, eventKind),
      );
    });
  }
}
