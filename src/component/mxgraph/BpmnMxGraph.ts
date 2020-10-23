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
import { FitType } from '../Options';

export class BpmnMxGraph extends mxGraph {
  private cumulativeZoomFactor = 1;

  constructor(readonly container: HTMLElement) {
    super(container);
  }

  // override fit to set initial cumulativeZoomFactor
  fit(order: number, keepOrigin?: boolean, margin?: number, enabled?: boolean, ignoreWidth?: boolean, ignoreHeight?: boolean, maxHeight?: number): number {
    const scale = super.fit(order, keepOrigin, margin, enabled, ignoreWidth, ignoreHeight, maxHeight);
    this.cumulativeZoomFactor = scale;
    return scale;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public customFit(type: FitType): void {
    // if (type != FitType.Center) {
    //   let ignoreWidth = false;
    //   let ignoreHeight = false;
    //   switch (type) {
    //     case FitType.Horizontal:
    //       ignoreHeight = true;
    //       break;
    //     case FitType.Vertical:
    //       ignoreWidth = true;
    //       break;
    //   }
    //
    //   this.fit(this.border, false, 10, true, ignoreWidth, ignoreHeight);
    // } else {
    //   const margin = 2;
    //   const max = 3;
    //
    //   const bounds = this.getGraphBounds();
    //   const clientWidth = this.container.clientWidth - margin;
    //   const clientHeight = this.container.clientHeight - margin;
    //   const width = bounds.width / this.view.scale;
    //   const height = bounds.height / this.view.scale;
    //   const scale = Math.min(max, Math.min(clientWidth / width, clientHeight / height));
    //   this.cumulativeZoomFactor = scale;
    //
    //   this.view.scaleAndTranslate(
    //     scale,
    //     (margin + clientWidth - width * scale) / (2 * scale) - bounds.x / this.view.scale,
    //     (margin + clientHeight - height * scale) / (2 * scale) - bounds.y / this.view.scale,
    //   );
    // }

    //this.fitWindow();
    //this.fitPage();
    //this.fitTwoPages();
    this.fitPageWidth();
  }

  ////////// From drawio ---- temporary, to inspire
  /**
   * Sets the current visible rectangle of the window in graph coordinates.
   */
  // private fitWindow(): void {
  //   const bounds = this.getGraphBounds();
  //   const translate = this.view.translate;
  //   const scale = this.view.scale;
  //
  //   bounds.x = bounds.x / scale - translate.x;
  //   bounds.y = bounds.y / scale - translate.y;
  //   bounds.width /= scale;
  //   bounds.height /= scale;
  //
  //   if (bounds.width == 0 || bounds.height == 0) {
  //     this.zoomTo(1);
  //   } else {
  //     const border = 10;
  //
  //     const clientWidth = this.container.clientWidth - border;
  //     const clientHeight = this.container.clientHeight - border;
  //     const scale = Math.floor(20 * Math.min(clientWidth / bounds.width, clientHeight / bounds.height)) / 20;
  //     this.zoomTo(scale);
  //
  //     if (mxUtils.hasScrollbars(this.container)) {
  //       const translate = this.view.translate;
  //       this.container.scrollTop = (bounds.y + translate.y) * scale - Math.max((clientHeight - bounds.height * scale) / 2 + border / 2, 0);
  //       this.container.scrollLeft = (bounds.x + translate.x) * scale - Math.max((clientWidth - bounds.width * scale) / 2 + border / 2, 0);
  //     }
  //   }
  // }
  //
  // private fitPage(): void {
  //   const pageFormat = this.pageFormat;
  //   const pageScale = this.pageScale;
  //   const clientWidth = this.container.clientWidth - 10;
  //   const clientHeight = this.container.clientHeight - 10;
  //   const scale = Math.floor(20 * Math.min(clientWidth / pageFormat.width / pageScale, clientHeight / pageFormat.height / pageScale)) / 20;
  //   this.zoomTo(scale);
  //
  //   if (mxUtils.hasScrollbars(this.container)) {
  //     const pad = this.getPagePadding();
  //     this.container.scrollTop = pad.y * this.view.scale - 1;
  //     this.container.scrollLeft = Math.min(pad.x * this.view.scale, (this.container.scrollWidth - this.container.clientWidth) / 2) - 1;
  //   }
  // }
  //
  // private fitTwoPages(): void {
  //   const pageFormat = this.pageFormat;
  //   const pageScale = this.pageScale;
  //   const clientWidth = this.container.clientWidth - 10;
  //   const clientHeight = this.container.clientHeight - 10;
  //
  //   const scale = Math.floor(20 * Math.min(clientWidth / (2 * pageFormat.width) / pageScale, clientHeight / pageFormat.height / pageScale)) / 20;
  //   this.zoomTo(scale);
  //
  //   if (mxUtils.hasScrollbars(this.container)) {
  //     const pad = this.getPagePadding();
  //     this.container.scrollTop = Math.min(pad.y, (this.container.scrollHeight - this.container.clientHeight) / 2);
  //     this.container.scrollLeft = Math.min(pad.x, (this.container.scrollWidth - this.container.clientWidth) / 2);
  //   }
  // }

  private fitPageWidth(): void {
    const pageFormat = this.pageFormat;
    const pageScale = this.pageScale;
    const clientWidth = this.container.clientWidth - 10;

    const scale = Math.floor((20 * clientWidth) / pageFormat.width / pageScale) / 20;
    this.zoomTo(scale);

    if (mxUtils.hasScrollbars(this.container)) {
      const pad = this.getPagePadding();
      this.container.scrollLeft = Math.min(pad.x * this.view.scale, (this.container.scrollWidth - this.container.clientWidth) / 2);
    }
  }

  private getPagePadding(): mxPoint {
    return new mxPoint(0, 0);
  }

  //////////

  // solution inspired by https://github.com/algenty/grafana-flowcharting/blob/0.9.0/src/graph_class.ts#L1254
  public performZoom(up: boolean, evt: MouseEvent): void {
    const rect = this.container.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    this.zoomTo(null, null, up, x, y);
  }

  zoomTo(scale: number, center?: boolean, up?: boolean, offsetX?: number, offsetY?: number): void {
    if (scale === null) {
      const [newScale, dx, dy] = this.getScaleAndTranslationDeltas(up, offsetX, offsetY);
      this.view.scaleAndTranslate(newScale, this.view.translate.x + dx, this.view.translate.y + dy);
    } else {
      super.zoomTo(scale, center);
    }
  }

  private getScaleAndTranslationDeltas(up: boolean, offsetX: number, offsetY: number): [number, number, number] {
    let dx = offsetX * 2;
    let dy = offsetY * 2;
    const [factor, scale] = this.calculateFactorAndScale(up);
    [dx, dy] = this.calculateTranslationDeltas(factor, scale, dx, dy);
    return [scale, dx, dy];
  }

  private calculateTranslationDeltas(factor: number, scale: number, dx: number, dy: number): [number, number] {
    if (factor > 1) {
      const f = (factor - 1) / (scale * 2);
      dx *= -f;
      dy *= -f;
    } else {
      const f = (1 / factor - 1) / (this.view.scale * 2);
      dx *= f;
      dy *= f;
    }
    return [dx, dy];
  }

  private calculateFactorAndScale(up: boolean): [number, number] {
    this.cumulativeZoomFactor *= up ? 1.25 : 0.8;
    let factor = this.cumulativeZoomFactor / this.view.scale;
    const scale = Math.round(this.view.scale * factor * 100) / 100;
    factor = scale / this.view.scale;
    return [factor, scale];
  }
}
