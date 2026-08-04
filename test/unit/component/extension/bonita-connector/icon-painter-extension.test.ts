/**
 * @jest-environment jsdom
 */
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

import { bonitaConnectorIconPainterExtension } from '@lib/component/extension/bonita-connector/icon-painter-extension';
import { IconPainter } from '@lib/component/mxgraph/shape/render';

describe('Bonita connector — icon painter extension', () => {
  it('contributes the connector icon painting method', () => {
    expect(bonitaConnectorIconPainterExtension).toContainKey('paintBonitaConnectorIcon');
    expect(bonitaConnectorIconPainterExtension.paintBonitaConnectorIcon).toBeFunction();
  });

  it('makes the method callable on the painter it is injected into', () => {
    const iconPainter = new IconPainter();

    Object.assign(iconPainter, bonitaConnectorIconPainterExtension);

    expect(iconPainter.paintBonitaConnectorIcon).toBeFunction();
  });

  it('does not leak the method to the other painters', () => {
    Object.assign(new IconPainter(), bonitaConnectorIconPainterExtension);

    expect(new IconPainter().paintBonitaConnectorIcon).toBeUndefined();
  });
});
