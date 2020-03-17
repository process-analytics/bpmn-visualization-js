import BpmnXmlParser from '../../../../../src/component/parser/xml/BpmnXmlParser';
import { verifyDefinitions, verifyIsNotEmptyArray, verifyProperties } from './XMLTestUtils';

describe('parse bpmn as xml for lane', () => {
  it('bpmn with single process with several lanes with & without elements, ensure lanes are present', () => {
    const singleProcess = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <bpmn:process id="Process_0wpi11d" name="RequestLoan" isExecutable="false">
    <bpmn:laneSet id="LaneSet_1i59xiy">
      <bpmn:lane id="Lane_164yevk" name="Customer">
        <bpmn:flowNodeRef>_RLk983H_Eei9Z4IY4QeFuA</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_1h5yeu4" />
    </bpmn:laneSet>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
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

    verifyDefinitions(json);

    // Model
    const process = json.definitions.process;
    verifyProperties(process, ['laneSet'], []);
    verifyProperties(process.laneSet, ['lane'], []);
    const lanes = process.laneSet.lane;
    verifyIsNotEmptyArray(lanes, 'lane');
    verifyProperties(lanes[0], ['id', 'name', 'flowNodeRef'], []);
    verifyProperties(lanes[1], ['id'], ['name', 'flowNodeRef']);

    // BPMNDiagram
    const diagram = json.definitions.BPMNDiagram;
    verifyProperties(diagram, ['BPMNPlane'], []);
    const plane = diagram.BPMNPlane;
    verifyProperties(plane, ['BPMNShape'], []);
    const shapes = plane.BPMNShape;
    verifyIsNotEmptyArray(shapes, 'BPMNShape');
    verifyProperties(shapes[0], ['id', 'bpmnElement'], []);
    verifyProperties(shapes[1], ['id', 'bpmnElement'], []);
  });

  it('bpmn with multiple processes, ensure lanes are present', () => {
    const processes = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <bpmn:process id="Process_0wpi11d" name="RequestLoan" isExecutable="false">
    <bpmn:laneSet id="LaneSet_1i59xiy">
      <bpmn:lane id="Lane_164yevk" name="Customer">
        <bpmn:flowNodeRef>_RLk983H_Eei9Z4IY4QeFuA</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_1h5yeu4" />
    </bpmn:laneSet>
  </bpmn:process>
  <bpmn:process id="Process2" name="Notify" isExecutable="false">
    <bpmn:laneSet id="LaneSet2">
      <bpmn:lane id="Lane_12u5n6x" />
    </bpmn:laneSet>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_186ohra">
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

    verifyDefinitions(json);

    // Model
    const process = json.definitions.process;
    verifyIsNotEmptyArray(process, 'process');
    const process0 = process[0];
    verifyProperties(process0, ['laneSet'], []);
    verifyProperties(process0.laneSet, ['lane'], []);
    const lanes = process0.laneSet.lane;
    verifyIsNotEmptyArray(lanes, 'lane');
    verifyProperties(lanes[0], ['id', 'name', 'flowNodeRef'], []);
    verifyProperties(lanes[1], ['id'], ['name', 'flowNodeRef']);

    const process1 = process[1];
    verifyProperties(process1, ['laneSet'], []);
    verifyProperties(process1.laneSet, ['lane'], []);
    verifyProperties(process1.laneSet.lane, ['id'], ['name', 'flowNodeRef']);
  });
});
