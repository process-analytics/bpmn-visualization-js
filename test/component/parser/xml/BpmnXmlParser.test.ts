import { expect } from 'chai';
import BpmnXmlParser from '../../../../src/component/parser/xml/BpmnXmlParser';
import { verifyBounds, verifyDefinitions, verifyIsNotEmptyArray, verifyProperties } from './XMLTestUtils';

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

  describe('user task', () => {
    it('bpmn with single process with several user tasks, ensure user tasks are present', () => {
      const singleProcess = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <process id="Process_1" isExecutable="false">  
    <userTask id="_RLk9-HH_Eei9Z4IY4QeFuA" name="Complete Loan application"/>
    <userTask id="_RLk-z3H_Eei9Z4IY4QeFuA" name="Write loan contract with Duration and Loan Rate"/>
  </process>
  <BPMNDiagram id="BpmnDiagram_1">
    <BPMNPlane id="BpmnPlane_1" bpmnElement="">
      <BPMNShape id="_RLlm53H_Eei9Z4IY4QeFuA" bpmnElement="_RLk9-HH_Eei9Z4IY4QeFuA">
        <Bounds height="60.0" width="120.0" x="303.0" y="244.0"/>
      </BPMNShape>
      <BPMNShape id="_RLlnFXH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-z3H_Eei9Z4IY4QeFuA">
        <Bounds height="70.0" width="140.0" x="1063.0" y="489.0"/>
      </BPMNShape>
    </BPMNPlane>
  </BPMNDiagram>
</definitions>`;

      const json = new BpmnXmlParser().parse(singleProcess);

      verifyDefinitions(json);

      // Model
      const process = json.definitions.process;
      verifyProperties(process, ['userTask'], []);
      const userTasks = process.userTask;
      verifyIsNotEmptyArray(userTasks, 'userTask');
      verifyProperties(userTasks[0], ['id', 'name'], []);
      verifyProperties(userTasks[1], ['id', 'name'], []);

      // BPMNDiagram
      const diagram = json.definitions.BPMNDiagram;
      verifyProperties(diagram, ['BPMNPlane'], []);
      const plane = diagram.BPMNPlane;
      verifyProperties(plane, ['BPMNShape'], []);
      const shapes = plane.BPMNShape;
      verifyIsNotEmptyArray(shapes, 'BPMNShape');
      verifyProperties(shapes[0], ['id', 'bpmnElement', 'Bounds'], []);
      verifyBounds(shapes[0], 303, 244, 120, 60);

      verifyProperties(shapes[1], ['id', 'bpmnElement', 'Bounds'], []);
      verifyBounds(shapes[1], 1063, 489, 140, 70);
    });

    it('bpmn with multiple processes, ensure user tasks are present', () => {
      const processes = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <process id="Process_1" isExecutable="false">  
     <userTask id="_RLk9-HH_Eei9Z4IY4QeFuA" name="Complete Loan application"/>
     <userTask id="_RLk-z3H_Eei9Z4IY4QeFuA" name="Write loan contract with Duration and Loan Rate"/>
  </process>
  <process id="Process_2" isExecutable="false">  
     <userTask id="_RLk_BnH_Eei9Z4IY4QeFuA" name="Validate Contract"/>
  </process>
  <BPMNDiagram id="BpmnDiagram_1">
    <BPMNPlane id="BpmnPlane_1" bpmnElement="">
      <BPMNShape id="_RLlm53H_Eei9Z4IY4QeFuA" bpmnElement="_RLk9-HH_Eei9Z4IY4QeFuA">
        <Bounds height="60.0" width="120.0" x="303.0" y="244.0"/>
      </BPMNShape>
      <BPMNShape id="_RLlnFXH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-z3H_Eei9Z4IY4QeFuA">
        <Bounds height="70.0" width="140.0" x="1063.0" y="489.0"/>
      </BPMNShape>
       <BPMNShape id="_RLlnHHH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_BnH_Eei9Z4IY4QeFuA">
        <Bounds height="50.0" width="100.0" x="1276.0" y="499.0"/>
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
      expect(process0).to.have.property('userTask');
      const userTasks = process0.userTask;
      verifyIsNotEmptyArray(userTasks, 'userTask');
      verifyProperties(userTasks[0], ['id', 'name'], []);
      verifyProperties(userTasks[1], ['id', 'name'], []);

      const process1 = process[1];
      expect(process1).to.have.property('userTask');
      verifyProperties(process1.userTask, ['id', 'name'], []);
    });
  });

  describe('sequence flow', () => {
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
});
