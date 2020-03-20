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

  public constructor(x?: number, y?: number, width?: number, height?: number) {
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
