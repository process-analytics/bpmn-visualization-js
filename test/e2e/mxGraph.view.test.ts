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
import BpmnVisu from '../../src/component/BpmnVisu';

function initializeBpmnVisu(): BpmnVisu {
  // insert graph container
  const containerDiv = document.createElement('div');
  containerDiv.id = 'graph-test';
  document.body.insertBefore(containerDiv, document.body.firstChild);
  // initialize graph
  const graphTest = document.getElementById('graph-test');
  return new BpmnVisu(graphTest);
}

function bpmnStartTaskEnd(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0x0opj6" targetNamespace="http://example.bpmn.com/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start Event 1">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_1" />
    <bpmn:task id="Activity_1" name="Task 1">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="End Event 1">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="BPMNEdge_Flow_1" bpmnElement="Flow_1">
        <di:waypoint x="192" y="99" />
        <di:waypoint x="250" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="BPMNEdge_Flow_2" bpmnElement="Flow_2">
        <di:waypoint x="350" y="99" />
        <di:waypoint x="412" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="156" y="81" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="124" width="33" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_Activity_1" bpmnElement="Activity_1">
        <dc:Bounds x="250" y="59" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_EndEvent_1" bpmnElement="EndEvent_1">
        <dc:Bounds x="412" y="81" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="416" y="124" width="29" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
}

function expectEvent(cellId: string, expectedText: string): void {
  const cellGroups = document.querySelectorAll(`#graph-test svg g g[data-cell-id="${cellId}"]`);
  const event = cellGroups[0] as SVGGElement;
  const shape = event.firstChild as SVGEllipseElement;
  expect(shape.nodeName).toBe('ellipse');
  expect(shape.getAttribute('rx')).toBe('18');
  const label = cellGroups[1] as SVGGElement;
  const text = label.firstChild.firstChild as SVGTextElement;
  expect(text.nodeName).toBe('text');
  expect(text.innerHTML).toBe(expectedText);
}

function expectTask(cellId: string, expectedText: string): void {
  const cellGroups = document.querySelectorAll(`#graph-test svg g g[data-cell-id="${cellId}"]`);
  const task = cellGroups[0] as SVGGElement;
  const shape = task.firstChild as SVGGElement;
  expect(shape.nodeName).toBe('rect');
  const label = cellGroups[1] as SVGGElement;
  const text = label.firstChild.firstChild as SVGTextElement;
  expect(text.nodeName).toBe('text');
  expect(text.innerHTML).toBe(expectedText);
}

describe('mxGraph view', () => {
  const bpmnVisu = initializeBpmnVisu();

  it('should display page title', async () => {
    await page.goto('http://localhost:10001');
    await page.waitForSelector('#graph');
    await expect(page.title()).resolves.toMatch('BPMN Visualization JS');
  });

  it('DOM should contains BPMN elements', async () => {
    bpmnVisu.load(bpmnStartTaskEnd());

    expectEvent('StartEvent_1', 'Start Event 1');
    expectTask('Activity_1', 'Task 1');
    expectEvent('EndEvent_1', 'End Event 1');
  });
});
