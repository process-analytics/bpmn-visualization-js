/*
Copyright 2024 Bonitasoft S.A.

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

import type { TProcess } from '@lib/model/bpmn/json/baseElement/rootElement/rootElement';
import type { BPMNDiagram, BPMNEdge, BPMNShape } from '@lib/model/bpmn/json/bpmndi';

import BpmnXmlParser from '@lib/component/parser/xml/BpmnXmlParser';
import { readFileSync } from '@test/shared/file-helper';

describe('parse bpmn as xml for ipt-commerce Vizi Modeler for Microsoft Visio 7.7151.18707', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a20Process = readFileSync('../fixtures/bpmn/xml-parsing/itp-commerce_Vizi-Modeler-for-Microsoft-Visio_7.7151.18707_bug-2857.bpmn');

    const json = new BpmnXmlParser().parse(a20Process);

    const process: TProcess = json.definitions.process as TProcess;
    expect(process.task).toHaveLength(4);
    expect(process.exclusiveGateway).toHaveLength(3);
    expect(process.sequenceFlow).toHaveLength(7);

    const bpmnPlane = (json.definitions.BPMNDiagram as BPMNDiagram).BPMNPlane;
    const shapes = bpmnPlane.BPMNShape as BPMNShape[];
    expect(shapes).toHaveLength(8);
    const edges = bpmnPlane.BPMNEdge as BPMNEdge[];
    expect(edges).toHaveLength(7);

    // Ensure that coordinates are parsed correctly as number. Fix for https://github.com/process-analytics/bpmn-visualization-js/issues/2857
    const shapeBounds = shapes.find(shape => shape.id === '_BA5FD27D-30DD-4F4F-93B3-A76CC5C4D0D2').Bounds;
    expect(shapeBounds).toEqual({
      x: 415.275_590_551_181_1,
      y: 82.204_724_409_448_89,
      width: 17.007_874_015_748_033,
      height: 17.007_874_015_748_033,
    });

    const edgeWaypoints = edges.find(edge => edge.id === '_7A3B4F0A-FB98-41F2-A77E-DE47B57C3C28').waypoint;
    expect(edgeWaypoints).toEqual([
      { x: 445.039_370_078_740_21, y: 182.480_314_960_629_93 },
      { x: 577.559_055_118_110_2, y: 182.480_314_960_629_93 },
      { x: 577.559_055_118_110_2, y: 239.173_228_346_456_77 },
    ]);
  });
});
