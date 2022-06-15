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

import { poolInModel, toBpmnModel } from '../../helpers/bpmn-model-utils';
import { ModelFiltering } from '../../../../src/component/registry/bpmn-model-filters';

const modelFiltering = new ModelFiltering();

describe('Bpmn Model filters', () => {
  // TODO undefined as well? notice that we are not passing such values, so these tests have limited interest
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Passing a null BpmnModel does not generate error', () => {
    expect(modelFiltering.filter(toBpmnModel(null))).toBeNull();
  });

  // here we check the error message - use it.each if necessary
  // TODO test with a single pool id
  // TODO test with names
  it('Filter several pool by id - non existing pool id', () => {
    expect(() =>
      modelFiltering.filter(poolInModel('1', 'Pool 1'), {
        includes: {
          pools: {
            ids: ['i_do_not_exist-1', 'i_do_not_exist-2'],
          },
        },
      }),
    ).toThrow(`no existing pool with ids i_do_not_exist-1,i_do_not_exist-2`);
  });

  // TODO error management model without pool and doing pool filtering

  // TODO model with a pool filtering another one
  // TODO model with a pool filtering several including the existing one
  // TODO test 2 pools + msg flows

  it('No filter', () => {
    const originalBpmnModel = toBpmnModel({
      pools: {
        id: 'participant_id_1',
        name: 'Participant 1',
        startEvent: {
          id: 'startEvent_1',
          name: 'Start Event 1',
        },
      },
    });
    const bpmnModel = modelFiltering.filter(originalBpmnModel);
    expect(bpmnModel).toStrictEqual(originalBpmnModel);
  });

  it('Filter a model containing a single pool', () => {
    const originalBpmnModel = toBpmnModel({
      pools: {
        id: 'participant_id_1',
        name: 'Participant 1',
        startEvent: {
          id: 'startEvent_1',
          name: 'Start Event 1',
        },
      },
    });
    const bpmnModel = modelFiltering.filter(originalBpmnModel, { includes: { pools: { ids: 'participant_id_1' } } });
    expect(bpmnModel).toStrictEqual(originalBpmnModel);
  });

  it('Filter a model containing several pool', () => {
    const originalBpmnModel = toBpmnModel({
      pools: [
        {
          id: 'participant_id_1',
          name: 'Participant 1',
          startEvent: {
            id: 'startEvent_1',
            name: 'Start Event 1',
          },
        },
        {
          id: 'participant_id_2',
          name: 'Participant 2',
          startEvent: {
            id: 'startEvent_2',
            name: 'Start Event 2',
          },
          tasks: [
            {
              id: 'task_1',
            },
            {
              id: 'task_2',
            },
          ],
        },
      ],
    });
    const bpmnModel = modelFiltering.filter(originalBpmnModel, { includes: { pools: { ids: 'participant_id_2' } } });
    expect(bpmnModel).toStrictEqual(originalBpmnModel);
    // TODO extract the util code from JsonTestUtils related to the BpmnModel - it will reuse this extracted code
  });
});
