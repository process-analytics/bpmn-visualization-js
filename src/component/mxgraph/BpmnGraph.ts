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
import type { mxCell } from 'mxgraph';
import type { mxRectangle } from 'mxgraph';

const zoomFactorIn = 1.25;
const zoomFactorOut = 1 / zoomFactorIn;

export class BpmnGraph extends mxgraph.mxGraph {
  private currentZoomLevel = 1;

  // ===========================================================================
  // POC transform with CSS
  // ===========================================================================
  /**
   * Uses CSS transforms for scale and translate.
   */
  // TODO test with true
  useCssTransforms = true;

  /**
   * Contains the scale.
   */
  currentScale = 1;

  /**
   * Contains the offset.
   */
  currentTranslate = new mxgraph.mxPoint(0, 0);
  // ===========================================================================

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
    console.warn('#####fit done, computed scale', scale);
    console.warn('#####fit done,  currentScale', this.currentScale);
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
    console.warn('#####zoomActual done,  currentScale', this.currentScale);
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
    console.warn('@@@@@registerMouseWheelZoomListeners start');
    console.warn('@@@@@registerMouseWheelZoomListeners isFirefox?', mxgraph.mxClient.IS_FF);
    if (!this.useCssTransforms) {
      console.warn('@@@@@registerMouseWheelZoomListeners NO useCssTransforms - use throttle/debounce for zoom');
      config = ensureValidZoomConfiguration(config);
      mxgraph.mxEvent.addMouseWheelListener(debounce(this.createMouseWheelZoomListener(true), config.debounceDelay), this.container);
      mxgraph.mxEvent.addMouseWheelListener(throttle(this.createMouseWheelZoomListener(false), config.throttleDelay), this.container);
    } else {
      // TODO implementation
      console.warn('@@@@@registerMouseWheelZoomListeners detected useCssTransforms - no mouse Zoom for now!!!!!!!');
    }
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

  // ===========================================================================
  // POC transform with CSS
  // ===========================================================================

  /**
   * Function: getCellAt
   *
   * Needs to modify original method for recursive call.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types -- Function is type is required by typed-mxgraph
  override getCellAt(x: number, y: number, parent?: mxCell, vertices?: boolean, edges?: boolean, ignoreFn?: Function): mxCell {
    // getCellAt = function(x, y, parent, vertices, edges, ignoreFn)
    if (this.useCssTransforms) {
      x = x / this.currentScale - this.currentTranslate.x;
      y = y / this.currentScale - this.currentTranslate.y;
    }

    return this.getScaledCellAt(x, y, parent, vertices, edges, ignoreFn);
    // return null;
  }

  /**
   * Function: getScaledCellAt
   *
   * Overridden for recursion.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types -- Function is type is required by typed-mxgraph
  private getScaledCellAt(x: number, y: number, parent?: mxCell, vertices?: boolean, edges?: boolean, ignoreFn?: Function): mxCell {
    vertices = vertices != null ? vertices : true;
    edges = edges != null ? edges : true;

    if (parent == null) {
      parent = this.getCurrentRoot();

      if (parent == null) {
        parent = this.getModel().getRoot();
      }
    }

    if (parent != null) {
      const childCount = this.model.getChildCount(parent);

      for (let i = childCount - 1; i >= 0; i--) {
        const cell = this.model.getChildAt(parent, i);
        const result = this.getScaledCellAt(x, y, cell, vertices, edges, ignoreFn);

        if (result != null) {
          return result;
        } else if (this.isCellVisible(cell) && ((edges && this.model.isEdge(cell)) || (vertices && this.model.isVertex(cell)))) {
          const state = this.view.getState(cell);

          if (state != null && (ignoreFn == null || !ignoreFn(state, x, y)) && this.intersects(state, x, y)) {
            return cell;
          }
        }
      }
    }

    return null;
  }

  // TODO check scrollRectToVisible - not used by bpmn-visualization today
  override scrollRectToVisible(r: mxRectangle): boolean {
    console.warn('#######Called scrollRectToVisible!');
    return super.scrollRectToVisible(r);
  }

  /**
   * Only foreignObject supported for now (no IE11). Safari disabled as it ignores
   * overflow visible on foreignObject in negative space (lightbox and viewer).
   * Check the following test case on page 1 before enabling this in production:
   * https://devhost.jgraph.com/git/drawio/etc/embed/sf-math-fo-clipping.html?dev=1
   */
  // TODO test if Safari still fails
  isCssTransformsSupported(): boolean {
    // this.updateCssTransform
    return this.dialect == mxgraph.mxConstants.DIALECT_SVG && !mxgraph.mxClient.NO_FO && !mxgraph.mxClient.IS_SF;
    // return this.dialect == mxgraph.mxConstants.DIALECT_SVG && !mxgraph.mxClient.NO_FO && (!this.lightbox || !mxgraph.mxClient.IS_SF);
  }

  /**
   * Zooms out of the graph by <zoomFactor>.
   */
  updateCssTransform(): void {
    console.warn('@@@@@updateCssTransform - start');
    const temp = this.view.getDrawPane();

    if (temp != null) {
      // TODO consistency, the parentNode is supposed to be this.view.getCanvas(), why not calling it directly?
      const g = <SVGElement>temp.parentNode;

      // TODO this check is probably not needed in our implementation as updateCssTransform is only called when useCssTransforms is true
      if (!this.useCssTransforms) {
        console.warn('@@@@@updateCssTransform - useCssTransforms = false');
        g.removeAttribute('transformOrigin');
        g.removeAttribute('transform');
      } else {
        console.warn('@@@@@updateCssTransform - useCssTransforms');
        const prev = g.getAttribute('transform');

        // the transformOrigin attribute seems specific to the draw.io/mxgraph EditorUI implementation
        g.setAttribute('transformOrigin', '0 0');
        const s = Math.round(this.currentScale * 100) / 100;
        const dx = Math.round(this.currentTranslate.x * 100) / 100;
        const dy = Math.round(this.currentTranslate.y * 100) / 100;
        const computedTransformDirective = `scale(${s},${s})translate(${dx},${dy})`;
        console.warn('@@@@updateCssTransform - computed transform directive', computedTransformDirective);
        g.setAttribute('transform', computedTransformDirective);

        // Applies workarounds only if translate has changed
        if (prev != g.getAttribute('transform')) {
          console.warn('@@@@@updateCssTransform - transform value changed');
          // TODO make the implem pass type check, disable 'cssTransformChanged' event firing for now
          // this.fireEvent(new mxgraph.mxEventObject('cssTransformChanged'), 'transform', g.getAttribute('transform'));
        }
      }
    }
  }

  // ===========================================================================
  // custom for bpmn-visualization, draw.io is using scrollbar, without scrollbar, the original mxGraph implementation doesn't work
  // ===========================================================================

  /**
   * Function: panGraph
   *
   * Shifts the graph display by the given amount. This is used to preview
   * panning operations, use <mxGraphView.setTranslate> to set a persistent
   * translation of the view. Fires <mxEvent.PAN>.
   *
   * Parameters:
   *
   * dx - Amount to shift the graph along the x-axis.
   * dy - Amount to shift the graph along the y-axis.
   */
  override panGraph(dx: number, dy: number): void {
    if (!this.useCssTransforms) {
      console.warn('@@@@panGraph - no useCssTransforms');
      super.panGraph(dx, dy);
    } else {
      console.warn('@@@@panGraph - useCssTransforms');
      if (this.useScrollbarsForPanning && mxgraph.mxUtils.hasScrollbars(this.container)) {
        console.warn('@@@@panGraph - has scrollbars');
        this.container.scrollLeft = -dx;
        this.container.scrollTop = -dy;
      } else {
        // at the end of pan, panning handler does
        // var scale = this.graph.getView().scale;
        // var t = this.graph.getView().translate;
        // <panningHandler>this.panGraph(t.x + this.dx / scale, t.y + this.dy / scale);
        // <panningHandler>panGraph = function(dx, dy) ==> this.graph.getView().setTranslate(dx, dy);

        console.warn(`@@@@panGraph - useCssTransforms - dx=${dx} dy=${dy}`);
        // TODO manage rounding duplication with updateCssTransform (introduce private method)
        const roundedCurrentScale = Math.round(this.currentScale * 100) / 100;
        const roundedPannedTranslateX = Math.round((this.currentTranslate.x + dx / this.currentScale) * 100) / 100;
        const roundedPannedTranslateY = Math.round((this.currentTranslate.y + dy / this.currentScale) * 100) / 100;
        const computedTransformDirective = `scale(${roundedCurrentScale},${roundedCurrentScale})translate(${roundedPannedTranslateX},${roundedPannedTranslateY})`;
        // const roundedCurrentTranslateX = Math.round(this.currentTranslate.x * 100) / 100;
        // const roundedCurrentTranslateY = Math.round(this.currentTranslate.y * 100) / 100;
        // const computedTransformDirective = `scale(${roundedCurrentScale},${roundedCurrentScale})translate(${roundedCurrentTranslateX + dx},${roundedCurrentTranslateY + dy})`;
        console.warn('@@@@panGraph - computed transform directive', computedTransformDirective);

        const canvas = this.view.getCanvas();
        canvas.setAttribute('transform', computedTransformDirective);
      }

      this.panDx = dx;
      this.panDy = dy;

      this.fireEvent(new mxgraph.mxEventObject(mxgraph.mxEvent.PAN), undefined);

      // DEBUG code
      // console.warn(`@@@@panGraph - useCssTransforms - dx=${dx} dy=${dy}`);
      // //console.warn(`@@@@panGraph - useCssTransforms - currentScale=${this.currentScale} currentTranslate=${this.currentTranslate.x}/${this.currentTranslate.y}`);
      // console.warn(`@@@@panGraph - useCssTransforms - before pan - panDx=${this.panDx} panDy=${this.panDy}`);
      // // this.panDx = dx;
      // //     this.panDy
      // super.panGraph(dx, dy);
      // console.warn(`@@@@panGraph - useCssTransforms - after pan - panDx=${this.panDx} panDy=${this.panDy}`);
    }
  }

  // mxGraph.prototype.panGraph = function(dx, dy)
  // {
  //   if (this.useScrollbarsForPanning && mxUtils.hasScrollbars(this.container))
  //   {
  //     this.container.scrollLeft = -dx;
  //     this.container.scrollTop = -dy;
  //   }
  //   else
  //   {
  //     var canvas = this.view.getCanvas();
  //
  //     if (this.dialect == mxConstants.DIALECT_SVG)
  //     {
  //       // Puts everything inside the container in a DIV so that it
  //       // can be moved without changing the state of the container
  //       if (dx == 0 && dy == 0)
  //       {
  //         // Workaround for ignored removeAttribute on SVG element in IE9 standards
  //         if (mxClient.IS_IE)
  //         {
  //           canvas.setAttribute('transform', 'translate(' + dx + ',' + dy + ')');
  //         }
  //         else
  //         {
  //           canvas.removeAttribute('transform');
  //         }
  //
  //         if (this.shiftPreview1 != null)
  //         {
  //           var child = this.shiftPreview1.firstChild;
  //
  //           while (child != null)
  //           {
  //             var next = child.nextSibling;
  //             this.container.appendChild(child);
  //             child = next;
  //           }
  //
  //           if (this.shiftPreview1.parentNode != null)
  //           {
  //             this.shiftPreview1.parentNode.removeChild(this.shiftPreview1);
  //           }
  //
  //           this.shiftPreview1 = null;
  //
  //           this.container.appendChild(canvas.parentNode);
  //
  //           child = this.shiftPreview2.firstChild;
  //
  //           while (child != null)
  //           {
  //             var next = child.nextSibling;
  //             this.container.appendChild(child);
  //             child = next;
  //           }
  //
  //           if (this.shiftPreview2.parentNode != null)
  //           {
  //             this.shiftPreview2.parentNode.removeChild(this.shiftPreview2);
  //           }
  //
  //           this.shiftPreview2 = null;
  //         }
  //       }
  //       else
  //       {
  //         canvas.setAttribute('transform', 'translate(' + dx + ',' + dy + ')');
  //
  //         if (this.shiftPreview1 == null)
  //         {
  //           // Needs two divs for stuff before and after the SVG element
  //           this.shiftPreview1 = document.createElement('div');
  //           this.shiftPreview1.style.position = 'absolute';
  //           this.shiftPreview1.style.overflow = 'visible';
  //
  //           this.shiftPreview2 = document.createElement('div');
  //           this.shiftPreview2.style.position = 'absolute';
  //           this.shiftPreview2.style.overflow = 'visible';
  //
  //           var current = this.shiftPreview1;
  //           var child = this.container.firstChild;
  //
  //           while (child != null)
  //           {
  //             var next = child.nextSibling;
  //
  //             // SVG element is moved via transform attribute
  //             if (child != canvas.parentNode)
  //             {
  //               current.appendChild(child);
  //             }
  //             else
  //             {
  //               current = this.shiftPreview2;
  //             }
  //
  //             child = next;
  //           }
  //
  //           // Inserts elements only if not empty
  //           if (this.shiftPreview1.firstChild != null)
  //           {
  //             this.container.insertBefore(this.shiftPreview1, canvas.parentNode);
  //           }
  //
  //           if (this.shiftPreview2.firstChild != null)
  //           {
  //             this.container.appendChild(this.shiftPreview2);
  //           }
  //         }
  //
  //         this.shiftPreview1.style.left = dx + 'px';
  //         this.shiftPreview1.style.top = dy + 'px';
  //         this.shiftPreview2.style.left = dx + 'px';
  //         this.shiftPreview2.style.top = dy + 'px';
  //       }
  //     }
  //     else
  //     {
  //       canvas.style.left = dx + 'px';
  //       canvas.style.top = dy + 'px';
  //     }
  //
  //     this.panDx = dx;
  //     this.panDy = dy;
  //
  //     this.fireEvent(new mxEventObject(mxEvent.PAN));
  //   }
  // };
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

  // ===========================================================================
  // POC transform with CSS
  // ===========================================================================
  // TODO improve types: make this.graph considered as BpmnGraph out of the box

  /**
   * Overrides getGraphBounds to use bounding box from SVG.
   */
  override getGraphBounds(): mxRectangle {
    let b = this.graphBounds;

    if ((<BpmnGraph>this.graph).useCssTransforms) {
      const t = (<BpmnGraph>this.graph).currentTranslate;
      const s = (<BpmnGraph>this.graph).currentScale;

      b = new mxgraph.mxRectangle((b.x + t.x) * s, (b.y + t.y) * s, b.width * s, b.height * s);
    }
    return b;
  }

  /**
   * Overrides to bypass full cell tree validation.
   * TODO: Check if this improves performance
   */
  override viewStateChanged(): void {
    if ((<BpmnGraph>this.graph).useCssTransforms) {
      this.validate();
      this.graph.sizeDidChange();
    } else {
      this.revalidate();
      this.graph.sizeDidChange();
    }
  }

  /**
   * Overrides validate to normalize validation view state and pass
   * current state to CSS transform.
   */
  // var graphViewValidate = mxGraphView.prototype.validate;
  override validate(cell?: mxCell): void {
    if ((<BpmnGraph>this.graph).useCssTransforms) {
      (<BpmnGraph>this.graph).currentScale = this.scale;
      (<BpmnGraph>this.graph).currentTranslate.x = this.translate.x;
      (<BpmnGraph>this.graph).currentTranslate.y = this.translate.y;

      this.scale = 1;
      this.translate.x = 0;
      this.translate.y = 0;
    }

    // graphViewValidate.apply(this, arguments);
    super.validate(cell);

    if ((<BpmnGraph>this.graph).useCssTransforms) {
      (<BpmnGraph>this.graph).updateCssTransform();

      this.scale = (<BpmnGraph>this.graph).currentScale;
      this.translate.x = (<BpmnGraph>this.graph).currentTranslate.x;
      this.translate.y = (<BpmnGraph>this.graph).currentTranslate.y;
    }
  }

  // TODO check if validateBackgroundPage is used by bpmn-visualization today, otherwise remove override
  // var graphViewValidateBackgroundPage = mxGraphView.prototype.validateBackgroundPage;
  override validateBackgroundPage(): void {
    console.warn('****validateBackgroundPage - start');
    const useCssTransforms = (<BpmnGraph>this.graph).useCssTransforms,
      scale = this.scale,
      translate = this.translate;

    if (useCssTransforms) {
      this.scale = (<BpmnGraph>this.graph).currentScale;
      this.translate = (<BpmnGraph>this.graph).currentTranslate;
    }

    // graphViewValidateBackgroundPage.apply(this, arguments);
    super.validateBackgroundPage();

    if (useCssTransforms) {
      this.scale = scale;
      this.translate = translate;
    }
  }

  // TODO check updatePageBreaks - not used by bpmn-visualization today
}
