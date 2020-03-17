import { expect } from 'chai';
import BpmnXmlParser from '../../../../src/component/parser/xml/BpmnXmlParser';
import { verifyDefinitions, verifyIsNotEmptyArray, verifyProperties } from './XMLTestUtils';

describe('parse bpmn as xml for sequence flow', () => {
  it('bpmn with single process with several sequence flows, ensure sequence flows are present', () => {
    const singleProcess = `<?xml version="1.0" encoding="UTF-8"?>
<model:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di_1="http://www.omg.org/spec/DD/20100524/DI" xmlns:model="http://www.omg.org/spec/BPMN/20100524/MODEL" xsi:schemaLocation="schemaLocation http://www.omg.org/spec/BPMN/20100524/MODEL schemas/BPMN20.xsd" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <model:process id="Process_1" isExecutable="false">  
    <model:sequenceFlow id="_RLk_rHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-z3H_Eei9Z4IY4QeFuA" targetRef="_RLk-IHH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_r3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-ZnH_Eei9Z4IY4QeFuA" targetRef="_RLk-TXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_snH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk983H_Eei9Z4IY4QeFuA" targetRef="_RLk-ZnH_Eei9Z4IY4QeFuA"/>
  </model:process>
  <di:BPMNDiagram id="BpmnDiagram_1">
    <di:BPMNPlane id="BpmnPlane_1" bpmnElement="">
      <di:BPMNEdge id="_RLln9HH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_rHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1126.0" y="489.0"/>
        <di_1:waypoint x="1126.0" y="114.0"/>
        <di_1:waypoint x="1177.0" y="114.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLln-XH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_r3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="288.0" y="82.0"/>
        <di_1:waypoint x="341.0" y="82.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLln_nH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_snH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="120.0" y="79.0"/>
        <di_1:waypoint x="188.0" y="79.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
    </di:BPMNPlane>
  </di:BPMNDiagram>
</model:definitions>`;

    const json = new BpmnXmlParser().parse(singleProcess);

    verifyDefinitions(json);

    // Model
    const process = json.definitions.process;
    verifyProperties(process, ['sequenceFlow'], []);
    const sequenceFlows = process.sequenceFlow;
    verifyIsNotEmptyArray(sequenceFlows, 'sequenceFlow');
    verifyProperties(sequenceFlows[0], ['id', 'name'], []);
    verifyProperties(sequenceFlows[1], ['id', 'name'], []);

    // BPMNDiagram
    const diagram = json.definitions.BPMNDiagram;
    verifyProperties(diagram, ['BPMNPlane'], []);
    const plane = diagram.BPMNPlane;
    verifyProperties(plane, ['BPMNEdge'], []);
    const edges = plane.BPMNEdge;
    verifyIsNotEmptyArray(edges, 'BPMNEdge');
    verifyProperties(edges[0], ['id', 'bpmnElement'], []);
    verifyProperties(edges[1], ['id', 'bpmnElement'], []);
  });

  it('bpmn with multiple processes, ensure sequence flows are present', () => {
    const processes = `<?xml version="1.0" encoding="UTF-8"?>
<model:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di_1="http://www.omg.org/spec/DD/20100524/DI" xmlns:model="http://www.omg.org/spec/BPMN/20100524/MODEL" xsi:schemaLocation="schemaLocation http://www.omg.org/spec/BPMN/20100524/MODEL schemas/BPMN20.xsd" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <model:process id="Process_1" isExecutable="false">  
    <model:sequenceFlow id="_RLk_rHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-z3H_Eei9Z4IY4QeFuA" targetRef="_RLk-IHH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_r3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-ZnH_Eei9Z4IY4QeFuA" targetRef="_RLk-TXH_Eei9Z4IY4QeFuA"/>
  </model:process>
  <model:process id="Process_2" isExecutable="false">  
    <model:sequenceFlow id="_RLk_snH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk983H_Eei9Z4IY4QeFuA" targetRef="_RLk-ZnH_Eei9Z4IY4QeFuA"/>
  </model:process>
  <di:BPMNDiagram id="BpmnDiagram_1">
    <di:BPMNPlane id="BpmnPlane_1" bpmnElement="">
      <di:BPMNEdge id="_RLln9HH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_rHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1126.0" y="489.0"/>
        <di_1:waypoint x="1126.0" y="114.0"/>
        <di_1:waypoint x="1177.0" y="114.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLln-XH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_r3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="288.0" y="82.0"/>
        <di_1:waypoint x="341.0" y="82.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLln_nH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_snH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="120.0" y="79.0"/>
        <di_1:waypoint x="188.0" y="79.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
    </di:BPMNPlane>
  </di:BPMNDiagram>
</model:definitions>`;

    const json = new BpmnXmlParser().parse(processes);

    verifyDefinitions(json);

    // Model
    const process = json.definitions.process;
    verifyIsNotEmptyArray(process, 'process');
    const process0 = process[0];
    verifyProperties(process0, ['sequenceFlow'], []);
    const sequenceFlows = process0.sequenceFlow;
    verifyIsNotEmptyArray(sequenceFlows, 'sequenceFlow');
    verifyProperties(sequenceFlows[0], ['id', 'name'], []);
    verifyProperties(sequenceFlows[1], ['id', 'name'], []);

    const process1 = process[1];
    expect(process1).to.have.property('sequenceFlow');
    verifyProperties(process1.sequenceFlow, ['id', 'name'], []);
  });
});
