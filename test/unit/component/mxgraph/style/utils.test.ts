/**
 * @jest-environment jsdom
 */
/*
Copyright 2023 Bonitasoft S.A.

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

import { BpmnStyleIdentifier } from '@lib/component/mxgraph/style';
import { getStyleValue } from '@lib/component/mxgraph/style/utils';

describe('getStyleValue', () => {
  test('cell style with key, returns the value', () => {
    expect(
      getStyleValue(
        'endEvent;bpmn.eventDefinitionKind=message;verticalAlign=top;align=center;labelWidth=77;labelPosition=ignore;verticalLabelPosition=middle;strokeColor=pink;bpmn.extra.css.classes=class-1,class-2;',
        BpmnStyleIdentifier.EXTRA_CSS_CLASSES,
        'fail',
      ),
    ).toBe('class-1,class-2');
  });

  test('cell style without key, returns the provided default', () => {
    expect(getStyleValue('sequenceFlow;normal;strokeColor=pink;', 'unknown-key', 'my-default')).toBe('my-default');
  });

  test('nullish cell style, returns the provided default', () => {
    expect(getStyleValue(undefined, 'a key', 'another-default')).toBe('another-default');
  });
});
