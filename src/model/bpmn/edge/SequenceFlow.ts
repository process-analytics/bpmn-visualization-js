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
