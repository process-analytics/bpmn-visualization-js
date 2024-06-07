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

import { bpmnVisualization } from './helpers/model-expect';

import { readFileSync } from '@test/shared/file-helper';

describe('mxGraph model - BPMN colors', () => {
  it('Colors are ignored by default', () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/xml-parsing/bpmn-in-color/bpmn-in-color-spec-sample.bpmn'));

    expect('task_orange_border').toBeTask({
      // no colors
      font: {
        family: 'Arial',
        size: 8,
      },
      // not under test
      label: 'Orange Border',
      parentId: '1',
      verticalAlign: 'top',
    });

    expect('sequence_flow_1').toBeSequenceFlow({
      // no colors
      font: {
        family: 'Arial',
        size: 8,
      },
      // not under test
      label: 'Orange link',
    });
  });
});
