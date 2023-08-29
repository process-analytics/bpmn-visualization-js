/*
Copyright 2023 Bonitasoft S.A.

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

import type { BpmnGraph } from '../BpmnGraph';
import { OverlayConverter } from './converter';
import type { Overlay } from '../../registry';
import { ensureIsArray } from '../../helpers/array-utils';
import { MxGraphCustomOverlay } from './custom-overlay';

export function createNewOverlaysUpdater(graph: BpmnGraph): OverlaysUpdater {
  return new OverlaysUpdater(graph, new OverlayConverter());
}

export class OverlaysUpdater {
  constructor(
    private readonly graph: BpmnGraph,
    private readonly overlayConverter: OverlayConverter,
  ) {}

  addOverlays(bpmnElementId: string, overlays: Overlay | Overlay[]): void {
    const cell = this.graph.getModel().getCell(bpmnElementId);
    if (!cell) {
      return;
    }
    ensureIsArray(overlays).forEach(overlay => {
      const bpmnOverlay = new MxGraphCustomOverlay(overlay.label, this.overlayConverter.convert(overlay));
      this.graph.addCellOverlay(cell, bpmnOverlay);
    });
  }

  removeAllOverlays(bpmnElementId: string): void {
    const cell = this.graph.getModel().getCell(bpmnElementId);
    if (!cell) {
      return;
    }
    this.graph.removeCellOverlays(cell);
  }
}
