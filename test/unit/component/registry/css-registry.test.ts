/**
 * Copyright 2021 Bonitasoft S.A.
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
import { CssRegistry } from '../../../../src/component/registry/css-registry';

const cssRegistry = new CssRegistry();
beforeEach(() => {
  cssRegistry.clear();
});

describe('manage css classes for BPMN cells', () => {
  describe('Get css classes', () => {
    it('getClassNames should return a empty array, when no class is registered at all', () => {
      expect(cssRegistry.getClassNames('bpmn-id-1')).toHaveLength(0);
    });

    it('getClassNames should return a empty array, when no class name is registered for the BPMN element', () => {
      cssRegistry.addClassNames('bpmn-id-1', ['class-name']);
      expect(cssRegistry.getClassNames('bpmn-id-2')).toHaveLength(0);
    });

    it('getClassNames should not let modify the stored class names except when using the API', () => {
      const bpmnElementId = 'bpmn-id-1';
      cssRegistry.addClassNames(bpmnElementId, ['class-name']);
      const classNames = cssRegistry.getClassNames('bpmn-id-1');
      expect(classNames).toEqual(['class-name']);
      classNames.push('new-class-1', 'new-class-2');
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class-name']);
    });

    it('getClassNames after clearing the whole registry', () => {
      cssRegistry.addClassNames('bpmn-id-1', ['class1']);
      cssRegistry.addClassNames('bpmn-id-2', ['class1', 'class2']);
      expect(cssRegistry.getClassNames('bpmn-id-1')).toEqual(['class1']);
      expect(cssRegistry.getClassNames('bpmn-id-2')).toEqual(['class1', 'class2']);

      cssRegistry.clear();
      expect(cssRegistry.getClassNames('bpmn-id-1')).toHaveLength(0);
      expect(cssRegistry.getClassNames('bpmn-id-2')).toHaveLength(0);
    });
  });

  describe('Add css classes', () => {
    it('Add an undefined array of classes', () => {
      expect(cssRegistry.addClassNames('bpmn-id', undefined)).toBeFalsy();
    });

    it('1 class name should be registered, when add it for the first time', () => {
      const bpmnElementId = 'bpmn-id';
      const classNames = ['class-name'];

      const result = cssRegistry.addClassNames(bpmnElementId, classNames);

      expect(result).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(classNames);
    });

    it('2 class names should be registered, when add them for the first time', () => {
      const bpmnElementId = 'bpmn-id';
      const classNames = ['class-name-1', 'class-name-2'];

      const result = cssRegistry.addClassNames(bpmnElementId, classNames);

      expect(result).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(classNames);
    });

    it('register several classes with a single string parameter', () => {
      const bpmnElementId = 'bpmn-id';
      const classNames = ['class-name-1 class-name-2'];

      const result = cssRegistry.addClassNames(bpmnElementId, classNames);

      expect(result).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(classNames);
    });

    it('a class name should be registered only once, when add it twice', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.addClassNames(bpmnElementId, ['class-name-1', 'class-name-2']);

      const result = cssRegistry.addClassNames(bpmnElementId, ['class-name-2', 'class-name-1']);

      expect(result).toBeFalsy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class-name-1', 'class-name-2']);
    });

    it('register several classes several times, check classes order', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.addClassNames(bpmnElementId, ['class-name-1', 'class-name-2']);

      const result = cssRegistry.addClassNames(bpmnElementId, ['class-name-3', 'class-name-2', 'class-name-4']);

      expect(result).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class-name-1', 'class-name-2', 'class-name-3', 'class-name-4']);
    });
  });

  describe('Remove css classes', () => {
    it('Remove an undefined array of classes', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.addClassNames(bpmnElementId, ['class']);
      expect(cssRegistry.removeClassNames(bpmnElementId, undefined)).toBeFalsy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class']);
    });

    it('Remove the only existing class', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.addClassNames(bpmnElementId, ['class-to-remove']);
      expect(cssRegistry.removeClassNames(bpmnElementId, ['class-to-remove'])).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toHaveLength(0);
    });

    it('Remove a single class when several exist', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.addClassNames(bpmnElementId, ['class1', 'class-to-remove', 'class2']);
      expect(cssRegistry.removeClassNames(bpmnElementId, ['class-to-remove'])).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class1', 'class2']);
    });

    it('Remove several classes when several exist', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.addClassNames(bpmnElementId, ['class1', 'class-to-remove1', 'class2', 'class-to-remove2']);
      expect(cssRegistry.removeClassNames(bpmnElementId, ['class-to-remove1', 'class-to-remove2'])).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class1', 'class2']);
    });

    it('Remove a class when none had been added first', () => {
      const bpmnElementId = 'bpmn-id';
      expect(cssRegistry.removeClassNames(bpmnElementId, ['class-to-remove'])).toBeFalsy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toHaveLength(0);
    });

    it('Remove a class that is not present when others have been added first', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.addClassNames(bpmnElementId, ['class1', 'class2']);
      expect(cssRegistry.removeClassNames(bpmnElementId, ['class-to-remove'])).toBeFalsy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class1', 'class2']);
    });

    it('Remove existing and non-existing classes', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.addClassNames(bpmnElementId, ['class1', 'class-to-remove-1', 'class2']);
      expect(cssRegistry.removeClassNames(bpmnElementId, ['class-to-remove-1', 'not-exist'])).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class1', 'class2']);
    });

    it('Remove a class twice', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.addClassNames(bpmnElementId, ['class-to-remove']);
      expect(cssRegistry.removeClassNames(bpmnElementId, ['class-to-remove'])).toBeTruthy();
      expect(cssRegistry.removeClassNames(bpmnElementId, ['class-to-remove'])).toBeFalsy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toHaveLength(0);
    });
  });

  describe('Toggle css classes', () => {
    it('Toggle an undefined array of classes', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.toggleClassNames(bpmnElementId, ['class']);
      expect(cssRegistry.toggleClassNames(bpmnElementId, undefined)).toBeFalsy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class']);
    });
    it('Toggle an empty array of classes', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.toggleClassNames(bpmnElementId, ['class']);
      expect(cssRegistry.toggleClassNames(bpmnElementId, [])).toBeFalsy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class']);
    });

    it('Toggle the only existing class', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.toggleClassNames(bpmnElementId, ['class-to-toggle']);
      expect(cssRegistry.toggleClassNames(bpmnElementId, ['class-to-toggle'])).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toHaveLength(0);
    });

    it('Toggle a single class when several exist', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.toggleClassNames(bpmnElementId, ['class1', 'class-to-toggle', 'class2']);
      expect(cssRegistry.toggleClassNames(bpmnElementId, ['class-to-toggle'])).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class1', 'class2']);
    });

    it('Toggle several classes when several exist', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.toggleClassNames(bpmnElementId, ['class1', 'class-to-toggle1', 'class2', 'class-to-toggle2']);
      expect(cssRegistry.toggleClassNames(bpmnElementId, ['class-to-toggle1', 'class-to-toggle2', 'class3'])).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class1', 'class2', 'class3']);
    });

    it('Toggle a class when none had been added first', () => {
      const bpmnElementId = 'bpmn-id';
      expect(cssRegistry.toggleClassNames(bpmnElementId, ['class-to-toggle'])).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toHaveLength(1);
    });

    it('Toggle a class that is not present when others have been added first', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.toggleClassNames(bpmnElementId, ['class1', 'class2']);
      expect(cssRegistry.toggleClassNames(bpmnElementId, ['class-to-toggle'])).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class1', 'class2', 'class-to-toggle']);
    });

    it('Toggle existing and non-existing classes', () => {
      const bpmnElementId = 'bpmn-id';
      cssRegistry.toggleClassNames(bpmnElementId, ['class1', 'class-to-toggle-1', 'class2']);
      expect(cssRegistry.toggleClassNames(bpmnElementId, ['class-to-toggle-1', 'not-exist'])).toBeTruthy();
      expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class1', 'class2', 'not-exist']);
    });
  });
});
