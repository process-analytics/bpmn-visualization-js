/*
Copyright 2022 Bonitasoft S.A.

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

import { initializeBpmnVisualizationWithHtmlElement } from './helpers/bpmn-visualization-initialization';

import { mxRectangle } from '@lib/component/mxgraph/initializer';
import { FitType, ZoomType } from '@lib/component/options';
import { readFileSync } from '@test/shared/file-helper';

const bpmnVisualization = initializeBpmnVisualizationWithHtmlElement('bpmn-container', true);

type ContainerDimensions = Partial<Record<'clientWidth' | 'clientHeight' | 'offsetWidth' | 'offsetHeight', number>>;

// jsdom always reports 0 for the container dimensions, so force them to assert the scale/translation computed by 'fit'.
const setContainerDimensions = (container: HTMLElement, dimensions: ContainerDimensions): void => {
  for (const [name, value] of Object.entries(dimensions)) {
    Object.defineProperty(container, name, { value, configurable: true });
  }
};

describe('diagram navigation', () => {
  beforeEach(() => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
  });

  describe('Fit', () => {
    // The rendered graph bounds are not predictable, so mock them to assert the exact scale and translation computed by
    // 'fit'. Combined with 'setContainerDimensions', this reproduces the approach of the maxGraph 'FitPlugin' tests:
    // configure the container dimensions, then verify the calls to the underlying mxGraphView methods.
    const view = bpmnVisualization.graph.view;
    let getGraphBoundsSpy: jest.SpyInstance | undefined;

    const configureFitScenario = (
      dimensions: ContainerDimensions,
      bounds: { x: number; y: number; width: number; height: number },
    ): { scaleAndTranslateSpy: jest.SpyInstance; setScaleSpy: jest.SpyInstance } => {
      setContainerDimensions(bpmnVisualization.graph.container, dimensions);
      // Mock the bounds getter (not 'setGraphBounds', which the 'zoomActual' call in 'fit' would revalidate and clobber)
      // to make the scale/translation deterministic and decoupled from the parse/render pipeline. The full computation
      // on real bounds is covered by the e2e visual tests.
      getGraphBoundsSpy = jest.spyOn(view, 'getGraphBounds').mockReturnValue(new mxRectangle(bounds.x, bounds.y, bounds.width, bounds.height));
      return {
        scaleAndTranslateSpy: jest.spyOn(view, 'scaleAndTranslate').mockClear(),
        setScaleSpy: jest.spyOn(view, 'setScale').mockClear(),
      };
    };

    afterEach(() => {
      // Restore only the bounds mock to avoid leaking it into other tests sharing the same instance.
      getGraphBoundsSpy?.mockRestore();
      getGraphBoundsSpy = undefined;
    });

    describe('No scaling', () => {
      // 'null' is loosely equal to 'undefined' in the implementation, so both trigger the early return.
      it.each([undefined, null, FitType.None])('Fit with %s does not scale the diagram', (type: FitType | null | undefined) => {
        const scaleAndTranslateSpy = jest.spyOn(view, 'scaleAndTranslate').mockClear();
        const setScaleSpy = jest.spyOn(view, 'setScale').mockClear();

        bpmnVisualization.navigation.fit({ type: type as FitType });

        expect(scaleAndTranslateSpy).not.toHaveBeenCalled();
        expect(setScaleSpy).not.toHaveBeenCalled();
        expect(view.scale).toBe(1);
      });

      it('Fit without options does not scale the diagram', () => {
        const scaleAndTranslateSpy = jest.spyOn(view, 'scaleAndTranslate').mockClear();
        const setScaleSpy = jest.spyOn(view, 'setScale').mockClear();

        bpmnVisualization.navigation.fit();

        expect(scaleAndTranslateSpy).not.toHaveBeenCalled();
        expect(setScaleSpy).not.toHaveBeenCalled();
        expect(view.scale).toBe(1);
      });
    });

    describe('Center', () => {
      // Center uses the container 'client' dimensions and computes the scale and translation itself.
      it('Center the diagram', () => {
        const { scaleAndTranslateSpy, setScaleSpy } = configureFitScenario({ clientWidth: 200, clientHeight: 200 }, { x: 0, y: 0, width: 100, height: 100 });

        bpmnVisualization.navigation.fit({ type: FitType.Center });

        expect(scaleAndTranslateSpy).toHaveBeenCalledExactlyOnceWith(2, 0, 0);
        expect(setScaleSpy).not.toHaveBeenCalled();
        expect(view.scale).toBe(2);
      });

      it('Limit the scale to the maximum value (3)', () => {
        const { scaleAndTranslateSpy } = configureFitScenario({ clientWidth: 2000, clientHeight: 2000 }, { x: 0, y: 0, width: 100, height: 100 });

        bpmnVisualization.navigation.fit({ type: FitType.Center });

        expect(scaleAndTranslateSpy).toHaveBeenCalledExactlyOnceWith(3, expect.closeTo(283.33), expect.closeTo(283.33));
        expect(view.scale).toBe(3);
      });

      it('Take the margin into account', () => {
        const { scaleAndTranslateSpy } = configureFitScenario({ clientWidth: 200, clientHeight: 200 }, { x: 0, y: 0, width: 100, height: 100 });

        bpmnVisualization.navigation.fit({ type: FitType.Center, margin: 30 });

        expect(scaleAndTranslateSpy).toHaveBeenCalledExactlyOnceWith(1.7, expect.closeTo(8.82), expect.closeTo(8.82));
        expect(view.scale).toBe(1.7);
      });

      it('Ignore a negative margin (treated as 0)', () => {
        const { scaleAndTranslateSpy } = configureFitScenario({ clientWidth: 200, clientHeight: 200 }, { x: 0, y: 0, width: 100, height: 100 });

        bpmnVisualization.navigation.fit({ type: FitType.Center, margin: -50 });

        expect(scaleAndTranslateSpy).toHaveBeenCalledExactlyOnceWith(2, 0, 0);
        expect(view.scale).toBe(2);
      });
    });

    describe('Delegating to the mxGraph fit', () => {
      // These types use the container 'offset' dimensions and delegate the computation to mxGraph 'fit'.
      // An unknown type behaves like 'HorizontalVertical' (no dimension ignored).
      // A positive margin lowers the scale and shifts the translation by 'margin / 2'; it still shifts the translation
      // even when the scale is capped to the maximum value (8). A negative margin is treated as 0 (see the 'Center' tests).
      it.each`
        type                          | dimensions                                 | bounds                                         | margin       | expectedScale | expectedTranslateX | expectedTranslateY
        ${FitType.HorizontalVertical} | ${{ offsetWidth: 480, offsetHeight: 820 }} | ${{ x: 70, y: -60, width: 100, height: 100 }}  | ${undefined} | ${4.78}       | ${-70}             | ${60}
        ${FitType.Horizontal}         | ${{ offsetWidth: 860, offsetHeight: 860 }} | ${{ x: 70, y: -60, width: 150, height: 300 }}  | ${undefined} | ${5.72}       | ${-70}             | ${60}
        ${FitType.Vertical}           | ${{ offsetWidth: 860, offsetHeight: 860 }} | ${{ x: 70, y: -60, width: 1000, height: 100 }} | ${undefined} | ${8}          | ${-70}             | ${60}
        ${'invalid'}                  | ${{ offsetWidth: 480, offsetHeight: 820 }} | ${{ x: 70, y: -60, width: 100, height: 100 }}  | ${undefined} | ${4.78}       | ${-70}             | ${60}
        ${FitType.HorizontalVertical} | ${{ offsetWidth: 480, offsetHeight: 820 }} | ${{ x: 70, y: -60, width: 100, height: 100 }}  | ${30}        | ${4.48}       | ${-55}             | ${75}
        ${FitType.Horizontal}         | ${{ offsetWidth: 860, offsetHeight: 860 }} | ${{ x: 70, y: -60, width: 150, height: 300 }}  | ${30}        | ${5.52}       | ${-55}             | ${75}
        ${FitType.Vertical}           | ${{ offsetWidth: 860, offsetHeight: 860 }} | ${{ x: 70, y: -60, width: 1000, height: 100 }} | ${30}        | ${8}          | ${-55}             | ${75}
        ${FitType.Vertical}           | ${{ offsetWidth: 860, offsetHeight: 860 }} | ${{ x: 70, y: -60, width: 1000, height: 100 }} | ${100}       | ${7.58}       | ${-20}             | ${110}
      `(
        'Fit with $type (margin: $margin)',
        ({
          type,
          dimensions,
          bounds,
          margin,
          expectedScale,
          expectedTranslateX,
          expectedTranslateY,
        }: {
          type: FitType;
          dimensions: ContainerDimensions;
          bounds: { x: number; y: number; width: number; height: number };
          margin: number | undefined;
          expectedScale: number;
          expectedTranslateX: number;
          expectedTranslateY: number;
        }) => {
          const { scaleAndTranslateSpy, setScaleSpy } = configureFitScenario(dimensions, bounds);

          bpmnVisualization.navigation.fit({ type, margin });

          expect(scaleAndTranslateSpy).toHaveBeenCalledExactlyOnceWith(expectedScale, expectedTranslateX, expectedTranslateY);
          expect(setScaleSpy).not.toHaveBeenCalled();
          expect(view.scale).toBe(expectedScale);
        },
      );
    });
  });

  describe('Zoom', () => {
    it.each`
      zoomType
      ${undefined}
      ${null}
      ${ZoomType.In}
      ${ZoomType.Out}
      ${'invalid'}
    `('Zoom with $zoomType', ({ zoomType }: { zoomType: ZoomType }) => {
      // ensure no error
      bpmnVisualization.navigation.zoom(zoomType);
    });
  });
});
