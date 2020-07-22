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
import BpmnXmlParser from '../../../../../src/component/parser/xml/BpmnXmlParser';
import arrayContaining = jasmine.arrayContaining;
import objectContaining = jasmine.objectContaining;
import anything = jasmine.anything;
import { BPMNDiagram } from '../../../../../src/component/parser/xml/bpmn-json-model/BPMNDI';
import { TProcess } from '../../../../../src/component/parser/xml/bpmn-json-model/baseElement/rootElement/rootElement';

describe('parse bpmn as xml for MIWG', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a21Processe = `<?xml version="1.0" encoding="UTF-8"?>
<model:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di_1="http://www.omg.org/spec/DD/20100524/DI" xmlns:model="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:w4="http://www.w4.eu/spec/BPMN/20110701/MODEL" xmlns:w4graph="http://www.w4.eu/spec/BPMN/20110930/GRAPH" xsi:schemaLocation="schemaLocation http://www.omg.org/spec/BPMN/20100524/MODEL" id="Bpmn_Definitions_--SwsH2BEeWQ6qGdY3x14w" w4:version="1.0" expressionLanguage="http://groovy.codehaus.org/" name="A.2.1" targetNamespace="http://bonitasoft.com/_To9ZoDOCEeSknpIVFCxNIQ" typeLanguage="http://www.w3.org/2001/XMLSchema" xmlns:color="http://www.omg.org/spec/BPMN/non-normative/color/1.0">
  <model:process id="_To9ZoTOCEeSknpIVFCxNIQ" name="A.2.1" isExecutable="false" processType="None">
    <model:extensionElements>
      <w4graph:graphStyle>
        <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
        <w4graph:root gridVisible="true" snapToGrid="true" rulerVisible="true" snapToGuide="true" rulerUnit="Pixels">
          <Grid spacing="15" color="230,230,230"/>
          <VerticalRuler/>
          <HorizontalRuler/>
        </w4graph:root>
      </w4graph:graphStyle>
    </model:extensionElements>
    <model:ioSpecification id="_cVGqYDOCEeSknpIVFCxNIQ">
      <model:inputSet id="_cVHRcDOCEeSknpIVFCxNIQ"/>
      <model:outputSet id="_cVH4gDOCEeSknpIVFCxNIQ"/>
    </model:ioSpecification>
    <model:startEvent id="_To9ZojOCEeSknpIVFCxNIQ" name="Start Event" isInterrupting="true">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="109,183,0" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:outgoing>_To9Z5DOCEeSknpIVFCxNIQ</model:outgoing>
    </model:startEvent>
    <model:task id="_To9ZpzOCEeSknpIVFCxNIQ" name="Task 1" completionQuantity="1" isForCompensation="false" startQuantity="1">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="194,215,235" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:incoming>_To9Z5DOCEeSknpIVFCxNIQ</model:incoming>
      <model:outgoing>_To9Z5zOCEeSknpIVFCxNIQ</model:outgoing>
    </model:task>
    <model:endEvent id="_To9ZsTOCEeSknpIVFCxNIQ" name="End Event">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="190,0,0" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:incoming>_To9Z7TOCEeSknpIVFCxNIQ</model:incoming>
      <model:incoming>_To9Z9jOCEeSknpIVFCxNIQ</model:incoming>
    </model:endEvent>
    <model:task id="_To9ZtjOCEeSknpIVFCxNIQ" name="Task 2" completionQuantity="1" default="Bpmn_SequenceFlow_edepQQbbEealeL5I4Yl3Dw" isForCompensation="false" startQuantity="1">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="194,215,235" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:incoming>_To9Z6jOCEeSknpIVFCxNIQ</model:incoming>
      <model:outgoing>_To9Z7TOCEeSknpIVFCxNIQ</model:outgoing>
      <model:outgoing>Bpmn_SequenceFlow_edepQQbbEealeL5I4Yl3Dw</model:outgoing>
    </model:task>
    <model:task id="_To9ZwDOCEeSknpIVFCxNIQ" name="Task 3" completionQuantity="1" isForCompensation="false" startQuantity="1">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="194,215,235" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:incoming>_To9Z-TOCEeSknpIVFCxNIQ</model:incoming>
      <model:incoming>Bpmn_SequenceFlow_edepQQbbEealeL5I4Yl3Dw</model:incoming>
      <model:incoming>Bpmn_SequenceFlow_f9nmUQbbEealeL5I4Yl3Dw</model:incoming>
      <model:outgoing>_To9Z8DOCEeSknpIVFCxNIQ</model:outgoing>
    </model:task>
    <model:exclusiveGateway id="_To9ZyjOCEeSknpIVFCxNIQ" name="Gateway&#xD;&#xA;(Split Flow)" gatewayDirection="Unspecified" default="_To9Z6jOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="185,139,0" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:incoming>_To9Z5zOCEeSknpIVFCxNIQ</model:incoming>
      <model:outgoing>_To9Z6jOCEeSknpIVFCxNIQ</model:outgoing>
      <model:outgoing>_To9Z-TOCEeSknpIVFCxNIQ</model:outgoing>
      <model:outgoing>_To9Z_DOCEeSknpIVFCxNIQ</model:outgoing>
    </model:exclusiveGateway>
    <model:task id="_To9ZzzOCEeSknpIVFCxNIQ" name="Task 4" completionQuantity="1" default="Bpmn_SequenceFlow_f9nmUQbbEealeL5I4Yl3Dw" isForCompensation="false" startQuantity="1">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="194,215,235" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:incoming>_To9Z_DOCEeSknpIVFCxNIQ</model:incoming>
      <model:outgoing>_To9Z8zOCEeSknpIVFCxNIQ</model:outgoing>
      <model:outgoing>Bpmn_SequenceFlow_f9nmUQbbEealeL5I4Yl3Dw</model:outgoing>
    </model:task>
    <model:exclusiveGateway id="_To9Z2TOCEeSknpIVFCxNIQ" name="Gateway&#10;(Merge Flows)" gatewayDirection="Unspecified">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="185,139,0" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:incoming>_To9Z8DOCEeSknpIVFCxNIQ</model:incoming>
      <model:incoming>_To9Z8zOCEeSknpIVFCxNIQ</model:incoming>
      <model:outgoing>_To9Z9jOCEeSknpIVFCxNIQ</model:outgoing>
    </model:exclusiveGateway>
    <model:sequenceFlow id="_To9Z5DOCEeSknpIVFCxNIQ" name="" sourceRef="_To9ZojOCEeSknpIVFCxNIQ" targetRef="_To9ZpzOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="false" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
    </model:sequenceFlow>
    <model:sequenceFlow id="_To9Z5zOCEeSknpIVFCxNIQ" name="" sourceRef="_To9ZpzOCEeSknpIVFCxNIQ" targetRef="_To9ZyjOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="false" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
    </model:sequenceFlow>
    <model:sequenceFlow id="_To9Z6jOCEeSknpIVFCxNIQ" name="Default" sourceRef="_To9ZyjOCEeSknpIVFCxNIQ" targetRef="_To9ZtjOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="true" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
    </model:sequenceFlow>
    <model:sequenceFlow id="_To9Z7TOCEeSknpIVFCxNIQ" name="Condition" sourceRef="_To9ZtjOCEeSknpIVFCxNIQ" targetRef="_To9ZsTOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="false" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:conditionExpression xsi:type="model:tFormalExpression" id="_cVKUwTOCEeSknpIVFCxNIQ" language="http://www.w3.org/1999/XPath">true</model:conditionExpression>
    </model:sequenceFlow>
    <model:sequenceFlow id="_To9Z8DOCEeSknpIVFCxNIQ" sourceRef="_To9ZwDOCEeSknpIVFCxNIQ" targetRef="_To9Z2TOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="true" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
    </model:sequenceFlow>
    <model:sequenceFlow id="_To9Z8zOCEeSknpIVFCxNIQ" name="condition" sourceRef="_To9ZzzOCEeSknpIVFCxNIQ" targetRef="_To9Z2TOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="false" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:conditionExpression xsi:type="model:tFormalExpression" id="_cVKUwzOCEeSknpIVFCxNIQ" language="http://www.w3.org/1999/XPath"/>
    </model:sequenceFlow>
    <model:sequenceFlow id="_To9Z9jOCEeSknpIVFCxNIQ" name="" sourceRef="_To9Z2TOCEeSknpIVFCxNIQ" targetRef="_To9ZsTOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="true" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:conditionExpression xsi:type="model:tFormalExpression" id="_cVKUxDOCEeSknpIVFCxNIQ" language="http://www.w3.org/1999/XPath"/>
    </model:sequenceFlow>
    <model:sequenceFlow id="_To9Z-TOCEeSknpIVFCxNIQ" name="" sourceRef="_To9ZyjOCEeSknpIVFCxNIQ" targetRef="_To9ZwDOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="false" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:conditionExpression xsi:type="model:tFormalExpression" id="_cVKUxTOCEeSknpIVFCxNIQ" language="http://www.w3.org/1999/XPath"/>
    </model:sequenceFlow>
    <model:sequenceFlow id="_To9Z_DOCEeSknpIVFCxNIQ" name="" sourceRef="_To9ZyjOCEeSknpIVFCxNIQ" targetRef="_To9ZzzOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="true" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
      <model:conditionExpression xsi:type="model:tFormalExpression" id="_cVKUxjOCEeSknpIVFCxNIQ" language="http://www.w3.org/1999/XPath"/>
    </model:sequenceFlow>
    <model:sequenceFlow id="Bpmn_SequenceFlow_edepQQbbEealeL5I4Yl3Dw" isImmediate="true" sourceRef="_To9ZtjOCEeSknpIVFCxNIQ" targetRef="_To9ZwDOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="true" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
    </model:sequenceFlow>
    <model:sequenceFlow id="Bpmn_SequenceFlow_f9nmUQbbEealeL5I4Yl3Dw" isImmediate="true" sourceRef="_To9ZzzOCEeSknpIVFCxNIQ" targetRef="_To9ZwDOCEeSknpIVFCxNIQ">
      <model:extensionElements>
        <w4graph:graphStyle>
          <w4graph:basic background="255,255,255" foreground="0,0,0" autoResize="false" borderColor="100,100,100" collapsed="false"/>
          <w4graph:line routerType="Rectilinear" automaticRoute="true" closestRoute="false" avoidObstacleRoute="false"/>
        </w4graph:graphStyle>
      </model:extensionElements>
    </model:sequenceFlow>
  </model:process>
  <di:BPMNDiagram id="Bpmndi_BPMNDiagram_--TXwH2BEeWQ6qGdY3x14w" name="A.2.1">
    <di:BPMNPlane id="plane__To9ZoDOCEeSknpIVFCxNIQ" bpmnElement="_To9ZoTOCEeSknpIVFCxNIQ">
      <di:BPMNShape id="_To9aGzOCEeSknpIVFCxNIQ" bpmnElement="_To9ZojOCEeSknpIVFCxNIQ" color:background-color="#6db700">
        <dc:Bounds height="30.0" width="30.0" x="198.0" y="302.0"/>
        <di:BPMNLabel id="_cVJGoTOCEeSknpIVFCxNIQ" labelStyle="_cVJGoDOCEeSknpIVFCxNIQ">
          <dc:Bounds height="14.0" width="63.0" x="182.0" y="332.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_To9aHzOCEeSknpIVFCxNIQ" bpmnElement="_To9ZpzOCEeSknpIVFCxNIQ" color:background-color="#c2d7eb">
        <dc:Bounds height="50.0" width="100.0" x="272.0" y="292.0"/>
        <di:BPMNLabel id="_cVJGojOCEeSknpIVFCxNIQ" labelStyle="_cVJGoDOCEeSknpIVFCxNIQ">
          <dc:Bounds height="14.0" width="44.0" x="300.0" y="310.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_To9aIjOCEeSknpIVFCxNIQ" bpmnElement="_To9ZsTOCEeSknpIVFCxNIQ" color:background-color="#be0000">
        <dc:Bounds height="30.0" width="30.0" x="836.0" y="292.0"/>
        <di:BPMNLabel id="_cVJGozOCEeSknpIVFCxNIQ" labelStyle="_cVJGoDOCEeSknpIVFCxNIQ">
          <dc:Bounds height="14.0" width="56.0" x="780.0" y="300.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_To9aJjOCEeSknpIVFCxNIQ" bpmnElement="_To9ZtjOCEeSknpIVFCxNIQ" color:background-color="#c2d7eb">
        <dc:Bounds height="50.0" width="100.0" x="540.0" y="207.0"/>
        <di:BPMNLabel id="_cVJtsDOCEeSknpIVFCxNIQ" labelStyle="_cVJGoDOCEeSknpIVFCxNIQ">
          <dc:Bounds height="14.0" width="44.0" x="568.0" y="225.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_To9aKTOCEeSknpIVFCxNIQ" bpmnElement="_To9ZwDOCEeSknpIVFCxNIQ" color:background-color="#c2d7eb">
        <dc:Bounds height="50.0" width="100.0" x="540.0" y="292.0"/>
        <di:BPMNLabel id="_cVJtsTOCEeSknpIVFCxNIQ" labelStyle="_cVJGoDOCEeSknpIVFCxNIQ">
          <dc:Bounds height="14.0" width="44.0" x="568.0" y="310.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_To9aLDOCEeSknpIVFCxNIQ" bpmnElement="_To9ZyjOCEeSknpIVFCxNIQ" color:background-color="#b98b00">
        <dc:Bounds height="43.0" width="43.0" x="459.0" y="295.0"/>
        <di:BPMNLabel id="_cVJtsjOCEeSknpIVFCxNIQ" labelStyle="_cVJGoDOCEeSknpIVFCxNIQ">
          <dc:Bounds height="28.0" width="68.0" x="391.0" y="338.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_To9aMDOCEeSknpIVFCxNIQ" bpmnElement="_To9ZzzOCEeSknpIVFCxNIQ" color:background-color="#c2d7eb">
        <dc:Bounds height="50.0" width="100.0" x="540.0" y="387.0"/>
        <di:BPMNLabel id="_cVJtszOCEeSknpIVFCxNIQ" labelStyle="_cVJGoDOCEeSknpIVFCxNIQ">
          <dc:Bounds height="14.0" width="44.0" x="568.0" y="405.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_To9aMzOCEeSknpIVFCxNIQ" bpmnElement="_To9Z2TOCEeSknpIVFCxNIQ" color:background-color="#b98b00">
        <dc:Bounds height="43.0" width="43.0" x="681.0" y="350.0"/>
        <di:BPMNLabel id="_cVJttDOCEeSknpIVFCxNIQ" labelStyle="_cVJGoDOCEeSknpIVFCxNIQ">
          <dc:Bounds height="28.0" width="79.0" x="724.0" y="393.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNEdge id="_To-AuTOCEeSknpIVFCxNIQ" bpmnElement="_To9Z5DOCEeSknpIVFCxNIQ">
        <di_1:waypoint xsi:type="dc:Point" x="228.0" y="316.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="272.0" y="316.0"/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_To-AvjOCEeSknpIVFCxNIQ" bpmnElement="_To9Z5zOCEeSknpIVFCxNIQ">
        <di_1:waypoint xsi:type="dc:Point" x="372.0" y="317.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="459.0" y="317.0"/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_To-AwzOCEeSknpIVFCxNIQ" bpmnElement="_To9Z6jOCEeSknpIVFCxNIQ">
        <di_1:waypoint xsi:type="dc:Point" x="480.0" y="295.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="480.0" y="231.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="540.0" y="231.0"/>
        <di:BPMNLabel id="Bpmndi_BPMNLabel_CmaCsH2JEeWQ6qGdY3x14w" labelStyle="_cVFcQTOCEeSknpIVFCxNIQ">
          <dc:Bounds height="15.0" width="51.0" x="485.0" y="236.0"/>
        </di:BPMNLabel>
      </di:BPMNEdge>
      <di:BPMNEdge id="_To-AyDOCEeSknpIVFCxNIQ" bpmnElement="_To9Z7TOCEeSknpIVFCxNIQ">
        <di_1:waypoint xsi:type="dc:Point" x="640.0" y="228.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="850.0" y="228.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="850.0" y="292.0"/>
        <di:BPMNLabel id="Bpmndi_BPMNLabel_I4N4YH4gEeWe1Mf7vUgLJg" labelStyle="_cVFcQTOCEeSknpIVFCxNIQ">
          <dc:Bounds height="15.0" width="63.0" x="645.0" y="238.0"/>
        </di:BPMNLabel>
      </di:BPMNEdge>
      <di:BPMNEdge id="_To-AzjOCEeSknpIVFCxNIQ" bpmnElement="_To9Z8DOCEeSknpIVFCxNIQ">
        <di_1:waypoint xsi:type="dc:Point" x="640.0" y="316.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="702.0" y="316.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="702.0" y="350.0"/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_To-A0zOCEeSknpIVFCxNIQ" bpmnElement="_To9Z8zOCEeSknpIVFCxNIQ">
        <di_1:waypoint xsi:type="dc:Point" x="640.0" y="418.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="702.0" y="418.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="702.0" y="393.0"/>
        <di:BPMNLabel id="Bpmndi_BPMNLabel_HOBncH4gEeWe1Mf7vUgLJg" labelStyle="_cVFcQTOCEeSknpIVFCxNIQ">
          <dc:Bounds height="15.0" width="63.0" x="645.0" y="423.0"/>
        </di:BPMNLabel>
      </di:BPMNEdge>
      <di:BPMNEdge id="_To-A2TOCEeSknpIVFCxNIQ" bpmnElement="_To9Z9jOCEeSknpIVFCxNIQ">
        <di_1:waypoint xsi:type="dc:Point" x="724.0" y="371.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="850.0" y="371.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="850.0" y="322.0"/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_To-A3jOCEeSknpIVFCxNIQ" bpmnElement="_To9Z-TOCEeSknpIVFCxNIQ">
        <di_1:waypoint xsi:type="dc:Point" x="502.0" y="317.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="540.0" y="317.0"/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_To-A4zOCEeSknpIVFCxNIQ" bpmnElement="_To9Z_DOCEeSknpIVFCxNIQ">
        <di_1:waypoint xsi:type="dc:Point" x="480.0" y="338.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="480.0" y="406.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="540.0" y="406.0"/>
      </di:BPMNEdge>
      <di:BPMNEdge id="Bpmndi_BPMNEdge_edepQgbbEealeL5I4Yl3Dw" bpmnElement="Bpmn_SequenceFlow_edepQQbbEealeL5I4Yl3Dw">
        <di_1:waypoint xsi:type="dc:Point" x="590.0" y="257.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="590.0" y="292.0"/>
        <di:BPMNLabel id="Bpmndi_BPMNLabel_edepQwbbEealeL5I4Yl3Dw" labelStyle="Bpmndi_BPMNLabelStyle_edhFgAbbEealeL5I4Yl3Dw"/>
      </di:BPMNEdge>
      <di:BPMNEdge id="Bpmndi_BPMNEdge_f9nmUgbbEealeL5I4Yl3Dw" bpmnElement="Bpmn_SequenceFlow_f9nmUQbbEealeL5I4Yl3Dw">
        <di_1:waypoint xsi:type="dc:Point" x="590.0" y="387.0"/>
        <di_1:waypoint xsi:type="dc:Point" x="590.0" y="342.0"/>
        <di:BPMNLabel id="Bpmndi_BPMNLabel_f9nmUwbbEealeL5I4Yl3Dw" labelStyle="Bpmndi_BPMNLabelStyle_f9qCkAbbEealeL5I4Yl3Dw"/>
      </di:BPMNEdge>
    </di:BPMNPlane>
    <di:BPMNLabelStyle id="_cVFcQTOCEeSknpIVFCxNIQ">
      <dc:Font name="Segoe UI" size="12.0"/>
    </di:BPMNLabelStyle>
    <di:BPMNLabelStyle id="_cVJGoDOCEeSknpIVFCxNIQ">
      <dc:Font name="Arial" size="11.0"/>
    </di:BPMNLabelStyle>
    <di:BPMNLabelStyle id="Bpmndi_BPMNLabelStyle_qtSqgAbaEealeL5I4Yl3Dw">
      <dc:Font name="Segoe UI" size="12.0"/>
    </di:BPMNLabelStyle>
    <di:BPMNLabelStyle id="Bpmndi_BPMNLabelStyle_yNGD8AbaEealeL5I4Yl3Dw">
      <dc:Font name="Segoe UI" size="12.0"/>
    </di:BPMNLabelStyle>
    <di:BPMNLabelStyle id="Bpmndi_BPMNLabelStyle_6jUIAAbaEealeL5I4Yl3Dw">
      <dc:Font name="Segoe UI" size="12.0"/>
    </di:BPMNLabelStyle>
    <di:BPMNLabelStyle id="Bpmndi_BPMNLabelStyle_Tu18UAbbEealeL5I4Yl3Dw">
      <dc:Font name="Segoe UI" size="12.0"/>
    </di:BPMNLabelStyle>
    <di:BPMNLabelStyle id="Bpmndi_BPMNLabelStyle_Y8qFAAbbEealeL5I4Yl3Dw">
      <dc:Font name="Segoe UI" size="12.0"/>
    </di:BPMNLabelStyle>
    <di:BPMNLabelStyle id="Bpmndi_BPMNLabelStyle_Rj7j8AbbEealeL5I4Yl3Dw">
      <dc:Font name="Segoe UI" size="12.0"/>
    </di:BPMNLabelStyle>
    <di:BPMNLabelStyle id="Bpmndi_BPMNLabelStyle_edhFgAbbEealeL5I4Yl3Dw">
      <dc:Font name="Segoe UI" size="12.0"/>
    </di:BPMNLabelStyle>
    <di:BPMNLabelStyle id="Bpmndi_BPMNLabelStyle_f9qCkAbbEealeL5I4Yl3Dw">
      <dc:Font name="Segoe UI" size="12.0"/>
    </di:BPMNLabelStyle>
  </di:BPMNDiagram>
</model:definitions>
`;

    const json = new BpmnXmlParser().parse(a21Processe);

    expect(json).toMatchObject({
      definitions: {
        process: {
          id: '_To9ZoTOCEeSknpIVFCxNIQ',
          name: 'A.2.1',
          processType: 'None',
          extensionElements: {
            graphStyle: {
              basic: anything(),
              root: {
                gridVisible: true,
                snapToGrid: true,
                rulerVisible: true,
                snapToGuide: true,
                rulerUnit: 'Pixels',
                Grid: { spacing: anything(), color: anything() },
                VerticalRuler: '',
                HorizontalRuler: '',
              },
            },
          },
          ioSpecification: {
            id: '_cVGqYDOCEeSknpIVFCxNIQ',
            inputSet: { id: '_cVHRcDOCEeSknpIVFCxNIQ' },
            outputSet: { id: '_cVH4gDOCEeSknpIVFCxNIQ' },
          },
          startEvent: {
            id: '_To9ZojOCEeSknpIVFCxNIQ',
            name: 'Start Event',
            isInterrupting: true,
            extensionElements: {
              graphStyle: {
                basic: {
                  background: '109,183,0',
                  foreground: '0,0,0',
                  autoResize: false,
                  borderColor: '100,100,100',
                  collapsed: false,
                },
              },
            },
            outgoing: '_To9Z5DOCEeSknpIVFCxNIQ',
          },
          endEvent: {
            id: '_To9ZsTOCEeSknpIVFCxNIQ',
            name: 'End Event',
            extensionElements: anything(),
            incoming: ['_To9Z7TOCEeSknpIVFCxNIQ', '_To9Z9jOCEeSknpIVFCxNIQ'],
          },
          task: arrayContaining([anything()]),
          exclusiveGateway: arrayContaining([anything()]),
          sequenceFlow: arrayContaining([anything()]),
        },
        BPMNDiagram: {
          BPMNPlane: {
            BPMNShape: arrayContaining([anything()]),
            BPMNEdge: arrayContaining([{ id: '_To-AzjOCEeSknpIVFCxNIQ', bpmnElement: '_To9Z8DOCEeSknpIVFCxNIQ', waypoint: [anything(), anything(), anything()] }]),
          },
          BPMNLabelStyle: arrayContaining([{ id: '_cVFcQTOCEeSknpIVFCxNIQ', Font: { name: 'Segoe UI', size: 12 } }]),
        },
      },
    });

    const process: TProcess = json.definitions.process as TProcess;
    expect(process.task).toHaveLength(4);
    expect(process.exclusiveGateway).toHaveLength(2);
    expect(process.sequenceFlow).toHaveLength(11);

    const bpmnDiagram: BPMNDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    expect(bpmnDiagram.BPMNPlane.BPMNShape).toHaveLength(8);
    expect(bpmnDiagram.BPMNPlane.BPMNEdge).toHaveLength(11);
    expect(bpmnDiagram.BPMNLabelStyle).toHaveLength(10);
  });

  it('bpmn with number attribute, ensure xml number are json number', () => {
    const a10Process = `<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
<semantic:definitions id="_1373649849716" name="A.1.0" targetNamespace="http://www.trisotech.com/definitions/_1373649849716" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bpsim="http://www.bpsim.org/schemas/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <semantic:process isExecutable="false" id="WFP-6-">
        <semantic:startEvent name="Start Event" id="_93c466ab-b271-4376-a427-f4c353d55ce8">
            <semantic:outgoing>_e16564d7-0c4c-413e-95f6-f668a3f851fb</semantic:outgoing>
        </semantic:startEvent>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 1" id="_ec59e164-68b4-4f94-98de-ffb1c58a84af">
            <semantic:incoming>_e16564d7-0c4c-413e-95f6-f668a3f851fb</semantic:incoming>
            <semantic:outgoing>_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 2" id="_820c21c0-45f3-473b-813f-06381cc637cd">
            <semantic:incoming>_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599</semantic:incoming>
            <semantic:outgoing>_2aa47410-1b0e-4f8b-ad54-d6f798080cb4</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 3" id="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c">
            <semantic:incoming>_2aa47410-1b0e-4f8b-ad54-d6f798080cb4</semantic:incoming>
            <semantic:outgoing>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:outgoing>
        </semantic:task>
        <semantic:endEvent name="End Event" id="_a47df184-085b-49f7-bb82-031c84625821">
            <semantic:incoming>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:incoming>
        </semantic:endEvent>
        <semantic:sequenceFlow sourceRef="_93c466ab-b271-4376-a427-f4c353d55ce8" targetRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" name="" id="_e16564d7-0c4c-413e-95f6-f668a3f851fb"/>
        <semantic:sequenceFlow sourceRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" targetRef="_820c21c0-45f3-473b-813f-06381cc637cd" name="" id="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599"/>
        <semantic:sequenceFlow sourceRef="_820c21c0-45f3-473b-813f-06381cc637cd" targetRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" name="" id="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4"/>
        <semantic:sequenceFlow sourceRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" targetRef="_a47df184-085b-49f7-bb82-031c84625821" name="" id="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80"/>
    </semantic:process>
    <bpmndi:BPMNDiagram documentation="" id="Trisotech_Visio-_6" name="A.1.0" resolution="96.00000267028808">
        <bpmndi:BPMNPlane bpmnElement="WFP-6-">
            <bpmndi:BPMNShape bpmnElement="_93c466ab-b271-4376-a427-f4c353d55ce8" id="S1373649849857__93c466ab-b271-4376-a427-f4c353d55ce8">
                <dc:Bounds height="30.0" width="30.0" x="186.0" y="336.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="153.67766754457273" y="371.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_ec59e164-68b4-4f94-98de-ffb1c58a84af" id="S1373649849859__ec59e164-68b4-4f94-98de-ffb1c58a84af">
                <dc:Bounds height="68.0" width="83.0" x="258.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="263.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_820c21c0-45f3-473b-813f-06381cc637cd" id="S1373649849860__820c21c0-45f3-473b-813f-06381cc637cd">
                <dc:Bounds height="68.0" width="83.0" x="390.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="395.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" id="S1373649849861__e70a6fcb-913c-4a7b-a65d-e83adc73d69c">
                <dc:Bounds height="68.0" width="83.0" x="522.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="527.3333333333334" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_a47df184-085b-49f7-bb82-031c84625821" id="S1373649849862__a47df184-085b-49f7-bb82-031c84625821">
                <dc:Bounds height="32.0" width="32.0" x="648.0" y="335.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="616.5963254593177" y="372.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge bpmnElement="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599" id="E1373649849864__d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599">
                <di:waypoint x="342.0" y="351.0"/>
                <di:waypoint x="390.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_e16564d7-0c4c-413e-95f6-f668a3f851fb" id="E1373649849865__e16564d7-0c4c-413e-95f6-f668a3f851fb">
                <di:waypoint x="216.0" y="351.0"/>
                <di:waypoint x="234.0" y="351.0"/>
                <di:waypoint x="258.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4" id="E1373649849866__2aa47410-1b0e-4f8b-ad54-d6f798080cb4">
                <di:waypoint x="474.0" y="351.0"/>
                <di:waypoint x="522.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80" id="E1373649849867__8e8fe679-eb3b-4c43-a4d6-891e7087ff80">
                <di:waypoint x="606.0" y="351.0"/>
                <di:waypoint x="624.0" y="351.0"/>
                <di:waypoint x="648.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
        <bpmndi:BPMNLabelStyle id="LS1373649849858">
            <dc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Arial" size="11.0"/>
        </bpmndi:BPMNLabelStyle>
    </bpmndi:BPMNDiagram>
</semantic:definitions>
`;

    const json = new BpmnXmlParser().parse(a10Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          task: [{ startQuantity: 1 }, expect.anything(), expect.anything()],
        },
        BPMNDiagram: {
          BPMNPlane: { BPMNShape: arrayContaining([objectContaining({ Bounds: { x: 186.0, y: 336.0, width: 30.0, height: 30.0 } })]) },
          BPMNLabelStyle: { Font: { size: 11.0 } },
        },
      },
    });
  });

  it('bpmn with boolean attribute, ensure xml boolean are json boolean', () => {
    const a10Process = `<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
<semantic:definitions id="_1373649849716" name="A.1.0" targetNamespace="http://www.trisotech.com/definitions/_1373649849716" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bpsim="http://www.bpsim.org/schemas/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <semantic:process isExecutable="false" id="WFP-6-">
        <semantic:startEvent name="Start Event" id="_93c466ab-b271-4376-a427-f4c353d55ce8">
            <semantic:outgoing>_e16564d7-0c4c-413e-95f6-f668a3f851fb</semantic:outgoing>
        </semantic:startEvent>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 1" id="_ec59e164-68b4-4f94-98de-ffb1c58a84af">
            <semantic:incoming>_e16564d7-0c4c-413e-95f6-f668a3f851fb</semantic:incoming>
            <semantic:outgoing>_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 2" id="_820c21c0-45f3-473b-813f-06381cc637cd">
            <semantic:incoming>_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599</semantic:incoming>
            <semantic:outgoing>_2aa47410-1b0e-4f8b-ad54-d6f798080cb4</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 3" id="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c">
            <semantic:incoming>_2aa47410-1b0e-4f8b-ad54-d6f798080cb4</semantic:incoming>
            <semantic:outgoing>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:outgoing>
        </semantic:task>
        <semantic:endEvent name="End Event" id="_a47df184-085b-49f7-bb82-031c84625821">
            <semantic:incoming>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:incoming>
        </semantic:endEvent>
        <semantic:sequenceFlow sourceRef="_93c466ab-b271-4376-a427-f4c353d55ce8" targetRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" name="" id="_e16564d7-0c4c-413e-95f6-f668a3f851fb"/>
        <semantic:sequenceFlow sourceRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" targetRef="_820c21c0-45f3-473b-813f-06381cc637cd" name="" id="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599"/>
        <semantic:sequenceFlow sourceRef="_820c21c0-45f3-473b-813f-06381cc637cd" targetRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" name="" id="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4"/>
        <semantic:sequenceFlow sourceRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" targetRef="_a47df184-085b-49f7-bb82-031c84625821" name="" id="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80"/>
    </semantic:process>
    <bpmndi:BPMNDiagram documentation="" id="Trisotech_Visio-_6" name="A.1.0" resolution="96.00000267028808">
        <bpmndi:BPMNPlane bpmnElement="WFP-6-">
            <bpmndi:BPMNShape bpmnElement="_93c466ab-b271-4376-a427-f4c353d55ce8" id="S1373649849857__93c466ab-b271-4376-a427-f4c353d55ce8">
                <dc:Bounds height="30.0" width="30.0" x="186.0" y="336.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="153.67766754457273" y="371.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_ec59e164-68b4-4f94-98de-ffb1c58a84af" id="S1373649849859__ec59e164-68b4-4f94-98de-ffb1c58a84af">
                <dc:Bounds height="68.0" width="83.0" x="258.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="263.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_820c21c0-45f3-473b-813f-06381cc637cd" id="S1373649849860__820c21c0-45f3-473b-813f-06381cc637cd">
                <dc:Bounds height="68.0" width="83.0" x="390.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="395.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" id="S1373649849861__e70a6fcb-913c-4a7b-a65d-e83adc73d69c">
                <dc:Bounds height="68.0" width="83.0" x="522.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="527.3333333333334" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_a47df184-085b-49f7-bb82-031c84625821" id="S1373649849862__a47df184-085b-49f7-bb82-031c84625821">
                <dc:Bounds height="32.0" width="32.0" x="648.0" y="335.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="616.5963254593177" y="372.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge bpmnElement="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599" id="E1373649849864__d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599">
                <di:waypoint x="342.0" y="351.0"/>
                <di:waypoint x="390.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_e16564d7-0c4c-413e-95f6-f668a3f851fb" id="E1373649849865__e16564d7-0c4c-413e-95f6-f668a3f851fb">
                <di:waypoint x="216.0" y="351.0"/>
                <di:waypoint x="234.0" y="351.0"/>
                <di:waypoint x="258.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4" id="E1373649849866__2aa47410-1b0e-4f8b-ad54-d6f798080cb4">
                <di:waypoint x="474.0" y="351.0"/>
                <di:waypoint x="522.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80" id="E1373649849867__8e8fe679-eb3b-4c43-a4d6-891e7087ff80">
                <di:waypoint x="606.0" y="351.0"/>
                <di:waypoint x="624.0" y="351.0"/>
                <di:waypoint x="648.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
        <bpmndi:BPMNLabelStyle id="LS1373649849858">
            <dc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Arial" size="11.0"/>
        </bpmndi:BPMNLabelStyle>
    </bpmndi:BPMNDiagram>
</semantic:definitions>
`;

    const json = new BpmnXmlParser().parse(a10Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          isExecutable: false,
        },
        BPMNDiagram: { BPMNLabelStyle: { Font: { isBold: false } } },
      },
    });
  });

  it('bpmn with attribute with french special characters, ensure special characters are present', () => {
    const a10Process = `<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
<semantic:definitions id="_1373649849716" name="A.1.0" targetNamespace="http://www.trisotech.com/definitions/_1373649849716" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bpsim="http://www.bpsim.org/schemas/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <semantic:process isExecutable="false" id="WFP-6-">
        <semantic:startEvent name="événement de début" id="_93c466ab-b271-4376-a427-f4c353d55ce8">
            <semantic:outgoing>_e16564d7-0c4c-413e-95f6-f668a3f851fb</semantic:outgoing>
        </semantic:startEvent>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 1" id="à_ec59e164-68b4-4f94-98de-ffb1c58a84af">
            <semantic:incoming>_e16564d7-0c4c-413e-95f6-f668a3f851fb</semantic:incoming>
            <semantic:outgoing>_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 2" id="_820c21c0-45f3-473b-813f-06381cc637cd">
            <semantic:incoming>_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599</semantic:incoming>
            <semantic:outgoing>_2aa47410-1b0e-4f8b-ad54-d6f798080cb4</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 3" id="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c">
            <semantic:incoming>_2aa47410-1b0e-4f8b-ad54-d6f798080cb4</semantic:incoming>
            <semantic:outgoing>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:outgoing>
        </semantic:task>
        <semantic:endEvent name="End Event" id="_a47df184-085b-49f7-bb82-031c84625821">
            <semantic:incoming>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:incoming>
        </semantic:endEvent>
        <semantic:sequenceFlow sourceRef="_93c466ab-b271-4376-a427-f4c353d55ce8" targetRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" name="" id="_e16564d7-0c4c-413e-95f6-f668a3f851fb"/>
        <semantic:sequenceFlow sourceRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" targetRef="_820c21c0-45f3-473b-813f-06381cc637cd" name="" id="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599"/>
        <semantic:sequenceFlow sourceRef="_820c21c0-45f3-473b-813f-06381cc637cd" targetRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" name="" id="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4"/>
        <semantic:sequenceFlow sourceRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" targetRef="_a47df184-085b-49f7-bb82-031c84625821" name="" id="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80"/>
    </semantic:process>
    <bpmndi:BPMNDiagram documentation="" id="Trisotech_Visio-_6" name="A.1.0" resolution="96.00000267028808">
        <bpmndi:BPMNPlane bpmnElement="WFP-6-">
            <bpmndi:BPMNShape bpmnElement="_93c466ab-b271-4376-a427-f4c353d55ce8" id="S1373649849857__93c466ab-b271-4376-a427-f4c353d55ce8">
                <dc:Bounds height="30.0" width="30.0" x="186.0" y="336.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="153.67766754457273" y="371.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_ec59e164-68b4-4f94-98de-ffb1c58a84af" id="S1373649849859__ec59e164-68b4-4f94-98de-ffb1c58a84af">
                <dc:Bounds height="68.0" width="83.0" x="258.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="263.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_820c21c0-45f3-473b-813f-06381cc637cd" id="S1373649849860__820c21c0-45f3-473b-813f-06381cc637cd">
                <dc:Bounds height="68.0" width="83.0" x="390.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="395.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" id="S1373649849861__e70a6fcb-913c-4a7b-a65d-e83adc73d69c">
                <dc:Bounds height="68.0" width="83.0" x="522.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="527.3333333333334" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_a47df184-085b-49f7-bb82-031c84625821" id="S1373649849862__a47df184-085b-49f7-bb82-031c84625821">
                <dc:Bounds height="32.0" width="32.0" x="648.0" y="335.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="616.5963254593177" y="372.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge bpmnElement="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599" id="E1373649849864__d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599">
                <di:waypoint x="342.0" y="351.0"/>
                <di:waypoint x="390.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_e16564d7-0c4c-413e-95f6-f668a3f851fb" id="E1373649849865__e16564d7-0c4c-413e-95f6-f668a3f851fb">
                <di:waypoint x="216.0" y="351.0"/>
                <di:waypoint x="234.0" y="351.0"/>
                <di:waypoint x="258.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4" id="E1373649849866__2aa47410-1b0e-4f8b-ad54-d6f798080cb4">
                <di:waypoint x="474.0" y="351.0"/>
                <di:waypoint x="522.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80" id="E1373649849867__8e8fe679-eb3b-4c43-a4d6-891e7087ff80">
                <di:waypoint x="606.0" y="351.0"/>
                <di:waypoint x="624.0" y="351.0"/>
                <di:waypoint x="648.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
        <bpmndi:BPMNLabelStyle id="LS1373649849858">
            <dc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Arial" size="11.0"/>
        </bpmndi:BPMNLabelStyle>
    </bpmndi:BPMNDiagram>
</semantic:definitions>
`;

    const json = new BpmnXmlParser().parse(a10Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          startEvent: { name: 'événement de début' },
          task: [{ id: 'à_ec59e164-68b4-4f94-98de-ffb1c58a84af' }, expect.anything(), expect.anything()],
        },
        BPMNDiagram: expect.anything(),
      },
    });
  });

  it('bpmn with attribute with japan special characters, ensure special characters are present', () => {
    const a10Process = `<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
<semantic:definitions id="_1373649849716" name="A.1.0" targetNamespace="http://www.trisotech.com/definitions/_1373649849716" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bpsim="http://www.bpsim.org/schemas/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <semantic:process isExecutable="false" id="WFP-6-">
        <semantic:startEvent name="開始イベント" id="_93c466ab-b271-4376-a427-f4c353d55ce8">
            <semantic:outgoing>_e16564d7-0c4c-413e-95f6-f668a3f851fb</semantic:outgoing>
        </semantic:startEvent>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 1" id="識別子_ec59e164-68b4-4f94-98de-ffb1c58a84af">
            <semantic:incoming>_e16564d7-0c4c-413e-95f6-f668a3f851fb</semantic:incoming>
            <semantic:outgoing>_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 2" id="_820c21c0-45f3-473b-813f-06381cc637cd">
            <semantic:incoming>_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599</semantic:incoming>
            <semantic:outgoing>_2aa47410-1b0e-4f8b-ad54-d6f798080cb4</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 3" id="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c">
            <semantic:incoming>_2aa47410-1b0e-4f8b-ad54-d6f798080cb4</semantic:incoming>
            <semantic:outgoing>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:outgoing>
        </semantic:task>
        <semantic:endEvent name="End Event" id="_a47df184-085b-49f7-bb82-031c84625821">
            <semantic:incoming>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:incoming>
        </semantic:endEvent>
        <semantic:sequenceFlow sourceRef="_93c466ab-b271-4376-a427-f4c353d55ce8" targetRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" name="" id="_e16564d7-0c4c-413e-95f6-f668a3f851fb"/>
        <semantic:sequenceFlow sourceRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" targetRef="_820c21c0-45f3-473b-813f-06381cc637cd" name="" id="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599"/>
        <semantic:sequenceFlow sourceRef="_820c21c0-45f3-473b-813f-06381cc637cd" targetRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" name="" id="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4"/>
        <semantic:sequenceFlow sourceRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" targetRef="_a47df184-085b-49f7-bb82-031c84625821" name="" id="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80"/>
    </semantic:process>
    <bpmndi:BPMNDiagram documentation="" id="Trisotech_Visio-_6" name="A.1.0" resolution="96.00000267028808">
        <bpmndi:BPMNPlane bpmnElement="WFP-6-">
            <bpmndi:BPMNShape bpmnElement="_93c466ab-b271-4376-a427-f4c353d55ce8" id="S1373649849857__93c466ab-b271-4376-a427-f4c353d55ce8">
                <dc:Bounds height="30.0" width="30.0" x="186.0" y="336.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="153.67766754457273" y="371.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_ec59e164-68b4-4f94-98de-ffb1c58a84af" id="S1373649849859__ec59e164-68b4-4f94-98de-ffb1c58a84af">
                <dc:Bounds height="68.0" width="83.0" x="258.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="263.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_820c21c0-45f3-473b-813f-06381cc637cd" id="S1373649849860__820c21c0-45f3-473b-813f-06381cc637cd">
                <dc:Bounds height="68.0" width="83.0" x="390.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="395.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" id="S1373649849861__e70a6fcb-913c-4a7b-a65d-e83adc73d69c">
                <dc:Bounds height="68.0" width="83.0" x="522.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="527.3333333333334" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_a47df184-085b-49f7-bb82-031c84625821" id="S1373649849862__a47df184-085b-49f7-bb82-031c84625821">
                <dc:Bounds height="32.0" width="32.0" x="648.0" y="335.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="616.5963254593177" y="372.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge bpmnElement="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599" id="E1373649849864__d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599">
                <di:waypoint x="342.0" y="351.0"/>
                <di:waypoint x="390.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_e16564d7-0c4c-413e-95f6-f668a3f851fb" id="E1373649849865__e16564d7-0c4c-413e-95f6-f668a3f851fb">
                <di:waypoint x="216.0" y="351.0"/>
                <di:waypoint x="234.0" y="351.0"/>
                <di:waypoint x="258.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4" id="E1373649849866__2aa47410-1b0e-4f8b-ad54-d6f798080cb4">
                <di:waypoint x="474.0" y="351.0"/>
                <di:waypoint x="522.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80" id="E1373649849867__8e8fe679-eb3b-4c43-a4d6-891e7087ff80">
                <di:waypoint x="606.0" y="351.0"/>
                <di:waypoint x="624.0" y="351.0"/>
                <di:waypoint x="648.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
        <bpmndi:BPMNLabelStyle id="LS1373649849858">
            <dc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Arial" size="11.0"/>
        </bpmndi:BPMNLabelStyle>
    </bpmndi:BPMNDiagram>
</semantic:definitions>
`;

    const json = new BpmnXmlParser().parse(a10Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          startEvent: { name: '開始イベント' },
          task: [{ id: '識別子_ec59e164-68b4-4f94-98de-ffb1c58a84af' }, expect.anything(), expect.anything()],
        },
        BPMNDiagram: expect.anything(),
      },
    });
  });

  it('bpmn with attribute with html special characters, ensure special characters are present', () => {
    const a10Process = `<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
<semantic:definitions id="_1373649849716" name="A.1.0" targetNamespace="http://www.trisotech.com/definitions/_1373649849716" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bpsim="http://www.bpsim.org/schemas/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <semantic:process isExecutable="false" id="WFP-6-">
        <semantic:startEvent name="Start Event &#10;(Main) with &unknown; entity" id="_93c466ab-b271-4376-a427-f4c353d55ce8">
            <semantic:outgoing>_e16564d7-0c4c-413e-95f6-f668a3f851fb</semantic:outgoing>
        </semantic:startEvent>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 1" id="_ec59e164-68b4-4f94-98de-ffb1c58a84af &#9824;">
            <semantic:incoming>_e16564d7-0c4c-413e-95f6-f668a3f851fb</semantic:incoming>
            <semantic:outgoing>_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 2" id="_820c21c0-45f3-473b-813f-06381cc637cd">
            <semantic:incoming>_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599</semantic:incoming>
            <semantic:outgoing>_2aa47410-1b0e-4f8b-ad54-d6f798080cb4</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 3" id="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c">
            <semantic:incoming>_2aa47410-1b0e-4f8b-ad54-d6f798080cb4</semantic:incoming>
            <semantic:outgoing>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:outgoing>
        </semantic:task>
        <semantic:endEvent name="End Event" id="_a47df184-085b-49f7-bb82-031c84625821">
            <semantic:incoming>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:incoming>
        </semantic:endEvent>
        <semantic:sequenceFlow sourceRef="_93c466ab-b271-4376-a427-f4c353d55ce8" targetRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" name="" id="_e16564d7-0c4c-413e-95f6-f668a3f851fb"/>
        <semantic:sequenceFlow sourceRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" targetRef="_820c21c0-45f3-473b-813f-06381cc637cd" name="" id="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599"/>
        <semantic:sequenceFlow sourceRef="_820c21c0-45f3-473b-813f-06381cc637cd" targetRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" name="" id="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4"/>
        <semantic:sequenceFlow sourceRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" targetRef="_a47df184-085b-49f7-bb82-031c84625821" name="" id="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80"/>
    </semantic:process>
    <bpmndi:BPMNDiagram documentation="" id="Trisotech_Visio-_6" name="A.1.0" resolution="96.00000267028808">
        <bpmndi:BPMNPlane bpmnElement="WFP-6-">
            <bpmndi:BPMNShape bpmnElement="_93c466ab-b271-4376-a427-f4c353d55ce8" id="S1373649849857__93c466ab-b271-4376-a427-f4c353d55ce8">
                <dc:Bounds height="30.0" width="30.0" x="186.0" y="336.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="153.67766754457273" y="371.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_ec59e164-68b4-4f94-98de-ffb1c58a84af" id="S1373649849859__ec59e164-68b4-4f94-98de-ffb1c58a84af">
                <dc:Bounds height="68.0" width="83.0" x="258.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="263.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_820c21c0-45f3-473b-813f-06381cc637cd" id="S1373649849860__820c21c0-45f3-473b-813f-06381cc637cd">
                <dc:Bounds height="68.0" width="83.0" x="390.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="395.3333333333333" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" id="S1373649849861__e70a6fcb-913c-4a7b-a65d-e83adc73d69c">
                <dc:Bounds height="68.0" width="83.0" x="522.0" y="317.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="527.3333333333334" y="344.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_a47df184-085b-49f7-bb82-031c84625821" id="S1373649849862__a47df184-085b-49f7-bb82-031c84625821">
                <dc:Bounds height="32.0" width="32.0" x="648.0" y="335.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649849858">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="616.5963254593177" y="372.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge bpmnElement="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599" id="E1373649849864__d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599">
                <di:waypoint x="342.0" y="351.0"/>
                <di:waypoint x="390.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_e16564d7-0c4c-413e-95f6-f668a3f851fb" id="E1373649849865__e16564d7-0c4c-413e-95f6-f668a3f851fb">
                <di:waypoint x="216.0" y="351.0"/>
                <di:waypoint x="234.0" y="351.0"/>
                <di:waypoint x="258.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4" id="E1373649849866__2aa47410-1b0e-4f8b-ad54-d6f798080cb4">
                <di:waypoint x="474.0" y="351.0"/>
                <di:waypoint x="522.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80" id="E1373649849867__8e8fe679-eb3b-4c43-a4d6-891e7087ff80">
                <di:waypoint x="606.0" y="351.0"/>
                <di:waypoint x="624.0" y="351.0"/>
                <di:waypoint x="648.0" y="351.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
        <bpmndi:BPMNLabelStyle id="LS1373649849858">
            <dc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Arial" size="11.0"/>
        </bpmndi:BPMNLabelStyle>
    </bpmndi:BPMNDiagram>
</semantic:definitions>
`;

    const json = new BpmnXmlParser().parse(a10Process);

    expect(json).toMatchObject({
      definitions: {
        process: {
          startEvent: { name: 'Start Event \n(Main) with &unknown; entity' },
          task: [{ id: '_ec59e164-68b4-4f94-98de-ffb1c58a84af ♠' }, expect.anything(), expect.anything()],
        },
        BPMNDiagram: expect.anything(),
      },
    });
  });
});
