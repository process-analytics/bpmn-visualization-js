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

// TODO use 'jest-image-snapshot' definition types when the lib will be updated
// The type lib does not support setting config for ssim (4.2.0 released on july 2020)
// typescript integration: https://github.com/americanexpress/jest-image-snapshot#usage-in-typescript
//
// inspired from https://medium.com/javascript-in-plain-english/jest-how-to-use-extend-with-typescript-4011582a2217
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(imageSnapshotConfig?: ImageSnapshotConfig): R;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ImageSnapshotConfig {}
  }
}

import debugLogger from 'debug';
import { copyFileSync, loadBpmnContentForUrlQueryParam } from '../../helpers/file-helper';

const log = debugLogger('test');

function getSimplePlatformName(): string {
  const platform = process.platform;
  log(`This platform is ${platform}`);

  if (platform.startsWith('win')) {
    return 'windows';
  } else if (platform.startsWith('darwin')) {
    return 'macos';
  }
  // we don't support other platform than linux, so hardcode it
  return 'linux';
}

export interface ImageSnapshotThresholdConfig {
  linux: number;
  macos: number;
  windows: number;
}

const defaultImageSnapshotConfig = {
  diffDirection: 'vertical',
  dumpDiffToConsole: true, // useful on CI (no need to retrieve the diff image, copy/paste image content from logs)
  // use SSIM to limit false positive
  // https://github.com/americanexpress/jest-image-snapshot#recommendations-when-using-ssim-comparison
  comparisonMethod: 'ssim',
};

export class ImageSnapshotConfigurator {
  // TODO rename imageSnapshotThresholdConfig into thresholdConfig
  constructor(readonly imageSnapshotThresholdConfig: Map<string, ImageSnapshotThresholdConfig>) {}

  // TODO rename fileName into name
  getImageSnapshotConfig(fileName: string): jest.ImageSnapshotConfig {
    // minimal threshold to make tests for diagram renders pass on local
    // macOS: Expected image to match or be a close match to snapshot but was 0.00031509446166699817% different from snapshot
    let failureThreshold = 0.000004;

    const config = this.imageSnapshotThresholdConfig.get(fileName);
    if (config) {
      log(`Building dedicated image snapshot configuration for '${fileName}'`);
      const simplePlatformName = getSimplePlatformName();
      log(`Simple platform name: ${simplePlatformName}`);
      // we know here that we have property names related to the 'simple platform name' so ignoring TS complains.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      failureThreshold = config[simplePlatformName];
    }

    log(`ImageSnapshot - using failureThreshold: ${failureThreshold}`);
    return { ...defaultImageSnapshotConfig, failureThreshold: failureThreshold, failureThresholdType: 'percent' };
  }
}

export enum BpmnLoadMethod {
  QueryParam = 'query param',
  Url = 'url',
}

export interface TargetedPage {
  page: string; // TODO rename into 'name'
  queryParams?: string[];
}

export class BpmnDiagramPreparation {
  constructor(readonly bpmnLoadMethodConfig: Map<string, BpmnLoadMethod>, readonly targetedPage: TargetedPage) {}

  // fileName without extension
  prepareTestResourcesAndGetPageUrl(fileName: string): string {
    let url = `http://localhost:10002/${this.targetedPage.page}.html?fitOnLoad=true`;

    const bpmnLoadMethod = this.getBpmnLoadMethod(fileName);
    log(`Use '${bpmnLoadMethod}' as BPMN Load Method for '${fileName}'`);
    const relPathToBpmnFile = `../fixtures/bpmn/non-regression/${fileName}.bpmn`; // TODO path should be configurable
    switch (bpmnLoadMethod) {
      case BpmnLoadMethod.QueryParam:
        const bpmnContent = loadBpmnContentForUrlQueryParam(relPathToBpmnFile);
        url += `&bpmn=${bpmnContent}`;
        break;
      case BpmnLoadMethod.Url:
        copyFileSync(relPathToBpmnFile, `../../dist/static/diagrams/`, `${fileName}.bpmn`);
        url += `&url=./static/diagrams/${fileName}.bpmn`;
        break;
    }
    return url;
  }

  private getBpmnLoadMethod(fileName: string): BpmnLoadMethod {
    return this.bpmnLoadMethodConfig.get(fileName) || BpmnLoadMethod.QueryParam;
  }
}
