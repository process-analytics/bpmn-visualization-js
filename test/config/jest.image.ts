/*
Copyright 2020 Bonitasoft S.A.

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

import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';

import { copyFileSync } from 'node:fs';

import debugLogger from 'debug';
import { addAttach } from 'jest-html-reporters/helper';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

const log = debugLogger('bv:test:jest:img');
const toMatchImageSnapshotWithRealSignature = toMatchImageSnapshot as (received: unknown, options?: MatchImageSnapshotOptions) => CustomMatcherResult;

// The path is relative from the jest-html-reporters page to the folder storing the images
function computeRelativePathFromReportToSnapshots(path: string): string {
  path = path.replace(/\\/g, '/');
  const searchedPart = 'build/test-report/e2e/'; // hard coded here, must be kept in sync with the e2e/jest.config.js
  return './' + path.slice(Math.max(0, path.indexOf(searchedPart) + searchedPart.length));
}

// the processing is inspired from jest-image-snapshot, but the management using a class is specific to this implementation
class RetriesCounter {
  private readonly timesCalled = new Map<unknown, number>();
  // https://github.com/facebook/jest/blob/v27.4.7/packages/jest-circus/src/types.ts
  // https://github.com/facebook/jest/blob/v27.4.7/packages/jest-circus/src/run.ts#L46
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- code adapted from jest-circus
  // @ts-ignore
  private readonly retryTimes = Number.parseInt(global[Symbol.for('RETRY_TIMES')], 10) || 0;

  hasReachMaxRetries(testId: unknown): boolean {
    return !this.retryTimes || this.getExecutionCount(testId) > this.retryTimes;
  }

  incrementExecutionCount(testId: unknown): void {
    this.timesCalled.set(testId, this.getExecutionCount(testId) + 1);
  }

  getExecutionCount(testId: unknown): number {
    return this.timesCalled.get(testId) ?? 0;
  }
}

const retriesCounter = new RetriesCounter();

async function attachImagesForReport(images: LocationOfImagesForTestReport, matcherContext: MatcherContext): Promise<void> {
  // Attach the images to jest-html-reports
  // Chain the calls to preserve the attachment order
  // Create a custom context as the async call can be done whereas the global jest context has changed (another test is currently running).
  // So the test name and path changed, and the images would be attached to the wrong test.
  // For the context object structure, see https://github.com/Hazyzh/jest-html-reporters/blob/v3.0.5/helper.ts#L95
  const context: Record<symbol, unknown> = {};
  const currentTestName = matcherContext.currentTestName;
  log('Attaching images to report for test %s', currentTestName);
  context[Symbol('bpmn-visualization')] = {
    state: {
      currentTestName: currentTestName,
      testPath: matcherContext.testPath,
    },
    matchers: {}, // required by the jest-html-reporters getJestGlobalData function even if not used
  };

  try {
    await addAttach({
      attach: computeRelativePathFromReportToSnapshots(images.diff),
      description: 'diff',
      bufferFormat: 'png',
      context,
    });

    await addAttach({
      attach: computeRelativePathFromReportToSnapshots(images.expected),
      description: 'expected',
      bufferFormat: 'png',
      context,
    });

    await addAttach({
      attach: computeRelativePathFromReportToSnapshots(images.received),
      description: 'received',
      bufferFormat: 'png',
      context,
    });

    log('Images attached to report for test %s', currentTestName);
  } catch (error) {
    console.error(
      `Error while attaching images to test ${currentTestName}.` +
        `The 'jest-html-reporters' reporter is probably not in use. For instance, this occurs when running tests with the IntelliJ/Webstorm Jest runner.`,
      error,
    );
  }
}

type LocationOfImagesForTestReport = {
  diff: string;
  expected: string;
  received: string;
};

function saveImages(options: MatchImageSnapshotOptions): LocationOfImagesForTestReport {
  const snapshotIdentifier = options.customSnapshotIdentifier as string;
  const baseImagePathWithName = `${options.customDiffDir}/${snapshotIdentifier}`;

  const diffImagePath = `${baseImagePathWithName}-diff.png`;
  const expectedImagePath = `${baseImagePathWithName}-expected.png`;
  copyFileSync(`${options.customSnapshotsDir}/${snapshotIdentifier}.png`, expectedImagePath);
  // this image is generated by jest-image-snapshot when activating `storeReceivedOnFailure`
  const receivedImagePath = `${options.customReceivedDir}/${snapshotIdentifier}-received.png`;

  return {
    diff: diffImagePath,
    expected: expectedImagePath,
    received: receivedImagePath,
  };
}

// Improve jest-image-snapshot outputs to facilitate debug
// The 'options' parameter is mandatory for us, and some properties must be set as well
// All options properties used here are always set in bpmn-visualization tests
// If the following implementation would be done directly in jest-image-snapshot, this won't be required as it set default values we cannot access here
function toMatchImageSnapshotCustom(this: MatcherContext, received: Buffer, options: MatchImageSnapshotOptions): CustomMatcherResult {
  const testId = this.currentTestName;
  retriesCounter.incrementExecutionCount(testId);
  log("Test: '%s' (test file path: '%s')", this.currentTestName, this.testPath);
  const executionCount = retriesCounter.getExecutionCount(testId);
  log('Ready to execute toMatchImageSnapshot, execution count: %s', executionCount);
  const result = toMatchImageSnapshotWithRealSignature.call(this, received, options);
  log('toMatchImageSnapshot executed');

  if (result.pass) {
    log('Result: success');
  } else {
    log('Result: failure');
    if (retriesCounter.hasReachMaxRetries(testId)) {
      const imageLocationInformation = saveImages(options);
      log('Images saved and ready to be registered to the report', imageLocationInformation);
      attachImagesForReport(imageLocationInformation, this).catch(error => log('Fail to attach images to the report %s', error));
    }

    // Add configured failure threshold in the error message
    const messages = result.message().split('\n');
    // For generalization, check options.failureThresholdType for percentage/pixel
    const newMessage = [`${messages[0]} Failure threshold was set to ${options.failureThreshold * 100}%. Execution count: ${executionCount}.`, ...messages.slice(1)].join('\n');
    result.message = () => newMessage;
  }

  return result;
}

expect.extend({ toMatchImageSnapshot: toMatchImageSnapshotCustom });
