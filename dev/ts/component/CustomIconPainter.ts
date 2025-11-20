/*
Copyright 2025 Bonitasoft S.A.

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

import type { PaintParameter } from '../../../src/component/mxgraph/shape/render';

import { IconPainter } from '../../../src/component/mxgraph/shape/render';

// Taken from https://github.com/process-analytics/bpmn-visualization-examples/blob/v0.47.0/examples/custom-bpmn-theme/custom-user-task-icon/index.js#L9
export class CustomIconPainter extends IconPainter {
  // adapted from https://github.com/primer/octicons/blob/638c6683c96ec4b357576c7897be8f19c933c052/icons/person.svg
  // use mxgraph-svg2shape to generate the code from the svg
  override paintPersonIcon(paintParameter: PaintParameter): void {
    const canvas = this.newBpmnCanvas(paintParameter, { height: 13, width: 12 });
    // this way of doing subject to change in the future (probably by setting the fillColor in the icon style configuration)
    paintParameter.canvas.setFillColor('orange');

    canvas.begin();
    canvas.moveTo(12, 13);
    canvas.arcTo(1, 1, 0, 0, 1, 11, 14);
    canvas.lineTo(1, 14);
    canvas.arcTo(1, 1, 0, 0, 1, 0, 13);
    canvas.lineTo(0, 12);
    canvas.curveTo(0, 9.37, 4, 8, 4, 8);
    canvas.curveTo(4, 8, 4.23, 8, 4, 8);
    canvas.curveTo(3.16, 6.38, 3.06, 5.41, 3, 3);
    canvas.curveTo(3.17, 0.59, 4.87, 0, 6, 0);
    canvas.curveTo(7.13, 0, 8.83, 0.59, 9, 3);
    canvas.curveTo(8.94, 5.41, 8.84, 6.38, 8, 8);
    canvas.curveTo(8, 8, 12, 9.37, 12, 12);
    canvas.lineTo(12, 13);
    canvas.close();
    canvas.fill();
  }
}
