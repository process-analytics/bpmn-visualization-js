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

import type { Overlay } from './types';
import type { OverlaysUpdater } from '../mxgraph/overlay/updater';
import { createNewOverlaysUpdater } from '../mxgraph/overlay/updater';
import type { BpmnGraph } from '../mxgraph/BpmnGraph';

export function createNewOverlaysRegistry(graph: BpmnGraph): OverlaysRegistry {
  return new OverlaysRegistry(createNewOverlaysUpdater(graph));
}

export class OverlaysRegistry {
  constructor(private overlaysUpdater: OverlaysUpdater) {}

  addOverlays(bpmnElementId: string, overlays: Overlay | Overlay[]): void {
    this.overlaysUpdater.addOverlays(bpmnElementId, overlays);
  }

  removeAllOverlays(bpmnElementId: string): void {
    this.overlaysUpdater.removeAllOverlays(bpmnElementId);
  }
}