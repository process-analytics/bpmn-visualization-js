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

import { parseJsonAndExpectOnlyEdgesAndFlowNodes } from '../../../helpers/JsonTestUtils';
import { verifyEdge } from '../../../helpers/bpmn-model-expect';

import type { BpmnJsonModel } from '@lib/model/bpmn/json/BPMN20';
import { SequenceFlowKind } from '@lib/model/bpmn/internal';
import { Waypoint } from '@lib/model/bpmn/internal/edge/edge';

describe('parse bpmn as json for default sequence flow', () => {
  it.each([
    ['exclusiveGateway'],
    ['inclusiveGateway'],
    ['complexGateway'],
    ['task'],
    ['userTask'],
    ['serviceTask'],
    ['receiveTask'],
    ['sendTask'],
    ['manualTask'],
    ['scriptTask'],
    ['businessRuleTask'],
    ['callActivity'],
    ['subProcess'],
  ])(`should convert as Edge, when an sequence flow (defined as default in %s) is an attribute (as object) of 'process' (as object)`, sourceKind => {
    const json: BpmnJsonModel = {
      definitions: {
        targetNamespace: '',
        process: {
          id: 'Process_1',
          sequenceFlow: {
            id: 'sequenceFlow_id_0',
            sourceRef: 'source_id_0',
            targetRef: 'targetRef_RLk',
          },
          [sourceKind]: { id: 'source_id_0', default: 'sequenceFlow_id_0' },
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNShape: {
              id: 'shape_source_id_0',
              bpmnElement: 'source_id_0',
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
            BPMNEdge: {
              id: 'edge_sequenceFlow_id_0',
              bpmnElement: 'sequenceFlow_id_0',
              waypoint: [{ x: 10, y: 10 }],
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'source_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementSequenceFlowKind: SequenceFlowKind.DEFAULT,
      waypoints: [new Waypoint(10, 10)],
    });
  });

  it(`should NOT convert, when an sequence flow (defined as default) is an attribute of 'process' and attached to a flow node where is NOT possible in BPMN Semantic`, () => {
    const json: BpmnJsonModel = {
      definitions: {
        targetNamespace: '',
        process: {
          id: 'Process_1',
          // Enforcement of the 'default' property in case the XML BPMN content is malformed
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          parallelGateway: { id: 'gateway_id_0', default: 'sequenceFlow_id_0' },
          sequenceFlow: {
            id: 'sequenceFlow_id_0',
            sourceRef: 'gateway_id_0',
            targetRef: 'targetRef_RLk',
          },
        },
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNShape: {
              id: 'shape_gateway_id_0',
              bpmnElement: 'gateway_id_0',
              Bounds: { x: 362, y: 232, width: 36, height: 45 },
            },
            BPMNEdge: {
              id: 'edge_sequenceFlow_id_0',
              bpmnElement: 'sequenceFlow_id_0',
              waypoint: [{ x: 10, y: 10 }],
            },
          },
        },
      },
    };

    const model = parseJsonAndExpectOnlyEdgesAndFlowNodes(json, 1, 1);

    verifyEdge(model.edges[0], {
      edgeId: 'edge_sequenceFlow_id_0',
      bpmnElementId: 'sequenceFlow_id_0',
      bpmnElementName: undefined,
      bpmnElementSourceRefId: 'gateway_id_0',
      bpmnElementTargetRefId: 'targetRef_RLk',
      bpmnElementSequenceFlowKind: SequenceFlowKind.NORMAL,
      waypoints: [new Waypoint(10, 10)],
    });
  });
});
