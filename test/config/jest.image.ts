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
import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { copyFileSync, writeFileSync } from 'fs';
import { addAttach } from 'jest-html-reporters/helper';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

const toMatchImageSnapshotWithRealSignature = toMatchImageSnapshot as (received: unknown, options?: MatchImageSnapshotOptions) => CustomMatcherResult;

// The path is related between the jest-html-reporters page and the folder storing the images
function computeRelativePathFromReportToSnapshots(path: string): string {
  const searchedPart = 'build/test-report/e2e/'; // hard coded here, must be kept in sync with the e2e/jest.config.js
  return './' + path.substring(path.indexOf(searchedPart) + searchedPart.length);
}

// the processing is inspired from jest-image-snapshot, but the management using a class is specific to this implementation
class RetriesCounter {
  private readonly timesCalled = new Map<unknown, number>();
  // https://github.com/facebook/jest/blob/v27.4.7/packages/jest-circus/src/types.ts
  // https://github.com/facebook/jest/blob/v27.4.7/packages/jest-circus/src/run.ts#L46
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- code adapted from jest-circus
  // @ts-ignore
  private readonly retryTimes = parseInt(global[Symbol.for('RETRY_TIMES')], 10) || 0;

  hasReachMaxRetries(testId: unknown): boolean {
    return !this.retryTimes || this.timesCalled.get(testId) > this.retryTimes;
  }

  incrementExecutionCount(testId: unknown): void {
    this.timesCalled.set(testId, (this.timesCalled.get(testId) || 0) + 1);
  }
}

const retriesCounter = new RetriesCounter();

function saveAndRegisterImages(matcherContext: MatcherContext, received: Buffer, options: MatchImageSnapshotOptions): void {
  const snapshotIdentifier = <string>options.customSnapshotIdentifier;
  // Generate expected and actual images
  const baseImagePathWithName = `${options.customDiffDir}/${snapshotIdentifier}`; // TODO rename

  const expectedImagePath = `${baseImagePathWithName}-diff-01-expected.png`;
  copyFileSync(`${options.customSnapshotsDir}/${snapshotIdentifier}-snap.png`, expectedImagePath);
  const actualImagePath = `${baseImagePathWithName}-diff-02-actual.png`;
  writeFileSync(actualImagePath, received);
  // Attach the images to jest-html-reports
  // Chain the calls to preserve the attachment order
  // Create a custom context as the async call can be done whereas the global jest context has changed (another test is currently running).
  // So the test name and path changed, and the images would be attached to the wrong test.
  // For the context object structure, see https://github.com/Hazyzh/jest-html-reporters/blob/v3.0.5/helper.ts#L95
  const context: { [key: symbol]: unknown } = {};
  context[Symbol('bpmn-visualization')] = {
    state: {
      currentTestName: matcherContext.currentTestName,
      testPath: matcherContext.testPath,
    },
    matchers: {}, // required by the jest-html-reporters getJestGlobalData function even if not used
  };

  addAttach({
    attach: computeRelativePathFromReportToSnapshots(`${baseImagePathWithName}-diff.png`),
    description: 'diff',
    bufferFormat: 'png',
    context,
  })
    .then(() =>
      addAttach({
        attach: computeRelativePathFromReportToSnapshots(expectedImagePath),
        description: 'expected',
        bufferFormat: 'png',
        context,
      }),
    )
    .then(() => {
      addAttach({
        attach: computeRelativePathFromReportToSnapshots(actualImagePath),
        description: 'actual',
        bufferFormat: 'png',
        context,
      });
    })
    .catch(e =>
      console.error(
        `Error while attaching images to test ${snapshotIdentifier}.` +
          `The 'jest-html-reporters' reporter is probably not in use. For instance, this occurs when running tests with the IntelliJ/Webstorm Jest runner.`,
        e,
      ),
    );
}

// Improve jest-image-snapshot outputs to facilitate debug
// The 'options' parameter is mandatory for us, and some properties must be set as well
// If the following implementation would be done directly in jest-image-snapshot, this won't be required as it set default values we cannot access here
function toMatchImageSnapshotCustom(this: MatcherContext, received: Buffer, options: MatchImageSnapshotOptions): CustomMatcherResult {
  const result = toMatchImageSnapshotWithRealSignature.call(this, received, options);
  if (!result.pass) {
    // Note: the options properties used here are always set in bpmn-visualization tests
    const snapshotIdentifier = options.customSnapshotIdentifier;
    retriesCounter.incrementExecutionCount(snapshotIdentifier);
    if (retriesCounter.hasReachMaxRetries(snapshotIdentifier)) {
      saveAndRegisterImages(this, received, options);
    }

    // Add configured failure threshold in the error message
    const messages = result.message().split('\n');
    // For generalization, check options.failureThresholdType for percentage/pixel
    const newMessage = [`${messages[0]} Failure threshold was set to ${options.failureThreshold * 100}%.`, ...messages.slice(1)].join('\n');
    result.message = () => newMessage;
  }

  return result;
}

expect.extend({ toMatchImageSnapshot: toMatchImageSnapshotCustom });
