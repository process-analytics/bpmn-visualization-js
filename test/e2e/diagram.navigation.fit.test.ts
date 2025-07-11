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

import type { ImageSnapshotThresholdConfig } from './helpers/visu/image-snapshot-config';
import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';

import path from 'node:path';

import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds, withCustomOutputDirectory } from './helpers/visu/image-snapshot-config';

import 'jest-playwright-preset';

import { FitType } from '@lib/component/options';
import { AvailableTestPages, PageTester } from '@test/shared/visu/bpmn-page-utils';
import { getBpmnDiagramNames } from '@test/shared/visu/test-utils';

class FitImageSnapshotConfigurator extends ImageSnapshotConfigurator {
  override getConfig(parameter: {
    fileName: string;
    buildCustomDiffDir: (config: MatchImageSnapshotOptions, fitType: FitType, margin?: number) => string;
    fitType: FitType;
    margin?: number;
  }): MatchImageSnapshotOptions {
    return withCustomOutputDirectory(
      {
        ...super.getConfig(parameter),
        customSnapshotsDir: FitImageSnapshotConfigurator.buildSnapshotFitDirectory(super.getConfig(parameter).customSnapshotsDir, parameter.fitType, true, parameter.margin ?? 0),
      },
      parameter.buildCustomDiffDir(super.getConfig(parameter), parameter.fitType, parameter.margin),
    );
  }

  private static buildSnapshotFitDirectory(parentDirectory: string, fitType: FitType, withMargin = false, margin?: number): string {
    const rootFitDirectory = path.join(parentDirectory, `type-${fitType}`);

    if (!withMargin) {
      return rootFitDirectory;
    }
    return path.join(rootFitDirectory, `margin-${margin == null || margin < 0 ? 0 : margin}`);
  }

  static buildOnLoadDiffDirectory(config: MatchImageSnapshotOptions, fitType: FitType, withMargin = false, margin?: number): string {
    const onLoadDirectory = path.join(config.customDiffDir, 'on-load');
    return FitImageSnapshotConfigurator.buildSnapshotFitDirectory(onLoadDirectory, fitType, withMargin, margin);
  }

  static buildAfterLoadDiffDirectory(config: MatchImageSnapshotOptions, afterLoadFitType: FitType, onLoadFitType: FitType): string {
    const afterLoadDirectory = path.join(config.customDiffDir, 'after-load');
    const snapshotFitDirectory = FitImageSnapshotConfigurator.buildSnapshotFitDirectory(afterLoadDirectory, afterLoadFitType);
    return path.join(snapshotFitDirectory, `on-load_type-${onLoadFitType}`);
  }
}

const diagramSubfolder = 'fit';
const bpmnDiagramNames = getBpmnDiagramNames(diagramSubfolder);

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: 0.018 / 100, firefox: 0.042 / 100, webkit: 0.058 / 100 });
  }
  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'horizontal',
        {
          macos: 0.026, // max 0.025094962866600845%
        },
      ],
      [
        'vertical',
        {
          macos: 0.026, // max 0.025094962866600845%
        },
      ],
      [
        'with.outside.flows',
        {
          macos: 0.04 / 100, // max 0.033407969331455956%%
        },
      ],
      [
        'with.outside.labels',
        {
          macos: 0.27 / 100, // max 0.26141697307554557%
          windows: 0.39 / 100, // max 0.38276450047973753%
        },
      ],
    ]);
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'with.outside.labels',
        {
          macos: 0.26 / 100, // max 0.2503825544848626%
          // TODO possible rendering issue so high threshold value
          windows: 4.4 / 100, // max 4.039381490979144%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'with.outside.labels',
        {
          macos: 0.39 / 100, // max 0.38104004012843307%
        },
      ],
    ]);
  }
}

describe('diagram navigation - fit', () => {
  const imageSnapshotConfigurator = new FitImageSnapshotConfigurator(new ImageSnapshotThresholds(), 'fit');

  const pageTester = new PageTester({ targetedPage: AvailableTestPages.DIAGRAM_NAVIGATION, diagramSubfolder }, page);

  const fitTypes: FitType[] = [FitType.None, FitType.HorizontalVertical, FitType.Horizontal, FitType.Vertical, FitType.Center];
  describe.each(fitTypes)('load options - fit %s', (onLoadFitType: FitType) => {
    describe.each(bpmnDiagramNames)('diagram %s', (bpmnDiagramName: string) => {
      it('load', async () => {
        await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName, {
          loadOptions: {
            fit: {
              type: onLoadFitType,
            },
          },
        });

        const image = await page.screenshot({ fullPage: true });

        const config = imageSnapshotConfigurator.getConfig({
          fileName: bpmnDiagramName,
          fitType: onLoadFitType,
          buildCustomDiffDir: (config, fitType) => FitImageSnapshotConfigurator.buildOnLoadDiffDirectory(config, fitType),
        });
        expect(image).toMatchImageSnapshot(config);
      });

      it.each(fitTypes)(`load + fit %s`, async (afterLoadFitType: FitType) => {
        await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName, {
          loadOptions: {
            fit: {
              type: onLoadFitType,
            },
          },
        });
        await pageTester.clickOnButton(afterLoadFitType);

        const image = await page.screenshot({ fullPage: true });

        const config = imageSnapshotConfigurator.getConfig({
          fileName: bpmnDiagramName,
          fitType: afterLoadFitType,
          buildCustomDiffDir: (config, fitType) => FitImageSnapshotConfigurator.buildAfterLoadDiffDirectory(config, fitType, onLoadFitType),
        });
        expect(image).toMatchImageSnapshot(config);
      });

      if (
        (onLoadFitType === FitType.Center && bpmnDiagramName === 'with.outside.flows') ||
        (onLoadFitType === FitType.Horizontal && bpmnDiagramName === 'horizontal') ||
        (onLoadFitType === FitType.Vertical && bpmnDiagramName === 'vertical')
      ) {
        it.each([-100, 0, 20, 50, null])('load with margin %s', async (margin: number) => {
          await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName, {
            loadOptions: {
              fit: {
                type: onLoadFitType,
                margin: margin,
              },
            },
          });

          const image = await page.screenshot({ fullPage: true });

          const config = imageSnapshotConfigurator.getConfig({
            fileName: bpmnDiagramName,
            fitType: onLoadFitType,
            margin,
            buildCustomDiffDir: (config, fitType, margin) => FitImageSnapshotConfigurator.buildOnLoadDiffDirectory(config, fitType, true, margin),
          });
          expect(image).toMatchImageSnapshot(config);
        });
      }
    });
  });
});
