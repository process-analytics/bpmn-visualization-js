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

import type { Overlay, OverlayPosition } from '../development-bundle-index';

import {
  addOverlays,
  configureControlsPanel,
  configureMousePointer,
  documentReady,
  getModelElementsByIds,
  removeAllOverlays,
  startBpmnVisualization,
} from '../development-bundle-index';

const bpmnIdInputElt = document.querySelector('#bpmn-id-input') as HTMLInputElement;

function addOverlay(overlay: Overlay): void {
  const bpmnId = bpmnIdInputElt.value;
  if (bpmnId) {
    addOverlays(bpmnId, overlay);
  }
}

function getPosition(): OverlayPosition {
  const bpmnId = bpmnIdInputElt.value;
  if (bpmnId) {
    const elementsByIds = getModelElementsByIds(bpmnId);
    if (elementsByIds) {
      return elementsByIds[0].isShape ? 'top-left' : 'middle';
    }
  }
}

function configureAddDefaultOverlay(position: OverlayPosition): void {
  document.querySelector(`#${position}`).addEventListener('click', () => addOverlay({ position, label: '123' }));
}

function configureAddOverlayWithCustomFont(): void {
  document.querySelector('#font').addEventListener('click', () => addOverlay({ position: getPosition(), label: '7896', style: { font: { color: 'LightSeaGreen', size: 30 } } }));
}

function configureAddOverlayWithCustomFill(): void {
  document.querySelector('#fill').addEventListener('click', () => addOverlay({ position: getPosition(), label: '3', style: { fill: { color: 'LightSalmon', opacity: 50 } } }));
}

function configureAddOverlayWithCustomStroke(): void {
  document.querySelector('#stroke').addEventListener('click', () => addOverlay({ position: getPosition(), label: '41', style: { stroke: { color: 'Aquamarine', width: 5 } } }));
}

function configureRemoveAllOverlays(): void {
  document.querySelector('#clear').addEventListener('click', () => removeAllOverlays(bpmnIdInputElt.value));
}

function start(): void {
  const parameters = new URLSearchParams(window.location.search);
  configureMousePointer(parameters);
  configureControlsPanel(parameters);

  startBpmnVisualization({
    globalOptions: {
      container: 'bpmn-container',
      navigation: {
        enabled: true,
      },
    },
  });

  configureAddDefaultOverlay('start');
  configureAddDefaultOverlay('middle');
  configureAddDefaultOverlay('end');
  configureAddDefaultOverlay('top-left');
  configureAddDefaultOverlay('top-center');
  configureAddDefaultOverlay('top-right');
  configureAddDefaultOverlay('bottom-left');
  configureAddDefaultOverlay('bottom-center');
  configureAddDefaultOverlay('bottom-right');
  configureAddDefaultOverlay('middle-left');
  configureAddDefaultOverlay('middle-right');

  configureAddOverlayWithCustomFont();
  configureAddOverlayWithCustomFill();
  configureAddOverlayWithCustomStroke();

  configureRemoveAllOverlays();
}

documentReady(start);
