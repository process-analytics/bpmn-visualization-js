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

// This test is intentionally self-contained: it uses neither the matchers nor the helpers of the bpmn-visualization
// test infrastructure. The Bonita connector extension is meant to move to a dedicated library, which will only have
// access to the public API. Asserting the computed style of the cells is the only verification available there.

import { BpmnVisualization } from '@lib/bpmn-visualization';
import { readFileSync } from '@test/shared/file-helper';

const bpmnVisualization = new BpmnVisualization(null);

const hasConnectorStyleKey = 'bonita.hasConnector';

function loadDiagram(path: string): void {
  bpmnVisualization.load(readFileSync(path));
}

function getStyleOfCell(bpmnElementId: string): Record<string, string> {
  const cell = bpmnVisualization.graph.getModel().getCell(bpmnElementId);
  expect(cell).toBeDefined();
  return bpmnVisualization.graph.getView().getState(cell).style as unknown as Record<string, string>;
}

describe('Bonita connector extension', () => {
  describe('Focused diagram', () => {
    beforeEach(() => {
      loadDiagram('../fixtures/bpmn/xml-parsing/bonita-connector/connector.detection.bpmn');
    });

    it('sets the style on a service task holding a connector', () => {
      expect(getStyleOfCell('service_task_with_connector')[hasConnectorStyleKey]).toBe('true');
    });

    it.each(['service_task_without_connector', 'user_task'])('does not set the style on %s', (bpmnElementId: string) => {
      expect(getStyleOfCell(bpmnElementId)).not.toContainKey(hasConnectorStyleKey);
    });
  });

  // Bonita declares the 'bonitaConnector' namespace on every export, so the namespace must not be used to detect
  // connectors. This diagram is a real Bonita export without any connector.
  it('does not set the style on a Bonita export without connector', () => {
    loadDiagram('../fixtures/bpmn/xml-parsing/bonita-community-2021.1-A.2.0.export.bpmn');

    for (const bpmnElementId of ['_GcplYGJcEeuag9wrqgia1Q', '_GdSekGJcEeuag9wrqgia1Q', '_GdcPkGJcEeuag9wrqgia1Q', '_Gd1RIGJcEeuag9wrqgia1Q']) {
      expect(getStyleOfCell(bpmnElementId)).not.toContainKey(hasConnectorStyleKey);
    }
  });
});
