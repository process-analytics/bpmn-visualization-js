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

import rough from 'roughjs';

export class RoughJsAdaptor {
  constructor(readonly mxSvgCanvas2D: mxSvgCanvas2D) {}

  private init(): void {
    //const theMxCanvas = this.mxSvgCanvas2D;
    const rc = rough.canvas(null, {
      // Provides expected function but return value is not used
      // getContext: () => any {
      //   return this.mxSvgCanvas2D;
      // },
    });

    rc.getDefaultOptions();

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

  rc.fillSketch = function(ctx, drawing, o)
  {
    var strokeColor = c.state.strokeColor;
    var strokeWidth = c.state.strokeWidth;
    var strokeAlpha = c.state.strokeAlpha;
    var dashed = c.state.dashed;

    var fweight = o.fillWeight;
    if (fweight < 0)
    {
      fweight = o.strokeWidth / 2;
    }

    c.setStrokeAlpha(c.state.fillAlpha);
    c.setStrokeColor(o.fill || '');
    c.setStrokeWidth(fweight);
    c.setDashed(false);

    this._drawToContext(ctx, drawing, o);

    c.setDashed(dashed);
    c.setStrokeWidth(strokeWidth);
    c.setStrokeColor(strokeColor);
    c.setStrokeAlpha(strokeAlpha);
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
