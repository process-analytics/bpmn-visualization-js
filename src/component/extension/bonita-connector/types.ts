/*
Copyright 2026 Bonitasoft S.A.

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

// Marks this file as an ES module so the `declare module` blocks below are treated as module augmentation
// (with relative paths) rather than ambient module declarations. Without this marker, TypeScript reports
// "TS2436: Ambient module declaration cannot specify relative module names."
//
// `export {}` is preferred over an empty `import type {} from '...'` because it survives
// `verbatimModuleSyntax: true`, which would otherwise erase empty type-only imports and break compilation.
export {};

// No JSON model augmentation is needed, unlike the BPMN in Color extension: the attributes read by this extension
// are part of the BPMN specification and are already declared on 'TServiceTask'
// (src/model/bpmn/json/baseElement/flowNode/activity/task.ts).

// Extend internal model types with the data computed from the Bonita connector information found in the BPMN semantic
// model.
declare module '../../../model/bpmn/internal/types' {
  interface ShapeBpmnElementExtensions {
    bonita?: {
      /** `true` when at least one Bonita connector is configured on the element. */
      hasConnector?: boolean;
    };
  }
}

// Declare the icon painting method contributed by this extension. All the augmentations of the extension are gathered
// in this file, which every other file of the extension already imports.
// The method is optional because an 'IconPainter' only holds it once the extension has been registered.
// 'PaintParameter' needs no import here: inside the block, the scope is the augmented module, which declares it.
declare module '../../mxgraph/shape/render/icon-painter' {
  interface IconPainter {
    /** Paint the icon marking an element holding at least one Bonita connector. */
    paintBonitaConnectorIcon?(paintParameter: PaintParameter): void;
  }
}
