/**
 * Copyright 2021 Bonitasoft S.A.
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
import { logDownload } from '../helper';

// inspired from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename: string, contentType: string, text: string): void {
  const downloadLink = document.createElement('a');
  // only for svg
  if (contentType.startsWith('data:image/svg+xml')) {
    text = encodeURIComponent(text);
    contentType += ',';
  }

  downloadLink.setAttribute('href', contentType + text);
  downloadLink.setAttribute('download', filename);

  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);

  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export function downloadAsSvg(svg: string): void {
  logDownload('Start SVG download');
  download('diagram.svg', 'data:image/svg+xml', svg);
  logDownload('Download completed');
}

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
export function downloadAsPng(svg: string): void {
  logDownload('Start PNG download');
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  // The image preview here is only needed to get the image dimension
  // Alternative: get the width and height values from the svg attributes
  const imgPreview = document.createElement('img');
  imgPreview.setAttribute('style', 'position: absolute; top: -9999px');
  imgPreview.crossOrigin = 'anonymous';
  document.body.appendChild(imgPreview);

  const canvas = document.createElement('canvas');
  const canvasCtx = canvas.getContext('2d');

  imgPreview.onload = function () {
    const img = new Image();
    // B.2.0 not fully exported with client width/height, so use natural width/height
    canvas.width = imgPreview.naturalWidth;
    canvas.height = imgPreview.naturalHeight;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      canvasCtx.drawImage(img, 0, 0);
      URL.revokeObjectURL(svgUrl);
      const pngInBase64 = canvas.toDataURL('image/png');
      document.body.removeChild(imgPreview);
      download('diagram.png', '', pngInBase64);
      logDownload('Download completed');
    };
    img.src = imgPreview.src;
  };
  imgPreview.src = svgUrl;
}
