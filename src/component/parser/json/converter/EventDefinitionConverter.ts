/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { ConvertedElements } from './utils';
import type { TEventDefinition, TLinkEventDefinition } from '../../../../model/bpmn/json/baseElement/rootElement/eventDefinition';
import type { TDefinitions } from '../../../../model/bpmn/json/bpmn20';

import { eventDefinitionKinds } from '../../../../model/bpmn/internal/shape/utils';
import { isTLinkEventDefinition } from '../../../../model/bpmn/json/baseElement/rootElement/eventDefinition';
import { ensureIsArray } from '../../../helpers/array-utils';

type EventDefinitions = string | TEventDefinition | (string | TEventDefinition)[];

/**
 * @internal
 */
export default class EventDefinitionConverter {
  constructor(private readonly convertedElements: ConvertedElements) {}

  deserialize(definitions: TDefinitions): void {
    for (const eventDefinitionKind of eventDefinitionKinds) {
      // sometimes eventDefinition is simple, and therefore it is parsed as empty string "", in that case eventDefinition will be converted to an empty object
      const eventDefinitions = definitions[(eventDefinitionKind + 'EventDefinition') as keyof TDefinitions] as EventDefinitions;
      for (const eventDefinition of ensureIsArray<TEventDefinition>(eventDefinitions, true)) {
        this.convertedElements.registerEventDefinitionsOfDefinition(eventDefinition.id, {
          id: eventDefinition.id,
          kind: eventDefinitionKind,

          ...(isTLinkEventDefinition(eventDefinition)
            ? ({
                source: eventDefinition.source,
                target: eventDefinition.target,
              } satisfies Pick<TLinkEventDefinition, 'source' | 'target'>)
            : {}),
        });
      }
    }
  }
}
