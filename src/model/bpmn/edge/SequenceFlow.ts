import ShapeBpmnElement from '../shape/ShapeBpmnElement';

export default class SequenceFlow {
  private readonly _id: string;
  private readonly _name?: string;
  private readonly _sourceRefId?: string;
  private readonly _targetRefId?: string;

  constructor(id: string, name?: string, sourceRefId?: string, targetRefId?: string) {
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
