/**
 * Copyright 2021 Bonitasoft S.A.
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

export interface Failure<FailureType extends string> {
  type: FailureType;
  reason: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    arguments: any[];
    template: string;
  };
}

export enum UserError {
  InvalidGroupDeserialization = 'InvalidGroupDeserialization',
}

export const invalidGroupDeserializationError = (groupBpmnElementId: string, categoryValueRef: string): Failure<UserError.InvalidGroupDeserialization> => ({
  type: UserError.InvalidGroupDeserialization,
  reason: {
    arguments: [categoryValueRef, groupBpmnElementId],
    template: 'Group json deserialization: unable to find category value ref %s for bpmn element %s',
  },
});
