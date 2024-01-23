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

import type BpmnModel from '@lib/model/bpmn/internal/BpmnModel';

import { getEdgeByBpmnElementId, getFlowNodeByBpmnElementId, getLaneByBpmnElementId, getPoolByBpmnElementId, verifyEdge, verifyShape } from '../../helpers/bpmn-model-expect';
import { expectPoolLaneEdgeFlowNode, verifyLabel } from '../../helpers/JsonTestUtils';

import { newBpmnParser } from '@lib/component/parser/BpmnParser';
import { ShapeBpmnElementKind } from '@lib/model/bpmn/internal';
import { readFileSync } from '@test/shared/file-helper';

describe('parse xml to model', () => {
  it('Single process with no participant', () => {
    const model = newBpmnParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/miwg-A.1.0.bpmn'));

    expectPoolLaneEdgeFlowNode(model, 0, 0, 4, 5);
  });

  describe('error management', () => {
    const parsingErrorMessage = `XML parsing failed. Unable to retrieve 'definitions' from the BPMN source.`;

    it('Parse empty content', () => {
      expect(() => newBpmnParser().parse('')).toThrow(parsingErrorMessage);
    });

    it('Parse a text file', () => {
      expect(() => newBpmnParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/text-only.txt'))).toThrow(parsingErrorMessage);
    });

    it('Parse a truncated diagram file', () => {
      // we don't have xml validation so the parsing is done. The parser tries to extract the most it can from the xml.
      const model = newBpmnParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/simple-start-task-end_truncated.bpmn'));
      expect(model.flowNodes).toHaveLength(2);
      // This element is truncated in the source xml file
      const activity = model.flowNodes.find(shape => shape.id == 'BPMNShape_Activity_1');
      expect(activity.bpmnElement.id).toBe('Activity_1');
    });

    it('Parse a xml file which is not a BPMN diagram', () => {
      expect(() => newBpmnParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/special/xml-but-not-bpmn.xml'))).toThrow(parsingErrorMessage);
    });
  });

  describe('BPMN In Color support', () => {
    // pools and lanes are tested with "bpmn.io colors attributes"

    describe('Parse specification sample', () => {
      let model: BpmnModel;
      beforeEach(() => {
        model = newBpmnParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/bpmn-in-color/bpmn-in-color-spec-sample.bpmn'));
      });

      it('Task', () => {
        const shape = getFlowNodeByBpmnElementId(model, 'task_orange_border');
        verifyShape(shape, {
          shapeId: `task_orange_border_shape_id`,
          bpmnElementId: `task_orange_border`,
          bpmnElementName: 'Orange Border',
          bpmnElementKind: ShapeBpmnElementKind.TASK,
          bpmnElementIncomingIds: ['_703bc99e-e861-4841-9883-977244bf69a3'],
          bpmnElementOutgoingIds: ['sequence_flow_1'],
          bounds: { x: 230, y: 168, width: 96, height: 76 },
          extensions: {
            fillColor: '#ffffff',
            strokeColor: '#FF6600',
          },
        });
        verifyLabel(shape.label, {
          bounds: { x: 230, y: 200, width: 96, height: 12 },
          extensions: { color: '#000000' },
          font: { isBold: false, isItalic: false, isStrikeThrough: false, isUnderline: false, name: 'Arial', size: 8 },
        });
      });

      it('End Event', () => {
        const shape = getFlowNodeByBpmnElementId(model, 'endEvent_red_font');
        verifyShape(shape, {
          shapeId: `endEvent_red_font_shape_id`,
          bpmnElementId: `endEvent_red_font`,
          bpmnElementName: 'Red Font',
          bpmnElementKind: ShapeBpmnElementKind.EVENT_END,
          bpmnElementIncomingIds: ['_82e55eb0-f279-48e2-bbda-1f2617613586'],
          bounds: { x: 788, y: 188, width: 36, height: 36 },
          extensions: {
            fillColor: '#ffffff',
            strokeColor: '#000000',
          },
        });
        verifyLabel(shape.label, {
          bounds: { x: 751, y: 234, width: 110, height: 12 },
          extensions: { color: '#FF0000' },
          font: { isBold: false, isItalic: false, isStrikeThrough: false, isUnderline: false, name: 'Arial', size: 8 },
        });
      });

      it('Sequence Flow', () => {
        const edge = getEdgeByBpmnElementId(model, 'sequence_flow_1');
        verifyEdge(edge, {
          edgeId: `sequence_flow_1_edge_id`,
          bpmnElementId: `sequence_flow_1`,
          bpmnElementName: 'Orange link',
          bpmnElementSourceRefId: 'task_orange_border',
          bpmnElementTargetRefId: '_228e45d8-ece8-42a3-b11c-89695e468954',
          waypoints: [
            { x: 325, y: 206 },
            { x: 417, y: 206 },
          ],
          extensions: {
            strokeColor: '#FF6600',
          },
        });
        verifyLabel(edge.label, {
          bounds: { x: 316.359_375, y: 211, width: 110, height: 12 },
          extensions: { color: '#000000' },
          font: { isBold: false, isItalic: false, isStrikeThrough: false, isUnderline: false, name: 'Arial', size: 8 },
        });
      });
    });
  });

  // Test fallback to bpmn.io colors when not set with bpmn-in-color
  describe('Parse sample with both bpmn.io and bpmn-in-color attributes', () => {
    let model: BpmnModel;
    beforeEach(() => {
      model = newBpmnParser().parse(readFileSync('../fixtures/bpmn/xml-parsing/bpmn-in-color/issue-2588-both-bpmn-in-color-and-bpmnio_infor-modeler.bpmn'));
    });

    it('Gateway with only bpmn.io color attributes', () => {
      const shape = getFlowNodeByBpmnElementId(model, 'Gateway_18umgze');
      verifyShape(shape, {
        shapeId: `Gateway_18umgze_di`,
        bpmnElementId: `Gateway_18umgze`,
        bpmnElementName: 'question?',
        bpmnElementKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
        bpmnElementIncomingIds: ['Flow_1v3tww9'],
        bpmnElementOutgoingIds: ['Flow_047ue01', 'Flow_0ngzmge'],
        bounds: { x: 135, y: 115, width: 50, height: 50 },
        extensions: {
          fillColor: '#FFD726',
          strokeColor: '#000000',
        },
        parentId: 'Lane_0jqhnmr',
      });
      verifyLabel(shape.label, {
        bounds: { x: 136, y: 175, width: 48, height: 14 },
      });
    });

    it('Business Rule Task with both bpmn-in-color and bpmn.io color attributes', () => {
      const shape = getFlowNodeByBpmnElementId(model, 'Activity_1emrcvt');
      verifyShape(shape, {
        shapeId: `Activity_1uhp7fi_di`,
        bpmnElementId: `Activity_1emrcvt`,
        bpmnElementName: 'Task red',
        bpmnElementKind: ShapeBpmnElementKind.TASK_BUSINESS_RULE,
        bpmnElementIncomingIds: ['Flow_10obkll'],
        bpmnElementOutgoingIds: ['Flow_0kec6du'],
        bounds: { x: 480, y: -250, width: 100, height: 80 },
        extensions: {
          fillColor: '#da1217',
          strokeColor: '#8abff7',
        },
        parentId: 'Lane_0t0ihv3',
      });
      verifyLabel(shape.label, {
        extensions: {
          color: '#8abff7',
        },
      });
    });

    it('Sequence Flow with only bpmn.io color attributes', () => {
      const edge = getEdgeByBpmnElementId(model, 'Flow_0satjv8');
      verifyEdge(edge, {
        edgeId: `Flow_0satjv8_di`,
        bpmnElementId: `Flow_0satjv8`,
        bpmnElementSourceRefId: 'Gateway_1r1qcq2',
        bpmnElementTargetRefId: 'Event_1jnrrxt',
        waypoints: [
          { x: 920, y: -465 },
          { x: 920, y: -380 },
          { x: 1012, y: -380 },
        ],
        extensions: {
          strokeColor: '#ff00ff',
        },
      });
      verifyLabel(edge.label, undefined);
    });

    it('Sequence Flow with both bpmn-in-color and bpmn.io color attributes', () => {
      const edge = getEdgeByBpmnElementId(model, 'Flow_1z085yv');
      verifyEdge(edge, {
        edgeId: `Flow_1z085yv_di`,
        bpmnElementId: `Flow_1z085yv`,
        bpmnElementSourceRefId: 'Gateway_1r1qcq2',
        bpmnElementTargetRefId: 'Event_0g32488',
        waypoints: [
          { x: 945, y: -490 },
          { x: 979, y: -490 },
          { x: 979, y: -520 },
          { x: 1012, y: -520 },
        ],
        extensions: {
          strokeColor: '#8abff7',
        },
      });
      verifyLabel(edge.label, {
        extensions: { color: '#8abff7' },
      });
    });

    it('Participant/Pool with only bpmn.io color attributes', () => {
      const shape = getPoolByBpmnElementId(model, 'Participant_1f8y1kd');
      verifyShape(shape, {
        shapeId: `Participant_1f8y1kd_di`,
        bpmnElementId: `Participant_1f8y1kd`,
        bpmnElementName: 'IPC for Infor STuff',
        bpmnElementKind: ShapeBpmnElementKind.POOL,
        isHorizontal: true,
        bounds: { x: -230, y: -630, width: 1720, height: 910 },
        extensions: {
          fillColor: '#ffffff',
          strokeColor: '#000000',
        },
      });
      verifyLabel(shape.label, undefined);
    });

    it('Participant/Pool with both bpmn-in-color and bpmn.io color attributes', () => {
      const shape = getPoolByBpmnElementId(model, 'Participant_1hnwl5i');
      verifyShape(shape, {
        shapeId: `Participant_1s4tfww_di`,
        bpmnElementId: `Participant_1hnwl5i`,
        bpmnElementName: 'collapsed pool',
        bpmnElementKind: ShapeBpmnElementKind.POOL,
        isHorizontal: true,
        bounds: { x: -230, y: -740, width: 1720, height: 60 },
        extensions: {
          fillColor: '#55a3f3',
          strokeColor: '#000000',
        },
        bpmnElementIncomingIds: ['Association_1buem20'],
      });
      verifyLabel(shape.label, undefined);
    });

    it('Lane with only bpmn.io color attributes', () => {
      const shape = getLaneByBpmnElementId(model, 'Lane_0jqhnmr');
      verifyShape(shape, {
        shapeId: `Lane_0jqhnmr_di`,
        bpmnElementId: `Lane_0jqhnmr`,
        bpmnElementName: 'Role 1 1st Hierarchy',
        bpmnElementKind: ShapeBpmnElementKind.LANE,
        isHorizontal: true,
        bounds: { x: -200, y: 20, width: 1690, height: 260 },
        extensions: {
          fillColor: '#f1f1f1',
          strokeColor: '#000000',
        },
        parentId: 'Participant_1f8y1kd',
      });
      verifyLabel(shape.label, undefined);
    });

    it('Lane with both bpmn-in-color and bpmn.io color attributes', () => {
      const shape = getLaneByBpmnElementId(model, 'Lane_0t0ihv3');
      verifyShape(shape, {
        shapeId: `Lane_0t0ihv3_di`,
        bpmnElementId: `Lane_0t0ihv3`,
        bpmnElementName: 'Role 2',
        bpmnElementKind: ShapeBpmnElementKind.LANE,
        isHorizontal: true,
        bounds: { x: -170, y: -280, width: 1660, height: 140 },
        extensions: {
          fillColor: '#f1f1f1',
          strokeColor: '#000000',
        },
        parentId: 'Lane_0yqg0gw',
      });
      verifyLabel(shape.label, undefined);
    });
  });
});
