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
import { BpmnVisualization, FlowKind, ShapeBpmnElementKind, ShapeUtil } from '../../../src/bpmn-visualization';
import { logStartup } from '../helper';
import { mxgraph } from '../../../src/component/mxgraph/initializer';

interface Theme {
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

const themes = new Map<string, Theme>([
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

export class ThemedBpmnVisualization extends BpmnVisualization {
  configureTheme(name: string): void {
    // we are not using mxgraph constants here to show another way to configure the style
    logStartup(`Configuring the '${name}' BPMN theme`);

    const theme = themes.get(name);
    if (!theme) {
      logStartup(`Unknown '${name}' BPMN theme, skipping configuration`);
      return;
    }

    const styleSheet = this.graph.getStylesheet();

    // EVENTS
    ShapeUtil.eventKinds().forEach(kind => {
      let fillColor;
      let strokeColor;
      switch (kind) {
        case 'endEvent':
          fillColor = theme.endEventFillColor;
          strokeColor = theme.endEventStrokeColor;
          break;
        case 'startEvent':
          fillColor = theme.startEventFillColor;
          strokeColor = theme.startEventStrokeColor;
          break;
        case 'intermediateCatchEvent':
        case 'intermediateThrowEvent':
        case 'boundaryEvent':
          fillColor = theme.defaultFillColor;
          strokeColor = theme.catchAndThrowEventStrokeColor ?? theme.defaultStrokeColor;
          break;
        default:
          fillColor = theme.defaultFillColor;
          strokeColor = theme.defaultStrokeColor;
          break;
      }
      const style = styleSheet.styles[kind];
      style['fillColor'] = fillColor;
      style['strokeColor'] = strokeColor;
    });

    // TASKS
    ShapeUtil.taskKinds().forEach(kind => {
      const style = styleSheet.styles[kind];
      style['fillColor'] = theme.taskFillColor;
      style['fontColor'] = theme.defaultFontColor; // TODO extra config
    });

    // CALL ACTIVITIES
    const callActivityStyle = styleSheet.styles[ShapeBpmnElementKind.CALL_ACTIVITY];
    callActivityStyle['fillColor'] = theme.taskFillColor;
    callActivityStyle['fontColor'] = theme.defaultFontColor;

    // POOL
    const poolStyle = styleSheet.styles[ShapeBpmnElementKind.POOL];
    poolStyle['fillColor'] = theme.poolFillColor;
    poolStyle['swimlaneFillColor'] = theme.defaultFillColor;

    // LANE
    const laneStyle = styleSheet.styles[ShapeBpmnElementKind.LANE];
    laneStyle['fillColor'] = theme.laneFillColor;

    // DEFAULTS
    const defaultVertexStyle = styleSheet.getDefaultVertexStyle();
    defaultVertexStyle['fontColor'] = theme.defaultFontColor;
    defaultVertexStyle['fillColor'] = theme.defaultFillColor;
    defaultVertexStyle['strokeColor'] = theme.defaultStrokeColor;

    const defaultEdgeStyle = styleSheet.getDefaultEdgeStyle();
    defaultEdgeStyle['fontColor'] = theme.defaultFontColor;
    defaultEdgeStyle['fillColor'] = theme.defaultFillColor;
    defaultEdgeStyle['strokeColor'] = theme.flowColor ?? theme.defaultStrokeColor;
  }

  configureSequenceFlowColor(color: string): void {
    logStartup(`Use dedicated ${color} color for sequence flows`);

    const stylesheet = this.graph.getStylesheet();

    // directly access the 'styles' map to update values. Using stylesheet.getCellStyle returns a copy of the style
    const seqFlowStyle = stylesheet.styles[FlowKind.SEQUENCE_FLOW];
    seqFlowStyle[mxgraph.mxConstants.STYLE_STROKECOLOR] = color;
    seqFlowStyle[mxgraph.mxConstants.STYLE_FILLCOLOR] = color;

    logStartup('Sequence flows style updated');
  }
}
