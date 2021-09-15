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
import { filter } from '../../../../src/component/helpers/array-utils';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/internal/shape';

describe('array helper functions', () => {
  describe('filter an array of string', () => {
    it('filter an array of string with a case insensitive regex', () => {
      expect(filter(['lane', 'pool', 'callActivity', 'subProcess', 'task', 'userTask', 'serviceTask'], 'Task', { ignoreCase: true })).toEqual(['task', 'userTask', 'serviceTask']);
    });

    it('filter an array of string with a case sensitive regex', () => {
      expect(filter(['lane', 'pool', 'callActivity', 'subProcess', 'task', 'userTask', 'serviceTask'], 'Task', { ignoreCase: false })).toEqual(['userTask', 'serviceTask']);
    });

    it('filter an array of string with no case sensitive parameter', () => {
      expect(filter(['lane', 'pool', 'callActivity', 'subProcess', 'task', 'userTask', 'serviceTask'], 'Task')).toEqual(['userTask', 'serviceTask']);
    });

    it('filter an array of string starting with', () => {
      expect(filter(['subProcess', 'task', 'userTask', 'globalTask', 'globalUserTask', 'globalManualTask'], 'Task', { startingWith: 'global' })).toEqual([
        'globalTask',
        'globalUserTask',
        'globalManualTask',
      ]);
    });

    it('filter an array of string not starting with', () => {
      expect(filter(['subProcess', 'task', 'userTask', 'globalTask', 'globalUserTask', 'globalManualTask'], 'Task', { notStartingWith: 'global' })).toEqual(['userTask']);
    });
  });

  describe('filter an array of string enum', () => {
    it('filter an array of string enum with a case insensitive regex', () => {
      expect(filter(Object.values(ShapeBpmnElementKind), 'Task', { ignoreCase: true })).toEqual([
        'task',
        'userTask',
        'serviceTask',
        'receiveTask',
        'sendTask',
        'manualTask',
        'scriptTask',
        'businessRuleTask',
        'globalTask',
        'globalUserTask',
        'globalManualTask',
        'globalScriptTask',
        'globalBusinessRuleTask',
      ]);
    });

    it('filter an array of string enum with a case sensitive regex', () => {
      expect(filter(Object.values(ShapeBpmnElementKind), 'Task', { ignoreCase: false })).toEqual([
        'userTask',
        'serviceTask',
        'receiveTask',
        'sendTask',
        'manualTask',
        'scriptTask',
        'businessRuleTask',
        'globalTask',
        'globalUserTask',
        'globalManualTask',
        'globalScriptTask',
        'globalBusinessRuleTask',
      ]);
    });

    it('filter an array of string enum with no case sensitive parameter', () => {
      expect(filter(Object.values(ShapeBpmnElementKind), 'Task')).toEqual([
        'userTask',
        'serviceTask',
        'receiveTask',
        'sendTask',
        'manualTask',
        'scriptTask',
        'businessRuleTask',
        'globalTask',
        'globalUserTask',
        'globalManualTask',
        'globalScriptTask',
        'globalBusinessRuleTask',
      ]);
    });

    it('filter an array of string starting with', () => {
      expect(filter(Object.values(ShapeBpmnElementKind), 'Task', { startingWith: 'global' })).toEqual([
        'globalTask',
        'globalUserTask',
        'globalManualTask',
        'globalScriptTask',
        'globalBusinessRuleTask',
      ]);
    });

    it('filter an array of string not starting with', () => {
      expect(filter(Object.values(ShapeBpmnElementKind), 'Task', { notStartingWith: 'global' })).toEqual([
        'userTask',
        'serviceTask',
        'receiveTask',
        'sendTask',
        'manualTask',
        'scriptTask',
        'businessRuleTask',
      ]);
    });
  });
});
