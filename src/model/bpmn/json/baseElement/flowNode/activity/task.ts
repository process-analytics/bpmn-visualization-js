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
import type { TScript } from '../../../Semantic';
import type { TActivity } from './activity';
import type { tImplementation } from '../../rootElement/globalTask';
import type { TRendering } from '../../baseElement';

export type TTask = TActivity;

export interface TBusinessRuleTask extends TTask {
  implementation?: tImplementation; // default="##unspecified"
}

export type TManualTask = TTask;

export interface TReceiveTask extends TTask {
  implementation?: tImplementation; // default="##WebService"
  instantiate?: boolean; // default="##false"
  messageRef?: string;
  operationRef?: string;
}

export interface TSendTask extends TTask {
  implementation?: tImplementation; // default="##WebService"
  messageRef?: string;
  operationRef?: string;
}

export interface TServiceTask extends TTask {
  implementation?: tImplementation; // default="##WebService"
  operationRef?: string;
}

export interface TScriptTask extends TTask {
  script?: TScript;
  scriptFormat?: string;
}

export interface TUserTask extends TTask {
  rendering?: TRendering | TRendering[];
  implementation?: tImplementation; // default="##unspecified"
}
