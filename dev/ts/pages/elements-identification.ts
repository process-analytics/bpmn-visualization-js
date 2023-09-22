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

import type { BpmnElementKind, BpmnSemantic, Overlay, ShapeStyleUpdate, StyleUpdate } from '../development-bundle-index';

import {
  addCssClasses,
  addOverlays,
  documentReady,
  downloadPng,
  downloadSvg,
  FitType,
  getModelElementsByKinds,
  log,
  removeAllOverlays,
  removeCssClasses,
  ShapeUtil,
  startBpmnVisualization,
  updateLoadOptions,
  updateStyle,
  resetStyle,
  windowAlertStatusKoNotifier,
  getParentElementIds,
  ShapeBpmnElementKind,
  isChildOfSubProcess,
  isFlowKind,
  getBpmnVisualization,
} from '../development-bundle-index';

let lastIdentifiedBpmnIds: string[] = [];
let lastIdentifiedParentBpmnIds: string[] = [];
let styledPoolAndLaneIds: string[] = [];
const cssClassName = 'detection';
let isOverlaysDisplayed = true;
let useCSS = true;

function computeStyleUpdateByKind(bpmnKind: BpmnElementKind): StyleUpdate {
  const style: ShapeStyleUpdate = { font: {}, fill: {}, stroke: {} };

  if (isFlowKind(bpmnKind)) {
    switch (bpmnKind) {
      case 'messageFlow':
      case 'sequenceFlow':
      case 'association':
        style.font.color = 'Chocolate';
        style.stroke.color = 'Chocolate';
        style.stroke.width = 4;
        break;
    }
    return style;
  }

  if (ShapeUtil.isTask(bpmnKind)) {
    style.font.color = 'Indigo';
    style.fill.color = 'gold';
    style.font.size = 14;
    style.fill.opacity = 20;
  } else if (ShapeUtil.isEvent(bpmnKind)) {
    if (ShapeUtil.isBoundaryEvent(bpmnKind)) {
      style.font.color = 'inherit';
      style.fill.color = 'inherit';
      style.stroke.color = 'inherit';
    } else {
      style.font.color = 'MediumTurquoise';
      style.stroke.color = 'MediumTurquoise';
    }
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

    style.fill.color = { startColor: 'LightYellow', endColor: 'LimeGreen', direction: 'left-to-right' };
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
    }
  }
  return style;
}

function updateStyleByAPI(bpmnIds: string[], bpmnKind: ShapeBpmnElementKind): void {
  const subProcessChildrenIds = bpmnIds.filter(isChildOfSubProcess);
  const otherIds = bpmnIds.filter(bpmnId => !subProcessChildrenIds.includes(bpmnId));

  if (subProcessChildrenIds.length > 0) {
    styledPoolAndLaneIds = getModelElementsByKinds([ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.LANE]).map(element => element.id);
    updateStyle(styledPoolAndLaneIds, { opacity: 5, font: { color: 'blue', opacity: 5 }, fill: { color: 'pink' }, stroke: { color: 'green' } });
  }
  updateStyle(subProcessChildrenIds, { fill: { color: 'swimlane' }, stroke: { color: 'swimlane' }, font: { color: 'swimlane' } });

  if (ShapeUtil.isBoundaryEvent(bpmnKind)) {
    lastIdentifiedParentBpmnIds = getParentElementIds(otherIds);
    updateStyle(lastIdentifiedParentBpmnIds, { opacity: 5, font: { color: 'green', opacity: 5 }, fill: { color: 'gold' }, stroke: { color: 'red' } });
  }

  const style = computeStyleUpdateByKind(bpmnKind);
  updateStyle(otherIds, style);
}

function styleByCSS(idsToStyle: string[]): void {
  removeCssClasses(lastIdentifiedBpmnIds, cssClassName);
  addCssClasses(idsToStyle, cssClassName);
}

function styleByAPI(idsToStyle: string[], bpmnKind: ShapeBpmnElementKind): void {
  resetStyleByAPI();
  updateStyleByAPI(idsToStyle, bpmnKind);
}

function resetStyleByAPI(): void {
  resetStyle(lastIdentifiedBpmnIds);
  resetStyle(lastIdentifiedParentBpmnIds);
  lastIdentifiedParentBpmnIds = [];
  resetStyle(styledPoolAndLaneIds);
  styledPoolAndLaneIds = [];
}

function manageOverlays(idsToAddOverlay: string[], bpmnKind: ShapeBpmnElementKind): void {
  for (const id of lastIdentifiedBpmnIds) removeAllOverlays(id);
  if (isOverlaysDisplayed) {
    for (const id of idsToAddOverlay) addOverlays(id, getOverlay(bpmnKind));
  } else {
    log('Do not display overlays');
  }
}

function updateSelectedBPMNElements(bpmnKind: ShapeBpmnElementKind): void {
  log(`Searching for Bpmn elements of '${bpmnKind}' kind`);
  const elementsByKinds = getModelElementsByKinds(bpmnKind);

  updateTextArea(elementsByKinds, bpmnKind);

  // newly identified elements and values
  const newlyIdentifiedBpmnIds = elementsByKinds.map(elt => elt.id);
  useCSS ? styleByCSS(newlyIdentifiedBpmnIds) : styleByAPI(newlyIdentifiedBpmnIds, bpmnKind);
  manageOverlays(newlyIdentifiedBpmnIds, bpmnKind);

  // keep track of newly identified elements and values
  lastIdentifiedBpmnIds = newlyIdentifiedBpmnIds;
}

function updateTextArea(elementsByKinds: BpmnSemantic[], bpmnKind: string): void {
  const textArea = document.querySelector('#elements-result') as HTMLTextAreaElement;

  const textHeader = `Found ${elementsByKinds.length} ${bpmnKind}(s)`;
  log(textHeader);
  const lines = elementsByKinds.map(elt => `  - ${elt.id}: '${elt.name}'`).join('\n');

  textArea.value += [textHeader, lines].join('\n') + '\n';
  textArea.scrollTop = textArea.scrollHeight;
}

function resetTextArea(): void {
  const textArea = document.querySelector('#elements-result') as HTMLTextAreaElement;
  textArea.value = '';
}

function configureControls(): void {
  const selectedKindElt = document.querySelector('#bpmn-kinds-select') as HTMLSelectElement;
  selectedKindElt.addEventListener('change', event => updateSelectedBPMNElements((event.target as HTMLSelectElement).value as ShapeBpmnElementKind));
  document.addEventListener('diagramLoaded', () => updateSelectedBPMNElements(selectedKindElt.value as ShapeBpmnElementKind), false);

  document.querySelector('#clear-btn').addEventListener('click', function () {
    resetTextArea();

    useCSS ? removeCssClasses(lastIdentifiedBpmnIds, cssClassName) : resetStyleByAPI();
    for (const id of lastIdentifiedBpmnIds) removeAllOverlays(id);

    // reset identified elements and values
    lastIdentifiedBpmnIds = [];
  });

  // display overlay option
  const checkboxDisplayOverlaysElt = document.querySelector('#checkbox-display-overlays') as HTMLInputElement;
  checkboxDisplayOverlaysElt.addEventListener('change', function () {
    isOverlaysDisplayed = this.checked;
    log('Request overlays display:', isOverlaysDisplayed);
    updateSelectedBPMNElements(selectedKindElt.value as ShapeBpmnElementKind);
  });
  checkboxDisplayOverlaysElt.checked = isOverlaysDisplayed;

  // use CSS or API to style the BPMN elements
  const checkboxUseCSSElt = document.querySelector('#checkbox-css-style') as HTMLInputElement;
  checkboxUseCSSElt.addEventListener('change', function () {
    useCSS = this.checked;
    log('Request CSS style feature:', useCSS);

    if (useCSS) {
      resetStyleByAPI();
      addCssClasses(lastIdentifiedBpmnIds, cssClassName);
    } else {
      removeCssClasses(lastIdentifiedBpmnIds, cssClassName);
      updateStyleByAPI(lastIdentifiedBpmnIds, selectedKindElt.value as ShapeBpmnElementKind);
    }
  });
  checkboxUseCSSElt.checked = useCSS;
}

function getOverlay(bpmnKind: BpmnElementKind): Overlay {
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

function configureDownloadButtons(): void {
  document.querySelector('#btn-translate').addEventListener('click', doTranslate, false);
  document.querySelector('#btn-dl-svg').addEventListener('click', downloadSvg, false);
  document.querySelector('#btn-dl-png').addEventListener('click', downloadPng, false);
}

function doTranslate(): void {
  log('Start translating...');

  // Get the id of the element to translate
  const parameters = new URLSearchParams(window.location.search);
  const elementId = parameters.get('translate.bpmn.id');
  if (!elementId) {
    alert('Unable to translate. Pass the id of the BPMN element to translate using the `translate.bpmn.id` query parameter');
    log('No id to translate, abort');
    return;
  }

  const bpmnVisualization = getBpmnVisualization();
  const graph = bpmnVisualization.graph;
  const view = graph.view;

  // implementation
  const cell = graph.model.getCell(elementId);
  if (!cell) {
    alert(`Unable to translate. No element exist for id "${elementId}"!`);
    log(`Element does not exist for id "${elementId}", abort`);
    return;
  }
  log('Found element', elementId);
  // const state = view.getState(cell);
  // const cellBounds = state.getCellBounds();

  // always work, set the absolute translate
  // const paddingTop = 10;
  // const paddingLeft = 20;
  // const tx = -cellBounds.x + paddingLeft;
  // const ty = -cellBounds.y + paddingTop;
  //
  // log('Translate:', tx, ty);
  // view.setTranslate(tx, ty);
  graph.scrollCellToVisible(cell, true);
  log('Translate completed');
}

documentReady(() => {
  startBpmnVisualization({
    globalOptions: {
      // Use a DOM element without id to test the fix for https://github.com/process-analytics/bpmn-visualization-js/issues/2270
      container: document.querySelector<HTMLElement>('.bpmn-container'),
      navigation: {
        enabled: true,
      },
    },
    statusKoNotifier: windowAlertStatusKoNotifier,
  });
  updateLoadOptions({ type: FitType.None, margin: 20 });
  configureControls();
  configureDownloadButtons();
});
