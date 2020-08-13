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
import { documentReady, log, logStartup } from './helper';

export const bpmnVisualization = new BpmnVisualization(window.document.getElementById('graph'));

function loadBpmn(bpmn: string): void {
  bpmnVisualization.load(bpmn);

  // TODO make this configurable via url parameter
  log('Fitting....');
  //graph.fit(0);
  bpmnVisualization.graph.fit(0, false, 0, true, false, false);
  log('Fit completed');
}

// callback function for opening | dropping the file to be loaded
function readAndLoadFile(f: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    loadBpmn(reader.result as string);
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
    loadBpmn(bpmn);
    log('BPMN auto loading completed');
  } else {
    log('No BPMN auto loading');
  }
});
