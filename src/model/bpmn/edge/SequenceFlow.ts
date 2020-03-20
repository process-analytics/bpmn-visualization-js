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
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('sequenceFlow')
export default class SequenceFlow {
  @JsonProperty('id', String)
  private readonly _id: string;

  @JsonProperty('name', String, true)
  private readonly _name?: string;

  @JsonProperty('sourceRef', String)
  private readonly _sourceRefId?: string;

  @JsonProperty('targetRef', String)
  private readonly _targetRefId?: string;

  constructor(id?: string, name?: string, sourceRefId?: string, targetRefId?: string) {
    this._id = id;
    this._name = name;
    this._sourceRefId = sourceRefId;
    this._targetRefId = targetRefId;
  }

  get id(): string {
    return this._id;
  }

  get targetRefId(): string {
    return this._targetRefId;
  }
  get sourceRefId(): string {
    return this._sourceRefId;
  }
  get name(): string {
    return this._name;
  }
}
