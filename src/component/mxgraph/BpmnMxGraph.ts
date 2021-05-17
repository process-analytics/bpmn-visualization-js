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

import { FitOptions, FitType, ZoomConfiguration } from '../options';
import { ensurePositiveValue, ensureValidZoomConfiguration } from '../helpers/validators';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { mxgraph } from './initializer';
import { mxMouseEvent } from 'mxgraph'; // for types

export class BpmnMxGraph extends mxgraph.mxGraph {
  private cumulativeZoomFactor = 1;

  /**
   * @internal
   */
  constructor(readonly container: HTMLElement) {
    super(container);
  }

  /**
   * Overridden to set initial cumulativeZoomFactor
   * @internal
   */
  fit(border: number, keepOrigin?: boolean, margin?: number, enabled?: boolean, ignoreWidth?: boolean, ignoreHeight?: boolean, maxHeight?: number): number {
    const scale = super.fit(border, keepOrigin, margin, enabled, ignoreWidth, ignoreHeight, maxHeight);
    this.cumulativeZoomFactor = scale;
    return scale;
  }

  /**
   * Overridden to set initial cumulativeZoomFactor
   * @internal
   */
  zoomActual(): void {
    super.zoomActual();
    this.cumulativeZoomFactor = this.view.scale;
  }

  /**
   * @internal
   */
  public customFit(fitOptions: FitOptions): void {
    // TODO avoid extra zoom/fit reset
    // see https://github.com/process-analytics/bpmn-visualization-js/issues/888
    this.zoomActual();

    const type = fitOptions?.type;
    if (type == undefined || type == FitType.None) {
      return;
    }

    const margin = ensurePositiveValue(fitOptions?.margin);

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

  /**
   * @internal
   */
  zoomTo(scale: number, center?: boolean, up?: boolean, offsetX?: number, offsetY?: number, performScaling?: boolean): void {
    if (scale === null) {
      const [newScale, dx, dy] = this.getScaleAndTranslationDeltas(up, offsetX, offsetY);
      if (performScaling) {
        this.view.scaleAndTranslate(newScale, this.view.translate.x + dx, this.view.translate.y + dy);
      }
    } else {
      super.zoomTo(scale, center);
    }
  }

  /**
   * @internal
   */
  createMouseWheelZoomExperience(config: ZoomConfiguration): void {
    config = ensureValidZoomConfiguration(config);
    mxgraph.mxEvent.addMouseWheelListener(debounce(this.getZoomHandler(true), config.debounceDelay), this.container);
    mxgraph.mxEvent.addMouseWheelListener(throttle(this.getZoomHandler(false), config.throttleDelay), this.container);
  }

  // solution inspired by https://github.com/algenty/grafana-flowcharting/blob/0.9.0/src/graph_class.ts#L1254
  private performZoom(up: boolean, evt: MouseEvent, performScaling: boolean): void {
    const [x, y] = this.getRelativeEventCoordinates(evt);
    this.zoomTo(null, null, up, x, y, performScaling);
    if (performScaling) {
      mxgraph.mxEvent.consume(evt);
    }
  }

  private getZoomHandler(calculateFactorOnly: boolean) {
    return (event: Event, up: boolean) => {
      // TODO review type: this hack is due to typed-mxgraph
      const evt = event as unknown as MouseEvent;
      if (mxgraph.mxEvent.isConsumed(evt as unknown as mxMouseEvent)) {
        return;
      }
      // only the ctrl key
      const isZoomWheelEvent = evt.ctrlKey && !evt.altKey && !evt.shiftKey && !evt.metaKey;
      if (isZoomWheelEvent) {
        this.performZoom(up, evt, calculateFactorOnly);
      }
    };
  }

  private getRelativeEventCoordinates(evt: MouseEvent): [number, number] {
    const rect = this.container.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    return [x, y];
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
    // as with new zoom scaling is invoked 2x the factor's square root is taken
    this.cumulativeZoomFactor *= up ? Math.sqrt(1.25) : Math.sqrt(0.8);
    let factor = this.cumulativeZoomFactor / this.view.scale;
    const scale = Math.round(this.view.scale * factor * 100) / 100;
    factor = scale / this.view.scale;
    return [factor, scale];
  }
}
