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

/**
 * Options to configure the `bpmn-visualization` initialization.
 * @category Initialization
 */
export interface GlobalOptions {
  /** The id of a DOM element or an HTML node where the BPMN diagram is rendered. */
  container: string | HTMLElement;
  /** Configure the BPMN diagram navigation (panning and zoom). */
  navigation?: NavigationConfiguration;
}

/**
 * Configure the BPMN diagram navigation (panning and zoom).
 * @category Initialization
 */
export interface NavigationConfiguration {
  /**
   * Enable the navigation with the mouse wheel or with gesture/pinch on touch devices.
   * @default false
   */
  enabled: boolean;
  /** Tune how the zoom behaves when using the mouse wheel or with gesture/pinch on touch devices. */
  zoom?: ZoomConfiguration;
}

/**
 * Zoom specific options.
 * @category Initialization
 */
export interface ZoomConfiguration {
  /**
   * Value in `milliseconds` responsible for throttling the mouse scroll event (not every event is firing the function handler, only limited number can lunch handler). A smaller value
   * results in more events fired, bigger gain in zoom factor.
   * Values must be in the [0, 100] interval, values outside this interval are set to the interval bounds.
   * @default 50
   */
  throttleDelay?: number;
  /**
   * Value in `milliseconds` responsible for debouncing the zoom function - the actual scaling. A bigger value results in bigger gain in zoom factor before actual scaling takes place.
   * Values must be in the [0, 100] interval, values outside this interval are set to the interval bounds.
   * @default 50
   */
  debounceDelay?: number;
}

/**
 * Model filtering configuration.
 *
 * Here is an example of how to perform model filtering when loading a BPMN diagram:
 * ```typescript
 * bpmnVisualization.load(diagram, {
 *   modelFilter: {
 *     pools: [
 *       {
 *         // id of the Participant related to the Pool to display
 *         id: 'id1'
 *       },
 *       {
 *         // Name of the Participant, or name of the Process referenced by the Participant
 *         // when the Participant doesn't have a name.
 *         // This is how `bpmn-visualization` builds the name into its internal model.
 *         name: 'name2'
 *       },
 *       {
 *       id: 'id3',
 *       // in this case, we only use the id, and ignore the name
 *       name: 'name3'
 *       }
 *     ]},
 * });
 * ```
 *
 * @category Initialization
 */
export interface ModelFilter {
  pools?: PoolFilter | PoolFilter[];
}

/**
 * Pool filtering configuration.
 *
 * A Pool is the graphical representation of a Participant in a Collaboration.
 * @category Initialization
 */
export interface PoolFilter {
  /** id of the Participant related to the Pool to display */
  id?: string;
  /**
   * Name of the Participant, or name of the Process referenced by the Participant when the Participant doesn't have a name.
   * This is how `bpmn-visualization` builds the name into its internal model.
   * If `id` is set, this property is ignored.
   */
  name?: string;
}

/**
 * Options when loading a BPMN Diagram.
 * @category Initialization
 */
export interface LoadOptions {
  fit?: FitOptions;
  modelFilter?: ModelFilter;
}

/**
 * @category Initialization
 */
export interface FitOptions {
  /** @default {@link FitType.None} */
  type?: FitType;
  /**
   * Negative values fallback to default.
   * @default 0
   */
  margin?: number;
}

/**
 * @category Navigation
 */
export enum FitType {
  /** No fit, use dimensions and coordinates from the BPMN diagram. */
  None = 'None',
  /** Fit the whole html container available to render the BPMN diagram. */
  HorizontalVertical = 'HorizontalVertical',
  /** Fit only horizontally. */
  Horizontal = 'Horizontal',
  /** Fit only vertically. */
  Vertical = 'Vertical',
  /** Fit and center the BPMN Diagram. */
  Center = 'Center',
}

/**
 * @category Navigation
 * @since 0.24.0
 */
export enum ZoomType {
  In = 'in',
  Out = 'out',
}
