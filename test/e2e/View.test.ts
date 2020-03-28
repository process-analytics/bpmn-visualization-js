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
import Graph from '../../src/component/graph/Graph';
import { ShapeBpmnElementKind } from '../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { mxgraph } from 'ts-mxgraph';
import { MxGraphFactoryService } from '../../src/service/MxGraphFactoryService';

function expectGeometry(cell: mxgraph.mxCell, geometry: mxgraph.mxGeometry): void {
  const cellGeometry = cell.getGeometry();
  expect(cellGeometry.x).toEqual(geometry.x);
  expect(cellGeometry.y).toEqual(geometry.y);
  expect(cellGeometry.width).toEqual(geometry.width);
  expect(cellGeometry.height).toEqual(geometry.height);
}

const mxGeometry: typeof mxgraph.mxGeometry = MxGraphFactoryService.getMxGraphProperty('mxGeometry');

describe('BPMN Visu JS', () => {
  // region html string literal
  const xmlContent = `
<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
<semantic:definitions id="_1373649849716" name="A.1.0" targetNamespace="http://www.trisotech.com/definitions/_1373649849716" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bpsim="http://www.bpsim.org/schemas/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <semantic:process isExecutable="false" id="WFP-6-">
        <semantic:startEvent name="Start Event" id="startEvent_1">
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
        <semantic:endEvent name="End Event" id="endEvent_1">
            <semantic:incoming>_8e8fe679-eb3b-4c43-a4d6-891e7087ff80</semantic:incoming>
        </semantic:endEvent>
        <semantic:sequenceFlow sourceRef="startEvent_1" targetRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" name="" id="_e16564d7-0c4c-413e-95f6-f668a3f851fb"/>
        <semantic:sequenceFlow sourceRef="_ec59e164-68b4-4f94-98de-ffb1c58a84af" targetRef="_820c21c0-45f3-473b-813f-06381cc637cd" name="" id="_d77dd5ec-e4e7-420e-bbe7-8ac9cd1df599"/>
        <semantic:sequenceFlow sourceRef="_820c21c0-45f3-473b-813f-06381cc637cd" targetRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" name="" id="_2aa47410-1b0e-4f8b-ad54-d6f798080cb4"/>
        <semantic:sequenceFlow sourceRef="_e70a6fcb-913c-4a7b-a65d-e83adc73d69c" targetRef="endEvent_1" name="" id="_8e8fe679-eb3b-4c43-a4d6-891e7087ff80"/>
    </semantic:process>
    <bpmndi:BPMNDiagram documentation="" id="Trisotech_Visio-_6" name="A.1.0" resolution="96.00000267028808">
        <bpmndi:BPMNPlane bpmnElement="WFP-6-">
            <bpmndi:BPMNShape bpmnElement="startEvent_1" id="S1373649849857_startEvent_1">
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
            <bpmndi:BPMNShape bpmnElement="endEvent_1" id="S1373649849862_endEvent_1">
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

  function expectModelContainsCell(cellId: string, shapeKind: ShapeBpmnElementKind): void {
    const cell = graph.graph.model.getCell(cellId);
    expect(cell).not.toBeNull();
    expect(cell.style).toContain(shapeKind);
    const state = graph.graph.getView().getState(cell);
    const mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');
    expect(state.style[mxConstants.STYLE_SHAPE]).toEqual(shapeKind);
  }

  it('should display visualization', async () => {
    // load BPMN
    graph.load(xmlContent);
    // model is OK
    expect(graph.graph.model.cells.hasOwnProperty('startEvent_1')).toBeTruthy();

    expectModelContainsCell('endEvent_1', ShapeBpmnElementKind.EVENT_END);
    // rendering - not OK - when graph is being initialized the window.document.getElementById('graph') is null
    // await expect(page.waitForSelector('[data-cell-id="startEvent_1"]')).resolves.toBeDefined();
  });

  function expectModelContainsCellWithGeometry(cellId: string, parentId: string, geometry: mxgraph.mxGeometry): void {
    const cell = graph.graph.model.getCell(cellId);
    expect(cell).not.toBeNull();
    expect(cell.parent.id).toEqual(parentId);
    expectGeometry(cell, geometry);
  }

  function getDefaultParentId(): string {
    return graph.graph.getDefaultParent().id;
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
    graph.load(bpmn);

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
    graph.load(bpmn);

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
