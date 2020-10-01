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
import { encodeUriXml, findFiles, linearizeXml } from '../helpers/file-helper';

describe('files lookup', () => {
  it('bpmn non-regression files', () => {
    const files = findFiles('../fixtures/bpmn/non-regression/');
    expect(files).toContain('events.bpmn');
  });
});

describe('linearize xml', () => {
  it('line breaks and spaces', () => {
    const xml = `<root>
    <node1>my value</node1>
</root>
`;
    expect(linearizeXml(xml)).toEqual(`<root><node1>my value</node1></root>`);
  });

  it('line breaks and tabs', () => {
    const xml = '<root>\n\t<node1>my value</node1>\r\n<node2>value2 is high!</node2>\r</root>';
    expect(linearizeXml(xml)).toEqual(`<root><node1>my value</node1><node2>value2 is high!</node2></root>`);
  });

  it('empty node - single extra space at the end', () => {
    const xml = '<root><node1 attribute1="value1" /></root>';
    expect(linearizeXml(xml)).toEqual(`<root><node1 attribute1="value1"/></root>`);
  });

  it('empty node - several extra spaces at the end', () => {
    const xml = '<root><node1 attribute1="value1" attribute2="value2"       /></root>';
    expect(linearizeXml(xml)).toEqual(`<root><node1 attribute1="value1" attribute2="value2"/></root>`);
  });
});

describe('encodeUri Xml', () => {
  it('single node', () => {
    const xml = '<node id="id0" name="Service Task 2"/>';
    expect(encodeUriXml(xml)).toEqual('%3Cnode%20id%3D%22id0%22%20name%3D%22Service%20Task%202%22%2F%3E');
  });
  it('attribute value with double sharp characters', () => {
    const xml = '<semantic:serviceTask id="serviceTask_1" implementation="##WebService" />';
    expect(encodeUriXml(xml)).toEqual('%3Csemantic%3AserviceTask%20id%3D%22serviceTask_1%22%20implementation%3D%22%23%23WebService%22%20%2F%3E');
  });
  it('attribute value with Symbol Entities', () => {
    const xml = '<node id="id1" attribute="From &#39;start event 1&#39; to &#39;task 1&#39;.&#10;After line break" />';
    expect(encodeUriXml(xml)).toEqual(
      '%3Cnode%20id%3D%22id1%22%20attribute%3D%22From%20%26%2339%3Bstart%20event%201%26%2339%3B%20to%20%26%2339%3Btask%201%26%2339%3B.%26%2310%3BAfter%20line%20break%22%20%2F%3E',
    );
  });
});
