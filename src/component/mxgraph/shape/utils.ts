/*
Copyright 2024 Bonitasoft S.A.

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

import type { mxShape } from 'mxgraph';

import { mxConstants, mxSvgCanvas2D } from '../initializer';
import { computeAllBpmnClassNamesOfCell } from '../renderer/style-utils';
import { BpmnStyleIdentifier } from '../style';

export const overrideCreateSvgCanvas = function (shape: mxShape): void {
  // The following is copied from the mxgraph mxShape implementation then converted to TypeScript and enriched for bpmn-visualization
  // It is needed for adding the custom attributes that permits identification of the BPMN elements in the DOM
  shape.createSvgCanvas = function () {
    // START bpmn-visualization CUSTOMIZATION
    // use custom canvas implementation
    const canvas = new SvgCanvas2D(this.node, false);
    // END bpmn-visualization CUSTOMIZATION
    canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
    canvas.pointerEventsValue = this.svgPointerEvents;
    const off = this.getSvgScreenOffset();

    if (off == 0) {
      this.node.removeAttribute('transform');
    } else {
      this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
    }

    // START bpmn-visualization CUSTOMIZATION
    // add attributes to be able to identify elements in DOM
    if (this.state?.cell) {
      // 'this.state.style' = the style definition associated with the cell
      // 'this.state.cell.style' = the style applied to the cell: 1st element: style name = bpmn shape name
      const cell = this.state.cell;
      // dialect = strictHtml is set means that current node holds an HTML label
      const allBpmnClassNames = computeAllBpmnClassNamesOfCell(cell, this.dialect === mxConstants.DIALECT_STRICTHTML);
      const extraCssClasses = this.state.style[BpmnStyleIdentifier.EXTRA_CSS_CLASSES];
      if (typeof extraCssClasses == 'string') {
        allBpmnClassNames.push(...extraCssClasses.split(','));
      }

      this.node.setAttribute('class', allBpmnClassNames.join(' '));
      this.node.dataset.bpmnId = this.state.cell.id;
    }
    // END bpmn-visualization CUSTOMIZATION
    canvas.minStrokeWidth = this.minSvgStrokeWidth;

    if (!this.antiAlias) {
      // Rounds all numbers in the SVG output to integers
      canvas.format = function (value: string) {
        // eslint-disable-next-line unicorn/prefer-number-properties -- mxGraph code
        return Math.round(parseFloat(value));
      };
    }

    return canvas;
  };
};

class SvgCanvas2D extends mxSvgCanvas2D {
  // getTextCss is only used when creating foreignObject for label, so there is no impact on svg text that we use for Overlays.
  // Analysis done for mxgraph@4.1.1, still apply to mxgraph@4.2.2
  override getTextCss(): string {
    const originalPointerEvents = this.pointerEvents;
    // Fix for issue https://github.com/process-analytics/bpmn-visualization-js/issues/920
    // This sets the "pointer-events" style property to "none" to avoid capturing the click.
    // This cannot be generalized for all mxgraph use cases. For instance, in an editor mode, we should be able to edit the text by clicking on it.
    this.pointerEvents = false;

    const textCss = super.getTextCss();
    this.pointerEvents = originalPointerEvents;
    return textCss;
  }
}
