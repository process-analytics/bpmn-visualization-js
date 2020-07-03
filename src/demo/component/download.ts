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

// inspired from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
export function download(filename: string, contentType: string, text: string): void {
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
export function svgToPNGBase64(svg: string): string {
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
