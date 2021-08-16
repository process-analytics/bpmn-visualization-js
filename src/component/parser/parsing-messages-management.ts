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

export interface MessageDetails {
  template: string;
  arguments: Array<string>;
}

export abstract class ParsingWarning {
  abstract getMessage(): MessageDetails;
}

// TODO explain why we have this (class hierarchy + identification)
export abstract class JsonParsingWarning extends ParsingWarning {}

export class ParsingMessageCollector {
  warning(warning: ParsingWarning): void {
    const message = warning.getMessage();
    // TODO decide how to manage elements not found during parsing as part of #35
    console.warn(message.template, ...message.arguments);
  }
}
