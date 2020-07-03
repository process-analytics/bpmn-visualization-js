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
import { download, svgToPNGBase64 } from './component/download';

// TODO make this an option that can be updated at runtime + configure which kind of fit
let fitOnLoad = false;
export const bpmnVisualization = new BpmnVisualization(window.document.getElementById('graph'), { activatePanning: true });
function loadBpmn(bpmn: string): void {
  log('Loading bpmn....');
  bpmnVisualization.load(bpmn);
  log('BPMN loaded');

  if (fitOnLoad) {
    log('Request Fit after load');
    bpmnVisualization.zoom(ZoomType.Fit);
    log('Fit on load rendering done');
  }
}

// callback function for opening | dropping the file to be loaded
function readAndLoadFile(f: File): void {
  const reader = new FileReader();
  reader.onload = () => {
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

document.getElementById('bpmn-file').addEventListener('change', handleFileSelect, false);
document.getElementById('file-selector').classList.remove('hidden');

// =====================================================================================================================
// BPMN from remote url
// =====================================================================================================================

function fetchBpmnContent(url: string): Promise<string> {
  log('Fetching BPMN content from url <%s>', url);
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
      return responseBody;
    })
    .catch(error => {
      throw new Error(`Unable to fetch ${url}. ${error}`);
    });
}

function openFromUrl(url: string): void {
  fetchBpmnContent(url).then(bpmn => {
    loadBpmn(bpmn);
    log('Bpmn loaded from url <%s>', url);
  });
}

document.getElementById('btn-open-url').onclick = function() {
  const url = (document.getElementById('input-open-url') as HTMLInputElement).value;
  openFromUrl(url);
};

document.getElementById('btn-open-migw').onclick = function() {
  const fileName = (document.getElementById('select-open-migw') as HTMLSelectElement).value;
  log('Start opening MIGW file %s', fileName);
  const url = `https://raw.githubusercontent.com/bpmn-miwg/bpmn-miwg-test-suite/master/Reference/${fileName}`;
  openFromUrl(url);
};

document.getElementById('btn-open-bpmn-visualization-example').onclick = function() {
  const fileName = (document.getElementById('select-open-bpmn-visualization-example') as HTMLSelectElement).value;
  log('Start opening bpmn-visualization-example file %s', fileName);
  const url = `https://raw.githubusercontent.com/process-analytics/bpmn-visualization-examples/master/bpmn-files/${fileName}`;
  openFromUrl(url);
};

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

// =====================================================================================================================
// ZOOM
// =====================================================================================================================
document.getElementById('btn-zoom-in').onclick = function() {
  bpmnVisualization.zoom(ZoomType.In);
};
document.getElementById('btn-zoom-out').onclick = function() {
  bpmnVisualization.zoom(ZoomType.Out);
};
document.getElementById('btn-zoom-actual').onclick = function() {
  bpmnVisualization.zoom(ZoomType.Actual);
};
document.getElementById('btn-zoom-fit').onclick = function() {
  bpmnVisualization.zoom(ZoomType.Fit);
};
document.getElementById('btn-zoom-fit-horizontal').onclick = function() {
  bpmnVisualization.zoom(ZoomType.FitHorizontal);
};
document.getElementById('btn-zoom-fit-vertical').onclick = function() {
  bpmnVisualization.zoom(ZoomType.FitVertical);
};

// =====================================================================================================================
// PAN
// =====================================================================================================================
document.getElementById('btn-pan-up').onclick = function() {
  bpmnVisualization.pan(PanType.VerticalUp);
};
document.getElementById('btn-pan-down').onclick = function() {
  bpmnVisualization.pan(PanType.VerticalDown);
};
document.getElementById('btn-pan-left').onclick = function() {
  bpmnVisualization.pan(PanType.HorizontalLeft);
};
document.getElementById('btn-pan-right').onclick = function() {
  bpmnVisualization.pan(PanType.HorizontalRight);
};

// =====================================================================================================================
// General
// =====================================================================================================================
document.getElementById('btn-outline').onclick = function() {
  bpmnVisualization.toggleOutline();
};

// =====================================================================================================================
// Actions
// =====================================================================================================================

document.getElementById('btn-export-preview').onclick = function() {
  // eslint-disable-next-line no-console
  console.info('button triggers preview');
  bpmnVisualization.preview();
};
document.getElementById('btn-export-svg').onclick = function() {
  // eslint-disable-next-line no-console
  console.info('button triggers export svg');
  const svg = bpmnVisualization.exportAsSvg();

  // TODO add ;charset=utf-8 ?
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  download('diagram.svg', 'data:image/svg+xml', svg);
};

document.getElementById('btn-export-png').onclick = function() {
  // eslint-disable-next-line no-console
  console.info('button triggers export png');
  const svg = bpmnVisualization.exportAsSvg();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  svgToPNGBase64(svg);
  // const pngBase64 = svgToPNGBase64(svg);

  // eslint-disable-next-line no-console
  // console.info('@@@@png image as base64:', pngBase64);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  // download('diagram.png', svg);
};

////////////////////////////////////////////////////////////////////////////////
// if bpmn passed as request parameter, try to load it directly
////////////////////////////////////////////////////////////////////////////////
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
