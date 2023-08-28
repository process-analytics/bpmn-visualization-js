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

import type { BpmnGraph } from '../mxgraph/BpmnGraph';
import { createNewStyleUpdater, type StyleUpdater } from '../mxgraph/style/style-updater';
import type { StyleUpdate } from './types';

export function createNewStyleRegistry(graph: BpmnGraph): StyleRegistry {
  return new StyleRegistry(createNewStyleUpdater(graph));
}

export class StyleRegistry {
  constructor(private readonly styleUpdater: StyleUpdater) {}

  clearCache(): void {
    this.styleUpdater.clear();
  }

  updateStyle(bpmnElementIds: string | string[], styleUpdate: StyleUpdate): void {
    this.styleUpdater.updateStyle(bpmnElementIds, styleUpdate);
  }

  resetStyle(bpmnElementIds?: string | string[]): void {
    this.styleUpdater.resetStyle(bpmnElementIds);
  }
}
