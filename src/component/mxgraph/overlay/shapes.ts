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
import { mxgraph } from '../initializer';
import { mxAbstractCanvas2D, mxRectangle } from 'mxgraph';
import { MxGraphCustomOverlayStyle } from './custom-overlay';

/* eslint-disable no-console */
export class OverlayBadgeShape extends mxgraph.mxText {
  // TODO to remove when typed-mxgraph@1.0.1 mxText definitions won't declare these fields as protected (prevent assign OverlayBadgeShape instances as mxShape)
  spacing: number;
  bounds: mxRectangle;
  // end of typed-mxgraph issue

  // TODO remove the bounds parameter
  // should always be set in the constructor
  constructor(value: string, bounds: mxRectangle, style: MxGraphCustomOverlayStyle) {
    super(
      value,
      bounds,
      mxgraph.mxConstants.ALIGN_CENTER,
      mxgraph.mxConstants.ALIGN_MIDDLE,
      style.font.color,
      undefined,
      style.font.size,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined, // fill color delegated to background shape
      undefined, // stroke color delegated to background shape
    );
    console.info(`@@@@constructor - value ##${this.value}##`);
    this.fillOpacity = style.fill.opacity;
    this.fill = style.fill.color;

    this.stroke = style.stroke.color;
    this.strokewidth = style.stroke.width;
    console.info('@@@@constructor - strokewidth', this.strokewidth);

    // This for both stroke, fill and font for the mxText part
    // this.opacity = 50;

    // TODO manage padding/spacing with configuration
    // the following is taken from mxText but not use in svg generation (canvas and renderer)
    // this.labelPadding = 4;

    // const old = this.spacing;
    // this.spacing = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING, this.spacing));
    // this.spacingTop = 12; //(this.spacingTop - old)) + this.spacing;
    // this.spacingRight = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_RIGHT, this.spacingRight - old)) + this.spacing;
    // this.spacingBottom = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_BOTTOM, this.spacingBottom - old)) + this.spacing;
    // this.spacingLeft = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_LEFT, this.spacingLeft - old)) + this.spacing;
  }

  paint(c: mxAbstractCanvas2D): void {
    // mimic super.paint that calls mxShape.updateTransform
    c.scale(this.scale);
    this.configureBackgroundShapeCanvas(c);
    this.paintBackgroundShape(c);
    c.scale(1 / this.scale); // restore initial value

    // paint text
    super.paint(c);
  }

  private configureBackgroundShapeCanvas(c: mxAbstractCanvas2D): void {
    console.info('@@@configureBackgroundShapeCanvas');
    super.configureCanvas(c, 0, 0, 0, 0);
    // TODO strange this should have been configure in super.configureCanvas
    // otherwise, the value is default (1) * scale
    c.setStrokeWidth(this.strokewidth);
  }

  configureCanvas(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    console.info('@@@configureCanvas');
    super.configureCanvas(c, x, y, w, h);
    // delegate border and background colors to the background shape
    c.setFontBackgroundColor(null);
    c.setFontBorderColor(null); // unset this to display the text border
  }

  // this is the method that will be implemented by each overlay shape implementation
  private paintBackgroundShape(c: mxAbstractCanvas2D): void {
    // this should be passed to the method to avoid calling it in all implementations
    const textBbox = this.computeTextBbox();

    // rectangle
    c.rect(textBbox.x, textBbox.y, textBbox.width, textBbox.height);
    c.fillAndStroke();

    // ellipse
    // c.ellipse(textBbox.x, textBbox.y, textBbox.width, textBbox.height);
    // c.fillAndStroke();

    // circle
    // const circleWidth = Math.max(textBbox.width, textBbox.height);
    // // TODO for circle, the x and y position need to be updated accordingly
    // c.ellipse(textBbox.x, textBbox.y, circleWidth, circleWidth);
    // c.fillAndStroke();
  }

  // implementation inspired of mxSvgCanvas2D.prototype.addTextBackground
  // TODO do we need to use mxShape.augmentBoundingBox?
  private computeTextBbox(): mxRectangle {
    // Scale is passed-through to canvas
    const s = this.scale;
    let x = this.bounds.x / s;
    let y = this.bounds.y / s;

    let text = this.value;

    // Computes size by adding the text in a hidden div that lives only temporary
    const div = document.createElement('div');

    // Wrapping and clipping can be ignored here
    div.style.lineHeight = mxgraph.mxConstants.ABSOLUTE_LINE_HEIGHT ? this.size * mxgraph.mxConstants.LINE_HEIGHT + 'px' : `${mxgraph.mxConstants.LINE_HEIGHT}`;
    div.style.fontSize = this.size + 'px';
    div.style.fontFamily = this.family;
    div.style.whiteSpace = 'nowrap';
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.display = 'inline-block';
    // non standard
    // div.style.zoom = '1';

    if ((this.fontStyle & mxgraph.mxConstants.FONT_BOLD) == mxgraph.mxConstants.FONT_BOLD) {
      div.style.fontWeight = 'bold';
    }

    if ((this.fontStyle & mxgraph.mxConstants.FONT_ITALIC) == mxgraph.mxConstants.FONT_ITALIC) {
      div.style.fontStyle = 'italic';
    }

    // TODO error in typed-mxgraph@1.0.1
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    text = mxgraph.mxUtils.htmlEntities(text, false);
    console.info(`@@@@computeTextBbox label after htmlEntities ##${text}##`);
    text = text.replace(/\n/g, '<br/>').trim();

    const isBoxForEmptyText = text.length > 0;
    text = isBoxForEmptyText ? text : '&nbsp;&nbsp;';
    div.innerHTML = text;

    document.body.appendChild(div);
    // TODO find a better way to ensure we have square dimension for empty text
    // in this case, we also don't need padding/spacing
    let w = div.offsetWidth;
    const h = div.offsetHeight;
    div.parentNode.removeChild(div);

    // TODO manage spacing based on configuration and open it to vertical spacing on height
    // padding/spacing (same for left and right)
    w += 2 * 3; // 3 points on each side

    // we are always using ALIGN_CENTER
    x -= w / 2;
    // we are always using ALIGN_MIDDLE
    y -= h / 2;

    return new mxgraph.mxRectangle(x, y, w, h);
  }
}
