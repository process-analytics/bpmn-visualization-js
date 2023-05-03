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

import { buildDefinitions } from '../../../helpers/JsonBuilder';
import { parseJsonAndExpectOnlyEdgesAndFlowNodes, parseJsonAndExpectOnlyFlowNodes } from '../../../helpers/JsonTestUtils';
import type { ExpectedShape } from '../../../helpers/bpmn-model-expect';
import { verifyShape } from '../../../helpers/bpmn-model-expect';

import type { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import { ShapeBpmnElementKind, ShapeBpmnEventBasedGatewayKind, ShapeUtil } from '../../../../../src/model/bpmn/internal';
import type { ShapeBpmnEventBasedGateway } from '../../../../../src/model/bpmn/internal/shape/ShapeBpmnElement';

describe.each([
  ['task', ShapeBpmnElementKind.TASK],
  ['serviceTask', ShapeBpmnElementKind.TASK_SERVICE],
  ['userTask', ShapeBpmnElementKind.TASK_USER],
  ['receiveTask', ShapeBpmnElementKind.TASK_RECEIVE],
  ['sendTask', ShapeBpmnElementKind.TASK_SEND],
  ['manualTask', ShapeBpmnElementKind.TASK_MANUAL],
  ['businessRuleTask', ShapeBpmnElementKind.TASK_BUSINESS_RULE],
  ['scriptTask', ShapeBpmnElementKind.TASK_SCRIPT],
  ['exclusiveGateway', ShapeBpmnElementKind.GATEWAY_EXCLUSIVE],
  ['inclusiveGateway', ShapeBpmnElementKind.GATEWAY_INCLUSIVE],
  ['parallelGateway', ShapeBpmnElementKind.GATEWAY_PARALLEL],
  ['eventBasedGateway', ShapeBpmnElementKind.GATEWAY_EVENT_BASED],
  ['complexGateway', ShapeBpmnElementKind.GATEWAY_COMPLEX],
])('parse bpmn as json for %s', (bpmnKind: string, expectedShapeBpmnElementKind: ShapeBpmnElementKind) => {
  const processWithFlowNodeAsObject = {} as TProcess;
  processWithFlowNodeAsObject[`${bpmnKind}`] = {
    id: `${bpmnKind}_id_0`,
    name: `${bpmnKind} name`,
  };

  it.each([
    ['object', processWithFlowNodeAsObject],
    ['array', [processWithFlowNodeAsObject]],
  ])(`should convert as Shape, when a ${bpmnKind} is an attribute (as object) of 'process' (as %s)`, (title: string, processJson: TProcess) => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: processJson,
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: {
              id: `shape_${bpmnKind}_id_0`,
              bpmnElement: `${bpmnKind}_id_0`,
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}_id_0`,
      bpmnElementId: `${bpmnKind}_id_0`,
      bpmnElementName: `${bpmnKind} name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: { x: 362, y: 232, width: 36, height: 45 },
    });
  });

  it(`should convert as Shape, when a ${bpmnKind} (with/without name) is an attribute (as array) of 'process'`, () => {
    const json = {
      definitions: {
        targetNamespace: '',
        process: {},
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: [
              {
                id: `shape_${bpmnKind}_id_0`,
                bpmnElement: `${bpmnKind}_id_0`,
                Bounds: { x: 362, y: 232, width: 36, height: 45 },
              },
              {
                id: `shape_${bpmnKind}_id_1`,
                bpmnElement: `${bpmnKind}_id_1`,
                Bounds: { x: 365, y: 235, width: 35, height: 46 },
              },
            ],
          },
        },
      },
    };
    (json.definitions.process as TProcess)[`${bpmnKind}`] = [
      {
        id: `${bpmnKind}_id_0`,
        name: `${bpmnKind} name`,
      },
      {
        id: `${bpmnKind}_id_1`,
      },
    ];

    const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

    verifyShape(model.flowNodes[0], {
      shapeId: `shape_${bpmnKind}_id_0`,
      bpmnElementId: `${bpmnKind}_id_0`,
      bpmnElementName: `${bpmnKind} name`,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    });
    verifyShape(model.flowNodes[1], {
      shapeId: `shape_${bpmnKind}_id_1`,
      bpmnElementId: `${bpmnKind}_id_1`,
      bpmnElementName: undefined,
      bpmnElementKind: expectedShapeBpmnElementKind,
      bounds: {
        x: 365,
        y: 235,
        width: 35,
        height: 46,
      },
    });
  });

  if (expectedShapeBpmnElementKind === ShapeBpmnElementKind.TASK_RECEIVE) {
    it(`should convert as Shape, when a ${bpmnKind} (with/without instantiate) is an attribute (as array) of 'process'`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {},
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: `shape_${bpmnKind}_id_0`,
                  bpmnElement: `${bpmnKind}_id_0`,
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
                {
                  id: `shape_${bpmnKind}_id_1`,
                  bpmnElement: `${bpmnKind}_id_1`,
                  Bounds: { x: 365, y: 235, width: 35, height: 46 },
                },
              ],
            },
          },
        },
      };
      (json.definitions.process as TProcess)[`${bpmnKind}`] = [
        {
          id: `${bpmnKind}_id_0`,
        },
        {
          id: `${bpmnKind}_id_1`,
          instantiate: true,
        },
      ];

      const model = parseJsonAndExpectOnlyFlowNodes(json, 2);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_${bpmnKind}_id_0`,
        bpmnElementId: `${bpmnKind}_id_0`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
      });
      expect(model.flowNodes[0].bpmnElement.instantiate).toBeFalsy();

      verifyShape(model.flowNodes[1], {
        shapeId: `shape_${bpmnKind}_id_1`,
        bpmnElementId: `${bpmnKind}_id_1`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 365,
          y: 235,
          width: 35,
          height: 46,
        },
      });
      expect(model.flowNodes[1].bpmnElement.instantiate).toBeTruthy();
    });
  }

  if (expectedShapeBpmnElementKind === ShapeBpmnElementKind.GATEWAY_EVENT_BASED) {
    it(`should convert as Shape, when a ${bpmnKind} (with/without instantiate) is an attribute (as array) of 'process'`, () => {
      const json = {
        definitions: {
          targetNamespace: '',
          process: {},
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: `shape_${bpmnKind}_id_1`,
                  bpmnElement: `${bpmnKind}_id_1`,
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
                {
                  id: `shape_${bpmnKind}_id_2`,
                  bpmnElement: `${bpmnKind}_id_2`,
                  Bounds: { x: 462, y: 232, width: 36, height: 45 },
                },
                {
                  id: `shape_${bpmnKind}_id_3`,
                  bpmnElement: `${bpmnKind}_id_3`,
                  Bounds: { x: 562, y: 232, width: 36, height: 45 },
                },
                {
                  id: `shape_${bpmnKind}_id_11`,
                  bpmnElement: `${bpmnKind}_id_11`,
                  Bounds: { x: 365, y: 235, width: 35, height: 46 },
                },
                {
                  id: `shape_${bpmnKind}_id_12`,
                  bpmnElement: `${bpmnKind}_id_12`,
                  Bounds: { x: 365, y: 335, width: 34, height: 47 },
                },
                {
                  id: `shape_${bpmnKind}_id_13`,
                  bpmnElement: `${bpmnKind}_id_13`,
                  Bounds: { x: 375, y: 245, width: 34, height: 47 },
                },
              ],
            },
          },
        },
      };
      (json.definitions.process as TProcess)[`${bpmnKind}`] = [
        {
          id: `${bpmnKind}_id_1`,
        },
        {
          id: `${bpmnKind}_id_2`,
          eventGatewayType: 'Exclusive',
        },
        {
          id: `${bpmnKind}_id_3`,
          eventGatewayType: 'Parallel', // forbidden by the BPMN spec, only valid when 'instantiate: true'
        },
        {
          id: `${bpmnKind}_id_11`,
          instantiate: true,
        },
        {
          id: `${bpmnKind}_id_12`,
          instantiate: true,
          eventGatewayType: 'Exclusive',
        },
        {
          id: `${bpmnKind}_id_13`,
          instantiate: true,
          eventGatewayType: 'Parallel',
        },
      ];

      const model = parseJsonAndExpectOnlyFlowNodes(json, 6);

      // Non 'instantiate' elements
      verifyShape(model.flowNodes[0], {
        shapeId: `shape_${bpmnKind}_id_1`,
        bpmnElementId: `${bpmnKind}_id_1`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 362,
          y: 232,
          width: 36,
          height: 45,
        },
      });
      let currentEventBasedGateway = model.flowNodes[0].bpmnElement as ShapeBpmnEventBasedGateway;
      expect(currentEventBasedGateway.instantiate).toBeFalsy();
      expect(currentEventBasedGateway.gatewayKind).toEqual(ShapeBpmnEventBasedGatewayKind.None);

      verifyShape(model.flowNodes[1], {
        shapeId: `shape_${bpmnKind}_id_2`,
        bpmnElementId: `${bpmnKind}_id_2`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 462,
          y: 232,
          width: 36,
          height: 45,
        },
      });
      currentEventBasedGateway = model.flowNodes[1].bpmnElement as ShapeBpmnEventBasedGateway;
      expect(currentEventBasedGateway.instantiate).toBeFalsy();
      expect(currentEventBasedGateway.gatewayKind).toEqual(ShapeBpmnEventBasedGatewayKind.Exclusive);

      verifyShape(model.flowNodes[2], {
        shapeId: `shape_${bpmnKind}_id_3`,
        bpmnElementId: `${bpmnKind}_id_3`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 562,
          y: 232,
          width: 36,
          height: 45,
        },
      });
      currentEventBasedGateway = model.flowNodes[2].bpmnElement as ShapeBpmnEventBasedGateway;
      expect(currentEventBasedGateway.instantiate).toBeFalsy();
      expect(currentEventBasedGateway.gatewayKind).toEqual(ShapeBpmnEventBasedGatewayKind.Parallel);

      // 'instantiate' elements
      verifyShape(model.flowNodes[3], {
        shapeId: `shape_${bpmnKind}_id_11`,
        bpmnElementId: `${bpmnKind}_id_11`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 365,
          y: 235,
          width: 35,
          height: 46,
        },
      });
      currentEventBasedGateway = model.flowNodes[3].bpmnElement as ShapeBpmnEventBasedGateway;
      expect(currentEventBasedGateway.instantiate).toBeTruthy();
      expect(currentEventBasedGateway.gatewayKind).toEqual(ShapeBpmnEventBasedGatewayKind.None);

      verifyShape(model.flowNodes[4], {
        shapeId: `shape_${bpmnKind}_id_12`,
        bpmnElementId: `${bpmnKind}_id_12`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 365,
          y: 335,
          width: 34,
          height: 47,
        },
      });
      currentEventBasedGateway = model.flowNodes[4].bpmnElement as ShapeBpmnEventBasedGateway;
      expect(currentEventBasedGateway.instantiate).toBeTruthy();
      expect(currentEventBasedGateway.gatewayKind).toEqual(ShapeBpmnEventBasedGatewayKind.Exclusive);

      verifyShape(model.flowNodes[5], {
        shapeId: `shape_${bpmnKind}_id_13`,
        bpmnElementId: `${bpmnKind}_id_13`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: {
          x: 375,
          y: 245,
          width: 34,
          height: 47,
        },
      });
      currentEventBasedGateway = model.flowNodes[5].bpmnElement as ShapeBpmnEventBasedGateway;
      expect(currentEventBasedGateway.instantiate).toBeTruthy();
      expect(currentEventBasedGateway.gatewayKind).toEqual(ShapeBpmnEventBasedGatewayKind.Parallel);
    });
  }

  describe(`incoming/outgoing management for ${bpmnKind}`, () => {
    const isTask = ShapeUtil.isTask(bpmnKind);
    const flowNodeParameterKind = isTask ? 'task' : 'gateway';
    const expectedBounds = isTask ? { x: 362, y: 232, width: 36, height: 45 } : { x: 567, y: 345, width: 25, height: 25 };

    it.each`
      title       | inputAttribute | expectedAttribute
      ${'string'} | ${'incoming'}  | ${'bpmnElementIncomingIds'}
      ${'array'}  | ${'incoming'}  | ${'bpmnElementIncomingIds'}
      ${'string'} | ${'outgoing'}  | ${'bpmnElementOutgoingIds'}
      ${'array'}  | ${'outgoing'}  | ${'bpmnElementOutgoingIds'}
    `(
      `should convert as Shape with $inputAttribute attribute calculated from ${bpmnKind} attribute as $title`,
      ({ title, inputAttribute, expectedAttribute }: { title: string; inputAttribute: 'incoming' | 'outgoing'; expectedAttribute: keyof ExpectedShape }) => {
        const json = buildDefinitions({
          process: {
            [flowNodeParameterKind]: {
              id: `${bpmnKind}_id_0`,
              bpmnKind,
              [inputAttribute]: title === 'array' ? [`flow_${inputAttribute}_1`, `flow_${inputAttribute}_2`] : `flow_${inputAttribute}_1`,
            },
          },
        });

        const model = parseJsonAndExpectOnlyFlowNodes(json, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_${bpmnKind}_id_0`,
          bpmnElementId: `${bpmnKind}_id_0`,
          bpmnElementName: undefined,
          bpmnElementKind: expectedShapeBpmnElementKind,
          bounds: expectedBounds,
          [expectedAttribute]: title === 'array' ? [`flow_${inputAttribute}_1`, `flow_${inputAttribute}_2`] : [`flow_${inputAttribute}_1`],
        });
      },
    );

    it.each`
      title         | flowKind          | expectedAttribute
      ${'incoming'} | ${'sequenceFlow'} | ${'bpmnElementIncomingIds'}
      ${'outgoing'} | ${'sequenceFlow'} | ${'bpmnElementOutgoingIds'}
      ${'incoming'} | ${'association'}  | ${'bpmnElementIncomingIds'}
      ${'outgoing'} | ${'association'}  | ${'bpmnElementOutgoingIds'}
    `(
      `should convert as Shape with $title attribute calculated from $flowKind`,
      ({ title, flowKind, expectedAttribute }: { title: string; flowKind: 'sequenceFlow' | 'association'; expectedAttribute: keyof ExpectedShape }) => {
        const json = buildDefinitions({
          process: {
            [flowNodeParameterKind]: { id: `${bpmnKind}_id_0`, bpmnKind },
            [flowKind]: {
              id: `flow_${title}`,
              sourceRef: title === 'incoming' ? 'unknown' : `${bpmnKind}_id_0`,
              targetRef: title === 'incoming' ? `${bpmnKind}_id_0` : 'unknown',
            },
          },
        });

        const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

        verifyShape(model.flowNodes[0], {
          shapeId: `shape_${bpmnKind}_id_0`,
          bpmnElementId: `${bpmnKind}_id_0`,
          bpmnElementName: undefined,
          bpmnElementKind: expectedShapeBpmnElementKind,
          bounds: expectedBounds,
          [expectedAttribute]: [`flow_${title}`],
        });
      },
    );

    it.each`
      title         | expectedAttribute
      ${'incoming'} | ${'bpmnElementIncomingIds'}
      ${'outgoing'} | ${'bpmnElementOutgoingIds'}
    `(`should convert as Shape with $title attribute calculated from message flow`, ({ title, expectedAttribute }: { title: string; expectedAttribute: keyof ExpectedShape }) => {
      const json = buildDefinitions({
        process: {
          [flowNodeParameterKind]: { id: `${bpmnKind}_id_0`, bpmnKind },
        },
        messageFlows: {
          id: `flow_${title}`,
          sourceRef: title === 'incoming' ? 'unknown' : `${bpmnKind}_id_0`,
          targetRef: title === 'incoming' ? `${bpmnKind}_id_0` : 'unknown',
        },
      });

      const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_${bpmnKind}_id_0`,
        bpmnElementId: `${bpmnKind}_id_0`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: expectedBounds,
        [expectedAttribute]: [`flow_${title}`],
      });
    });

    it(`should convert as Shape with incoming/outgoing attributes calculated from ${bpmnKind} attributes and from flows`, () => {
      const json = buildDefinitions({
        process: {
          [flowNodeParameterKind]: { id: `${bpmnKind}_id_0`, bpmnKind, incoming: 'flow_in_1', outgoing: ['flow_out_1', 'flow_out_2'] },
          sequenceFlow: [
            { id: 'flow_in_1', sourceRef: 'unknown', targetRef: 'call_activity_id_0' },
            { id: 'flow_out_2', sourceRef: 'call_activity_id_0', targetRef: 'unknown' },
          ],
          association: [{ id: 'flow_out_3', sourceRef: `${bpmnKind}_id_0`, targetRef: 'unknown' }],
        },
        messageFlows: { id: 'flow_in_2', sourceRef: 'unknown', targetRef: `${bpmnKind}_id_0` },
      });

      const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 4, 1);

      verifyShape(model.flowNodes[0], {
        shapeId: `shape_${bpmnKind}_id_0`,
        bpmnElementId: `${bpmnKind}_id_0`,
        bpmnElementName: undefined,
        bpmnElementKind: expectedShapeBpmnElementKind,
        bounds: expectedBounds,
        bpmnElementIncomingIds: ['flow_in_1', 'flow_in_2'],
        bpmnElementOutgoingIds: ['flow_out_1', 'flow_out_2', 'flow_out_3'],
      });
    });
  });
});
