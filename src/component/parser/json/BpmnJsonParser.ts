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
import { Definitions } from './Definitions';
import BpmnModel from '../../../model/bpmn/BpmnModel';
import JsonConvertConfig from './converter/JsonConvertConfig';

export default class BpmnJsonParser {
  // TODO JsonConvert should be injected, see #110
  private readonly jsonConvert = JsonConvertConfig.jsonConvert();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public parse(json: any): BpmnModel {
    const definitions = this.jsonConvert.deserializeObject(json.definitions, Definitions);
    return definitions.bpmnModel;
  }
}
