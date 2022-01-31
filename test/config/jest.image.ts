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
  const searchedPart = 'build/test-report/e2e/';
  return './' + path.substring(path.indexOf(searchedPart) + searchedPart.length);
}

// Improve jest-image-snapshot outputs to facilitate debug
// The 'options' parameter is mandatory for us, and some properties must be set as well
// If the following implementation would be done directly in jest-image-snapshot, this won't be required as it set default values we cannot access here
function toMatchImageSnapshotCustom(this: MatcherContext, received: Buffer, options: MatchImageSnapshotOptions): CustomMatcherResult {
  const result = toMatchImageSnapshotWithRealSignature.call(this, received, options);
  if (!result.pass) {
    // Generate expected and actual images
    // the following options properties are always set in bpmn-visualization tests
    const originalImagePath = `${options.customSnapshotsDir}/${options.customSnapshotIdentifier}-snap.png`;
    const expectedImagePath = `${options.customDiffDir}/${options.customSnapshotIdentifier}-diff-01-expected.png`;
    copyFileSync(originalImagePath, expectedImagePath);
    const actualImagePath = `${options.customDiffDir}/${options.customSnapshotIdentifier}-diff-02-actual.png`;
    writeFileSync(actualImagePath, received);
    // register the images for jest-html-reports (jest-stare displays the jest snapshots out of the box, so the diff file)
    // copy the images for a report without external dependencies
    addAttach({
      attach: computeRelativePathFromReportToSnapshots(`${options.customDiffDir}/${options.customSnapshotIdentifier}-diff.png`),
      description: 'diff',
      bufferFormat: 'png',
      context: undefined,
    });
    addAttach({
      attach: computeRelativePathFromReportToSnapshots(expectedImagePath),
      description: 'expected',
      bufferFormat: 'png',
      context: undefined,
    });
    addAttach({
      attach: computeRelativePathFromReportToSnapshots(actualImagePath),
      description: 'actual',
      bufferFormat: 'png',
      context: undefined,
    });

    // Add configured failure threshold in the error message
    const messages = result.message().split('\n');
    // For generalization, check options.failureThresholdType for percentage/pixel
    const newMessage = [`${messages[0]} Failure threshold was set to ${options.failureThreshold * 100}%.`, ...messages.slice(1)].join('\n');
    result.message = () => newMessage;
  }

  return result;
}

expect.extend({ toMatchImageSnapshot: toMatchImageSnapshotCustom });
