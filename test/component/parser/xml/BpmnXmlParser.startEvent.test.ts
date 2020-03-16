import { expect } from 'chai';
import BpmnXmlParser from '../../../../src/component/parser/xml/BpmnXmlParser';
import { verifyBounds, verifyDefinitions, verifyIsNotEmptyArray, verifyProperties } from './XMLTestUtils';

describe('parse bpmn as xml for start event', () => {
  it('bpmn with single process with several start event, ensure start event are present', () => {
    const singleProcess = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <process id="Process_1" isExecutable="false">  
    <startEvent id="Event_1ocodej">  
      <outgoing></outgoing>  
    </startEvent>  
    <startEvent id="Event_0hs6bgx">  
      <outgoing></outgoing>  
    </startEvent>  
  </process>
  <BPMNDiagram id="BpmnDiagram_1">
    <BPMNPlane id="BpmnPlane_1" bpmnElement="">
      <BPMNShape id="Event_1ocodej_di" bpmnElement="Event_1ocodej">
        <Bounds x="362" y="232" width="36" height="35" />
      </BPMNShape>
      <BPMNShape id="Event_0hs6bgx_di" bpmnElement="Event_0hs6bgx">
        <Bounds x="852" y="282" width="46" height="45" />
      </BPMNShape>
    </BPMNPlane>
  </BPMNDiagram>
</definitions>`;

    const json = new BpmnXmlParser().parse(singleProcess);

    verifyDefinitions(json);

    // Model
    const process = json.definitions.process;
    verifyProperties(process, ['startEvent'], []);
    const startEvent = process.startEvent;
    verifyIsNotEmptyArray(startEvent, 'startEvent');
    verifyProperties(startEvent[0], ['id', 'outgoing'], ['name']);

    // BPMNDiagram
    const diagram = json.definitions.BPMNDiagram;
    verifyProperties(diagram, ['BPMNPlane'], []);
    const plane = diagram.BPMNPlane;
    verifyProperties(plane, ['BPMNShape'], []);
    const shapes = plane.BPMNShape;
    verifyIsNotEmptyArray(shapes, 'BPMNShape');
    verifyProperties(shapes[0], ['id', 'bpmnElement', 'Bounds'], []);
    verifyBounds(shapes[0], 362, 232, 36, 35);

    verifyProperties(shapes[1], ['id', 'bpmnElement', 'Bounds'], []);
    verifyBounds(shapes[1], 852, 282, 46, 45);
  });

  it('bpmn with multiple processes, ensure start event are present', () => {
    const processes = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <process id="Process_1" isExecutable="false">  
    <startEvent id="Event_1ocodej" name="Request a Loan">  
      <outgoing></outgoing>  
    </startEvent>  
    <startEvent id="Event_0hs6bgx">  
    </startEvent>  
  </process>
  <process id="Process_2" isExecutable="false">  
    <startEvent id="Event_2ocodej" name="Request a Loan">  
      <outgoing></outgoing>  
    </startEvent>  
  </process>
  <BPMNDiagram id="BpmnDiagram_1">
    <BPMNPlane id="BpmnPlane_1" bpmnElement="">
      <BPMNShape id="Event_1ocodej_di" bpmnElement="Event_1ocodej">
        <Bounds x="362" y="232" width="36" height="36" />
      </BPMNShape>
      <BPMNShape id="Event_0hs6bgx_di" bpmnElement="Event_0hs6bgx">
        <Bounds x="562" y="232" width="36" height="36" />
      </BPMNShape>
      <BPMNShape id="Event_2hs6bgx_di" bpmnElement="Event_2ocodej">
        <Bounds x="762" y="232" width="36" height="36" />
      </BPMNShape>
    </BPMNPlane>
  </BPMNDiagram>
</definitions>`;

    const json = new BpmnXmlParser().parse(processes);

    verifyDefinitions(json);

    // Model
    const process = json.definitions.process;
    verifyIsNotEmptyArray(process, 'process');
    const process0 = process[0];
    expect(process0).to.have.property('startEvent');
    const startEvent = process0.startEvent;
    verifyIsNotEmptyArray(startEvent, 'startEvent');
    verifyProperties(startEvent[0], ['id', 'name', 'outgoing'], []);
    verifyProperties(startEvent[1], ['id'], ['name', 'outgoing']);

    const process1 = process[1];
    expect(process1).to.have.property('startEvent');
    verifyProperties(process1.startEvent, ['id', 'name', 'outgoing'], []);
  });
});
