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
  ShapeUtil,
  startBpmnVisualization,
  updateLoadOptions,
  updateStyle,
  windowAlertStatusKoNotifier,
} from '../../../ts/dev-bundle-index';

let lastIdentifiedBpmnIds = [];
const cssClassName = 'detection';
let isOverlaysDisplayed = true;
let useCSS = true;

function updateStyleByAPI(bpmnIds, bpmnKind) {
  const style = { font: { spacing: {} }, fill: {}, stroke: {}, gradient: {}, label: {} };

  if (ShapeUtil.isTask(bpmnKind)) {
    style.font.color = 'Indigo';
    style.fill.color = 'gold';
    style.font.size = 14;
    style.fill.opacity = 20;
  } else if (ShapeUtil.isEvent(bpmnKind)) {
    style.font.color = 'MediumTurquoise';
    style.stroke.color = 'MediumTurquoise';
  } else if (ShapeUtil.isGateway(bpmnKind)) {
    style.font.color = 'CadetBlue';
    style.font.opacity = 85;
    style.stroke.color = 'OrangeRed';
    style.stroke.width = 4;
  } else if (ShapeUtil.isPoolOrLane(bpmnKind)) {
    style.font.color = 'white !important';
    style.fill.color = 'deeppink';
    style.stroke.opacity = 80;
  } else if (ShapeUtil.isCallActivity(bpmnKind)) {
    style.font.color = 'white';
    style.font.family = 'Times New Roman';
    style.font.isItalic = true;
    style.font.isStrikeThrough = true;

    style.fill.color = 'LimeGreen';
  } else if (ShapeUtil.isSubProcess(bpmnKind)) {
    style.font.color = 'white';
    style.font.size = 14;
    style.font.family = 'Dialog';
    style.font.isBold = true;
    style.font.isItalic = true;
    style.font.isUnderline = true;
    style.font.isStrikeThrough = true;

    style.fill.color = 'MidnightBlue';
    style.opacity = 60;
  } else {
    switch (bpmnKind) {
      case 'group':
      case 'textAnnotation':
        style.font.color = 'Crimson';
        style.font.size = 18;
        style.font.family = 'Verdana';
        style.font.isBold = true;
        style.font.isUnderline = true;

        style.stroke.color = 'Chartreuse';
        style.stroke.width = 6;
        break;
      case 'messageFlow':
      case 'sequenceFlow':
      case 'association':
        style.font.color = 'Chocolate';
        style.stroke.color = 'Chocolate';
        style.stroke.width = 4;
        break;
    }
  }

  updateStyle(bpmnIds, style);
}

function resetStyleByAPI() {
  const style = {
    font: {
      color: 'default',
      size: 10,
      family: 'Arial',
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrikeThrough: false,
      opacity: 'default',
    },
    fill: {
      color: 'default',
      opacity: 'default',
    },
    stroke: {
      color: 'default',
      opacity: 'default',
      width: 'default',
    },
    opacity: 'default',
  };
  updateStyle(lastIdentifiedBpmnIds, style);
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

  // style update
  if (useCSS) {
    removeCssClasses(lastIdentifiedBpmnIds, cssClassName);
    addCssClasses(newlyIdentifiedBpmnIds, cssClassName);
  } else {
    resetStyleByAPI(lastIdentifiedBpmnIds);
    updateStyleByAPI(newlyIdentifiedBpmnIds, bpmnKind);
  }

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
    useCSS ? removeCssClasses(lastIdentifiedBpmnIds, cssClassName) : resetStyleByAPI(lastIdentifiedBpmnIds);
    lastIdentifiedBpmnIds.forEach(id => removeAllOverlays(id));

    // reset identified elements and values
    lastIdentifiedBpmnIds = [];
  };

  // display overlay option
  const checkboxDisplayOverlaysElt = document.getElementById('checkbox-display-overlays');
  checkboxDisplayOverlaysElt.addEventListener('change', function () {
    isOverlaysDisplayed = this.checked;
    log('Request overlays display:', isOverlaysDisplayed);
    updateSelectedBPMNElements(textArea, selectedKindElt.value);
  });
  checkboxDisplayOverlaysElt.checked = isOverlaysDisplayed;

  // use CSS or API to style the BPMN elements
  const checkboxUseCSSElt = document.getElementById('checkbox-css-style');
  checkboxUseCSSElt.addEventListener('change', function () {
    useCSS = this.checked;
    log('Request CSS style feature:', useCSS);

    if (useCSS) {
      resetStyleByAPI(lastIdentifiedBpmnIds);
      addCssClasses(lastIdentifiedBpmnIds, cssClassName);
    } else {
      removeCssClasses(lastIdentifiedBpmnIds, cssClassName);
      updateStyleByAPI(lastIdentifiedBpmnIds, selectedKindElt.value);
    }
  });
  checkboxUseCSSElt.checked = useCSS;
}

function getOverlay(bpmnKind) {
  if (ShapeUtil.isActivity(bpmnKind)) {
    return {
      position: 'top-right',
      label: '30',
      style: {
        font: {
          color: 'Chartreuse',
          size: 20,
        },
        fill: {
          color: 'DimGray',
        },
      },
    };
  } else if (bpmnKind.includes('Gateway')) {
    return {
      position: 'top-left',
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
      label: '999',
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
    statusKoNotifier: windowAlertStatusKoNotifier,
  });
  updateLoadOptions({ type: FitType.Center, margin: 20 });
  configureControls();
  configureDownloadButtons();
});
