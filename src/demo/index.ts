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
import BpmnVisu from '../component/BpmnVisu';
// import { DropFileUserInterface } from './component/DropFileUserInterface';
import { PanType, ZoomType } from '../component/BpmnVisuOptions';

export const bpmnVisu = new BpmnVisu(window.document.getElementById('graph'), { activatePanning: true });

function log(message?: any, ...optionalParams: any[]): void {
  // eslint-disable-next-line no-console
  console.info(message, ...optionalParams);
}

// callback function for opening | dropping the file to be loaded
function readAndLoadFile(f: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    bpmnVisu.load(reader.result as string);
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
      return responseBody;
    })
    .catch(error => {
      throw new Error(`Unable to fetch ${url}. ${error}`);
    });
}

function openFromUrl(url: string): void {
  log('Trying to open url <%s>', url);
  fetchBpmnContent(url).then(bpmn => {
    bpmnVisu.load(bpmn);
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
  bpmnVisu.zoom(ZoomType.In);
};
document.getElementById('btn-zoom-out').onclick = function() {
  bpmnVisu.zoom(ZoomType.Out);
};
document.getElementById('btn-zoom-actual').onclick = function() {
  bpmnVisu.zoom(ZoomType.Actual);
};
document.getElementById('btn-zoom-fit').onclick = function() {
  bpmnVisu.zoom(ZoomType.FitHorizontal);
};

// =====================================================================================================================
// PAN
// =====================================================================================================================
document.getElementById('btn-pan-up').onclick = function() {
  bpmnVisu.pan(PanType.VerticalUp);
};
document.getElementById('btn-pan-down').onclick = function() {
  bpmnVisu.pan(PanType.VerticalDown);
};
document.getElementById('btn-pan-left').onclick = function() {
  bpmnVisu.pan(PanType.HorizontalLeft);
};
document.getElementById('btn-pan-right').onclick = function() {
  bpmnVisu.pan(PanType.HorizontalRight);
};

// =====================================================================================================================
// General
// =====================================================================================================================
document.getElementById('btn-outline').onclick = function() {
  bpmnVisu.toggleOutline();
};

// =====================================================================================================================
// Actions
// =====================================================================================================================

document.getElementById('btn-export-preview').onclick = function() {
  // eslint-disable-next-line no-console
  console.info('button triggers preview');
  bpmnVisu.preview();
};
document.getElementById('btn-export-svg').onclick = function() {
  // eslint-disable-next-line no-console
  console.info('button triggers export svg');
  const svg = bpmnVisu.exportAsSvg();

  // TODO add ;charset=utf-8 ?
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  download('diagram.svg', 'data:image/svg+xml', svg);
};

// inspired from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename: string, contentType: string, text: string): void {
  const element = document.createElement('a');
  // only for svg
  if (contentType.startsWith('data:image/svg+xml')) {
    text = encodeURIComponent(text);
    contentType += ',';
  }

  element.setAttribute('href', contentType + text);
  element.setAttribute('download', filename);
  // TODO find a way to stay on the page to keep console logs (same issue with demo.bpmn.io)
  // element.setAttribute('target', '_blank');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  // TODO do this in a finally block
  document.body.removeChild(element);
}

// adapted from ES6 code from https://stackoverflow.com/a/23451803/3180025
//
// const input = "https://restcountries.eu/data/afg.svg"
// new SvgToPngConverter().convertFromInput(input, function(imgData){
//   // You now have your png data in base64 (imgData).
//   // Do what ever you wish with it here.
// });
// class SvgToPngConverter {
//   private canvas: HTMLCanvasElement;
//   private readonly imgPreview: HTMLImageElement;
//   private canvasCtx: CanvasRenderingContext2D;
//
//   constructor() {
//     this.canvas = document.createElement('canvas');
//     this.imgPreview = document.createElement('img');
//     this.imgPreview.setAttribute('style', 'position: absolute; top: -9999px');
//
//     document.body.appendChild(this.imgPreview);
//     this.canvasCtx = this.canvas.getContext('2d');
//   }
//
//   private cleanUp(): void {
//     document.body.removeChild(this.imgPreview);
//   }
//
//   public convertFromInput(input, callback): void {
//     // eslint-disable-next-line @typescript-eslint/no-this-alias
//     const _this = this;
//     this.imgPreview.onload = function() {
//       const img = new Image();
//       _this.canvas.width = _this.imgPreview.clientWidth;
//       _this.canvas.height = _this.imgPreview.clientHeight;
//       img.crossOrigin = 'anonymous';
//       img.src = _this.imgPreview.src;
//       img.onload = function() {
//         _this.canvasCtx.drawImage(img, 0, 0);
//         const imgData = _this.canvas.toDataURL('image/png');
//         if (typeof callback == 'function') {
//           callback(imgData);
//         }
//         // TODO do this in a finally block
//         _this.cleanUp();
//       };
//     };
//
//     this.imgPreview.src = input;
//   }
// }

document.getElementById('btn-export-png').onclick = function() {
  // eslint-disable-next-line no-console
  console.info('button triggers export png');
  const svg = bpmnVisu.exportAsSvg();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  svgToPNGBase64(svg);
  // const pngBase64 = svgToPNGBase64(svg);

  // eslint-disable-next-line no-console
  // console.info('@@@@png image as base64:', pngBase64);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  // download('diagram.png', svg);
};

// inspired from https://stackoverflow.com/a/58563482/3180025
//  Create svg blob and draw on canvas using .drawImage():
//
//     make canvas element
//     make a svgBlob object from the svg xml
//     make a url object from domUrl.createObjectURL(svgBlob);
//     create an Image object and assign url to image src
//     draw image into canvas
//     get png data string from canvas: canvas.toDataURL();
//
// see also https://stackoverflow.com/a/38019175/3180025
function svgToPNGBase64(svg: string): string {
  const canvas = document.createElement('canvas');

  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const imgPreview = document.createElement('img');
  imgPreview.setAttribute('style', 'position: absolute; top: -9999px');
  imgPreview.src = svgUrl;
  document.body.appendChild(imgPreview);
  const canvasCtx = canvas.getContext('2d');

  let svgToPNGBase64 = 'not set';
  imgPreview.onload = function() {
    // eslint-disable-next-line no-console
    console.info('call imgPreview.onload');
    const img = new Image();
    canvas.width = imgPreview.clientWidth;
    canvas.height = imgPreview.clientHeight;
    // img.crossOrigin = 'anonymous';
    img.src = imgPreview.src;
    img.onload = function() {
      // eslint-disable-next-line no-console
      console.info('call img.onload');
      canvasCtx.drawImage(img, 0, 0);
      // TODO find a way to improve quality of the export that is currently fuzzy
      svgToPNGBase64 = canvas.toDataURL('image/png');
      // TODO do this in a finally block
      document.body.removeChild(imgPreview);
      // eslint-disable-next-line no-console
      console.info('image data:', svgToPNGBase64);
      download('diagram.png', '', svgToPNGBase64);
    };
  };

  return svgToPNGBase64;
}
