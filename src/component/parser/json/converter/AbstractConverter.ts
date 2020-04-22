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
import { JsonConverter, JsonCustomConvert } from 'json2typescript';
import JsonConvertConfig from './JsonConvertConfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ensureIsArray(elements: Array<any> | any, acceptEmptyString = false): Array<any> {
  if (elements === undefined || elements === null || (!acceptEmptyString && elements === '')) {
    elements = [];
  } else if (elements === '' && acceptEmptyString) {
    return [{}];
  } else if (!Array.isArray(elements)) {
    elements = [elements];
  }
  return elements;
}

@JsonConverter
export abstract class AbstractConverter<T> implements JsonCustomConvert<T> {
  // TODO find a way to inject JsonConvert, see #110
  protected readonly jsonConvert = JsonConvertConfig.jsonConvert();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
  serialize(data: T): any {
    // TODO throw exception
    console.error('Not implemented !!');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract deserialize(data: any): T;
}
