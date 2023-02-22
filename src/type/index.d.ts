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

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@typed-mxgraph/typed-mxgraph/lib/handler/index.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@typed-mxgraph/typed-mxgraph/lib/io/index.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@typed-mxgraph/typed-mxgraph/lib/layout/index.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@typed-mxgraph/typed-mxgraph/lib/model/index.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@typed-mxgraph/typed-mxgraph/lib/util/index.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@typed-mxgraph/typed-mxgraph/lib/shape/index.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@typed-mxgraph/typed-mxgraph/lib/view/index.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@typed-mxgraph/typed-mxgraph/lib/mxClient.d.ts" />

declare module 'mxgraph' {
  export interface mxGraphExportObject {
    mxRootChange: typeof mxRootChange;
    mxGeometryChange: typeof mxGeometryChange;
    mxChildChange: typeof mxChildChange;
    mxStyleChange: typeof mxStyleChange;
    mxVisibleChange: typeof mxVisibleChange;
    mxCollapseChange: typeof mxCollapseChange;
    mxValueChange: typeof mxValueChange;
    mxTerminalChange: typeof mxTerminalChange;
    mxCurrentRootChange: typeof mxCurrentRootChange;
  }
}
