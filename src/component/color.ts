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
// https://www.typescriptlang.org/play?ssl=273&ssc=30&pln=273&pc=48#code/C4TwDgpgBAwg9gGzgJwNIRAdxQEygXgCgoSoAfKAIgCMEBDAYwGtLjSLKBnASwQDcIyVqXJUA5sjohh7KpgAW3YBBkkOAWzrI4cAHarRlZBBwGOYAK7IwCFWzVUAZhYbyedM+OMR99wwm51OxEORG4BT0oQCAQkTEjdOj5pPw5aC2DZSmU6BEi6AEcLD1SqFDpdMUyHSlzuBgh06sMK4G4iiAUlZo5C4s1kbl0eqjoALysRmghuKsjqbk4O+fpdVxNc9T1TUpoEDL5uRAhgee1MXxCqaisELB0dq8oGOhwTpsjXLWBjC04p1xwBiIOjKT7lPK7YHIXSOOKCD5QlC6HgIFhQwbqTh6SI4LRMRFPPHIJgMEAVXH4sSIN66bSPLLEpgSKSUkkSCA+NnM4wpIn4pjyOhMbjczRVXTAEr8klhAQcrm7JnlSpTZXIVzcBk1JnGbWGJmcTY4pX4-50BWXRlm+jKQnWkmcW0QFl8h1MJ2gl287nAKxFOCLNX4w7HU5KzlgMBDdFEyOcJgge06wKu3Gpn1KuA4KrIZOGRzcYzUQbMSJwiFdMG7RwoCCcYCWyJiOhDTjUFBwZvyOANqtTakIfUcQe0+nN7y6aKxODxXYct01HvDEBvOdPHvAaO6WNZIY4bgVPWRfezLu7cIoReGQXC0W7egCXRvIQPpI+F-pTjySL0C5Nh8IC2NZFEcWsrRqAIxHkYB8w4KCYOhXJf1mRDyQg-xUMbGkfHpac4hQ6DG0ka94KwgCngQ4iMEImDt13SCsKNBBgNo4BzQorIqITJN9imbjnTTB8mMEzNKKY5QYjgqgqPw2cUKCTjGOGDCNBMbgLE0Io6AGIYpiCA9NOkygDI0rYNUUYcqFMzTLGsWxIhsrEIAtSdHPUzTPTtPj3MMrEwEGSolMMJy-WQAMg18szQ1sH4TEcrVdCw4z1CGYAGGMHSEobEBtH+RygReHhVKoRI+DoAArWdFGrJ4aXoBpIjlExJGoJrJFVY9dhQTUrMoMBchdHC6WzSIBtsYLzEGsKIvy3ZxogGKTi6p4BoG8kujAMaXNcSwwO25ALDGmMxv2dQxtnT8fN2PKk3OEqjDgckEGMo0cBwWwS1nB7mNY3YjWfO7vsiDi3P+lzvxiSEnh4HxEhBxNXudJGvSEmHRJo-7dHk-6AqGMRJqoBtORe66nilB7gEUBsHN2YA4E0enIhmixAzmp4lvDJ4FBcrmsn7TgtiYKY5MwQmjEaCAGBeOybDsQhQEgKAAAkIAADwAEVmJQCCgDWpa1sQdYoAByOgTdEE3qAt02GBtqATZwe2TYgZ3HBNhXwGgfWGENnX8AdgAGZ2AEZnYAJmdgBmZ2ABZnYAVmdgA2Z2AHZnYADmdgBOD3Fe97X2MD+nY91k3g8tsPLcjy2Y8t+PCE9pWAHUaogABlAaGnLh3m+gAAVTEAB4B4APl1geoHV5Rn04KAAAMABIAG82+6LvGAgABfVehkcQQoAAVW3heoD8AB+KAh8CYej4nvwAC5r+ntXZ5wefl5X-fD5P1f1+UJvBop9z4iBEFfG+6g74PzAaQZ+A8ADcTcC4q3VlHXWX9VaayLrvFeWC-bAFwfgnBC9kFe1QWreASBkCj1fu-eeDZApiAngHNgAAZWcggioQFHhPGeH5P4AGJV5YKjqfPwJAIESKgM-DhmAuF0H+LwuhAjF7CLwWg3BP9kBQAAEr1kIaQ2Bki9EGJUXPChUdpGwKkcYsBz9hgCGQNYmRUBHGCDIUrAA8roO4PsCGcFofwixjD8YsNAaQKewSP6L1Xv4nBe9YSH30Q2cRdir4pOAOYmJJsPZ2PAVAEOLiRDPx8X4g2RdAmZLHi4hxi0PH9ygAASU4D7AAckZQQQS36qNCZUFhfgok9IsV-bRzTJQukENvAAdIkg+OiABikgGBtD0LkNJxir5NImbmbJ89cnFNIFfMpIB4lG3YsPJZjBVmJAQDU-JcCoBXJWUcW5eyHZ5IeWA45vjTkVPOYE7Zyhcz3K+SUqAJyzlKEBTswQE8ABkELflQouc8m5uRQWwNKci-50LeGeOgECyZyAAAK3xun0KgH05hBBBnvNGUknRTSZlzMPgsjZNjmm1OvgS5pnAiW5gpb0n4YTdZ+BDu8lp7TOk0PHi4iBkrYWkvJePCJDyr4SsOSQOpTjuXuOcY0th9ZOAh0DoHIVISRX9LFSIKVUsOnqGoF01V0T55FPSeM4FggyXIGAMo11sSV4opARQL+wa4m4sMVXM1nz1WFK1a4-Ver6kGpQVQlA4cE4JwtTE6lAyRASoDS0gVzrMXfJfgGsNkaQEJtgaGiNvsElBurWfWtYDQ0hwbQQ3BwbW1grrYvcOcTKklzgLHHtLa21XAXpm4dALR1l1NknDl+SNUJp1R4uxG7U3kP1gqHNDCrU0qIAWyV-KlX4o9UMylVbG3nJXf20Qt7u1dpIVO2QX8TbV1NpHCdd6lB-u7UYx9H6o5zuhQuy2y7X33uAyBuuydg4JrXWC7dybdWNJaSSrhPg-XXuFUw-NpAK4WwDQPeV8at0VuGTEhl8yoAku3gAUj7V8q+RrOAmrNcPElMCvlocw5wdNyAABquQMgHqpUe8JWGcOSmURQYTmbs1ysabogA4gAIUk3mm1kT6XIDENQAAFKynRujt4ABozNQHU1Zmzmnt4AEpWOcq-SHaulbV4tOE2Jvio8R66LHmPXBPnEAoD8xJyBw91PBdC0J8LonxM8Oi5puLcHV08tQ24lN6GGkoK8d3JQIAdPSd1nahgDqnWyonhQWTGpcP4rU1pgAgqVwjtKRD4ZGYZ6gdBTPf0ZXo+zg36N2es6Nw+jmJtjK8c5jLBT3MedIzRz+3mEvUMiylwLcX1u+eSwF2+sWQt7cS1tw7UC0snZXoVxgxWLvDy8el5DWX+M5d1VRpNjTlYdzYe10VJ79OVrcAgAbYzlYjbGR3SHQ22HzYowvDzIcz5eebfu6Lytdsr3qw0eT0WO5Y5x416LbDntgtsW9pNW6vsoJ+2wtr3Xc1lcByQRnn8Qf9ZsxDmbQ3oc8-o3D-nh85suYR0j5H9KI3o5Hpj67RO8cjwJ3Lzg2GGsK9vqT67t2GD3ei09kLC3NmvYeWh6nuXGn7f82zqTHWA5YOEwpvRWnHcac0wz2rKtfuO7p+7puvKHfW90wHS3UWPfCfQPcZAeBbZWGMJKYTzsfgVE4ANOPwBnZDHkIIJQHtCBvAYPQYwUBnBrBuVARgDQwDsQD+8vNxngTUOfgHseTnn58EDDgJuFeIBV42ygYzJtBF0GHybJzhBu+9+EwPwRLZzZj4n9XxL0-pYr7tvP6WPfF-UIH3qUf4+N+T6XybTP2f0-r8r1v-vg-h8j-P5vvvyAd9GeMyHSz4dLNRyc3vhfD+n8majmapZlAOHIHEASHF-nfoftvibL1v1iAR-qAbHIHBAfvhfr-jAUZnAaAQAZZkgZZoHNMoHAnCgT-lPibCDsZlHIhkASILHExmAYHExiQQfpfo-uQZ6MZqAYUowUASAfQVAAQVmsQd-iwegRQUgVwVweASIWgWQRQVQVwXwQwRAUAA

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

export type Color<T extends string> = ColorValue<T> | HTMLColor | 'currentColor' | 'transparent' | 'inherit';
type ColorValue<T extends string> = HexColor<T> | RGB<T> | RGBA<T> | HSL<T> | HSLA<T>;

type HTMLColor =
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
  | 'Paleturquoise'
  | 'Palevioletred'
  | 'Papayawhip'
  | 'peachpuff'
  | 'peru'
  | 'pink'
  | 'plum'
  | 'powderblue'
  | 'rosybrown'
  | 'royalblue'
  | 'saddlebrown'
  | 'salmon'
  | 'sandybrown'
  | 'seagreen'
  | 'seashell'
  | 'sienna'
  | 'skyblue'
  | 'slateblue'
  | 'slategray'
  | 'slategrey'
  | 'snow'
  | 'springgreen'
  | 'steelblue'
  | 'tan'
  | 'thistle'
  | 'tomato'
  | 'turquoise'
  | 'violet'
  | 'wheat'
  | 'whitesmoke'
  | 'yellowgreen'
  | 'rebeccapurple';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
