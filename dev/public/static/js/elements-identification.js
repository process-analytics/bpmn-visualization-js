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
  mxgraph,
  removeAllOverlays,
  removeCssClasses,
  resetStyle,
  ShapeUtil,
  startBpmnVisualization,
  updateLoadOptions,
  updateStyle,
} from '../../../ts/dev-bundle-index';
import { imageURI } from './image';

let lastIdentifiedBpmnIds = [];
const cssClassName = 'detection';
let isOverlaysDisplayed = true;

function buildStyle(bpmnKind) {
  const style = { font: { spacing: {} }, fill: {}, stroke: {}, gradient: {}, label: {} };
  switch (bpmnKind) {
    case 'task':
      style.image = {
        url: imageURI,
        width: 50,
        height: 50,
        horizontalAlign: mxgraph.mxConstants.ALIGN_RIGHT,
        verticalAlign: mxgraph.mxConstants.ALIGN_BOTTOM,
      };
      break;
    case 'userTask':
      style.font.color = 'red !important';
      style.font.spacing.eachSide = 30;
      style.fill.color = 'aquamarine';
      break;
    case 'scriptTask':
      style.font.color = 'red !important';
      style.fill.color = 'aquamarine';
      style.label = {
        width: 16,
        horizontalPosition: mxgraph.mxConstants.ALIGN_LEFT,
        verticalPosition: mxgraph.mxConstants.ALIGN_TOP,
        backgroundColor: 'Gold',
        borderColor: 'Orchid',
      };
      break;
    case 'serviceTask':
      style.font.color = 'red !important';
      style.fill.color = 'aquamarine';
      style.label = {
        width: 16,
        backgroundColor: 'Orchid',
        borderColor: 'Gold',
        padding: 35,
      };
      break;
    case 'receiveTask':
    case 'sendTask':
    case 'manualTask':
    case 'businessRuleTask':
      style.font.color = 'red !important';
      style.fill.color = 'aquamarine';
      style.fill.opacity = 40;
      break;
    case 'startEvent':
    case 'endEvent':
    case 'intermediateCatchEvent':
    case 'intermediateThrowEvent':
    case 'boundaryEvent':
      style.font.color = 'red !important';
      style.stroke.color = 'red';
      style.withShadow = true;
      break;
    case 'exclusiveGateway':
    case 'inclusiveGateway':
    case 'parallelGateway':
    case 'eventBasedGateway':
    case 'complexGateway':
      style.font.color = 'red !important';
      style.font.opacity = 60;
      style.stroke.color = 'chartreuse';
      style.stroke.width = 4;
      style.stroke.dashPattern = '2 2';
      break;
    case 'lane':
    case 'pool':
      style.font.color = 'white !important';
      style.fill.color = 'palevioletred';
      style.stroke.opacity = 80;
      style.separatorColor = 'HoneyDew';
      break;
    case 'callActivity':
      style.font.color = 'white';
      style.font.family = 'Times New Roman';
      style.font.isItalic = true;
      style.font.isStrikeThrough = true;

      style.fill.color = 'LimeGreen';
      style.gradient.color = 'swimlane';
      style.gradient.direction = 'north';
      break;
    case 'subProcess':
      style.font.color = 'white';
      style.font.size = 14;
      style.font.family = 'Dialog';
      style.font.isBold = true;
      style.font.isItalic = true;
      style.font.isUnderline = true;
      style.font.isStrikeThrough = true;

      style.fill.color = 'MediumVioletRed';
      style.opacity = 60;
      break;
    case 'group':
    case 'textAnnotation':
      style.font.color = 'MidnightBlue';
      style.font.size = 18;
      style.font.family = 'Verdana';
      style.font.isBold = true;
      style.font.isUnderline = true;

      style.stroke.color = 'Chartreuse';
      break;
    case 'messageFlow':
    case 'sequenceFlow':
    case 'association':
      style.font.color = 'dodgerblue !important';
      style.stroke.color = 'dodgerblue';
      style.stroke.width = 4;
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

  // CSS classes update
  removeCssClasses(lastIdentifiedBpmnIds, cssClassName);
  addCssClasses(newlyIdentifiedBpmnIds, cssClassName);

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
    removeCssClasses(lastIdentifiedBpmnIds, cssClassName);
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
      position: 'bottom-left',
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
    return { position: 'top-left', label: '15' };
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
      shadow: {
        color: 'Chocolate',
        offsetX: 3,
        offsetY: 4,
        opacity: 50,
      },
      arrow: {
        spacing: -40,
        width: 60,
        size: 70,
      },
    },
  });
  updateLoadOptions({ type: FitType.Center, margin: 20 });
  configureControls();
  configureDownloadButtons();
});
