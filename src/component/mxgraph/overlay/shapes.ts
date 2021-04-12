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
import { mxRectangle } from 'mxgraph';
import { MxGraphCustomOverlayStyle } from './custom-overlay';

export class OverlayBadgeShape extends mxgraph.mxText {
  // TODO to remove when typed-mxgraph@1.0.1 mxText definitions won't declare these fields as protected (prevent assign OverlayBadgeShape instances as mxShape)
  spacing: number;
  bounds: mxRectangle;
  // end of typed-mxgraph issue

  constructor(value: string, bounds: mxRectangle, style: MxGraphCustomOverlayStyle) {
    super(
      value,
      bounds,
      // align
      undefined,
      // valign
      undefined,
      style.font?.color,
      // family
      undefined,
      style.font?.size,
      // fontStyle
      undefined,
      // spacing
      undefined,
      // spacingTop
      undefined,
      // spacingRight
      undefined,
      // spacingBottom
      undefined,
      // spacingLeft
      undefined,
      // horizontal
      undefined,
      style.fill?.color,
      style.stroke?.color,
      // wrap
      // clipped
      // overflow
      // labelPadding
      // textDirection
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.fillOpacity = style.fill?.opacity;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.strokewidth = style.stroke?.width;

    if (style.stroke?.pattern) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.isDashed = true;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mxgraph.mxUtils.setStyle(this.style, mxgraph.mxConstants.STYLE_DASH_PATTERN, style.stroke.pattern);
    }
  }
}
