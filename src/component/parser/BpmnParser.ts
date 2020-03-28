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
import BpmnModel from '../../model/bpmn/BpmnModel';
import BpmnXmlParser from './xml/BpmnXmlParser';
import BpmnJsonParser from './json/BpmnJsonParser';

export default class BpmnParser {
  // TODO inner parsers should be injected, see #110
  private readonly jsonParser = new BpmnJsonParser();
  private readonly xmlParser = new BpmnXmlParser();

  parse(bpmnAsXml: string): BpmnModel {
    const json = this.xmlParser.parse(bpmnAsXml);
    return this.jsonParser.parse(json);
  }
}
