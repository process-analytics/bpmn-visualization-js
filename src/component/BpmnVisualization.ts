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
import BpmnVisualizationOptions, { PanType, ZoomType } from './BpmnVisualizationOptions';
import Logger from './Logger';

// TODO unable to load mxClient from mxgraph-type-definitions@1.0.2
declare const mxClient: typeof mxgraph.mxClient;

export default class BpmnVisualization {
  public readonly graph: mxGraph;
  private mainConfigLogger = new Logger('bpmn.main#config');

  constructor(protected container: HTMLElement, options?: BpmnVisualizationOptions) {
    try {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
      }
      // Instantiate and configure Graph
      const configurator = new MxGraphConfigurator(this.container);
      //this.graph = configurator.configure();

      // TODO make activation/deactivation configurable
      this.configureMouseEvent(true);

      this.graph = configurator.configure(options);
      this.configureKeyHandler();
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot start application: ' + e.message);
      throw e;
    }
  }

  private loadLogger: Logger = new Logger('bpmn.main#load');

  public load(xml: string): void {
    this.loadLogger.info('Start loading BPMN');
    const initialStartTime = performance.now();
    try {
      // TODO the BpmnParser should be a field and injected (see #110)
      let startTime = performance.now();
      const bpmnModel = defaultBpmnParser().parse(xml);
      let endTime = performance.now();
      this.loadLogger.info(`Parsing done in ${endTime - startTime} ms`);
      startTime = endTime;
      defaultMxGraphRenderer(this.graph).render(bpmnModel);
      endTime = performance.now();
      this.loadLogger.info(`Rendering done in ${endTime - startTime} ms`);
      this.loadLogger.info(`BPMN loaded in ${endTime - initialStartTime} ms`);
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot load bpmn diagram: ' + e.message);
      throw e;
    }
  }

  private configureMouseEvent(activated: boolean): void {
    if (!activated) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    mxEvent.addMouseWheelListener(function (event: Event, up: boolean) {
      if (!(event instanceof MouseEvent)) {
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
        console.info('[MouseWheelListener] event related to the graph container?', isEventRelatedToGraphContainer);
        if (!isEventRelatedToGraphContainer) {
          return;
        }

        // only the ctrl key or the meta key on mac
        const isZoomWheelEvent = (evt.ctrlKey || (mxClient.IS_MAC && evt.metaKey)) && !evt.altKey && !evt.shiftKey;

        if (isZoomWheelEvent) {
          // eslint-disable-next-line no-console
          console.info('[MouseWheelListener] zooming');
          // TODO pass the point coordinate to use as center
          const cursorPosition = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
          // TODO we could have an option to ignoreCursorPosition
          // eslint-disable-next-line no-console
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
    }, this.container);
  }

  /* eslint-enable no-console */

  private keyHandlerLogger = new Logger('KeyHandler');

  private configureKeyHandler(): void {
    this.mainConfigLogger.info('Configuring key handler');
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
    this.mainConfigLogger.info('Key handler configured');
  }

  private zoomLogger: Logger = new Logger('bpmn.main#zoom');

  private fit(zoomType: ZoomType): void {
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
  }

  // TODO zoom factor should be configurable (in global BpmnVisualizationOptions)
  // TODO see lazyZoom of draw.io
  public zoom(zoomType: ZoomType): void {
    const startTime = performance.now();
    this.zoomLogger.info(`Start Zooming, type: ${ZoomType[zoomType]}`);

    // TODO add an option to center without zooming
    //this.graph.center(true, true);
    switch (zoomType) {
      case ZoomType.Actual:
        this.graph.zoomActual();
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
    this.zoomLogger.info(`Zoom completed in ${performance.now() - startTime} ms`);
  }
  private panLogger: Logger = new Logger('bpmn.main#pan');

  public pan(panType: PanType): void {
    const startTime = performance.now();
    this.panLogger.info(`Panning in direction ${PanType[panType]}`);
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
    this.panLogger.info(`Panning done in ${performance.now() - startTime} ms`);
  }
}
