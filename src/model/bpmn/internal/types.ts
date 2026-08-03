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

// TODO update the internal model diagram (docs/users/architecture/images/architecture/internal-model.drawio and its
// generated .svg) to show the new 'ShapeBpmnElement.extensions: ShapeBpmnElementExtensions' property.
// TODO the internal model diagram never declares the extension types themselves: ShapeExtensions, EdgeExtensions and
// LabelExtensions only appear as the declared type of an 'extensions' property on Shape, Edge and Label, with no box of
// their own. Add them, starting with ShapeExtensions.

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Empty interface to allow module augmentation by extensions
export interface ShapeExtensions {}

/**
 * Extension properties computed from the BPMN **semantic** model, as opposed to {@link ShapeExtensions} which holds
 * properties computed from the BPMN diagram interchange model.
 *
 * Both carriers are needed because they are populated at different stages of the parsing pipeline: semantic parsing
 * builds `ShapeBpmnElement` instances long before the `Shape` objects holding {@link ShapeExtensions} exist.
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Empty interface to allow module augmentation by extensions
export interface ShapeBpmnElementExtensions {}

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Empty interface to allow module augmentation by extensions
export interface EdgeExtensions {}

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Empty interface to allow module augmentation by extensions
export interface LabelExtensions {}
