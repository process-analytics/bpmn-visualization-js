import { parse } from 'fast-xml-parser/src/parser';

/**
 * Parse bpmn xml source
 */
export default class BpmnXmlParser {
  private options = {
    attributeNamePrefix: '', // default to '@_'
    ignoreNameSpace: true,
    ignoreAttributes: false,
    parseAttributeValue: true, // ensure numbers are parsed as number, not as string
  };

  // disable eslint as it comes from 3rd party
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public parse(xml: string): any {
    return parse(xml, this.options);
  }
}
