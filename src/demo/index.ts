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
import BpmnVisualization from '../component/BpmnVisualization';
// import { DropFileUserInterface } from './component/DropFileUserInterface';
import { PanType, ZoomType } from '../component/BpmnVisuOptions';
import { documentReady, log, logStartup } from './helper';
import { downloadAsPng, downloadAsSvg } from './component/download';

// TODO make this an option that can be updated at runtime + configure which kind of fit
let fitOnLoad = false;
export const bpmnVisualization = new BpmnVisualization(window.document.getElementById('graph'), { activatePanning: true });

function loadStatusMsg(msg: string): void {
  const loadStatusElement = document.getElementById('load-status');
  loadStatusElement.innerText = msg;
  // clean status area after a few seconds
  // setTimeout(function() {
  //   loadStatusElement.innerText = '';
  // }, 3000);
}

function cleanLoadStatus(): void {
  loadStatusMsg('');
}

function loadBpmn(bpmn: string): void {
  const initialStartTime = performance.now();
  log('Loading bpmn....');
  bpmnVisualization.load(bpmn);
  log('BPMN loaded');

  // TODO this should be an option of the load function to improve rendering performance
  // the current solution, 1st render the using the actual size, then render it with fit
  // mxgraph performs 2 rendering operations, the 1st one is useless
  // on large file, the extra rendering can take more than 500ms
  if (fitOnLoad) {
    log('Start performing Fit after load');
    const startTime = performance.now();
    bpmnVisualization.zoom(ZoomType.Fit);
    log(`Fit on load rendering done in ${performance.now() - startTime} ms`);
  }

  loadStatusMsg(`BPMN loaded in ${performance.now() - initialStartTime} ms`);
}

// callback function for opening | dropping the file to be loaded
function readAndLoadFile(f: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    statusFetchClean();
    loadBpmn(reader.result as string);
  };
  reader.readAsText(f);
}

// TODO: move to UI initializer
// TODO disabled because prevent buttons usage
//new DropFileUserInterface(window, 'drop-container', 'graph', readAndLoadFile);

// TODO: make File Open Button a self contained component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleFileSelect(evt: any): void {
  const f = evt.target.files[0];
  readAndLoadFile(f);
}

document.getElementById('btn-open-input-file').addEventListener('change', handleFileSelect, false);
document.getElementById('btn-open').addEventListener('click', () => {
  document.getElementById('btn-open-input-file').click();
});

document.getElementById('btn-clean').onclick = function () {
  // clean status areas
  cleanLoadStatus();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  statusFetchClean();

  log('clearing mxgraph model');
  const model = bpmnVisualization.graph.getModel();
  model.clear();
  log('mxgraph model cleared');

  // hacky way: clean the graph by loading an empty BPMN file
  //   loadBpmn(`<definitions
  //   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  //   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  //   targetNamespace="http://www.omg.org/spec/BPMN/20100524/MODEL"
  //   id="Definitions_1"
  //   exporter="bpmn-visualization" exporterVersion="N/A">
  //   <process id="Process_1" isExecutable="false"/>
  //   <bpmndi:BPMNDiagram id="BPMNDiagram_1">
  //     <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"/>
  //   </bpmndi:BPMNDiagram>
  // </definitions>`);
};

// =====================================================================================================================
// BPMN from remote url
// =====================================================================================================================

function getStatusElement(): HTMLElement {
  return document.getElementById('fetch-status');
}

function statusFetching(url: string): void {
  const statusElt = getStatusElement();
  statusElt.innerText = 'Fetching ' + url;
  statusElt.className = 'status-fetching';
}

function statusFetched(url: string, duration: number): void {
  const statusElt = getStatusElement();
  statusElt.innerText = `Fetch OK (${duration} ms): ${url}`;
  statusElt.className = 'status-ok';
}

function statusFetchKO(url: string, error: unknown): void {
  const statusElt = getStatusElement();
  statusElt.innerText = `Unable to fetch ${url}. ${error}`;
  statusElt.className = 'status-ko';
}

function statusFetchClean(): void {
  getStatusElement().innerText = ``;
}

function fetchBpmnContent(url: string): Promise<string> {
  log('Fetching BPMN content from url <%s>', url);
  const startTime = performance.now();
  statusFetching(url);
  return fetch(url)
    .then(response => {
      // log(response);
      if (!response.ok) {
        throw Error(String(response.status));
      }
      return response.text();
    })
    .then(responseBody => {
      // log('retrieved content: %s', responseBody);
      log('BPMN content fetched');
      const duration = performance.now() - startTime;
      statusFetched(url, duration);
      return responseBody;
    })
    .catch(error => {
      statusFetchKO(url, error);
      throw new Error(`Unable to fetch ${url}. ${error}`);
    })
    .finally(() => {
      // clean status area after a few seconds
      // setTimeout(function() {
      //   const statusElt = getStatusElement();
      //   statusElt.innerText = '';
      // }, 3000);
    });
}

function openFromUrl(url: string): void {
  cleanLoadStatus();
  fetchBpmnContent(url).then(bpmn => {
    loadBpmn(bpmn);
    log('Bpmn loaded from url <%s>', url);
  });
}

// DISABLED
// document.getElementById('btn-open-url').onclick = function () {
//   const url = (document.getElementById('input-open-url') as HTMLInputElement).value;
//   openFromUrl(url);
// };

document.getElementById('select-open-migw').onchange = function () {
  const fileName = (document.getElementById('select-open-migw') as HTMLSelectElement).value;
  if (fileName) {
    log('Start opening MIGW file %s', fileName);
    const url = `https://raw.githubusercontent.com/bpmn-miwg/bpmn-miwg-test-suite/master/Reference/${fileName}`;
    openFromUrl(url);
  }
};

document.getElementById('select-open-bpmn-visualization-example').onchange = function () {
  const fileName = (document.getElementById('select-open-bpmn-visualization-example') as HTMLSelectElement).value;
  if (fileName) {
    log('Start opening bpmn-visualization-example file %s', fileName);
    const url = `https://raw.githubusercontent.com/process-analytics/bpmn-visualization-examples/master/bpmn-files/${fileName}`;
    openFromUrl(url);
  }
};

// =====================================================================================================================
// ZOOM
// =====================================================================================================================
document.getElementById('btn-zoom-in').onclick = function () {
  bpmnVisualization.zoom(ZoomType.In);
};
document.getElementById('btn-zoom-out').onclick = function () {
  bpmnVisualization.zoom(ZoomType.Out);
};
document.getElementById('btn-zoom-actual').onclick = function () {
  bpmnVisualization.zoom(ZoomType.Actual);
};
document.getElementById('btn-zoom-fit').onclick = function () {
  bpmnVisualization.zoom(ZoomType.Fit);
};
document.getElementById('btn-zoom-fit-horizontal').onclick = function () {
  bpmnVisualization.zoom(ZoomType.FitHorizontal);
};
document.getElementById('btn-zoom-fit-vertical').onclick = function () {
  bpmnVisualization.zoom(ZoomType.FitVertical);
};

// =====================================================================================================================
// PAN
// =====================================================================================================================
document.getElementById('btn-pan-up').onclick = function () {
  bpmnVisualization.pan(PanType.VerticalUp);
};
document.getElementById('btn-pan-down').onclick = function () {
  bpmnVisualization.pan(PanType.VerticalDown);
};
document.getElementById('btn-pan-left').onclick = function () {
  bpmnVisualization.pan(PanType.HorizontalLeft);
};
document.getElementById('btn-pan-right').onclick = function () {
  bpmnVisualization.pan(PanType.HorizontalRight);
};

// =====================================================================================================================
// General
// =====================================================================================================================

document.getElementById('btn-help').onclick = function () {
  log('click btn-help');
  // TODO implement a more convenient popup/modal
  window.alert('Keyboard Shortcuts\nPanning: use arrow');
};

// =====================================================================================================================
// General graph
// =====================================================================================================================

const outlineElement = document.getElementById('outline');
document.getElementById('btn-outline').onclick = function () {
  outlineElement.classList.toggle('hidden');
  bpmnVisualization.toggleOutline(outlineElement);
};

// =====================================================================================================================
// Export/Download
// =====================================================================================================================
document.getElementById('btn-export-preview').onclick = function () {
  bpmnVisualization.preview();
};
document.getElementById('btn-export-svg').onclick = function () {
  downloadAsSvg(bpmnVisualization.exportAsSvg());
};

document.getElementById('btn-export-png').onclick = function () {
  downloadAsPng(bpmnVisualization.exportAsSvg());
};

////////////////////////////////////////////////////////////////////////////////
// if bpmn passed as request parameter, try to load it directly
////////////////////////////////////////////////////////////////////////////////

// TODO     auto open ?url=diagram-url
//
//     (function() {
//       var str = window.location.search;
//       var match = /(?:\&|\?)url=([^&]+)/.exec(str);
//
//       if (match) {
//         var url = decodeURIComponent(match[1]);
//         $('#input-open-url').val(url);
//         openFromUrl(url);
//       }
//     })();

documentReady(function () {
  const log = logStartup;
  log("Checking if 'BPMN auto loading from url parameter' is requested");
  const parameters = new URLSearchParams(window.location.search);

  fitOnLoad = parameters.get('fitOnLoad') == 'true';
  log(`Configure 'fit on load' to ${fitOnLoad}`);

  const bpmnParameterValue = parameters.get('bpmn');
  if (bpmnParameterValue) {
    const bpmn = decodeURIComponent(bpmnParameterValue);
    log(`Received bpmn length: ${bpmn.length}`);
    log(`Received bpmn content: ${bpmn}`);
    log('BPMN auto loading');
    loadBpmn(bpmn);
    log('BPMN auto loading completed');
  } else {
    log('No BPMN auto loading');
  }
});
