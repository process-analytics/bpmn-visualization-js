import { ModelConfig, IGroup as GGroup, IShape } from '@antv/g6';

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

export function drawTextAnnotation(): (cfg?: ModelConfig, group?: GGroup) => IShape {
  return (cfg, group): IShape => {
    const color = cfg.error ? '#F4664A' : '#30BF78';
    const r = 5;
    const width = (cfg.size as number[])[0];
    const height = (cfg.size as number[])[1];
    const shape = group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        stroke: color,
        radius: r,
      },
      name: 'main-box',
      draggable: true,
    });

    group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height: height / 3,
        fill: color,
        radius: [r, r, 0, 0],
      },
      name: 'title-box',
      draggable: true,
    });

    // title text
    group.addShape('text', {
      attrs: {
        textBaseline: 'top',
        y: 2,
        x: 24,
        lineHeight: 20,
        text: cfg.title,
        fill: '#fff',
      },
      name: 'title',
    });
    return shape;
  };
}

/*
import { StyleDefault } from '../StyleUtils';
import { mxgraph } from '../initializer';
import { mxAbstractCanvas2D, mxRectangle } from 'mxgraph'; // for types

/!**
 * @internal
 *!/
export class TextAnnotationShape extends mxgraph.mxRectangleShape {
  private readonly TEXT_ANNOTATION_BORDER_LENGTH = 10;
  public constructor(bounds: mxRectangle, fill: string, stroke: string, strokewidth: number = StyleDefault.STROKE_WIDTH_THIN) {
    super(bounds, fill, stroke, strokewidth);
  }

  public paintBackground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    // paint sort of left square bracket shape - for text annotation
    c.begin();
    c.moveTo(x + this.TEXT_ANNOTATION_BORDER_LENGTH, y);
    c.lineTo(x, y);
    c.lineTo(x, y + h);
    c.lineTo(x + this.TEXT_ANNOTATION_BORDER_LENGTH, y + h);

    c.fillAndStroke();
  }
}
*/
