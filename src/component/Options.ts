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

export interface BpmnVisualizationOptions {
  /**
   * If set to `true`, activate panning i.e. the BPMN diagram is draggable and can be moved using the mouse.
   */
  mouseNavigationSupport: boolean;
}

export interface LoadOptions {
  fit?: FitOptions;
}

export interface FitOptions {
  type?: FitType; // TODO mandatory?
  /** @default 0 */
  margin?: number;
}

/**
 * @default {@link FitType.None}
 */
export enum FitType {
  /** No fit, use dimensions and coordinates from the BPMN diagram. */
  None,
  /** Fit the whole viewport. */
  HorizontalVertical,
  /** Fit only horizontally. */
  Horizontal,
  /** Fit only vertically. */
  Vertical,
  /** Fit and center the BPMN Diagram. */
  Center,
}
