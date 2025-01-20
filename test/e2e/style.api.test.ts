/*
Copyright 2023 Bonitasoft S.A.

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

import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';

import { AvailableTestPages, PageTester } from '@test/shared/visu/bpmn-page-utils';

class StyleImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    // chromium max for all OS: 0.04661214552819093%
    // firefox max for all OS: 0.055281082087199604%
    // webkit max: 0.07085182506020306%
    super({ chromium: 0.05 / 100, firefox: 0.06 / 100, webkit: 0.08 / 100 });
  }

  // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'font.color.opacity',
        {
          linux: 0.13 / 100, // 0.12152253986267292%
          windows: 0.12 / 100, // 0.11000117996341485%
        },
      ],
      [
        'fill.color.gradient',
        {
          linux: 0.11 / 100, // 0.10872082550010823%
          macos: 0.11 / 100, // 0.10872082550010823%
          windows: 0.11 / 100, // 0.10872082550010823%
        },
      ],
      [
        'fill.color.string',
        {
          macos: 0.11 / 100, // 0.10486874434754156%
        },
      ],
      [
        'fill.color.opacity.group',
        {
          macos: 0.13 / 100, // 0.12861950774821773%
        },
      ],
      [
        'stroke.color',
        {
          macos: 0.09 / 100, // 0.08553874565668806%
        },
      ],
    ]);
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'font.color.opacity',
        {
          linux: 0.7 / 100, // 0.6666424226140943%
          macos: 0.4 / 100, // 0.3735342397314878%
          windows: 0.7 / 100, // 0.6683147876539342%
        },
      ],
      [
        'fill.color.string',
        {
          linux: 0.09 / 100, // 0.08216175057789155%
          macos: 0.09 / 100, // 0.08216175057789155%
          windows: 0.09 / 100, // 0.08216175057789155%
        },
      ],
      [
        'fill.color.gradient',
        {
          linux: 0.16 / 100, // 0.15385866971137085%
          macos: 0.16 / 100, // 0.15385866971137085%
          windows: 0.16 / 100, // 0.15385866971137085%
        },
      ],
      [
        'fill.color.opacity.group',
        {
          linux: 0.12 / 100, // 0.11206537171222217%
          macos: 0.12 / 100, // 0.11206537171222217%
          windows: 0.12 / 100, // 0.11206537171222217%
        },
      ],
      [
        'stroke.color',
        {
          linux: 0.08 / 100, // 0.0780124780372815%
          macos: 0.08 / 100, // 0.0780124780372815%
          windows: 0.08 / 100, // 0.0780124780372815%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'font.color.opacity',
        {
          macos: 0.2 / 100, // 0.18895676780704695%
        },
      ],
      [
        'fill.color.opacity.group',
        {
          macos: 0.09 / 100, // 0.08353290699089076%
        },
      ],
    ]);
  }
}

describe('Style API', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new StyleImageSnapshotThresholds(), 'style');

  const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder: 'theme' }, page);

  it(`Update 'stroke.color'`, async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram('01.most.bpmn.types.without.label', {
      styleOptions: {
        styleUpdate: { stroke: { color: 'chartreuse' } },
      },
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig('stroke.color');
    expect(image).toMatchImageSnapshot(config);
  });

  it(`Update 'fill.color' as string`, async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram('01.most.bpmn.types.without.label', {
      styleOptions: {
        styleUpdate: { fill: { color: 'chartreuse' } },
      },
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig('fill.color.string');
    expect(image).toMatchImageSnapshot(config);
  });

  it(`Update 'fill.color' as gradient`, async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram('01.most.bpmn.types.without.label', {
      styleOptions: {
        styleUpdate: {
          fill: {
            color: {
              startColor: 'pink',
              endColor: 'lime',
              direction: 'top-to-bottom',
            },
          },
        },
      },
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig('fill.color.gradient');
    expect(image).toMatchImageSnapshot(config);
  });

  it(`Update 'color' and 'opacity' of 'fill for group'`, async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram('01.most.bpmn.types.without.label', {
      styleOptions: {
        styleUpdate: {
          fill: { color: 'chartreuse', opacity: 15 },
        },
      },
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig('fill.color.opacity.group');
    expect(image).toMatchImageSnapshot(config);
  });

  it(`Update 'color' and 'opacity' of 'fill' for task`, async () => {
    const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder: 'bpmn-rendering' }, page);
    await pageTester.gotoPageAndLoadBpmnDiagram('tasks', {
      styleOptions: {
        styleUpdate: { fill: { color: 'chartreuse', opacity: 15 } },
      },
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig('fill.color.opacity.tasks');
    expect(image).toMatchImageSnapshot(config);
  });

  it(`Update 'color' and 'opacity' of 'font'`, async () => {
    const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder: 'bpmn-rendering' }, page);
    await pageTester.gotoPageAndLoadBpmnDiagram('labels.04.fonts', {
      styleOptions: {
        styleUpdate: {
          font: { color: 'chartreuse', opacity: 40 },
        },
      },
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig('font.color.opacity');
    expect(image).toMatchImageSnapshot(config);
  });
});
