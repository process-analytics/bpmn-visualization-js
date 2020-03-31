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
import {
  verifyAndGetBPMNShape,
  verifyBounds,
  verifyDefinitions,
  verifyDefinitionsWithCollaboration,
  verifyIsNotArray,
  verifyIsNotEmptyArray,
  verifyProperties,
} from './XMLTestUtils';

describe('parse bpmn as xml for process', () => {
  it('bpmn with empty process, ensure process is present', () => {
    const emptyProcess = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1xabmu2" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <bpmn:process id="Process_03fna6q" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_03fna6q" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    const json = new BpmnXmlParser().parse(emptyProcess);

    verifyDefinitions(json);

    // Collaboration
    const collaboration = json.definitions.collaboration;
    expect(collaboration).toBeUndefined();

    // Process
    const process = json.definitions.process;
    verifyProperties(process, ['id', 'isExecutable'], []);

    // BPMNDiagram
    const diagram = json.definitions.BPMNDiagram;
    verifyProperties(diagram, ['id', 'BPMNPlane'], []);
    const plane = diagram.BPMNPlane;
    verifyProperties(plane, ['id', 'bpmnElement'], []);
  });

  it('bpmn with single process with elements and participant', () => {
    const singleProcess = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <bpmn:collaboration id="Collaboration_03068dc">
    <bpmn:participant id="Participant_0nuvj8r" name="Pool 1" processRef="Process_0vbjbkf" />
  </bpmn:collaboration>
  <bpmn:process id="Process_0vbjbkf" name="RequestLoan" isExecutable="false">
    <bpmn:laneSet id="LaneSet_1i59xiy">
      <bpmn:lane id="Lane_164yevk" name="Customer">
        <bpmn:flowNodeRef>_RLk983H_Eei9Z4IY4QeFuA</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_1h5yeu4" />
    </bpmn:laneSet>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1" bpmnElement="Collaboration_03068dc">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_186ohra">
      <bpmndi:BPMNShape id="Participant_0nuvj8r_di" bpmnElement="Participant_0nuvj8r" isHorizontal="true">
        <dc:Bounds x="158" y="50" width="1620" height="430" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_164yevk_di" bpmnElement="Lane_164yevk" isHorizontal="true">
        <dc:Bounds x="190" y="110" width="1230" height="83" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_1h5yeu4_di" bpmnElement="Lane_1h5yeu4" isHorizontal="true">
        <dc:Bounds x="190" y="193" width="1230" height="83" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    const json = new BpmnXmlParser().parse(singleProcess);

    verifyDefinitionsWithCollaboration(json);

    // Collaboration
    const collaboration = json.definitions.collaboration;
    expect(collaboration.id).toEqual('Collaboration_03068dc');

    const participant = collaboration.participant;
    verifyIsNotArray(participant);
    expect(participant.id).toEqual('Participant_0nuvj8r');
    expect(participant.name).toEqual('Pool 1');
    expect(participant.processRef).toEqual('Process_0vbjbkf');

    // Process
    const process = json.definitions.process;
    verifyIsNotArray(process);
    expect(process.id).toEqual('Process_0vbjbkf');
    expect(process.name).toEqual('RequestLoan');
    expect(process.isExecutable).toBeFalsy();

    // BPMNDiagram
    const shapes = verifyAndGetBPMNShape(json);
    const processShape = shapes.find(shape => shape.id == 'Participant_0nuvj8r_di');
    verifyProperties(processShape, ['id', 'bpmnElement', 'Bounds'], []);
    expect(processShape.bpmnElement).toEqual('Participant_0nuvj8r');
    verifyBounds(processShape, 158, 50, 1620, 430);
  });

  it('bpmn with multiple processes with elements and participants', () => {
    const processes = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <bpmn:collaboration id="Collaboration_1">
    <bpmn:participant id="Participant_1" name="Pool 1&#10;(Main) with &unknown; entity" processRef="Process_1" />
    <bpmn:participant id="Participant_2" name="Pool 2" processRef="Process_2" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1" name="RequestLoan" isExecutable="false">
    <bpmn:laneSet id="LaneSet_1i59xiy">
      <bpmn:lane id="Lane_164yevk" name="Customer">
        <bpmn:flowNodeRef>_RLk983H_Eei9Z4IY4QeFuA</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_1h5yeu4" />
    </bpmn:laneSet>
  </bpmn:process>
  <bpmn:process id="Process_2" name="Notify" isExecutable="false">
    <bpmn:laneSet id="LaneSet2">
      <bpmn:lane id="Lane_12u5n6x" />
    </bpmn:laneSet>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_186ohra">
      <bpmndi:BPMNShape id="Participant_1_di" bpmnElement="Participant_1" isHorizontal="true">
        <dc:Bounds x="158" y="50" width="1620" height="430" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Participant_2_di" bpmnElement="Participant_2" isHorizontal="true">
        <dc:Bounds x="158" y="450" width="1620" height="430" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_164yevk_di" bpmnElement="Lane_164yevk" isHorizontal="true">
        <dc:Bounds x="190" y="110" width="1230" height="83" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_1h5yeu4_di" bpmnElement="Lane_1h5yeu4" isHorizontal="true">
        <dc:Bounds x="190" y="193" width="1230" height="83" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_12u5n6x_di" bpmnElement="Lane_12u5n6x" isHorizontal="true">
        <dc:Bounds x="290" y="210" width="1232" height="252" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    const json = new BpmnXmlParser().parse(processes);

    verifyDefinitionsWithCollaboration(json);

    // Collaboration
    const participant = json.definitions.collaboration.participant;
    verifyIsNotEmptyArray(participant);

    expect(participant[0].id).toEqual('Participant_1');
    expect(participant[0].name).toEqual('Pool 1\n(Main) with &unknown; entity');
    expect(participant[1].id).toEqual('Participant_2');
    expect(participant[1].name).toEqual('Pool 2');

    // Process
    const process = json.definitions.process;
    verifyIsNotEmptyArray(process);
    expect(process[0].id).toEqual('Process_1');
    expect(process[0].name).toEqual('RequestLoan');
    expect(process[0].isExecutable).toBeFalsy();
    expect(process[1].id).toEqual('Process_2');
    expect(process[1].name).toEqual('Notify');
    expect(process[1].isExecutable).toBeFalsy();

    // BPMNDiagram
    const shapes = verifyAndGetBPMNShape(json);
    const processShapes = shapes.filter(shape => (shape.id as string).startsWith('Participant_'));
    verifyIsNotEmptyArray(processShapes);
    processShapes.forEach(shape => verifyProperties(shape, ['id', 'bpmnElement', 'Bounds'], []));
  });
});
