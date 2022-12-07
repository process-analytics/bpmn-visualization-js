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
import { dirname, join } from 'node:path';
import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { configLog, getSimplePlatformName, getTestedBrowserFamily } from '../test-utils';

export interface ImageSnapshotThresholdConfig {
  linux?: number;
  macos?: number;
  windows?: number;
  [key: string]: number;
}

const defaultImageSnapshotConfig: MatchImageSnapshotOptions = {
  onlyDiff: true,
  // locally and on CI, see diff images folder directly
  dumpDiffToConsole: false,
  // use SSIM to limit false positive
  // https://github.com/americanexpress/jest-image-snapshot#recommendations-when-using-ssim-comparison
  comparisonMethod: 'ssim',
  failureThresholdType: 'percent',
  storeReceivedOnFailure: true,
};

export class ImageSnapshotConfigurator {
  private readonly thresholdConfig: Map<string, ImageSnapshotThresholdConfig>;
  private readonly defaultFailureThreshold: number;
  protected readonly defaultCustomDiffDir: string;
  protected readonly defaultCustomSnapshotsDir: string;

  constructor(imageSnapshotThresholds: MultiBrowserImageSnapshotThresholds, snapshotsSubDirName: string) {
    this.thresholdConfig = imageSnapshotThresholds.getThresholds();
    this.defaultFailureThreshold = imageSnapshotThresholds.getDefault();
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
      customReceivedDir: this.defaultCustomDiffDir,
    };
  }

  private getFailureThreshold(fileName: string): number {
    let failureThreshold = this.defaultFailureThreshold;

    const config = this.thresholdConfig?.get(fileName);
    if (config) {
      configLog(`Using dedicated image snapshot threshold for '${fileName}'`);
      const simplePlatformName = getSimplePlatformName();
      configLog(`Simple platform name: ${simplePlatformName}`);
      failureThreshold = config[simplePlatformName] || failureThreshold;
    } else {
      configLog(`Using default image snapshot threshold for '${fileName}'`);
    }
    configLog(`--> threshold: ${failureThreshold}`);

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

interface ThresholdDefaults {
  chromium: number;
  firefox: number;
  webkit: number;
}

/**
 * <b>About subclassing, for the `threshold` methods </b> (configure threshold by bpmn files)
 *
 * When introducing a new test, please don't add threshold until you get failures when running
 * on GitHub Workflow because of discrepancies depending on OS/machine and browser (few pixels) and that are not visible by a human.
 * This is generally only required for diagram containing labels. If you are not testing the labels (value, position, ...) as part of the use case you want to cover, remove labels
 * from the BPMN diagram to avoid such discrepancies.
 */
export class MultiBrowserImageSnapshotThresholds {
  private readonly chromiumDefault: number;
  private readonly firefoxDefault: number;
  private readonly webkitDefault: number;

  constructor(thresholdDefaults: ThresholdDefaults) {
    this.chromiumDefault = thresholdDefaults.chromium;
    this.firefoxDefault = thresholdDefaults.firefox;
    this.webkitDefault = thresholdDefaults.webkit;
  }

  protected getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return undefined;
  }

  protected getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return undefined;
  }

  protected getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return undefined;
  }

  getThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    const testedBrowserFamily = getTestedBrowserFamily();
    configLog(`The browser family used for test is ${testedBrowserFamily}`);
    switch (testedBrowserFamily) {
      case 'chromium':
        return this.getChromiumThresholds();
      case 'firefox':
        return this.getFirefoxThresholds();
      case 'webkit':
        return this.getWebkitThresholds();
      default:
        return new Map<string, ImageSnapshotThresholdConfig>();
    }
  }

  getDefault(): number {
    switch (getTestedBrowserFamily()) {
      case 'chromium':
        return this.chromiumDefault;
      case 'firefox':
        return this.firefoxDefault;
      case 'webkit':
        return this.webkitDefault;
      default:
        return 0;
    }
  }
}
