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
import MxGraphConfigurator from './mxgraph/MxGraphConfigurator';
import { mxgraph } from 'ts-mxgraph';
import { defaultMxGraphRenderer } from './mxgraph/MxGraphRenderer';
import { defaultBpmnParser } from './parser/BpmnParser';
import BpmnVisuOptions, { PanType, ZoomType } from './BpmnVisuOptions';
import SvgExporter from './mxgraph/extension/SvgExporter';
import Logger from './Logger';

// TODO unable to load mxClient from mxgraph-type-definitions@1.0.2
declare const mxClient: typeof mxgraph.mxClient;

/* eslint-disable no-console */
export default class BpmnVisualization {
  public readonly graph: mxGraph;

  constructor(protected container: HTMLElement, options?: BpmnVisuOptions) {
    try {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
      }
      // Instantiate and configure Graph
      const configurator = new MxGraphConfigurator(this.container);

      // Changes the zoom / panning on mouseWheel events
      // TODO make activation/deactivation configurable
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this; // TODO replace with array function to access to this directly
      mxEvent.addMouseWheelListener(function(event: Event, up: boolean) {
        if (!(event instanceof MouseEvent)) {
          console.info('[MouseWheelListener] event is not a MouseEvent', event);
          return;
        }

        // TODO review type: this hack is due to the introduction of mxgraph-type-definitions
        const evt = (event as unknown) as MouseEvent;
        const mxMouseEvent = (evt as unknown) as mxMouseEvent;
        if (!mxEvent.isConsumed(mxMouseEvent)) {
          // console.info('[MouseWheelListener] evt: up: %s / altkey: %s / ctrlKey: %s / shiftKey: %s', up, evt.altKey, evt.ctrlKey, evt.shiftKey);
          // console.info('[MouseWheelListener] evt: x: %s / y: %s', evt.clientX, evt.clientY);
          // console.info('MouseWheelListener mxMouseEvent: graphX: %s / graphY: %s', mxMouseEvent.graphX, mxMouseEvent.graphY);

          let isEventRelatedToGraphContainer = false;
          let source = mxEvent.getSource(evt);
          console.info('[MouseWheelListener] Checking source');
          while (source != null) {
            // console.info('[MouseWheelListener] source', source);
            if (source == self.graph.container) {
              // console.info('[MouseWheelListener] is graph container!!');
              isEventRelatedToGraphContainer = true;
              break;
            }
            source = source.parentNode;
          }
          console.info('[MouseWheelListener] event related to the graph container?', isEventRelatedToGraphContainer);
          if (!isEventRelatedToGraphContainer) {
            return;
          }

          // only the ctrl key or the meta key on mac
          const isZoomWheelEvent = (evt.ctrlKey || (mxClient.IS_MAC && evt.metaKey)) && !evt.altKey && !evt.shiftKey;

          if (isZoomWheelEvent) {
            console.info('[MouseWheelListener] zooming');
            // TODO pass the point coordinate to use as center
            const cursorPosition = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
            // TODO we could have an option to ignoreCursorPosition
            console.info('[MouseWheelListener] cursor position', cursorPosition);
            self.zoom(up ? ZoomType.In : ZoomType.Out);
            mxEvent.consume(evt);

            // console.info('[MouseWheelListener] after zoom - scrolling to cursorPosition');
            // // https://github.com/jgraph/drawio/blob/051eed36389f5bebe487663097f340e59940d87a/src/main/webapp/js/mxgraph/EditorUi.js#L2216
            // // const sp = new mxPoint(self.graph.container.scrollLeft, self.graph.container.scrollTop);
            // const offset = mxUtils.getOffset(self.graph.container);
            // console.info('[MouseWheelListener] after zoom - offset', offset);
            // // const prev = self.graph.view.scale;
            // let dx = 0;
            // let dy = 0;
            //
            // dx = self.graph.container.offsetWidth / 2 - cursorPosition.x + offset.x;
            // dy = self.graph.container.offsetHeight / 2 - cursorPosition.y + offset.y;
            // console.info('[MouseWheelListener] after zoom - dx', dx);
            // console.info('[MouseWheelListener] after zoom - dy', dy);
            //
            // self.graph.container.scrollLeft -= dx;
            // self.graph.container.scrollTop -= dy;
            // console.info('[MouseWheelListener] after zoom - scrolling done');
          }
          // shift only
          const isPanningHorizontalWheelEvent = evt.shiftKey && !evt.altKey && !evt.ctrlKey && !evt.metaKey;
          // no key
          const isPanningVerticalWheelEvent = !evt.altKey && !evt.shiftKey && !evt.ctrlKey && !evt.metaKey;

          if (isPanningHorizontalWheelEvent || isPanningVerticalWheelEvent) {
            let panType: PanType;
            if (isPanningHorizontalWheelEvent) {
              panType = up ? PanType.HorizontalLeft : PanType.HorizontalRight;
            } else {
              panType = up ? PanType.VerticalUp : PanType.VerticalDown;
            }
            self.pan(panType);
            mxEvent.consume(evt);
          }
        }
      }, null);

      this.graph = configurator.configure(options);
      this.configureKeyHandler();
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot start application: ' + e.message);
      throw e;
    }
  }

  private keyHandlerLogger = new Logger('KeyHandler');
  private configureKeyHandler(): void {
    console.info('configuring key handler');
    const keyHandler = new mxKeyHandler(this.graph);

    // TODO for panning with arrow, configure shift + key for smaller or larger panning
    const panningKeys = new Map<number, PanType>([
      [37, PanType.HorizontalLeft], // left arrow
      [38, PanType.VerticalUp], // up arrow
      [39, PanType.HorizontalRight], // right arrow
      [40, PanType.VerticalDown], // down arrow
    ]);
    panningKeys.forEach((panType: PanType, code: number) => {
      keyHandler.bindKey(code, (event: KeyboardEvent): void => {
        this.keyHandlerLogger.info('key pressed: ' + event.code);
        this.pan(panType);
        this.keyHandlerLogger.info('End of key management: ' + event.code);
      });
    });
  }

  public load(xml: string): void {
    console.info('Start loading BPMN');
    try {
      // TODO the BpmnParser should be a field and injected (see #110)
      const bpmnModel = defaultBpmnParser().parse(xml);
      console.info('Parsing done');
      defaultMxGraphRenderer(this.graph).render(bpmnModel);
      console.info('Rendering done');
      console.info('BPMN loaded');
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot load bpmn diagram: ' + e.message);
      throw e;
    }
  }

  private fit(zoomType: ZoomType): void {
    // TODO log the zoomType
    console.info('Zooming to Fit');
    let ignoreWidth = false;
    let ignoreHeight = false;
    switch (zoomType) {
      case ZoomType.FitHorizontal:
        ignoreHeight = true;
        break;
      case ZoomType.FitVertical:
        ignoreWidth = true;
        break;
    }

    this.graph.fit(0, false, 0, true, ignoreWidth, ignoreHeight);
    console.info('Zoom to Fit completed');
  }

  // TODO zoom factor should be configurable (in global BpmnVisuOptions)
  // TODO see lazyZoom of draw.io
  public zoom(zoomType: ZoomType): void {
    // TODO add an option to center without zooming
    //this.graph.center(true, true);
    switch (zoomType) {
      case ZoomType.Actual:
        console.info('Zooming to actual');
        this.graph.zoomActual();
        console.info('Zoom to actual completed');
        break;
      case ZoomType.Fit:
      case ZoomType.FitHorizontal:
      case ZoomType.FitVertical:
        this.fit(zoomType);
        break;
      case ZoomType.In:
        this.graph.zoomIn();
        break;
      case ZoomType.Out:
        this.graph.zoomOut();
        break;
      default:
        throw new Error('Unsupported zoom option ' + zoomType);
    }
  }

  public pan(panType: PanType): void {
    console.info('Panning %s', panType);
    const view = this.graph.getView();
    const panValue = 40 / view.scale;

    // inspired from https://github.com/jgraph/drawio/blob/c6a423432912165e9d9e67a21dad22c8a27e8e8e/src/main/webapp/js/mxgraph/EditorUi.js#L2391
    const translatePoint = view.getTranslate();

    switch (panType) {
      case PanType.VerticalUp:
        view.setTranslate(translatePoint.x, translatePoint.y + panValue);
        break;
      case PanType.VerticalDown:
        view.setTranslate(translatePoint.x, translatePoint.y - panValue);
        break;
      case PanType.HorizontalLeft:
        view.setTranslate(translatePoint.x + panValue, translatePoint.y);
        break;
      case PanType.HorizontalRight:
        view.setTranslate(translatePoint.x - panValue, translatePoint.y);
        break;
      default:
        throw new Error('Unsupported pan option ' + panType);
    }
    console.info('panning done');
  }

  public preview(): void {
    const preview = new mxPrintPreview(this.graph, 1, undefined, undefined);
    preview.open(undefined, undefined, undefined, undefined);
  }

  public exportAsSvg(): string {
    console.info('Starting svg export');
    const svg = new SvgExporter(this.graph).exportSvg();
    console.info('Svg export completed');
    console.info(svg);
    return svg;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////// OUTLINE ////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // adapted from https://github.com/jgraph/mxgraph2/blob/a15684d7c8b71074e4c73d89c9192459288e0bf4/javascript/src/js/editor/mxEditor.js#L2779-L2823

  private outlineLogger = new Logger('Outline');
  private outline: mxOutline;
  private isOutlineShown = false;

  // TODO find a better way to pass the outline container (only needed for outline init)
  public toggleOutline(container: HTMLElement): void {
    this.outlineLogger.info('toggle in progress');
    this.ensureOutlineInstanceInitialized(container);

    this.outline.suspended = !this.outline.suspended;
    if (!this.outline.suspended) {
      this.outline.update(true);
    }

    this.outlineLogger.info('toggle completed');
  }

  private ensureOutlineInstanceInitialized(container: HTMLElement): void {
    if (this.outline == null) {
      this.outlineLogger.info('initializing outline');

      // TODO restore outline settings defaults after creating the instance
      mxConstants.OUTLINE_COLOR = 'Orange';
      mxConstants.OUTLINE_STROKEWIDTH = 2;

      // TODO this seems requesting expanded.gif images from mxgraph assets
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const outline = new CustomOutline(this.graph, container);
      // outline.showViewport = false;
      // TODO review carefully as this can impact performance
      outline.setZoomEnabled(false); // TODO this function only hidde the square (aka handle), but zooming is still available
      //outline.graphRenderHint = 'fastest'; // have no effect on svg browser
      outline.updateOnPan = false; // when true, probably too much impact on rendering performance and not really usefull
      outline.labelsVisible = false; // TODO see how we can make it work (may not work when isHtmlLabel is true in the main graph) BUT do we need it?

      // mark it suspended on creation, to make toggling work
      outline.suspended = true;

      this.outline = outline;
      this.outlineLogger.info('outline init completed');
    }
  }
}

// TODO attempt to have labels, they not show even when htmlLabels is false in the source graph
class CustomOutline extends mxOutline {
  constructor(source: mxGraph, container: HTMLElement) {
    super(source, container);
  }

  createGraph(container: HTMLElement): mxGraph {
    const graph = super.createGraph(container);

    const htmlLabels = this.source.htmlLabels;
    console.warn('CustomOutline - source graph htmllabels?', htmlLabels);
    console.warn('CustomOutline - outline graph htmllabels?', graph.htmlLabels);
    graph.htmlLabels = htmlLabels;

    return graph;
  }
}
