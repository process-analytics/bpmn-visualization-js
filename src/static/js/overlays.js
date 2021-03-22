/**
 * Copyright 2020 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { documentReady, FitType, startBpmnVisualization, updateLoadOptions, addOverlay } from '../../index.es.js';

documentReady(() => {
  startBpmnVisualization({
    globalOptions: {
      container: 'bpmn-container',
      navigation: {
        enabled: true,
      },
    },
  });
  updateLoadOptions({ type: FitType.Center, margin: 20 });

  const positions = new Map([
    ['StartEvent_1', 'top-left'],
    // TODO: uncomment or use when we add support for edge overlay
    // ['Flow_1', 'middle'],
    ['Activity_1', 'top-right'],
  ]);

  setTimeout(() => {
    // Overlay update
    [
      'StartEvent_1',
      // TODO: uncomment or use when we add support for edge overlay
      // 'Flow_1',
      'Activity_1',
    ].forEach(id => {
      addOverlay(id, { position: positions.get(id), label: '123' });
    });
  }, 500);
});
