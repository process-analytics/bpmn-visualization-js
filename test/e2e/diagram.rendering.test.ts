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
import { BpmnLoadMethod, PageTester } from './helpers/visu/PageTester';

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

describe('no diagram visual regression', () => {
  const imageSnapshotConfigurator = new FitImageSnapshotConfigurator(
    new Map<string, ImageSnapshotThresholdConfig>([
      [
        'with.outside.labels',
        // minimal threshold to make test pass on Github Workflow
        // ubuntu: Expected image to match or be a close match to snapshot but was 0.21788401867753882% different from snapshot
        // macOS:
        // windows: Expected image to match or be a close match to snapshot but was 0.19527172107433044% different from snapshot
        {
          linux: 0.0025,
          macos: 0.000004,
          windows: 0.002,
        },
      ],
    ]),
    'fit',
    // minimal threshold to make test pass on Github Workflow
    // ubuntu: Expected image to match or be a close match to snapshot but was 0.005379276499073438% different from snapshot
    // macOS: Expected image to match or be a close match to snapshot but was 0.005379276499073438% different from snapshot
    // windows: Expected image to match or be a close match to snapshot but was 0.005379276499073438% different from snapshot
    0.00006,
  );

  const pageTester = new PageTester({ pageFileName: 'rendering-diagram', expectedPageTitle: 'BPMN Visualization - Diagram Rendering' }, 'diagram');

  const fitTypes: FitType[] = [FitType.None, FitType.HorizontalVertical, FitType.Horizontal, FitType.Vertical, FitType.Center];
  describe.each(fitTypes)('load options - fit %s', (onLoadFitType: FitType) => {
    describe.each(['horizontal', 'vertical', 'with.outside.flows', 'with.outside.labels'])('diagram %s', (fileName: string) => {
      it('load', async () => {
        await pageTester.loadBPMNDiagramInRefreshedPage(fileName, BpmnLoadMethod.QueryParam, { fit: { type: onLoadFitType } });

        const image = await page.screenshot({ fullPage: true });

        const config = imageSnapshotConfigurator.getConfig({
          fileName,
          fitType: onLoadFitType,
          buildCustomDiffDir: (config, fitType) => FitImageSnapshotConfigurator.buildOnLoadDiffDir(config, fitType),
        });
        expect(image).toMatchImageSnapshot(config);
      });

      it.each(fitTypes)(`load + fit %s`, async (afterLoadFitType: FitType) => {
        await pageTester.loadBPMNDiagramInRefreshedPage(fileName, BpmnLoadMethod.QueryParam, { fit: { type: onLoadFitType } });

        await page.click(`#${afterLoadFitType}`);
        // To unselect the button
        await page.mouse.click(0, 0);

        const image = await page.screenshot({ fullPage: true });

        const config = imageSnapshotConfigurator.getConfig({
          fileName,
          fitType: afterLoadFitType,
          buildCustomDiffDir: (config, fitType) => FitImageSnapshotConfigurator.buildAfterLoadDiffDir(config, fitType, onLoadFitType),
        });
        expect(image).toMatchImageSnapshot(config);
      });

      if (
        (onLoadFitType === FitType.Center && fileName === 'with.outside.flows') ||
        (onLoadFitType === FitType.Horizontal && fileName === 'horizontal') ||
        (onLoadFitType === FitType.Vertical && fileName === 'vertical')
      ) {
        it.each([-100, 0, 20, 50, null])('load with margin %s', async (margin: number) => {
          await pageTester.loadBPMNDiagramInRefreshedPage(fileName, BpmnLoadMethod.QueryParam, { fit: { type: onLoadFitType, margin: margin } });

          const image = await page.screenshot({ fullPage: true });

          const config = imageSnapshotConfigurator.getConfig({
            fileName,
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
