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
import ShapeUtil from '../model/bpmn/shape/ShapeUtil';
import { StyleDefault } from '../component/mxgraph/StyleUtils';
import { ShapeBpmnElementKind } from '../model/bpmn/shape/ShapeBpmnElementKind';

// TODO make this an option that can be updated at runtime + configure which kind of fit
let fitOnLoad = false;
export const bpmnVisualization = new BpmnVisualization(window.document.getElementById('graph'), { activatePanning: true });

// =====================================================================================================================
// LOAD BPMN STATUS AREA
// =====================================================================================================================

function getStatusElement(): HTMLElement {
  return document.getElementById('load-status');
}

function statusLoaded(msg: string): void {
  const statusElt = getStatusElement();

  let innerText = statusElt.innerText;
  if (innerText) {
    innerText += '<br>';
  }
  statusElt.innerHTML = innerText + msg;

  statusElt.className = 'status-ok';

  // clean status area after a few seconds
  // setTimeout(function() {
  //   statusElt.innerText = '';
  // }, 3000);
}

function cleanStatus(): void {
  getStatusElement().innerText = ``;
}

function statusFetching(url: string): void {
  const statusElt = getStatusElement();
  statusElt.innerText = 'Fetching ' + url;
  statusElt.className = 'status-fetching';
}

function statusFetched(url: string, duration: number): void {
  const statusElt = getStatusElement();
  // only display file name to keep the status content small
  const urlParts = url.split('/');
  const fileName = urlParts[urlParts.length - 1];
  statusElt.innerText = `Fetch OK (${duration} ms): ${fileName}`;
  statusElt.className = 'status-ok';
}

function statusFetchKO(url: string, error: unknown): void {
  const statusElt = getStatusElement();
  statusElt.innerText = `Unable to fetch ${url}. ${error}`;
  statusElt.className = 'status-ko';
}

// =====================================================================================================================
// LOAD BPMN
// =====================================================================================================================

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

  statusLoaded(`BPMN loaded in ${performance.now() - initialStartTime} ms`);
}

// callback function for opening | dropping the file to be loaded
function readAndLoadFile(f: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    cleanStatus();
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
  cleanStatus();

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
  cleanStatus();
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

const overviewElement = document.getElementById('graph-overview');
document.getElementById('btn-overview').onclick = function () {
  overviewElement.classList.toggle('hidden');
  bpmnVisualization.toggleOverview(overviewElement);
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

// =====================================================================================================================
// Global Rendering
// =====================================================================================================================
const btnSketch = document.getElementById('btn-sketch') as HTMLInputElement;
btnSketch.onclick = function () {
  const graph = bpmnVisualization.graph;
  const styleSheet = graph.getStylesheet();

  const sketchActivated = btnSketch.checked;
  log(`Sketch style management, sketch: ${sketchActivated}`);

  styleSheet.getDefaultEdgeStyle()['sketch'] = String(sketchActivated);
  styleSheet.getDefaultVertexStyle()['sketch'] = String(sketchActivated);

  // only to demonstrate various fill capacity with rough.js
  ShapeUtil.taskKinds().forEach(kind => {
    const style = styleSheet.styles[kind];

    switch (kind) {
      case ShapeBpmnElementKind.TASK_USER:
        style['roughness'] = String(1.5);
        style['fillStyle'] = 'zigzag';
        style[mxConstants.STYLE_FILLCOLOR] = 'purple';
        style[mxConstants.STYLE_FILL_OPACITY] = '20';
        break;
      case ShapeBpmnElementKind.TASK:
        style['roughness'] = String(2);
        style['fillStyle'] = 'cross-hatch';
        style[mxConstants.STYLE_FILLCOLOR] = 'Orange';
        style[mxConstants.STYLE_FILL_OPACITY] = '40';
        break;
    }

    if (!sketchActivated) {
      style[mxConstants.STYLE_FILLCOLOR] = StyleDefault.DEFAULT_FILL_COLOR;
    }
  });

  const availableSketchFonts = ['Gloria Hallelujah, cursive', 'Permanent Marker, cursive'];
  // hack as we currently configured all properties in all styles, instead of only override what is defined in the default
  Object.values(ShapeBpmnElementKind).forEach(kind => {
    const style = styleSheet.styles[kind];
    if (!sketchActivated) {
      style[mxConstants.STYLE_FONTFAMILY] = StyleDefault.DEFAULT_FONT_FAMILY;
      style[mxConstants.STYLE_FONTSIZE] = StyleDefault.DEFAULT_FONT_SIZE;
    } else {
      const font = availableSketchFonts[Math.floor(Math.random() * availableSketchFonts.length)];
      // log(`Use custom font for ${kind}: ${font}`);
      style[mxConstants.STYLE_FONTSIZE] = 12;
      style[mxConstants.STYLE_FONTFAMILY] = font;
    }
  });

  const startTime = performance.now();
  log('Refreshing the mxgraph.graph to consider style updates');
  graph.refresh();
  log(`mxgraph.graph refreshed in ${performance.now() - startTime} ms`);
};

const btnFitOnLoad = document.getElementById('btn-fit-on-load') as HTMLInputElement;
btnFitOnLoad.onclick = function () {
  fitOnLoad = btnFitOnLoad.checked;
  log(`Fit On Load is now '${fitOnLoad}'`);
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
