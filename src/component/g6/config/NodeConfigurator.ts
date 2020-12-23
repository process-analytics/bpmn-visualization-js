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
import { ShapeBpmnElementKind } from '../../../model/bpmn/internal/shape';
import G6 from '@antv/g6';
import { IShape } from '@antv/g-canvas/lib/interfaces';
import { StyleDefault } from '../../mxgraph/StyleUtils';
import { ModelConfig } from '@antv/g6/lib/types';
import { Group as GGroup } from '@antv/g-canvas';

const ICON_MAP = {
  a: 'https://gw.alipayobjects.com/mdn/rms_8fd2eb/afts/img/A*0HC-SawWYUoAAAAAAAAAAABkARQnAQ',
  b: 'https://gw.alipayobjects.com/mdn/rms_8fd2eb/afts/img/A*sxK0RJ1UhNkAAAAAAAAAAABkARQnAQ',
};

function drawTask(): (cfg?: ModelConfig, group?: GGroup) => IShape {
  return (cfg, group): IShape => {
    const color = cfg.error ? '#F4664A' : '#30BF78';
    const r = 2;
    const shape = group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: 200,
        height: 60,
        stroke: color,
        radius: r,
      },
      name: 'main-box',
      draggable: true,
    });

    group.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: 200,
        height: 20,
        fill: color,
        radius: [r, r, 0, 0],
      },
      name: 'title-box',
      draggable: true,
    });

    // left icon
    group.addShape('image', {
      attrs: {
        x: 4,
        y: 2,
        height: 16,
        width: 16,
        cursor: 'pointer',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        img: ICON_MAP[cfg.nodeType || 'a'],
      },
      name: 'node-icon',
    });

    // title text
    group.addShape('text', {
      attrs: {
        textBaseline: 'top',
        y: 2,
        x: 24,
        lineHeight: 20,
        text: cfg.title,
        fill: '#fff',
      },
      name: 'title',
    });

    if (cfg.nodeLevel > 0) {
      group.addShape('marker', {
        attrs: {
          x: 184,
          y: 30,
          r: 6,
          cursor: 'pointer',
          symbol: cfg.collapse ? G6.Marker.expand : G6.Marker.collapse,
          stroke: '#666',
          lineWidth: 1,
        },
        name: 'collapse-icon',
      });
    }

    // The content list
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cfg.markers?.forEach((item, index) => {
      // name text
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          y: 25,
          x: 24 + index * 60,
          lineHeight: 20,
          text: item.title,
          fill: 'rgba(0,0,0, 0.4)',
        },
        name: `index-title-${index}`,
      });

      // value text
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          y: 42,
          x: 24 + index * 60,
          lineHeight: 20,
          text: item.value,
          fill: '#595959',
        },
        name: `index-title-${index}`,
      });
    });
    return shape;
  };
}

export default class NodeConfigurator {
  public configureNodes(): void {
    this.registerNodes();
  }

  private registerNodes(): void {
    /*    G6.registerNode(
      'nodeName',
      {
        options: {
          style: {},
          stateStyles: {
            hover: {},
            selected: {},
          },
        },
        /!**
         * Draw the node with label
         * @param  {Object} cfg The configurations of the node
         * @param  {G.Group} group Graphics group, the container of the shapes of the node
         * @return {G.Shape} The keyShape of the node. It can be obtained by node.get('keyShape')
         *!/
        draw(cfg, group) {},
        /!**
         * The extra operations after drawing the node. There is no operation in this function by default
         * @param  {Object} cfg The configurations of the node
         * @param  {G.Group} group Graphics group, the container of the shapes of the node
         *!/
        afterDraw(cfg, group) {},
        /!**
         * Update the node and its label
         * @override
         * @param  {Object} cfg The configurations of the node
         * @param  {Node} node The node item
         *!/
        update(cfg, node) {},
        /!**
         * The operations after updating the node. It is combined with afterDraw generally
         * @override
         * @param  {Object} cfg The configurations of the node
         * @param  {Node} node The node item
         *!/
        afterUpdate(cfg, node) {},
        /!**
         * Should be rewritten when you want to response the state changes by animation.
         * Responsing the state changes by styles can be configured, which is described in the document Middle-Behavior & Event-State
         * @param  {String} name The name of the state
         * @param  {Object} value The value of the state
         * @param  {Node} node The node item
         *!/
        setState(name, value, node) {},
        /!**
         * Get the anchorPoints(link points for related edges)
         * @param  {Object} cfg The configurations of the node
         * @return {Array|null} The array of anchorPoints(link points for related edges). Null means there are no anchorPoints
         *!/
        getAnchorPoints(cfg) {},
      },
      extendedNodeName,
    );*/

    // events
    G6.registerNode(
      ShapeBpmnElementKind.EVENT_END,
      {
        drawShape: drawTask(),
      },
      'single-node',
    );

    // tasks
    G6.registerNode(
      ShapeBpmnElementKind.TASK,
      {
        drawShape: drawTask(),
      },
      'single-node',
    );

    /* mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_END, EndEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_START, StartEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ThrowIntermediateEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, CatchIntermediateEventShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.EVENT_BOUNDARY, BoundaryEventShape);
    // gateways
    mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_EVENT_BASED, EventBasedGatewayShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, ExclusiveGatewayShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_INCLUSIVE, InclusiveGatewayShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.GATEWAY_PARALLEL, ParallelGatewayShape);
    // activities
    mxCellRenderer.registerShape(ShapeBpmnElementKind.SUB_PROCESS, SubProcessShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.CALL_ACTIVITY, CallActivityShape);
    // tasks
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK, TaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SERVICE, ServiceTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_USER, UserTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_RECEIVE, ReceiveTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SEND, SendTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_MANUAL, ManualTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_SCRIPT, ScriptTaskShape);
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TASK_BUSINESS_RULE, BusinessRuleTaskShape);
    // artifacts
    mxCellRenderer.registerShape(ShapeBpmnElementKind.TEXT_ANNOTATION, TextAnnotationShape);

    // shapes for flows
    mxCellRenderer.registerShape(StyleIdentifier.BPMN_STYLE_MESSAGE_FLOW_ICON, MessageFlowIconShape);*/
  }
}
