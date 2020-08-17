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

import { Config, Drawable, OpSet, Options, ResolvedOptions } from 'roughjs/bin/core';
import { SketchySvgCanvas } from './SketchySvgCanvas';
import { RoughGenerator } from 'roughjs/bin/generator';

// choose to use RoughCanvas to inherit from the general drawing method
// + get access to Drawable object
export class RoughJsAdaptor {
  private gen: RoughGenerator;

  // constructor(readonly c: mxSvgCanvas2D, config?: Config) {
  constructor(readonly c: SketchySvgCanvas, readonly config?: Config) {
    this.gen = new RoughGenerator(config);
  }

  // implementation taken from the draw.io adaptation
  draw(drawable: Drawable): void {
    const sets = drawable.sets || [];
    const o = drawable.options || this.getDefaultOptions();

    for (let i = 0; i < sets.length; i++) {
      const drawing = sets[i];

      switch (drawing.type) {
        case 'path':
          if (o.stroke != null) {
            this._drawToContext(drawing, o);
          }
          break;
        case 'fillPath':
          this._drawToContext(drawing, o);
          break;
        case 'fillSketch':
          this._fillSketch(drawing, o);
          break;
      }
    }
  }

  // draw.io
  private _fillSketch(drawing: OpSet, o: ResolvedOptions): void {
    const strokeColor = this.c.state.strokeColor;
    const strokeWidth = this.c.state.strokeWidth;
    const strokeAlpha = this.c.state.strokeAlpha;
    const dashed = this.c.state.dashed;
    const fixDash = this.c.state.fixDash;

    let fweight = o.fillWeight;
    if (fweight < 0) {
      fweight = o.strokeWidth / 2;
    }

    this.c.setStrokeAlpha(this.c.state.fillAlpha);
    this.c.setStrokeColor(o.fill || '');
    this.c.setStrokeWidth(fweight);
    this.c.setDashed(false, fixDash);

    this._drawToContext(drawing, o);
    // this._drawToContext(ctx, drawing, o);

    this.c.setDashed(dashed, fixDash);
    this.c.setStrokeWidth(strokeWidth);
    this.c.setStrokeColor(strokeColor);
    this.c.setStrokeAlpha(strokeAlpha);
  }

  //RoughCanvas
  // private fillSketch(ctx: CanvasRenderingContext2D, drawing: OpSet, o: ResolvedOptions) {
  //   let fweight = o.fillWeight;
  //   if (fweight < 0) {
  //     fweight = o.strokeWidth / 2;
  //   }
  //   ctx.save();
  //   if (o.fillLineDash) {
  //     ctx.setLineDash(o.fillLineDash);
  //   }
  //   if (o.fillLineDashOffset) {
  //     ctx.lineDashOffset = o.fillLineDashOffset;
  //   }
  //   ctx.strokeStyle = o.fill || '';
  //   ctx.lineWidth = fweight;
  //   this._drawToContext(ctx, drawing);
  //   ctx.restore();
  // }

  private _drawToContext(drawing: OpSet, o: ResolvedOptions): void {
    this.c.begin();

    for (let i = 0; i < drawing.ops.length; i++) {
      const item = drawing.ops[i];
      const data = item.data;

      switch (item.op) {
        case 'move':
          this.c.moveTo(data[0], data[1]);
          break;
        case 'bcurveTo':
          this.c.curveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
          break;
        case 'lineTo':
          this.c.lineTo(data[0], data[1]);
          break;
      }
    }

    this.c.end();

    if (drawing.type === 'fillPath' && o.fill) {
      this.c.fill();
    } else {
      this.c.stroke();
    }
  }

  // copied from RoughCanvas 4.X.X

  get generator(): RoughGenerator {
    return this.gen;
  }

  getDefaultOptions(): ResolvedOptions {
    return this.gen.defaultOptions;
  }

  // line(x1: number, y1: number, x2: number, y2: number, options?: Options): Drawable {
  //   const d = this.gen.line(x1, y1, x2, y2, options);
  //   this.draw(d);
  //   return d;
  // }
  //
  // rectangle(x: number, y: number, width: number, height: number, options?: Options): Drawable {
  //   const d = this.gen.rectangle(x, y, width, height, options);
  //   this.draw(d);
  //   return d;
  // }
  //
  // ellipse(x: number, y: number, width: number, height: number, options?: Options): Drawable {
  //   const d = this.gen.ellipse(x, y, width, height, options);
  //   this.draw(d);
  //   return d;
  // }
  //
  // circle(x: number, y: number, diameter: number, options?: Options): Drawable {
  //   const d = this.gen.circle(x, y, diameter, options);
  //   this.draw(d);
  //   return d;
  // }
  //
  // linearPath(points: Point[], options?: Options): Drawable {
  //   const d = this.gen.linearPath(points, options);
  //   this.draw(d);
  //   return d;
  // }
  //
  // polygon(points: Point[], options?: Options): Drawable {
  //   const d = this.gen.polygon(points, options);
  //   this.draw(d);
  //   return d;
  // }
  //
  // arc(x: number, y: number, width: number, height: number, start: number, stop: number, closed: boolean = false, options?: Options): Drawable {
  //   const d = this.gen.arc(x, y, width, height, start, stop, closed, options);
  //   this.draw(d);
  //   return d;
  // }
  //
  // curve(points: Point[], options?: Options): Drawable {
  //   const d = this.gen.curve(points, options);
  //   this.draw(d);
  //   return d;
  // }
  //
  path(d: string, options?: Options): Drawable {
    const drawing = this.gen.path(d, options);
    this.draw(drawing);
    return drawing;
  }
}

/*

Editor.createRoughCanvas = function(c)
{
  var rc = rough.canvas(
    {
      // Provides expected function but return value is not used
      getContext: function()
      {
        return c;
      }
    });

  rc.draw = function(drawable)
  {
    var sets = drawable.sets || [];
    var o = drawable.options || this.getDefaultOptions();

    for (var i = 0; i < sets.length; i++)
    {
      var drawing = sets[i];

      switch (drawing.type)
      {
        case 'path':
          if (o.stroke != null)
          {
            this._drawToContext(c, drawing, o);
          }
          break;
        case 'fillPath':
          this._drawToContext(c, drawing, o);
          break;
        case 'fillSketch':
          this.fillSketch(c, drawing, o);
          break;
      }
    }
  };
*/

/*
  rc.fillSketch = function(ctx, drawing, o)
  {
    var strokeColor = this.c.state.strokeColor;
    var strokeWidth = this.c.state.strokeWidth;
    var strokeAlpha = this.c.state.strokeAlpha;
    var dashed = this.c.state.dashed;

    var fweight = o.fillWeight;
    if (fweight < 0)
    {
      fweight = o.strokeWidth / 2;
    }

    this.c.setStrokeAlpha(c.state.fillAlpha);
    this.c.setStrokeColor(o.fill || '');
    this.c.setStrokeWidth(fweight);
    this.c.setDashed(false);

    this._drawToContext(ctx, drawing, o);

    this.c.setDashed(dashed);
    this.c.setStrokeWidth(strokeWidth);
    this.c.setStrokeColor(strokeColor);
    this.c.setStrokeAlpha(strokeAlpha);
  };

  rc._drawToContext = function(ctx, drawing, o)
  {
    ctx.begin();

    for (var i = 0; i < drawing.ops.length; i++)
    {
      var item = drawing.ops[i];
      var data = item.data;

      switch (item.op)
      {
        case 'move':
          ctx.moveTo(data[0], data[1]);
          break;
        case 'bcurveTo':
          ctx.curveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
          break;
        case 'lineTo':
          ctx.lineTo(data[0], data[1]);
          break;
      }
    };

    ctx.end();

    if (drawing.type === 'fillPath' && o.filled)
    {
      ctx.fill();
    }
    else
    {
      ctx.stroke();
    }
  };

  return rc;
};
*/

/*
  private gen: RoughGenerator;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, config?: Config) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.gen = new RoughGenerator(config);
  }

  draw(drawable: Drawable) {
    const sets = drawable.sets || [];
    const o = drawable.options || this.getDefaultOptions();
    const ctx = this.ctx;
    for (const drawing of sets) {
      switch (drawing.type) {
        case 'path':
          ctx.save();
          ctx.strokeStyle = o.stroke === 'none' ? 'transparent' : o.stroke;
          ctx.lineWidth = o.strokeWidth;
          if (o.strokeLineDash) {
            ctx.setLineDash(o.strokeLineDash);
          }
          if (o.strokeLineDashOffset) {
            ctx.lineDashOffset = o.strokeLineDashOffset;
          }
          this._drawToContext(ctx, drawing);
          ctx.restore();
          break;
        case 'fillPath':
          ctx.save();
          ctx.fillStyle = o.fill || '';
          const fillRule: CanvasFillRule = (drawable.shape === 'curve' || drawable.shape === 'polygon') ? 'evenodd' : 'nonzero';
          this._drawToContext(ctx, drawing, fillRule);
          ctx.restore();
          break;
        case 'fillSketch':
          this.fillSketch(ctx, drawing, o);
          break;
      }
    }
  }

  private fillSketch(ctx: CanvasRenderingContext2D, drawing: OpSet, o: ResolvedOptions) {
    let fweight = o.fillWeight;
    if (fweight < 0) {
      fweight = o.strokeWidth / 2;
    }
    ctx.save();
    if (o.fillLineDash) {
      ctx.setLineDash(o.fillLineDash);
    }
    if (o.fillLineDashOffset) {
      ctx.lineDashOffset = o.fillLineDashOffset;
    }
    ctx.strokeStyle = o.fill || '';
    ctx.lineWidth = fweight;
    this._drawToContext(ctx, drawing);
    ctx.restore();
  }

  private _drawToContext(ctx: CanvasRenderingContext2D, drawing: OpSet, rule: CanvasFillRule = 'nonzero') {
    ctx.beginPath();
    for (const item of drawing.ops) {
      const data = item.data;
      switch (item.op) {
        case 'move':
          ctx.moveTo(data[0], data[1]);
          break;
        case 'bcurveTo':
          ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
          break;
        case 'lineTo':
          ctx.lineTo(data[0], data[1]);
          break;
      }
    }
    if (drawing.type === 'fillPath') {
      ctx.fill(rule);
    } else {
      ctx.stroke();
    }
  }

  get generator(): RoughGenerator {
    return this.gen;
  }

  getDefaultOptions(): ResolvedOptions {
    return this.gen.defaultOptions;
  }

  line(x1: number, y1: number, x2: number, y2: number, options?: Options): Drawable {
    const d = this.gen.line(x1, y1, x2, y2, options);
    this.draw(d);
    return d;
  }

  rectangle(x: number, y: number, width: number, height: number, options?: Options): Drawable {
    const d = this.gen.rectangle(x, y, width, height, options);
    this.draw(d);
    return d;
  }

  ellipse(x: number, y: number, width: number, height: number, options?: Options): Drawable {
    const d = this.gen.ellipse(x, y, width, height, options);
    this.draw(d);
    return d;
  }

  circle(x: number, y: number, diameter: number, options?: Options): Drawable {
    const d = this.gen.circle(x, y, diameter, options);
    this.draw(d);
    return d;
  }

  linearPath(points: Point[], options?: Options): Drawable {
    const d = this.gen.linearPath(points, options);
    this.draw(d);
    return d;
  }

  polygon(points: Point[], options?: Options): Drawable {
    const d = this.gen.polygon(points, options);
    this.draw(d);
    return d;
  }

  arc(x: number, y: number, width: number, height: number, start: number, stop: number, closed: boolean = false, options?: Options): Drawable {
    const d = this.gen.arc(x, y, width, height, start, stop, closed, options);
    this.draw(d);
    return d;
  }

  curve(points: Point[], options?: Options): Drawable {
    const d = this.gen.curve(points, options);
    this.draw(d);
    return d;
  }

  path(d: string, options?: Options): Drawable {
    const drawing = this.gen.path(d, options);
    this.draw(drawing);
    return drawing;
  }



 */
