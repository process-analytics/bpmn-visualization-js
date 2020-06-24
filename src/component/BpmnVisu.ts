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

declare const mxClient: typeof mxgraph.mxClient;
declare const mxUtils: typeof mxgraph.mxUtils;
declare const mxEvent: typeof mxgraph.mxEvent;
declare const mxOutline: typeof mxgraph.mxOutline;
declare const mxPrintPreview: typeof mxgraph.mxPrintPreview;
declare const mxWindow: typeof mxgraph.mxWindow;

export default class BpmnVisu {
  public readonly graph: mxgraph.mxGraph;

  constructor(protected container: Element, options?: BpmnVisuOptions) {
    try {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
      }
      // Instantiate and configure Graph
      const configurator = new MxGraphConfigurator(this.container, options);

      // Changes the zoom on mouseWheel events
      // TODO make activation/deactivation configurable
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this; // TODO replace with array function to access to this directly
      mxEvent.addMouseWheelListener(function(evt: MouseEvent, up: boolean) {
        // TODO only manage event related to the graph or in the container of the graph
        if (!mxEvent.isConsumed(evt)) {
          // eslint-disable-next-line no-console
          console.info('MouseWheelListener: up: %s / altkey: %s / ctrlKey: %s / shiftKey: %s', up, evt.altKey, evt.ctrlKey, evt.shiftKey);

          const zoomKey = evt.ctrlKey && !evt.altKey;
          // const panKey = !evt.ctrlKey && evt.altKey;

          if (zoomKey) {
            self.zoom(up ? ZoomType.In : ZoomType.Out);
            mxEvent.consume(evt);
          }
        }
      }, null);

      this.graph = configurator.getGraph();
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot start application: ' + e.message);
      throw e;
    }
  }

  /* eslint-disable no-console */ public load(xml: string): void {
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
    const panValue = 20;
    const view = this.graph.getView();
    switch (panType) {
      case PanType.VerticalUp:
        view.setTranslate(0, panValue);
        break;
      case PanType.VerticalDown:
        view.setTranslate(0, -panValue);
        break;
      case PanType.HorizontalLeft:
        view.setTranslate(panValue, 0);
        break;
      case PanType.HorizontalRight:
        view.setTranslate(-panValue, 0);
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

  public toggleOutline(): void {
    // eslint-disable-next-line no-console
    console.info('Graph toggle outline');
    if (this.outlineWindow == null) {
      this.showOutline();
    } else {
      this.outlineWindow.setVisible(!this.outlineWindow.isVisible());
    }
  }

  // adapted from https://github.com/jgraph/mxgraph2/blob/a15684d7c8b71074e4c73d89c9192459288e0bf4/javascript/src/js/editor/mxEditor.js#L2779-L2823

  private outlineWindow: mxgraph.mxWindow;
  private outline: mxgraph.mxOutline;
  private showOutline(): void {
    const create = this.outlineWindow == null;

    if (create) {
      const div = document.createElement('div');

      div.style.overflow = 'hidden';
      div.style.position = 'relative';
      div.style.width = '100%';
      div.style.height = '100%';
      div.style.background = 'white';
      div.style.cursor = 'move';

      // TODO window position is currently at the bottom of the page
      // the mxWindow api doc provides lot of example about how to manage and limit position
      // title: any,
      //     content: any,
      //     x: any,
      //     y: any,
      //     width: any,
      //     height?: any,
      //     minimizable?: any,
      //     movable?: any,
      //     replaceNode?: any,
      //     style?: any,
      const wnd = new mxWindow('Outline', div, 600, 480, 200, 200, false);
      // TODO default implementaton requires some images to be available, currently generates 404
      // path to images can be overriden: see https://github.com/jgraph/mxgraph2/blame/5d407ab0e9d6103d1245d1ebe216dd46b5c7be5a/javascript/src/js/util/mxWindow.js#L228-L256
      // for instance mxWindow.prototype.minimizeImage

      // Creates the outline in the specified div
      // and links it to the existing graph
      const outline = new mxOutline(this.graph, div);
      outline.setZoomEnabled(false);
      // TODO review carefully as this can impact performance
      //outline.graphRenderHint = 'fastest'; // have no effect on svg browser
      outline.updateOnPan = true;
      outline.labelsVisible = true; // TODO see how we can make it work
      // outline.hilabelsVisible = true;
      wnd.setClosable(false);
      wnd.setResizable(false);
      // TODO missing in types declaration
      //wnd.destroyOnClose = false;

      // TODO check if we need this
      wnd.addListener(mxEvent.RESIZE_END, function() {
        outline.update(false);
      });

      this.outlineWindow = wnd;
      this.outline = outline;
    }

    // Finally shows the outline
    this.outlineWindow.setVisible(true);
    this.outline.update(true);
  }
}
