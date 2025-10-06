/*
Copyright 2020 Bonitasoft S.A.

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

/**
 * Options to configure the `bpmn-visualization` initialization.
 * @category Initialization & Configuration
 */
export interface GlobalOptions {
  /** The id of a DOM element or an HTML node where the BPMN diagram is rendered. */
  container: string | HTMLElement;
  /** Configure the BPMN diagram navigation (panning and zoom). */
  navigation?: NavigationConfiguration;
  /** Configure the BPMN parser. */
  parser?: ParserOptions;
  /** Configure how the BPMN diagram and its elements are rendered. */
  renderer?: RendererOptions;
}

/**
 * Configure the BPMN diagram navigation (panning and zoom).
 * @category Initialization & Configuration
 */
export interface NavigationConfiguration {
  /**
   * Enable the navigation with the mouse wheel or with gesture/pinch on touch devices.
   *
   * **IMPORTANT**: the navigation API is not affected by this value. Navigation actions performed with the API always have an effect.
   * @default false
   */
  enabled: boolean;
  /** Tune how the zoom behaves when using the mouse wheel or with gesture/pinch on touch devices. */
  zoom?: ZoomConfiguration;
}

/**
 * Zoom specific options.
 * @category Initialization & Configuration
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
 * ```
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
 * @category Initialization & Configuration
 */
export interface ModelFilter {
  pools?: PoolFilter | PoolFilter[];
}

/**
 * Pool filtering configuration.
 *
 * A Pool is the graphical representation of a Participant in a Collaboration.
 * @category Initialization & Configuration
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
 * @category Initialization & Configuration
 */
export interface LoadOptions {
  fit?: FitOptions;
  modelFilter?: ModelFilter;
}

/**
 * @category Initialization & Configuration
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

/**
 * Configure the BPMN parser.
 * @category Initialization & Configuration
 */
export type ParserOptions = {
  /**
   * Apply additional processing to the XML attributes in the BPMN source.
   *
   * When defined, this function is called after the `bpmn-visualization` attribute processing.
   * You can use it to perform extra entities decoding. This can be done by using libraries like {@link https://www.npmjs.com/package/entities}.
   * ```ts
   * import { decodeXML } from 'entities';
   * const parserOptions: ParserOptions = {
   *   parser: {
   *     additionalXmlAttributeProcessor: (val: string) => { return decodeXML(val) }
   *   }
   * }
   * ```
   * @param val the value of the 'name' attribute to be processed.
   */
  additionalXmlAttributeProcessor?: (value: string) => string;
  /**
   * If `true`, disable the console logs produced by the parser.
   * @default false
   */
  disableConsoleLog?: boolean;
};

/**
 * Global configuration for the rendering of the BPMN elements.
 *
 * @category Initialization & Configuration
 * @since 0.35.0
 */
export type RendererOptions = {
  /**
   * If set to `true`, ignore the label bounds configuration defined in the BPMN diagram for all activities.
   * This forces the use of default label positioning instead of the bounds specified in the BPMN source.
   * Activities include tasks, sub-processes, and call activities.
   *
   * @default false
   * @since 0.48.0
   */
  ignoreBpmnActivityLabelBounds?: boolean;
  /**
   * If set to `false`, support the "BPMN in Color" specification with a fallback with bpmn.io colors. For more details about the support, see
   * {@link https://github.com/process-analytics/bpmn-visualization-js/pull/2614}.
   *
   * Otherwise, disable the support.
   *
   * @default true
   */
  ignoreBpmnColors?: boolean;
  /**
   * If set to `true`, ignore the font configurations defined in the BPMN LabelStyles.
   * This ensures font consistency in the rendered diagram.
   *
   * @default false
   * @since 0.48.0
   */
  ignoreBpmnLabelStyles?: boolean;
  /**
   * If set to `true`, ignore the label bounds configuration defined in the BPMN diagram for tasks only.
   * This forces the use of default label positioning for tasks instead of the bounds specified in the BPMN source.
   * This option is more restrictive than `ignoreBpmnActivityLabelBounds` as it only affects tasks, not sub-processes or call activities.
   *
   * **Note**: When `ignoreBpmnActivityLabelBounds` is `true`, this option is ignored as the more general activity option takes precedence.
   *
   * @default false
   * @since 0.48.0
   */
  ignoreBpmnTaskLabelBounds?: boolean;
};
