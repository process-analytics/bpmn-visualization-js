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
  applySketchStyle,
  configureExportButtons,
  configureFitOnLoad,
  configureGeneralGraphButtons,
  configureIgnoreBpmnLabelStyles,
  configureNavigationButtons,
  configureZoomButtons,
  documentReady,
  handleFileSelect,
  log,
  openFromUrl,
  startBpmnVisualization,
} from '../../index.es.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureOpenButtons() {
  document.getElementById('btn-open-input-file').addEventListener('change', handleFileSelect, false);
  document.getElementById('btn-open').addEventListener('click', () => {
    document.getElementById('btn-open-input-file').click();
  });

  // DISABLED
  // document.getElementById('btn-open-url').onclick = function () {
  //   const url = (document.getElementById('input-open-url') as HTMLInputElement).value;
  //   openFromUrl(url);
  // };

  document.getElementById('select-open-migw').onchange = function () {
    const fileName = document.getElementById('select-open-migw').value;
    if (fileName) {
      log('Start opening MIGW file %s', fileName);
      const url = `https://raw.githubusercontent.com/bpmn-miwg/bpmn-miwg-test-suite/master/Reference/${fileName}`;
      openFromUrl(url);
    }
  };

  document.getElementById('select-open-bpmn-visualization-example').onchange = function () {
    const fileName = document.getElementById('select-open-bpmn-visualization-example').value;
    if (fileName) {
      log('Start opening bpmn-visualization-example file %s', fileName);
      const url = `https://raw.githubusercontent.com/process-analytics/bpmn-visualization-examples/master/bpmn-files/${fileName}`;
      openFromUrl(url);
    }
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureRenderingButtons() {
  const btnSketch = document.getElementById('btn-sketch');
  btnSketch.onclick = function () {
    applySketchStyle(btnSketch.checked);
  };

  const btnFitOnLoad = document.getElementById('btn-fit-on-load');
  btnFitOnLoad.onclick = function () {
    configureFitOnLoad(btnFitOnLoad.checked);
  };

  const btnIgnoreBpmnLabelStyles = document.getElementById('btn-ignore-bpmn-label-styles');
  btnIgnoreBpmnLabelStyles.onclick = function () {
    configureIgnoreBpmnLabelStyles(btnIgnoreBpmnLabelStyles.checked);
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function startDemo() {
  startBpmnVisualization({ container: 'graph' });

  document.getElementById('btn-help').onclick = function () {
    log('click btn-help');
    // TODO implement a more convenient popup/modal
    window.alert('Keyboard Shortcuts\nPanning: use arrow');
  };

  configureGeneralGraphButtons();
  configureRenderingButtons();

  configureOpenButtons();

  configureExportButtons();
  configureNavigationButtons();
  configureZoomButtons();
}

documentReady(startDemo());
