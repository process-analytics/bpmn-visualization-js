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

import { mxgraph } from '../../../src/component/mxgraph/initializer';
import type { mxGraph, mxSvgCanvas2D } from 'mxgraph';

interface SvgExportOptions {
  scale: number;
  border: number;
  crisp?: boolean; // TODO explain what it is? do we need it?
  enableForeignObjectForLabel: boolean;
  htmlLabels?: boolean;
}

// Inspired from
// https://github.com/jgraph/drawio/blob/v13.2.3/src/main/webapp/js/diagramly/EditorUi.js#L1756
// https://github.com/jgraph/drawio/blob/v14.7.7/src/main/webapp/js/diagramly/Editor.js#L5932
// https://github.com/jgraph/drawio/blob/v14.8.0/src/main/webapp/js/grapheditor/Graph.js#L9007
export class SvgExporter {
  constructor(private graph: mxGraph) {}

  public exportSvg(): string {
    return this.doSvgExport(true);
  }

  public exportSvgForPng(): string {
    // chrome and webkit: tainted canvas when svg contains foreignObject
    // also on brave --> probably fail on chromium based browsers
    // so disable foreign objects for such browsers
    const isFirefox = mxgraph.mxClient.IS_FF;
    return this.doSvgExport(isFirefox);
  }

  private doSvgExport(enableForeignObjectForLabel: boolean): string {
    const svgDocument = this.computeSvg({ scale: 1, border: 25, enableForeignObjectForLabel: enableForeignObjectForLabel });
    const svgAsString = mxgraph.mxUtils.getXml(svgDocument);
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svgAsString}
`;
  }

  private computeSvg(svgExportOptions: SvgExportOptions): XMLDocument {
    const scale = svgExportOptions.scale ?? 1;
    const border = svgExportOptions.border ?? 0;
    const crisp = svgExportOptions.crisp ?? true;
    const enableForeignObjectForLabel = svgExportOptions.enableForeignObjectForLabel ?? true;

    const bounds = this.graph.getGraphBounds();
    const viewScale = this.graph.view.scale;

    // Prepares SVG document that holds the output
    const svgDoc = mxgraph.mxUtils.createXmlDocument();
    const root = svgDoc.createElementNS(mxgraph.mxConstants.NS_SVG, 'svg');

    const s = scale / viewScale;
    const w = Math.max(1, Math.ceil(bounds.width * s) + 2 * border);
    const h = Math.max(1, Math.ceil(bounds.height * s) + 2 * border);

    root.setAttribute('version', '1.1');
    root.setAttribute('width', w + 'px');
    root.setAttribute('height', h + 'px');
    root.setAttribute('viewBox', (crisp ? '-0.5 -0.5' : '0 0') + ' ' + w + ' ' + h);
    svgDoc.appendChild(root);

    const group = svgDoc.createElementNS(mxgraph.mxConstants.NS_SVG, 'g');
    root.appendChild(group);

    const svgCanvas = this.createSvgCanvas(group);
    svgCanvas.foEnabled = enableForeignObjectForLabel;
    // Comments from draw.io
    // Renders graph. Offset will be multiplied with state's scale when painting state.
    // TextOffset only seems to affect FF output but used everywhere for consistency.
    svgCanvas.foOffset = crisp ? -0.5 : 0;
    svgCanvas.textOffset = crisp ? -0.5 : 0;
    svgCanvas.imageOffset = crisp ? -0.5 : 0;
    svgCanvas.translate(Math.floor((border / scale - bounds.x) / viewScale), Math.floor((border / scale - bounds.y) / viewScale));

    svgCanvas.scale(s);

    const imgExport = new mxgraph.mxImageExport();
    // FIXME only the first overlay is placed at the right position
    // overlays put on element of subprocess/call-activity are not placed correctly in svg export
    imgExport.includeOverlays = true;

    imgExport.drawState(this.graph.getView().getState(this.graph.model.root), svgCanvas);
    return svgDoc;
  }

  createSvgCanvas(node: Element): mxSvgCanvas2D {
    const canvas = new CanvasForExport(node);
    // from the draw.io code, may not be needed here
    canvas.pointerEvents = true;
    return canvas;
  }
}

class CanvasForExport extends mxgraph.mxSvgCanvas2D {
  // Convert HTML entities
  private htmlConverter = document.createElement('div');

  constructor(node: Element) {
    super(node);
  }

  getAlternateText(
    fo: Element,
    x: number,
    y: number,
    w: number,
    h: number,
    str: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    align: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valign: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wrap: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    format: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    overflow: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clip: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rotation: number,
  ): string {
    return this.computeTruncatedText(str, w);
  }

  plainText(
    x: number,
    y: number,
    w: number,
    h: number,
    str: string,
    align: string,
    valign: string,
    wrap: string,
    overflow: string,
    clip: string,
    rotation: number,
    dir: string,
  ): void {
    str = this.computeTruncatedText(str, w);
    super.plainText(x, y, w, h, str, align, valign, wrap, overflow, clip, rotation, dir);
  }

  private computeTruncatedText(str: string, w: number): string {
    // Assumes a max character width of 0.5em
    if (str == null || this.state.fontSize <= 0) {
      return '';
    }

    try {
      this.htmlConverter.innerHTML = str;
      str = mxgraph.mxUtils.extractTextWithWhitespace(this.htmlConverter.childNodes);

      // Workaround for substring breaking double byte UTF
      const exp = Math.ceil((2 * w) / this.state.fontSize);
      const result = [];
      let length = 0;
      let index = 0;

      while ((exp == 0 || length < exp) && index < str.length) {
        const char = str.charCodeAt(index);
        if (char == 10 || char == 13) {
          if (length > 0) {
            break;
          }
        } else {
          result.push(str.charAt(index));
          if (char < 255) {
            length++;
          }
        }
        index++;
      }

      // Uses result and adds ellipsis if more than 1 char remains
      if (result.length < str.length && str.length - result.length > 1) {
        str = mxgraph.mxUtils.trim(result.join('')) + '...';
      }
    } catch (e) {
      console.warn('Error while computing txt label', e);
    }
    return str;
  }
}
