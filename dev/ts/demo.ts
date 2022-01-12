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

import { BpmnElement, BpmnElementKind, FitOptions, FitType, GlobalOptions, LoadOptions, Overlay } from '../../src/bpmn-visualization';
import { log, logDownload, logStartup } from './helper';
import { DropFileUserInterface } from './component/DropFileUserInterface';
import { SvgExporter } from './component/SvgExporter';
import { downloadAsPng, downloadAsSvg } from './component/download';
import { ThemedBpmnVisualization } from './component/ThemedBpmnVisualization';

export * from './helper';

let bpmnVisualization: ThemedBpmnVisualization;
let loadOptions: LoadOptions = {};

export function updateLoadOptions(fitOptions: FitOptions): void {
  log('Updating load options', fitOptions);
  loadOptions.fit = fitOptions;
  log('Load options updated!', stringify(loadOptions));
}

export function getCurrentLoadOptions(): LoadOptions {
  return { ...loadOptions };
}

function stringify(value: unknown): string {
  return JSON.stringify(value, undefined, 2);
}

function loadBpmn(bpmn: string): void {
  log('Loading bpmn....');
  bpmnVisualization.load(bpmn, loadOptions);
  log('BPMN loaded with configuration', stringify(loadOptions));
  document.dispatchEvent(new CustomEvent('diagramLoaded'));
}

export function fit(fitOptions: FitOptions): void {
  log('Fitting....');
  bpmnVisualization.fit(fitOptions);
  log('Fit done with configuration', stringify(fitOptions));
}

export function getElementsByKinds(bpmnKinds: BpmnElementKind | BpmnElementKind[]): BpmnElement[] {
  return bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(bpmnKinds);
}

export function getElementsByIds(bpmnId: string | string[]): BpmnElement[] {
  return bpmnVisualization.bpmnElementsRegistry.getElementsByIds(bpmnId);
}

export function addCssClasses(bpmnElementId: string | string[], classNames: string | string[]): void {
  return bpmnVisualization.bpmnElementsRegistry.addCssClasses(bpmnElementId, classNames);
}

export function removeCssClasses(bpmnElementId: string | string[], classNames: string | string[]): void {
  return bpmnVisualization.bpmnElementsRegistry.removeCssClasses(bpmnElementId, classNames);
}

export function addOverlays(bpmnElementId: string, overlay: Overlay): void {
  return bpmnVisualization.bpmnElementsRegistry.addOverlays(bpmnElementId, [overlay]);
}

export function removeAllOverlays(bpmnElementId: string): void {
  return bpmnVisualization.bpmnElementsRegistry.removeAllOverlays(bpmnElementId);
}

// callback function for opening | dropping the file to be loaded
function readAndLoadFile(f: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    loadBpmn(reader.result as string);
  };
  reader.readAsText(f);
}

// TODO: make File Open Button a self contained component
/**
 * <b>IMPORTANT</b>: be sure to have call the `startBpmnVisualization` function prior calling this function as it relies on resources that must be initialized first.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export function handleFileSelect(evt: any): void {
  const f = evt.target.files[0];
  readAndLoadFile(f);
}

function fetchBpmnContent(url: string): Promise<string> {
  log(`Fetching BPMN content from url ${url}`);
  return fetch(url).then(response => {
    if (!response.ok) {
      throw Error(String(response.status));
    }
    return response.text();
  });
}

function loadBpmnFromUrl(url: string, statusFetchKoNotifier: (errorMsg: string) => void): void {
  fetchBpmnContent(url)
    .catch(error => {
      const errorMessage = `Unable to fetch ${url}. ${error}`;
      statusFetchKoNotifier(errorMessage);
      throw new Error(errorMessage);
    })
    .then(responseBody => {
      log('BPMN content fetched');
      return responseBody;
    })
    .then(bpmn => {
      loadBpmn(bpmn);
      log(`Bpmn loaded from url ${url}`);
    });
}

export interface BpmnVisualizationDemoConfiguration {
  statusFetchKoNotifier?: (errorMsg: string) => void;
  globalOptions: GlobalOptions;
  loadOptions?: LoadOptions;
}

function defaultStatusFetchKoNotifier(errorMsg: string): void {
  console.error(errorMsg);
}

function getFitOptionsFromParameters(config: BpmnVisualizationDemoConfiguration, parameters: URLSearchParams): FitOptions {
  const fitOptions: FitOptions = config.loadOptions?.fit || {};
  const parameterFitType: string = parameters.get('fitTypeOnLoad');
  if (parameterFitType) {
    // As the parameter is a string, and the load/fit APIs accept only enum to avoid error, we need to convert it
    fitOptions.type = <FitType>parameterFitType;
  }
  const parameterFitMargin = parameters.get('fitMargin');
  if (parameterFitMargin) {
    fitOptions.margin = Number(parameterFitMargin);
  }
  return fitOptions;
}

function configureStyleFromParameters(parameters: URLSearchParams): void {
  const useBpmnContainerAlternativeColor = parameters.get('style.container.alternative.background.color');
  if (useBpmnContainerAlternativeColor == 'true') {
    const color = 'yellow';
    logStartup('Use alternative color for the bpmn container background, color', color);

    const bpmnContainer = bpmnVisualization.graph.container;
    bpmnContainer.style.backgroundColor = color;

    logStartup('Bpmn container style updated');
  }

  const theme = parameters.get('style.theme');
  if (theme) {
    bpmnVisualization.configureTheme(theme);
  }

  const useSequenceFlowColorsLight = parameters.get('style.seqFlow.light.colors');
  if (useSequenceFlowColorsLight == 'true') {
    bpmnVisualization.configureSequenceFlowColor('#E9E9E9');
  }
}

export function startBpmnVisualization(config: BpmnVisualizationDemoConfiguration): void {
  const log = logStartup;
  const container = config.globalOptions.container;

  log(`Initializing BpmnVisualization with container '${container}'...`);
  bpmnVisualization = new ThemedBpmnVisualization(config.globalOptions);
  log('Initialization completed');
  new DropFileUserInterface(window, 'drop-container', container as string, readAndLoadFile);
  log('Drag&Drop support initialized');

  const parameters = new URLSearchParams(window.location.search);

  log('Configuring Load Options');
  loadOptions = config.loadOptions || {};
  loadOptions.fit = getFitOptionsFromParameters(config, parameters);

  configureStyleFromParameters(parameters);

  log("Checking if an 'url to fetch BPMN content' is provided as query parameter");
  const urlParameterValue = parameters.get('url');
  if (urlParameterValue) {
    const url = decodeURIComponent(urlParameterValue);
    const statusFetchKoNotifier = config.statusFetchKoNotifier || defaultStatusFetchKoNotifier;
    loadBpmnFromUrl(url, statusFetchKoNotifier);
    return;
  }
  log("No 'url to fetch BPMN content' provided");
}

export function downloadSvg(): void {
  logDownload('Trigger SVG Download');
  downloadAsSvg(new SvgExporter(bpmnVisualization.graph).exportSvg());
}

export function downloadPng(): void {
  logDownload('Trigger PNG Download');
  downloadAsPng(new SvgExporter(bpmnVisualization.graph).exportSvgForPng());
}
