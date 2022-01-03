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
import checkServer from './check.server';
import copyBpmnDiagrams from './copy.bpmn.diagram';
import { FullConfig } from '@playwright/test';

//  globalSetup file must export a single function.
const globalSetup = async (config: FullConfig): Promise<void> => {
  if (!config.rootDir.endsWith('bundles')) {
    copyBpmnDiagrams();
  }
  await checkServer(config);
};

export default globalSetup;
