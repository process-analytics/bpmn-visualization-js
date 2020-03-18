import BpmnXmlParser from '../../../../../src/component/parser/xml/BpmnXmlParser';
import { verifyDefinitions, verifyDefinitionsWithCollaboration, verifyIsNotEmptyArray, verifyProperties } from './XMLTestUtils';
import { expect } from 'chai';

function expectNotToBeAnArray(obj: any, message?: string): void {
  expect(obj).to.be.a('object', message);
  expect(obj).not.to.be.a('array', message);
}

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

    // Model
    const process = json.definitions.process;
    verifyProperties(process, ['id', 'isExecutable'], []);

    // BPMNDiagram
    const diagram = json.definitions.BPMNDiagram;
    verifyProperties(diagram, ['id', 'BPMNPlane'], []);
    const plane = diagram.BPMNPlane;
    verifyProperties(plane, ['id', 'bpmnElement'], []);
  });

  // TODO here name set in both participant and process
  // add test when name only available in process
  // TODO add test with several participants
  // TODO case when no lane
  it('bpmn with single process with several lanes with & without elements, ensure lanes are present', () => {
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
    <bpmndi:BPMNShape id="Participant_0nuvj8r_di" bpmnElement="Participant_0nuvj8r" isHorizontal="true">
      <dc:Bounds x="158" y="50" width="1620" height="430" />
    </bpmndi:BPMNShape>
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_186ohra">
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
    expect(collaboration.id).eq('Collaboration_03068dc', 'collaboration id');

    const participant = collaboration.participant;
    expectNotToBeAnArray(participant, 'participant');
    expect(participant.id).eq('Participant_0nuvj8r', 'participant id');
    expect(participant.name).eq('Pool 1', 'participant name');
    expect(participant.processRef).eq('Process_0vbjbkf', 'participant process ref');

    // Process
    const process = json.definitions.process;
    expectNotToBeAnArray(process, 'process');
    expect(process.id).eq('Process_0vbjbkf', 'process id');
    expect(process.name).eq('RequestLoan', 'process name');
    expect(process.isExecutable).eq(false, 'process isExecutable');
  });

  //   it('bpmn with multiple processes, ensure lanes are present', () => {
  //     const processes = `<?xml version="1.0" encoding="UTF-8"?>
  // <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  //   <bpmn:process id="Process_0wpi11d" name="RequestLoan" isExecutable="false">
  //     <bpmn:laneSet id="LaneSet_1i59xiy">
  //       <bpmn:lane id="Lane_164yevk" name="Customer">
  //         <bpmn:flowNodeRef>_RLk983H_Eei9Z4IY4QeFuA</bpmn:flowNodeRef>
  //       </bpmn:lane>
  //       <bpmn:lane id="Lane_1h5yeu4" />
  //     </bpmn:laneSet>
  //   </bpmn:process>
  //   <bpmn:process id="Process2" name="Notify" isExecutable="false">
  //     <bpmn:laneSet id="LaneSet2">
  //       <bpmn:lane id="Lane_12u5n6x" />
  //     </bpmn:laneSet>
  //   </bpmn:process>
  //   <bpmndi:BPMNDiagram id="BPMNDiagram_1">
  //     <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_186ohra">
  //       <bpmndi:BPMNShape id="Lane_164yevk_di" bpmnElement="Lane_164yevk" isHorizontal="true">
  //         <dc:Bounds x="190" y="110" width="1230" height="83" />
  //       </bpmndi:BPMNShape>
  //       <bpmndi:BPMNShape id="Lane_1h5yeu4_di" bpmnElement="Lane_1h5yeu4" isHorizontal="true">
  //         <dc:Bounds x="190" y="193" width="1230" height="83" />
  //       </bpmndi:BPMNShape>
  //       <bpmndi:BPMNShape id="Lane_12u5n6x_di" bpmnElement="Lane_12u5n6x" isHorizontal="true">
  //         <dc:Bounds x="290" y="210" width="1232" height="252" />
  //       </bpmndi:BPMNShape>
  //     </bpmndi:BPMNPlane>
  //   </bpmndi:BPMNDiagram>
  // </bpmn:definitions>`;
  //
  //     const json = new BpmnXmlParser().parse(processes);
  //
  //     verifyDefinitions(json);
  //
  //     // Model
  //     const process = json.definitions.process;
  //     verifyIsNotEmptyArray(process, 'process');
  //     const process0 = process[0];
  //     verifyProperties(process0, ['laneSet'], []);
  //     verifyProperties(process0.laneSet, ['lane'], []);
  //     const lanes = process0.laneSet.lane;
  //     verifyIsNotEmptyArray(lanes, 'lane');
  //     verifyProperties(lanes[0], ['id', 'name', 'flowNodeRef'], []);
  //     verifyProperties(lanes[1], ['id'], ['name', 'flowNodeRef']);
  //
  //     const process1 = process[1];
  //     verifyProperties(process1, ['laneSet'], []);
  //     verifyProperties(process1.laneSet, ['lane'], []);
  //     verifyProperties(process1.laneSet.lane, ['id'], ['name', 'flowNodeRef']);
  //   });
});
