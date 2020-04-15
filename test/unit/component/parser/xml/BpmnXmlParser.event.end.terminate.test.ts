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
import { verifyDefinitions, verifyIsNotEmptyArray, verifyProperties, verifyPropertiesValues } from './XMLTestUtils';

describe('end event terminate', () => {
  it('bpmn with single process with several end events, ensure end events are present', () => {
    const singleProcess = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <process id="Process_1" isExecutable="false">  
    <endEvent id="Event_063qkx6" name="endEvent">
      <incoming>Flow_01iy2oj</bpmn:incoming>
      <terminateEventDefinition/>
    </endEvent>  
    <endEvent id="Event_993qkx6">
      <incoming>Flow_01iy2ok</bpmn:incoming>
      <terminateEventDefinition/>
      <terminateEventDefinition/>
    </endEvent>
  </process>
  <BPMNDiagram id="BpmnDiagram_1">
    <BPMNPlane id="BpmnPlane_1" bpmnElement="">
      <BPMNShape id="Event_063qkx6_di" bpmnElement="Event_063qkx6">
        <Bounds x="632" y="142" width="36" height="36" />
        <BPMNLabel>
          <Bounds x="626" y="185" width="48" height="14" />
        </BPMNLabel>
      </BPMNShape>
      <BPMNShape id="Event_993qkx6_di" bpmnElement="Event_993qkx6">
        <Bounds x="642" y="242" width="36" height="36" />
      </BPMNShape>
    </BPMNPlane>
  </BPMNDiagram>
</definitions>`;

    const json = new BpmnXmlParser().parse(singleProcess);
    verifyDefinitions(json);

    // Model
    const process = json.definitions.process;
    verifyProperties(process, ['endEvent'], []);
    const endEvent = process.endEvent;
    verifyIsNotEmptyArray(endEvent);
    verifyProperties(endEvent[0], ['id', 'incoming', 'name', 'terminateEventDefinition'], []);
    verifyProperties(endEvent[0], ['id', 'incoming', 'name', 'terminateEventDefinition'], []);
    verifyPropertiesValues(endEvent[1], new Map([['terminateEventDefinition', ['', '']]]));
  });
});
