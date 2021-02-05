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
import { FitType } from '../../src/component/options';
import { join } from 'path';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { ImageSnapshotConfigurator, ImageSnapshotThresholdConfig } from './helpers/visu/ImageSnapshotConfigurator';
import { PageTester } from './helpers/visu/PageTester';
import { getBpmnDiagramNames, getSimplePlatformName, getTestedBrowserFamily } from './helpers/test-utils';

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

function getChromiumImageSnapshotThresholdConfig(): Map<string, ImageSnapshotThresholdConfig> {
  // if no dedicated information, set minimal threshold to make test pass on Github Workflow
  // linux threshold are set for Ubuntu
  return new Map<string, ImageSnapshotThresholdConfig>([
    [
      'with.outside.labels',
      {
        linux: 0.0025, // 0.21788401867753882%
        windows: 0.002, // 0.19527172107433044%
      },
    ],
  ]);
}

function getFirefoxImageSnapshotThresholdConfig(): Map<string, ImageSnapshotThresholdConfig> {
  return new Map<string, ImageSnapshotThresholdConfig>([
    [
      'horizontal',
      {
        linux: 0.00014, // 0.012393482656647414% OR 0.013531740287897609%
        macos: 0.00014, // 0.0016017951871782898% or 0.010560069871157207% or 0.012393482656647414% or 0.013531740287897609%
        windows: 0.00014, // 0.0016017951871782898% / 0.010560069871157207% / 0.012393482656647414% / 0.013531740287897609% /
      },
    ],
    [
      'vertical',
      {
        linux: 0.00028, // 0.007916464387214273% / 0.027530972437983525% (fit vertical margin 20)
        macos: 0.00028, // 0.003139035946830848% / 0.0050456132130283216% / 0.007916464387214273% / 0.027530972437983525%
        windows: 0.00028, // 0.003139035946830848% / 0.0050456132130283216% / 0.007916464387214273% / 0.027530972437983525%
      },
    ],
    [
      'with.outside.labels',
      {
        // TODO possible rendering issue so high threshold value
        linux: 0.011, // 1.0906974728819852% or 0.9832706118477974% (fit center)
        macos: 0.009, // 0.003856617605635382% or 0.004022454104279927% or 0.6845638774189866% (fit center) or 0.888760314347159%
        // TODO possible rendering issue so high threshold value
        windows: 0.03801, // 1.0555113297888274% / 1.988005296848172% / 3.726360119703187% / 3.800922249553762%
      },
    ],
  ]);
}

// TODO duplicate logic with what we have in bpmn.rendering.test.ts
function getImageSnapshotThresholdConfig(): Map<string, ImageSnapshotThresholdConfig> {
  switch (getTestedBrowserFamily()) {
    case 'chromium':
      return getChromiumImageSnapshotThresholdConfig();
    case 'firefox':
      return getFirefoxImageSnapshotThresholdConfig();
    default:
      return new Map<string, ImageSnapshotThresholdConfig>();
  }
}

// TODO duplicate logic with what we have in bpmn.rendering.test.ts
function getDefaultFailureThreshold(): number | undefined {
  const simplePlatformName = getSimplePlatformName();
  switch (getTestedBrowserFamily()) {
    case 'firefox':
      switch (simplePlatformName) {
        case 'linux':
          return 0.00006;
        case 'macos':
        case 'windows':
        default:
          return undefined;
      }
    case 'chromium':
      return 0.00006; // all OS 0.005379276499073438%
    default:
      return undefined;
  }
}

describe('no diagram visual regression', () => {
  const imageSnapshotConfigurator = new FitImageSnapshotConfigurator(getImageSnapshotThresholdConfig(), 'fit', getDefaultFailureThreshold());

  const pageTester = new PageTester({ pageFileName: 'rendering-diagram', expectedPageTitle: 'BPMN Visualization - Diagram Rendering' });

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

        await page.click(`#${afterLoadFitType}`);
        // To unselect the button
        await page.mouse.click(0, 0);

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
