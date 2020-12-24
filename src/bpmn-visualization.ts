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

// TODO remove dedicated import/export
// this is currently needed, otherwise module default exports are not exported in bundle js
import BpmnVisualization from './component/BpmnVisualization';
/*import IconPainter from './component/g6/shape/render/IconPainter';
import StyleConfigurator from './component/g6/config/StyleConfigurator';*/
import ShapeUtil from './model/bpmn/internal/shape/ShapeUtil';

export { BpmnVisualization };
/*export { IconPainter };
export { StyleConfigurator };*/
export { ShapeUtil };
// end of 'TO DO remove dedicated import/export'

export * from './component/options';
export * from './component/g6/StyleUtils';
/*export * from './component/g6/shape';*/
export * from './component/registry';

// TODO restore 'alias export' to avoid any name clash with the demo code, when esLint parsing error is fixed: "Parsing error: Cannot read property 'map' of undefined"
// bug: https://github.com/typescript-eslint/typescript-eslint/issues/1653
// enhancement: https://github.com/typescript-eslint/typescript-eslint/issues/1436
// export * as bpmnVisualizationDemo from './demo';
export * from './demo';
export * from './model/bpmn/internal/shape';
