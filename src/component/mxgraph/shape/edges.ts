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

import type { Point, AbstractCanvas2D } from '@maxgraph/core';
import { SvgCanvas2D, ConnectorShape } from '@maxgraph/core';

import type { BPMNCellStyle } from '../renderer/StyleComputer';

export class BpmnConnector extends ConnectorShape {
  constructor(points: Point[], stroke: string, strokewidth?: number) {
    super(points, stroke, strokewidth);
  }

  override paintEdgeShape(c: AbstractCanvas2D, pts: Point[]): void {
    // The indirection via functions for markers is needed in
    // order to apply the offsets before painting the line and
    // paint the markers after painting the line.
    const sourceMarker = this.createMarker(c, pts, true);
    const targetMarker = this.createMarker(c, pts, false);

    this.paintEdgeLine(c, pts);

    // Disables shadows, dashed styles
    c.setShadow(false);
    c.setDashed(false, false);

    if (sourceMarker != null) {
      c.setFillColor((this.style as BPMNCellStyle).bpmn?.edge?.startFillColor ?? this.stroke);
      sourceMarker();
    }

    if (targetMarker != null) {
      c.setFillColor((this.style as BPMNCellStyle).bpmn?.edge?.endFillColor ?? this.stroke);
      targetMarker();
    }
  }

  // taken from mxPolyline, required as we cannot call mxPolyline method here (parent of the parent)
  // we only support non STYLE_CURVED here (is possible with parent class)
  private paintEdgeLine(c: AbstractCanvas2D, pts: Point[]): void {
    const prev = getPointerEventsValue(c);
    setPointerEventsValue(c, 'stroke');
    this.paintLine(c, pts, this.isRounded);
    setPointerEventsValue(c, prev);
  }
}

function getPointerEventsValue(c: AbstractCanvas2D): string {
  return c instanceof SvgCanvas2D ? c.pointerEventsValue : null;
}

function setPointerEventsValue(c: AbstractCanvas2D, value: string): void {
  if (c instanceof SvgCanvas2D) {
    c.pointerEventsValue = value;
  }
}
