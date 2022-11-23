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
import type { Rectangle } from '@maxgraph/core';
import type { MxGraphCustomOverlayStyle } from './custom-overlay';

export class OverlayBadgeShape extends mxgraph.mxText {
  constructor(value: string, bounds: Rectangle, style: MxGraphCustomOverlayStyle) {
    super(
      value,
      bounds,
      undefined,
      undefined,
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
      style.fill.color,
      style.stroke.color,
    );
    this.fillOpacity = style.fill.opacity;
    this.strokewidth = style.stroke.width;
  }
}
