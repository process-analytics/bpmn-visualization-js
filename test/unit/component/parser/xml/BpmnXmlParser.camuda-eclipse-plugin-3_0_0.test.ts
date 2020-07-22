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
import BpmnXmlParser from '../../../../../src/component/parser/xml/BpmnXmlParser';
import arrayContaining = jasmine.arrayContaining;
import anything = jasmine.anything;
import { TProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/rootElement';
import { BPMNDiagram } from '../../../../../src/component/parser/xml/bpmn-json-model/BPMNDI';

describe('parse bpmn as xml for Camunda Eclipse Plugin 3.0.0', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a20Processe = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="_s7yQUGwkEeWAWpNQoAVHdg" exporter="camunda modeler" exporterVersion="2.7.0" targetNamespace="http://activiti.org/bpmn">
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:startEvent id="StartEvent_1" name="Start Event">
      <bpmn2:outgoing>SequenceFlow_1</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:task id="Task_1" name="Task 1 ">
      <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="SequenceFlow_1" name="" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <bpmn2:exclusiveGateway id="ExclusiveGateway_1" name="Gateway&#xD;&#xA;(Split Flow)">
      <bpmn2:incoming>SequenceFlow_2</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_3</bpmn2:outgoing>
      <bpmn2:outgoing>SequenceFlow_4</bpmn2:outgoing>
      <bpmn2:outgoing>SequenceFlow_5</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:sequenceFlow id="SequenceFlow_2" name="" sourceRef="Task_1" targetRef="ExclusiveGateway_1"/>
    <bpmn2:task id="Task_2" name="Task 3">
      <bpmn2:incoming>SequenceFlow_3</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_6</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="SequenceFlow_3" name="" sourceRef="ExclusiveGateway_1" targetRef="Task_2"/>
    <bpmn2:task id="Task_3" name="Task 4">
      <bpmn2:incoming>SequenceFlow_4</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_7</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="SequenceFlow_4" name="" sourceRef="ExclusiveGateway_1" targetRef="Task_3"/>
    <bpmn2:sequenceFlow id="SequenceFlow_5" name="" sourceRef="ExclusiveGateway_1" targetRef="Task_4"/>
    <bpmn2:task id="Task_4" name="Task 2">
      <bpmn2:incoming>SequenceFlow_5</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_9</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="SequenceFlow_6" name="" sourceRef="Task_2" targetRef="ExclusiveGateway_2"/>
    <bpmn2:exclusiveGateway id="ExclusiveGateway_2" name="Gateway&#xD;&#xA;(Merge Flows)">
      <bpmn2:incoming>SequenceFlow_6</bpmn2:incoming>
      <bpmn2:incoming>SequenceFlow_7</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_8</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:sequenceFlow id="SequenceFlow_7" name="" sourceRef="Task_3" targetRef="ExclusiveGateway_2"/>
    <bpmn2:sequenceFlow id="SequenceFlow_8" name="" sourceRef="ExclusiveGateway_2" targetRef="EndEvent_1"/>
    <bpmn2:endEvent id="EndEvent_1" name="End Event">
      <bpmn2:incoming>SequenceFlow_8</bpmn2:incoming>
      <bpmn2:incoming>SequenceFlow_9</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="SequenceFlow_9" name="" sourceRef="Task_4" targetRef="EndEvent_1"/>
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_3" bpmnElement="StartEvent_1">
        <dc:Bounds height="36.0" width="36.0" x="174.0" y="220.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_Task_5" bpmnElement="Task_1">
        <dc:Bounds height="80.0" width="100.0" x="260.0" y="198.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="BPMNEdge_SequenceFlow_1" bpmnElement="SequenceFlow_1" sourceElement="_BPMNShape_StartEvent_3" targetElement="_BPMNShape_Task_5">
        <di:waypoint xsi:type="dc:Point" x="210.0" y="238.0"/>
        <di:waypoint xsi:type="dc:Point" x="260.0" y="238.0"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_ExclusiveGateway_2" bpmnElement="ExclusiveGateway_1" isMarkerVisible="true">
        <dc:Bounds height="50.0" width="50.0" x="410.0" y="213.0"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds height="38.0" width="71.0" x="367.0" y="261.0"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="BPMNEdge_SequenceFlow_2" bpmnElement="SequenceFlow_2" sourceElement="_BPMNShape_Task_5" targetElement="_BPMNShape_ExclusiveGateway_2">
        <di:waypoint xsi:type="dc:Point" x="360.0" y="238.0"/>
        <di:waypoint xsi:type="dc:Point" x="410.0" y="238.0"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_Task_6" bpmnElement="Task_2">
        <dc:Bounds height="80.0" width="100.0" x="510.0" y="198.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="BPMNEdge_SequenceFlow_3" bpmnElement="SequenceFlow_3" sourceElement="_BPMNShape_ExclusiveGateway_2" targetElement="_BPMNShape_Task_6">
        <di:waypoint xsi:type="dc:Point" x="460.0" y="238.0"/>
        <di:waypoint xsi:type="dc:Point" x="510.0" y="238.0"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_Task_7" bpmnElement="Task_3">
        <dc:Bounds height="80.0" width="100.0" x="510.0" y="298.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="BPMNEdge_SequenceFlow_4" bpmnElement="SequenceFlow_4" sourceElement="_BPMNShape_ExclusiveGateway_2" targetElement="_BPMNShape_Task_7">
        <di:waypoint xsi:type="dc:Point" x="435.0" y="263.0"/>
        <di:waypoint xsi:type="dc:Point" x="435.0" y="338.0"/>
        <di:waypoint xsi:type="dc:Point" x="510.0" y="338.0"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_Task_8" bpmnElement="Task_4">
        <dc:Bounds height="80.0" width="100.0" x="510.0" y="84.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="BPMNEdge_SequenceFlow_5" bpmnElement="SequenceFlow_5" sourceElement="_BPMNShape_ExclusiveGateway_2" targetElement="_BPMNShape_Task_8">
        <di:waypoint xsi:type="dc:Point" x="435.0" y="213.0"/>
        <di:waypoint xsi:type="dc:Point" x="435.0" y="124.0"/>
        <di:waypoint xsi:type="dc:Point" x="510.0" y="124.0"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds height="6.0" width="6.0" x="468.0" y="124.0"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_ExclusiveGateway_3" bpmnElement="ExclusiveGateway_2" isMarkerVisible="true">
        <dc:Bounds height="50.0" width="50.0" x="744.0" y="268.0"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds height="38.0" width="88.0" x="775.0" y="318.0"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="BPMNEdge_SequenceFlow_6" bpmnElement="SequenceFlow_6" sourceElement="_BPMNShape_Task_6" targetElement="_BPMNShape_ExclusiveGateway_3">
        <di:waypoint xsi:type="dc:Point" x="610.0" y="238.0"/>
        <di:waypoint xsi:type="dc:Point" x="677.0" y="238.0"/>
        <di:waypoint xsi:type="dc:Point" x="769.0" y="238.0"/>
        <di:waypoint xsi:type="dc:Point" x="769.0" y="268.0"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds height="6.0" width="6.0" x="632.0" y="238.0"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="BPMNEdge_SequenceFlow_7" bpmnElement="SequenceFlow_7" sourceElement="_BPMNShape_Task_7" targetElement="_BPMNShape_ExclusiveGateway_3">
        <di:waypoint xsi:type="dc:Point" x="610.0" y="338.0"/>
        <di:waypoint xsi:type="dc:Point" x="677.0" y="338.0"/>
        <di:waypoint xsi:type="dc:Point" x="769.0" y="338.0"/>
        <di:waypoint xsi:type="dc:Point" x="769.0" y="318.0"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds height="6.0" width="6.0" x="696.0" y="338.0"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_EndEvent_3" bpmnElement="EndEvent_1">
        <dc:Bounds height="36.0" width="36.0" x="845.0" y="178.0"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds height="22.0" width="65.0" x="775.0" y="198.0"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="BPMNEdge_SequenceFlow_8" bpmnElement="SequenceFlow_8" sourceElement="_BPMNShape_ExclusiveGateway_3" targetElement="_BPMNShape_EndEvent_3">
        <di:waypoint xsi:type="dc:Point" x="794.0" y="293.0"/>
        <di:waypoint xsi:type="dc:Point" x="862.0" y="293.0"/>
        <di:waypoint xsi:type="dc:Point" x="863.0" y="214.0"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds height="6.0" width="6.0" x="816.0" y="293.0"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="BPMNEdge_SequenceFlow_9" bpmnElement="SequenceFlow_9" sourceElement="_BPMNShape_Task_8" targetElement="_BPMNShape_EndEvent_3">
        <di:waypoint xsi:type="dc:Point" x="610.0" y="124.0"/>
        <di:waypoint xsi:type="dc:Point" x="727.0" y="124.0"/>
        <di:waypoint xsi:type="dc:Point" x="862.0" y="124.0"/>
        <di:waypoint xsi:type="dc:Point" x="863.0" y="178.0"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds height="6.0" width="6.0" x="761.0" y="124.0"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;

    const json = new BpmnXmlParser().parse(a20Processe);

    expect(json).toMatchObject({
      definitions: {
        process: {
          id: 'Process_1',
          isExecutable: false,
          startEvent: {
            id: 'StartEvent_1',
            name: 'Start Event',
            outgoing: 'SequenceFlow_1',
          },
          endEvent: {
            id: 'EndEvent_1',
            name: 'End Event',
            incoming: ['SequenceFlow_8', 'SequenceFlow_9'],
          },
          task: arrayContaining([anything()]),
          exclusiveGateway: arrayContaining([anything()]),
          sequenceFlow: arrayContaining([anything()]),
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: arrayContaining([anything()]),
            BPMNEdge: arrayContaining([
              {
                id: 'BPMNEdge_SequenceFlow_7',
                bpmnElement: 'SequenceFlow_7',
                sourceElement: '_BPMNShape_Task_7',
                targetElement: '_BPMNShape_ExclusiveGateway_3',
                waypoint: [anything(), anything(), anything(), anything()],
                BPMNLabel: {
                  Bounds: {
                    height: 6.0,
                    width: 6.0,
                    x: 696.0,
                    y: 338.0,
                  },
                },
              },
            ]),
          },
        },
      },
    });

    const process: TProcess = json.definitions.process as TProcess;
    expect(process.task).toHaveLength(4);
    expect(process.exclusiveGateway).toHaveLength(2);
    expect(process.sequenceFlow).toHaveLength(9);

    const bpmnDiagram: BPMNDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    expect(bpmnDiagram.BPMNPlane.BPMNShape).toHaveLength(8);
    expect(bpmnDiagram.BPMNPlane.BPMNEdge).toHaveLength(9);
  });
});
