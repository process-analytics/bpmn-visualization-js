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

// Extend BPMN JSON diagram types with color properties from the BPMN in Color specification.
declare module '../../../model/bpmn/json/bpmndi' {
  interface BPMNShape {
    /** Fill color of the shape, as defined by the BPMN in Color specification. */
    'background-color'?: string;
    /** Fill color of the shape, as defined by the bpmn.io color specification. Used as fallback when {@link background-color} is not set. */
    fill?: string;
    /** Stroke (border) color of the shape, as defined by the BPMN in Color specification. */
    'border-color'?: string;
    /** Stroke (border) color of the shape, as defined by the bpmn.io color specification. Used as fallback when {@link border-color} is not set. */
    stroke?: string;
  }

  interface BPMNEdge {
    /** Stroke color of the edge, as defined by the BPMN in Color specification. */
    'border-color'?: string;
    /** Stroke color of the edge, as defined by the bpmn.io color specification. Used as fallback when {@link border-color} is not set. */
    stroke?: string;
  }

  interface BPMNLabel {
    /** Font color of the label, as defined by the BPMN in Color and in the bpmn.io color specifications. */
    color?: string;
  }
}

// Extend internal model types with color properties to model data coming from the BPMN in Color specification.
declare module '../../../model/bpmn/internal/types' {
  interface ShapeExtensions {
    /** Fill color of the shape, as a CSS color string. */
    fillColor?: string;
    /** Stroke (border) color of the shape, as a CSS color string. */
    strokeColor?: string;
  }

  interface EdgeExtensions {
    /** Stroke color of the edge, as a CSS color string. */
    strokeColor?: string;
  }

  interface LabelExtensions {
    /** Font color of the label, as a CSS color string. */
    color?: string;
  }
}
