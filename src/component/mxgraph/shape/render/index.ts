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

// export types first, otherwise typedoc doesn't generate the subsequent doc correctly (no category and uses the file header instead of the actual TSDoc)
export type * from './render-types';
export { BpmnCanvas, type BpmnCanvasConfiguration } from './BpmnCanvas';
export { IconPainter, IconPainterProvider, type PaintParameter } from './icon-painter';
