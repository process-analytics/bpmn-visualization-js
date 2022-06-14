/**
 * Copyright 2022 Bonitasoft S.A.
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

// TODO filter by name in final implementation
// no need to test all combinations with names. Only pools and a very small subset
// test cross usage of ids and names

import type { ModelRepresentationForTestOnly } from '../../helpers/bpmn-model-utils';
import { ModelFiltering } from '../../../../src/component/registry/bpmn-model-filters';
import { toBpmnModel } from '../../helpers/bpmn-model-utils';

const modelFiltering = new ModelFiltering();

describe('Bpmn Model filters', () => {
  // TODO undefined as well? notice that we are not passing such values, so these tests have limited interest
  it('Passing a null BpmnModel does not generate error', () => {
    expect(modelFiltering.filter(toBpmnModel(null))).toBeNull();
  });

  // TODO model with a pool filtering another one
  // TODO model with a pool filtering several others - test currently in BpmnVisualization integration test, should be moved here?
  // TODO model without pool and doing pool filtering

  it('Filter a model with a single pool', () => {
    const model: ModelRepresentationForTestOnly = {
      pools: {
        id: 'participant_id_1',
        name: 'Participant 1',
        startEvent: {
          id: 'startEvent_1',
          name: 'Start Event 1',
        },
      },
    };
    const originalBpmnModel = toBpmnModel(model);
    modelFiltering.filter(originalBpmnModel);
    // const bpmnModel = modelFiltering.filter(originalBpmnModel);
    // TODO extract the util code from JsonTestUtils related to the BpmnModel - it will reuse this extracted code
  });
});
