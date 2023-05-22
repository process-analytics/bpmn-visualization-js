/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { FitOptions, ZoomConfiguration } from '../options';
import { FitType } from '../options';
import { ensurePositiveValue, ensureValidZoomConfiguration } from '../helpers/validators';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { mxgraph } from './initializer';
import type { mxCellState, mxGraphView, mxMouseEvent, mxPanningHandler, mxPoint } from 'mxgraph';

const zoomFactorIn = 1.25;
const zoomFactorOut = 1 / zoomFactorIn;

export class BpmnGraph extends mxgraph.mxGraph {
  private currentZoomLevel = 1;
  private navigationHandlers: {
    event: string;
    funct: (evt: WheelEvent & { scale: number }) => void;
  }[] = [];
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
   * Shortcut for an update of the model within a transaction.
   *
   * This method is inspired from {@link https://github.com/maxGraph/maxGraph/blob/v0.1.0/packages/core/src/view/Graph.ts#L487-L494 maxGraph}.
   *
   * @param fn the update to be made in the transaction.
   *
   * @experimental subject to change, may move to a subclass of `mxGraphModel`
   * @alpha
   */
  batchUpdate(fn: () => void): void {
    this.model.beginUpdate();
    try {
      fn();
    } finally {
      this.model.endUpdate();
    }
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
  registerMouseWheelZoomListeners(config: ZoomConfiguration): void {
    config = ensureValidZoomConfiguration(config);
    this.addMouseWheelListener(debounce(this.createMouseWheelZoomListener(true), config.debounceDelay), this.container);
    this.addMouseWheelListener(throttle(this.createMouseWheelZoomListener(false), config.throttleDelay), this.container);
  }
  private addMouseWheelListener(funct: (evt: Event, up: boolean) => void, target: HTMLElement | Window): void {
    target = target != null ? target : window;
    const wheelHandler = function (evt: WheelEvent): void {
      //To prevent window zoom on trackpad pinch
      if (evt.ctrlKey) {
        evt.preventDefault();
      }
      // Handles the event using the given function
      if (Math.abs(evt.deltaX) > 0.5 || Math.abs(evt.deltaY) > 0.5) {
        funct(evt, evt.deltaY == 0 ? -evt.deltaX > 0 : -evt.deltaY > 0);
      }
    };
    this.navigationHandlers.push({
      event: 'wheel',
      funct: wheelHandler,
    });
    mxgraph.mxEvent.addListener(target, 'wheel', wheelHandler);

    // Touch gestures
    if (mxgraph.mxClient.IS_SF && !mxgraph.mxClient.IS_TOUCH) {
      let scale = 1;

      const gestureStart = function (evt: Event): void {
        mxgraph.mxEvent.consume(evt);
        scale = 1;
      };
      // Non standard event type (=> manual defintion of type GestureEvent)
      const gestureChange = function (evt: Event & { scale: number }): void {
        mxgraph.mxEvent.consume(evt);
        const diff = scale - evt.scale;

        if (Math.abs(diff) > 0.2) {
          funct(evt, diff < 0);
          scale = evt.scale;
        }
      };
      const gestureEnd = function (evt: Event): void {
        mxgraph.mxEvent.consume(evt);
      };
      mxgraph.mxEvent.addListener(target, 'gesturestart', gestureStart);
      mxgraph.mxEvent.addListener(target, 'gesturechange', gestureChange);
      mxgraph.mxEvent.addListener(target, 'gestureend', gestureEnd);
      this.navigationHandlers.push({ event: 'gesturestart', funct: gestureStart }, { event: 'gesturechange', funct: gestureChange }, { event: 'gestureend', funct: gestureEnd });
    }
  }

  /**
   * @internal
   */
  enableNavigation(zoomConfig?: ZoomConfiguration): void {
    // Remove listeners that may have been added before
    for (const handler of this.navigationHandlers) {
      mxgraph.mxEvent.removeListener(this.container, handler.event, handler.funct);
    }
    const panningHandler = this.panningHandler;

    // Pan configuration
    panningHandler.addListener(mxgraph.mxEvent.PAN_START, this.panStartHandler);
    panningHandler.addListener(mxgraph.mxEvent.PAN_END, this.panEndHandler);

    panningHandler.usePopupTrigger = false; // only use the left button to trigger panning
    // Reimplement the function as we also want to trigger 'panning on cells' (ignoreCell to true) and only on left-click
    // The mxGraph standard implementation doesn't ignore right click in this case, so do it by ourselves
    panningHandler.isForcePanningEvent = (me): boolean => mxgraph.mxEvent.isLeftMouseButton(me.getEvent()) || mxgraph.mxEvent.isMultiTouchEvent(me.getEvent());
    panningHandler.setPinchEnabled(true);
    this.setPanning(true);

    // Zoom configuration
    this.registerMouseWheelZoomListeners(zoomConfig);
  }
  /**
   * @internal
   */
  disableNavigation(): void {
    const panningHandler = this.panningHandler;
    this.setPanning(false);
    // Remove panningHandler Listeners
    panningHandler.removeListener(this.panStartHandler);
    panningHandler.removeListener(this.panEndHandler);
    // Disable gesture support for zoom
    panningHandler.setPinchEnabled(false);
    // Disable panning on touch device
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
    panningHandler.isForcePanningEvent = (_me: mxMouseEvent): boolean => false;
    // Remove event kisteners
    for (const handler of this.navigationHandlers) {
      mxgraph.mxEvent.removeListener(this.container, handler.event, handler.funct);
    }
    this.navigationHandlers = [];
  }
  private panStartHandler(panningHandler: mxPanningHandler): void {
    panningHandler.graph.isEnabled() && (panningHandler.graph.container.style.cursor = 'grab');
  }
  private panEndHandler(panningHandler: mxPanningHandler): void {
    panningHandler.graph.isEnabled() && (panningHandler.graph.container.style.cursor = 'default');
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
      mxgraph.mxEvent.consume(evt);
    }
  }

  private createMouseWheelZoomListener(performScaling: boolean) {
    return (event: Event, up: boolean) => {
      if (mxgraph.mxEvent.isConsumed(event)) {
        return;
      }
      const evt = event as MouseEvent;
      // only the ctrl key
      const isZoomWheelEvent = evt.ctrlKey && !evt.altKey && !evt.shiftKey && !evt.metaKey;
      if (isZoomWheelEvent) {
        this.manageMouseWheelZoomEvent(up, evt, performScaling);
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
