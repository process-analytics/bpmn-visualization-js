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
import { readFileSync } from '../helpers/file-helper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Differencify = require('differencify');
// const differencify = new Differencify({ imageSnapshotPath: 'differencify_snapshots', debug: true });
const differencify = new Differencify({ imageSnapshotPath: 'differencify_snapshots' });

describe('tests differencify', () => {
  it.each(['simple-start-task-end', 'model-complete-semantic', 'model-coordinates-relative-to-pool', 'model-coordinates-relative-to-pool-or-lane', 'parser-test'])(
    'validate %s diagram appear correctly',
    async diagramName => {
      await differencify
        .init()
        // .launch({ headless: false })
        .launch()
        .newPage()
        .goto(`http://localhost:10001?bpmn=${readFileSync(`../fixtures/bpmn/${diagramName}.bpmn`)}`)
        .screenshot()
        .toMatchSnapshot()
        .close()
        .end();
    },
  );
});
