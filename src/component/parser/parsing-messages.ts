/*
Copyright 2021 Bonitasoft S.A.

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

import type { ParserOptions } from '../options';

export interface MessageDetails {
  template: string;
  arguments: string[];
}

export abstract class JsonParsingWarning {
  abstract getMessage(): MessageDetails;
}

export type ParsingMessageCollectorOptions = Pick<ParserOptions, 'disableConsoleLog'>;

export class ParsingMessageCollector {
  constructor(private options?: ParsingMessageCollectorOptions) {}

  warning(warning: JsonParsingWarning): void {
    if (this.options?.disableConsoleLog) {
      return;
    }
    const message = warning.getMessage();
    console.warn(`[bv-parser] ${message.template}`, ...message.arguments);
  }
}
