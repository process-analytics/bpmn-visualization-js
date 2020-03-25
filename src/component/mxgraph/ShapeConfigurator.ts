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
import { MxGraphFactoryService } from '../../service/MxGraphFactoryService';
import { mxgraph } from 'ts-mxgraph';
import { ShapeBpmnElementKind } from '../../model/bpmn/shape/ShapeBpmnElementKind';
import EndEventShape from './shape/EndEventShape';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ShapeConfigurator {
  private mxShape: any = MxGraphFactoryService.getMxGraphProperty('mxShape');
  //private mxCellRenderer: mxgraph.mxCellRenderer = MxGraphFactoryService.getMxGraphProperty('mxCellRenderer');

  public configure(): void {
    mxgraph.mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_START, EndEventShape);
  }

  public initMxShapePrototype(isFF: boolean): void {
    // this change is needed for adding the custom attributes that permits identification of the BPMN elements
    this.mxShape.prototype.createSvgCanvas = function() {
      const mxSvgCanvas2D: any = MxGraphFactoryService.getMxGraphProperty('mxSvgCanvas2D');
      const canvas = new mxSvgCanvas2D(this.node, false);
      canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
      canvas.pointerEventsValue = this.svgPointerEvents;
      canvas.blockImagePointerEvents = isFF;
      const off = this.getSvgScreenOffset();

      if (off != 0) {
        this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
      } else {
        this.node.removeAttribute('transform');
      }

      // add attributes to be able to identify elements in DOM
      if (this.state && this.state.cell) {
        this.node.setAttribute('class', 'class-state-cell-style-' + this.state.cell.style);
        this.node.setAttribute('data-cell-id', this.state.cell.id);
      }
      //
      canvas.minStrokeWidth = this.minSvgStrokeWidth;

      if (!this.antiAlias) {
        // Rounds all numbers in the SVG output to integers
        canvas.format = function(value: string) {
          return Math.round(parseFloat(value));
        };
      }

      return canvas;
    };
  }
}
