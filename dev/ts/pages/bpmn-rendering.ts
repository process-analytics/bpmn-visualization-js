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

import { documentReady, log, logError, startBpmnVisualization } from '../development-bundle-index';

function statusFetchKO(errorMessage: string): void {
  logError(errorMessage);
  const statusElt = document.querySelector('#status-zone') as HTMLDivElement;
  statusElt.innerText = errorMessage;
  statusElt.className = 'status-ko';
  log('Status zone set with error:', errorMessage);
}

documentReady(() => startBpmnVisualization({ globalOptions: { container: 'bpmn-container' }, statusKoNotifier: statusFetchKO }));
