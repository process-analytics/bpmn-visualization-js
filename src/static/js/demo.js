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
import { documentReady, handleFileSelect, startBpmnVisualization, FitType, fit, log, updateLoadOptions, getCurrentLoadOptions } from '../../index.es.js';

let fitOnLoad = true;
let fitOptions = {};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureBpmnViewport() {
  const viewport = document.getElementById('graph');

  const useFixedSize = !(fitOptions.type && FitType[fitOptions.type] === 'None'); // !== 'None'
  if (useFixedSize) {
    viewport.classList.add('fixed-size');
  } else {
    viewport.classList.remove('fixed-size');
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureFitOnLoadCheckBox() {
  const fitOnLoadElt = document.getElementById('fitOnLoad');
  fitOnLoadElt.onchange = event => {
    fitOnLoad = event.target.checked;
    log('Fit on load updated!', fitOnLoad);
    updateLoadOptions(fitOnLoad ? fitOptions : {});
  };
  fitOnLoadElt.checked = fitOnLoad;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function updateFitConfig(config) {
  log('Updating fit config', config);

  fitOptions.margin = config.margin || fitOptions.margin;
  if (config.type) {
    fitOptions.type = FitType[config.type];
  }
  log('Fit config updated!', fitOptions);

  if (fitOnLoad) {
    updateLoadOptions(fitOptions);
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureFitTypeSelect() {
  const fitTypeSelectedElt = document.getElementById('fitType-selected');
  fitTypeSelectedElt.onchange = event => {
    updateFitConfig({ type: event.target.value });
    configureBpmnViewport();
    fit(fitOptions);
  };

  if (fitOptions.type) {
    fitTypeSelectedElt.value = FitType[fitOptions.type];
  } else {
    updateFitConfig({ type: fitTypeSelectedElt.value });
  }

  configureBpmnViewport();
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureFitMarginInput() {
  const fitMarginElt = document.getElementById('fit-margin');
  fitMarginElt.onchange = event => updateFitConfig({ margin: event.target.value });

  if (fitOptions.margin) {
    fitMarginElt.value = fitOptions.margin;
  } else {
    updateFitConfig({ margin: fitMarginElt.value });
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureControlPanel() {
  const parameters = new URLSearchParams(window.location.search);
  if (parameters.get('hideControls') === 'true') {
    const classList = document.getElementById('controls').classList;
    classList.remove('controls');
    classList.add('hidden');
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function startDemo() {
  startBpmnVisualization({ container: 'graph' });

  // Configure custom html elements
  document.getElementById('bpmn-file').addEventListener('change', handleFileSelect, false);

  fitOptions = getCurrentLoadOptions().fit;
  configureFitTypeSelect();
  configureFitMarginInput();
  configureFitOnLoadCheckBox();
  configureControlPanel();
}

// Start
documentReady(startDemo);
