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
import { expect, PlaywrightTestArgs, test } from '@playwright/test';
import { FitType } from '../../src/component/options';
import { clickOnButton, getBpmnDiagramNames } from './helpers/test-utils';
import { PageTester } from './helpers/visu/bpmn-page-utils';

function buildFitSnapshotPath(parentDir: string, fitType: FitType, withMargin = false, margin?: number): string[] {
  const snapshotPath = [parentDir, `type-${fitType}`];

  if (withMargin) {
    snapshotPath.push(`margin-${margin == null || margin < 0 ? 0 : margin}`);
  }
  return snapshotPath;
}

function buildOnLoadDiffPath(bpmnDiagramName: string, fitType: FitType, withMargin = false, margin?: number): string[] {
  const snapshotPath = buildFitSnapshotPath('on-load', fitType, withMargin, margin);
  snapshotPath.push(`${bpmnDiagramName}.png`);
  return snapshotPath;
}

function buildAfterLoadDiffPath(bpmnDiagramName: string, afterLoadFitType: FitType, onLoadFitType: FitType): string[] {
  const snapshotPath = buildFitSnapshotPath('after-load', afterLoadFitType);
  snapshotPath.push(`on-load_type-${onLoadFitType}`);
  snapshotPath.push(`${bpmnDiagramName}.png`);
  return snapshotPath;
}

const bpmnDiagramNames = getBpmnDiagramNames('diagram');

test.describe('diagram navigation - fit', () => {
  let pageTester: PageTester;
  test.beforeEach(async ({ page }: PlaywrightTestArgs) => {
    pageTester = new PageTester({ pageFileName: 'diagram-navigation', expectedPageTitle: 'BPMN Visualization - Diagram Navigation' }, page);
  });

  const fitTypes: FitType[] = [FitType.None, FitType.HorizontalVertical, FitType.Horizontal, FitType.Vertical, FitType.Center];
  for (const onLoadFitType of fitTypes) {
    test.describe(`load options - fit ${onLoadFitType}`, () => {
      for (const bpmnDiagramName of bpmnDiagramNames) {
        test.describe(`diagram ${bpmnDiagramName}`, () => {
          test('load', async ({ page }: PlaywrightTestArgs) => {
            await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, {
              loadOptions: {
                fit: {
                  type: onLoadFitType,
                },
              },
            });

            const image = await page.screenshot({ fullPage: true });
            await expect(image).toMatchSnapshot(buildOnLoadDiffPath(bpmnDiagramName, onLoadFitType));
          });

          for (const afterLoadFitType of fitTypes) {
            test(`load + fit ${afterLoadFitType}`, async ({ page }: PlaywrightTestArgs) => {
              await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, {
                loadOptions: {
                  fit: {
                    type: onLoadFitType,
                  },
                },
              });
              await clickOnButton(page, afterLoadFitType);

              const image = await page.screenshot({ fullPage: true });
              await expect(image).toMatchSnapshot(buildAfterLoadDiffPath(bpmnDiagramName, afterLoadFitType, onLoadFitType));
            });
          }

          if (
            (onLoadFitType === FitType.Center && bpmnDiagramName === 'with.outside.flows') ||
            (onLoadFitType === FitType.Horizontal && bpmnDiagramName === 'horizontal') ||
            (onLoadFitType === FitType.Vertical && bpmnDiagramName === 'vertical')
          ) {
            for (const margin of [-100, 0, 20, 50, null]) {
              test(`load with margin ${margin}`, async ({ page }: PlaywrightTestArgs) => {
                await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, {
                  loadOptions: {
                    fit: {
                      type: onLoadFitType,
                      margin: margin,
                    },
                  },
                });

                const image = await page.screenshot({ fullPage: true });
                await expect(image).toMatchSnapshot(buildOnLoadDiffPath(bpmnDiagramName, onLoadFitType, true, margin));
              });
            }
          }
        });
      }
    });
  }
});
