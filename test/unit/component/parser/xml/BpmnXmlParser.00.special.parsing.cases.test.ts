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

import type { BPMNDiagram, BPMNEdge, BPMNLabel, BPMNShape } from '@lib/model/bpmn/json/bpmndi';

import BpmnXmlParser from '@lib/component/parser/xml/BpmnXmlParser';
import Bounds from '@lib/model/bpmn/internal/Bounds';
import { readFileSync } from '@test/shared/file-helper';

describe('Special parsing cases', () => {
  it('Parse a text file', () => {
    expect(() => new BpmnXmlParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/text-only.txt'))).toThrow(
      `XML parsing failed. Unable to retrieve 'definitions' from the BPMN source.`,
    );
  });

  it('Parse a binary file', () => {
    expect(() => new BpmnXmlParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/path.png'))).toThrow(`XML parsing failed. Invalid BPMN source.`);
  });

  it('Parse a diagram with large numbers and large decimals', () => {
    const json = new BpmnXmlParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/simple-start-task-end_large_numbers_and_large_decimals.bpmn'));

    const bpmnDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    const shapes = bpmnDiagram.BPMNPlane.BPMNShape as BPMNShape[];
    const getShape = (id: string): BPMNShape => shapes.find(s => s.id == id);

    const edges = bpmnDiagram.BPMNPlane.BPMNEdge as BPMNEdge[];
    const getEdge = (id: string): BPMNEdge => edges.find(s => s.id == id);

    expect(getShape('BPMNShape_StartEvent_1').Bounds).toEqual(
      new Bounds(
        156.100_010_002_564_63, // 156.10001000256464316843136874561354684 in the diagram
        81.345_000_000_000_01, // 81.345000000000009 in the diagram
        36.000_345_000_1, // 36.0003450001000002 in the diagram
        36.000_000_100_354_96, // 36.00000010035496143139997251548445 in the diagram
      ),
    );

    const activity1 = getShape('BPMNShape_Activity_1');
    // standard numbers for bounds
    expect(activity1.Bounds).toEqual(new Bounds(250, 59.795_444_2, 100.678_942_1, 80));
    // large number decimals for label bounds
    expect((activity1.BPMNLabel as BPMNLabel).Bounds).toEqual(
      new Bounds(
        251.546_168_735_168_75, // 251.546168735168735133580035789 in the diagram
        62.535_763_100_004_69, // 62.5357631000046898412244767058 in the diagram
        33.659_851_435_460_055, // 33.659851435460054800548744548 in the diagram
        18.245_131_658_435_167, // '18.245131658435165843221640005446841658416841 in the diagram
      ),
    );

    // large numbers use scientific notation or converted as string
    const endEventShape = getShape('BPMNShape_EndEvent_1');
    expect((endEventShape.BPMNLabel as BPMNLabel).Bounds).toEqual(new Bounds(4.16e25, 1.240_000_000_03e29, 20_000_000_000_000_000_000, 1.4e21));

    // label bounds of edge
    const edge1 = getEdge('BPMNEdge_Flow_1');
    expect((edge1.BPMNLabel as BPMNLabel).Bounds).toEqual(
      new Bounds(
        258.654_687_421_687_64, // 258.6546874216876435469813 in the diagram
        94.549_684_316_846_52, // 94.549684316846518435138654654687 in the diagram
        53.126_461_365_874_65, // 53.1264613658746467887414 in the diagram
        84.431_876_431_357_68, // 84.4318764313576846543564684651454646 in the diagram
      ),
    );
    const edge1Waypoints = edge1.waypoint;
    expect(edge1Waypoints).toHaveLength(2);
    expect(edge1Waypoints[0]).toEqual({ x: 192, y: 99.4 });
    expect(edge1Waypoints[1]).toEqual({ x: 250.12, y: 99.9246 });

    // waypoints of edge
    const edge2Waypoints = getEdge('BPMNEdge_Flow_2').waypoint;
    expect(edge2Waypoints).toHaveLength(2);
    expect(edge2Waypoints[0]).toEqual({
      x: 350.010_000_000_545_46, // 350.010000000545455749847855625445 in the diagram
      y: 99.000_000_000_048_54, // 99.000000000048548464923279646 in the diagram
    });
    expect(edge2Waypoints[1]).toEqual({ x: 412.658, y: 99.12 });
  });

  it('Parse a diagram with numbers not parsable as number', () => {
    const json = new BpmnXmlParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/simple-start-task-end_numbers_not_parsable_as_number.bpmn'));

    const bpmnDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    const shapes = bpmnDiagram.BPMNPlane.BPMNShape as BPMNShape[];
    const getShape = (id: string): BPMNShape => shapes.find(s => s.id == id);

    // x and y values are string instead of number in the source diagram
    expect(getShape('BPMNShape_Activity_1').Bounds).toEqual(
      new Bounds(
        Number.NaN, // 'not_a_number' in the diagram
        Number.NaN, // 'not a number too' in the diagram
        -100,
        -80,
      ),
    );
  });

  it('Parse a diagram with entities in the name attributes', () => {
    const json = new BpmnXmlParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/start-tasks-end_entities_in_attributes.bpmn'));

    expect(json).toMatchObject({
      definitions: {
        process: {
          startEvent: { name: '&#174;Start Event 1 &reg;\nbuilt with &#9824;' },
          task: { name: 'Task 1&nbsp;or task 2&#x2215;3&#10741;4' },
          endEvent: { name: '&unknown; End Event & 1/2\\3 &#x00D8; \n &yen; / &#165;' },
          sequenceFlow: [{ name: '<Sequence> Flow 1&2' }, { name: 'Sequence \'Flow" 2' }],
        },
        BPMNDiagram: expect.anything(),
      },
    });
  });
});
