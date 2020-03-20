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
