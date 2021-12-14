/**
 * Copyright 2021 Bonitasoft S.A.
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
import { ShapeBpmnElementKind, ShapeUtil } from '../../../../../src/model/bpmn/internal';
import BpmnModel from '../../../../../src/model/bpmn/internal/BpmnModel';
import Shape from '../../../../../src/model/bpmn/internal/shape/Shape';

export const shapeBpmnElementKindForLabelTests = Object.values(ShapeBpmnElementKind)
  .filter(kind => !ShapeUtil.isPoolOrLane(kind))
  // group as label is managed by category
  .filter(kind => kind != ShapeBpmnElementKind.GROUP)
  // intermediate catch and boundary events require extra property no managed here
  .filter(kind => ![ShapeBpmnElementKind.EVENT_BOUNDARY, ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH].includes(kind))
  .map(kind => [kind]);

export function getEventShapes(model: BpmnModel): Shape[] {
  return model.flowNodes.filter(shape => ShapeUtil.isEvent(shape.bpmnElement.kind));
}
