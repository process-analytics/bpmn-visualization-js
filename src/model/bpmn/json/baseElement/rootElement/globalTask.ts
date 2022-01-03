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
import type { TCallableElement } from './rootElement';
import type { THumanPerformer, TPerformer, TPotentialOwner, TResourceRole } from '../resource';
import type { TScript } from '../../Semantic';
import type { TRendering } from '../baseElement';

export interface TGlobalTask extends TCallableElement {
  // resourceRole
  resourceRole?: TResourceRole | TResourceRole[];
  performer?: TPerformer | TPerformer[];
  humanPerformer?: THumanPerformer | THumanPerformer[];
  potentialOwner?: TPotentialOwner | TPotentialOwner[];
}

export interface TGlobalBusinessRuleTask extends TGlobalTask {
  implementation?: tImplementation; // default="##unspecified"
}

export type TGlobalManualTask = TGlobalTask;

export interface TGlobalScriptTask extends TGlobalTask {
  script?: TScript;
  scriptLanguage?: string;
}

export interface TGlobalUserTask extends TGlobalTask {
  rendering?: TRendering | TRendering[];
  implementation?: tImplementation; // default="##unspecified"
}

export enum tImplementation {
  Unspecified = '##unspecified',
  WebService = '##WebService',
}
