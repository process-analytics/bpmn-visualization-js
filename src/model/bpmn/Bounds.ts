import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('Bounds')
export default class Bounds {
  @JsonProperty('x', Number)
  private _x: number;

  @JsonProperty('y', Number)
  private _y: number;

  @JsonProperty('width', Number)
  private _width: number;

  @JsonProperty('height', Number)
  private _height: number;

  public constructor(x: number, y: number, width: number, height: number) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  get height(): number {
    return this._height;
  }
  get width(): number {
    return this._width;
  }
  get y(): number {
    return this._y;
  }
  get x(): number {
    return this._x;
  }
}
