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
import { documentReady, FitType, getElementsByKinds, addCssClasses, log, startBpmnVisualization, updateLoadOptions } from '../../index.es.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureControls() {
  const textArea = document.getElementById('elements-result');

  document.getElementById('bpmn-kinds-select').onchange = function (ev) {
    const bpmnKind = ev.target.value;
    log(`Searching for Bpmn elements of '${bpmnKind}' kind`);
    const elementsByKinds = getElementsByKinds(bpmnKind);

    const textHeader = `Found ${elementsByKinds.length} ${bpmnKind}(s)`;
    log(textHeader);
    const lines = elementsByKinds.map(elt => `  - ${elt.bpmnSemantic.id}: '${elt.bpmnSemantic.name}'`).join('\n');

    textArea.value += [textHeader, lines].join('\n') + '\n';
    textArea.scrollTop = textArea.scrollHeight;

    const bpmnIds = elementsByKinds.map(elt => elt.bpmnSemantic.id);
    addCssClasses(bpmnIds, 'test');
  };

  document.getElementById('bpmn-kinds-textarea-clean-btn').onclick = function () {
    textArea.value = '';
  };
}

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
  configureControls();
});
