export const xmlContent =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.3.0">\n' +
  '  <collaboration id="Collaboration_0z9qm3x">\n' +
  '    <participant id="Participant_06tnc5v" name="Pool" processRef="Process_1" />\n' +
  '    <participant id="Participant_1dqcv77" name="Pool 2" processRef="Process_09jjfys" />\n' +
  '  </collaboration>\n' +
  '  <process id="Process_1" isExecutable="false">\n' +
  '    <laneSet id="LaneSet_12a3q40">\n' +
  '      <lane id="Lane_18pm9xn" name="Lane 1">\n' +
  '        <flowNodeRef>Task_1hcentk</flowNodeRef>\n' +
  '        <flowNodeRef>ExclusiveGateway_15hu1pt</flowNodeRef>\n' +
  '        <flowNodeRef>StartEvent_1y45yut</flowNodeRef>\n' +
  '      </lane>\n' +
  '      <lane id="Lane_05bj4e3" name="Lane 2">\n' +
  '        <flowNodeRef>Event_1ocodej</flowNodeRef>\n' +
  '        <flowNodeRef>Gateway_0bsnwc3</flowNodeRef>\n' +
  '        <flowNodeRef>Activity_1gqz2go</flowNodeRef>\n' +
  '        <flowNodeRef>Activity_0w5i7vs</flowNodeRef>\n' +
  '        <flowNodeRef>Event_0hs6bgx</flowNodeRef>\n' +
  '        <flowNodeRef>Gateway_00dhejt</flowNodeRef>\n' +
  '        <flowNodeRef>Activity_0q6rgrb</flowNodeRef>\n' +
  '        <flowNodeRef>Event_0jilrsy</flowNodeRef>\n' +
  '        <flowNodeRef>Event_1gu7r0i</flowNodeRef>\n' +
  '      </lane>\n' +
  '    </laneSet>\n' +
  '    <task id="Task_1hcentk" name="choose recipe">\n' +
  '      <incoming>SequenceFlow_0h21x7r</incoming>\n' +
  '      <outgoing>SequenceFlow_0wnb4ke</outgoing>\n' +
  '    </task>\n' +
  '    <exclusiveGateway id="ExclusiveGateway_15hu1pt" name="desired dish?">\n' +
  '      <incoming>SequenceFlow_0wnb4ke</incoming>\n' +
  '    </exclusiveGateway>\n' +
  '    <startEvent id="Event_1ocodej">\n' +
  '      <outgoing>Flow_0893htq</outgoing>\n' +
  '    </startEvent>\n' +
  '    <exclusiveGateway id="Gateway_0bsnwc3" default="Flow_0bqk1uv">\n' +
  '      <incoming>Flow_0893htq</incoming>\n' +
  '      <outgoing>Flow_0bqk1uv</outgoing>\n' +
  '      <outgoing>Flow_06b0evz</outgoing>\n' +
  '    </exclusiveGateway>\n' +
  '    <task id="Activity_1gqz2go">\n' +
  '      <incoming>Flow_0bqk1uv</incoming>\n' +
  '      <outgoing>Flow_00ktdiv</outgoing>\n' +
  '    </task>\n' +
  '    <task id="Activity_0w5i7vs">\n' +
  '      <incoming>Flow_0oz7pln</incoming>\n' +
  '      <outgoing>Flow_0gik0ad</outgoing>\n' +
  '    </task>\n' +
  '    <endEvent id="Event_0hs6bgx">\n' +
  '      <incoming>Flow_0vg5m15</incoming>\n' +
  '    </endEvent>\n' +
  '    <exclusiveGateway id="Gateway_00dhejt">\n' +
  '      <incoming>Flow_0gik0ad</incoming>\n' +
  '      <incoming>Flow_00ktdiv</incoming>\n' +
  '      <outgoing>Flow_0vg5m15</outgoing>\n' +
  '    </exclusiveGateway>\n' +
  '    <subProcess id="Activity_0q6rgrb">\n' +
  '      <incoming>Flow_06b0evz</incoming>\n' +
  '      <outgoing>Flow_0oz7pln</outgoing>\n' +
  '      <startEvent id="Event_19ak306">\n' +
  '        <outgoing>Flow_0t0qj3k</outgoing>\n' +
  '      </startEvent>\n' +
  '      <task id="Activity_08f16eo">\n' +
  '        <incoming>Flow_0t0qj3k</incoming>\n' +
  '        <outgoing>Flow_1wca6u3</outgoing>\n' +
  '      </task>\n' +
  '      <sequenceFlow id="Flow_0t0qj3k" sourceRef="Event_19ak306" targetRef="Activity_08f16eo" />\n' +
  '      <endEvent id="Event_19z8wqh">\n' +
  '        <incoming>Flow_1wca6u3</incoming>\n' +
  '      </endEvent>\n' +
  '      <sequenceFlow id="Flow_1wca6u3" sourceRef="Activity_08f16eo" targetRef="Event_19z8wqh" />\n' +
  '    </subProcess>\n' +
  '    <boundaryEvent id="Event_0jilrsy" attachedToRef="Activity_0w5i7vs">\n' +
  '      <messageEventDefinition id="MessageEventDefinition_079gffz" />\n' +
  '    </boundaryEvent>\n' +
  '    <sequenceFlow id="SequenceFlow_0wnb4ke" sourceRef="Task_1hcentk" targetRef="ExclusiveGateway_15hu1pt" />\n' +
  '    <sequenceFlow id="SequenceFlow_0h21x7r" sourceRef="StartEvent_1y45yut" targetRef="Task_1hcentk" />\n' +
  '    <sequenceFlow id="Flow_0893htq" sourceRef="Event_1ocodej" targetRef="Gateway_0bsnwc3" />\n' +
  '    <sequenceFlow id="Flow_0bqk1uv" sourceRef="Gateway_0bsnwc3" targetRef="Activity_1gqz2go" />\n' +
  '    <sequenceFlow id="Flow_00ktdiv" sourceRef="Activity_1gqz2go" targetRef="Gateway_00dhejt" />\n' +
  '    <sequenceFlow id="Flow_06b0evz" sourceRef="Gateway_0bsnwc3" targetRef="Activity_0q6rgrb" />\n' +
  '    <sequenceFlow id="Flow_0gik0ad" sourceRef="Activity_0w5i7vs" targetRef="Gateway_00dhejt" />\n' +
  '    <sequenceFlow id="Flow_0vg5m15" sourceRef="Gateway_00dhejt" targetRef="Event_0hs6bgx" />\n' +
  '    <sequenceFlow id="Flow_0oz7pln" sourceRef="Activity_0q6rgrb" targetRef="Activity_0w5i7vs" />\n' +
  '    <boundaryEvent id="Event_1gu7r0i" cancelActivity="false" attachedToRef="Activity_0w5i7vs">\n' +
  '      <signalEventDefinition id="SignalEventDefinition_0a20mqp" />\n' +
  '    </boundaryEvent>\n' +
  '    <startEvent id="StartEvent_1y45yut" name="hunger noticed">\n' +
  '      <outgoing>SequenceFlow_0h21x7r</outgoing>\n' +
  '    </startEvent>\n' +
  '  </process>\n' +
  '  <process id="Process_09jjfys" isExecutable="false">\n' +
  '    <startEvent id="Event_0jqfnc3" name="hunger noticed">\n' +
  '      <outgoing>Flow_1kygnpa</outgoing>\n' +
  '    </startEvent>\n' +
  '    <task id="Activity_0pez278" name="choose recipe">\n' +
  '      <incoming>Flow_1kygnpa</incoming>\n' +
  '      <outgoing>Flow_1qle2of</outgoing>\n' +
  '    </task>\n' +
  '    <exclusiveGateway id="Gateway_16sabya" name="desired dish?">\n' +
  '      <incoming>Flow_1qle2of</incoming>\n' +
  '    </exclusiveGateway>\n' +
  '    <sequenceFlow id="Flow_1qle2of" sourceRef="Activity_0pez278" targetRef="Gateway_16sabya" />\n' +
  '    <sequenceFlow id="Flow_1kygnpa" sourceRef="Event_0jqfnc3" targetRef="Activity_0pez278" />\n' +
  '  </process>\n' +
  '  <bpmndi:BPMNDiagram id="BpmnDiagram_1">\n' +
  '    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Collaboration_0z9qm3x">\n' +
  '      <bpmndi:BPMNShape id="Participant_06tnc5v_di" bpmnElement="Participant_06tnc5v" isHorizontal="true">\n' +
  '        <omgdc:Bounds x="160" y="60" width="745" height="760" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">\n' +
  '        <omgdc:Bounds x="462" y="72" width="36" height="36" />\n' +
  '        <bpmndi:BPMNLabel>\n' +
  '          <omgdc:Bounds x="444" y="115" width="73" height="14" />\n' +
  '        </bpmndi:BPMNLabel>\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Task_1hcentk_di" bpmnElement="Task_1hcentk">\n' +
  '        <omgdc:Bounds x="680" y="80" width="100" height="80" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="ExclusiveGateway_15hu1pt_di" bpmnElement="ExclusiveGateway_15hu1pt" isMarkerVisible="true">\n' +
  '        <omgdc:Bounds x="835" y="95" width="50" height="50" />\n' +
  '        <bpmndi:BPMNLabel>\n' +
  '          <omgdc:Bounds x="828" y="152" width="66" height="14" />\n' +
  '        </bpmndi:BPMNLabel>\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNEdge id="SequenceFlow_0wnb4ke_di" bpmnElement="SequenceFlow_0wnb4ke">\n' +
  '        <omgdi:waypoint x="780" y="120" />\n' +
  '        <omgdi:waypoint x="835" y="120" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="SequenceFlow_0h21x7r_di" bpmnElement="SequenceFlow_0h21x7r">\n' +
  '        <omgdi:waypoint x="498" y="90" />\n' +
  '        <omgdi:waypoint x="589" y="90" />\n' +
  '        <omgdi:waypoint x="589" y="120" />\n' +
  '        <omgdi:waypoint x="680" y="120" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNShape id="Participant_1dqcv77_di" bpmnElement="Participant_1dqcv77" isHorizontal="true">\n' +
  '        <omgdc:Bounds x="920" y="60" width="600" height="250" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Event_0jqfnc3_di" bpmnElement="Event_0jqfnc3">\n' +
  '        <omgdc:Bounds x="1207" y="102" width="36" height="36" />\n' +
  '        <bpmndi:BPMNLabel>\n' +
  '          <omgdc:Bounds x="1189" y="145" width="73" height="14" />\n' +
  '        </bpmndi:BPMNLabel>\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Activity_0pez278_di" bpmnElement="Activity_0pez278">\n' +
  '        <omgdc:Bounds x="1295" y="80" width="100" height="80" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Gateway_16sabya_di" bpmnElement="Gateway_16sabya" isMarkerVisible="true">\n' +
  '        <omgdc:Bounds x="1450" y="95" width="50" height="50" />\n' +
  '        <bpmndi:BPMNLabel>\n' +
  '          <omgdc:Bounds x="1443" y="152" width="66" height="14" />\n' +
  '        </bpmndi:BPMNLabel>\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNEdge id="Flow_1qle2of_di" bpmnElement="Flow_1qle2of">\n' +
  '        <omgdi:waypoint x="1395" y="120" />\n' +
  '        <omgdi:waypoint x="1450" y="120" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_1kygnpa_di" bpmnElement="Flow_1kygnpa">\n' +
  '        <omgdi:waypoint x="1243" y="120" />\n' +
  '        <omgdi:waypoint x="1295" y="120" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNShape id="Lane_18pm9xn_di" bpmnElement="Lane_18pm9xn" isHorizontal="true">\n' +
  '        <omgdc:Bounds x="190" y="60" width="715" height="125" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Lane_05bj4e3_di" bpmnElement="Lane_05bj4e3" isHorizontal="true">\n' +
  '        <omgdc:Bounds x="190" y="185" width="715" height="635" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Event_1ocodej_di" bpmnElement="Event_1ocodej">\n' +
  '        <omgdc:Bounds x="362" y="232" width="36" height="36" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Gateway_0bsnwc3_di" bpmnElement="Gateway_0bsnwc3" isMarkerVisible="true">\n' +
  '        <omgdc:Bounds x="455" y="225" width="50" height="50" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNEdge id="Flow_0893htq_di" bpmnElement="Flow_0893htq">\n' +
  '        <omgdi:waypoint x="398" y="250" />\n' +
  '        <omgdi:waypoint x="455" y="250" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNShape id="Activity_1gqz2go_di" bpmnElement="Activity_1gqz2go">\n' +
  '        <omgdc:Bounds x="570" y="210" width="100" height="80" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNEdge id="Flow_0bqk1uv_di" bpmnElement="Flow_0bqk1uv">\n' +
  '        <omgdi:waypoint x="505" y="250" />\n' +
  '        <omgdi:waypoint x="570" y="250" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNShape id="Event_0hs6bgx_di" bpmnElement="Event_0hs6bgx">\n' +
  '        <omgdc:Bounds x="852" y="282" width="36" height="36" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNEdge id="Flow_00ktdiv_di" bpmnElement="Flow_00ktdiv">\n' +
  '        <omgdi:waypoint x="670" y="250" />\n' +
  '        <omgdi:waypoint x="688" y="250" />\n' +
  '        <omgdi:waypoint x="688" y="300" />\n' +
  '        <omgdi:waypoint x="705" y="300" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNShape id="Activity_0w5i7vs_di" bpmnElement="Activity_0w5i7vs">\n' +
  '        <omgdc:Bounds x="570" y="320" width="100" height="80" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNEdge id="Flow_06b0evz_di" bpmnElement="Flow_06b0evz">\n' +
  '        <omgdi:waypoint x="480" y="275" />\n' +
  '        <omgdi:waypoint x="480" y="413" />\n' +
  '        <omgdi:waypoint x="290" y="413" />\n' +
  '        <omgdi:waypoint x="290" y="550" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNShape id="Gateway_00dhejt_di" bpmnElement="Gateway_00dhejt" isMarkerVisible="true">\n' +
  '        <omgdc:Bounds x="705" y="275" width="50" height="50" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNEdge id="Flow_0gik0ad_di" bpmnElement="Flow_0gik0ad">\n' +
  '        <omgdi:waypoint x="670" y="360" />\n' +
  '        <omgdi:waypoint x="730" y="360" />\n' +
  '        <omgdi:waypoint x="730" y="325" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_0vg5m15_di" bpmnElement="Flow_0vg5m15">\n' +
  '        <omgdi:waypoint x="755" y="300" />\n' +
  '        <omgdi:waypoint x="852" y="300" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNShape id="Activity_0q6rgrb_di" bpmnElement="Activity_0q6rgrb" isExpanded="true">\n' +
  '        <omgdc:Bounds x="260" y="550" width="350" height="200" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Event_19ak306_di" bpmnElement="Event_19ak306">\n' +
  '        <omgdc:Bounds x="300" y="632" width="36" height="36" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Activity_08f16eo_di" bpmnElement="Activity_08f16eo">\n' +
  '        <omgdc:Bounds x="390" y="610" width="100" height="80" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNEdge id="Flow_0t0qj3k_di" bpmnElement="Flow_0t0qj3k">\n' +
  '        <omgdi:waypoint x="336" y="650" />\n' +
  '        <omgdi:waypoint x="390" y="650" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNShape id="Event_19z8wqh_di" bpmnElement="Event_19z8wqh">\n' +
  '        <omgdc:Bounds x="552" y="632" width="36" height="36" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNEdge id="Flow_1wca6u3_di" bpmnElement="Flow_1wca6u3">\n' +
  '        <omgdi:waypoint x="490" y="650" />\n' +
  '        <omgdi:waypoint x="552" y="650" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNEdge id="Flow_0oz7pln_di" bpmnElement="Flow_0oz7pln">\n' +
  '        <omgdi:waypoint x="435" y="550" />\n' +
  '        <omgdi:waypoint x="435" y="475" />\n' +
  '        <omgdi:waypoint x="620" y="475" />\n' +
  '        <omgdi:waypoint x="620" y="400" />\n' +
  '      </bpmndi:BPMNEdge>\n' +
  '      <bpmndi:BPMNShape id="Event_1ay0phe_di" bpmnElement="Event_0jilrsy">\n' +
  '        <omgdc:Bounds x="552" y="382" width="36" height="36" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '      <bpmndi:BPMNShape id="Event_16c1hi9_di" bpmnElement="Event_1gu7r0i">\n' +
  '        <omgdc:Bounds x="552" y="302" width="36" height="36" />\n' +
  '      </bpmndi:BPMNShape>\n' +
  '    </bpmndi:BPMNPlane>\n' +
  '  </bpmndi:BPMNDiagram>\n' +
  '</definitions>\n';
