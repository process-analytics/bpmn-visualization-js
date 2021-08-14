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

import { ParsingMessageCollector } from '../../../../src/component/parser/parsing-messages-management';
import { EdgeMissingBpmnElementWarning } from '../../../../src/component/parser/json/warnings';

describe('parsing message collector', () => {
  jest.spyOn(console, 'warn');

  afterEach(() => {
    jest.clearAllMocks();
  });

  const parsingMessageCollector = new ParsingMessageCollector();

  describe('console.warn when warning is registered', () => {
    it('edge missing bpmn element', () => {
      parsingMessageCollector.warning(new EdgeMissingBpmnElementWarning('edge-bpmnElement-unknown'));
      expect(console.warn).toHaveBeenCalledWith('Edge json deserialization: unable to find bpmn element with id %s', 'edge-bpmnElement-unknown');
    });
  });
});
