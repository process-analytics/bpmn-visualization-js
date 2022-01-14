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
import BpmnXmlParser from '../../../../../src/component/parser/xml/BpmnXmlParser';
import type { BPMNDiagram } from '../../../../../src/model/bpmn/json/BPMNDI';
import type { TProcess } from '../../../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import { readFileSync } from '../../../../helpers/file-helper';

describe('parse bpmn as xml for bic cloud design', () => {
  it('bpmn with process with extension, ensure elements are present', () => {
    const a300Process = readFileSync('../fixtures/bpmn/xml-parsing/bic-cloud-design-6_2_0-A.3.0-export.bpmn');

    const json = new BpmnXmlParser().parse(a300Process);
    expect(json).toMatchObject({
      definitions: {
        targetNamespace: 'gbtc.diagram',
        id: 'Diagram--4fe6a07c-d4d4-4a73-b292-bb3716a99700',
        process: {
          id: 'process_4fe6a07c-d4d4-4a73-b292-bb3716a99700',
          extensionElements: {
            diagramData: {
              stereotype: 'DT_BPMN_COLLABORATION',
              attribute: {
                stereotype: 'AT_NAME',
                attributeValue: {
                  locale: 'de',
                  stereotype: 'AT_NAME',
                  value: 'A.3.0',
                  dataType: 'Text',
                },
              },
            },
          },
          task: [
            {
              isForCompensation: false,
              name: 'Task 1',
              id: 'UUID_c1090373-bb11-439e-8a86-61dcdeeb8e37',
              documentation: {
                id: 'documentation_UUID_c1090373-bb11-439e-8a86-61dcdeeb8e37',
              },
              extensionElements: {
                entityData: {
                  stereotype: 'ET_ACTIVITY',
                  attribute: {
                    stereotype: 'AT_NAME',
                    attributeValue: {
                      locale: 'de',
                      stereotype: 'AT_NAME',
                      value: 'Task 1',
                      dataType: 'Text',
                    },
                  },
                },
                nodeData: {
                  stereotype: 'NST_TASK',
                },
              },
              incoming: 'Sequence_6210b841-c721-4f07-bb52-465bb1b18752',
              outgoing: 'Sequence_e26140e3-4363-41ba-8ad2-7e5aa9a83463',
            },
            {
              isForCompensation: false,
              name: 'Collapsed Sub-Process',
              id: 'UUID_9985eee1-a8a0-48ec-9f19-654bd6b9874f',
              documentation: {
                id: 'documentation_UUID_9985eee1-a8a0-48ec-9f19-654bd6b9874f',
              },
              extensionElements: {
                entityData: {
                  stereotype: 'ET_ACTIVITY',
                  attribute: [
                    {
                      stereotype: 'AT_DECOMPOSITION',
                      attributeValue: {
                        locale: 'all',
                        stereotype: 'AT_DECOMPOSITION',
                        value:
                          '{"rel":"http://cloud.gbtec.de/rels/diagram","uri":"/api/tenants/00000000-0000-4000-a000-000000000000/repositories/4400b90e-6197-402f-9b6e-03268ce2a4b7/stages/common/diagrams/4c34544d-6452-4961-95fc-b4962557f809"}',
                        dataType: 'Assignment',
                      },
                    },
                    {
                      stereotype: 'AT_NAME',
                      attributeValue: {
                        locale: 'de',
                        stereotype: 'AT_NAME',
                        value: 'Collapsed Sub-Process',
                        dataType: 'Text',
                      },
                    },
                  ],
                },
                nodeData: {
                  stereotype: 'NST_TASK',
                },
              },
              incoming: 'Sequence_e26140e3-4363-41ba-8ad2-7e5aa9a83463',
              outgoing: 'Sequence_d84cf868-9f83-40b6-b81e-6e7474e27f03',
            },
            {
              isForCompensation: false,
              name: 'Task 2',
              id: 'UUID_7b35f47c-a852-4371-9cd8-175a6031a51f',
              documentation: {
                id: 'documentation_UUID_7b35f47c-a852-4371-9cd8-175a6031a51f',
              },
              extensionElements: {
                entityData: {
                  stereotype: 'ET_ACTIVITY',
                  attribute: {
                    stereotype: 'AT_NAME',
                    attributeValue: {
                      locale: 'de',
                      stereotype: 'AT_NAME',
                      value: 'Task 2',
                      dataType: 'Text',
                    },
                  },
                },
                nodeData: {
                  stereotype: 'NST_TASK',
                },
              },
              incoming: 'Sequence_d84cf868-9f83-40b6-b81e-6e7474e27f03',
              outgoing: 'Sequence_e5706950-3803-40d7-8221-7d3f732fde98',
            },
            {
              isForCompensation: false,
              name: 'Aktivität',
              id: 'UUID_5d585893-cb4c-440f-98c6-c725a91dc9c3',
              documentation: {
                id: 'documentation_UUID_5d585893-cb4c-440f-98c6-c725a91dc9c3',
              },
              extensionElements: {
                entityData: {
                  stereotype: 'ET_ACTIVITY',
                  attribute: {
                    stereotype: 'AT_NAME',
                    attributeValue: {
                      locale: 'de',
                      stereotype: 'AT_NAME',
                      value: 'Aktivität',
                      dataType: 'Text',
                    },
                  },
                },
                nodeData: {
                  stereotype: 'NST_TASK',
                },
              },
              incoming: 'Sequence_ec21b991-9e77-4108-8e06-bc13d88ac44c',
              outgoing: 'Sequence_718285d0-70e9-4d51-80f1-1050c29b005c',
            },
            {
              isForCompensation: false,
              name: 'Task 4',
              id: 'UUID_c505b46c-2d1e-4500-816c-84f4ac77b56e',
              documentation: {
                id: 'documentation_UUID_c505b46c-2d1e-4500-816c-84f4ac77b56e',
              },
              extensionElements: {
                entityData: {
                  stereotype: 'ET_ACTIVITY',
                  attribute: {
                    stereotype: 'AT_NAME',
                    attributeValue: {
                      locale: 'de',
                      stereotype: 'AT_NAME',
                      value: 'Task 4',
                      dataType: 'Text',
                    },
                  },
                },
                nodeData: {
                  stereotype: 'NST_TASK',
                },
              },
              incoming: 'Sequence_b2fad505-c101-46d3-8fee-48942c8ac57d',
              outgoing: 'Sequence_28381fd9-bec6-495b-ab71-1d0b3a8a7f29',
            },
          ],
          startEvent: {
            parallelMultiple: false,
            name: 'Start Ereignis',
            id: 'UUID_2dfe06f0-9dab-4971-95bd-ff211afb45d3',
            documentation: {
              id: 'documentation_UUID_2dfe06f0-9dab-4971-95bd-ff211afb45d3',
            },
            extensionElements: {
              entityData: {
                stereotype: 'ET_START_EVENT',
                attribute: {
                  stereotype: 'AT_NAME',
                  attributeValue: {
                    locale: 'de',
                    stereotype: 'AT_NAME',
                    value: 'Start Ereignis',
                    dataType: 'Text',
                  },
                },
              },
              nodeData: {
                stereotype: 'NST_START_EVENT',
              },
            },
            outgoing: 'Sequence_6210b841-c721-4f07-bb52-465bb1b18752',
          },
          endEvent: [
            {
              name: 'End Event 1',
              id: 'UUID_36de0f16-ffd5-4206-b39a-3eb166e39541',
              documentation: {
                id: 'documentation_UUID_36de0f16-ffd5-4206-b39a-3eb166e39541',
              },
              extensionElements: {
                entityData: {
                  stereotype: 'ET_END_EVENT',
                  attribute: {
                    stereotype: 'AT_NAME',
                    attributeValue: {
                      locale: 'de',
                      stereotype: 'AT_NAME',
                      value: 'End Event 1',
                      dataType: 'Text',
                    },
                  },
                },
                nodeData: {
                  stereotype: 'NST_END_EVENT',
                },
              },
              incoming: 'Sequence_718285d0-70e9-4d51-80f1-1050c29b005c',
            },
            {
              name: 'End Event 2',
              id: 'UUID_ce161e7b-e67a-4f82-87ff-031ee7a581ee',
              documentation: {
                id: 'documentation_UUID_ce161e7b-e67a-4f82-87ff-031ee7a581ee',
              },
              extensionElements: {
                entityData: {
                  stereotype: 'ET_END_EVENT',
                  attribute: {
                    stereotype: 'AT_NAME',
                    attributeValue: {
                      locale: 'de',
                      stereotype: 'AT_NAME',
                      value: 'End Event 2',
                      dataType: 'Text',
                    },
                  },
                },
                nodeData: {
                  stereotype: 'NST_END_EVENT',
                },
              },
              incoming: 'Sequence_28381fd9-bec6-495b-ab71-1d0b3a8a7f29',
            },
          ],
          boundaryEvent: [
            {
              cancelActivity: false,
              attachedToRef: 'UUID_9985eee1-a8a0-48ec-9f19-654bd6b9874f',
              parallelMultiple: false,
              name: 'Boundary Intermediate Event Non-Interruplting Message\n',
              id: 'UUID_9bb78095-59cf-4475-8b36-4e8cedee1d3c',
              documentation: {
                id: 'documentation_UUID_9bb78095-59cf-4475-8b36-4e8cedee1d3c',
              },
              extensionElements: {
                entityData: {
                  stereotype: 'ET_INTERMEDIATE_EVENT',
                  attribute: {
                    stereotype: 'AT_NAME',
                    attributeValue: {
                      locale: 'de',
                      stereotype: 'AT_NAME',
                      value: 'Boundary Intermediate Event Non-Interruplting Message\n',
                      dataType: 'Text',
                    },
                  },
                },
                nodeData: {
                  stereotype: 'NST_INTERMEDIATE_EVENT',
                  attribute: [
                    {
                      stereotype: 'AT_INTERMEDIATE_EVENT_TYPE',
                      attributeValue: {
                        locale: 'all',
                        stereotype: 'AT_INTERMEDIATE_EVENT_TYPE',
                        value: 1,
                        dataType: 'Enum',
                      },
                    },
                    {
                      stereotype: 'AT_NON_INTERRUPTING',
                      attributeValue: {
                        locale: 'all',
                        stereotype: 'AT_NON_INTERRUPTING',
                        value: true,
                        dataType: 'Boolean',
                      },
                    },
                  ],
                },
              },
              outgoing: 'Sequence_ec21b991-9e77-4108-8e06-bc13d88ac44c',
              messageEventDefinition: '',
            },
            {
              cancelActivity: true,
              attachedToRef: 'UUID_9985eee1-a8a0-48ec-9f19-654bd6b9874f',
              parallelMultiple: false,
              name: 'Boundary Intermediate Event Interrupting Escalation',
              id: 'UUID_d681e2c5-376a-4819-b1d3-5ada529f5318',
              documentation: {
                id: 'documentation_UUID_d681e2c5-376a-4819-b1d3-5ada529f5318',
              },
              extensionElements: {
                entityData: {
                  stereotype: 'ET_INTERMEDIATE_EVENT',
                  attribute: {
                    stereotype: 'AT_NAME',
                    attributeValue: {
                      locale: 'de',
                      stereotype: 'AT_NAME',
                      value: 'Boundary Intermediate Event Interrupting Escalation',
                      dataType: 'Text',
                    },
                  },
                },
                nodeData: {
                  stereotype: 'NST_INTERMEDIATE_EVENT',
                  attribute: [
                    {
                      stereotype: 'AT_INTERMEDIATE_EVENT_TYPE',
                      attributeValue: {
                        locale: 'all',
                        stereotype: 'AT_INTERMEDIATE_EVENT_TYPE',
                        value: 4,
                        dataType: 'Enum',
                      },
                    },
                    {
                      stereotype: 'AT_NON_INTERRUPTING',
                      attributeValue: {
                        locale: 'all',
                        stereotype: 'AT_NON_INTERRUPTING',
                        value: false,
                        dataType: 'Boolean',
                      },
                    },
                  ],
                },
              },
              outgoing: 'Sequence_b2fad505-c101-46d3-8fee-48942c8ac57d',
              escalationEventDefinition: '',
            },
          ],
          sequenceFlow: [
            {
              sourceRef: 'UUID_2dfe06f0-9dab-4971-95bd-ff211afb45d3',
              targetRef: 'UUID_c1090373-bb11-439e-8a86-61dcdeeb8e37',
              id: 'Sequence_6210b841-c721-4f07-bb52-465bb1b18752',
              documentation: {
                id: 'documentation_Sequence_6210b841-c721-4f07-bb52-465bb1b18752',
              },
              extensionElements: {
                associationData: {
                  stereotype: 'AST_SEQUENCE_FLOW',
                },
                edgeData: {
                  stereotype: 'ST_1477950886063',
                },
              },
            },
            {
              sourceRef: 'UUID_c1090373-bb11-439e-8a86-61dcdeeb8e37',
              targetRef: 'UUID_9985eee1-a8a0-48ec-9f19-654bd6b9874f',
              id: 'Sequence_e26140e3-4363-41ba-8ad2-7e5aa9a83463',
              documentation: {
                id: 'documentation_Sequence_e26140e3-4363-41ba-8ad2-7e5aa9a83463',
              },
              extensionElements: {
                associationData: {
                  stereotype: 'AST_SEQUENCE_FLOW',
                },
                edgeData: {
                  stereotype: 'ST_1477950886063',
                },
              },
            },
            {
              sourceRef: 'UUID_9985eee1-a8a0-48ec-9f19-654bd6b9874f',
              targetRef: 'UUID_7b35f47c-a852-4371-9cd8-175a6031a51f',
              id: 'Sequence_d84cf868-9f83-40b6-b81e-6e7474e27f03',
              documentation: {
                id: 'documentation_Sequence_d84cf868-9f83-40b6-b81e-6e7474e27f03',
              },
              extensionElements: {
                associationData: {
                  stereotype: 'AST_SEQUENCE_FLOW',
                },
                edgeData: {
                  stereotype: 'ST_1477950886063',
                },
              },
            },
            {
              sourceRef: 'UUID_7b35f47c-a852-4371-9cd8-175a6031a51f',
              targetRef: 'UUID_36de0f16-ffd5-4206-b39a-3eb166e39541',
              id: 'Sequence_e5706950-3803-40d7-8221-7d3f732fde98',
              documentation: {
                id: 'documentation_Sequence_e5706950-3803-40d7-8221-7d3f732fde98',
              },
              extensionElements: {
                associationData: {
                  stereotype: 'AST_SEQUENCE_FLOW',
                },
                edgeData: {
                  stereotype: 'ST_1477950886063',
                },
              },
            },
            {
              sourceRef: 'UUID_9bb78095-59cf-4475-8b36-4e8cedee1d3c',
              targetRef: 'UUID_5d585893-cb4c-440f-98c6-c725a91dc9c3',
              id: 'Sequence_ec21b991-9e77-4108-8e06-bc13d88ac44c',
              documentation: {
                id: 'documentation_Sequence_ec21b991-9e77-4108-8e06-bc13d88ac44c',
              },
              extensionElements: {
                associationData: {
                  stereotype: 'AST_SEQUENCE_FLOW',
                },
                edgeData: {
                  stereotype: 'ST_1477950886063',
                },
              },
            },
            {
              sourceRef: 'UUID_5d585893-cb4c-440f-98c6-c725a91dc9c3',
              targetRef: 'UUID_36de0f16-ffd5-4206-b39a-3eb166e39541',
              id: 'Sequence_718285d0-70e9-4d51-80f1-1050c29b005c',
              documentation: {
                id: 'documentation_Sequence_718285d0-70e9-4d51-80f1-1050c29b005c',
              },
              extensionElements: {
                associationData: {
                  stereotype: 'AST_SEQUENCE_FLOW',
                },
                edgeData: {
                  stereotype: 'ST_1477950886063',
                },
              },
            },
            {
              sourceRef: 'UUID_d681e2c5-376a-4819-b1d3-5ada529f5318',
              targetRef: 'UUID_c505b46c-2d1e-4500-816c-84f4ac77b56e',
              id: 'Sequence_b2fad505-c101-46d3-8fee-48942c8ac57d',
              documentation: {
                id: 'documentation_Sequence_b2fad505-c101-46d3-8fee-48942c8ac57d',
              },
              extensionElements: {
                associationData: {
                  stereotype: 'AST_SEQUENCE_FLOW',
                },
                edgeData: {
                  stereotype: 'ST_1477950886063',
                },
              },
            },
            {
              sourceRef: 'UUID_c505b46c-2d1e-4500-816c-84f4ac77b56e',
              targetRef: 'UUID_ce161e7b-e67a-4f82-87ff-031ee7a581ee',
              id: 'Sequence_28381fd9-bec6-495b-ab71-1d0b3a8a7f29',
              documentation: {
                id: 'documentation_Sequence_28381fd9-bec6-495b-ab71-1d0b3a8a7f29',
              },
              extensionElements: {
                associationData: {
                  stereotype: 'AST_SEQUENCE_FLOW',
                },
                edgeData: {
                  stereotype: 'ST_1477950886063',
                },
              },
            },
          ],
        },
        BPMNDiagram: {
          id: 'bpmnDiagram',
          BPMNPlane: {
            id: 'CollaborationID-Diagram',
            bpmnElement: 'process_4fe6a07c-d4d4-4a73-b292-bb3716a99700',
            BPMNShape: [
              {
                id: 'node_UUID_2dfe06f0-9dab-4971-95bd-ff211afb45d3',
                bpmnElement: 'UUID_2dfe06f0-9dab-4971-95bd-ff211afb45d3',
                Bounds: {
                  x: 19,
                  y: 93,
                  width: 31,
                  height: 31,
                },
              },
              {
                id: 'node_UUID_c1090373-bb11-439e-8a86-61dcdeeb8e37',
                bpmnElement: 'UUID_c1090373-bb11-439e-8a86-61dcdeeb8e37',
                Bounds: {
                  x: 103,
                  y: 86,
                  width: 92,
                  height: 47,
                },
              },
              {
                id: 'node_UUID_9985eee1-a8a0-48ec-9f19-654bd6b9874f',
                bpmnElement: 'UUID_9985eee1-a8a0-48ec-9f19-654bd6b9874f',
                Bounds: {
                  x: 248,
                  y: 86,
                  width: 92,
                  height: 47,
                },
              },
              {
                id: 'node_UUID_9bb78095-59cf-4475-8b36-4e8cedee1d3c',
                bpmnElement: 'UUID_9bb78095-59cf-4475-8b36-4e8cedee1d3c',
                Bounds: {
                  x: 291,
                  y: 70,
                  width: 31,
                  height: 31,
                },
              },
              {
                id: 'node_UUID_d681e2c5-376a-4819-b1d3-5ada529f5318',
                bpmnElement: 'UUID_d681e2c5-376a-4819-b1d3-5ada529f5318',
                Bounds: {
                  x: 298,
                  y: 117,
                  width: 31,
                  height: 31,
                },
              },
              {
                id: 'node_UUID_7b35f47c-a852-4371-9cd8-175a6031a51f',
                bpmnElement: 'UUID_7b35f47c-a852-4371-9cd8-175a6031a51f',
                Bounds: {
                  x: 392,
                  y: 86,
                  width: 92,
                  height: 47,
                },
              },
              {
                id: 'node_UUID_36de0f16-ffd5-4206-b39a-3eb166e39541',
                bpmnElement: 'UUID_36de0f16-ffd5-4206-b39a-3eb166e39541',
                Bounds: {
                  x: 537,
                  y: 93,
                  width: 31,
                  height: 31,
                },
              },
              {
                id: 'node_UUID_5d585893-cb4c-440f-98c6-c725a91dc9c3',
                bpmnElement: 'UUID_5d585893-cb4c-440f-98c6-c725a91dc9c3',
                Bounds: {
                  x: 392,
                  y: 6,
                  width: 92,
                  height: 47,
                },
              },
              {
                id: 'node_UUID_c505b46c-2d1e-4500-816c-84f4ac77b56e',
                bpmnElement: 'UUID_c505b46c-2d1e-4500-816c-84f4ac77b56e',
                Bounds: {
                  x: 369,
                  y: 174,
                  width: 92,
                  height: 47,
                },
              },
              {
                id: 'node_UUID_ce161e7b-e67a-4f82-87ff-031ee7a581ee',
                bpmnElement: 'UUID_ce161e7b-e67a-4f82-87ff-031ee7a581ee',
                Bounds: {
                  x: 506,
                  y: 182,
                  width: 31,
                  height: 31,
                },
              },
            ],
            BPMNEdge: [
              {
                id: 'edge_Sequence_6210b841-c721-4f07-bb52-465bb1b18752',
                bpmnElement: 'Sequence_6210b841-c721-4f07-bb52-465bb1b18752',
                waypoint: [
                  {
                    x: 50,
                    y: 108,
                    type: 'dc:Point',
                  },
                  {
                    x: 76,
                    y: 109,
                    type: 'dc:Point',
                  },
                  {
                    x: 76,
                    y: 110,
                    type: 'dc:Point',
                  },
                  {
                    x: 103,
                    y: 109,
                    type: 'dc:Point',
                  },
                ],
              },
              {
                id: 'edge_Sequence_e26140e3-4363-41ba-8ad2-7e5aa9a83463',
                bpmnElement: 'Sequence_e26140e3-4363-41ba-8ad2-7e5aa9a83463',
                waypoint: [
                  {
                    x: 195,
                    y: 109,
                    type: 'dc:Point',
                  },
                  {
                    x: 221,
                    y: 110,
                    type: 'dc:Point',
                  },
                  {
                    x: 248,
                    y: 109,
                    type: 'dc:Point',
                  },
                ],
              },
              {
                id: 'edge_Sequence_d84cf868-9f83-40b6-b81e-6e7474e27f03',
                bpmnElement: 'Sequence_d84cf868-9f83-40b6-b81e-6e7474e27f03',
                waypoint: [
                  {
                    x: 340,
                    y: 109,
                    type: 'dc:Point',
                  },
                  {
                    x: 366,
                    y: 110,
                    type: 'dc:Point',
                  },
                  {
                    x: 392,
                    y: 109,
                    type: 'dc:Point',
                  },
                ],
              },
              {
                id: 'edge_Sequence_e5706950-3803-40d7-8221-7d3f732fde98',
                bpmnElement: 'Sequence_e5706950-3803-40d7-8221-7d3f732fde98',
                waypoint: [
                  {
                    x: 484,
                    y: 109,
                    type: 'dc:Point',
                  },
                  {
                    x: 510,
                    y: 110,
                    type: 'dc:Point',
                  },
                  {
                    x: 510,
                    y: 109,
                    type: 'dc:Point',
                  },
                  {
                    x: 537,
                    y: 108,
                    type: 'dc:Point',
                  },
                ],
              },
              {
                id: 'edge_Sequence_ec21b991-9e77-4108-8e06-bc13d88ac44c',
                bpmnElement: 'Sequence_ec21b991-9e77-4108-8e06-bc13d88ac44c',
                waypoint: [
                  {
                    x: 322,
                    y: 85,
                    type: 'dc:Point',
                  },
                  {
                    x: 357,
                    y: 86,
                    type: 'dc:Point',
                  },
                  {
                    x: 357,
                    y: 30,
                    type: 'dc:Point',
                  },
                  {
                    x: 392,
                    y: 29,
                    type: 'dc:Point',
                  },
                ],
              },
              {
                id: 'edge_Sequence_718285d0-70e9-4d51-80f1-1050c29b005c',
                bpmnElement: 'Sequence_718285d0-70e9-4d51-80f1-1050c29b005c',
                waypoint: [
                  {
                    x: 484,
                    y: 29,
                    type: 'dc:Point',
                  },
                  {
                    x: 510,
                    y: 30,
                    type: 'dc:Point',
                  },
                  {
                    x: 510,
                    y: 109,
                    type: 'dc:Point',
                  },
                  {
                    x: 537,
                    y: 108,
                    type: 'dc:Point',
                  },
                ],
              },
              {
                id: 'edge_Sequence_b2fad505-c101-46d3-8fee-48942c8ac57d',
                bpmnElement: 'Sequence_b2fad505-c101-46d3-8fee-48942c8ac57d',
                waypoint: [
                  {
                    x: 329,
                    y: 132,
                    type: 'dc:Point',
                  },
                  {
                    x: 415,
                    y: 133,
                    type: 'dc:Point',
                  },
                  {
                    x: 415,
                    y: 174,
                    type: 'dc:Point',
                  },
                ],
              },
              {
                id: 'edge_Sequence_28381fd9-bec6-495b-ab71-1d0b3a8a7f29',
                bpmnElement: 'Sequence_28381fd9-bec6-495b-ab71-1d0b3a8a7f29',
                waypoint: [
                  {
                    x: 461,
                    y: 197,
                    type: 'dc:Point',
                  },
                  {
                    x: 483,
                    y: 198,
                    type: 'dc:Point',
                  },
                  {
                    x: 506,
                    y: 197,
                    type: 'dc:Point',
                  },
                ],
              },
            ],
          },
        },
      },
    });
    const process: TProcess = json.definitions.process as TProcess;
    expect(process.task).toHaveLength(5);
    expect(process.sequenceFlow).toHaveLength(8);

    const bpmnDiagram: BPMNDiagram = json.definitions.BPMNDiagram as BPMNDiagram;
    expect(bpmnDiagram.BPMNPlane.BPMNShape).toHaveLength(10);
    expect(bpmnDiagram.BPMNPlane.BPMNEdge).toHaveLength(8);
  });
});
