/*
Copyright 2021 Bonitasoft S.A.

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

import type { BpmnElementKind, GlobalTaskKind, ShapeBpmnEventDefinitionKind, ShapeBpmnSubProcessKind, ShapeBpmnCallActivityKind } from '../../model/bpmn/internal';

/**
 * @category Element Style
 */
export interface CssClassesRegistry {
  /**
   * Add one or more CSS classes to one or more BPMN elements.
   *
   * **Notes**:
   *
   * - If an ID is passed that does not reference an existing BPMN element, its reference is retained in the registry, but no rendering changes are made.
   * - This method is intended to set CSS classes on specific elements, e.g. to hide or highlight them. During BPMN diagram rendering, `bpmn-visualization` sets specific CSS classes to all elements based on their types.
   * - To style all elements of a given type, use the default classes instead of adding new ones. The classes allow identification of elements of the same `family' and of the same specific type.
   * - For example, a BPMN Service Task is an `Activity` and a `Task`. So it has the `bpmn-type-activity` and the `bpmn-type-task` classes. It shares these classes with all types of `Tasks`.
   * - It also has the specific `bpmn-service-task` to distinguish it from a BPMN User Task which has a `bpmn-user-task`.
   * - In addition, labels also have the `bpmn-label` classes.
   *
   * See the repository providing the [examples of the `bpmn-visualization` TypeScript library](https://github.com/process-analytics/bpmn-visualization-examples/) for more details.
   *
   * @example
   * ```javascript
   * // Add 'success-path' to BPMN elements with id: flow_1 and flow_5
   * bpmnVisualization.bpmnElementsRegistry.addCssClasses(['flow_1', 'flow_5'], 'success-path');
   *
   * // Add 'suspicious-path' and 'additional-info' to BPMN element with id: task_3
   * bpmnVisualization.bpmnElementsRegistry.addCssClasses('task_3', ['suspicious-path', 'additional-info']);
   * ```
   *
   * @param bpmnElementIds The BPMN ID of the element(s) to add the CSS classes to. Passing a nullish parameter or an empty array has no effect.
   * @param classNames The name of the class(es) to add to the BPMN element(s).
   *
   * @see {@link removeCssClasses} to remove specific CSS classes from a BPMN element.
   * @see {@link removeAllCssClasses} to remove all CSS classes from a BPMN element.
   * @see {@link toggleCssClasses} to toggle CSS classes on a BPMN element.
   * @see {@link StyleRegistry#updateStyle} to directly update the style of BPMN elements.
   */
  addCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void;

  /**
   * Remove one or more CSS classes that were previously added to one or more BPMN elements using the {@link addCssClasses} or the {@link toggleCssClasses} methods.
   *
   * **Note**: If you pass IDs that are not related to existing BPMN elements, they will be ignored and no changes will be made to the rendering.
   *
   * @example
   * ```javascript
   * // Remove 'highlight' from BPMN elements with ID: activity_1 and activity_2
   * bpmnVisualization.bpmnElementsRegistry.removeCssClasses(['activity_1', 'activity_2'], 'highlight');
   *
   * // Remove 'running' and 'additional-info' from BPMN element with ID: task_3
   * bpmnVisualization.bpmnElementsRegistry.removeCssClasses('task_3', ['running', 'additional-info']);
   * ```
   *
   * @param bpmnElementIds The BPMN ID of the element(s) from which to remove the CSS classes. Passing a nullish parameter or an empty array has no effect.
   * @param classNames The name of the class(es) to remove from the BPMN element(s).
   *
   * @see {@link removeAllCssClasses} to remove all CSS classes from a BPMN element.
   */
  removeCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void;

  /**
   * Remove any CSS classes that were previously added to one or more BPMN elements using the {@link addCssClasses} or the {@link toggleCssClasses} methods.
   *
   * **Note**: If you pass IDs that are not related to existing BPMN elements, they will be ignored and no changes will be made to the rendering.
   *
   * @example
   * ```javascript
   * // Remove all CSS classes from all BPMN elements
   * bpmnVisualization.bpmnElementsRegistry.removeAllCssClasses();
   *
   * // Remove all CSS classes from BPMN elements with ID: activity_1 and activity_2
   * bpmnVisualization.bpmnElementsRegistry.removeAllCssClasses(['activity_1', 'activity_2']);
   *
   * // Remove all CSS classes from BPMN element with ID: task_3
   * bpmnVisualization.bpmnElementsRegistry.removeAllCssClasses('task_3');
   * ```
   *
   * @param bpmnElementIds The BPMN ID of the element(s) from which to remove all CSS classes.
   * When passing a nullish parameter, all CSS classes associated with all BPMN elements will be removed. Passing an empty array has no effect.
   *
   * @see {@link removeCssClasses} to remove specific classes from a BPMN element.
   * @since 0.34.0
   */
  removeAllCssClasses(bpmnElementIds?: string | string[]): void;

  /**
   * Toggle one or more CSS classes on one or more BPMN elements.
   *
   * **Note**: If an ID is passed that does not reference an existing BPMN element, its reference is retained in the registry, but no rendering changes are made.
   *
   * @example
   * ```javascript
   * // Toggle 'highlight' for BPMN elements with ID: activity_1 and activity_2
   * bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['activity_1', 'activity_2'], 'highlight');
   *
   * // Toggle 'running' and 'additional-info' for BPMN element with ID: task_3
   * bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('task_3', ['running', 'additional-info']);
   * ```
   *
   * @param bpmnElementIds The BPMN ID of the element(s) on which to toggle the CSS classes. Passing a nullish parameter or an empty array has no effect.
   * @param classNames The name of the class(es) to toggle on the BPMN element(s).
   *
   * @see {@link removeCssClasses} to remove specific CSS classes from a BPMN element.
   * @see {@link removeAllCssClasses} to remove all CSS classes from a BPMN element.
   * @see {@link addCssClasses} to add CSS classes to a BPMN element.
   */
  toggleCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void;
}

/**
 * @category Custom Behavior
 */
export interface ElementsRegistry {
  /**
   * Get all model elements in the form of {@link BpmnSemantic} objects corresponding to the identifiers supplied. The returned array contains elements in the order of the `bpmnElementIds` parameter.
   *
   * Not found elements are not returned as undefined in the array, so the returned array contains at most as many elements as the `bpmnElementIds` parameter.
   *
   * ```javascript
   * ...
   * // Find all elements by specified id or ids
   * const bpmnElements1 = bpmnVisualization.bpmnElementsRegistry.getModelElementsByIds('userTask_1');
   * const bpmnElements2 = bpmnVisualization.bpmnElementsRegistry.getModelElementsByIds(['startEvent_3', 'userTask_2']);
   * // now you can do whatever you want with the elements
   * ...
   * ```
   *
   * If you also need to retrieve the related DOM elements and more information, use {@link getElementsByIds} instead.
   *
   * @param bpmnElementIds The BPMN ID of the element(s) to retrieve.
   * @since 0.39.0
   */
  getModelElementsByIds(bpmnElementIds: string | string[]): BpmnSemantic[];

  /**
   * Get all elements by ids. The returned array contains elements in the order of the `bpmnElementIds` parameter.
   *
   * Not found elements are not returned as undefined in the array, so the returned array contains at most as many elements as the `bpmnElementIds` parameter.
   *
   * ```javascript
   * ...
   * // Find all elements by specified id or ids
   * const bpmnElements1 = bpmnVisualization.bpmnElementsRegistry.getElementsByIds('userTask_1');
   * const bpmnElements2 = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['startEvent_3', 'userTask_2']);
   * // now you can do whatever you want with the elements
   * ...
   * ```
   *
   * **WARNING**: this method is not designed to accept a large amount of ids. It does DOM lookup to retrieve the HTML elements relative to the BPMN elements.
   * Attempts to retrieve too many elements, especially on large BPMN diagram, may lead to performance issues.
   *
   * If you only need to retrieve the BPMN model data, use {@link getModelElementsByIds} instead.
   *
   * @param bpmnElementIds The BPMN ID of the element(s) to retrieve.
   */
  getElementsByIds(bpmnElementIds: string | string[]): BpmnElement[];

  /**
   * Get all model elements in the form of {@link BpmnSemantic} objects corresponding to the BPMN kinds supplied
   *
   * ```javascript
   * ...
   * // Find all elements by desired kind or kinds
   * const bpmnElements1 = bpmnVisualization.bpmnElementsRegistry.getModelElementsByKinds(ShapeBpmnElementKind.TASK);
   * const bpmnElements2 = bpmnVisualization.bpmnElementsRegistry.getModelElementsByKinds([ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.POOL]);
   * // now you can do whatever you want with the elements
   * ...
   * ```
   *
   * If you also need to retrieve the related DOM elements and more information, use {@link getElementsByKinds} instead.
   *
   * @param bpmnKinds The BPMN kind of the element(s) to retrieve.
   * @since 0.39.0
   */
  getModelElementsByKinds(bpmnKinds: BpmnElementKind | BpmnElementKind[]): BpmnSemantic[];

  /**
   * Get all elements by kinds.
   *
   * ```javascript
   * ...
   * // Find all elements by desired type or types
   * const bpmnTaskElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.TASK);
   * const bpmnEndEventAndPoolElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds([ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.POOL]);
   * // now you can do whatever you want with the elements
   * ...
   * ```
   *
   * If you only need to retrieve the BPMN model data, use {@link getModelElementsByKinds} instead.
   *
   * **WARNING**: this method is not designed to accept a large amount of types. It does DOM lookup to retrieve the HTML elements relative to the BPMN elements.
   * Attempts to retrieve too many elements, especially on large BPMN diagrams, may lead to performance issues.
   *
   * @param bpmnKinds The BPMN kind of the element(s) to retrieve.
   */
  getElementsByKinds(bpmnKinds: BpmnElementKind | BpmnElementKind[]): BpmnElement[];
}

/**
 * @category Overlays
 */
export interface OverlaysRegistry {
  /**
   * Add one/several overlays to a BPMN element.
   *
   * Notice that if you pass an id that is not related to an existing BPMN element, nothing happens on the rendering side.
   *
   * @example
   * ```javascript
   * // Add an overlay to BPMN elements with id 'task_1'
   * bpmnVisualization.bpmnElementsRegistry.addOverlays('task_1', {
   *    position: 'top-left',
   *    label: '40',
   *    style: {
   *      font: { color: 'Chartreuse', size: 8 },
   *      fill: { color: 'Pink', opacity: 50 },
   *      stroke: { color: 'DarkSeaGreen', width: 2 }
   *    }
   * });
   *
   * // Add several overlays to BPMN element with id 'task_3'
   * bpmnVisualization.bpmnElementsRegistry.addOverlays('task_3', [
   *    {
   *      position: 'bottom-right',
   *      label: '110',
   *      style: {
   *        font: { color: '#663399', size: 8 },
   *        fill: { color: '#FFDAB9', opacity: 50 },
   *        stroke: { color: 'DarkSeaGreen', width: 2 }
   *      }
   *    },
   *    {
   *      position: 'top-left',
   *      label: '40',
   *      style: {
   *        font: { color: 'MidnightBlue', size: 30 },
   *        fill: { color: 'Aquamarine', opacity: 70 },
   *        stroke: { color: '#4B0082', width: 1 }
   *      }
   *    }
   * ]);
   * ```
   *
   * @param bpmnElementId The BPMN id of the element where to add the overlays
   * @param overlays The overlays to add to the BPMN element
   */
  addOverlays(bpmnElementId: string, overlays: Overlay | Overlay[]): void;

  /**
   * Remove all overlays of a BPMN element.
   *
   * Notice that if you pass an id that is not related to an existing BPMN element, nothing happens on the rendering side.
   *
   * <b>WARNING</b>: could be renamed when adding support for removal of one or several specific overlays.
   *
   * @example
   * ```javascript
   * //  all overlays of the BPMN element with id: activity_1
   * bpmnVisualization.bpmnElementsRegistry.removeAllOverlays('activity_1');
   * ```
   *
   * @param bpmnElementId The BPMN id of the element where to remove the overlays
   */
  removeAllOverlays(bpmnElementId: string): void;
}

/**
 * @category Element Style
 */
export interface StyleRegistry {
  /**
   * Update the style of one or several BPMN elements.
   *
   * @example
   * ```javascript
   * bpmnVisualization.bpmnElementsRegistry.updateStyle('activity_1', {
   *   stroke: {
   *     color: 'red',
   *   },
   * });
   * ```
   *
   * **Notes**:
   *
   * - This method is intended to update the style of specific elements, e.g. to update their colors. When rendering a BPMN diagram, `bpmn-visualization` applies style properties
   * to all elements according to their types.
   * So if you want to style all elements of a certain type, change the default configuration of the styles instead of updating the element afterwards. See the repository providing the
   * [examples of the `bpmn-visualization` TypeScript library](https://github.com/process-analytics/bpmn-visualization-examples/) for more details.
   * - If you pass IDs that are not related to existing BPMN elements, they will be ignored and no changes will be made to the rendering.
   *
   * @param bpmnElementIds The BPMN ID of the element(s) whose style must be updated.
   * @param styleUpdate The style properties to update.
   *
   * @see {@link resetStyle} to reset the style of one or several BPMN elements.
   * @see {@link CssClassesRegistry#addCssClasses} to add CSS classes to a BPMN element.
   * @see {@link CssClassesRegistry#removeCssClasses} to remove specific classes from a BPMN element.
   * @see {@link CssClassesRegistry#removeAllCssClasses} to remove all CSS classes from a BPMN element.
   * @see {@link CssClassesRegistry#toggleCssClasses} to toggle CSS classes on a BPMN element.
   * @since 0.33.0
   */
  updateStyle(bpmnElementIds: string | string[], styleUpdate: StyleUpdate): void;

  /**
   * Reset the style that were previously updated to one or more BPMN elements using the {@link updateStyle} method.
   *
   * @example
   * ```javascript
   * bpmnVisualization.bpmnElementsRegistry.resetStyle('activity_1');
   * ```
   *
   * **Notes**:
   *
   * - This method is intended to update the style of specific elements, e.g. to update their colors. When rendering a BPMN diagram, `bpmn-visualization` applies style properties
   * to all elements according to their types.
   * So if you want to style all elements of a certain type, change the default configuration of the styles instead of updating the element afterward. See the repository providing the
   * [examples of the `bpmn-visualization` TypeScript library](https://github.com/process-analytics/bpmn-visualization-examples/) for more details.
   * - If you pass IDs that are not related to existing BPMN elements, they will be ignored and no changes will be made to the rendering.
   *
   * @param bpmnElementIds The BPMN ID of the element(s) whose style must be reset.
   * When passing a nullish parameter, the style of all BPMN elements will be reset. Passing an empty array has no effect.
   *
   * @see {@link updateStyle} to update the style of one or several BPMN elements.
   * @see {@link CssClassesRegistry#addCssClasses} to add CSS classes to a BPMN element.
   * @see {@link CssClassesRegistry#removeCssClasses} to remove specific classes from a BPMN element.
   * @see {@link CssClassesRegistry#removeAllCssClasses} to remove all CSS classes from a BPMN element.
   * @see {@link CssClassesRegistry#toggleCssClasses} to toggle CSS classes on a BPMN element.
   * @since 0.37.0
   */
  resetStyle(bpmnElementIds?: string | string[]): void;
}

/**
 * @category Custom Behavior
 */
export interface BaseBpmnSemantic {
  id: string;
  /** `true` when relates to a BPMN Shape, `false` when relates to a BPMN Edge. */
  isShape: boolean;
  kind: BpmnElementKind;
  name: string;
}

/**
 * Extended properties available when {@link BaseBpmnSemantic.isShape} is `false`.
 * @category Custom Behavior
 */
export interface EdgeBpmnSemantic extends BaseBpmnSemantic {
  sourceRefId: string;
  targetRefId: string;
}

/**
 * Extended properties available when {@link BaseBpmnSemantic.isShape} is `true`.
 * @category Custom Behavior
 */
export interface ShapeBpmnSemantic extends BaseBpmnSemantic {
  /** Set when the {@link BaseBpmnSemantic.kind} relates to a BPMN Call Activity calling a global task. */
  callActivityGlobalTaskKind?: GlobalTaskKind;
  /** Set when the {@link BaseBpmnSemantic.kind} relates to a BPMN Call Activity. */
  callActivityKind?: ShapeBpmnCallActivityKind;
  /** Set when the {@link BaseBpmnSemantic.kind} relates to a BPMN event. */
  eventDefinitionKind?: ShapeBpmnEventDefinitionKind;
  /** Set when the {@link BaseBpmnSemantic.kind} relates to a BPMN intermediate catch event with {@link ShapeBpmnSemantic.eventDefinitionKind} set to {@link ShapeBpmnEventDefinitionKind.LINK}. */
  linkEventSourceIds?: string[];
  /** Set when the {@link BaseBpmnSemantic.kind} relates to a BPMN intermediate throw event with {@link ShapeBpmnSemantic.eventDefinitionKind} set to {@link ShapeBpmnEventDefinitionKind.LINK}. */
  linkEventTargetId?: string;
  incomingIds: string[];
  outgoingIds: string[];
  /**
   * This is the ID of the direct parent of the current element, which can be a:
   * - process/participant
   * - lane
   * - sub-process
   * - call activity
   *
   * For the Boundary events, it is the activity to which the item belongs.
   *
   * **Special case**: it can be `undefined` when there is a single process without Participant/Pool. In this case, the direct children of the process have no parent.
   */
  parentId: string;
  /** Set when the {@link BaseBpmnSemantic.kind} relates to a BPMN sub-process. */
  subProcessKind?: ShapeBpmnSubProcessKind;
}

/**
 * @category Custom Behavior
 */
export type BpmnSemantic = EdgeBpmnSemantic | ShapeBpmnSemantic;

/**
 * @category Custom Behavior
 */
export interface BpmnElement {
  bpmnSemantic: BpmnSemantic;
  htmlElement: HTMLElement;
}

/**
 * @category Overlays
 */
export type OverlayShapePosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center' | 'middle-left' | 'middle-right';
/**
 * @category Overlays
 */
export type OverlayEdgePosition = 'start' | 'middle' | 'end';
/**
 * @category Overlays
 */
export type OverlayPosition = OverlayShapePosition | OverlayEdgePosition;

/**
 * @category Overlays
 */
export type OverlayStyle = {
  font?: OverlayFont;
  fill?: OverlayFill;
  stroke?: OverlayStroke;
};

/**
 * The font family is {@link StyleDefault.DEFAULT_FONT_FAMILY}.
 * @category Overlays
 */
export type OverlayFont = {
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_FONT_COLOR} */
  color?: string;
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_FONT_SIZE} */
  size?: number;
};

/**
 * @category Overlays
 */
export type OverlayFill = {
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_FILL_COLOR} */
  color?: string;
  /**
   * A number between `0` (transparent) and `100` (opaque).
   *
   * **IMPORTANT**: this property is currently not taken into account by the default Overlay. See https://github.com/process-analytics/bpmn-visualization-js/issues/1234.
   *
   * To solve this problem, define a color that contains opacity information. For example: `color: `rgba(0, 0, 255, 0.8)`.
   * @default {@link StyleDefault.DEFAULT_OVERLAY_FILL_OPACITY}
   */
  opacity?: number;
};

/**
 * @category Overlays
 */
export type OverlayStroke = {
  /**
   * If you don't want to display a stroke, you can set the color to
   *   * `transparent`
   *   * the same value as for the fill color. This increases the padding/margin.
   *
   * @default {@link StyleDefault.DEFAULT_OVERLAY_STROKE_COLOR}
   * */
  color?: string;
  /**
   * **IMPORTANT**: this property is currently not taken into account by the default Overlay. See https://github.com/process-analytics/bpmn-visualization-js/issues/1234
   * @default {@link StyleDefault.DEFAULT_OVERLAY_STROKE_WIDTH}
   */
  width?: number;
};

/**
 * @category Overlays
 */
export type Overlay = {
  position: OverlayPosition;
  label?: string;
  style?: OverlayStyle;
};

/**
 * @category Element Style
 */
export type StyleUpdate = EdgeStyleUpdate | ShapeStyleUpdate;

/**
 * @category Element Style
 */
export type EdgeStyleUpdate = {
  font?: Font;
  /**
   * The value must be between 0 and 100:
   * - If the set value is less than 0, the used value is 0.
   * - If the set value is greater than 100, the used value is 100.
   *
   * **NOTE**: `opacity` does not apply to the font style.
   *
   * **Notes about the `default` special keyword**:
   * - It is used to apply the opacity defined in the default style of the BPMN element.
   * - It can be used when the style is first updated and then needs to be reset to its initial value.
   */
  opacity?: Opacity;
  stroke?: Stroke;
};

/**
 * @category Element Style
 */
export type ShapeStyleUpdate = EdgeStyleUpdate & { fill?: Fill };

/**
 * @category Element Style
 */
export type Stroke = StyleWithOpacity & {
  /**
   * Possible values are all HTML color names or HEX codes, as well as special keywords such as:
   * - `default` to use the color defined in the BPMN element default style.
   * - `inherit` to apply the stroke color of the direct parent element.
   * - `none` for no color.
   * - `swimlane` to apply the stroke color of the nearest parent element with the type {@link ShapeBpmnElementKind.LANE} or {@link ShapeBpmnElementKind.POOL}.
   *
   * **Notes about the `default` special keyword**:
   * - It can be used when the style is first updated and then needs to be reset to its initial value.
   * - It doesn't use the color set in the BPMN source when the "BPMN in Color" support is enabled. It uses the color defined in the BPMN element default style.
   */
  color?: 'default' | 'inherit' | 'none' | 'swimlane' | string;

  /**
   * Defines the stroke width in pixels.
   *
   * The value must be between 1 and 50.
   *
   * If the set value is less than 1, the used value is 1.
   * If the set value is greater than 50, the used value is 50.
   *
   * To hide the stroke, set the `color` property to `none`.
   *
   * The `default` value resets the width to the value defined in the default style of the BPMN element. It can be used when the style is first updated and then needs to be reset to its initial value.
   *
   * **WARNING**: Changing the stroke width of Activities may be misleading as the default stroke widths have a meaning according to the BPMN Specification.
   * For example, updating the stroke width of a task using the same value as the default stroke width of a Call Activity can be confusing. In this case, you should also change another property such as the stroke color to allow the user to differentiate between them.
   */
  width?: 'default' | number;
};

/**
 * Note about properties that can be reset to default values.
 *
 * Except for color (when the "BPMN in Color" support is disabled), all style properties can be set in the BPMN diagram via LabelStyle and can then override the default values.
 * Currently, there is no way to know if they are overridden. So it is not possible to reset each property with the "Update Style" API.
 *
 * @category Element Style
 */
export type Font = StyleWithOpacity & {
  /**
   * Possible values are all HTML color names or HEX codes, as well as special keywords such as:
   * - `default` to use the color defined in the BPMN element default style.
   * - `inherit` to apply the font color of the direct parent element.
   * - `swimlane` to apply the font color of the nearest parent element with the type {@link ShapeBpmnElementKind.LANE} or {@link ShapeBpmnElementKind.POOL}.
   *
   * **Notes about the `default` special keyword**:
   * - It can be used when the style is first updated and then needs to be reset to its initial value.
   * - It doesn't use the color set in the BPMN source when the "BPMN in Color" support is enabled. It uses the color defined in the BPMN element default style.
   */
  color?: 'default' | 'inherit' | 'swimlane' | string;

  /**
   *  The type of the value is int (in px).
   */
  size?: number;

  family?: string;

  /**
   *  @default false
   */
  isBold?: boolean;

  /**
   *  @default false
   */
  isItalic?: boolean;

  /**
   *  @default false
   */
  isUnderline?: boolean;

  /**
   *  @default false
   */
  isStrikeThrough?: boolean;
};

/**
 * @category Element Style
 */
export type Fill = StyleWithOpacity & {
  /**
   * Possible values are all HTML color names, HEX codes, {@link FillColorGradient}, as well as special keywords such as:
   * - `default` to use the color defined in the BPMN element default style.
   * - `inherit` to apply the fill color of the direct parent element.
   * - `none` for no color.
   * - `swimlane` to apply the fill color of the nearest parent element with the type {@link ShapeBpmnElementKind.LANE} or {@link ShapeBpmnElementKind.POOL}.
   *
   * **Notes about the `default` special keyword**:
   * - It can be used when the style is first updated and then needs to be reset to its initial value.
   * - It doesn't use the color set in the BPMN source when the "BPMN in Color" support is enabled. It uses the color defined in the BPMN element default style.
   * - If a gradient was set, it will be completely reverted.
   */
  color?: FillColorGradient | 'default' | 'inherit' | 'none' | 'swimlane' | string;
};

/**
 * It is a linear gradient managed by `mxGraph`.
 * For more information about mxGraph, refer to the documentation at:
 * {@link https://jgraph.github.io/mxgraph/docs/js-api/files/util/mxConstants-js.html#mxConstants.STYLE_GRADIENTCOLOR}
 *
 * **Notes**:
 * Using the same color for the start color and end color will have the same effect as setting only the fill color with an HTML color name, HEX code or special keyword.
 *
 * @category Element Style
 */
export type FillColorGradient = {
  /**
   * It can be any HTML color name or HEX code, as well as special keywords such as:
   * - `inherit` to apply the fill color of the direct parent element.
   * - `none` for no color.
   * - `swimlane` to apply the fill color of the nearest parent element with the type {@link ShapeBpmnElementKind.LANE} or {@link ShapeBpmnElementKind.POOL}.
   */
  startColor: 'inherit' | 'none' | 'swimlane' | string;

  /**
   * It can be any HTML color name or HEX code, as well as special keywords such as:
   * - `inherit` to apply the fill color of the direct parent element.
   * - `none` for no color.
   * - `swimlane` to apply the fill color of the nearest parent element with the type {@link ShapeBpmnElementKind.LANE} or {@link ShapeBpmnElementKind.POOL}.
   */
  endColor: 'inherit' | 'none' | 'swimlane' | string;

  /**
   * Specifies how the colors transition within the gradient.
   *
   * Taking the example of `bottom-to-top`, this means that the start color is at the bottom of the paint pattern and the end color is at the top, with a gradient between them.
   *
   * @see {@link GradientDirection}
   */
  direction: GradientDirection;
};

/**
 * @category Element Style
 */
export type GradientDirection = 'left-to-right' | 'right-to-left' | 'bottom-to-top' | 'top-to-bottom';

/**
 * @category Element Style
 */
export type StyleWithOpacity = {
  /**
   * The value must be between 0 and 100:
   * - If the set value is less than 0, the used value is 0.
   * - If the set value is greater than 100, the used value is 100.
   *
   * **Notes about the `default` special keyword**:
   * - It is used to apply the opacity defined in the default style of the BPMN element.
   * - It can be used when the style is first updated and then needs to be reset to its initial value.
   */
  opacity?: Opacity;
};

/**
 *  @category Element Style
 */
export type Opacity = 'default' | number;
