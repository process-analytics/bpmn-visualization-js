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
import BpmnVisu from '../component/BpmnVisu';
import { DropFileUserInterface } from '../component/ui_ux/DropFileUserInterface';
import { ZoomOptions } from '../component/BpmnVisuOptions';

export const bpmnVisu = new BpmnVisu(window.document.getElementById('graph'), { activatePanning: true });

// callback function for opening | dropping the file to be loaded
function readAndLoadFile(f: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    bpmnVisu.load(reader.result as string);
  };
  reader.readAsText(f);
}

// TODO: move to UI initializer
new DropFileUserInterface(window, 'drop-container', 'graph', readAndLoadFile);

// TODO: make File Open Button a self contained component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleFileSelect(evt: any): void {
  const f = evt.target.files[0];
  readAndLoadFile(f);
}

document.getElementById('bpmn-file').addEventListener('change', handleFileSelect, false);
document.getElementById('file-selector').classList.remove('hidden');

document.getElementById('btn-zoom-in').onclick = function() {
  bpmnVisu.zoom(ZoomOptions.In);
};
document.getElementById('btn-zoom-out').onclick = function() {
  bpmnVisu.zoom(ZoomOptions.Out);
};
document.getElementById('btn-zoom-actual').onclick = function() {
  bpmnVisu.zoom(ZoomOptions.Actual);
};
document.getElementById('btn-zoom-fit').onclick = function() {
  bpmnVisu.zoom(ZoomOptions.Fit);
};
