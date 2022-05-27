/**
 * Copyright 2022 Bonitasoft S.A.
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

import type { BpmnGraph } from './mxgraph/BpmnGraph';
import type { FitOptions, ZoomType } from './options';

/**
 * Perform BPMN diagram navigation.
 * @category Navigation
 * @experimental subject to change, feedback welcome.
 */
export class Navigation {
  constructor(private readonly graph: BpmnGraph) {}

  fit(options?: FitOptions): void {
    this.graph.customFit(options);
  }

  zoom(type: ZoomType): void {
    type == 'in' ? this.graph.zoomIn() : this.graph.zoomOut();
  }
}
