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

export { BpmnVisualization } from './component/BpmnVisualization';
export * from './component/options';
export * from './component/registry';
export * from './model/bpmn/internal/shape';

// not part of the public API but needed for the custom theme examples
export { IconPainter } from './component/mxgraph/shape/render/icon-painter';
export { StyleConfigurator } from './component/mxgraph/config/StyleConfigurator';
export { ShapeUtil } from './model/bpmn/internal/shape/shape-utils';
export * from './component/mxgraph/StyleUtils';
export * from './component/mxgraph/shape/render';

// TODO remove mxgraph export, this is only needed by custom theme examples using the IIFE bundle to get mxgraph constants
// we should not export it and provide another ways in such examples
import { mxgraph } from './component/mxgraph/initializer';
export const mxConstants = mxgraph.mxConstants;
