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

import { parse, type X2jOptions } from 'fast-xml-parser/src/parser';
import { decodeXML } from 'entities/lib/decode';
import { BpmnJsonModel } from '../../../model/bpmn/json/BPMN20';

/**
 * Parse bpmn xml source
 * @internal
 */
export default class BpmnXmlParser {
  private options: Partial<X2jOptions> = {
    attributeNamePrefix: '', // default to '@_'
    ignoreNameSpace: true,
    ignoreAttributes: false,
    parseAttributeValue: true, // ensure numbers are parsed as number, not as string
    attrValueProcessor: (val: string) => {
      return decodeXML(val);
    },
  };

  parse(xml: string): BpmnJsonModel {
    const model = parse(xml, this.options);
    if (!model.definitions) {
      // We currently don't validate the xml, so we don't detect xml validation error
      // if 'definitions' is undefined, there is an Error later in the parsing code without explicit information
      // So for now, throw a generic error that better explains the problem.
      // See https://github.com/process-analytics/bpmn-visualization-js/issues/21 for improvement
      throw new Error(`XML parsing failed. Unable to retrieve 'definitions' for the BPMN source.`);
    }
    return model;
  }
}
