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
import { constants } from '@maxgraph/core';

import { BpmnVisualization, FlowKind, ShapeBpmnElementKind, ShapeUtil, StyleConfigurator, StyleDefault } from '../../../src/bpmn-visualization';
import { logStartup } from '../utils/internal-helpers';

interface Theme {
  defaultFillColor: string;
  defaultFontColor: string;
  defaultStrokeColor: string;

  flowColor?: string;

  catchAndThrowEventStrokeColor?: string;
  endEventFillColor: string;
  endEventStrokeColor: string;
  startEventFillColor: string;
  startEventStrokeColor: string;

  taskAndCallActivityFillColor: string;
  textAnnotationFillColor?: string;

  laneFillColor: string;
  poolFillColor: string;
}

const themes = new Map<string, Theme>([
  [
    'dark',
    {
      defaultFillColor: '#334352',
      defaultFontColor: 'white',
      defaultStrokeColor: '#c0ddeb',

      endEventFillColor: 'pink',
      endEventStrokeColor: 'FireBrick',
      startEventFillColor: 'DarkSeaGreen',
      startEventStrokeColor: 'DarkGreen',

      taskAndCallActivityFillColor: '#5c8599',

      laneFillColor: '#2b3742',
      poolFillColor: '#232b33',
    },
  ],
  [
    'brown',
    {
      defaultFillColor: '#ede7e1',
      defaultFontColor: '#414666',
      defaultStrokeColor: '#414666',

      flowColor: '#666666',

      catchAndThrowEventStrokeColor: '#377f87',
      endEventFillColor: 'pink',
      endEventStrokeColor: 'FireBrick',
      startEventFillColor: 'DarkSeaGreen',
      startEventStrokeColor: 'DarkGreen',

      taskAndCallActivityFillColor: '#dadce8',

      laneFillColor: '#d4c3b2',
      poolFillColor: '#d1b9a1',
    },
  ],
  [
    'light-blue',
    {
      defaultFillColor: '#ffffff',
      defaultFontColor: '#002395',
      defaultStrokeColor: '#002395',

      endEventFillColor: '#f9dadc',
      endEventStrokeColor: '#e20613',
      startEventFillColor: '#ffffff',
      startEventStrokeColor: '#05d99e',

      // use rgba to be able to set alpha
      taskAndCallActivityFillColor: 'rgba(132,158,253,0.1)',
      textAnnotationFillColor: 'rgba(237,237,245,0.5)',

      laneFillColor: '#edeef5',
      poolFillColor: '#dbefff',
    },
  ],
]);

export class ThemedBpmnVisualization extends BpmnVisualization {
  configureTheme(name: string): boolean {
    if (name == 'default') {
      new StyleConfigurator(this.graph).configureStyles();
      return true;
    }

    const theme = themes.get(name);
    if (!theme) {
      return false;
    }

    // we are not using mxgraph constants here to show another way to configure the style
    const styleSheet = this.graph.getStylesheet();

    // EVENT
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
      const style = styleSheet.styles.get(kind);
      style.fillColor = fillColor;
      style['strokeColor'] = strokeColor;
    });

    // TASK
    ShapeUtil.taskKinds().forEach(kind => {
      const style = styleSheet.styles.get(kind);
      style.fillColor = theme.taskAndCallActivityFillColor;
    });

    // CALL ACTIVITY
    const callActivityStyle = styleSheet.styles.get(ShapeBpmnElementKind.CALL_ACTIVITY);
    callActivityStyle.fillColor = theme.taskAndCallActivityFillColor;

    // TEXT ANNOTATION
    const textAnnotationStyle = styleSheet.styles.get(ShapeBpmnElementKind.TEXT_ANNOTATION);
    textAnnotationStyle.fillColor = theme.textAnnotationFillColor ?? StyleDefault.TEXT_ANNOTATION_FILL_COLOR;

    // POOL
    const poolStyle = styleSheet.styles.get(ShapeBpmnElementKind.POOL);
    poolStyle.fillColor = theme.poolFillColor;
    poolStyle.swimlaneFillColor = theme.defaultFillColor;

    // LANE
    const laneStyle = styleSheet.styles.get(ShapeBpmnElementKind.LANE);
    laneStyle.fillColor = theme.laneFillColor;

    // DEFAULTS
    const defaultVertexStyle = styleSheet.getDefaultVertexStyle();
    defaultVertexStyle['fontColor'] = theme.defaultFontColor;
    defaultVertexStyle.fillColor = theme.defaultFillColor;
    defaultVertexStyle['strokeColor'] = theme.defaultStrokeColor;

    const defaultEdgeStyle = styleSheet.getDefaultEdgeStyle();
    defaultEdgeStyle['fontColor'] = theme.defaultFontColor;
    defaultEdgeStyle.fillColor = theme.defaultFillColor;
    defaultEdgeStyle['strokeColor'] = theme.flowColor ?? theme.defaultStrokeColor;

    // theme configuration completed
    return true;
  }

  configureSequenceFlowColor(color: string): void {
    logStartup(`Use dedicated ${color} color for sequence flows`);

    const stylesheet = this.graph.getStylesheet();

    // directly access the 'styles' map to update values. Using stylesheet.getCellStyle returns a copy of the style
    const seqFlowStyle = stylesheet.styles.get(FlowKind.SEQUENCE_FLOW);
    seqFlowStyle.strokeColor = color;
    seqFlowStyle.fillColor = color;

    logStartup('Sequence flows style updated');
  }
}
