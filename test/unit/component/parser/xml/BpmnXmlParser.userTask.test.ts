import { expect } from 'chai';
import BpmnXmlParser from '../../../../../src/component/parser/xml/BpmnXmlParser';
import { verifyBounds, verifyDefinitions, verifyIsNotEmptyArray, verifyProperties } from './XMLTestUtils';

describe('parse bpmn as xml for user task', () => {
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
