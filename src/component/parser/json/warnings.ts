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
import { JsonParsingWarning } from '../parsing-messages-management';

export class GroupMissingCategoryValueWarning extends JsonParsingWarning {
  constructor(readonly groupBpmnElementId: string, readonly missingCategoryValueRef: string) {
    super();
  }

  getMessageTemplate(): string {
    return 'Group json deserialization: unable to find category value ref %s for bpmn element %s';
  }

  getMessageArguments(): Array<string> {
    return [this.missingCategoryValueRef, this.groupBpmnElementId];
  }
}

export class ShapeMissingBpmnElementWarning extends JsonParsingWarning {
  constructor(readonly bpmnElementId: string) {
    super();
  }

  getMessageArguments(): Array<string> {
    return [this.bpmnElementId];
  }

  getMessageTemplate(): string {
    return 'Shape json deserialization: unable to find bpmn element with id %s';
  }
}

export class EdgeMissingBpmnElementWarning extends JsonParsingWarning {
  constructor(readonly bpmnElementId: string) {
    super();
  }

  getMessageArguments(): Array<string> {
    return [this.bpmnElementId];
  }

  getMessageTemplate(): string {
    return 'Edge json deserialization: unable to find bpmn element with id %s';
  }
}

export class MissingFontInLabelStyleWarning extends JsonParsingWarning {
  constructor(readonly shapeOrEdgeId: string, readonly labelStyleId: string) {
    super();
  }

  getMessageArguments(): Array<string> {
    return [this.labelStyleId, this.shapeOrEdgeId];
  }

  getMessageTemplate(): string {
    return 'Unable to assign font from style %s to shape/edge %s';
  }
}

export class LaneUnknownFlowNodeRefWarning extends JsonParsingWarning {
  constructor(readonly laneId: string, readonly flowNodeRef: string) {
    super();
  }

  getMessageArguments(): Array<string> {
    return [this.flowNodeRef, this.laneId];
  }

  getMessageTemplate(): string {
    return 'Unable to assign lane %s as parent: flow node %s is not found';
  }
}
