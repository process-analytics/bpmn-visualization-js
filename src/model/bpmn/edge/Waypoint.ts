import { JsonProperty } from 'json2typescript';

export default class Waypoint {
  @JsonProperty('x', Number)
  private readonly _x: number;

  @JsonProperty('y', Number)
  private readonly _y: number;

  constructor(x?: number, y?: number) {
    this._x = x;
    this._y = y;
  }

  public get y(): number {
    return this._y;
  }

  public get x(): number {
    return this._x;
  }
}
