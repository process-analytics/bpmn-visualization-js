/*
Copyright 2022 Bonitasoft S.A.

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

import type { BpmnGraph } from './mxgraph/BpmnGraph';
import type { FitOptions, NavigationConfiguration, ZoomConfiguration, ZoomType } from './options';
import type { InternalMouseEvent } from '@maxgraph/core';

import { debounce, throttle } from 'es-toolkit';

import { ensurePositiveValue, ensureValidZoomConfiguration } from './helpers/validators';
import { InternalEvent } from '@maxgraph/core';
import { FitType } from './options';

/**
 * Defines the methods available to perform BPMN diagram navigation.
 *
 * **WARN**: subject to change, feedback welcome.
 *
 * @category Navigation
 * @experimental
 * @since 0.24.0
 */
export interface Navigation {
  fit(options?: FitOptions): void;

  zoom(type: ZoomType): void;
}

/**
 * Concrete implementation for BPMN diagram navigation.
 *
 * **WARN**: internal, as it provides methods that are not part of the public API.
 *
 * @category Navigation
 * @experimental
 * @internal
 * @since 0.47.0
 */
export class NavigationImpl implements Navigation {
  constructor(
    private readonly graph: BpmnGraph,
    private readonly zoomSupport: ZoomSupport,
  ) {}

  fit(options?: FitOptions): void {
    this.zoomSupport.fit(options);
  }

  zoom(type: ZoomType): void {
    type == 'in' ? this.zoomSupport.zoomIn() : this.zoomSupport.zoomOut();
  }

  configure(options?: NavigationConfiguration): void {
    // @ts-expect-error - TODO maxGraph: panningHandler moved to plugin system, use getPlugin<PanningHandler>
    const panningHandler = this.graph.panningHandler;
    if (options?.enabled) {
      // Pan configuration
      panningHandler.addListener(InternalEvent.PAN_START, setContainerCursor(this.graph, 'grab'));
      panningHandler.addListener(InternalEvent.PAN_END, setContainerCursor(this.graph, 'default'));

      panningHandler.usePopupTrigger = false; // only use the left button to trigger panning
      // Reimplement the function as we also want to trigger 'panning on cells' (ignoreCell to true) and only on left-click
      // The regular implementation doesn't ignore right click in this case, so do it by ourselves
      // @ts-expect-error - TODO maxGraph: check if isLeftMouseButton and isMultiTouchEvent exist in InternalEvent or eventUtils
      panningHandler.isForcePanningEvent = (me: InternalMouseEvent): boolean => InternalEvent.isLeftMouseButton(me.getEvent()) || InternalEvent.isMultiTouchEvent(me.getEvent());
      this.graph.setPanning(true);

      // Zoom configuration
      this.zoomSupport.registerMouseWheelZoomListeners(options?.zoom);
    } else {
      this.graph.setPanning(false);
      // Disable gesture support for zoom
      panningHandler.setPinchEnabled(false);
      // Disable panning on touch device
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
      panningHandler.isForcePanningEvent = (_me: InternalMouseEvent): boolean => false;
    }
  }
}

function setContainerCursor(graph: BpmnGraph, cursor: 'grab' | 'default'): () => void {
  return (): void => {
    graph.container.style.cursor = cursor;
  };
}

/**
 * @internal
 */
export function createNewNavigation(graph: BpmnGraph, options?: NavigationConfiguration): Navigation {
  const navigation = new NavigationImpl(graph, new ZoomSupport(graph));
  navigation.configure(options);
  return navigation;
}

const zoomFactorIn = 1.25;
const zoomFactorOut = 1 / zoomFactorIn;

/**
 * Call Graph methods and zoom with mouse.
 * @internal
 */
class ZoomSupport {
  private currentZoomLevel = 1;

  constructor(private readonly graph: BpmnGraph) {
    this.graph.zoomFactor = zoomFactorIn;
  }

  private graphFit(border: number, keepOrigin?: boolean, margin?: number, enabled?: boolean, ignoreWidth?: boolean, ignoreHeight?: boolean, maxHeight?: number): number {
    const scale = this.graph.fit(border, keepOrigin, margin, enabled, ignoreWidth, ignoreHeight, maxHeight);
    this.setCurrentZoomLevel(scale);
    return scale;
  }

  private setCurrentZoomLevel(scale?: number): void {
    this.currentZoomLevel = scale ?? this.graph.view.scale;
  }

  private zoomActual(): void {
    this.graph.zoomActual();
    this.setCurrentZoomLevel();
  }

  zoomIn(): void {
    this.graph.zoomIn();
    this.setCurrentZoomLevel();
  }

  zoomOut(): void {
    this.graph.zoomOut();
    this.setCurrentZoomLevel();
  }

  fit(fitOptions: FitOptions): void {
    // We should avoid extra zoom/fit reset. See https://github.com/process-analytics/bpmn-visualization-js/issues/888
    this.zoomActual();

    const type = fitOptions?.type;
    if (type == undefined || type == FitType.None) {
      return;
    }

    const margin = ensurePositiveValue(fitOptions?.margin);

    if (type == FitType.Center) {
      // Inspired from https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.fit
      const maxScale = 3;

      const bounds = this.graph.getGraphBounds();
      const clientWidth = this.graph.container.clientWidth - margin;
      const clientHeight = this.graph.container.clientHeight - margin;
      const width = bounds.width / this.graph.view.scale;
      const height = bounds.height / this.graph.view.scale;
      const scale = Math.min(maxScale, Math.min(clientWidth / width, clientHeight / height));
      this.setCurrentZoomLevel(scale);

      this.graph.view.scaleAndTranslate(
        scale,
        (margin + clientWidth - width * scale) / (2 * scale) - bounds.x / this.graph.view.scale,
        (margin + clientHeight - height * scale) / (2 * scale) - bounds.y / this.graph.view.scale,
      );
    } else {
      let ignoreWidth = false;
      let ignoreHeight = false;
      switch (type) {
        case FitType.Horizontal: {
          ignoreHeight = true;
          break;
        }
        case FitType.Vertical: {
          ignoreWidth = true;
          break;
        }
      }

      this.graphFit(this.graph.border, false, margin, true, ignoreWidth, ignoreHeight);
    }
  }

  /**
   * @internal
   */
  registerMouseWheelZoomListeners(config: ZoomConfiguration): void {
    config = ensureValidZoomConfiguration(config);
    InternalEvent.addMouseWheelListener(debounce(this.createMouseWheelZoomListener(true), config.debounceDelay), this.graph.container);
    InternalEvent.addMouseWheelListener(throttle(this.createMouseWheelZoomListener(false), config.throttleDelay), this.graph.container);
  }

  private createMouseWheelZoomListener(performScaling: boolean) {
    return (event: Event, up: boolean) => {
      // @ts-expect-error - TODO maxGraph: check correct method name in InternalEvent (might be consume instead of isConsumed)
      if (InternalEvent.isConsumed(event) || !(event instanceof MouseEvent)) {
        return;
      }

      // only the ctrl key
      const isZoomWheelEvent = event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey;
      if (isZoomWheelEvent) {
        // Update the currentZoomLevel when performScaling is false, use the currentZoomLevel to set the scale otherwise
        // Initial implementation inspired by https://github.com/algenty/grafana-flowcharting/blob/0.9.0/src/graph_class.ts#L1254
        if (performScaling) {
          const [offsetX, offsetY] = this.getEventRelativeCoordinates(event);
          const [newScale, dx, dy] = this.getScaleAndTranslationDeltas(offsetX, offsetY);
          this.graph.view.scaleAndTranslate(newScale, this.graph.view.translate.x + dx, this.graph.view.translate.y + dy);
          InternalEvent.consume(event);
        } else {
          this.currentZoomLevel *= up ? zoomFactorIn : zoomFactorOut;
        }
      }
    };
  }

  private getEventRelativeCoordinates(event: MouseEvent): [number, number] {
    const rect = this.graph.container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
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
      const f = (1 / factor - 1) / (this.graph.view.scale * 2);
      dx *= f;
      dy *= f;
    }
    return [dx, dy];
  }

  private calculateFactorAndScale(): [number, number] {
    // Rounded in the same way as in the mxGraph.zoom function for consistency.
    const scale = Math.round(this.currentZoomLevel * 100) / 100;
    const factor = scale / this.graph.view.scale;
    return [factor, scale];
  }
}
