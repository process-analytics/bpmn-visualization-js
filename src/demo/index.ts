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
import BpmnVisualization from '../component/BpmnVisualization';
import { DropFileUserInterface } from './component/DropFileUserInterface';
import { documentReady, logStartup } from './helper';

const graphElement = window.document.getElementById('graph');
if (!graphElement) throw Error('Element #graph not found, library could not be initialized');

export const bpmnVisualization = new BpmnVisualization(graphElement);

// callback function for opening | dropping the file to be loaded
function readAndLoadFile(f: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    bpmnVisualization.load(reader.result as string);
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

const bpmnFileInputElement = document.getElementById('bpmn-file');
if (bpmnFileInputElement) bpmnFileInputElement.addEventListener('change', handleFileSelect, false);

const fileSelectorElement = document.getElementById('file-selector');
if (fileSelectorElement) fileSelectorElement.classList.remove('hidden');

////////////////////////////////////////////////////////////////////////////////
// if bpmn passed as request parameter, try to load it directly
////////////////////////////////////////////////////////////////////////////////
documentReady(function () {
  const log = logStartup;
  log("Checking if 'BPMN auto loading from url parameter' is requested");
  const parameters = new URLSearchParams(window.location.search);
  const bpmnParameterValue = parameters.get('bpmn');
  if (bpmnParameterValue) {
    const bpmn = decodeURIComponent(bpmnParameterValue);
    log('BPMN auto loading');
    bpmnVisualization.load(bpmn);
    log('BPMN auto loading completed');
  } else {
    log('No BPMN auto loading');
  }
});
