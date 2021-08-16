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
import { JsonParsingWarning, MessageDetails } from '../parsing-messages-management';

export class GroupUnknownCategoryValueWarning extends JsonParsingWarning {
  constructor(readonly groupBpmnElementId: string, readonly categoryValueRef: string) {
    super();
  }

  override getMessage(): { template: string; arguments: Array<string> } {
    return {
      arguments: [this.categoryValueRef, this.groupBpmnElementId],
      template: 'Group json deserialization: unable to find category value ref %s for bpmn element %s',
    };
  }
}

export class ShapeUnknownBpmnElementWarning extends JsonParsingWarning {
  constructor(readonly bpmnElementId: string) {
    super();
  }

  override getMessage(): { template: string; arguments: Array<string> } {
    return {
      arguments: [this.bpmnElementId],
      template: 'Shape json deserialization: unable to find bpmn element with id %s',
    };
  }
}

export class EdgeUnknownBpmnElementWarning extends JsonParsingWarning {
  constructor(readonly bpmnElementId: string) {
    super();
  }

  override getMessage(): { template: string; arguments: Array<string> } {
    return {
      arguments: [this.bpmnElementId],
      template: 'Edge json deserialization: unable to find bpmn element with id %s',
    };
  }
}

export class LabelStyleUnknownFontWarning extends JsonParsingWarning {
  constructor(readonly shapeOrEdgeId: string, readonly labelStyleId: string) {
    super();
  }

  override getMessage(): { template: string; arguments: Array<string> } {
    return {
      arguments: [this.labelStyleId, this.shapeOrEdgeId],
      template: 'Unable to assign font from style %s to shape/edge %s',
    };
  }
}

export class LaneUnknownFlowNodeRefWarning extends JsonParsingWarning {
  constructor(readonly laneId: string, readonly flowNodeRef: string) {
    super();
  }

  override getMessage(): MessageDetails {
    return {
      arguments: [this.flowNodeRef, this.laneId],
      template: 'Unable to assign lane %s as parent: flow node %s is not found',
    };
  }
}
