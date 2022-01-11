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
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import 'jest-playwright-preset';
import { join } from 'path';
import { Page } from 'playwright';
import { FitType } from '../../src/component/options';
import { clickOnButton, getBpmnDiagramNames } from './helpers/test-utils';
import { PageTester } from './helpers/visu/bpmn-page-utils';
import { ImageSnapshotConfigurator, ImageSnapshotThresholdConfig, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';

class FitImageSnapshotConfigurator extends ImageSnapshotConfigurator {
  override getConfig(param: {
    fileName: string;
    buildCustomDiffDir: (config: MatchImageSnapshotOptions, fitType: FitType, margin?: number) => string;
    fitType: FitType;
    margin?: number;
  }): MatchImageSnapshotOptions {
    const config = super.getConfig(param);
    config.customSnapshotsDir = FitImageSnapshotConfigurator.buildSnapshotFitDir(config.customSnapshotsDir, param.fitType, true, param.margin ? param.margin : 0);
    config.customDiffDir = param.buildCustomDiffDir(config, param.fitType, param.margin);
    return config;
  }

  private static buildSnapshotFitDir(parentDir: string, fitType: FitType, withMargin = false, margin?: number): string {
    const typeDir = join(parentDir, `type-${fitType}`);

    if (!withMargin) {
      return typeDir;
    }
    return join(typeDir, `margin-${margin == null || margin < 0 ? 0 : margin}`);
  }

  static buildOnLoadDiffDir(config: MatchImageSnapshotOptions, fitType: FitType, withMargin = false, margin?: number): string {
    const onLoadDir = join(config.customDiffDir, 'on-load');
    return FitImageSnapshotConfigurator.buildSnapshotFitDir(onLoadDir, fitType, withMargin, margin);
  }

  static buildAfterLoadDiffDir(config: MatchImageSnapshotOptions, afterLoadFitType: FitType, onLoadFitType: FitType): string {
    const afterLoadDir = join(config.customDiffDir, 'after-load');
    const snapshotFitTypeDir = FitImageSnapshotConfigurator.buildSnapshotFitDir(afterLoadDir, afterLoadFitType);
    return join(snapshotFitTypeDir, `on-load_type-${onLoadFitType}`);
  }
}

const bpmnDiagramNames = getBpmnDiagramNames('diagram');

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    const defaultFailureThreshold = 0.00006; // all OS 0.005379276499073438%
    super({ chromium: defaultFailureThreshold, firefox: defaultFailureThreshold, webkit: defaultFailureThreshold });
  }
  override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'with.outside.labels',
        {
          macos: 0.0022, // max 0.2180969169471081%
          windows: 0.0043, // max 0.4254571229063031%
        },
      ],
    ]);
  }

  override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'horizontal',
        {
          linux: 0.0003, // max 0.024774485137324387%
          macos: 0.0003, // max 0.024774485137324387%
          windows: 0.0003, // max 0.024774485137324387%
        },
      ],
      [
        'vertical',
        {
          linux: 0.00042, // max 0.041092716803170504%
          macos: 0.00042, // max 0.041092716803170504%
          windows: 0.00042, // max 0.041092716803170504%
        },
      ],
      [
        'with.outside.labels',
        {
          linux: 0.0094, // max 0.931092653624066%
          macos: 0.0109, // max 1.0826504942124782%
          // TODO possible rendering issue so high threshold value
          windows: 0.0375, // max 3.744378276494776%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'horizontal',
        {
          macos: 0.0005, // max is 0.040879927795189897%
        },
      ],
      [
        'vertical',
        {
          macos: 0.0006, // max is 0.05782432968098884%
        },
      ],
      [
        'with.outside.flows',
        {
          macos: 0.00062, // max is 0.06110704241570897%
        },
      ],
      [
        'with.outside.labels',
        {
          macos: 0.01, // max is 0.9821430167311629%
        },
      ],
    ]);
  }
}

describe('diagram navigation - fit', () => {
  const imageSnapshotConfigurator = new FitImageSnapshotConfigurator(new ImageSnapshotThresholds(), 'fit');

  const pageTester = new PageTester({ pageFileName: 'diagram-navigation', expectedPageTitle: 'BPMN Visualization - Diagram Navigation' }, <Page>page);

  const fitTypes: FitType[] = [FitType.None, FitType.HorizontalVertical, FitType.Horizontal, FitType.Vertical, FitType.Center];
  describe.each(fitTypes)('load options - fit %s', (onLoadFitType: FitType) => {
    describe.each(bpmnDiagramNames)('diagram %s', (bpmnDiagramName: string) => {
      it('load', async () => {
        await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, {
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
          buildCustomDiffDir: (config, fitType) => FitImageSnapshotConfigurator.buildOnLoadDiffDir(config, fitType),
        });
        expect(image).toMatchImageSnapshot(config);
      });

      it.each(fitTypes)(`load + fit %s`, async (afterLoadFitType: FitType) => {
        await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, {
          loadOptions: {
            fit: {
              type: onLoadFitType,
            },
          },
        });
        await clickOnButton(page, afterLoadFitType);

        const image = await page.screenshot({ fullPage: true });

        const config = imageSnapshotConfigurator.getConfig({
          fileName: bpmnDiagramName,
          fitType: afterLoadFitType,
          buildCustomDiffDir: (config, fitType) => FitImageSnapshotConfigurator.buildAfterLoadDiffDir(config, fitType, onLoadFitType),
        });
        expect(image).toMatchImageSnapshot(config);
      });

      if (
        (onLoadFitType === FitType.Center && bpmnDiagramName === 'with.outside.flows') ||
        (onLoadFitType === FitType.Horizontal && bpmnDiagramName === 'horizontal') ||
        (onLoadFitType === FitType.Vertical && bpmnDiagramName === 'vertical')
      ) {
        it.each([-100, 0, 20, 50, null])('load with margin %s', async (margin: number) => {
          await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, {
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
            buildCustomDiffDir: (config, fitType, margin) => FitImageSnapshotConfigurator.buildOnLoadDiffDir(config, fitType, true, margin),
          });
          expect(image).toMatchImageSnapshot(config);
        });
      }
    });
  });
});
