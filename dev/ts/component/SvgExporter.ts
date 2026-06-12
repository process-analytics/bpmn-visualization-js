/*
Copyright 2021 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { AbstractGraph, AlignValue, OverflowValue, TextDirectionValue, VAlignValue } from '@maxgraph/core';

import { Client, constants, domUtils, ImageExport, stringUtils, SvgCanvas2D, xmlUtils } from '@maxgraph/core';

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
  constructor(private readonly graph: AbstractGraph) {}

  exportSvg(): string {
    return this.doSvgExport(true);
  }

  exportSvgForPng(): string {
    // chrome and webkit: tainted canvas when svg contains foreignObject
    // also on brave --> probably fail on chromium based browsers
    // so disable foreign objects for such browsers
    const isFirefox = Client.IS_FF;
    return this.doSvgExport(isFirefox);
  }

  private doSvgExport(enableForeignObjectForLabel: boolean): string {
    const svgElement = this.computeSvg({ scale: 1, border: 25, enableForeignObjectForLabel: enableForeignObjectForLabel });
    const svgAsString = xmlUtils.getXml(svgElement);
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svgAsString}
`;
  }

  private computeSvg(svgExportOptions: SvgExportOptions): Element {
    const scale = svgExportOptions.scale ?? 1;
    const border = svgExportOptions.border ?? 0;
    const crisp = svgExportOptions.crisp ?? true;
    const enableForeignObjectForLabel = svgExportOptions.enableForeignObjectForLabel ?? true;

    const bounds = this.graph.getGraphBounds();
    const viewScale = this.graph.view.scale;

    // Prepares SVG document that holds the output
    const svgDocument = xmlUtils.createXmlDocument();
    const root = svgDocument.createElementNS(constants.NS_SVG, 'svg');

    const s = scale / viewScale;
    const w = Math.max(1, Math.ceil(bounds.width * s) + 2 * border);
    const h = Math.max(1, Math.ceil(bounds.height * s) + 2 * border);

    root.setAttribute('version', '1.1');
    root.setAttribute('width', w + 'px');
    root.setAttribute('height', h + 'px');
    root.setAttribute('viewBox', (crisp ? '-0.5 -0.5' : '0 0') + ' ' + w + ' ' + h);
    svgDocument.append(root);

    const group = svgDocument.createElementNS(constants.NS_SVG, 'g');
    root.append(group);

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

    const imgExport = new ImageExport();
    // FIXME only the first overlay is placed at the right position
    // overlays put on element of subprocess/call-activity are not placed correctly in svg export
    imgExport.includeOverlays = true;

    imgExport.drawState(this.graph.view.getState(this.graph.getDataModel().getRoot())!, svgCanvas);
    return root;
  }

  createSvgCanvas(node: SVGElement): SvgCanvas2D {
    const canvas = new CanvasForExport(node, true);
    // from the draw.io code, may not be needed here
    canvas.pointerEvents = true;
    return canvas;
  }
}

class CanvasForExport extends SvgCanvas2D {
  // Convert HTML entities
  private readonly htmlConverter = document.createElement('div');

  override getAlternateText(
    _fo: SVGForeignObjectElement,
    _x: number,
    _y: number,
    w: number,
    _h: number,
    str: string | Element,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _align: AlignValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _valign: VAlignValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _wrap: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _format: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _overflow: OverflowValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _clip: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _rotation: number,
  ): string {
    return this.computeTruncatedText(str, w);
  }

  override plainText(
    x: number,
    y: number,
    w: number,
    h: number,
    str: string,
    align: AlignValue,
    valign: VAlignValue,
    wrap: boolean,
    overflow: OverflowValue,
    clip: boolean,
    rotation: number,
    dir: TextDirectionValue,
  ): void {
    str = this.computeTruncatedText(str, w);
    super.plainText(x, y, w, h, str, align, valign, wrap, overflow, clip, rotation, dir);
  }

  private computeTruncatedText(str: string | Element, w: number): string {
    // Assumes a max character width of 0.5em
    if (str == null || this.state.fontSize <= 0) {
      return '';
    }
    if (str instanceof Element) {
      str = str.innerHTML;
    }

    try {
      this.htmlConverter.innerHTML = str;
      str = domUtils.extractTextWithWhitespace(Array.from(this.htmlConverter.childNodes) as Element[]);

      // Workaround for substring breaking double byte UTF
      const exp = Math.ceil((2 * w) / this.state.fontSize);
      const result = [];
      let length = 0;
      let index = 0;

      while ((exp == 0 || length < exp) && index < str.length) {
        const char = str.codePointAt(index);
        if (char == 10 || char == 13) {
          if (length > 0) {
            break;
          }
        } else {
          result.push(str.charAt(index));
          if (char! < 255) {
            length++;
          }
        }
        index++;
      }

      // Uses result and adds ellipsis if more than 1 char remains
      if (result.length < str.length && str.length - result.length > 1) {
        str = stringUtils.trim(result.join('')) + '...';
      }
    } catch (error) {
      console.warn('Error while computing txt label', error);
    }
    return str;
  }
}
