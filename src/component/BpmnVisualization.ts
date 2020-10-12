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
import { newBpmnParser } from './parser/BpmnParser';

// TODO unable to load mxClient from mxgraph-type-definitions@1.0.2
declare const mxClient: typeof mxgraph.mxClient;

export default class BpmnVisualization {
  public readonly graph: mxGraph;

  constructor(protected container: HTMLElement, options?: BpmnVisualizationOptions) {
    try {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
      }
      // Instantiate and configure Graph
      const configurator = new MxGraphConfigurator(this.container);
      this.graph = configurator.configure(options);
      this.configureMouseEvent(options?.mouseNavigationSupport);
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot start application: ' + e.message);
      throw e;
    }
  }

  public load(xml: string): void {
    try {
      const bpmnModel = newBpmnParser().parse(xml);
      defaultMxGraphRenderer(this.graph).render(bpmnModel);
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot load bpmn diagram: ' + e.message);
      throw e;
    }
  }

  private configureMouseEvent(activated = false): void {
    if (!activated) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    // const self = this; // TODO replace with arrow function to access to this directly
    mxEvent.addMouseWheelListener(function (event: Event, up: boolean) {
      // TODO review type: this hack is due to the introduction of mxgraph-type-definitions
      const evt = (event as unknown) as MouseEvent;
      const mxMouseEvent = (evt as unknown) as mxMouseEvent;
      if (!mxEvent.isConsumed(mxMouseEvent)) {
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
          //self.zoom(up ? ZoomType.In : ZoomType.Out);
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
          //let panType: PanType;
          if (isPanningHorizontalWheelEvent) {
            // eslint-disable-next-line no-console
            console.info('[MouseWheelListener] panning horizontal');
          } else {
            // eslint-disable-next-line no-console
            console.info('[MouseWheelListener] panning vertical');
          }
          mxEvent.consume(evt);
        }
      }
    }, this.container);
  }

  // private onMouseWheel(): void {
  //
  // }
}

export interface BpmnVisualizationOptions {
  /**
   * If set to `true`, activate panning i.e. the BPMN diagram is draggable and can be moved using the mouse.
   */
  mouseNavigationSupport: boolean;
}
