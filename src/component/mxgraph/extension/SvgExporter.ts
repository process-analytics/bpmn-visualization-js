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

import { mxgraph } from 'ts-mxgraph';

// TODO missing in mxgraph-type-definitions@1.0.2
declare const mxImageExport: typeof mxgraph.mxImageExport;
// missing 'intersects' method in mxgraph-type-definitions@1.0.2
declare const mxUtils: typeof mxgraph.mxUtils;

// https://github.com/jgraph/drawio/blob/v13.2.3/src/main/webapp/js/diagramly/EditorUi.js#L1756
// https://github.com/jgraph/drawio/blob/v13.2.3/src/main/webapp/js/mxgraph/Graph.js#L7780
export default class SvgExporter {
  constructor(readonly graph: mxGraph) {}

  public exportSvg(): string {
    const svgRoot = this.getSvg(1, 0, true, false, true, true, null, null, false);
    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + mxUtils.getXml(svgRoot)
    );
  }

  private createSvgImageExport(): mxgraph.mxImageExport {
    return new mxImageExport();
    // const exp = new mxImageExport();

    // Adds hyperlinks (experimental)
    // exp.getLinkForCellState = mxUtils.bind(this, function(state, canvas)
    // {
    //     return this.getLinkForCell(state.cell);
    // });

    // return exp;
  }

  private getSvg(
    // background: string,
    scale: number,
    border: number,
    nocrop: boolean,
    crisp: boolean,
    ignoreSelection: boolean,
    showText: boolean,
    imgExport: mxgraph.mxImageExport,
    linkTarget: string,
    hasShadow: boolean,
  ): Element {
    //Disable Css Transforms if it is used
    // const origUseCssTrans = this.useCssTransforms;
    //
    // if (origUseCssTrans) {
    //     this.useCssTransforms = false;
    //     this.view.revalidate();
    //     this.sizeDidChange();
    // }

    try {
      scale = scale != null ? scale : 1;
      border = border != null ? border : 0;
      crisp = crisp != null ? crisp : true;
      ignoreSelection = ignoreSelection != null ? ignoreSelection : true;
      showText = showText != null ? showText : true;

      const bounds = ignoreSelection || nocrop ? this.graph.getGraphBounds() : this.graph.getBoundingBox(this.graph.getSelectionCells());

      if (bounds == null) {
        throw Error('drawing is empty');
      }

      const vs = this.graph.view.scale;

      // Prepares SVG document that holds the output
      const svgDoc: XMLDocument = mxUtils.createXmlDocument();
      const root = svgDoc.createElementNS != null ? svgDoc.createElementNS(mxConstants.NS_SVG, 'svg') : svgDoc.createElement('svg');

      // if (background != null) {
      //   if (root.style != null) {
      //     root.style.backgroundColor = background;
      //   } else {
      //     root.setAttribute('style', 'background-color:' + background);
      //   }
      // }

      if (svgDoc.createElementNS == null) {
        root.setAttribute('xmlns', mxConstants.NS_SVG);
        root.setAttribute('xmlns:xlink', mxConstants.NS_XLINK);
      } else {
        // KNOWN: Ignored in IE9-11, adds namespace for each image element instead. No workaround.
        root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', mxConstants.NS_XLINK);
      }

      const s = scale / vs;
      const w = Math.max(1, Math.ceil(bounds.width * s) + 2 * border) + (hasShadow ? 5 : 0);
      const h = Math.max(1, Math.ceil(bounds.height * s) + 2 * border) + (hasShadow ? 5 : 0);

      root.setAttribute('version', '1.1');
      root.setAttribute('width', w + 'px');
      root.setAttribute('height', h + 'px');
      root.setAttribute('viewBox', (crisp ? '-0.5 -0.5' : '0 0') + ' ' + w + ' ' + h);
      svgDoc.appendChild(root);

      // Renders graph. Offset will be multiplied with state's scale when painting state.
      // TextOffset only seems to affect FF output but used everywhere for consistency.
      const group = svgDoc.createElementNS != null ? svgDoc.createElementNS(mxConstants.NS_SVG, 'g') : svgDoc.createElement('g');
      root.appendChild(group);

      const svgCanvas = this.createSvgCanvas(group);
      svgCanvas.foOffset = crisp ? -0.5 : 0;
      svgCanvas.textOffset = crisp ? -0.5 : 0;
      svgCanvas.imageOffset = crisp ? -0.5 : 0;
      svgCanvas.translate(Math.floor((border / scale - bounds.x) / vs), Math.floor((border / scale - bounds.y) / vs));

      // Convert HTML entities
      // const htmlConverter = document.createElement('div');

      // Adds simple text fallback for viewers with no support for foreignObjects
      // const getAlternateText = svgCanvas.getAlternateText;
      // svgCanvas.getAlternateText = function(fo, x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation) {
      //   // Assumes a max character width of 0.5em
      //   if (str != null && this.state.fontSize > 0) {
      //     try {
      //       if (mxUtils.isNode(str)) {
      //         str = str.innerText;
      //       } else {
      //         htmlConverter.innerHTML = str;
      //         str = mxUtils.extractTextWithWhitespace(htmlConverter.childNodes);
      //       }
      //
      //       // Workaround for substring breaking double byte UTF
      //       const exp = Math.ceil((2 * w) / this.state.fontSize);
      //       const result = [];
      //       let length = 0;
      //       let index = 0;
      //
      //       while ((exp == 0 || length < exp) && index < str.length) {
      //         const char = str.charCodeAt(index);
      //
      //         if (char == 10 || char == 13) {
      //           if (length > 0) {
      //             break;
      //           }
      //         } else {
      //           result.push(str.charAt(index));
      //
      //           if (char < 255) {
      //             length++;
      //           }
      //         }
      //
      //         index++;
      //       }
      //
      //       // Uses result and adds ellipsis if more than 1 char remains
      //       if (result.length < str.length && str.length - result.length > 1) {
      //         str = mxUtils.trim(result.join('')) + '...';
      //       }
      //
      //       return str;
      //     } catch (e) {
      //       return getAlternateText.apply(this, arguments);
      //     }
      //   } else {
      //     return getAlternateText.apply(this, arguments);
      //   }
      // };

      // Paints background image
      const bgImg = this.graph.backgroundImage;

      if (bgImg != null) {
        const s2 = vs / scale;
        const tr = this.graph.view.translate;
        const tmp = new mxRectangle(tr.x * s2, tr.y * s2, bgImg.width * s2, bgImg.height * s2);

        // Checks if visible
        if (mxUtils.intersects(bounds, tmp)) {
          svgCanvas.image(tr.x, tr.y, bgImg.width, bgImg.height, bgImg.src, true, undefined, undefined);
        }
      }

      svgCanvas.scale(s);
      svgCanvas.textEnabled = showText;

      imgExport = imgExport != null ? imgExport : this.createSvgImageExport();
      const imgExportDrawCellState = imgExport.drawCellState;

      // Ignores custom links
      const imgExportGetLinkForCellState = imgExport.getLinkForCellState;

      imgExport.getLinkForCellState = function(state, canvas) {
        const result = imgExportGetLinkForCellState.apply(this, [state, canvas]);

        return result != null && !state.view.graph.isCustomLink(result) ? result : null;
      };

      // Implements ignoreSelection flag
      imgExport.drawCellState = function(state, canvas) {
        const graph = state.view.graph;
        let selected = graph.isCellSelected(state.cell);
        let parent = graph.model.getParent(state.cell);

        // Checks if parent cell is selected
        while (!ignoreSelection && !selected && parent != null) {
          selected = graph.isCellSelected(parent);
          parent = graph.model.getParent(parent);
        }

        if (ignoreSelection || selected) {
          imgExportDrawCellState.apply(this, [state, canvas]);
        }
      };

      imgExport.drawState(this.graph.getView().getState(this.graph.model.root), svgCanvas);
      this.updateSvgLinks(root, linkTarget, true);
      // this.addForeignObjectWarning(svgCanvas, root);

      return root;
    } finally {
      // if (origUseCssTrans) {
      //   this.useCssTransforms = true;
      //   this.view.revalidate();
      //   this.sizeDidChange();
      // }
    }
  }

  /**
   * Hook for creating the canvas used in getSvg.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private updateSvgLinks(node: Element, target: string, removeCustom: boolean): void {
    const links = node.getElementsByTagName('a');

    for (let i = 0; i < links.length; i++) {
      let href = links[i].getAttribute('href');

      if (href == null) {
        href = links[i].getAttribute('xlink:href');
      }

      if (href != null) {
        if (target != null && /^https?:\/\//.test(href)) {
          links[i].setAttribute('target', target);
        }
        // else if (removeCustom && this.isCustomLink(href)) {
        //   links[i].setAttribute('href', 'javascript:void(0);');
        // }
      }
    }
  }

  /**
   * Hook for creating the canvas used in getSvg.
   */
  createSvgCanvas(node: Element): mxSvgCanvas2D {
    const canvas = new mxSvgCanvas2D(node);

    canvas.pointerEvents = true;

    return canvas;
  }
}

// /**
//  * Adds warning for truncated labels in older viewers.
//  */
// Graph.prototype.addForeignObjectWarning = function(canvas, root) {
//   if (root.getElementsByTagName('foreignObject').length > 0) {
//     const sw = canvas.createElement('switch');
//     const g1 = canvas.createElement('g');
//     g1.setAttribute('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility');
//     const a = canvas.createElement('a');
//     a.setAttribute('transform', 'translate(0,-5)');
//
//     // Workaround for implicit namespace handling in HTML5 export, IE adds NS1 namespace so use code below
//     // in all IE versions except quirks mode. KNOWN: Adds xlink namespace to each image tag in output.
//     if (a.setAttributeNS == null || (root.ownerDocument != document && document.documentMode == null)) {
//       a.setAttribute('xlink:href', Graph.foreignObjectWarningLink);
//       a.setAttribute('target', '_blank');
//     } else {
//       a.setAttributeNS(mxConstants.NS_XLINK, 'xlink:href', Graph.foreignObjectWarningLink);
//       a.setAttributeNS(mxConstants.NS_XLINK, 'target', '_blank');
//     }
//
//     const text = canvas.createElement('text');
//     text.setAttribute('text-anchor', 'middle');
//     text.setAttribute('font-size', '10px');
//     text.setAttribute('x', '50%');
//     text.setAttribute('y', '100%');
//     mxUtils.write(text, Graph.foreignObjectWarningText);
//
//     sw.appendChild(g1);
//     a.appendChild(text);
//     sw.appendChild(a);
//     root.appendChild(sw);
//   }
// };
