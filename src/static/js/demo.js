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
import { documentReady, handleFileSelect, startBpmnVisualization, getCurrentLoadOptions, updateFitConfig, FitType } from '../../index.es.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function updateFitTypeSelection(event) {
  const fitType = event.target.value;
  updateFitConfig({ type: fitType });

  if (fitType === 'None') {
    resetClass(container);
  } else {
    setFixedSizeClass(container);
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function setFixedSizeClass(htmlElementId) {
  const htmlElement = document.getElementById(htmlElementId);
  htmlElement.classList.add('fixed-size');
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function resetClass(htmlElementId) {
  const htmlElement = document.getElementById(htmlElementId);
  htmlElement.classList.remove('fixed-size');
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function startDemo() {
  startBpmnVisualization({ container: 'graph' });

  // Configure custom html elements
  document.getElementById('bpmn-file').addEventListener('change', handleFileSelect, false);

  const fitTypeSelectedElt = document.getElementById('fitType-selected');
  fitTypeSelectedElt.addEventListener('change', updateFitTypeSelection, false);

  const fitMarginElt = document.getElementById('fit-margin');
  fitMarginElt.onchange = function (event) {
    updateFitConfig({ margin: event.target.value });
  };

  // Update Fit Options based on configuration
  const fitOptions = getCurrentLoadOptions().fit;

  if (fitOptions.type) {
    fitTypeSelectedElt.value = FitType[fitOptions.type];
  }
  if (fitTypeSelectedElt.value !== 'None') {
    setFixedSizeClass('graph');
  }

  if (fitOptions.margin) {
    fitMarginElt.value = fitOptions.margin;
  }

  // Update control panel
  const parameters = new URLSearchParams(window.location.search);
  if (parameters.get('hideControls') === 'true') {
    const classList = document.getElementById('controls').classList;
    classList.remove('controls');
    classList.add('hidden');
  }
}

// Start
documentReady(startDemo);
