/*
Copyright 2020 Bonitasoft S.A.

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

import { configureControlsPanel, configureMousePointer, documentReady, fit, FitType, startBpmnVisualization, zoom, ZoomType } from '../development-bundle-index';

function configureFitAndZoomButtons(): void {
  Object.values(FitType).forEach(fitType => {
    document.getElementById(fitType).onclick = () => fit({ type: fitType });
  });
  Object.values(ZoomType).forEach(zoomType => {
    document.getElementById(`zoom-${zoomType}`).onclick = () => zoom(zoomType);
  });
}

function configureZoomThrottleInput(parameters: URLSearchParams): HTMLInputElement {
  const zoomThrottleElement = document.getElementById('zoom-throttle') as HTMLInputElement;
  if (parameters.get('zoomThrottle')) {
    zoomThrottleElement.value = parameters.get('zoomThrottle');
  }
  return zoomThrottleElement;
}

function configureZoomDebounceInput(parameters: URLSearchParams): HTMLInputElement {
  const zoomDebounceElement = document.getElementById('zoom-debounce') as HTMLInputElement;
  if (parameters.get('zoomDebounce')) {
    zoomDebounceElement.value = parameters.get('zoomDebounce');
  }
  return zoomDebounceElement;
}

function start(): void {
  const parameters = new URLSearchParams(window.location.search);
  configureMousePointer(parameters);
  configureControlsPanel(parameters);

  const zoomThrottleElement = configureZoomThrottleInput(parameters);
  const zoomDebounceElement = configureZoomDebounceInput(parameters);

  startBpmnVisualization({
    globalOptions: {
      container: 'bpmn-container',
      navigation: {
        enabled: true,
        zoom: {
          throttleDelay: Number(zoomThrottleElement.value),
          debounceDelay: Number(zoomDebounceElement.value),
        },
      },
    },
  });

  configureFitAndZoomButtons();
}

documentReady(start);
