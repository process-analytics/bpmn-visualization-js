/*
Copyright 2020 Bonitasoft S.A.

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

// mixed="true"
// <xsd:any namespace="##any" processContents="lax" minOccurs="0"/>
export interface TDocumentation {
  id?: string;
  textFormat?: string; // default="text/plain"
}

export interface TExtension {
  documentation?: TDocumentation | TDocumentation[];
  definition?: string;
  mustUnderstand?: boolean; // default="false"
}

// <xsd:any namespace="##other" processContents="lax" minOccurs="0" maxOccurs="unbounded" />
export type TExtensionElements = object;

// mixed="true"
// <xsd:any namespace="##any" processContents="lax" minOccurs="0"/>
export type TScript = object;

// mixed="true"
// <xsd:any namespace="##any" processContents="lax" minOccurs="0"/>
export type TText = object;
