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
import { log, logStartup } from './helper';

const bpmnVisualization = new BpmnVisualization(window.document.getElementById('graph'));

let fitOnLoad = false;
export function loadBpmn(bpmn: string): void {
  log('Loading bpmn....');
  bpmnVisualization.load(bpmn);
  log('BPMN loaded');

  if (fitOnLoad) {
    log('Fitting....');
    bpmnVisualization.graph.fit(0);
    log('Fit completed');
  }
}

export * from './helper';
export * from './component/DropFileUserInterface';

// callback function for opening | dropping the file to be loaded
export function readAndLoadFile(f: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    loadBpmn(reader.result as string);
  };
  reader.readAsText(f);
}

// TODO: make File Open Button a self contained component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleFileSelect(evt: any): void {
  const f = evt.target.files[0];
  readAndLoadFile(f);
}

export function startDemo(): void {
  const log = logStartup;
  log("Checking if 'BPMN auto loading from url parameter' is requested");
  const parameters = new URLSearchParams(window.location.search);

  fitOnLoad = parameters.get('fitOnLoad') == 'true';
  log(`Configure 'fit on load' to ${fitOnLoad}`);

  const bpmnParameterValue = parameters.get('bpmn');
  if (bpmnParameterValue) {
    const bpmn = decodeURIComponent(bpmnParameterValue);
    log(`Received bpmn length: ${bpmn.length}`);
    log(`Received bpmn content: ${bpmn}`);
    log('BPMN auto loading');
    loadBpmn(bpmn);
    log('BPMN auto loading completed');
  } else {
    log('No BPMN auto loading');
  }
}
