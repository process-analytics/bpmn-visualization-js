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

import type { mxShape } from 'mxgraph';

import { ShapeBpmnElementKind } from '../../../model/bpmn/internal';
import { mxCellRenderer, mxConstants, mxSvgCanvas2D } from '../initializer';
import {
  BusinessRuleTaskShape,
  CallActivityShape,
  ManualTaskShape,
  ReceiveTaskShape,
  ScriptTaskShape,
  SendTaskShape,
  ServiceTaskShape,
  SubProcessShape,
  TaskShape,
  UserTaskShape,
} from '../shape/activity-shapes';
import { BpmnConnector } from '../shape/edges';
import { EndEventShape, EventShape, IntermediateEventShape, ThrowIntermediateEventShape } from '../shape/event-shapes';
import { MessageFlowIconShape } from '../shape/flow-shapes';
import { ComplexGatewayShape, EventBasedGatewayShape, ExclusiveGatewayShape, InclusiveGatewayShape, ParallelGatewayShape } from '../shape/gateway-shapes';
import { TextAnnotationShape } from '../shape/text-annotation-shapes';
import { BpmnStyleIdentifier } from '../style';

const registerShapes = (): void => {
  // Inspired by the default shapes registration done in maxGraph
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- required by the signature of registerShape
  const shapesToRegister: [string, new (...arguments_: any) => mxShape][] = [
    // events
    [ShapeBpmnElementKind.EVENT_END, EndEventShape],
    [ShapeBpmnElementKind.EVENT_START, EventShape],
    [ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ThrowIntermediateEventShape],
    [ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, IntermediateEventShape],
    [ShapeBpmnElementKind.EVENT_BOUNDARY, IntermediateEventShape],
    // gateways
    [ShapeBpmnElementKind.GATEWAY_COMPLEX, ComplexGatewayShape],
    [ShapeBpmnElementKind.GATEWAY_EVENT_BASED, EventBasedGatewayShape],
    [ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, ExclusiveGatewayShape],
    [ShapeBpmnElementKind.GATEWAY_INCLUSIVE, InclusiveGatewayShape],
    [ShapeBpmnElementKind.GATEWAY_PARALLEL, ParallelGatewayShape],
    // activities
    [ShapeBpmnElementKind.SUB_PROCESS, SubProcessShape],
    [ShapeBpmnElementKind.CALL_ACTIVITY, CallActivityShape],
    // tasks
    [ShapeBpmnElementKind.TASK, TaskShape],
    [ShapeBpmnElementKind.TASK_SERVICE, ServiceTaskShape],
    [ShapeBpmnElementKind.TASK_USER, UserTaskShape],
    [ShapeBpmnElementKind.TASK_RECEIVE, ReceiveTaskShape],
    [ShapeBpmnElementKind.TASK_SEND, SendTaskShape],
    [ShapeBpmnElementKind.TASK_MANUAL, ManualTaskShape],
    [ShapeBpmnElementKind.TASK_SCRIPT, ScriptTaskShape],
    [ShapeBpmnElementKind.TASK_BUSINESS_RULE, BusinessRuleTaskShape],
    // artifacts
    [ShapeBpmnElementKind.TEXT_ANNOTATION, TextAnnotationShape],
    // shapes for flows
    [BpmnStyleIdentifier.EDGE, BpmnConnector],
    [BpmnStyleIdentifier.MESSAGE_FLOW_ICON, MessageFlowIconShape],
  ];
  for (const [shapeName, shapeClass] of shapesToRegister) {
    mxCellRenderer.registerShape(shapeName, shapeClass);
  }
};

/**
 * @internal
 */
export default class ShapeConfigurator {
  configureShapes(): void {
    this.initMxSvgCanvasPrototype();
    registerShapes();
  }

  private initMxSvgCanvasPrototype(): void {
    // getTextCss is only used when creating foreignObject for label, so there is no impact on svg text that we use for Overlays.
    // Analysis done for mxgraph@4.1.1, still apply to mxgraph@4.2.2
    mxSvgCanvas2D.prototype.getTextCss = function () {
      const s = this.state;
      const lh = mxConstants.ABSOLUTE_LINE_HEIGHT ? s.fontSize * mxConstants.LINE_HEIGHT + 'px' : mxConstants.LINE_HEIGHT * this.lineHeightCorrection;
      let css =
        'display: inline-block; font-size: ' +
        s.fontSize +
        'px; ' +
        'font-family: ' +
        s.fontFamily +
        '; color: ' +
        s.fontColor +
        '; line-height: ' +
        lh +
        // START Fix for issue #920 (https://github.com/process-analytics/bpmn-visualization-js/issues/920)
        // This cannot be generalized for all mxgraph use cases. For instance, in an editor mode, we should be able to edit the text by clicking on it.
        // Setting to 'none' prevent to capture click.
        '; pointer-events: none' +
        // (this.pointerEvents ? this.pointerEventsValue : 'none') +
        // END OF Fix for issue #920
        '; ';

      if ((s.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) {
        css += 'font-weight: bold; ';
      }
      if ((s.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC) {
        css += 'font-style: italic; ';
      }

      const deco = [];
      if ((s.fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE) {
        deco.push('underline');
      }
      if ((s.fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH) {
        deco.push('line-through');
      }
      if (deco.length > 0) {
        css += 'text-decoration: ' + deco.join(' ') + '; ';
      }

      return css;
    };
  }
}
