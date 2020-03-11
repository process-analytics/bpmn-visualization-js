import { expect } from 'chai';
import BpmnParser from '../../../src/component/parser/BpmnParser';

describe('parse xml to model', () => {
  it('model is filled', () => {
    const bpmnAsXml = `<?xml version="1.0" encoding="UTF-8"?>
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

    const parser = new BpmnParser();
    const model = parser.parse(bpmnAsXml);

    expect(model.shapes).to.have.lengthOf(2, 'shapes');
    expect(model.edges).to.have.lengthOf(0, 'edges');
  });
});
