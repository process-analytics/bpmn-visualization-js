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

import type { FitOptions, ZoomConfiguration } from '../options';
import { FitType } from '../options';
import { ensurePositiveValue, ensureValidZoomConfiguration } from '../helpers/validators';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { mxgraph } from './initializer';
import type { mxCellState, mxGraphView, mxPoint } from 'mxgraph';

const zoomFactorIn = 1.25;
const zoomFactorOut = 1 / zoomFactorIn;

export class BpmnGraph extends mxgraph.mxGraph {
  private currentZoomLevel = 1;

  /**
   * @internal
   */
  constructor(container: HTMLElement) {
    super(container);
    this.zoomFactor = zoomFactorIn;
    if (this.container) {
      // ensure we don't have a select text cursor on label hover, see #294
      this.container.style.cursor = 'default';
    }
  }

  /**
   * @internal
   */
  override createGraphView(): mxGraphView {
    return new BpmnGraphView(this);
  }

  /**
   * Overridden to manage `currentZoomLevel`
   * @internal
   */
  override fit(border: number, keepOrigin?: boolean, margin?: number, enabled?: boolean, ignoreWidth?: boolean, ignoreHeight?: boolean, maxHeight?: number): number {
    const scale = super.fit(border, keepOrigin, margin, enabled, ignoreWidth, ignoreHeight, maxHeight);
    this.setCurrentZoomLevel(scale);
    return scale;
  }

  private setCurrentZoomLevel(scale?: number): void {
    this.currentZoomLevel = scale ?? this.view.scale;
  }

  /**
   * Overridden to manage `currentZoomLevel`
   * @internal
   */
  override zoomActual(): void {
    super.zoomActual();
    this.setCurrentZoomLevel();
  }

  /**
   * Overridden to manage `currentZoomLevel`
   * @internal
   */
  override zoomIn(): void {
    super.zoomIn();
    this.setCurrentZoomLevel();
  }

  /**
   * Overridden to manage `currentZoomLevel`
   * @internal
   */
  override zoomOut(): void {
    super.zoomOut();
    this.setCurrentZoomLevel();
  }

  /**
   * @internal
   */
  customFit(fitOptions: FitOptions): void {
    // We should avoid extra zoom/fit reset. See https://github.com/process-analytics/bpmn-visualization-js/issues/888
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
      this.setCurrentZoomLevel(scale);

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
  override zoomTo(scale: number, center?: boolean, up?: boolean, offsetX?: number, offsetY?: number, performScaling?: boolean): void {
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
      if (mxgraph.mxEvent.isConsumed(event)) {
        return;
      }
      const evt = event as MouseEvent;
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
    this.currentZoomLevel *= Math.sqrt(up ? zoomFactorIn : zoomFactorOut);
    let factor = this.currentZoomLevel / this.view.scale;
    const scale = Math.round(this.view.scale * factor * 100) / 100;
    factor = scale / this.view.scale;
    return [factor, scale];
  }
}

class BpmnGraphView extends mxgraph.mxGraphView {
  override getFloatingTerminalPoint(edge: mxCellState, start: mxCellState, end: mxCellState, source: boolean): mxPoint {
    // some values may be null: the first and the last values are null prior computing floating terminal points
    const edgePoints = edge.absolutePoints.filter(Boolean);
    // when there is no BPMN waypoint, all values are null
    const needsFloatingTerminalPoint = edgePoints.length < 2;
    if (needsFloatingTerminalPoint) {
      return super.getFloatingTerminalPoint(edge, start, end, source);
    }
    const pts = edge.absolutePoints;
    return source ? pts[1] : pts[pts.length - 2];
  }
}
