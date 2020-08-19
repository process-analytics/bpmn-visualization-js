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
import { Drawable, Options } from 'roughjs/bin/core';
import { RoughJsAdaptor } from './RoughJsAdaptor';

export class SketchySvgCanvas extends mxSvgCanvas2D {
  passThrough = false;
  private nextShape: Drawable;
  private readonly roughJS: RoughJsAdaptor;

  constructor(node: HTMLElement, readonly shape: mxShape) {
    super(node);
    this.roughJS = new RoughJsAdaptor(this);


    // TODO is this needed? from draw.io
    // Avoids "spikes" in the output
    // this.canvas.setLineJoin('round');
    // this.canvas.setLineCap('round');
  }

  // TODO rename toRoughJsStyle
  // TODO rename arguments?
  private getStyle(stroke: boolean, fill: boolean): Options {
    // TODO seed to ensure that there is no randomness for a given cell: same rendering after translation, scale or accross reload
    //  if we want to introduce this feature, let's defined a style entry to make this configurable 'roughjsSeedActivated'
    // See https://roughjs.com/posts/release-4.0/

    // implementation from draw.io based on the cell ID
    // // Random seed created from cell ID
    // var seed = 1;
    //
    // if (this.shape.state != null)
    // {
    //   var str = this.shape.state.cell.id;
    //
    //   if (str != null)
    //   {
    //     for (var i = 0; i < str.length; i++)
    //     {
    //       seed = ((seed << 5) - seed + str.charCodeAt(i)) << 0;
    //     }
    //   }
    // }

    const style: Options = { strokeWidth: this.state.strokeWidth };
    // TODO rename into roughDefaultOptions
    const defs = this.roughJS.getDefaultOptions();

    if (stroke) {
      style.stroke = this.state.strokeColor === 'none' ? 'transparent' : this.state.strokeColor;
    } else {
      delete style.stroke;
    }

    let gradient = null;
    if (fill) {
      style.fill = this.state.fillColor === 'none' ? '' : this.state.fillColor;
      gradient = this.state.gradientColor === 'none' ? null : this.state.gradientColor;
    }

    // Applies cell style
    style['bowing'] = mxUtils.getValue(this.shape.style, 'bowing', defs['bowing']);
    style['hachureAngle'] = mxUtils.getValue(this.shape.style, 'hachureAngle', defs['hachureAngle']);
    style['curveFitting'] = mxUtils.getValue(this.shape.style, 'curveFitting', defs['curveFitting']);
    style['roughness'] = mxUtils.getValue(this.shape.style, 'roughness', defs['roughness']);
    style['simplification'] = mxUtils.getValue(this.shape.style, 'simplification', defs['simplification']);
    style['disableMultiStroke'] = mxUtils.getValue(this.shape.style, 'disableMultiStroke', defs['disableMultiStroke']);
    style['disableMultiStrokeFill'] = mxUtils.getValue(this.shape.style, 'disableMultiStrokeFill', defs['disableMultiStrokeFill']);

    const hachureGap = mxUtils.getValue(this.shape.style, 'hachureGap', -1);
    style['hachureGap'] = hachureGap == 'auto' ? -1 : hachureGap;
    style['dashGap'] = mxUtils.getValue(this.shape.style, 'dashGap', hachureGap);
    style['dashOffset'] = mxUtils.getValue(this.shape.style, 'dashOffset', hachureGap);
    style['zigzagOffset'] = mxUtils.getValue(this.shape.style, 'zigzagOffset', hachureGap);

    const fillWeight = mxUtils.getValue(this.shape.style, 'fillWeight', -1);
    style['fillWeight'] = fillWeight == 'auto' ? -1 : fillWeight;

    let fillStyle = mxUtils.getValue(this.shape.style, 'fillStyle', 'auto');

    if (fillStyle == 'auto') {
      // defaultPageBackgroundColor is draw.io specific
      fillStyle = style.fill != null && gradient != null ? 'solid' : defs['fillStyle'];
    }

    style['fillStyle'] = fillStyle;

    return style;
  }

  begin(): void {
    if (this.passThrough) {
      super.begin();
    } else {
      this.path = [];
      // TODO in super, lastX and lastY set to 0: no changes when adding that
      // this.lastX = 0;
      // this.lastY = 0;
    }
  }

  // end(): void {
  //   if (this.passThrough) {
  //     super.end();
  //   } else {
  //     // do nothing
  //   }
  // }

  // internal method
  // TODO rename into addOp (signature is wrong in mxgraph-type-definitions 1.0.4)
  // TODO remove custom implementation for action except the one that directly call roughjs
  // They are not needed because the addOp will behave correctly regarding translation/scaling with the new implementation below
  // that acts correctly whether we are in 'passthrough' or not
  private _addOp(actions: unknown[]): void {
    if (this.path != null) {
      // console.error('@@custom addOp - not null path');
      this.path.push(actions[0] as string);

      if (actions.length > 2) {
        const s = this.state;

        for (let i = 2; i < actions.length; i += 2) {
          this.lastX = actions[i - 1] as number;
          this.lastY = actions[i] as number;

          // from the mxAbstractCanvas2D.prototype.addOp implementation
          if (this.passThrough) {
            // manage translation and scaling
            this.path.push(String(this.format(String((this.lastX + s.dx) * s.scale))));
            this.path.push(String(this.format(String((this.lastY + s.dy) * s.scale))));
          } else {
            this.path.push(String(this.format(String(this.lastX))));
            this.path.push(String(this.format(String(this.lastY))));
          }
        }
      }
    }
  }

  lineTo(x: number, y: number): void {
    if (this.passThrough) {
      // console.error('#### custom lineTo - passThrough');
      super.lineTo(x, y);
    } else {
      // console.error('#### custom lineTo - manual');
      this._addOp([this.lineOp, x, y]);
      // console.error(`#### custom lineTo - after - this.lastX: ${this.lastX} / this.lastY: ${this.lastY} / x: ${x} / y: ${y}`);

      // in original draw.io implem but managed by _addOp
      // this.lastX = x;
      // this.lastY = y;
      // console.error(`#### custom lineTo - after extra 'last coordinates' set`);
    }
  }

  moveTo(x: number, y: number): void {
    if (this.passThrough) {
      // console.error('#### custom moveTo - passThrough');
      super.moveTo(x, y);
    } else {
      // console.error('#### custom moveTo - manual');
      this._addOp([this.moveOp, x, y]);
      // this.lastX = x;
      // this.lastY = y;
      // TODO is this really needed, never called later + don't exist in super class
      // this.firstX = x;
      // this.firstY = y;
    }
  }

  close(): void {
    if (this.passThrough) {
      // console.error('#### custom close - passThrough');
      super.close();
    } else {
      // console.error('#### custom close - manual');
      // super.close();
      this._addOp([this.closeOp]);
    }
  }
  //
  quadTo(x1: number, y1: number, x2: number, y2: number): void {
    if (this.passThrough) {
      super.quadTo(x1, y1, x2, y2);
    } else {
      this._addOp([this.quadOp, x1, y1, x2, y2]);
      // super.quadTo(x1, y1, x2, y2);
      // this.lastX = x2;
      // this.lastY = y2;
    }
  }

  curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
    if (this.passThrough) {
      super.curveTo(x1, y1, x2, y2, x3, y3);
    } else {
      this._addOp([this.curveOp, x1, y1, x2, y2, x3, y3]);
      // super.curveTo(x1, y1, x2, y2, x3, y3);
      // this.lastX = x3;
      // this.lastY = y3;
    }
  }

  // arcTo(rx: number, ry: number, angle: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): void {
  //   if (this.passThrough) {
  //     super.arcTo(rx, ry, angle, largeArcFlag, sweepFlag, x, y);
  //   } else {
  //     // var curves = mxUtils.arcToCurves(this.lastX, this.lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y);
  //     //
  //     // if (curves != null)
  //     // {
  //     //   for (var i = 0; i < curves.length; i += 6)
  //     //   {
  //     //     this.curveTo(curves[i], curves[i + 1], curves[i + 2],
  //     //       curves[i + 3], curves[i + 4], curves[i + 5]);
  //     //   }
  //     // }
  //     super.arcTo(rx, ry, angle, largeArcFlag, sweepFlag, x, y);
  //
  //     this.lastX = x;
  //     this.lastY = y;
  //   }
  // }

  rect(x: number, y: number, w: number, h: number): void {
    if (this.passThrough) {
      // console.error('#### custom rect - passThrough');
      super.rect(x, y, w, h);
    } else {
      // console.error('#### custom rect - manual');
      this.path = [];
      this.nextShape = this.roughJS.generator.rectangle(x, y, w, h, this.getStyle(true, true));
    }
  }

  ellipse(x: number, y: number, w: number, h: number): void {
    if (this.passThrough) {
      // console.error('#### custom ellipse - passThrough');
      super.ellipse(x, y, w, h);
    } else {
      // console.error('#### custom ellipse - manual');
      this.path = [];
      this.nextShape = this.roughJS.generator.ellipse(x + w / 2, y + h / 2, w, h, this.getStyle(true, true));
    }
  }

  // Redefine the implementation because
  // the original one applies scaling on dx/dy and scaling must be applied after roughjs processing
  // we need that the rounded parts goes through roughjs
  roundrect(x: number, y: number, w: number, h: number, dx: number, dy: number): void {
    if (this.passThrough) {
      // console.error('#### custom RoundRect - passThrough');
      super.roundrect(x, y, w, h, dx, dy);
    } else {
      // console.error('#### custom RoundRect - manual');
      this.begin();
      this.moveTo(x + dx, y);
      this.lineTo(x + w - dx, y);
      this.quadTo(x + w, y, x + w, y + dy);
      this.lineTo(x + w, y + h - dy);
      this.quadTo(x + w, y + h, x + w - dx, y + h);
      this.lineTo(x + dx, y + h);
      this.quadTo(x, y + h, x, y + h - dy);
      this.lineTo(x, y + dy);
      this.quadTo(x, y, x + dx, y);
    }
  }

  private drawPath(style: Options): void {
    if (this.path.length > 0) {
      this.passThrough = true;
      try {
        this.roughJS.path(this.path.join(' '), style);
      } catch (e) {
        // ignore
      }
      this.passThrough = false;
    } else if (this.nextShape != null) {
      for (const key in style) {
        // here we know this is a valid operation
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.nextShape.options[key] = style[key];
      }

      if (style['stroke'] == null) {
        delete this.nextShape.options['stroke'];
      }

      if (!style.fill) {
        delete this.nextShape.options['fill'];
      }

      this.passThrough = true;
      this.roughJS.draw(this.nextShape);
      this.passThrough = false;
    }
  }

  stroke(): void {
    if (this.passThrough) {
      super.stroke();
    } else {
      this.drawPath(this.getStyle(true, false));
    }
  }

  fill(): void {
    if (this.passThrough) {
      super.fill();
    } else {
      this.drawPath(this.getStyle(false, true));
    }
  }

  fillAndStroke(): void {
    if (this.passThrough) {
      super.fillAndStroke();
    } else {
      this.drawPath(this.getStyle(true, true));
    }
  }
}
