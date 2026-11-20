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

import type { BpmnVisualization } from '@lib/bpmn-visualization';

import { SvgExporter } from '../../dev/ts/component/SvgExporter';

import { initializeBpmnVisualizationWithContainerId } from './helpers/bpmn-visualization-initialization';

import { readFileSync } from '@test/shared/file-helper';

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

// The SVG export translates the whole diagram by an amount depending on the view scale, so compare the overlay positions
// relatively to the first overlay.
const toPositionsRelativeToFirstOverlay = (overlays: ExportedOverlay[]): { label: string; dx: number; dy: number }[] =>
  overlays.map(overlay => ({ label: overlay.label, dx: overlay.x - overlays[0].x, dy: overlay.y - overlays[0].y }));

// Overlay bounds are rounded at the current view scale, so allow a 1 pixel difference.
const positionTolerance = 1;
const isWithinTolerance = (actual: number, expected: number): boolean => Math.abs(actual - expected) <= positionTolerance;

const expectSameOverlaysAsWithoutZoom = (actualOverlays: ExportedOverlay[], overlaysWithoutZoom: ExportedOverlay[]): void => {
  expect(actualOverlays.map(overlay => overlay.fontSize)).toEqual(overlaysWithoutZoom.map(overlay => overlay.fontSize));

  const expectedPositions = toPositionsRelativeToFirstOverlay(overlaysWithoutZoom);
  const actualPositionsWithinTolerance = toPositionsRelativeToFirstOverlay(actualOverlays).map((actualPosition, index) => {
    const expectedPosition = expectedPositions[index];
    return isWithinTolerance(actualPosition.dx, expectedPosition.dx) && isWithinTolerance(actualPosition.dy, expectedPosition.dy) ? expectedPosition : actualPosition;
  });
  expect(actualPositionsWithinTolerance).toEqual(expectedPositions);
};

describe('SVG export of overlays', () => {
  const bpmnVisualization = initializeBpmnVisualizationWithContainerId('bpmn-container-svg-export-overlays');

  beforeEach(() => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/bpmn-in-color/elements.colors.01.no.label.bpmn'));
  });

  const addOverlays = (bpmnElementIds: string[]): string[] =>
    bpmnElementIds.map(bpmnElementId => {
      const label = `overlay-${bpmnElementId}`;
      bpmnVisualization.bpmnElementsRegistry.addOverlays(bpmnElementId, { label, position: 'top-left' });
      return label;
    });

  it.each([0.5, 2])('all overlays on tasks are exported at the same place as without zoom, view scale %s', (viewScale: number) => {
    const overlayLabels = addOverlays(['Activity_008m408', 'Activity_1g8vjsd', 'Activity_1dixmdj']);
    const overlaysWithoutZoom = exportOverlays(bpmnVisualization, 1, overlayLabels);

    expectSameOverlaysAsWithoutZoom(exportOverlays(bpmnVisualization, viewScale, overlayLabels), overlaysWithoutZoom);
  });
});
