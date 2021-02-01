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
import { dirname, join } from 'path';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { getSimplePlatformName, log } from '../test-utils';

export interface ImageSnapshotThresholdConfig {
  linux?: number;
  macos?: number;
  windows?: number;
  [key: string]: number;
}

const defaultImageSnapshotConfig: MatchImageSnapshotOptions = {
  diffDirection: 'vertical',
  // locally and on CI, see diff images folder directly
  dumpDiffToConsole: false,
  // use SSIM to limit false positive
  // https://github.com/americanexpress/jest-image-snapshot#recommendations-when-using-ssim-comparison
  comparisonMethod: 'ssim',
  failureThresholdType: 'percent',
};

export class ImageSnapshotConfigurator {
  protected readonly defaultCustomDiffDir: string;
  protected readonly defaultCustomSnapshotsDir: string;
  /**
   * <b>About `thresholdConfig`</b>
   *
   * Configure threshold by bpmn files. When introducing a new test, please don't add threshold until you get failures when running
   * on GitHub Workflow because of discrepancies depending of OS/machine (few pixels) and that are not visible by a human.
   * This is generally only required for diagram containing labels. If you are not testing the labels (value, position, ...) as part of the use case you want to cover, remove labels
   * from the BPMN diagram to avoid such discrepancies.
   *
   * Default threshold value is to make tests pass on macOS using Chromium (the GitHub workflow diff was 0.00031509446166699817%).
   */
  constructor(readonly thresholdConfig: Map<string, ImageSnapshotThresholdConfig>, snapshotsSubDirName: string, readonly defaultFailureThreshold = 0.000004) {
    this.defaultCustomDiffDir = join(ImageSnapshotConfigurator.getDiffDir(), snapshotsSubDirName);
    this.defaultCustomSnapshotsDir = join(ImageSnapshotConfigurator.getSnapshotsDir(), snapshotsSubDirName);
  }

  getConfig(param: string | { fileName: string }): MatchImageSnapshotOptions {
    const fileName = typeof param === 'string' ? param : param.fileName;
    const failureThreshold = this.getFailureThreshold(fileName);

    return {
      ...defaultImageSnapshotConfig,
      failureThreshold: failureThreshold,
      customSnapshotIdentifier: fileName,
      customSnapshotsDir: this.defaultCustomSnapshotsDir,
      customDiffDir: this.defaultCustomDiffDir,
    };
  }

  private getFailureThreshold(fileName: string): number {
    let failureThreshold = this.defaultFailureThreshold;

    const config = this.thresholdConfig.get(fileName);
    if (config) {
      log(`Building dedicated image snapshot configuration for '${fileName}'`);
      const simplePlatformName = getSimplePlatformName();
      log(`Simple platform name: ${simplePlatformName}`);
      failureThreshold = config[simplePlatformName] || failureThreshold;
    }
    log(`ImageSnapshot - using failureThreshold: ${failureThreshold}`);

    return failureThreshold;
  }

  static getSnapshotsDir(): string {
    return join(dirname(expect.getState().testPath), '__image_snapshots__');
  }

  static getDiffDir(): string {
    const testDirName = dirname(expect.getState().testPath);
    // directory is relative to $ROOT/test/e2e
    return join(testDirName, '../../build/test-report/e2e/__diff_output__');
  }
}
