/*
Copyright 2021 Bonitasoft S.A.

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

// Tests the SVG export of the demo (dev/ts/component/SvgExporter.ts), not the code of the library.
// The library has no SVG export: the demo provides one for its 'Download SVG' and 'Download PNG' buttons.

import type { BpmnVisualization, OverlayPosition } from '@lib/bpmn-visualization';

import { SvgExporter } from '../../dev/ts/component/SvgExporter';

import { initializeBpmnVisualizationWithContainerId } from './helpers/bpmn-visualization-initialization';

import { readFileSync } from '@test/shared/file-helper';

interface OverlayToAdd {
  bpmnElementId: string;
  position?: OverlayPosition;
}

interface ExportedOverlay {
  label: string;
  x: number;
  y: number;
  fontSize: string;
}

const exportOverlays = (bpmnVisualization: BpmnVisualization, viewScale: number, overlayLabels: string[]): ExportedOverlay[] => {
  bpmnVisualization.graph.view.setScale(viewScale);
  const svg = new SvgExporter(bpmnVisualization.graph).exportSvg();
  const svgDocument = new DOMParser().parseFromString(svg.slice(svg.indexOf('<svg')), 'image/svg+xml');

  return overlayLabels.map(label => {
    const textElement = [...svgDocument.querySelectorAll('text')].find(element => element.textContent === label);
    expect(textElement).toBeDefined();
    return {
      label,
      x: Number(textElement.getAttribute('x')),
      y: Number(textElement.getAttribute('y')),
      fontSize: textElement.parentElement.getAttribute('font-size'),
    };
  });
};

const onElements = (...bpmnElementIds: string[]): OverlayToAdd[] => bpmnElementIds.map(bpmnElementId => ({ bpmnElementId }));

// Overlay bounds are rounded at the current view scale, so allow a 1 pixel difference.
const positionTolerance = 1;
const isWithinTolerance = (actual: number, expected: number): boolean => Math.abs(actual - expected) <= positionTolerance;

const expectSameOverlaysAsWithoutZoom = (actualOverlays: ExportedOverlay[], overlaysWithoutZoom: ExportedOverlay[]): void => {
  // Replace the overlays within tolerance by the expected ones, so a failure only shows the misplaced overlays
  const actualOverlaysWithinTolerance = actualOverlays.map((actualOverlay, index) => {
    const expectedOverlay = overlaysWithoutZoom[index];
    return isWithinTolerance(actualOverlay.x, expectedOverlay.x) && isWithinTolerance(actualOverlay.y, expectedOverlay.y)
      ? { ...actualOverlay, x: expectedOverlay.x, y: expectedOverlay.y }
      : actualOverlay;
  });
  expect(actualOverlaysWithinTolerance).toEqual(overlaysWithoutZoom);
};

describe('SVG export of overlays', () => {
  const bpmnVisualization = initializeBpmnVisualizationWithContainerId('bpmn-container-svg-export-overlays');

  beforeEach(() => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/bpmn-in-color/elements.colors.01.no.label.bpmn'));
  });

  const addOverlays = (overlaysToAdd: OverlayToAdd[]): string[] =>
    overlaysToAdd.map(({ bpmnElementId, position = 'top-left' }) => {
      const label = `overlay-${bpmnElementId}-${position}`;
      bpmnVisualization.bpmnElementsRegistry.addOverlays(bpmnElementId, { label, position });
      return label;
    });

  describe.each([0.5, 2])('view scale %s', (viewScale: number) => {
    it.each`
      elementKinds                                    | overlaysToAdd
      ${'tasks'}                                      | ${onElements('Activity_008m408', 'Activity_1g8vjsd', 'Activity_1dixmdj')}
      ${'expanded sub-process and its child element'} | ${onElements('Activity_008m408', 'Activity_1gsd1n0', 'Activity_0uiaaqk')}
      ${'call activities'}                            | ${onElements('Activity_008m408', 'Activity_18r3wxy', 'Activity_1qaspqe')}
      ${'pools'}                                      | ${onElements('Participant_1jbxvu4', 'Participant_1rt5d4d', 'Participant_1s3ajy0')}
      ${'lanes and their child element'}              | ${onElements('Activity_008m408', 'Lane_1ehh86f', 'Lane_1vz1eqp', 'Activity_1dixmdj')}
      ${'edges'}                                      | ${[{ bpmnElementId: 'Flow_00l9sfs', position: 'start' }, { bpmnElementId: 'Flow_1yr9txu', position: 'middle' }, { bpmnElementId: 'Flow_15rgpot', position: 'end' }]}
      ${'a single element'}                           | ${[{ bpmnElementId: 'Activity_008m408', position: 'top-left' }, { bpmnElementId: 'Activity_008m408', position: 'bottom-right' }, { bpmnElementId: 'Activity_008m408', position: 'middle-left' }]}
    `('overlays on $elementKinds are exported at the same place as without zoom', ({ overlaysToAdd }: { overlaysToAdd: OverlayToAdd[] }) => {
      const overlayLabels = addOverlays(overlaysToAdd);
      const overlaysWithoutZoom = exportOverlays(bpmnVisualization, 1, overlayLabels);

      expectSameOverlaysAsWithoutZoom(exportOverlays(bpmnVisualization, viewScale, overlayLabels), overlaysWithoutZoom);
    });
  });
});
