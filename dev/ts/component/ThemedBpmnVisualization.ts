/**
 * Copyright 2022 Bonitasoft S.A.
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
import { BpmnVisualization, ShapeBpmnElementKind, ShapeUtil } from '../../../src/bpmn-visualization';
import { logStartup } from '../helper';

interface ThemeColors {
  defaultStrokeColor: string;
  defaultFontColor: string;
  defaultFillColor: string;
  endEventFillColor: string;
  endEventStrokeColor: string;
  startEventFillColor: string;
  startEventStrokeColor: string;
  taskFillColor: string;
  laneFillColor: string;
  poolFillColor: string;

  catchAndThrowEventStrokeColor?: string;
  flowColor?: string;
}

const themeColors = new Map<string, ThemeColors>([
  [
    'dark',
    {
      defaultStrokeColor: '#c0ddeb',
      defaultFontColor: 'white',
      defaultFillColor: '#334352',

      endEventFillColor: 'pink',
      endEventStrokeColor: 'FireBrick',
      startEventFillColor: 'DarkSeaGreen',
      startEventStrokeColor: 'DarkGreen',
      taskFillColor: '#5c8599',
      laneFillColor: '#2b3742',
      poolFillColor: '#232b33',
    },
  ],
  [
    'brown',
    {
      defaultStrokeColor: '#414666',
      defaultFillColor: '#ede7e1',
      defaultFontColor: '#414666',

      flowColor: '#666666',
      endEventFillColor: 'pink',
      endEventStrokeColor: 'FireBrick',
      startEventFillColor: 'DarkSeaGreen',
      startEventStrokeColor: 'DarkGreen',
      taskFillColor: '#dadce8',
      laneFillColor: '#d4c3b2',
      poolFillColor: '#d1b9a1',
      catchAndThrowEventStrokeColor: '#377f87',
    },
  ],
]);

// TODO use mxgraph constants?
// otherwise explain why
export class ThemedBpmnVisualization extends BpmnVisualization {
  configureTheme(theme: string): void {
    logStartup(`Configuring the '${theme}' BPMN theme`);

    const themeColor = themeColors.get(theme);
    if (!themeColor) {
      logStartup(`Unknown '${theme}' BPMN theme, skipping configuration`);
      return;
    }

    const styleSheet = this.graph.getStylesheet();

    // EVENTS
    ShapeUtil.eventKinds().forEach(kind => {
      let fillColor;
      let strokeColor;
      switch (kind) {
        case 'endEvent':
          fillColor = themeColor.endEventFillColor;
          strokeColor = themeColor.endEventStrokeColor;
          break;
        case 'startEvent':
          fillColor = themeColor.startEventFillColor;
          strokeColor = themeColor.startEventStrokeColor;
          break;
        case 'intermediateCatchEvent':
        case 'intermediateThrowEvent':
        case 'boundaryEvent':
          fillColor = themeColor.defaultFillColor;
          strokeColor = themeColor.catchAndThrowEventStrokeColor ?? themeColor.defaultStrokeColor;
          break;
        default:
          fillColor = themeColor.defaultFillColor;
          strokeColor = themeColor.defaultStrokeColor;
          break;
      }
      const style = styleSheet.styles[kind];
      style['fillColor'] = fillColor;
      style['strokeColor'] = strokeColor;
    });

    // TASKS
    ShapeUtil.taskKinds().forEach(kind => {
      const style = styleSheet.styles[kind];
      style['fillColor'] = themeColor.taskFillColor;
      style['fontColor'] = themeColor.defaultFontColor; // TODO extra config
    });

    // CALL ACTIVITIES
    const callActivityStyle = styleSheet.styles[ShapeBpmnElementKind.CALL_ACTIVITY];
    callActivityStyle['fillColor'] = themeColor.taskFillColor;
    callActivityStyle['fontColor'] = themeColor.defaultFontColor;

    // POOL
    const poolStyle = styleSheet.styles[ShapeBpmnElementKind.POOL];
    poolStyle['fillColor'] = themeColor.poolFillColor;
    poolStyle['swimlaneFillColor'] = themeColor.defaultFillColor;

    // LANE
    const laneStyle = styleSheet.styles[ShapeBpmnElementKind.LANE];
    laneStyle['fillColor'] = themeColor.laneFillColor;

    // DEFAULTS
    const defaultVertexStyle = styleSheet.getDefaultVertexStyle();
    defaultVertexStyle['fontColor'] = themeColor.defaultFontColor;
    defaultVertexStyle['fillColor'] = themeColor.defaultFillColor;
    defaultVertexStyle['strokeColor'] = themeColor.defaultStrokeColor;

    const defaultEdgeStyle = styleSheet.getDefaultEdgeStyle();
    defaultEdgeStyle['fontColor'] = themeColor.defaultFontColor;
    defaultEdgeStyle['fillColor'] = themeColor.defaultFillColor;
    defaultEdgeStyle['strokeColor'] = themeColor.flowColor ?? themeColor.defaultStrokeColor;
  }
}
