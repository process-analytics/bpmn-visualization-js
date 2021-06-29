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
import { join } from 'path';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import 'jest-playwright-preset';
import { FitType } from '../../src/component/options';
import { ImageSnapshotConfigurator, ImageSnapshotThresholdConfig, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';
import { PageTester } from './helpers/visu/bpmn-page-utils';
import { clickOnButton, getBpmnDiagramNames } from './helpers/test-utils';

class FitImageSnapshotConfigurator extends ImageSnapshotConfigurator {
  getConfig(param: {
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
  getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on Github Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'with.outside.labels',
        {
          linux: 0.0025, // 0.21788401867753882%
          windows: 0.0022, // 0.21570814230039703%
        },
      ],
    ]);
  }

  getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'horizontal',
        {
          // max is 0.013531740287897609%
          linux: 0.00014,
          macos: 0.00014,
          windows: 0.00014,
        },
      ],
      [
        'vertical',
        {
          // max is 0.027530972437983525%
          linux: 0.00028,
          macos: 0.00028,
          windows: 0.00028,
        },
      ],
      [
        'with.outside.labels',
        {
          // TODO possible rendering issue so high threshold value
          linux: 0.011, // 1.0906974728819852%
          macos: 0.009, // 0.888760314347159%
          // TODO possible rendering issue so high threshold value
          windows: 0.03801, // 3.800922249553762%
        },
      ],
    ]);
  }

  protected getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'horizontal',
        {
          macos: 0.00036, // max is 0.035199515671680004%
        },
      ],
      [
        'vertical',
        {
          macos: 0.00046, // max is 0.04522854257075215%
        },
      ],
      [
        'with.outside.flows',
        {
          macos: 0.00065, // max is 0.06479851023247772%
        },
      ],
      [
        'with.outside.labels',
        {
          macos: 0.0076, // max is 0.7546899046749656%
        },
      ],
    ]);
  }
}

describe('diagram navigation - fit', () => {
  const imageSnapshotThresholds = new ImageSnapshotThresholds();
  const imageSnapshotConfigurator = new FitImageSnapshotConfigurator(imageSnapshotThresholds.getThresholds(), 'fit', imageSnapshotThresholds.getDefault());

  const pageTester = new PageTester({ pageFileName: 'diagram-navigation', expectedPageTitle: 'BPMN Visualization - Diagram Navigation' });

  const fitTypes: FitType[] = [FitType.None, FitType.HorizontalVertical, FitType.Horizontal, FitType.Vertical, FitType.Center];
  describe.each(fitTypes)('load options - fit %s', (onLoadFitType: FitType) => {
    describe.each(bpmnDiagramNames)('diagram %s', (bpmnDiagramName: string) => {
      it('load', async () => {
        await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, { fit: { type: onLoadFitType } });

        const image = await page.screenshot({ fullPage: true });

        const config = imageSnapshotConfigurator.getConfig({
          fileName: bpmnDiagramName,
          fitType: onLoadFitType,
          buildCustomDiffDir: (config, fitType) => FitImageSnapshotConfigurator.buildOnLoadDiffDir(config, fitType),
        });
        expect(image).toMatchImageSnapshot(config);
      });

      it.each(fitTypes)(`load + fit %s`, async (afterLoadFitType: FitType) => {
        await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, { fit: { type: onLoadFitType } });
        await clickOnButton(afterLoadFitType);

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
          await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, { fit: { type: onLoadFitType, margin: margin } });

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
