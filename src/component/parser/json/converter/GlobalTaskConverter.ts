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

import { TDefinitions } from '../../../../model/bpmn/json/BPMN20';
import { ConvertedElements } from './utils';
import { TGlobalTask } from '../../../../model/bpmn/json/baseElement/rootElement/globalTask';
import { ensureIsArray } from '../../../helpers/array-utils';
import { GlobalTaskKind } from '../../../../model/bpmn/internal/shape/ShapeUtil';
import { ShapeBpmnElementKind } from '../../../../model/bpmn/internal/shape';

/**
 * @internal
 */
export default class GlobalTaskConverter {
  constructor(readonly convertedElements: ConvertedElements) {}

  deserialize(definitions: TDefinitions): void {
    this.parseGlobalTasks(definitions.globalTask, ShapeBpmnElementKind.GLOBAL_TASK);
    this.parseGlobalTasks(definitions.globalBusinessRuleTask, ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE);
    this.parseGlobalTasks(definitions.globalManualTask, ShapeBpmnElementKind.GLOBAL_TASK_MANUAL);
    this.parseGlobalTasks(definitions.globalScriptTask, ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT);
    this.parseGlobalTasks(definitions.globalUserTask, ShapeBpmnElementKind.GLOBAL_TASK_USER);
  }

  private parseGlobalTasks<T extends TGlobalTask>(globalTasks: T | T[], kind: GlobalTaskKind): void {
    ensureIsArray<T>(globalTasks).forEach(globalTask => {
      this.convertedElements.registerGlobalTask(globalTask.id, kind);
    });
  }
}
