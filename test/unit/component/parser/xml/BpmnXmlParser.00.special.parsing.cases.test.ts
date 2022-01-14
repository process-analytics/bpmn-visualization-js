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

// in the future, we should find a solution to avoid using the reference everywhere in tests
// see https://github.com/jest-community/jest-extended/issues/367
/// <reference types="jest-extended" />

import { readFileSync } from '../../../../helpers/file-helper';
import BpmnXmlParser from '../../../../../src/component/parser/xml/BpmnXmlParser';
import type { BPMNDiagram, BPMNLabel, BPMNShape } from '../../../../../src/model/bpmn/json/BPMNDI';
import Bounds from '../../../../../src/model/bpmn/internal/Bounds';

describe('Special parsing cases', () => {
  it('Parse a text file', () => {
    expect(() => new BpmnXmlParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/text-only.txt'))).toThrow(
      `XML parsing failed. Unable to retrieve 'definitions' for the BPMN source.`,
    );
  });

  it('Parse a binary file', () => {
    expect(() => new BpmnXmlParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/path.png'))).toThrow(`XML parsing failed. Invalid BPMN source.`);
  });

  it('Parse a diagram with large numbers and large decimals', () => {
    const json = new BpmnXmlParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/simple-start-task-end_large_numbers_and_large_decimals.bpmn'));

    const bpmnDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    const shapes = bpmnDiagram.BPMNPlane.BPMNShape as BPMNShape[];
    const getShape = (id: string): BPMNShape => shapes.filter(s => s.id == id)[0];

    // string instead of number
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore width and y are parsed as string. They have too many decimals
    expect(getShape('BPMNShape_StartEvent_1').Bounds).toEqual(new Bounds(156.10001, '81.345000000000009', '36.0003450001000002', 36.0000001));

    expect(getShape('BPMNShape_Activity_1').Bounds).toEqual(new Bounds(250, 59, 100, 80));

    // large numbers use scientific notation or converted as string
    const endEventShape = getShape('BPMNShape_EndEvent_1');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore width converted to string to not get a truncated number at runtime
    expect((endEventShape.BPMNLabel as BPMNLabel).Bounds).toEqual(new Bounds(4.16e25, 1.24000000003e29, '20000000000000000009', 1.4e21));
  });

  it('Parse a diagram with numbers not parsable as number', () => {
    const json = new BpmnXmlParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/simple-start-task-end_numbers_not_parsable_as_number.bpmn'));

    const bpmnDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    const shapes = bpmnDiagram.BPMNPlane.BPMNShape as BPMNShape[];
    const getShape = (id: string): BPMNShape => shapes.filter(s => s.id == id)[0];

    // x and y values are string instead of number in the source diagram
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore x and y are parsed as string as defined in the BPMN diagram
    expect(getShape('BPMNShape_Activity_1').Bounds).toEqual(new Bounds('not_a_number', 'not a number too', -100, -80));
  });
});
