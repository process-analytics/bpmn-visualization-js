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
import {
  documentReady,
  FitType,
  getElementsByKinds,
  addCssClasses,
  removeCssClasses,
  log,
  startBpmnVisualization,
  updateLoadOptions,
  ShapeUtil,
  addOverlay,
} from '../../index.es.js';

let lastBpmnIdsWithExtraCssClasses = [];
let lastCssClassName = '';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function updateSelectedBPMNElements(textArea, bpmnKind) {
  log(`Searching for Bpmn elements of '${bpmnKind}' kind`);
  const elementsByKinds = getElementsByKinds(bpmnKind);

  // Update text area
  const textHeader = `Found ${elementsByKinds.length} ${bpmnKind}(s)`;
  log(textHeader);
  const lines = elementsByKinds.map(elt => `  - ${elt.bpmnSemantic.id}: '${elt.bpmnSemantic.name}'`).join('\n');

  textArea.value += [textHeader, lines].join('\n') + '\n';
  textArea.scrollTop = textArea.scrollHeight;

  // CSS classes update
  removeCssClasses(lastBpmnIdsWithExtraCssClasses, lastCssClassName);
  const bpmnIds = elementsByKinds.map(elt => elt.bpmnSemantic.id);
  lastCssClassName = getCustomCssClassName(bpmnKind);
  addCssClasses(bpmnIds, lastCssClassName);
  lastBpmnIdsWithExtraCssClasses = bpmnIds;

  // Overlay update
  bpmnIds.forEach(id => {
    addOverlay(id, getOverlay(bpmnKind));
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureControls() {
  const textArea = document.getElementById('elements-result');

  const selectedKindElt = document.getElementById('bpmn-kinds-select');
  selectedKindElt.onchange = event => updateSelectedBPMNElements(textArea, event.target.value);
  document.addEventListener('diagramLoaded', () => updateSelectedBPMNElements(textArea, selectedKindElt.value), false);

  document.getElementById('bpmn-kinds-textarea-clean-btn').onclick = function () {
    textArea.value = '';
    removeCssClasses(lastBpmnIdsWithExtraCssClasses, lastCssClassName);
    lastBpmnIdsWithExtraCssClasses = [];
    lastCssClassName = '';
  };
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
  } else if (bpmnKind.includes('Flow')) {
    return 'detection-flow';
  }
  return 'detection';
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getOverlay(bpmnKind) {
  if (ShapeUtil.isActivity(bpmnKind)) {
    return { position: 'top-left', label: '30' };
  } else if (bpmnKind.includes('Gateway')) {
    return { position: 'top-right', label: '3' };
  } else if (bpmnKind.includes('Event')) {
    return { position: 'bottom-left', label: '15' };
  } else if (bpmnKind.includes('lane')) {
    return { position: 'bottom-right', label: '100' };
  } else if (bpmnKind.includes('Flow')) {
    return { position: 'middle', label: '999999' };
  }
  return { position: 'top-left', label: '40' };
}

documentReady(() => {
  startBpmnVisualization({
    globalOptions: {
      container: 'bpmn-container',
      navigation: {
        enabled: true,
      },
    },
  });
  updateLoadOptions({ type: FitType.Center, margin: 20 });
  configureControls();
});
