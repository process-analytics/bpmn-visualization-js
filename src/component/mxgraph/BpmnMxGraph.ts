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
import { FitOptions, FitType } from '../options';

export class BpmnMxGraph extends mxGraph {
  private cumulativeZoomFactor = 1;

  constructor(readonly container: HTMLElement) {
    super(container);
  }

  // override fit to set initial cumulativeZoomFactor
  fit(border: number, keepOrigin?: boolean, margin?: number, enabled?: boolean, ignoreWidth?: boolean, ignoreHeight?: boolean, maxHeight?: number): number {
    const scale = super.fit(border, keepOrigin, margin, enabled, ignoreWidth, ignoreHeight, maxHeight);
    this.cumulativeZoomFactor = scale;
    return scale;
  }

  public customFit(fitOptions: FitOptions): void {
    const type = fitOptions?.type;
    if (type == undefined || type == FitType.None) {
      return;
    }

    const margin = BpmnMxGraph.enforcePositiveValue(fitOptions?.margin);

    if (type != FitType.Center) {
      let ignoreWidth = false;
      let ignoreHeight = false;
      switch (type) {
        case FitType.Horizontal:
          ignoreHeight = true;
          break;
        case FitType.Vertical:
          ignoreWidth = true;
          break;
      }

      this.fit(this.border, false, margin, true, ignoreWidth, ignoreHeight);
    } else {
      // Inspired from https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.fit
      const maxScale = 3;

      const bounds = this.getGraphBounds();
      const clientWidth = this.container.clientWidth - margin;
      const clientHeight = this.container.clientHeight - margin;
      const width = bounds.width / this.view.scale;
      const height = bounds.height / this.view.scale;
      const scale = Math.min(maxScale, Math.min(clientWidth / width, clientHeight / height));
      this.cumulativeZoomFactor = scale;

      this.view.scaleAndTranslate(
        scale,
        (margin + clientWidth - width * scale) / (2 * scale) - bounds.x / this.view.scale,
        (margin + clientHeight - height * scale) / (2 * scale) - bounds.y / this.view.scale,
      );
    }
  }

  private static enforcePositiveValue(input: number | undefined | null): number {
    return Math.max(input || 0, 0);
  }

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
