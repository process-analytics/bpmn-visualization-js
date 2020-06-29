/**
 * Copyright 2020 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import BpmnVisu from '../../src/component/BpmnVisu';
import { ShapeBpmnElementKind } from '../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { mxgraph } from 'ts-mxgraph';
import { ShapeBpmnEventKind } from '../../src/model/bpmn/shape/ShapeBpmnEventKind';
import { SequenceFlowKind } from '../../src/model/bpmn/edge/SequenceFlowKind';
import { MarkerConstant } from '../../src/component/mxgraph/MarkerConfigurator';

declare const mxConstants: typeof mxgraph.mxConstants;
declare const mxGeometry: typeof mxgraph.mxGeometry;

export interface ExpectedFont {
  name?: string;
  size?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikeThrough?: boolean;
}

export interface ExpectedShapeModelElement {
  label?: string;
  kind: ShapeBpmnElementKind;
  font?: ExpectedFont;
  /** Only needed when the BPMN shape doesn't exist yet (use an arbitrary shape until the final render is implemented) */
  styleShape?: string;
}

export interface ExpectedEventModelElement extends ExpectedShapeModelElement {
  eventKind: ShapeBpmnEventKind;
}

export interface ExpectedEdgeModelElement {
  label?: string;
  kind: SequenceFlowKind;
  font?: ExpectedFont;
  startArrow?: string;
}

// TODO find a way to not be forced to pass 'kind'
export interface ExpectedBoundaryEventModelElement extends ExpectedEventModelElement {
  isInterrupting?: boolean;
}

function expectGeometry(cell: mxgraph.mxCell, geometry: mxgraph.mxGeometry): void {
  const cellGeometry = cell.getGeometry();
  expect(cellGeometry.x).toEqual(geometry.x);
  expect(cellGeometry.y).toEqual(geometry.y);
  expect(cellGeometry.width).toEqual(geometry.width);
  expect(cellGeometry.height).toEqual(geometry.height);
}

describe('mxGraph model', () => {
  const xmlContent = `
<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
<semantic:definitions id="_1373649849716" name="A.1.0" targetNamespace="http://www.trisotech.com/definitions/_1373649849716" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bpsim="http://www.bpsim.org/schemas/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <semantic:process isExecutable="false" id="WFP-6-">
        <semantic:startEvent name="Start Event" id="startEvent_1">
            <semantic:outgoing>normal_sequence_flow_id</semantic:outgoing>
        </semantic:startEvent>
        <semantic:startEvent name="Timer Start Event" id="startEvent_2_timer">
            <semantic:timerEventDefinition/>
        </semantic:startEvent>
        <semantic:startEvent name="Message Start Event" id="startEvent_3_message">
            <semantic:messageEventDefinition/>
        </semantic:startEvent>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 1" id="task_1" default="default_sequence_flow_id">
            <semantic:incoming>normal_sequence_flow_id</semantic:incoming>
            <semantic:outgoing>default_sequence_flow_id</semantic:outgoing>
        </semantic:task>
        <semantic:serviceTask implementation="##WebService" completionQuantity="1" isForCompensation="false" startQuantity="1" name="Service Task 2" id="serviceTask_2">
            <semantic:incoming>default_sequence_flow_id</semantic:incoming>
            <semantic:outgoing>conditional_sequence_flow_from_activity_id</semantic:outgoing>
        </semantic:serviceTask>
        <semantic:userTask completionQuantity="1" isForCompensation="false" startQuantity="1" name="User Task 3" id="userTask_3">
            <semantic:incoming>conditional_sequence_flow_from_activity_id</semantic:incoming>
            <semantic:outgoing>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:outgoing>
        </semantic:userTask>
        <semantic:boundaryEvent attachedToRef="userTask_3" cancelActivity="true" name="Boundary Intermediate Event Interrupting Message" id="boundary_event_interrupting_message_id">
            <semantic:messageEventDefinition/>
        </semantic:boundaryEvent>
        <semantic:boundaryEvent attachedToRef="userTask_3" cancelActivity="false" name="Boundary Intermediate Event Non-interrupting Message" id="boundary_event_non_interrupting_message_id">
            <semantic:messageEventDefinition/>
        </semantic:boundaryEvent>
        <semantic:boundaryEvent attachedToRef="userTask_3" cancelActivity="true" name="Boundary Intermediate Event Interrupting Timer" id="boundary_event_interrupting_timer_id">
            <semantic:timerEventDefinition/>
        </semantic:boundaryEvent>
        <semantic:boundaryEvent attachedToRef="userTask_3" cancelActivity="false" name="Boundary Intermediate Event Non-interrupting Timer" id="boundary_event_non_interrupting_timer_id">
            <semantic:timerEventDefinition/>
        </semantic:boundaryEvent>
        <semantic:intermediateThrowEvent name="Throw None Intermediate Event" id="noneIntermediateThrowEvent" />
        <semantic:intermediateThrowEvent name="Throw Message Intermediate Event" id="messageIntermediateThrowEvent">
            <semantic:messageEventDefinition />
        </semantic:intermediateThrowEvent>
        <semantic:intermediateCatchEvent name="Catch Message Intermediate Event" id="messageIntermediateCatchEvent">
            <semantic:messageEventDefinition />
        </semantic:intermediateCatchEvent>
        <semantic:intermediateCatchEvent id="IntermediateCatchEvent_Timer_01" name="Timer Intermediate Catch Event">
            <semantic:incoming>Flow_028jkgv</semantic:incoming>
            <semantic:timerEventDefinition id="TimerEventDefinition_0t6k83a" />
        </semantic:intermediateCatchEvent>
        <semantic:endEvent name="Terminate End Event" id="terminateEndEvent">
            <semantic:incoming>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:incoming>
            <semantic:terminateEventDefinition/>
        </semantic:endEvent>
         <semantic:endEvent name="Message End Event" id="messageEndEvent">
            <semantic:messageEventDefinition/>
        </semantic:endEvent>
        <semantic:inclusiveGateway id="inclusiveGateway_1" name="Inclusive Gateway 1"/>
        <semantic:callActivity calledElement="Process_unknown" name="Call Activity Collapsed" id="callActivity_1" />
        <semantic:receiveTask id="receiveTask_not_instantiated" name="Not instantiated Receive Task"/>
        <semantic:receiveTask id="receiveTask_instantiated" name="Instantiated Receive Task" instantiate=true/>
        <semantic:sequenceFlow sourceRef="startEvent_1" targetRef="task_1" name="From 'start event 1' to 'task 1'" id="normal_sequence_flow_id"/>
        <semantic:sequenceFlow sourceRef="task_1" targetRef="serviceTask_2" id="default_sequence_flow_id"/>
        <semantic:sequenceFlow sourceRef="serviceTask_2" targetRef="userTask_3" id="conditional_sequence_flow_from_activity_id">
          <semantic:conditionExpression xsi:type="semantic:tFormalExpression" id="_WsCFcRszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Boolean">&quot;Contract to be written&quot;.equals(loanRequested.status)</semantic:conditionExpression>
        </semantic:sequenceFlow>
        <semantic:sequenceFlow sourceRef="userTask_3" targetRef="noneIntermediateThrowEvent" name="" id="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80" />
        <semantic:sequenceFlow sourceRef="noneIntermediateThrowEvent" targetRef="messageIntermediateThrowEvent" name="" id="_8e8fe679-eb3b-4c43-a4d6-891e7087ff22" />
        <semantic:sequenceFlow sourceRef="messageIntermediateThrowEvent" targetRef="terminateEndEvent" name="" id="_8e8fe679-eb3b-4c43-a4d6-891e7087ff33" />
        <semantic:sequenceFlow id="Flow_028jkgv" sourceRef="startEvent_2_timer" targetRef="IntermediateCatchEvent_Timer_01" />
        <semantic:sequenceFlow sourceRef="inclusiveGateway_1" targetRef="userTask_3" name="" id="conditional_sequence_flow_from_gateway_id">
          <semantic:conditionExpression xsi:type="semantic:tFormalExpression" id="_WsCFcRszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Boolean">&quot;Contract to be written&quot;.equals(loanRequested.status)</semantic:conditionExpression>
        </semantic:sequenceFlow>
    </semantic:process>
    <bpmndi:BPMNDiagram documentation="" id="Trisotech_Visio-_6" name="A.1.0" resolution="96.00000267028808">
        <bpmndi:BPMNPlane bpmnElement="WFP-6-">
            <bpmndi:BPMNShape bpmnElement="startEvent_1" id="shape_startEvent_1">
                <dc:Bounds height="30.0" width="30.0" x="186.0" y="336.0"/>
                <bpmndi:BPMNLabel labelStyle="bold_font_id">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="153.67766754457273" y="371.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="startEvent_2_timer" id="shape_startEvent_2_timer">
                <dc:Bounds height="30.0" width="30.0" x="186.0" y="536.0"/>
            </bpmndi:BPMNShape>
             <bpmndi:BPMNShape bpmnElement="startEvent_3_message" id="shape_startEvent_3_message">
                <dc:Bounds height="30.0" width="30.0" x="86.0" y="536.0"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="task_1" id="shape_task_1">
                <dc:Bounds height="68.0" width="83.0" x="258.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="underline_font_id">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="263.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="serviceTask_2" id="shape_serviceTask_2">
                <dc:Bounds height="68.0" width="83.0" x="390.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="bold_font_id">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="395.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="userTask_3" id="shape_userTask_3">
                <dc:Bounds height="68.0" width="83.0" x="522.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="bold_font_id">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="527.3333333333334" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="boundary_event_interrupting_message_id" id="S1373649849862_boundary_event_interrupting_message_id">
	           <dc:Bounds height="32.0" width="32.0" x="98.0" y="335.0" />
	          </bpmndi:BPMNShape>
	           <bpmndi:BPMNShape bpmnElement="boundary_event_non_interrupting_message_id" id="S1373649849862_boundary_event_non_interrupting_message_id">
	           <dc:Bounds height="32.0" width="32.0" x="98.0" y="335.0" />
	          </bpmndi:BPMNShape>
	          <bpmndi:BPMNShape bpmnElement="boundary_event_interrupting_timer_id" id="S1373649849862_boundary_event_interrupting_timer_id">
	           <dc:Bounds height="32.0" width="32.0" x="98.0" y="335.0" />
	          </bpmndi:BPMNShape>
	          <bpmndi:BPMNShape bpmnElement="boundary_event_non_interrupting_timer_id" id="S1373649849862_boundary_event_non_interrupting_timer_id">
	           <dc:Bounds height="32.0" width="32.0" x="98.0" y="335.0" />
	          </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="noneIntermediateThrowEvent" id="S1373649849862_noneIntermediateThrowEvent">
	           <dc:Bounds height="32.0" width="32.0" x="648.0" y="336.0" />
	           <bpmndi:BPMNLabel labelStyle="strike_through_font_id">
	              <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="686.5963254593177" y="372.3333333333333" />
	           </bpmndi:BPMNLabel>
	        </bpmndi:BPMNShape>
	        <bpmndi:BPMNShape bpmnElement="messageIntermediateThrowEvent" id="S1373649849862_messageIntermediateThrowEvent">
	           <dc:Bounds height="32.0" width="32.0" x="698.0" y="335.0" />
	        </bpmndi:BPMNShape>
	         <bpmndi:BPMNShape bpmnElement="messageIntermediateCatchEvent" id="S1373649849862_messageIntermediateCatchEvent">
	           <dc:Bounds height="32.0" width="32.0" x="98.0" y="335.0" />
	        </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="terminateEndEvent" id="S1373649849862_terminateEndEvent">
                <dc:Bounds height="32.0" width="32.0" x="648.0" y="335.0"/>
                <bpmndi:BPMNLabel labelStyle="italic_font_id">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="616.5963254593177" y="372.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="messageEndEvent" id="S1373649849862_messageEndEvent">
	           <dc:Bounds height="32.0" width="32.0" x="87.0" y="335.0" />
	        </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="shape_IntermediateCatchEvent_Timer_01" bpmnElement="IntermediateCatchEvent_Timer_01">
                <dc:Bounds x="272" y="293" width="36" height="36" />
                <bpmndi:BPMNLabel>
                    <dc:Bounds x="259" y="336" width="62" height="40" />
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="shape_inclusiveGateway_1" bpmnElement="inclusiveGateway_1">
              <dc:Bounds x="905" y="265" width="50" height="50" />
              <bpmndi:BPMNLabel>
                <dc:Bounds x="885" y="322" width="90" height="14" />
              </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="callActivity_1" isExpanded="false" id="shape_callActivity_1">
                <dc:Bounds height="68.0" width="83.0" x="455.0" y="419.0"/>
                <bpmndi:BPMNLabel>
                    <dc:Bounds height="25" width="72.5" x="460" y="440.18"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="receiveTask_not_instantiated" id="S1373649849862_receiveTask_not_instantiated">
	           <dc:Bounds height="32.0" width="32.0" x="87.0" y="335.0" />
	        </bpmndi:BPMNShape>
	        <bpmndi:BPMNShape bpmnElement="receiveTask_instantiated" id="S1373649849862_receiveTask_instantiated">
	           <dc:Bounds height="32.0" width="32.0" x="87.0" y="335.0" />
	        </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge bpmnElement="default_sequence_flow_id" id="E1373649849864_default_sequence_flow_id">
                <di:waypoint x="342.0" y="351.0"/>
                <di:waypoint x="390.0" y="351.0"/>
                <bpmndi:BPMNLabel labelStyle="bold_font_id">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="153.67766754457273" y="371.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="normal_sequence_flow_id" id="E1373649849865_normal_sequence_flow_id">
                <di:waypoint x="216.0" y="351.0"/>
                <di:waypoint x="234.0" y="351.0"/>
                <di:waypoint x="258.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="conditional_sequence_flow_from_activity_id" id="E1373649849866_conditional_sequence_flow_from_activity_id">
                <di:waypoint x="474.0" y="351.0"/>
                <di:waypoint x="522.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="conditional_sequence_flow_from_gateway_id" id="E1373649849866_conditional_sequence_flow_from_gateway_id">
                <di:waypoint x="74.0" y="351.0"/>
                <di:waypoint x="22.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80" id="E1373649849867__8e8fe679-eb3b-4c43-a4d6-891e7087ff80">
                <di:waypoint x="606.0" y="351.0"/>
                <di:waypoint x="624.0" y="351.0"/>
                <di:waypoint x="648.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
         <bpmndi:BPMNEdge bpmnElement="_8e8fe679-eb3b-4c43-a4d6-891e7087ff22" id="E1373649849867__8e8fe679-eb3b-4c43-a4d6-891e7087ff22">
            <bpmndi:BPMNLabel />
         </bpmndi:BPMNEdge>
         <bpmndi:BPMNEdge bpmnElement="_8e8fe679-eb3b-4c43-a4d6-891e7087ff33" id="E1373649849867__8e8fe679-eb3b-4c43-a4d6-891e7087ff33" />
         <bpmndi:BPMNEdge bpmnElement="Flow_028jkgv" id="E1373649849867__Flow_028jkgv" />
        </bpmndi:BPMNPlane>
        <bpmndi:BPMNLabelStyle id="bold_font_id">
            <dc:Font isBold="true" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Arial" size="11.0"/>
        </bpmndi:BPMNLabelStyle>
         <bpmndi:BPMNLabelStyle id="italic_font_id">
            <dc:Font isBold="false" isItalic="true" isStrikeThrough="false" isUnderline="false" name="Arial" size="11.0"/>
        </bpmndi:BPMNLabelStyle>
         <bpmndi:BPMNLabelStyle id="strike_through_font_id">
            <dc:Font isBold="false" isItalic="false" isStrikeThrough="true" isUnderline="false" name="Arial" size="11.0"/>
        </bpmndi:BPMNLabelStyle>
         <bpmndi:BPMNLabelStyle id="underline_font_id">
            <dc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="true" name="Arial" size="11.0"/>
        </bpmndi:BPMNLabelStyle>
    </bpmndi:BPMNDiagram>
</semantic:definitions>
`;
  const bpmnVisu = new BpmnVisu(null);

  function expectFont(state: mxgraph.mxCellState, expectedFont: ExpectedFont): void {
    if (expectedFont) {
      if (expectedFont.isBold) {
        expect(state.style[mxConstants.STYLE_FONTSTYLE]).toEqual(mxConstants.FONT_BOLD);
      }

      if (expectedFont.isItalic) {
        expect(state.style[mxConstants.STYLE_FONTSTYLE]).toEqual(mxConstants.FONT_ITALIC);
      }

      if (expectedFont.isUnderline) {
        expect(state.style[mxConstants.STYLE_FONTSTYLE]).toEqual(mxConstants.FONT_UNDERLINE);
      }

      if (expectedFont.isStrikeThrough) {
        expect(state.style[mxConstants.STYLE_FONTSTYLE]).toEqual(mxConstants.FONT_STRIKETHROUGH);
      }

      expect(state.style[mxConstants.STYLE_FONTFAMILY]).toEqual(expectedFont.name);
      expect(state.style[mxConstants.STYLE_FONTSIZE]).toEqual(expectedFont.size);
    }
  }

  function expectModelNotContainCell(cellId: string): void {
    const cell = bpmnVisu.graph.model.getCell(cellId);
    expect(cell).toBeUndefined();
  }

  function expectModelContainsCell(cellId: string): mxgraph.mxCell {
    const cell = bpmnVisu.graph.model.getCell(cellId);
    expect(cell).not.toBeUndefined();
    expect(cell).not.toBeNull();
    return cell;
  }

  function expectModelContainsShape(cellId: string, modelElement: ExpectedShapeModelElement): mxgraph.mxCell {
    const cell = expectModelContainsCell(cellId);
    expect(cell.style).toContain(modelElement.kind);
    const state = bpmnVisu.graph.getView().getState(cell);

    const styleShape = !modelElement.styleShape ? modelElement.kind : modelElement.styleShape;
    expect(state.style[mxConstants.STYLE_SHAPE]).toEqual(styleShape);
    expect(cell.value).toEqual(modelElement.label);
    expectFont(state, modelElement.font);
    return cell;
  }

  function expectModelContainsEdge(cellId: string, modelElement: ExpectedEdgeModelElement): mxgraph.mxCell {
    const cell = expectModelContainsCell(cellId);
    expect(cell.style).toContain(modelElement.kind);

    const state = bpmnVisu.graph.getView().getState(cell);
    expect(state.style[mxConstants.STYLE_STARTARROW]).toEqual(modelElement.startArrow);
    expect(cell.value).toEqual(modelElement.label);
    expectFont(state, modelElement.font);
    return cell;
  }

  function expectModelContainsBpmnEvent(cellId: string, eventModelElement: ExpectedEventModelElement): mxgraph.mxCell {
    const cell = expectModelContainsShape(cellId, eventModelElement);
    expect(cell.style).toContain(`bpmn.eventKind=${eventModelElement.eventKind}`);
    return cell;
  }

  function expectModelContainsBpmnBoundaryEvent(cellId: string, boundaryEventModelElement: ExpectedBoundaryEventModelElement): void {
    const cell = expectModelContainsBpmnEvent(cellId, { ...boundaryEventModelElement, kind: ShapeBpmnElementKind.EVENT_BOUNDARY });
    expect(cell.style).toContain(`bpmn.isInterrupting=${boundaryEventModelElement.isInterrupting}`);
  }

  it('bpmn elements should be available in the mxGraph model', async () => {
    // load BPMN
    bpmnVisu.load(xmlContent);

    // model is OK
    const expectedBoldFont = {
      isBold: true,
      isItalic: false,
      isStrikeThrough: false,
      isUnderline: false,
      name: 'Arial',
      size: 11.0,
    };

    // start event
    expectModelContainsBpmnEvent('startEvent_1', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.NONE, font: expectedBoldFont, label: 'Start Event' });
    expectModelContainsBpmnEvent('startEvent_2_timer', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.TIMER, label: 'Timer Start Event' });
    expectModelContainsBpmnEvent('startEvent_3_message', { kind: ShapeBpmnElementKind.EVENT_START, eventKind: ShapeBpmnEventKind.MESSAGE, label: 'Message Start Event' });

    // end event
    expectModelContainsBpmnEvent('terminateEndEvent', {
      kind: ShapeBpmnElementKind.EVENT_END,
      eventKind: ShapeBpmnEventKind.TERMINATE,
      font: {
        isBold: false,
        isItalic: true,
        isStrikeThrough: false,
        isUnderline: false,
        name: 'Arial',
        size: 11.0,
      },
      label: 'Terminate End Event',
    });
    expectModelContainsBpmnEvent('messageEndEvent', { kind: ShapeBpmnElementKind.EVENT_END, eventKind: ShapeBpmnEventKind.MESSAGE, label: 'Message End Event' });

    // throw intermediate event
    expectModelContainsBpmnEvent('noneIntermediateThrowEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.NONE,
      font: {
        isBold: false,
        isItalic: false,
        isStrikeThrough: true,
        isUnderline: false,
        name: 'Arial',
        size: 11.0,
      },
      label: 'Throw None Intermediate Event',
    });
    expectModelContainsBpmnEvent('messageIntermediateThrowEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Throw Message Intermediate Event',
    });

    // catch intermediate event
    expectModelContainsBpmnEvent('messageIntermediateCatchEvent', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      label: 'Catch Message Intermediate Event',
    });
    expectModelContainsBpmnEvent('IntermediateCatchEvent_Timer_01', {
      kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
      eventKind: ShapeBpmnEventKind.TIMER,
      label: 'Timer Intermediate Catch Event',
    });

    // boundary event: interrupting
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_message_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Message',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_interrupting_timer_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: true,
      label: 'Boundary Intermediate Event Interrupting Timer',
    });

    // boundary event: non-interrupting
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_message_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.MESSAGE,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Message',
    });
    expectModelContainsBpmnBoundaryEvent('boundary_event_non_interrupting_timer_id', {
      kind: null,
      eventKind: ShapeBpmnEventKind.TIMER,
      isInterrupting: false,
      label: 'Boundary Intermediate Event Non-interrupting Timer',
    });

    // activity
    expectModelContainsShape('task_1', {
      kind: ShapeBpmnElementKind.TASK,
      font: {
        isBold: false,
        isItalic: false,
        isStrikeThrough: false,
        isUnderline: true,
        name: 'Arial',
        size: 11.0,
      },
      label: 'Task 1',
    });
    expectModelContainsShape('serviceTask_2', { kind: ShapeBpmnElementKind.TASK_SERVICE, font: expectedBoldFont, label: 'Service Task 2' });
    expectModelContainsShape('userTask_3', { kind: ShapeBpmnElementKind.TASK_USER, font: expectedBoldFont, label: 'User Task 3' });
    expectModelContainsShape('callActivity_1', { kind: ShapeBpmnElementKind.CALL_ACTIVITY, styleShape: 'rectangle', label: 'Call Activity Collapsed' });
    expectModelContainsShape('receiveTask_not_instantiated', { kind: ShapeBpmnElementKind.TASK_RECEIVE, label: 'Not instantiated Receive Task' });
    expectModelContainsShape('receiveTask_instantiated', { kind: ShapeBpmnElementKind.TASK_RECEIVE, label: 'Instantiated Receive Task' });

    // gateways
    expectModelContainsShape('inclusiveGateway_1', { kind: ShapeBpmnElementKind.GATEWAY_INCLUSIVE, label: 'Inclusive Gateway 1' });

    // sequence flow
    expectModelContainsEdge('default_sequence_flow_id', { kind: SequenceFlowKind.DEFAULT, startArrow: MarkerConstant.ARROW_DASH, font: expectedBoldFont });
    expectModelContainsEdge('normal_sequence_flow_id', { kind: SequenceFlowKind.NORMAL, label: "From 'start event 1' to 'task 1'" });
    expectModelContainsEdge('conditional_sequence_flow_from_activity_id', { kind: SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY, startArrow: mxConstants.ARROW_DIAMOND_THIN });
    expectModelContainsEdge('conditional_sequence_flow_from_gateway_id', { kind: SequenceFlowKind.CONDITIONAL_FROM_GATEWAY, label: '' });
  });

  it('bpmn elements should not be available in the mxGraph model, if they are attached to not existing elements', async () => {
    // load BPMN
    const xmlContent = `
<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
<semantic:definitions id="_1373649849716" name="A.1.0" targetNamespace="http://www.trisotech.com/definitions/_1373649849716" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bpsim="http://www.bpsim.org/schemas/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <semantic:process isExecutable="false" id="WFP-6-">
        <semantic:boundaryEvent attachedToRef="nothing" cancelActivity="true" name="Boundary Intermediate Event Interrupting Message" id="boundary_event_interrupting_message_id">
            <semantic:messageEventDefinition/>
        </semantic:boundaryEvent>
        <semantic:boundaryEvent attachedToRef="nothing" cancelActivity="false" name="Boundary Intermediate Event Non-nterrupting Message" id="boundary_event_non_interrupting_message_id">
            <semantic:messageEventDefinition/>
        </semantic:boundaryEvent>
        <semantic:boundaryEvent attachedToRef="nothing" cancelActivity="true" name="Boundary Intermediate Event Interrupting Timer" id="boundary_event_interrupting_timer_id">
            <semantic:timerEventDefinition/>
        </semantic:boundaryEvent>
        <semantic:boundaryEvent attachedToRef="nothing" cancelActivity="false" name="Boundary Intermediate Event Non-nterrupting Timer" id="boundary_event_non_interrupting_timer_id">
            <semantic:timerEventDefinition/>
        </semantic:boundaryEvent>
    </semantic:process>
    <bpmndi:BPMNDiagram documentation="" id="Trisotech_Visio-_6" name="A.1.0" resolution="96.00000267028808">
        <bpmndi:BPMNPlane bpmnElement="WFP-6-">
            <bpmndi:BPMNShape bpmnElement="boundary_event_interrupting_message_id" id="S1373649849862_boundary_event_interrupting_message_id">
	           <dc:Bounds height="32.0" width="32.0" x="98.0" y="335.0" />
	        </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</semantic:definitions>
`;
    bpmnVisu.load(xmlContent);

    // model is OK
    // boundary event: interrupting
    expectModelNotContainCell('boundary_event_interrupting_message_id');
    expectModelNotContainCell('boundary_event_interrupting_timer_id');

    // boundary event: non-interrupting
    expectModelNotContainCell('boundary_event_non_interrupting_message_id');
    expectModelNotContainCell('boundary_event_non_interrupting_timer_id');
  });

  function expectModelContainsCellWithGeometry(cellId: string, parentId: string, geometry: mxgraph.mxGeometry): void {
    const cell = bpmnVisu.graph.model.getCell(cellId);
    expect(cell).not.toBeNull();
    expect(cell.parent.id).toEqual(parentId);
    expectGeometry(cell, geometry);
  }

  function getDefaultParentId(): string {
    return bpmnVisu.graph.getDefaultParent().id;
  }

  it('bpmn element shape should have coordinates relative to the pool when no lane', async () => {
    const bpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://example.com/schema/bpmn">
  <bpmn:collaboration id="Collaboration_1">
    <bpmn:participant id="Participant_1" name="Process" processRef="Process_1" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="start">
    </bpmn:startEvent>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1">
      <bpmndi:BPMNShape id="BPMNShape_Participant_1" bpmnElement="Participant_1" isHorizontal="true">
        <dc:Bounds x="100" y="20" width="900" height="180" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="250" y="100" width="40" height="40" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="260" y="60" width="30" height="20" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
    bpmnVisu.load(bpmn);

    expectModelContainsCellWithGeometry(
      'Participant_1',
      getDefaultParentId(),
      // unchanged as this is a pool, coordinates are the ones from the bpmn source
      new mxGeometry(100, 20, 900, 180),
    );

    expectModelContainsCellWithGeometry(
      'StartEvent_1',
      'Participant_1',
      new mxGeometry(
        150, // absolute coordinates: parent 100, cell 250
        80, // absolute coordinates: parent 20, cell 100
        40, // unchanged as no transformation on size
        40, // unchanged as no transformation on size
      ),
    );
  });

  it('lanes and bpmn element shapes should have coordinates relative to the pool or the lane', async () => {
    const bpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://example.com/schema/bpmn">
<bpmn:collaboration id="Collaboration_1">
    <bpmn:participant id="Participant_1" name="Process" processRef="Process_1" />
</bpmn:collaboration>
<bpmn:process id="Process_1" isExecutable="false">
    <bpmn:laneSet id="LaneSet_1">
        <bpmn:lane id="Lane_1" name="Lane 1">
            <bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef>
        </bpmn:lane>
        <bpmn:lane id="Lane_2" />
    </bpmn:laneSet>
    <bpmn:startEvent id="StartEvent_1" name="start"/>
</bpmn:process>
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1">
        <bpmndi:BPMNShape id="BPMNShape_Participant_1" bpmnElement="Participant_1" isHorizontal="true">
            <dc:Bounds x="100" y="20" width="900" height="400" />
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
            <dc:Bounds x="250" y="100" width="40" height="40" />
            <bpmndi:BPMNLabel>
                <dc:Bounds x="260" y="60" width="30" height="20" />
            </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="BPMNShape_Lane_1" bpmnElement="Lane_1" isHorizontal="true">
            <dc:Bounds x="130" y="20" width="870" height="200" />
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="BPMNShape_Lane_2" bpmnElement="Lane_2" isHorizontal="true">
            <dc:Bounds x="130" y="220" width="870" height="200" />
        </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
    bpmnVisu.load(bpmn);

    expectModelContainsCellWithGeometry(
      'Participant_1',
      getDefaultParentId(),
      // unchanged as this is a pool, coordinates are the ones from the bpmn source
      new mxGeometry(100, 20, 900, 400),
    );

    expectModelContainsCellWithGeometry(
      'Lane_1',
      'Participant_1',
      new mxGeometry(
        30, // absolute coordinates: parent 100, cell 130
        0, // absolute coordinates: parent 20, cell 20
        870, // unchanged as no transformation on size
        200, // unchanged as no transformation on size
      ),
    );

    expectModelContainsCellWithGeometry(
      'StartEvent_1',
      'Lane_1',
      new mxGeometry(
        120, // absolute coordinates: parent 130, cell 250
        80, // absolute coordinates: parent 20, cell 100
        40, // unchanged as no transformation on size
        40, // unchanged as no transformation on size
      ),
    );

    expectModelContainsCellWithGeometry(
      'Lane_2',
      'Participant_1',
      new mxGeometry(
        30, // absolute coordinates: parent 100, cell 130
        200, // absolute coordinates: parent 20, cell 220
        870, // unchanged as no transformation on size
        200, // unchanged as no transformation on size
      ),
    );
  });
});
