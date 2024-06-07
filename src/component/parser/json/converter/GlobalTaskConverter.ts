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

import type { ConvertedElements } from './utils';
import type { GlobalTaskKind } from '../../../../model/bpmn/internal';
import type { TGlobalTask } from '../../../../model/bpmn/json/baseElement/rootElement/globalTask';
import type { TDefinitions } from '../../../../model/bpmn/json/bpmn20';

import { ShapeBpmnElementKind } from '../../../../model/bpmn/internal';
import { ensureIsArray } from '../../../helpers/array-utils';

/**
 * @internal
 */
export default class GlobalTaskConverter {
  constructor(private convertedElements: ConvertedElements) {}

  deserialize(definitions: TDefinitions): void {
    this.parseGlobalTasks(definitions.globalTask, ShapeBpmnElementKind.GLOBAL_TASK);
    this.parseGlobalTasks(definitions.globalBusinessRuleTask, ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE);
    this.parseGlobalTasks(definitions.globalManualTask, ShapeBpmnElementKind.GLOBAL_TASK_MANUAL);
    this.parseGlobalTasks(definitions.globalScriptTask, ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT);
    this.parseGlobalTasks(definitions.globalUserTask, ShapeBpmnElementKind.GLOBAL_TASK_USER);
  }

  private parseGlobalTasks<T extends TGlobalTask>(globalTasks: T | T[], kind: GlobalTaskKind): void {
    for (const globalTask of ensureIsArray<T>(globalTasks)) this.convertedElements.registerGlobalTask(globalTask.id, kind);
  }
}
