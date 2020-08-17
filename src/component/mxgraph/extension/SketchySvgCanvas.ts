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
  //export class SketchySvgCanvas extends mxAbstractCanvas2D {
  private passThrough = false;
  private nextShape: Drawable;
  private readonly roughJS: RoughJsAdaptor;

  // TODO see if we use RoughCanvas, RoughSvg, or Generator directly
  // TODO we mainly only need style info, mxShape only used to get the mxCell id
  constructor(node: HTMLElement, readonly shape: mxShape) {
    //constructor(readonly canvas: mxSvgCanvas2D, readonly shape: mxShape) {
    super(node);
    // TODO build RoughJSAdaptor
    this.roughJS = new RoughJsAdaptor(this);

    // Same as in the mxSvgCanvas2D
    // this.moveOp = 'M';
    // this.lineOp = 'L';
    // this.quadOp = 'Q';
    // this.curveOp = 'C';
    // this.closeOp = 'Z';

    // TODO is this needed?
    // Avoids "spikes" in the output
    // this.canvas.setLineJoin('round');
    // this.canvas.setLineCap('round');
  }

  // TODO rename toRoughJsStyle
  // TODO rename arguments?
  private getStyle(stroke: boolean, fill: boolean): Options {
    // TODO only if we want to introduce randomNess (extract in a dedicated method and activate only if asked via mxGraph style)

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

    // , seed: seed
    const style: Options = { strokeWidth: this.state.strokeWidth };
    // TODO rename into roughDefaultOptions
    const defs = this.roughJS.getDefaultOptions();

    if (stroke) {
      style.stroke = this.state.strokeColor === 'none' ? 'transparent' : this.state.strokeColor;
    } else {
      delete style.stroke;
    }

    let gradient = null;
    //style.fill = fill;

    if (fill) {
      style.fill = this.state.fillColor === 'none' ? '' : this.state.fillColor;
      gradient = this.state.gradientColor === 'none' ? null : this.state.gradientColor;
      // } else {
      //   style.fill == '';
    }

    // Applies cell style
    style['bowing'] = mxUtils.getValue(this.shape.style, 'bowing', defs['bowing']);
    style['hachureAngle'] = mxUtils.getValue(this.shape.style, 'hachureAngle', defs['hachureAngle']);
    style['curveFitting'] = mxUtils.getValue(this.shape.style, 'curveFitting', defs['curveFitting']);
    style['roughness'] = mxUtils.getValue(this.shape.style, 'jiggle', defs['roughness']);
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
      // const bg = this.shape.state != null ? this.shape.state.view.graph.defaultPageBackgroundColor : '#ffffff';
      // fillStyle = style.fill != null && (gradient != null || (bg != null && style.fill.toLowerCase() == bg.toLowerCase())) ? 'solid' : defs['fillStyle'];
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
      // TODO in super, lastX and lastY set to 0
    }
  }

  end(): void {
    if (this.passThrough) {
      super.end();
    } else {
      // do nothing
    }
  }

  // TODO check if needed, only difference with original implem: no scaling and
  //     this.path.push(this.format((this.lastX + s.dx) * s.scale));
  //     this.path.push(this.format((this.lastY + s.dy) * s.scale));

  // TODO wrong method signature
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // addOp(arguments: string[]): void {
  //   if (this.path != null) {
  //     this.path.push(arguments[0]);
  //
  //     if (arguments.length > 2) {
  //       // const s = this.canvas.state;
  //
  //       for (let i = 2; i < arguments.length; i += 2) {
  //         this.lastX = (arguments[i - 1] as unknown) as number;
  //         this.lastY = (arguments[i] as unknown) as number;
  //
  //         this.path.push(String(this.canvas.format(String(this.lastX))));
  //         this.path.push(String(this.canvas.format(String(this.lastY))));
  //       }
  //     }
  //   }
  // }

  lineTo(x: number, y: number): void {
    if (this.passThrough) {
      super.lineTo(x, y);
    } else {
      super.lineTo(x, y);
      this.lastX = x;
      this.lastY = y;
    }
  }

  moveTo(x: number, y: number): void {
    if (this.passThrough) {
      super.moveTo(x, y);
    } else {
      super.moveTo(x, y);
      this.lastX = x;
      this.lastY = y;
      // TODO is this really needed, never called later + don't exist in super class
      // this.firstX = x;
      // this.firstY = y;
    }
  }

  close(): void {
    if (this.passThrough) {
      super.close();
    } else {
      super.close();
    }
  }

  quadTo(x1: number, y1: number, x2: number, y2: number): void {
    if (this.passThrough) {
      super.quadTo(x1, y1, x2, y2);
    } else {
      super.quadTo(x1, y1, x2, y2);
      this.lastX = x2;
      this.lastY = y2;
    }
  }

  curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
    if (this.passThrough) {
      super.curveTo(x1, y1, x2, y2, x3, y3);
    } else {
      super.curveTo(x1, y1, x2, y2, x3, y3);
      this.lastX = x3;
      this.lastY = y3;
    }
  }

  arcTo(rx: number, ry: number, angle: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): void {
    if (this.passThrough) {
      super.arcTo(rx, ry, angle, largeArcFlag, sweepFlag, x, y);
    } else {
      // var curves = mxUtils.arcToCurves(this.lastX, this.lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y);
      //
      // if (curves != null)
      // {
      //   for (var i = 0; i < curves.length; i += 6)
      //   {
      //     this.curveTo(curves[i], curves[i + 1], curves[i + 2],
      //       curves[i + 3], curves[i + 4], curves[i + 5]);
      //   }
      // }
      super.arcTo(rx, ry, angle, largeArcFlag, sweepFlag, x, y);

      this.lastX = x;
      this.lastY = y;
    }
  }

  rect(x: number, y: number, w: number, h: number): void {
    if (this.passThrough) {
      super.rect(x, y, w, h);
    } else {
      this.path = [];
      this.nextShape = this.roughJS.generator.rectangle(x, y, w, h, this.getStyle(true, true));
    }
  }

  ellipse(x: number, y: number, w: number, h: number): void {
    if (this.passThrough) {
      super.ellipse(x, y, w, h);
    } else {
      this.path = [];
      this.nextShape = this.roughJS.generator.ellipse(x + w / 2, y + h / 2, w, h, this.getStyle(true, true));
    }
  }

  roundrect(x: number, y: number, w: number, h: number, dx: number, dy: number): void {
    if (this.passThrough) {
      super.roundrect(x, y, w, h, dx, dy);
    } else {
      // TODO check why we redefine this
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

/*

// Adds handJiggle style (jiggle=n sets jiggle)
function RoughCanvas(canvas, rc, shape)
{
  this.canvas = canvas;
  this.rc = rc;
  this.shape = shape;

  // Avoids "spikes" in the output
  this.canvas.setLineJoin('round');
  this.canvas.setLineCap('round');

  this.originalBegin = this.canvas.begin;
  this.canvas.begin = mxUtils.bind(this, RoughCanvas.prototype.begin);

  this.originalEnd = this.canvas.end;
  this.canvas.end = mxUtils.bind(this, RoughCanvas.prototype.end);

  this.originalRect = this.canvas.rect;
  this.canvas.rect = mxUtils.bind(this, RoughCanvas.prototype.rect);

  this.originalRoundrect = this.canvas.roundrect;
  this.canvas.roundrect = mxUtils.bind(this, RoughCanvas.prototype.roundrect);

  this.originalEllipse = this.canvas.ellipse;
  this.canvas.ellipse = mxUtils.bind(this, RoughCanvas.prototype.ellipse);

  this.originalLineTo = this.canvas.lineTo;
  this.canvas.lineTo = mxUtils.bind(this, RoughCanvas.prototype.lineTo);

  this.originalMoveTo = this.canvas.moveTo;
  this.canvas.moveTo = mxUtils.bind(this, RoughCanvas.prototype.moveTo);

  this.originalQuadTo = this.canvas.quadTo;
  this.canvas.quadTo = mxUtils.bind(this, RoughCanvas.prototype.quadTo);

  this.originalCurveTo = this.canvas.curveTo;
  this.canvas.curveTo = mxUtils.bind(this, RoughCanvas.prototype.curveTo);

  this.originalArcTo = this.canvas.arcTo;
  this.canvas.arcTo = mxUtils.bind(this, RoughCanvas.prototype.arcTo);

  this.originalClose = this.canvas.close;
  this.canvas.close = mxUtils.bind(this, RoughCanvas.prototype.close);

  this.originalFill = this.canvas.fill;
  this.canvas.fill = mxUtils.bind(this, RoughCanvas.prototype.fill);

  this.originalStroke = this.canvas.stroke;
  this.canvas.stroke = mxUtils.bind(this, RoughCanvas.prototype.stroke);

  this.originalFillAndStroke = this.canvas.fillAndStroke;
  this.canvas.fillAndStroke = mxUtils.bind(this, RoughCanvas.prototype.fillAndStroke);

  this.path = [];
  this.passThrough = false;
};

RoughCanvas.prototype.moveOp = 'M';
RoughCanvas.prototype.lineOp = 'L';
RoughCanvas.prototype.quadOp = 'Q';
RoughCanvas.prototype.curveOp = 'C';
RoughCanvas.prototype.closeOp = 'Z';

RoughCanvas.prototype.getStyle = function(stroke, fill)
{
  // Random seed created from cell ID
  var seed = 1;

  if (this.shape.state != null)
  {
    var str = this.shape.state.cell.id;

    if (str != null)
    {
      for (var i = 0; i < str.length; i++)
      {
        seed = ((seed << 5) - seed + str.charCodeAt(i)) << 0;
      }
    }
  }

  var style = {strokeWidth: this.canvas.state.strokeWidth, seed: seed};
  var defs = this.rc.getDefaultOptions();

  if (stroke)
  {
    style.stroke = this.canvas.state.strokeColor === 'none' ? 'transparent' : this.canvas.state.strokeColor;
  }
  else
  {
    delete style.stroke;
  }

  var gradient = null;
  style.filled = fill;

  if (fill)
  {
    style.fill = this.canvas.state.fillColor === 'none' ? '' : this.canvas.state.fillColor;
    gradient = this.canvas.state.gradientColor === 'none' ? null : this.canvas.state.gradientColor;
  }
  else
  {
    style.fill == '';
  }

  // Applies cell style
  style['bowing'] = mxUtils.getValue(this.shape.style, 'bowing', defs['bowing']);
  style['hachureAngle'] = mxUtils.getValue(this.shape.style, 'hachureAngle', defs['hachureAngle']);
  style['curveFitting'] = mxUtils.getValue(this.shape.style, 'curveFitting', defs['curveFitting']);
  style['roughness'] = mxUtils.getValue(this.shape.style, 'jiggle', defs['roughness']);
  style['simplification'] = mxUtils.getValue(this.shape.style, 'simplification', defs['simplification']);
  style['disableMultiStroke'] = mxUtils.getValue(this.shape.style, 'disableMultiStroke', defs['disableMultiStroke']);
  style['disableMultiStrokeFill'] = mxUtils.getValue(this.shape.style, 'disableMultiStrokeFill', defs['disableMultiStrokeFill']);

  var hachureGap = mxUtils.getValue(this.shape.style, 'hachureGap', -1);
  style['hachureGap'] = (hachureGap == 'auto') ? -1 : hachureGap;
  style['dashGap'] = mxUtils.getValue(this.shape.style, 'dashGap', hachureGap);
  style['dashOffset'] = mxUtils.getValue(this.shape.style, 'dashOffset', hachureGap);
  style['zigzagOffset'] = mxUtils.getValue(this.shape.style, 'zigzagOffset', hachureGap);

  var fillWeight = mxUtils.getValue(this.shape.style, 'fillWeight', -1);
  style['fillWeight'] = (fillWeight == 'auto') ? -1 : fillWeight;

  var fillStyle = mxUtils.getValue(this.shape.style, 'fillStyle', 'auto');

  if (fillStyle == 'auto')
  {
    var bg = (this.shape.state != null) ? this.shape.state.view.graph.defaultPageBackgroundColor : '#ffffff';

    fillStyle = (style.fill != null && (gradient != null || (bg != null &&
      style.fill.toLowerCase() == bg.toLowerCase()))) ? 'solid' : defs['fillStyle']
  }

  style['fillStyle'] = fillStyle;

  return style;
};

RoughCanvas.prototype.begin = function()
{
  if (this.passThrough)
  {
    this.originalBegin.apply(this.canvas, arguments);
  }
  else
  {
    this.path = [];
  }
};
*/

/*
RoughCanvas.prototype.end = function()
{
  if (this.passThrough)
  {
    this.originalEnd.apply(this.canvas, arguments);
  }
  else
  {
    // do nothing
  }
};

RoughCanvas.prototype.addOp = function()
{
  if (this.path != null)
  {
    this.path.push(arguments[0]);

    if (arguments.length > 2)
    {
      var s = this.canvas.state;

      for (var i = 2; i < arguments.length; i += 2)
      {
        this.lastX = arguments[i - 1];
        this.lastY = arguments[i];

        this.path.push(this.canvas.format((this.lastX)));
        this.path.push(this.canvas.format((this.lastY)));
      }
    }
  }
};
*/

/*

RoughCanvas.prototype.lineTo = function(endX, endY)
{
  if (this.passThrough)
  {
    this.originalLineTo.apply(this.canvas, arguments);
  }
  else
  {
    this.addOp(this.lineOp, endX, endY);
    this.lastX = endX;
    this.lastY = endY;
  }
};


RoughCanvas.prototype.moveTo = function(endX, endY)
{
  if (this.passThrough)
  {
    this.originalMoveTo.apply(this.canvas, arguments);
  }
  else
  {
    this.addOp(this.moveOp, endX, endY);
    this.lastX = endX;
    this.lastY = endY;
    this.firstX = endX;
    this.firstY = endY;
  }
};

RoughCanvas.prototype.close = function()
{
  if (this.passThrough)
  {
    this.originalClose.apply(this.canvas, arguments);
  }
  else
  {
    this.addOp(this.closeOp);
  }
};
*/

/*
RoughCanvas.prototype.quadTo = function(x1, y1, x2, y2)
{
  if (this.passThrough)
  {
    this.originalQuadTo.apply(this.canvas, arguments);
  }
  else
  {
    this.addOp(this.quadOp, x1, y1, x2, y2);
    this.lastX = x2;
    this.lastY = y2;
  }
};

RoughCanvas.prototype.curveTo = function(x1, y1, x2, y2, x3, y3)
{
  if (this.passThrough)
  {
    this.originalCurveTo.apply(this.canvas, arguments);
  }
  else
  {
    this.addOp(this.curveOp, x1, y1, x2, y2, x3, y3);
    this.lastX = x3;
    this.lastY = y3;
  }
};
*/
/*
RoughCanvas.prototype.arcTo = function(rx, ry, angle, largeArcFlag, sweepFlag, x, y)
{
  if (this.passThrough)
  {
    this.originalArcTo.apply(this.canvas, arguments);
  }
  else
  {
    var curves = mxUtils.arcToCurves(this.lastX, this.lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y);

    if (curves != null)
    {
      for (var i = 0; i < curves.length; i += 6)
      {
        this.curveTo(curves[i], curves[i + 1], curves[i + 2],
          curves[i + 3], curves[i + 4], curves[i + 5]);
      }
    }

    this.lastX = x;
    this.lastY = y;
  }
};
*/
/*
RoughCanvas.prototype.rect = function(x, y, w, h)
{
  if (this.passThrough)
  {
    this.originalRect.apply(this.canvas, arguments);
  }
  else
  {
    this.path = [];
    this.nextShape = this.rc.generator.rectangle(x, y, w, h, this.getStyle(true, true));
  }
};

*/

/*

RoughCanvas.prototype.ellipse = function(x, y, w, h)
{
  if (this.passThrough)
  {
    this.originalEllipse.apply(this.canvas, arguments);
  }
  else
  {
    this.path = [];
    this.nextShape = this.rc.generator.ellipse(x + w / 2, y + h / 2, w, h, this.getStyle(true, true));
  }
};
*/

/*
RoughCanvas.prototype.roundrect = function(x, y, w, h, dx, dy)
{
  if (this.passThrough)
  {
    this.originalRoundrect.apply(this.canvas, arguments);
  }
  else
  {
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
};
*/

/*
RoughCanvas.prototype.drawPath = function(style)
{
  if (this.path.length > 0)
  {
    this.passThrough = true;
    try
    {
      this.rc.path(this.path.join(' '), style);
    }
    catch (e)
    {
      // ignore
    }
    this.passThrough = false;
  }
  else if (this.nextShape != null)
  {
    for (var key in style)
    {
      this.nextShape.options[key] = style[key];
    }

    if (style['stroke'] == null)
    {
      delete this.nextShape.options['stroke'];
    }

    if (!style.filled)
    {
      delete this.nextShape.options['fill'];
    }

    this.passThrough = true;
    this.rc.draw(this.nextShape);
    this.passThrough = false;
  }
};
*/

/*
RoughCanvas.prototype.stroke = function()
{
  if (this.passThrough)
  {
    this.originalStroke.apply(this.canvas, arguments);
  }
  else
  {
    this.drawPath(this.getStyle(true, false));
  }
};

RoughCanvas.prototype.fill = function()
{
  if (this.passThrough)
  {
    this.originalFill.apply(this.canvas, arguments);
  }
  else
  {
    this.drawPath(this.getStyle(false, true));
  }
};

RoughCanvas.prototype.fillAndStroke = function()
{
  if (this.passThrough)
  {
    this.originalFillAndStroke.apply(this.canvas, arguments);
  }
  else
  {
    this.drawPath(this.getStyle(true, true));
  }
};

RoughCanvas.prototype.destroy = function()
{
  this.canvas.lineTo = this.originalLineTo;
  this.canvas.moveTo = this.originalMoveTo;
  this.canvas.close = this.originalClose;
  this.canvas.quadTo = this.originalQuadTo;
  this.canvas.curveTo = this.originalCurveTo;
  this.canvas.arcTo = this.originalArcTo;
  this.canvas.close = this.originalClose;
  this.canvas.fill = this.originalFill;
  this.canvas.stroke = this.originalStroke;
  this.canvas.fillAndStroke = this.originalFillAndStroke;
  this.canvas.begin = this.originalBegin;
  this.canvas.end = this.originalEnd;
  this.canvas.rect = this.originalRect;
  this.canvas.ellipse = this.originalEllipse;
  this.canvas.roundrect = this.originalRoundrect;
};






 */
