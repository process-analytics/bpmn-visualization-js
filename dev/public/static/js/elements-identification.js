/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {
  addCssClasses,
  addOverlays,
  documentReady,
  downloadPng,
  downloadSvg,
  FitType,
  getElementsByKinds,
  log,
  removeAllOverlays,
  removeCssClasses,
  resetStyle,
  ShapeUtil,
  startBpmnVisualization,
  updateLoadOptions,
  updateStyle,
} from '../../../ts/dev-bundle-index';

let lastIdentifiedBpmnIds = [];
let isOverlaysDisplayed = true;

function buildStyle(bpmnKind) {
  const style = { label: {}, hover: {}, arrow: {} };
  switch (bpmnKind) {
    case 'task':
      style.label.color = 'red !important';
      style.fill = 'aquamarine';
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'userTask':
      style.label.color = 'red !important';
      style.fill = 'aquamarine';
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'scriptTask':
      style.label.color = 'red !important';
      style.fill = 'aquamarine';
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'serviceTask':
      style.label.color = 'red !important';
      style.fill = 'aquamarine';
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'startEvent':
      style.label.color = 'red !important';
      style.stroke = 'red';
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'endEvent':
      style.label.color = 'red !important';
      style.stroke = 'red';
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'intermediateCatchEvent':
      style.label.color = 'red !important';
      style.stroke = 'red';
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'intermediateThrowEvent':
      style.label.color = 'red !important';
      style.stroke = 'red';
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'exclusiveGateway':
      style.label.color = 'red !important';
      style.stroke = 'chartreuse';
      style.strokeWidth = 4;
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'inclusiveGateway':
      style.label.color = 'red !important';
      style.stroke = 'chartreuse';
      style.strokeWidth = 4;
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'parallelGateway':
      style.label.color = 'red !important';
      style.stroke = 'chartreuse';
      style.strokeWidth = 4;
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'lane':
      style.label.color = 'white !important';
      style.label.fill = 'palevioletred';
      style.fill = 'palevioletred';
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'pool':
      style.label.color = 'white !important';
      style.label.fill = 'palevioletred';
      style.fill = 'palevioletred';
      style.hover.filter = 'drop-shadow(0 0 1rem rgba(0, 0, 0))';
      break;
    case 'messageFlow':
      style.label.color = 'dodgerblue !important';
      style.stroke = 'dodgerblue';
      style.strokeWidth = '4';

      // Initiating
      style.icon = {
        stroke: 'orange',
        strokeWidth: '3px',
      };
      // Non-initiating
      style.icon = {
        fill: 'orange',
        stroke: 'white',
        strokeWidth: '3px',
      };
      style.hover.strokeWidth = '6px !important';
      break;
    case 'sequenceFlow':
      style.label.color = 'dodgerblue !important';
      style.stroke = 'dodgerblue';
      style.strokeWidth = '4';
      style.hover.strokeWidth = '6px !important';
      break;
  }
  return style;
}

function updateSelectedBPMNElements(textArea, bpmnKind) {
  log(`Searching for Bpmn elements of '${bpmnKind}' kind`);
  const elementsByKinds = getElementsByKinds(bpmnKind);

  // Update text area
  const textHeader = `Found ${elementsByKinds.length} ${bpmnKind}(s)`;
  log(textHeader);
  const lines = elementsByKinds.map(elt => `  - ${elt.bpmnSemantic.id}: '${elt.bpmnSemantic.name}'`).join('\n');

  textArea.value += [textHeader, lines].join('\n') + '\n';
  textArea.scrollTop = textArea.scrollHeight;

  // newly identified elements and values
  const newlyIdentifiedBpmnIds = elementsByKinds.map(elt => elt.bpmnSemantic.id);

  // Update styles
  resetStyle(lastIdentifiedBpmnIds);
  const style = buildStyle(bpmnKind);
  log(`New value of style %O`, style);
  updateStyle(newlyIdentifiedBpmnIds, style);

  // Overlays update
  lastIdentifiedBpmnIds.forEach(id => removeAllOverlays(id));
  if (isOverlaysDisplayed) {
    newlyIdentifiedBpmnIds.forEach(id => addOverlays(id, getOverlay(bpmnKind)));
  } else {
    log('Do not display overlays');
  }

  // keep track of newly identified elements and values
  lastIdentifiedBpmnIds = newlyIdentifiedBpmnIds;
}

function configureControls() {
  const textArea = document.getElementById('elements-result');

  const selectedKindElt = document.getElementById('bpmn-kinds-select');
  selectedKindElt.onchange = event => updateSelectedBPMNElements(textArea, event.target.value);
  document.addEventListener('diagramLoaded', () => updateSelectedBPMNElements(textArea, selectedKindElt.value), false);

  document.getElementById('clear-btn').onclick = function () {
    textArea.value = '';
    resetStyle(lastIdentifiedBpmnIds);
    lastIdentifiedBpmnIds.forEach(id => removeAllOverlays(id));

    // reset identified elements and values
    lastIdentifiedBpmnIds = [];
  };

  // display options
  const checkboxDisplayOverlaysElt = document.getElementById('checkbox-display-overlays');
  checkboxDisplayOverlaysElt.addEventListener('change', function () {
    isOverlaysDisplayed = this.checked;
    log('Request overlays display:', isOverlaysDisplayed);
    updateSelectedBPMNElements(textArea, selectedKindElt.value);
  });

  checkboxDisplayOverlaysElt.checked = true;
}

function getOverlay(bpmnKind) {
  if (ShapeUtil.isActivity(bpmnKind)) {
    return {
      position: 'top-left',
      label: '30',
      style: {
        font: {
          color: 'Chartreuse',
          size: 30,
        },
        fill: {
          color: 'DimGray',
        },
      },
    };
  } else if (bpmnKind.includes('Gateway')) {
    return {
      position: 'top-right',
      label: '3',
      style: {
        stroke: {
          color: 'HotPink',
          width: 4,
        },
      },
    };
  } else if (bpmnKind.includes('Event')) {
    return { position: 'bottom-left', label: '15' };
  } else if (bpmnKind.includes('lane') || bpmnKind.includes('pool')) {
    return { position: 'bottom-right', label: '100' };
  } else if (bpmnKind.includes('Flow')) {
    return {
      position: 'middle',
      label: '999999',
      style: {
        fill: {
          color: 'PaleTurquoise',
          opacity: 25,
        },
      },
    };
  }
  return { position: 'top-left', label: '40' };
}

function configureDownloadButtons() {
  document.getElementById('btn-dl-svg').addEventListener('click', downloadSvg, false);
  document.getElementById('btn-dl-png').addEventListener('click', downloadPng, false);
}

documentReady(() => {
  startBpmnVisualization({
    globalOptions: {
      // Use a DOM element without id to test the fix for https://github.com/process-analytics/bpmn-visualization-js/issues/2270
      container: document.querySelector('.bpmn-container'),
      navigation: {
        enabled: true,
      },
    },
  });
  updateLoadOptions({ type: FitType.Center, margin: 20 });
  configureControls();
  configureDownloadButtons();
});
