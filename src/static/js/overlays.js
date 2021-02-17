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
import { documentReady, FitType, addCssClasses, removeCssClasses, log, startBpmnVisualization, ShapeUtil } from '../../index.es.js';

let lastBpmnIdsWithExtraCssClasses = [];
let lastCssClassName = '';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureControls(bpmnElementsRegistry) {
  const textArea = document.getElementById('elements-result');

  document.getElementById('bpmn-elements-select').onchange = function (ev) {
    const bpmnId = ev.target.value;
    log(`Searching for Bpmn elements of '${bpmnId}' kind`);
    document.getElementById('chosen-id').value = bpmnId;
  };

  document.getElementById('bpmn-kinds-textarea-clean-btn').onclick = function () {
    textArea.value = '';
    removeCssClasses(lastBpmnIdsWithExtraCssClasses, lastCssClassName);
    lastBpmnIdsWithExtraCssClasses = [];
    lastCssClassName = '';
  };

  document.getElementById('attach-badge').onclick = function () {
    const bpmnId = document.getElementById('chosen-id').value;
    const badgeValue = document.getElementById('badge-value').value;

    bpmnElementsRegistry.addBadgeToElement(bpmnId, badgeValue, getCheckedRadioValue('badgeKind'), getCheckedRadioValue('horizontalAlign'), getCheckedRadioValue('verticalAlign'));
    // log(`Searching for Bpmn elements of '${bpmnId}' kind`);
    // document.getElementById('chosen-id').value = bpmnId;
    // const elementsById = bpmnElementsRegistry.getElementsByIds(bpmnId);
    //
    // const textHeader = `Found ${elementsById.length} ${bpmnId}(s)`;
    // log(textHeader);
    // const lines = elementsById.map(elt => `  - ${elt.bpmnSemantic.id}: '${elt.bpmnSemantic.name}'`).join('\n');
    //
    // textArea.value += [textHeader, lines].join('\n') + '\n';
    // textArea.scrollTop = textArea.scrollHeight;
    //
    // // CSS classes update
    // removeCssClasses(lastBpmnIdsWithExtraCssClasses, lastCssClassName);
    // const bpmnIds = elementsById.map(elt => elt.bpmnSemantic.id);
    // lastCssClassName = getCustomCssClassName(bpmnId);
    // addCssClasses(bpmnIds, lastCssClassName);
    // lastBpmnIdsWithExtraCssClasses = bpmnIds;
  };
}

function getCheckedRadioValue(name) {
  const elements = document.getElementsByName(name);
  for (let i = 0, len = elements.length; i < len; ++i) if (elements[i].checked) return elements[i].value;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getCustomCssClassName(bpmnKind) {
  if (ShapeUtil.isActivity(bpmnKind)) {
    return 'detection-activity';
  } else if (bpmnKind.includes('Gateway')) {
    return 'detection-gateway';
  } else if (bpmnKind.includes('Event')) {
    return 'detection-event';
  } else if (bpmnKind.includes('lane')) {
    return 'detection-lane';
  }
  return 'detection';
}
const bpmnFile = `
  <?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
<semantic:definitions id="_1373649919111" name="A.3.0" targetNamespace="http://www.trisotech.com/definitions/_1373649919111" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bpsim="http://www.bpsim.org/schemas/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <semantic:process isExecutable="false" id="WFP-6-">
        <semantic:startEvent name="Start Event" id="_1ac4b759-40e3-4dfb-b0e3-ad1d201d6c3d">
            <semantic:outgoing>_83f6ca65-43f7-496e-a7eb-2a4a2fc28f22</semantic:outgoing>
        </semantic:startEvent>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 1" id="_65f5459f-44ae-436d-a089-a91d6d78075b">
            <semantic:incoming>_83f6ca65-43f7-496e-a7eb-2a4a2fc28f22</semantic:incoming>
            <semantic:outgoing>_68ba9b96-b1e9-4691-bc25-a36bf5731502</semantic:outgoing>
        </semantic:task>
        <semantic:subProcess triggeredByEvent="false" completionQuantity="1" isForCompensation="false" startQuantity="1" name="Collapsed&#10;Sub-Process" id="_1ae31d1b-2559-4f78-a3ec-47986a49db48">
            <semantic:incoming>_68ba9b96-b1e9-4691-bc25-a36bf5731502</semantic:incoming>
            <semantic:outgoing>_250377d0-628d-463f-95f6-1f4ceed9bd8a</semantic:outgoing>
        </semantic:subProcess>
        <semantic:boundaryEvent attachedToRef="_1ae31d1b-2559-4f78-a3ec-47986a49db48" cancelActivity="false" parallelMultiple="false" name="Boundary Intermediate Event Non-Interrupting Message" id="_428dcbf5-8e5e-48e0-9c0c-d93003fa8c82">
            <semantic:outgoing>_fe023d13-58bc-4f08-b60a-ebe4489f4190</semantic:outgoing>
            <semantic:messageEventDefinition/>
        </semantic:boundaryEvent>
        <semantic:boundaryEvent attachedToRef="_1ae31d1b-2559-4f78-a3ec-47986a49db48" cancelActivity="true" parallelMultiple="false" name="Boundary Intermediate Event Interrupting Escalation" id="_178e16eb-4c9e-4ea0-9644-7c5fb2b71825">
            <semantic:outgoing>_7742093f-cd2c-415e-be71-d2514bc559c9</semantic:outgoing>
            <semantic:escalationEventDefinition/>
        </semantic:boundaryEvent>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 4" id="_9fad8da5-a28c-4b6b-bb71-fbd5c65b9681">
            <semantic:incoming>_7742093f-cd2c-415e-be71-d2514bc559c9</semantic:incoming>
            <semantic:outgoing>_c425e783-e839-4990-9a2c-28b7341d9b2e</semantic:outgoing>
        </semantic:task>
        <semantic:endEvent name="End Event 1" id="_ce253897-4300-4b24-b71f-4c9535698c70">
            <semantic:incoming>_719b757a-fc92-46bd-8d10-cca5a5bbf3bf</semantic:incoming>
            <semantic:incoming>_88b9f814-764e-492b-b38d-d5e8dfa68400</semantic:incoming>
        </semantic:endEvent>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 3" id="_72204cd7-709c-4656-9554-3ae29b3844ce">
            <semantic:incoming>_fe023d13-58bc-4f08-b60a-ebe4489f4190</semantic:incoming>
            <semantic:outgoing>_88b9f814-764e-492b-b38d-d5e8dfa68400</semantic:outgoing>
        </semantic:task>
        <semantic:task completionQuantity="1" isForCompensation="false" startQuantity="1" name="Task 2" id="_2d2d0d29-896f-49f9-8109-77a7304309c5">
            <semantic:incoming>_250377d0-628d-463f-95f6-1f4ceed9bd8a</semantic:incoming>
            <semantic:outgoing>_719b757a-fc92-46bd-8d10-cca5a5bbf3bf</semantic:outgoing>
        </semantic:task>
        <semantic:endEvent name="End Event 2" id="_10ce0b26-1b3e-46a2-85a5-62538ed2da13">
            <semantic:incoming>_c425e783-e839-4990-9a2c-28b7341d9b2e</semantic:incoming>
        </semantic:endEvent>
        <semantic:sequenceFlow sourceRef="_1ac4b759-40e3-4dfb-b0e3-ad1d201d6c3d" targetRef="_65f5459f-44ae-436d-a089-a91d6d78075b" name="" id="_83f6ca65-43f7-496e-a7eb-2a4a2fc28f22"/>
        <semantic:sequenceFlow sourceRef="_65f5459f-44ae-436d-a089-a91d6d78075b" targetRef="_1ae31d1b-2559-4f78-a3ec-47986a49db48" name="" id="_68ba9b96-b1e9-4691-bc25-a36bf5731502"/>
        <semantic:sequenceFlow sourceRef="_178e16eb-4c9e-4ea0-9644-7c5fb2b71825" targetRef="_9fad8da5-a28c-4b6b-bb71-fbd5c65b9681" name="" id="_7742093f-cd2c-415e-be71-d2514bc559c9"/>
        <semantic:sequenceFlow sourceRef="_428dcbf5-8e5e-48e0-9c0c-d93003fa8c82" targetRef="_72204cd7-709c-4656-9554-3ae29b3844ce" name="" id="_fe023d13-58bc-4f08-b60a-ebe4489f4190"/>
        <semantic:sequenceFlow sourceRef="_1ae31d1b-2559-4f78-a3ec-47986a49db48" targetRef="_2d2d0d29-896f-49f9-8109-77a7304309c5" name="" id="_250377d0-628d-463f-95f6-1f4ceed9bd8a"/>
        <semantic:sequenceFlow sourceRef="_2d2d0d29-896f-49f9-8109-77a7304309c5" targetRef="_ce253897-4300-4b24-b71f-4c9535698c70" name="" id="_719b757a-fc92-46bd-8d10-cca5a5bbf3bf"/>
        <semantic:sequenceFlow sourceRef="_72204cd7-709c-4656-9554-3ae29b3844ce" targetRef="_ce253897-4300-4b24-b71f-4c9535698c70" name="" id="_88b9f814-764e-492b-b38d-d5e8dfa68400"/>
        <semantic:sequenceFlow sourceRef="_9fad8da5-a28c-4b6b-bb71-fbd5c65b9681" targetRef="_10ce0b26-1b3e-46a2-85a5-62538ed2da13" name="" id="_c425e783-e839-4990-9a2c-28b7341d9b2e"/>
    </semantic:process>
    <bpmndi:BPMNDiagram documentation="" id="Trisotech_Visio-_6" name="A.3.0" resolution="96.00000267028808">
        <bpmndi:BPMNPlane bpmnElement="WFP-6-">
            <bpmndi:BPMNShape bpmnElement="_1ac4b759-40e3-4dfb-b0e3-ad1d201d6c3d" id="S1373649919252__1ac4b759-40e3-4dfb-b0e3-ad1d201d6c3d">
                <dc:Bounds height="30.0" width="30.0" x="72.0" y="295.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649919253">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="39.67766754457273" y="330.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_65f5459f-44ae-436d-a089-a91d6d78075b" id="S1373649919254__65f5459f-44ae-436d-a089-a91d6d78075b">
                <dc:Bounds height="68.0" width="83.0" x="145.0" y="276.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649919253">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="150.33333333333334" y="303.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_1ae31d1b-2559-4f78-a3ec-47986a49db48" isExpanded="false" id="S1373649919255__1ae31d1b-2559-4f78-a3ec-47986a49db48">
                <dc:Bounds height="88.0" width="108.0" x="282.0" y="266.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649919253">
                    <dc:Bounds height="25.604702343750013" width="96.90813648293961" x="287.3333333333333" y="297.1897748123769"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_428dcbf5-8e5e-48e0-9c0c-d93003fa8c82" id="S1373649919256__428dcbf5-8e5e-48e0-9c0c-d93003fa8c82">
                <dc:Bounds height="32.0" width="32.0" x="338.0" y="250.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649919253">
                    <dc:Bounds height="51.204604687499994" width="104.93333333333335" x="252.4591285949397" y="208.34455751275414"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_178e16eb-4c9e-4ea0-9644-7c5fb2b71825" id="S1373649919257__178e16eb-4c9e-4ea0-9644-7c5fb2b71825">
                <dc:Bounds height="32.0" width="32.0" x="347.0" y="338.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649919253">
                    <dc:Bounds height="51.204604687499994" width="104.93333333333335" x="260.10712859493964" y="370.33175751275405"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_9fad8da5-a28c-4b6b-bb71-fbd5c65b9681" id="S1373649919258__9fad8da5-a28c-4b6b-bb71-fbd5c65b9681">
                <dc:Bounds height="68.0" width="83.0" x="409.0" y="398.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649919253">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="414.3333333333333" y="425.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_ce253897-4300-4b24-b71f-4c9535698c70" id="S1373649919259__ce253897-4300-4b24-b71f-4c9535698c70">
                <dc:Bounds height="32.0" width="32.0" x="567.0" y="294.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649919253">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="535.5963254593177" y="331.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_72204cd7-709c-4656-9554-3ae29b3844ce" id="S1373649919260__72204cd7-709c-4656-9554-3ae29b3844ce">
                <dc:Bounds height="68.0" width="83.0" x="414.0" y="158.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649919253">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="419.3333333333333" y="185.58187638256646"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_2d2d0d29-896f-49f9-8109-77a7304309c5" id="S1373649919261__2d2d0d29-896f-49f9-8109-77a7304309c5">
                <dc:Bounds height="68.0" width="83.0" x="426.0" y="276.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649919253">
                    <dc:Bounds height="12.804751171875008" width="72.48293963254594" x="431.3333333333333" y="303.5818763825664"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="_10ce0b26-1b3e-46a2-85a5-62538ed2da13" id="S1373649919262__10ce0b26-1b3e-46a2-85a5-62538ed2da13">
                <dc:Bounds height="32.0" width="32.0" x="525.0" y="416.0"/>
                <bpmndi:BPMNLabel labelStyle="LS1373649919253">
                    <dc:Bounds height="12.804751171875008" width="94.93333333333335" x="493.59632545931754" y="453.3333333333333"/>
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge bpmnElement="_250377d0-628d-463f-95f6-1f4ceed9bd8a" id="E1373649919264__250377d0-628d-463f-95f6-1f4ceed9bd8a">
                <di:waypoint x="390.0" y="310.0"/>
                <di:waypoint x="408.0" y="310.0"/>
                <di:waypoint x="426.0" y="310.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_83f6ca65-43f7-496e-a7eb-2a4a2fc28f22" id="E1373649919265__83f6ca65-43f7-496e-a7eb-2a4a2fc28f22">
                <di:waypoint x="102.0" y="310.0"/>
                <di:waypoint x="145.0" y="310.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_7742093f-cd2c-415e-be71-d2514bc559c9" id="E1373649919266__7742093f-cd2c-415e-be71-d2514bc559c9">
                <di:waypoint x="363.0" y="370.0"/>
                <di:waypoint x="363.0" y="432.0"/>
                <di:waypoint x="409.0" y="432.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_fe023d13-58bc-4f08-b60a-ebe4489f4190" id="E1373649919267__fe023d13-58bc-4f08-b60a-ebe4489f4190">
                <di:waypoint x="354.0" y="250.0"/>
                <di:waypoint x="354.0" y="192.0"/>
                <di:waypoint x="414.0" y="192.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_88b9f814-764e-492b-b38d-d5e8dfa68400" id="E1373649919268__88b9f814-764e-492b-b38d-d5e8dfa68400">
                <di:waypoint x="498.0" y="192.0"/>
                <di:waypoint x="583.0" y="192.0"/>
                <di:waypoint x="583.0" y="294.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_719b757a-fc92-46bd-8d10-cca5a5bbf3bf" id="E1373649919269__719b757a-fc92-46bd-8d10-cca5a5bbf3bf">
                <di:waypoint x="509.0" y="310.0"/>
                <di:waypoint x="527.0" y="310.0"/>
                <di:waypoint x="567.0" y="310.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_c425e783-e839-4990-9a2c-28b7341d9b2e" id="E1373649919270__c425e783-e839-4990-9a2c-28b7341d9b2e">
                <di:waypoint x="492.0" y="432.0"/>
                <di:waypoint x="525.0" y="432.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="_68ba9b96-b1e9-4691-bc25-a36bf5731502" id="E1373649919271__68ba9b96-b1e9-4691-bc25-a36bf5731502">
                <di:waypoint x="228.0" y="310.0"/>
                <di:waypoint x="246.0" y="310.0"/>
                <di:waypoint x="282.0" y="310.0"/>
                <bpmndi:BPMNLabel/>
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
        <bpmndi:BPMNLabelStyle id="LS1373649919253">
            <dc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Arial" size="11.0"/>
        </bpmndi:BPMNLabelStyle>
    </bpmndi:BPMNDiagram>
</semantic:definitions>
`;
documentReady(() => {
  let bpmnVisu = startBpmnVisualization({
    globalOptions: {
      container: 'bpmn-container',
      navigation: {
        enabled: true,
      },
    },
    loadOptions: {
      type: FitType.Vertical,
      margin: 50,
    },
  });
  configureControls(bpmnVisu.bpmnElementsRegistry);
  bpmnVisu.load(bpmnFile);
});
