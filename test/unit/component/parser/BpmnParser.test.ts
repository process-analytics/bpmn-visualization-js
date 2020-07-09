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
import { defaultBpmnParser } from '../../../../src/component/parser/BpmnParser';
import { readFileSync } from '../../../helpers/file-helper';

describe('parse xml to model', () => {
  it('Single process with no participant', () => {
    const parser = defaultBpmnParser();
    const model = parser.parse(readFileSync('../fixtures/bpmn/parser-test.bpmn'));

    expect(model.flowNodes).toHaveLength(5);
    expect(model.edges).toHaveLength(4);
    expect(model.lanes).toHaveLength(0);
    expect(model.pools).toHaveLength(0);
  });
});
