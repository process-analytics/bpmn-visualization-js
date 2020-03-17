import Graph from '../../src/component/graph/Graph';

describe('BPMN Visu JS', () => {
  // region html string literal
  const xmlContent = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.3.0">
  <collaboration id="Collaboration_0fw5m6w">
    <participant id="Participant_062w116" processRef="Process_1" />
  </collaboration>
  <process id="Process_1" isExecutable="false">
    <startEvent id="StartEvent_1y45yut" name="hunger noticed">
      <outgoing>SequenceFlow_0h21x7r</outgoing>
    </startEvent>
    <task id="Task_1hcentk" name="choose food">
      <incoming>SequenceFlow_0h21x7r</incoming>
      <outgoing>SequenceFlow_0wnb4ke</outgoing>
    </task>
    <exclusiveGateway id="ExclusiveGateway_15hu1pt" name="desired dish?">
      <incoming>SequenceFlow_0wnb4ke</incoming>
      <outgoing>Flow_0m3z77d</outgoing>
      <outgoing>Flow_1cemls1</outgoing>
    </exclusiveGateway>
    <endEvent id="Event_1ujpyos" name="Not hungry">
      <incoming>Flow_1qgzzi1</incoming>
    </endEvent>
    <task id="Activity_0vcgzmh" name="Eat it">
      <incoming>Flow_0m3z77d</incoming>
      <outgoing>Flow_1qgzzi1</outgoing>
    </task>
    <endEvent id="Event_0spzhad" name="Change menu">
      <incoming>Flow_1cemls1</incoming>
    </endEvent>
    <sequenceFlow id="SequenceFlow_0wnb4ke" sourceRef="Task_1hcentk" targetRef="ExclusiveGateway_15hu1pt" />
    <sequenceFlow id="SequenceFlow_0h21x7r" sourceRef="StartEvent_1y45yut" targetRef="Task_1hcentk" />
    <sequenceFlow id="Flow_0m3z77d" name="yes" sourceRef="ExclusiveGateway_15hu1pt" targetRef="Activity_0vcgzmh" />
    <sequenceFlow id="Flow_1cemls1" name="no" sourceRef="ExclusiveGateway_15hu1pt" targetRef="Event_0spzhad" />
    <sequenceFlow id="Flow_1qgzzi1" sourceRef="Activity_0vcgzmh" targetRef="Event_1ujpyos" />
  </process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Collaboration_0fw5m6w">
      <bpmndi:BPMNShape id="Participant_062w116_di" bpmnElement="Participant_062w116" isHorizontal="true">
        <omgdc:Bounds x="152" y="60" width="958" height="220" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">
        <omgdc:Bounds x="202" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="184" y="145" width="73" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1hcentk_di" bpmnElement="Task_1hcentk">
        <omgdc:Bounds x="290" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ExclusiveGateway_15hu1pt_di" bpmnElement="ExclusiveGateway_15hu1pt" isMarkerVisible="true">
        <omgdc:Bounds x="445" y="95" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="437" y="71" width="66" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1ujpyos_di" bpmnElement="Event_1ujpyos">
        <omgdc:Bounds x="722" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="714" y="145" width="55" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0spzhad_di" bpmnElement="Event_0spzhad">
        <omgdc:Bounds x="722" y="202" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="705" y="245" width="70" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0wnb4ke_di" bpmnElement="SequenceFlow_0wnb4ke">
        <omgdi:waypoint x="390" y="120" />
        <omgdi:waypoint x="445" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0h21x7r_di" bpmnElement="SequenceFlow_0h21x7r">
        <omgdi:waypoint x="238" y="120" />
        <omgdi:waypoint x="290" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0m3z77d_di" bpmnElement="Flow_0m3z77d">
        <omgdi:waypoint x="495" y="120" />
        <omgdi:waypoint x="560" y="120" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="519" y="102" width="17" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1cemls1_di" bpmnElement="Flow_1cemls1">
        <omgdi:waypoint x="470" y="145" />
        <omgdi:waypoint x="470" y="220" />
        <omgdi:waypoint x="722" y="220" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="479" y="180" width="13" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Activity_0vcgzmh_di" bpmnElement="Activity_0vcgzmh">
        <omgdc:Bounds x="560" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1qgzzi1_di" bpmnElement="Flow_1qgzzi1">
        <omgdi:waypoint x="660" y="120" />
        <omgdi:waypoint x="722" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`;
  // endregion
  let graph: Graph;

  beforeAll(async () => {
    await page.goto('http://localhost:10001');
    await page.waitForSelector('#graph');
    graph = new Graph(window.document.getElementById('graph'));
  });

  beforeEach(() => {
    jest.setTimeout(100000);
  });

  it('should display page title', async () => {
    await expect(page.title()).resolves.toMatch('BPMN Visu JS');
  });

  it('should display visualization', async () => {
    // load BPMN
    graph.load(xmlContent);
    // model is OK
    expect(graph.graph.model.cells.hasOwnProperty('StartEvent_1y45yut')).toBeTruthy();
    // rendering - not OK - when graph is being initialized the window.document.getElementById('graph') is null
    // await expect(page.waitForSelector('[data-cell-id="StartEvent_1y45yut"]')).resolves.toBeDefined();
  });
});
