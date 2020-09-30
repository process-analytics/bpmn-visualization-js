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
import { TDefinitions } from '../../../../model/bpmn/xsd-json/BPMN20';
import { ensureIsArray } from './ConverterUtil';
import { TGlobalTask } from '../../../../model/bpmn/xsd-json/baseElement/rootElement/globalTask';

const globalTaskIds: string[] = [];

export function isGlobalTask(id: string): boolean {
  return globalTaskIds.includes(id);
}

export default class GlobalTaskConverter {
  deserialize(definitions: TDefinitions): void {
    try {
      // Deletes everything in the array, which does hit other references. For better performance.
      globalTaskIds.length = 0;

      this.parseGlobalTasks(definitions.globalTask);
      this.parseGlobalTasks(definitions.globalBusinessRuleTask);
      this.parseGlobalTasks(definitions.globalManualTask);
      this.parseGlobalTasks(definitions.globalScriptTask);
      this.parseGlobalTasks(definitions.globalUserTask);
    } catch (e) {
      // TODO error management
      console.error(e as Error);
    }
  }

  private parseGlobalTasks<T extends TGlobalTask>(globalTasks: T | T[]): void {
    ensureIsArray<T>(globalTasks).forEach(globalTask => {
      globalTaskIds.push(globalTask.id);
    });
  }
}
