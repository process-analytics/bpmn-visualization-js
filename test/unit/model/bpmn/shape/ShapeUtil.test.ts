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

import ShapeUtil from '../../../../../src/model/bpmn/shape/ShapeUtil';
import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/shape';

describe('ShapeUtil', () => {
  it('top level bpmn event kinds', () => {
    const tasks = ShapeUtil.topLevelBpmnEventKinds();

    expect(tasks).toContain(ShapeBpmnElementKind.EVENT_END);
  });

  it('task kinds', () => {
    const tasks = ShapeUtil.taskKinds();

    expect(tasks).toContain(ShapeBpmnElementKind.TASK);
    expect(tasks).toContain(ShapeBpmnElementKind.TASK_USER);
    expect(tasks).toContain('extra');
  });
});
