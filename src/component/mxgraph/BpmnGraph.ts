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
import type { CellState, CellStateStyle, CellStyle, Point } from '@maxgraph/core';
import { eventUtils, Graph, GraphView, InternalEvent, Stylesheet } from '@maxgraph/core';

const zoomFactorIn = 1.25;
const zoomFactorOut = 1 / zoomFactorIn;

export class BpmnGraph extends Graph {
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
  override createGraphView(): GraphView {
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
  override zoomActual = (): void => {
    super.zoomActual();
    this.setCurrentZoomLevel();
  };

  /**
   * Overridden to manage `currentZoomLevel`
   * @internal
   */
  override zoomIn = (): void => {
    super.zoomIn();
    this.setCurrentZoomLevel();
  };

  /**
   * Overridden to manage `currentZoomLevel`
   * @internal
   */
  override zoomOut = (): void => {
    super.zoomOut();
    this.setCurrentZoomLevel();
  };

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
      let scale = Math.min(maxScale, Math.min(clientWidth / width, clientHeight / height));
      this.setCurrentZoomLevel(scale);

      // TODO improve implementation (the following is to make integration tests pass)
      scale == 0 && (scale = 1);
      this.view.scaleAndTranslate(
        scale,
        this.NaNToZero((margin + clientWidth - width * scale) / (2 * scale) - bounds.x / this.view.scale),
        this.NaNToZero((margin + clientHeight - height * scale) / (2 * scale) - bounds.y / this.view.scale),
      );
    }
  }

  // TODO move somewhere else + find a better name + should be a util function
  private NaNToZero(value: number): number {
    return Number.isNaN(value) ? 0 : value;
  }

  /**
   * @internal
   */
  registerMouseWheelZoomListeners(config: ZoomConfiguration): void {
    config = ensureValidZoomConfiguration(config);
    InternalEvent.addMouseWheelListener(debounce(this.createMouseWheelZoomListener(true), config.debounceDelay), this.container);
    InternalEvent.addMouseWheelListener(throttle(this.createMouseWheelZoomListener(false), config.throttleDelay), this.container);
  }

  // Update the currentZoomLevel when performScaling is false, use the currentZoomLevel to set the scale otherwise
  // Initial implementation inspired by https://github.com/algenty/grafana-flowcharting/blob/0.9.0/src/graph_class.ts#L1254
  private manageMouseWheelZoomEvent(up: boolean, evt: MouseEvent, performScaling: boolean): void {
    if (!performScaling) {
      this.currentZoomLevel *= up ? zoomFactorIn : zoomFactorOut;
    } else {
      const [offsetX, offsetY] = this.getEventRelativeCoordinates(evt);
      const [newScale, dx, dy] = this.getScaleAndTranslationDeltas(offsetX, offsetY);
      this.view.scaleAndTranslate(newScale, this.view.translate.x + dx, this.view.translate.y + dy);
      InternalEvent.consume(evt);
    }
  }

  private createMouseWheelZoomListener(performScaling: boolean) {
    return (event: Event, up: boolean) => {
      if (!(event instanceof MouseEvent) || eventUtils.isConsumed(event)) {
        return;
      }

      // only the ctrl key
      const isZoomWheelEvent = event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey;
      if (isZoomWheelEvent) {
        this.manageMouseWheelZoomEvent(up, event, performScaling);
      }
    };
  }

  private getEventRelativeCoordinates(evt: MouseEvent): [number, number] {
    const rect = this.container.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    return [x, y];
  }

  private getScaleAndTranslationDeltas(offsetX: number, offsetY: number): [number, number, number] {
    const [factor, scale] = this.calculateFactorAndScale();
    const [dx, dy] = this.calculateTranslationDeltas(factor, scale, offsetX * 2, offsetY * 2);
    return [scale, dx, dy];
  }

  // solution inspired by https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/view/mxGraph.js#L8074-L8085
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

  private calculateFactorAndScale(): [number, number] {
    // Rounded in the same way as in the mxGraph.zoom function for consistency.
    const scale = Math.round(this.currentZoomLevel * 100) / 100;
    const factor = scale / this.view.scale;
    return [factor, scale];
  }

  // TODO temp to fix maxGraph style merge issue (should be fixed in maxGraph@0.2.0)
  override createStylesheet(): Stylesheet {
    return new BpmnStylesheet();
  }
}

class BpmnGraphView extends GraphView {
  override getFloatingTerminalPoint(edge: CellState, start: CellState, end: CellState, source: boolean): Point {
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

// TODO temp to fix maxGraph style merge issue (should be fixed in maxGraph@0.2.0)
class BpmnStylesheet extends Stylesheet {
  override getCellStyle(cellStyle: CellStyle, defaultStyle: CellStateStyle): CellStateStyle {
    let style: CellStateStyle;

    if (cellStyle.baseStyleNames && cellStyle.baseStyleNames.length > 0) {
      // creates style with the given baseStyleNames. (merges from left to right)
      style = cellStyle.baseStyleNames.reduce(
        (acc, styleName) => {
          return (acc = {
            ...acc,
            ...this.styles.get(styleName),
          });
        },
        // here is the change
        // {},
        { ...defaultStyle },
        // END of here is the change
      );
    } else if (cellStyle.baseStyleNames && cellStyle.baseStyleNames.length === 0) {
      // baseStyleNames is explicitly an empty array, so don't use any default styles.
      style = {};
    } else {
      style = { ...defaultStyle };
    }

    // Merges cellStyle into style
    style = {
      ...style,
      ...cellStyle,
    };

    return style;
  }
}
