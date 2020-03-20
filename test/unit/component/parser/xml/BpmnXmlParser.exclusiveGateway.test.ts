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
import { verifyBounds, verifyDefinitions, verifyIsNotEmptyArray, verifyProperties } from './XMLTestUtils';

describe('parse bpmn as xml for exclusive gateawy', () => {
  it('bpmn with single process with several exclusive gateawy, ensure exclusive gateawy are present', () => {
    const singleProcess = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <process id="Process_1" isExecutable="false">  
    <exclusiveGateway id="Gateway_1" name="gateway 1">
      <incoming>Flow_08z7uoy</incoming>
      <incoming>Flow_0sqwsrw</incoming>
      <outgoing>Flow_09zytr1</outgoing>
    </exclusiveGateway>
    <exclusiveGateway id="Gateway_2"/>  
  </process>
  <BPMNDiagram id="BpmnDiagram_1">
    <BPMNPlane id="BpmnPlane_1" bpmnElement="">
      <BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1">
        <Bounds x="362" y="232" width="36" height="35" />
      </BPMNShape>
      <BPMNShape id="Gateway_2_di" bpmnElement="Gateway_2">
        <Bounds x="852" y="282" width="46" height="45" />
      </BPMNShape>
    </BPMNPlane>
  </BPMNDiagram>
</definitions>`;

    const json = new BpmnXmlParser().parse(singleProcess);

    verifyDefinitions(json);

    // Model
    const process = json.definitions.process;
    verifyProperties(process, ['exclusiveGateway'], []);
    const exclusiveGateway = process.exclusiveGateway;
    verifyIsNotEmptyArray(exclusiveGateway);
    verifyProperties(exclusiveGateway[0], ['id', 'name', 'outgoing', 'incoming'], []);
    verifyProperties(exclusiveGateway[1], ['id'], ['name', 'outgoing', 'incoming']);

    // BPMNDiagram
    const diagram = json.definitions.BPMNDiagram;
    verifyProperties(diagram, ['BPMNPlane'], []);
    const plane = diagram.BPMNPlane;
    verifyProperties(plane, ['BPMNShape'], []);
    const shapes = plane.BPMNShape;
    verifyIsNotEmptyArray(shapes);
    verifyProperties(shapes[0], ['id', 'bpmnElement', 'Bounds'], []);
    verifyBounds(shapes[0], 362, 232, 36, 35);

    verifyProperties(shapes[1], ['id', 'bpmnElement', 'Bounds'], []);
    verifyBounds(shapes[1], 852, 282, 46, 45);
  });

  it('bpmn with multiple processes, ensure exclusive gateawy are present', () => {
    const processes = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <process id="Process_1" isExecutable="false">  
    <exclusiveGateway id="Gateway_1" name="gateway 1">
      <incoming>Flow_08z7uoy</incoming>
      <incoming>Flow_0sqwsrw</incoming>
      <outgoing>Flow_09zytr1</outgoing>
    </exclusiveGateway>
    <exclusiveGateway id="Gateway_2"/>
  </process>
  <process id="Process_2" isExecutable="false">  
    <exclusiveGateway id="Gateway_3"/>
  </process>
  <BPMNDiagram id="BpmnDiagram_1">
    <BPMNPlane id="BpmnPlane_1" bpmnElement="">
      <BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1">
        <Bounds x="362" y="232" width="36" height="36" />
      </BPMNShape>
      <BPMNShape id="Gateway_2_di" bpmnElement="Gateway_2">
        <Bounds x="562" y="232" width="36" height="36" />
      </BPMNShape>
      <BPMNShape id="Gateway_3_di" bpmnElement="Gateway_3">
        <Bounds x="762" y="232" width="36" height="36" />
      </BPMNShape>
    </BPMNPlane>
  </BPMNDiagram>
</definitions>`;

    const json = new BpmnXmlParser().parse(processes);

    verifyDefinitions(json);

    // Model
    const process = json.definitions.process;
    verifyIsNotEmptyArray(process);
    const process0 = process[0];
    verifyProperties(process0, ['exclusiveGateway'], []);
    const exclusiveGateway = process0.exclusiveGateway;
    verifyIsNotEmptyArray(exclusiveGateway);
    verifyProperties(exclusiveGateway[0], ['id', 'name', 'outgoing', 'incoming'], []);
    verifyProperties(exclusiveGateway[1], ['id'], ['name', 'outgoing', 'incoming']);

    const process1 = process[1];
    verifyProperties(process1, ['exclusiveGateway'], []);
    verifyProperties(process1.exclusiveGateway, ['id'], ['name', 'outgoing', 'incoming']);
  });
});
