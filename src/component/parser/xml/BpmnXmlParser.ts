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

import type { BpmnJsonModel } from '../../../model/bpmn/json/bpmn20';
import type { ParserOptions } from '../../options';

import { XMLParser, type X2jOptions } from 'fast-xml-parser';

type Replacement = {
  regex: RegExp;
  val: string;
};
const entitiesReplacements: Replacement[] = [
  { regex: /&(amp|#38|#x26);/g, val: '&' },
  { regex: /&(apos|#39|#x27);/g, val: "'" },
  { regex: /&#(xa|xA|10);/g, val: '\n' },
  { regex: /&(gt|#62|#x3e|#x3E);/g, val: '>' },
  { regex: /&(lt|#60|#x3c|#x3C);/g, val: '<' },
  { regex: /&(quot|#34|#x22);/g, val: '"' },
];

const nodesWithNumericAttributes = new Set(
  ['BPMNShape.Bounds', 'BPMNShape.BPMNLabel.Bounds', 'BPMNEdge.BPMNLabel.Bounds', 'BPMNEdge.waypoint'].map(element => `definitions.BPMNDiagram.BPMNPlane.${element}`),
);
const numericAttributes = new Set(['x', 'y', 'width', 'height']);

const isNumeric = (attributeName: string, nodePath: string): boolean => {
  return nodesWithNumericAttributes.has(nodePath) && numericAttributes.has(attributeName);
};

/**
 * @internal
 */
export type XmlParserOptions = Pick<ParserOptions, 'additionalXmlAttributeProcessor'>;

/**
 * Parse bpmn xml source
 * @internal
 */
export default class BpmnXmlParser {
  private readonly x2jOptions: Partial<X2jOptions> = {
    attributeNamePrefix: '', // default to '@_'
    removeNSPrefix: true,
    ignoreAttributes: false,

    /**
     * Ensure numbers and booleans are parsed with their related type and not as string.
     * See https://github.com/NaturalIntelligence/fast-xml-parser/blob/v4.3.4/docs/v4/2.XMLparseOptions.md#parseattributevalue
     */
    parseAttributeValue: true,

    /**
     * Entities management. The recommendation is: "If you don't have entities in your XML document then it is recommended to disable it for better performance."
     * See https://github.com/NaturalIntelligence/fast-xml-parser/blob/v4.3.4/docs/v4/2.XMLparseOptions.md#processentities
     */
    processEntities: false,

    // See https://github.com/NaturalIntelligence/fast-xml-parser/blob/v4.3.4/docs/v4/2.XMLparseOptions.md#attributevalueprocessor
    attributeValueProcessor: (name: string, value: string, nodePath: string): unknown => {
      if (isNumeric(name, nodePath)) {
        // The strnum lib used by fast-xml-parser is not able to parse all numbers
        // The only available options are https://github.com/NaturalIntelligence/fast-xml-parser/blob/v4.3.4/docs/v4/2.XMLparseOptions.md#numberparseoptions
        // This is a fix for https://github.com/process-analytics/bpmn-visualization-js/issues/2857
        return Number(value);
      }

      return this.processAttribute(value);
    },
  };
  private xmlParser: XMLParser = new XMLParser(this.x2jOptions);

  constructor(private options?: XmlParserOptions) {}

  parse(xml: string): BpmnJsonModel {
    let model: BpmnJsonModel;
    try {
      model = this.xmlParser.parse(xml);
    } catch {
      throw new Error('XML parsing failed. Invalid BPMN source.');
    }
    if (!model.definitions) {
      // We currently don't validate the xml, so we don't detect xml validation error
      // if 'definitions' is undefined, there is an Error later in the parsing code without explicit information
      // So for now, throw a generic error that better explains the problem.
      // See https://github.com/process-analytics/bpmn-visualization-js/issues/21 for improvement
      throw new Error(`XML parsing failed. Unable to retrieve 'definitions' from the BPMN source.`);
    }
    return model;
  }

  private processAttribute(value: string): string {
    for (const replacement of entitiesReplacements) {
      value = value.replace(replacement.regex, replacement.val);
    }
    if (this.options?.additionalXmlAttributeProcessor) {
      value = this.options.additionalXmlAttributeProcessor(value);
    }
    return value;
  }
}
