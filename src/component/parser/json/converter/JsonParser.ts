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
import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';

/**
 * Singleton to let you access to the JsonConvert unique instance.
 */
export default class JsonParser {
  private static instance: JsonParser;
  private readonly _jsonConvert: JsonConvert;

  private constructor() {
    this._jsonConvert = new JsonConvert();
    this._jsonConvert.operationMode = OperationMode.ENABLE;
    this._jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
    this._jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
  }

  private static getInstance(): JsonParser {
    if (!JsonParser.instance) {
      JsonParser.instance = new JsonParser();
    }
    return JsonParser.instance;
  }

  public static jsonConvert(): JsonConvert {
    return JsonParser.getInstance()._jsonConvert;
  }
}
