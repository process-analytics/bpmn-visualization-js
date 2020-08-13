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

// inspired from https://medium.com/javascript-in-plain-english/jest-how-to-use-extend-with-typescript-4011582a2217
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(): R;
    }
  }
}

import { readFileSync } from '../helpers/file-helper';

const graphContainerId = 'graph';

describe('non regression visual tests', () => {
  it('should display graph in page', async () => {
    await page.goto(`http://localhost:10001?bpmn=${readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn')}`);
    await page.waitForSelector(`#${graphContainerId}`);
    await expect(page.title()).resolves.toMatch('BPMN Visualization Demo');

    const image = await page.screenshot();

    expect(image).toMatchImageSnapshot();
  });
});
