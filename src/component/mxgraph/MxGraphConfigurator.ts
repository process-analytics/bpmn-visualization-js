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
import StyleConfigurator from './config/StyleConfigurator';
import ShapeConfigurator from './config/ShapeConfigurator';
import MarkerConfigurator from './config/MarkerConfigurator';
import MxClientConfigurator from './config/MxClientConfigurator';
import { BpmnVisualizationOptions } from '../BpmnVisualization';
import { mxgraph } from 'ts-mxgraph';
// TODO unable to load mxClient from mxgraph-type-definitions@1.0.4
declare const mxClient: typeof mxgraph.mxClient;

/**
 * Configure the mxGraph graph that can be used by the lib
 * <ul>
 *     <li>styles
 *     <li>shapes
 *     <li>markers
 */
export default class MxGraphConfigurator {
  private readonly graph: BpmnMxGraph;

  constructor(readonly container: HTMLElement) {
    this.graph = new BpmnMxGraph(container);
  }

  public configure(options?: BpmnVisualizationOptions): mxGraph {
    this.configureGraph();
    this.configureMouseNavigationSupport(options);
    new StyleConfigurator(this.graph).configureStyles();
    new ShapeConfigurator().configureShapes();
    new MarkerConfigurator().configureMarkers();
    new MxClientConfigurator().configureMxCodec();
    return this.graph;
  }

  private configureGraph(): void {
    this.graph.setCellsLocked(true);
    this.graph.setCellsSelectable(false);
    this.graph.setEdgeLabelsMovable(false);

    this.graph.setHtmlLabels(true); // required for wrapping

    // To have the boundary event on the border of a task
    this.graph.setConstrainChildren(false);
    this.graph.setExtendParents(false);

    // Disable folding for container mxCell (pool, lane, sub process, call activity) because we don't need it.
    // This also prevents requesting unavailable images (see #185) as we don't override mxGraph folding default images.
    this.graph.foldingEnabled = false;
  }

  private configureMouseNavigationSupport(options?: BpmnVisualizationOptions): void {
    const mouseNavigationSupport = options?.mouseNavigationSupport;
    // Pan configuration
    if (mouseNavigationSupport) {
      this.graph.panningHandler.useLeftButtonForPanning = true;
      this.graph.panningHandler.ignoreCell = true; // ok here as we cannot select cells
      this.graph.panningHandler.addListener(mxEvent.PAN_START, this.getPanningHandler('grab'));
      this.graph.panningHandler.addListener(mxEvent.PAN_END, this.getPanningHandler('default'));
      this.graph.setPanning(true);
    } else {
      this.graph.setPanning(false);
      this.graph.panningHandler.setPinchEnabled(false); // ensure gesture support is disabled (zoom only for now!)
    }

    this.configureMouseEvent(mouseNavigationSupport);
  }

  private getPanningHandler(cursor: 'grab' | 'default'): OmitThisParameter<(this: mxGraph) => void> {
    return this.getPanningHandlerCallback(cursor).bind(this.graph);
  }

  private getPanningHandlerCallback(cursor: 'grab' | 'default'): () => void {
    return function (this: mxGraph): void {
      this.isEnabled() && (this.container.style.cursor = cursor);
    };
  }

  private configureMouseEvent(activated = false): void {
    if (!activated) {
      return;
    }

    mxEvent.addMouseWheelListener((event: Event, up: boolean) => {
      // TODO review type: this hack is due to the introduction of mxgraph-type-definitions
      const evt = (event as unknown) as MouseEvent;
      if (mxEvent.isConsumed((evt as unknown) as mxMouseEvent)) {
        return;
      }
      // only the ctrl key or the meta key on mac
      const isZoomWheelEvent = (evt.ctrlKey || (mxClient.IS_MAC && evt.metaKey)) && !evt.altKey && !evt.shiftKey;
      if (isZoomWheelEvent) {
        this.graph.performZoom(up, evt);
        mxEvent.consume(evt);
      }
    }, this.container);
  }
}

class BpmnMxGraph extends mxGraph {
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
    this.cumulativeZoomFactor *= up ? 1.2 : 0.8;
    let factor = this.cumulativeZoomFactor / this.view.scale;
    const scale = Math.round(this.view.scale * factor * 100) / 100;
    factor = scale / this.view.scale;
    return [factor, scale];
  }
}
