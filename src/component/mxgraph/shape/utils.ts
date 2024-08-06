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

import type { mxShape, mxSvgCanvas2D } from 'mxgraph';

import { mxConstants } from '../initializer';
import { computeAllBpmnClassNamesOfCell } from '../renderer/style-utils';
import { BpmnStyleIdentifier } from '../style';

export const overrideCreateSvgCanvas = function (shape: mxShape): void {
  const originalShapeCreateSvgCanvas = shape.createSvgCanvas;
  shape.createSvgCanvas = function (): mxSvgCanvas2D {
    const canvas = originalShapeCreateSvgCanvas.bind(this)();

    // getTextCss is only used when creating foreignObject for label, so there is no impact on SVG text that we use for Overlays (Apply to mxgraph@4.2.2)
    const originalCanvasGetTextCss = canvas.getTextCss;
    canvas.getTextCss = function (): string {
      const originalPointerEvents = this.pointerEvents;
      // Fix for issue https://github.com/process-analytics/bpmn-visualization-js/issues/920
      // This sets the "pointer-events" style property to "none" to avoid capturing the click.
      // This cannot be generalized for all mxgraph use cases. For instance, in an editor mode, we should be able to edit the text by clicking on it.
      this.pointerEvents = false;

      const textCss = originalCanvasGetTextCss.bind(this)();
      this.pointerEvents = originalPointerEvents;
      return textCss;
    };

    // The following elements are required to add custom attributes to identify BPMN elements in the DOM
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

    return canvas;
  };
};
