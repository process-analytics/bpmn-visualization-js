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
import { Participant } from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { MessageFlow } from '../../../../model/bpmn/internal/edge/Flow';

function convertEmptyStringAndObject<T>(element: string | T, acceptEmptyString: boolean): T {
  if (element === '') {
    return acceptEmptyString ? ({} as T) : undefined;
  }
  return element as T;
}

export function ensureIsArray<T>(elements: (T | string)[] | T | string, acceptEmptyString = false): Array<T> {
  if (elements === undefined || elements === null) {
    return [];
  }

  let returnedArray;
  if (!Array.isArray(elements)) {
    returnedArray = [convertEmptyStringAndObject(elements, acceptEmptyString)];
  } else {
    returnedArray = elements.map(element => convertEmptyStringAndObject(element, acceptEmptyString));
  }
  return returnedArray.filter(value => value);
}

export class ConvertedElements {
  private convertedParticipantsById: Map<string, Participant> = new Map();
  private convertedParticipantsByProcessRef: Map<string, Participant> = new Map();
  private convertedMessageFlows: Map<string, MessageFlow> = new Map();

  findProcessRefParticipant(id: string): Participant {
    return this.convertedParticipantsById.get(id);
  }

  findProcessRefParticipantByProcessRef(processRef: string): Participant {
    return this.convertedParticipantsByProcessRef.get(processRef);
  }

  findMessageFlow(id: string): MessageFlow {
    return this.convertedMessageFlows.get(id);
  }
}
