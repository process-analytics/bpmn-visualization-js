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
import { BpmnDiagramPreparation, BpmnLoadMethod, ImageSnapshotConfigurator, ImageSnapshotThresholdConfig, PageTester } from './helpers/visu-utils';
import { FitType, LoadOptions } from '../../src/component/options';
import { join, dirname } from 'path';

function getCustomSnapshotIdentifier(fitType: FitType, fileName: string, margin = 0): string {
  return `no-diagram-visual-regression-fit-type-${fitType}-margin-${margin == null || margin < 0 ? 0 : margin}-diagram-${fileName}`;
}

function getLoadDiffDir(): string {
  const snapshotsDir = join(dirname(expect.getState().testPath), '__image_snapshots__');
  const diffDir = join(snapshotsDir, '__diff_output__');
  return join(diffDir, 'load');
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function initializePage(loadOptions: LoadOptions, fileName: string): Promise<any> {
  const bpmnDiagramPreparation = new BpmnDiagramPreparation(new Map<string, BpmnLoadMethod>([]), { name: 'rendering-diagram' }, 'diagram', loadOptions);
  const pageTester = new PageTester(bpmnDiagramPreparation, 'bpmn-container', 'BPMN Visualization - Diagram Rendering');
  await pageTester.expectBpmnDiagramToBeDisplayed(fileName);
}

const loadDiffDir = getLoadDiffDir();

describe('no diagram visual regression', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(
    new Map<string, ImageSnapshotThresholdConfig>([
      [
        'with_outside_labels',
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
  );

  const fitTypes: FitType[] = [FitType.None, FitType.HorizontalVertical, FitType.Horizontal, FitType.Vertical, FitType.Center];
  describe.each(fitTypes)('load options - fit %s', (loadFitType: FitType) => {
    const loadFitDiffDir = join(loadDiffDir, `fit-type-${loadFitType}`);
    const fitDiffDir = join(loadFitDiffDir, 'fit');

    describe.each(['horizontal', 'vertical', 'with_outside_flows', 'with_outside_labels'])('diagram %s', (fileName: string) => {
      it('load', async () => {
        await initializePage({ fit: { type: loadFitType } }, fileName);

        const image = await page.screenshot({ fullPage: true });

        // minimal threshold to make test pass on Github Workflow
        // ubuntu: Expected image to match or be a close match to snapshot but was 0.005379276499073438% different from snapshot
        // macOS: Expected image to match or be a close match to snapshot but was 0.005379276499073438% different from snapshot
        // windows: Expected image to match or be a close match to snapshot but was 0.005379276499073438% different from snapshot
        const config = imageSnapshotConfigurator.getConfig(fileName, 0.00006);
        expect(image).toMatchImageSnapshot({
          ...config,
          customSnapshotIdentifier: getCustomSnapshotIdentifier(loadFitType, fileName),
          customDiffDir: loadFitDiffDir,
        });
      });

      it.each(fitTypes)(`load + fit %s`, async (fitType: FitType) => {
        await initializePage({ fit: { type: loadFitType } }, fileName);

        await page.click(`#${fitType}`);
        // To unselect the button
        await page.mouse.click(0, 0);

        const image = await page.screenshot({ fullPage: true });

        // minimal threshold to make test pass on Github Workflow
        // ubuntu: Expected image to match or be a close match to snapshot but was 0.005379276499073438% different from snapshot
        // macos: Expected image to match or be a close match to snapshot but was 0.005379276499073438% different from snapshot
        // windows: Expected image to match or be a close match to snapshot but was 0.005379276499073438% different from snapshot
        const config = imageSnapshotConfigurator.getConfig(fileName, 0.00006);
        expect(image).toMatchImageSnapshot({
          ...config,
          customSnapshotIdentifier: getCustomSnapshotIdentifier(fitType, fileName),
          customDiffDir: join(fitDiffDir, `fit-type-${fitType}`),
        });
      });

      if (
        (loadFitType === FitType.Center && fileName === 'with_outside_flows') ||
        (loadFitType === FitType.Horizontal && fileName === 'horizontal') ||
        (loadFitType === FitType.Vertical && fileName === 'vertical')
      ) {
        it.each([-100, 0, 20, 50, null])('load with margin %s', async (margin: number) => {
          await initializePage({ fit: { type: loadFitType, margin: margin } }, fileName);

          const image = await page.screenshot({ fullPage: true });

          const config = imageSnapshotConfigurator.getConfig(fileName);
          expect(image).toMatchImageSnapshot({
            ...config,
            customSnapshotIdentifier: getCustomSnapshotIdentifier(loadFitType, fileName, margin),
            customDiffDir: join(loadDiffDir, `fit-type-${loadFitType}-margin-${margin}`),
          });
        });
      }
    });
  });
});
