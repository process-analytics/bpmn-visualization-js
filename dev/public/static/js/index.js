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
  handleFileSelect,
  startBpmnVisualization,
  fit,
  log,
  updateLoadOptions,
  getCurrentLoadOptions,
  getVersion,
  zoom,
  ZoomType,
} from '/dev/ts/internal-dev-bundle-index.ts';

let fitOnLoad = true;
let fitOptions = {};

function configureFitOnLoadCheckBox() {
  const fitOnLoadElt = document.getElementById('fitOnLoad');
  fitOnLoadElt.onchange = event => {
    fitOnLoad = event.target.checked;
    log('Fit on load updated!', fitOnLoad);
    updateLoadOptions(fitOnLoad ? fitOptions : {});
  };
  fitOnLoadElt.checked = fitOnLoad;
}

function updateFitConfig(config) {
  log('Updating fit config', config);

  fitOptions.margin = config.margin || fitOptions.margin;
  if (config.type) {
    fitOptions.type = config.type;
  }
  log('Fit config updated!', fitOptions);

  if (fitOnLoad) {
    updateLoadOptions(fitOptions);
  }
}

function configureFitTypeSelect() {
  const fitTypeSelectedElt = document.getElementById('fitType-selected');
  fitTypeSelectedElt.onchange = event => {
    updateFitConfig({ type: event.target.value });
    fit(fitOptions);
  };

  if (fitOptions.type) {
    fitTypeSelectedElt.value = fitOptions.type;
  } else {
    updateFitConfig({ type: fitTypeSelectedElt.value });
  }
}

function configureFitMarginInput() {
  const fitMarginElt = document.getElementById('fit-margin');
  fitMarginElt.onchange = event => {
    updateFitConfig({ margin: event.target.value });
    fit(fitOptions);
  };

  if (fitOptions.margin) {
    fitMarginElt.value = fitOptions.margin;
  } else {
    updateFitConfig({ margin: fitMarginElt.value });
  }
}

function configureZoomButtons() {
  Object.values(ZoomType).forEach(zoomType => {
    document.getElementById(`zoom-${zoomType}`).onclick = () => zoom(zoomType);
  });
  document.getElementById(`zoom-reset`).onclick = () => fit(fitOptions);
}

function configureDisplayedFooterContent() {
  const version = getVersion();
  const versionAsString = `bpmn-visualization@${version.lib}`;
  const dependenciesAsString = [...version.dependencies].map(([name, version]) => `${name}@${version}`).join('/');
  const versionElt = document.getElementById('footer-content');
  versionElt.innerText = `${versionAsString} with ${dependenciesAsString}`;
}

// The following function `preventZoomingPage` serves to block the page content zoom.
// It is to make zooming of the actual diagram area more convenient for the user.
// Without that function, the zooming performed out of the diagram area can mess up the page layout.
function preventZoomingPage() {
  document.addEventListener(
    'wheel',
    e => {
      if (e.ctrlKey) e.preventDefault(); // prevent whole page zoom
    },
    { passive: false, capture: 'bubble' },
  );
}

function startDemo() {
  preventZoomingPage();
  const bpmnContainerId = 'bpmn-container';

  startBpmnVisualization({
    globalOptions: {
      container: bpmnContainerId,
      navigation: {
        enabled: true,
      },
    },
  });

  // Configure custom html elements
  document.getElementById('bpmn-file').addEventListener('change', handleFileSelect, false);

  fitOptions = getCurrentLoadOptions().fit;
  configureFitTypeSelect();
  configureFitMarginInput();
  configureFitOnLoadCheckBox();
  configureZoomButtons();
  configureDisplayedFooterContent();
}

// Start
documentReady(startDemo);
