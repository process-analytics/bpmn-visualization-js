/*
Copyright 2023 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// From ChatGPT & https://stackoverflow.com/questions/68064202/how-to-type-a-color-prop

/* The color can be specified as

  * a hexadecimal RGB value: #faf or #ffaaff
  * a RGB value: rgb(255, 160, 255) or rgb(100%, 62.5%, 100%)
   Each value is from 0 to 255, or from 0% to 100%.
  * a RGBA value: rgba(255, 160, 255, 1) or rgba(100%, 62.5%, 100%, 1)
    This variant includes an “alpha” component to allow specification of the opacity of a color.
    Values are in the range 0.0 (fully transparent) to 1.0 (fully opaque).
  * a HSL value: hsl(0, 100%, 50%)
    A triple (hue, saturation, lightness).
    hue is an angle in degrees. saturation and lightness are percentages (0-100%).
  * a HSLA value: hsla(0, 100%, 50%, 1)
    This variant includes an “alpha” component to allow specification of the opacity of a color.
    Values are in the range 0.0 (fully transparent) to 1.0 (fully opaque).
*/

export type Color<T extends string> = ColorValue<T> | ColorKeyword | 'currentColor' | 'transparent' | 'inherit';
type ColorValue<T extends string> = HexColor<T> | RGB<T> | RGBA<T> | HSL<T> | HSLA<T>;

type ColorKeyword =
  | 'AliceBlue'
  | 'AntiqueWhite'
  | 'Aqua'
  | 'Aquamarine'
  | 'Azure'
  | 'Beige'
  | 'Bisque'
  | 'Black'
  | 'BlanchedAlmond'
  | 'Blue'
  | 'BlueViolet'
  | 'Brown'
  | 'BurlyWood'
  | 'CadetBlue'
  | 'Chartreuse'
  | 'Chocolate'
  | 'Coral'
  | 'CornflowerBlue'
  | 'Cornsilk'
  | 'Crimson'
  | 'Cyan'
  | 'DarkBlue'
  | 'DarkCyan'
  | 'DarkGoldenRod'
  | 'DarkGray'
  | 'DarkGrey'
  | 'DarkGreen'
  | 'DarkKhaki'
  | 'DarkMagenta'
  | 'DarkOliveGreen'
  | 'DarkOrange'
  | 'DarkOrchid'
  | 'DarkRed'
  | 'DarkSalmon'
  | 'DarkSeaGreen'
  | 'DarkSlateBlue'
  | 'DarkSlateGray'
  | 'DarkSlateGrey'
  | 'DarkTurquoise'
  | 'DarkViolet'
  | 'DeepPink'
  | 'DeepSkyBlue'
  | 'DimGray'
  | 'DimGrey'
  | 'DodgerBlue'
  | 'FireBrick'
  | 'FloralWhite'
  | 'ForestGreen'
  | 'Fuchsia'
  | 'Gainsboro'
  | 'GhostWhite'
  | 'Gold'
  | 'GoldenRod'
  | 'Gray'
  | 'Grey'
  | 'Green'
  | 'GreenYellow'
  | 'HoneyDew'
  | 'HotPink'
  | 'IndianRed'
  | 'Indigo'
  | 'Ivory'
  | 'Khaki'
  | 'Lavender'
  | 'LavenderBlush'
  | 'LawnGreen'
  | 'LemonChiffon'
  | 'LightBlue'
  | 'LightCoral'
  | 'LightCyan'
  | 'LightGoldenRodYellow'
  | 'LightGray'
  | 'LightGrey'
  | 'LightGreen'
  | 'LightPink'
  | 'LightSalmon'
  | 'LightSeaGreen'
  | 'LightSkyBlue'
  | 'LightSlateGray'
  | 'LightSlateGrey'
  | 'LightSteelBlue'
  | 'LightYellow'
  | 'Lime'
  | 'LimeGreen'
  | 'Linen'
  | 'Magenta'
  | 'Maroon'
  | 'MediumAquaMarine'
  | 'MediumBlue'
  | 'MediumOrchid'
  | 'MediumPurple'
  | 'MediumSeaGreen'
  | 'MediumSlateBlue'
  | 'MediumSpringGreen'
  | 'MediumTurquoise'
  | 'MediumVioletRed'
  | 'MidnightBlue'
  | 'MintCream'
  | 'MistyRose'
  | 'Moccasin'
  | 'NavajoWhite'
  | 'Navy'
  | 'OldLace'
  | 'Olive'
  | 'OliveDrab'
  | 'Orange'
  | 'OrangeRed'
  | 'Orchid'
  | 'PaleGoldenRod'
  | 'PaleGreen'
  | 'PaleTur';

type HexDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

type Hex3 = `${HexDigit}${HexDigit}${HexDigit}`;

type HexColor<T extends string> = Lowercase<T> extends `#${Hex3}` ? T : Lowercase<T> extends `#${Hex3}${infer Rest}` ? (Rest extends Hex3 ? T : never) : never;

type DecDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Digits0to4 = '0' | '1' | '2' | '3' | '4';

type OnlyDecDigits<T extends string> = T extends `${DecDigit}${infer Rest}` ? (Rest extends '' ? 1 : OnlyDecDigits<Rest>) : never;

type IsDecNumber<T extends string> = T extends `${infer Integer}.${infer Fractional}`
  ? Integer extends ''
    ? OnlyDecDigits<Fractional>
    : Fractional extends ''
    ? OnlyDecDigits<Integer>
    : OnlyDecDigits<Integer> & OnlyDecDigits<Fractional>
  : OnlyDecDigits<T>;

type IntegerPart<T extends string> = T extends `${infer I}.${infer F}` ? I : T;

type IsInteger<T extends string> = 1 extends IsDecNumber<T> ? (T extends IntegerPart<T> ? 1 : never) : never;

type Less100<T extends string> = IsDecNumber<T> extends 1 ? (IntegerPart<T> extends `${DecDigit}` | `${DecDigit}${DecDigit}` | '100' ? 1 : never) : never;

type IsPercent<T extends string> = '0' extends T ? 1 : T extends `${infer P}%` ? Less100<P> : never;

type Color255<T extends string> = 1 extends IsInteger<T>
  ? T extends `${DecDigit}` | `${DecDigit}${DecDigit}` | `1${DecDigit}${DecDigit}` | `2${Digits0to4}${DecDigit}` | `25${Digits0to4 | '5'}`
    ? 1
    : never
  : never;

type IsColorValue<T extends string> = IsPercent<T> | Color255<T>;

type WhiteSpace = ' ';
type Trim<T> = T extends `${WhiteSpace}${infer U}` ? Trim<U> : T extends `${infer U}${WhiteSpace}` ? Trim<U> : T;

type RGB<T extends string> = T extends `rgb(${infer R},${infer G},${infer B})`
  ? '111' extends `${IsColorValue<Trim<R>>}${IsColorValue<Trim<G>>}${IsColorValue<Trim<B>>}`
    ? T
    : never
  : never;

type Opacity<T extends string> = IsDecNumber<T> | IsPercent<T>;

type RGBA<T extends string> = T extends `rgba(${infer R},${infer G},${infer B},${infer O})`
  ? '1111' extends `${IsColorValue<Trim<R>>}${IsColorValue<Trim<G>>}${IsColorValue<Trim<B>>}${Opacity<Trim<O>>}`
    ? T
    : never
  : never;

type Degree<T extends string> = 1 extends IsInteger<T>
  ? T extends `${DecDigit}` | `${DecDigit}${DecDigit}` | `${'1' | '2'}${DecDigit}${DecDigit}` | `3${Digits0to4 | '5'}${DecDigit}` | '360'
    ? 1
    : never
  : never;

type HSL<T extends string> = T extends `hsl(${infer H},${infer S},${infer L})` ? (`111` extends `${Degree<Trim<H>>}${IsPercent<Trim<S>>}${IsPercent<Trim<L>>}` ? T : never) : never;

type HSLA<T extends string> = T extends `hsla(${infer H},${infer S},${infer L},${infer O})`
  ? `1111` extends `${Degree<Trim<H>>}${IsPercent<Trim<S>>}${IsPercent<Trim<L>>}${Opacity<Trim<O>>}`
    ? T
    : never
  : never;
