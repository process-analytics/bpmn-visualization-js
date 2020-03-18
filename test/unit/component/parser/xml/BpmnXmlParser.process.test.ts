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
import { expect } from 'chai';

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

  it('bpmn with single process and participant', () => {
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
    console.log(JSON.stringify(json, undefined, 2));

    verifyDefinitionsWithCollaboration(json);

    // Collaboration
    const collaboration = json.definitions.collaboration;
    expect(collaboration.id).eq('Collaboration_03068dc', 'collaboration id');

    const participant = collaboration.participant;
    verifyIsNotArray(participant, 'participant');
    expect(participant.id).eq('Participant_0nuvj8r', 'participant id');
    expect(participant.name).eq('Pool 1', 'participant name');
    expect(participant.processRef).eq('Process_0vbjbkf', 'participant process ref');

    // Process
    const process = json.definitions.process;
    verifyIsNotArray(process, 'process');
    expect(process.id).eq('Process_0vbjbkf', 'process id');
    expect(process.name).eq('RequestLoan', 'process name');
    expect(process.isExecutable).eq(false, 'process isExecutable');

    // BPMNDiagram
    const shapes = verifyAndGetBPMNShape(json);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processShape = (shapes as Array<any>).find(shape => shape.id == 'Participant_0nuvj8r_di');
    verifyProperties(processShape, ['id', 'bpmnElement', 'Bounds'], []);
    expect(processShape.bpmnElement).eq('Participant_0nuvj8r', 'process shape bpmnElement');
    verifyBounds(processShape, 158, 50, 1620, 430);
  });

  it('bpmn with multiple processes and participants', () => {
    const processes = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <bpmn:collaboration id="Collaboration_1">
    <bpmn:participant id="Participant_1" name="Pool 1" processRef="Process_1" />
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
    verifyIsNotEmptyArray(participant, 'participant');

    expect(participant[0].id).eq('Participant_1', 'participant[0] id');
    expect(participant[1].id).eq('Participant_2', 'participant[1] id');

    // BPMNDiagram
    const shapes = verifyAndGetBPMNShape(json);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processShapes = (shapes as Array<any>).filter(shape => (shape.id as string).startsWith('Participant_'));
    verifyIsNotEmptyArray(processShapes, 'process shapes');
    processShapes.forEach(shape => verifyProperties(shape, ['id', 'bpmnElement', 'Bounds'], []));
  });
});
