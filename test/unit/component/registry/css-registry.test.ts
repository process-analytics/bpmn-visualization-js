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

describe('manage css classes for BPMN cells', () => {
  let cssRegistry: CssRegistry;
  beforeEach(() => {
    cssRegistry = new CssRegistry();
  });

  it('1 class name should be registered, when add it for the first time', () => {
    const bpmnElementId = 'bpmn-id';
    const classNames = ['class-name'];

    cssRegistry.addClassNames(bpmnElementId, classNames);

    expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(classNames);
  });

  it('2 class names should be registered, when add them for the first time', () => {
    const bpmnElementId = 'bpmn-id';
    const classNames = ['class-name-1', 'class-name-2'];

    cssRegistry.addClassNames(bpmnElementId, classNames);

    expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(classNames);
  });

  it('a class name should be registered only once, when add it twice', () => {
    const bpmnElementId = 'bpmn-id';
    cssRegistry.addClassNames(bpmnElementId, ['class-name-1', 'class-name-2']);

    cssRegistry.addClassNames(bpmnElementId, ['class-name-3', 'class-name-2', 'class-name-4']);

    expect(cssRegistry.getClassNames(bpmnElementId)).toEqual(['class-name-1', 'class-name-2', 'class-name-3', 'class-name-4']);
  });

  it('addClassNames should return true, when at least one new class name is not registered', () => {
    const bpmnElementId = 'bpmn-id';
    cssRegistry.addClassNames(bpmnElementId, ['class-name-1']);

    const result = cssRegistry.addClassNames(bpmnElementId, ['class-name-1', 'class-name-2']);

    expect(result).toBeTruthy();
  });

  it('addClassNames should return false, when all the new class names are registered', () => {
    const bpmnElementId = 'bpmn-id';
    cssRegistry.addClassNames(bpmnElementId, ['class-name-1', 'class-name-2']);

    const result = cssRegistry.addClassNames(bpmnElementId, ['class-name-2', 'class-name-1']);

    expect(result).toBeFalsy();
  });

  it('getClassNames should return a empty array, when no class name is registered for the BPMN element', () => {
    cssRegistry.addClassNames('bpmn-id-1', ['class-name']);

    expect(cssRegistry.getClassNames('bpmn-id-2')).toHaveLength(0);
  });
});
