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

import type Shape from '../../../model/bpmn/internal/shape/Shape';
import type { StyleExtensionPoint } from '../extension-points';

import './types';

import { bonitaHasConnectorStyleIdentifier } from './identifiers';

export const bonitaConnectorStyleExtension: StyleExtensionPoint = {
  enrichShapeStyle(shape: Shape, styleValues: Map<string, string | number>): void {
    // The value is a string because mxGraph style values round-trip as strings, and the shapes read them back with
    // 'mxUtils.getValue'.
    shape.bpmnElement.extensions.bonita?.hasConnector && styleValues.set(bonitaHasConnectorStyleIdentifier, 'true');
  },
};
