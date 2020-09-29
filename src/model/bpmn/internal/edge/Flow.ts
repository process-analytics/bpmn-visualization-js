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
import { SequenceFlowType } from './SequenceFlowType';
import { FlowType } from './FlowType';
import { TAssociationDirection } from '../../json-xsd/baseElement/artifact';

export default abstract class Flow {
  constructor(readonly id: string, readonly name: string, readonly type: FlowType, readonly sourceRefId?: string, readonly targetRefId?: string) {}
}

export class SequenceFlow extends Flow {
  constructor(id: string, name: string, sourceRefId?: string, targetRefId?: string, readonly sequenceFlowType = SequenceFlowType.NORMAL) {
    super(id, name, FlowType.SEQUENCE_FLOW, sourceRefId, targetRefId);
  }
}

export class MessageFlow extends Flow {
  constructor(id: string, name: string, sourceRefId?: string, targetRefId?: string) {
    super(id, name, FlowType.MESSAGE_FLOW, sourceRefId, targetRefId);
  }
}

export class AssociationFlow extends Flow {
  constructor(id: string, name: string, sourceRefId?: string, targetRefId?: string, readonly associationDirectionKind = TAssociationDirection.None) {
    super(id, name, FlowType.ASSOCIATION_FLOW, sourceRefId, targetRefId);
  }
}
