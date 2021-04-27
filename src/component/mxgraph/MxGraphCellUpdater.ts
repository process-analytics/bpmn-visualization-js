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

import { BpmnMxGraph } from './BpmnMxGraph';
import { StyleIdentifier } from './StyleUtils';
import { Overlay } from '../registry';
import { MxGraphCustomOverlay } from './overlay/custom-overlay';
import { ensureIsArray } from '../helpers/array-utils';
import { OverlayConverter } from './overlay/OverlayConverter';
import { mxCell, mxGeometry } from 'mxgraph';
import { mxgraph } from './initializer'; // for types

export function newMxGraphCellUpdater(graph: BpmnMxGraph): MxGraphCellUpdater {
  return new MxGraphCellUpdater(graph, new OverlayConverter());
}

/**
 * @internal
 */
export default class MxGraphCellUpdater {
  constructor(readonly graph: BpmnMxGraph, readonly overlayConverter: OverlayConverter) {}

  public updateAndRefreshCssClassesOfCell(bpmnElementId: string, cssClasses: string[]): void {
    const mxCell = this.graph.getModel().getCell(bpmnElementId);
    if (!mxCell) {
      return;
    }
    const view = this.graph.getView();
    const state = view.getState(mxCell);
    state.style[StyleIdentifier.BPMN_STYLE_EXTRA_CSS_CLASSES] = cssClasses;
    state.shape.apply(state);
    state.shape.redraw();
  }

  public addOverlays(bpmnElementId: string, overlays: Overlay | Overlay[]): void {
    const mxCell = this.graph.getModel().getCell(bpmnElementId);
    if (!mxCell) {
      return;
    }
    ensureIsArray(overlays).forEach(overlay => {
      // const bpmnOverlay = new MxGraphCustomOverlay(overlay.label, this.overlayConverter.convert(overlay));
      // this.graph.addCellOverlay(mxCell, bpmnOverlay);
      this.addVertexOverlay(mxCell, overlay);
    });
  }

  private addVertexOverlay(mxCell: mxCell, overlay: Overlay): void {
    if (mxCell['vertexOverlays'] && mxCell['vertexOverlays'].length) {
      mxCell['vertexOverlays'].push(overlay);
    } else {
      mxCell['vertexOverlays'] = [overlay];
    }

    let vertex: mxCell;
    const model = this.graph.getModel();
    model.beginUpdate();
    try {
      // Creates the geometry for the vertex
      const geometry = new mxgraph.mxGeometry(1, 1, 20, 14);
      geometry.relative = true;
      geometry.offset = new mxgraph.mxPoint(-10, -7);

      // Creates the vertex
      // const vertex = new mxgraph.mxCell(overlay.label, geometry, 'cursor-pointer');
      vertex = new CellWithListeners(overlay.label, geometry, 'cursor-pointer');
      vertex.setId(`vertexOverlay_${mxCell.id}_${overlay.label}`);
      vertex.setVertex(true);
      vertex.setConnectable(true);
      this.graph.addCell(vertex, mxCell);
    } finally {
      model.endUpdate();
    }
    const graphInstance = this.graph;
    const view = this.graph.getView();
    const state = view.getState(vertex);

    // TODO: finally not needed if we do not plan to interfere with the internal mxGraph events
    // vertex.addListener(mxgraph.mxEvent.CLICK, () => {
    //   do something eventually
    // });
    mxgraph.mxEvent.addListener(state.shape.node, 'click', function (evt: Event) {
      // eslint-disable-next-line no-console
      console.log('EVENT FIRED FROM vertex - mxgraph.mxEvent.addListener');
      // if (graphInstance.isEditing()) {
      //   graphInstance.stopEditing(!graphInstance.isInvokesStopCellEditing());
      // }
      // TODO: finally not needed if we do not plan to interfere with the internal mxGraph events
      //vertex.fireEvent(new mxgraph.mxEventObject(mxgraph.mxEvent.CLICK, 'event', evt, 'cell', vertex));
    });
  }

  public removeAllOverlays(bpmnElementId: string): void {
    const mxCell = this.graph.getModel().getCell(bpmnElementId);
    if (!mxCell) {
      return;
    }
    this.graph.removeCellOverlays(mxCell);
  }
}

class CellWithListeners extends mxgraph.mxCell {
  constructor(value?: any, geometry?: mxGeometry, style?: string) {
    super(value, geometry, style);
    // TODO: finally not needed if we do not plan to interfere with the internal mxGraph events
    //
    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore
    // for (const prop: any in mxgraph.mxEventSource.prototype) {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   this[prop] = mxgraph.mxEventSource.prototype[prop];
    // }
  }
}
