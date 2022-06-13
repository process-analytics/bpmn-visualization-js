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

import { documentReady, startBpmnVisualization, addOverlays, removeAllOverlays, getElementsByIds } from '../../../ts/dev-bundle-index';
import { configureControlsPanel, configureMousePointer } from './helpers/controls.js';

function addOverlay(overlay) {
  const bpmnId = document.getElementById('bpmn-id-input').value;
  if (bpmnId) {
    addOverlays(bpmnId, overlay);
  }
}

function getPosition() {
  const bpmnId = document.getElementById('bpmn-id-input').value;
  if (bpmnId) {
    const elementsByIds = getElementsByIds(bpmnId);
    if (elementsByIds) {
      if (elementsByIds[0].bpmnSemantic.isShape) {
        return 'top-left';
      }
      return 'middle';
    }
  }
}

function configureAddDefaultOverlay(position) {
  document.getElementById(position).onclick = () => addOverlay({ position, label: '123' });
}

function configureAddOverlayWithCustomFont() {
  document.getElementById('font').onclick = () => addOverlay({ position: getPosition(), label: '7896', style: { font: { color: 'LightSeaGreen', size: 30 } } });
}

function configureAddOverlayWithCustomFill() {
  document.getElementById('fill').onclick = () => addOverlay({ position: getPosition(), label: '3', style: { fill: { color: 'LightSalmon', opacity: 50 } } });
}

function configureAddOverlayWithCustomStroke() {
  document.getElementById('stroke').onclick = () => addOverlay({ position: getPosition(), label: '41', style: { stroke: { color: 'Aquamarine', width: 5 } } });
}

function configureRemoveAllOverlays() {
  document.getElementById('clear').onclick = () => removeAllOverlays(document.getElementById('bpmn-id-input').value);
}

function start() {
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
