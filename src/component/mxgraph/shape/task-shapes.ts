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

import { MxGraphFactoryService } from '../../../service/MxGraphFactoryService';
import { mxgraph } from 'ts-mxgraph';
import { StyleConstant } from '../StyleConfigurator';

const mxRectangleShape: typeof mxgraph.mxRectangleShape = MxGraphFactoryService.getMxGraphProperty('mxRectangleShape');

abstract class BaseTaskShape extends mxRectangleShape {
  // TODO we need to declare this field here because it is missing in the current mxShape type definition
  isRounded: boolean;

  protected constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number = StyleConstant.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
    // enforced by BPMN
    this.isRounded = true;
  }

  public paintForeground(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintForeground(c, x, y, w, h);
    this.paintTaskIcon(c, x, y, w, h);
  }

  protected abstract paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void;
}

export class TaskShape extends BaseTaskShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // No symbol for the BPMN Task
  }
}

export class ServiceTaskShape extends BaseTaskShape {
  public constructor(bounds: mxgraph.mxRectangle, fill: string, stroke: string, strokewidth: number) {
    super(bounds, fill, stroke, strokewidth);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected paintTaskIcon(c: mxgraph.mxXmlCanvas2D, x: number, y: number, w: number, h: number): void {
    // TODO : To implement
  }
}
