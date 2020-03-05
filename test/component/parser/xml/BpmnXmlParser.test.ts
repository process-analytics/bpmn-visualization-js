import { expect } from 'chai';
import BpmnXmlParser from '../../../../src/component/parser/xml/BpmnXmlParser';

function verifyProperties(object: any, propertiesToHave: string[], propertiesNotToHave: string[]) {
  expect(object).to.be.a('object');
  propertiesToHave.map(property => expect(object).to.have.property(property)); // TODO msg on failure
  propertiesNotToHave.map(property => expect(object).not.to.have.property(property)); // TODO msg on failure
}

function isArray(object: any, message: string) {
  expect(object).to.be.a('array');
  expect(object).to.have.length.greaterThan(1, message);
}

describe('parse bpmn as xml', () => {
  describe('process', () => {
    it('bpmn with empty process, ensure process is present', () => {
      const emptyProcess = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1xabmu2" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <bpmn:process id="Process_03fna6q" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_03fna6q" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

      const json = new BpmnXmlParser().parse(emptyProcess);
      verifyProperties(json, ['definitions'], []);
      verifyProperties(json.definitions, ['process', 'BPMNDiagram'], []);

      // Model
      const process = json.definitions.process;
      verifyProperties(process, ['id', 'isExecutable'], []);

      // BPMNDiagram
      const diagram = json.definitions.BPMNDiagram;
      verifyProperties(diagram, ['id', 'BPMNPlane'], []);
      const plane = diagram.BPMNPlane;
      verifyProperties(plane, ['id', 'bpmnElement'], []);
    });
  });

  describe('start event', () => {
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
        <Bounds x="362" y="232" width="36" height="36" />
      </BPMNShape>
      <BPMNShape id="Event_0hs6bgx_di" bpmnElement="Event_0hs6bgx">
        <Bounds x="852" y="282" width="36" height="36" />
      </BPMNShape>
    </BPMNPlane>
  </BPMNDiagram>
</definitions>`;

      const json = new BpmnXmlParser().parse(singleProcess);

      verifyProperties(json, ['definitions'], []);
      verifyProperties(json.definitions, ['process', 'BPMNDiagram'], []);

      // Model
      const process = json.definitions.process;
      verifyProperties(process, ['startEvent'], []);
      const startEvent = process.startEvent;
      isArray(startEvent, 'startEvent');
      verifyProperties(startEvent[0], ['id', 'outgoing'], ['name']);

      // BPMNDiagram
      const diagram = json.definitions.BPMNDiagram;
      verifyProperties(diagram, ['BPMNPlane'], []);
      const plane = diagram.BPMNPlane;
      verifyProperties(plane, ['BPMNShape'], []);
      const shapes = plane.BPMNShape;
      isArray(shapes, 'BPMNShape');
      verifyProperties(shapes[0], ['id', 'bpmnElement'], []);
      verifyProperties(shapes[1], ['id', 'bpmnElement'], []);
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

      verifyProperties(json, ['definitions'], []);
      verifyProperties(json.definitions, ['process', 'BPMNDiagram'], []);

      // Model
      const process = json.definitions.process;
      isArray(process, 'process');
      const process0 = process[0];
      expect(process0).to.have.property('startEvent');
      const startEvent = process0.startEvent;
      isArray(startEvent, 'startEvent');
      verifyProperties(startEvent[0], ['id', 'name', 'outgoing'], []);
      verifyProperties(startEvent[1], ['id'], ['name', 'outgoing']);

      const process1 = process[1];
      expect(process1).to.have.property('startEvent');
      verifyProperties(process1.startEvent, ['id', 'name', 'outgoing'], []);
    });
  });
});
