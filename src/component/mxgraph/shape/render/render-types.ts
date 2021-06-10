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

import { BpmnCanvas } from './BpmnCanvas';

/**
 * @category BPMN Theme
 */
export interface ShapeConfiguration extends Size {
  x: number;
  y: number;
  strokeWidth?: number;
}

/**
 * @category BPMN Theme
 */
export interface IconStyleConfiguration {
  isFilled: boolean;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  margin: number;
}

/**
 * @category BPMN Theme
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * @category BPMN Theme
 */
export interface IconConfiguration {
  originalSize: Size;
  /** If `undefined`, no scaling will be done in {@link BpmnCanvas}. */
  ratioFromParent?: number;
  styleConfig: IconStyleConfiguration;
  setIconOriginFunct: (canvas: BpmnCanvas) => void;
}

// fake for esbuild, otherwise no js file is generated because it only contains types
export class Fake {}
