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

/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { documentReady, startBpmnVisualization, addOverlays, removeAllOverlays } from '../../index.es.js';
import { configureControlsPanel, configureMousePointer } from './test.js';

function configureAddOverlays(position) {
  document.getElementById(position).onclick = () => addOverlays(document.getElementById('bpmn-id-input').value, { position, label: '123' });
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

  configureAddOverlays('start');
  configureAddOverlays('middle');
  configureAddOverlays('end');
  configureAddOverlays('top-left');
  configureAddOverlays('top-center');
  configureAddOverlays('top-right');
  configureAddOverlays('bottom-left');
  configureAddOverlays('bottom-center');
  configureAddOverlays('bottom-right');
  configureAddOverlays('middle-left');
  configureAddOverlays('middle-right');

  configureRemoveAllOverlays();
}

documentReady(start);
