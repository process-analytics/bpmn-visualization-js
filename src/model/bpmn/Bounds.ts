import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('Bounds')
export default class Bounds {
  @JsonProperty('x', String)
  private _x: string;

  @JsonProperty('y', String)
  private _y: string;

  @JsonProperty('width', String)
  private _width: string;

  @JsonProperty('height', String)
  private _height: string;

  public constructor(x: string, y: string, width: string, height: string) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  get height(): string {
    return this._height;
  }
  get width(): string {
    return this._width;
  }
  get y(): string {
    return this._y;
  }
  get x(): string {
    return this._x;
  }
}
