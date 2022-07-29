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

import { ShapeBpmnElementKind } from '../../../src/model/bpmn/internal';

import type { BuildEventDefinitionParameter, OtherBuildEventKind, BuildTaskKind, BuildGatewayKind } from './JsonBuilder';
import { buildDefinitions, EventDefinitionOn } from './JsonBuilder';

describe('build json', () => {
  it('build json of definitions containing one empty process', () => {
    const json = buildDefinitions({
      process: {},
    });

    expect(json).toEqual({
      definitions: {
        targetNamespace: '',
        collaboration: {
          id: 'collaboration_id_0',
        },
        process: { id: '0' },
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {},
        },
      },
    });
  });

  it('build json of definitions containing several processes and participants with different elements', () => {
    const json = buildDefinitions({
      messageFlows: {
        id: 'message_flow_id_0',
        name: 'message flow name',
        sourceRef: 'source_id_0',
        targetRef: 'target_id_0',
      },
      process: [
        {
          withParticipant: true,
          id: 'participant_0',
          task: {},
          event: [
            {
              bpmnKind: 'startEvent',
              name: 'startEvent',
              isInterrupting: true,
              eventDefinitionParameter: {
                eventDefinitionKind: 'message',
                eventDefinitionOn: EventDefinitionOn.EVENT,
              },
            },
            {
              bpmnKind: 'endEvent',
              name: 'endEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'terminate',
                eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
              },
            },
          ],
        },
        {
          withParticipant: true,
          id: 'participant_1',
          task: { id: 'task_id_1' },
          event: [
            {
              bpmnKind: 'startEvent',
              name: 'startEvent',
              isInterrupting: false,
              eventDefinitionParameter: {
                eventDefinitionOn: EventDefinitionOn.NONE,
              },
            },
          ],
          gateway: {
            id: 'exclusiveGateway',
            bpmnKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
          },
        },
        {
          id: 'process_2',
          event: [
            {
              bpmnKind: 'intermediateCatchEvent',
              name: 'intermediateCatchEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'timer',
                eventDefinitionOn: EventDefinitionOn.BOTH,
              },
            },
          ],
          callActivity: { calledElement: 'process_participant_0' },
        },
      ],
    });

    expect(json).toEqual({
      definitions: {
        targetNamespace: '',
        collaboration: {
          id: 'collaboration_id_0',
          participant: [
            { id: 'participant_0', processRef: 'process_participant_0' },
            { id: 'participant_1', processRef: 'process_participant_1' },
          ],
          messageFlow: {
            id: 'message_flow_id_0',
            name: 'message flow name',
            sourceRef: 'source_id_0',
            targetRef: 'target_id_0',
          },
        },
        terminateEventDefinition: {
          id: 'event_definition_id',
        },
        timerEventDefinition: {
          id: 'event_definition_id',
        },
        process: [
          {
            id: 'process_participant_0',
            task: {
              id: 'task_id_0_0',
            },
            endEvent: {
              eventDefinitionRef: 'event_definition_id',
              id: 'event_id_0_1',
              name: 'endEvent',
            },
            startEvent: {
              cancelActivity: true,
              id: 'event_id_0_0',
              messageEventDefinition: '',
              name: 'startEvent',
            },
          },
          {
            id: 'process_participant_1',
            exclusiveGateway: {
              id: 'exclusiveGateway',
            },
            startEvent: {
              cancelActivity: false,
              id: 'event_id_1_0',
              name: 'startEvent',
            },
            task: {
              id: 'task_id_1',
            },
          },
          {
            id: 'process_2',
            intermediateCatchEvent: {
              eventDefinitionRef: 'event_definition_id',
              id: 'event_id_2_0',
              name: 'intermediateCatchEvent',
              timerEventDefinition: '',
            },
            callActivity: {
              id: 'callActivity_id_2_0',
              calledElement: 'process_participant_0',
            },
          },
        ],
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {
            BPMNShape: [
              {
                id: `shape_participant_0`,
                bpmnElement: `participant_0`,
                Bounds: { x: 567, y: 345, width: 36, height: 45 },
              },
              {
                bpmnElement: 'task_id_0_0',
                id: 'shape_task_id_0_0',
                Bounds: { x: 362, y: 232, height: 45, width: 36 },
              },
              {
                bpmnElement: 'event_id_0_0',
                id: 'shape_event_id_0_0',
                Bounds: { x: 362, y: 232, height: 45, width: 36 },
              },
              {
                bpmnElement: 'event_id_0_1',
                id: 'shape_event_id_0_1',
                Bounds: { x: 362, y: 232, height: 45, width: 36 },
              },
              {
                id: `shape_participant_1`,
                bpmnElement: `participant_1`,
                Bounds: { x: 567, y: 345, width: 36, height: 45 },
              },
              {
                bpmnElement: 'task_id_1',
                id: 'shape_task_id_1',
                Bounds: { x: 362, y: 232, height: 45, width: 36 },
              },
              {
                bpmnElement: 'exclusiveGateway',
                id: 'shape_exclusiveGateway',
                Bounds: { x: 567, y: 345, height: 25, width: 25 },
              },
              {
                bpmnElement: 'event_id_1_0',
                id: 'shape_event_id_1_0',
                Bounds: { x: 362, y: 232, height: 45, width: 36 },
              },
              {
                bpmnElement: 'callActivity_id_2_0',
                id: 'shape_callActivity_id_2_0',
                Bounds: { x: 346, y: 856, height: 56, width: 45 },
                isExpanded: false,
              },
              {
                bpmnElement: 'event_id_2_0',
                id: 'shape_event_id_2_0',
                Bounds: { x: 362, y: 232, height: 45, width: 36 },
              },
            ],
            BPMNEdge: {
              id: 'edge_message_flow_id_0',
              bpmnElement: 'message_flow_id_0',
              waypoint: [
                { x: 567, y: 345 },
                { x: 587, y: 345 },
              ],
            },
          },
        },
      },
    });
  });

  describe('build json with participant', () => {
    it('build json of definitions containing one participant', () => {
      const json = buildDefinitions({
        process: {
          id: 'participant_id_0',
          withParticipant: true,
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
            participant: { id: 'participant_id_0', processRef: 'process_participant_id_0' },
          },
          process: {
            id: 'process_participant_id_0',
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_participant_id_0',
                bpmnElement: 'participant_id_0',
                Bounds: { x: 567, y: 345, width: 36, height: 45 },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing 2 participants', () => {
      const json = buildDefinitions({
        process: [
          {
            id: 'participant_id_0',
            withParticipant: true,
          },
          {
            id: 'participant_id_1',
            withParticipant: true,
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
            participant: [
              { id: 'participant_id_0', processRef: 'process_participant_id_0' },
              { id: 'participant_id_1', processRef: 'process_participant_id_1' },
            ],
          },
          process: [
            {
              id: 'process_participant_id_0',
            },
            {
              id: 'process_participant_id_1',
            },
          ],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_participant_id_0',
                  bpmnElement: 'participant_id_0',
                  Bounds: { x: 567, y: 345, width: 36, height: 45 },
                },
                {
                  id: 'shape_participant_id_1',
                  bpmnElement: 'participant_id_1',
                  Bounds: { x: 567, y: 345, width: 36, height: 45 },
                },
              ],
            },
          },
        },
      });
    });

    it('build json of definitions containing no participant', () => {
      const json = buildDefinitions({
        process: {
          id: 'process_id_0',
          withParticipant: false,
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: {
            id: 'process_id_0',
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {},
          },
        },
      });
    });

    it('build json of definitions containing one participant and one not participant', () => {
      const json = buildDefinitions({
        process: [
          {
            id: 'process_id_0',
            withParticipant: false,
          },
          {
            id: 'participant_id_1',
            withParticipant: true,
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
            participant: [{ id: 'participant_id_1', processRef: 'process_participant_id_1' }],
          },
          process: [
            {
              id: 'process_id_0',
            },
            {
              id: 'process_participant_id_1',
            },
          ],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_participant_id_1',
                bpmnElement: 'participant_id_1',
                Bounds: { x: 567, y: 345, width: 36, height: 45 },
              },
            },
          },
        },
      });
    });
  });

  describe('build json with boundary event', () => {
    describe('build json with interrupting boundary event', () => {
      it('build json of definitions containing one process with task and interrupting boundary event (with empty messageEventDefinition, name & id)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                attachedToRef: 'task_id_0_0',
                name: 'name',
                id: 'another_id',
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT },
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'another_id',
                cancelActivity: true,
                attachedToRef: 'task_id_0_0',
                messageEventDefinition: '',
                name: 'name',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_another_id',
                    bpmnElement: 'another_id',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing one process with task and interrupting boundary event (with empty signalEventDefinition)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.EVENT },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                attachedToRef: 'task_id_0_0',
                signalEventDefinition: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing one process with task and interrupting boundary event (with several signalEventDefinitions)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.EVENT, withMultipleDefinitions: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                attachedToRef: 'task_id_0_0',
                signalEventDefinition: ['', {}],
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it("build json of definitions containing one process with task and interrupting boundary event (with messageEventDefinition & signalEventDefinition) when eventDefinitionKind='message'", () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT, withDifferentDefinition: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                attachedToRef: 'task_id_0_0',
                signalEventDefinition: '',
                messageEventDefinition: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it("build json of definitions containing one process with task and interrupting boundary event (with messageEventDefinition & signalEventDefinition) when eventDefinitionKind='signal'", () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.EVENT, withDifferentDefinition: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                attachedToRef: 'task_id_0_0',
                signalEventDefinition: '',
                messageEventDefinition: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing one messageEventDefinition, one process with task and interrupting boundary event (with eventDefinitionRef)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: { id: 'event_definition_id' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                eventDefinitionRef: 'event_definition_id',
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing several messageEventDefinitions, one process with task and interrupting boundary event (with eventDefinitionRef)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS, withMultipleDefinitions: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: [{ id: 'event_definition_1_id' }, { id: 'event_definition_2_id' }],
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it("build json of definitions containing messageEventDefinition & signalEventDefinition, one process with task and interrupting boundary event (with eventDefinitionRef) when eventDefinitionKind='message'", () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS, withDifferentDefinition: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: { id: 'event_definition_id' },
            signalEventDefinition: { id: 'other_event_definition_id' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                eventDefinitionRef: ['event_definition_id', 'other_event_definition_id'],
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it("build json of definitions containing messageEventDefinition & signalEventDefinition, one process with task and interrupting boundary event (with eventDefinitionRef) when eventDefinitionKind='signal'", () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.DEFINITIONS, withDifferentDefinition: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: { id: 'other_event_definition_id' },
            signalEventDefinition: { id: 'event_definition_id' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                eventDefinitionRef: ['event_definition_id', 'other_event_definition_id'],
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing messageEventDefinition & signalEventDefinition, one process with task and interrupting boundary event (with several messageEventDefinitions and eventDefinitionRef)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.BOTH, withMultipleDefinitions: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: [{ id: 'event_definition_1_id' }, { id: 'event_definition_2_id' }],
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
                messageEventDefinition: ['', {}],
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing messageEventDefinition & signalEventDefinition, one process with task and interrupting boundary event (with messageEventDefinition & signalEventDefinition and eventDefinitionRef)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'terminate', eventDefinitionOn: EventDefinitionOn.BOTH, withDifferentDefinition: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            signalEventDefinition: { id: 'other_event_definition_id' },
            terminateEventDefinition: { id: 'event_definition_id' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                eventDefinitionRef: ['event_definition_id', 'other_event_definition_id'],
                signalEventDefinition: '',
                terminateEventDefinition: '',
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing 2 process with interrupting boundary event', () => {
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT };
        const json = buildDefinitions({
          process: [
            {
              event: [
                {
                  bpmnKind: 'boundaryEvent',
                  eventDefinitionParameter,
                  isInterrupting: true,
                  attachedToRef: 'task_id_0_0',
                },
              ],
            },
            {
              event: [
                {
                  bpmnKind: 'boundaryEvent',
                  eventDefinitionParameter,
                  isInterrupting: true,
                  attachedToRef: 'task_id_0_0',
                },
              ],
            },
          ],
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: [
              {
                id: '0',
                boundaryEvent: {
                  id: 'event_id_0_0',
                  messageEventDefinition: '',
                  cancelActivity: true,
                  attachedToRef: 'task_id_0_0',
                },
              },
              {
                id: '1',
                boundaryEvent: {
                  id: 'event_id_1_0',
                  messageEventDefinition: '',
                  cancelActivity: true,
                  attachedToRef: 'task_id_0_0',
                },
              },
            ],
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_1_0',
                    bpmnElement: 'event_id_1_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });
    });

    describe('build json with non-interrupting boundary event', () => {
      it('build json of definitions containing one process with task and non-interrupting boundary event (with empty messageEventDefinition, name & id, without cancelActivity)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                attachedToRef: 'task_id_0_0',
                name: 'name',
                id: 'another_id',
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT },
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'another_id',
                attachedToRef: 'task_id_0_0',
                messageEventDefinition: '',
                name: 'name',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_another_id',
                    bpmnElement: 'another_id',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing one process with task and non-interrupting boundary event (with empty signalEventDefinition and cancelActivity)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.EVENT },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                attachedToRef: 'task_id_0_0',
                signalEventDefinition: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing one process with task and non-interrupting boundary event (with empty signalEventDefinition)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.EVENT },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                attachedToRef: 'task_id_0_0',
                signalEventDefinition: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing one process with task and non-interrupting boundary event (with several signalEventDefinitions)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.EVENT, withMultipleDefinitions: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                attachedToRef: 'task_id_0_0',
                signalEventDefinition: ['', {}],
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it("build json of definitions containing one process with task and non-interrupting boundary event (with messageEventDefinition & signalEventDefinition) when eventDefinitionKind='message'", () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT, withDifferentDefinition: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                attachedToRef: 'task_id_0_0',
                signalEventDefinition: '',
                messageEventDefinition: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it("build json of definitions containing one process with task and non-interrupting boundary event (with messageEventDefinition & signalEventDefinition) when eventDefinitionKind='signal'", () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.EVENT, withDifferentDefinition: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                attachedToRef: 'task_id_0_0',
                signalEventDefinition: '',
                messageEventDefinition: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing one messageEventDefinition, one process with task and non-interrupting boundary event (with eventDefinitionRef)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: { id: 'event_definition_id' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                eventDefinitionRef: 'event_definition_id',
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing several messageEventDefinitions, one process with task and non-interrupting boundary event (with eventDefinitionRef)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS, withMultipleDefinitions: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: [{ id: 'event_definition_1_id' }, { id: 'event_definition_2_id' }],
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it("build json of definitions containing messageEventDefinition & signalEventDefinition, one process with task and non-interrupting boundary event (with eventDefinitionRef) when eventDefinitionKind='message'", () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS, withDifferentDefinition: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: { id: 'event_definition_id' },
            signalEventDefinition: { id: 'other_event_definition_id' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                eventDefinitionRef: ['event_definition_id', 'other_event_definition_id'],
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it("build json of definitions containing messageEventDefinition & signalEventDefinition, one process with task and non-interrupting boundary event (with eventDefinitionRef) when eventDefinitionKind='signal'", () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.DEFINITIONS, withDifferentDefinition: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: { id: 'other_event_definition_id' },
            signalEventDefinition: { id: 'event_definition_id' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                eventDefinitionRef: ['event_definition_id', 'other_event_definition_id'],
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing messageEventDefinition & signalEventDefinition, one process with task and non-interrupting boundary event (with several messageEventDefinitions and eventDefinitionRef)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.BOTH, withMultipleDefinitions: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: [{ id: 'event_definition_1_id' }, { id: 'event_definition_2_id' }],
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
                messageEventDefinition: ['', {}],
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing messageEventDefinition & signalEventDefinition, one process with task and non-interrupting boundary event (with messageEventDefinition & signalEventDefinition and eventDefinitionRef)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                eventDefinitionParameter: { eventDefinitionKind: 'terminate', eventDefinitionOn: EventDefinitionOn.BOTH, withDifferentDefinition: true },
                attachedToRef: 'task_id_0_0',
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            signalEventDefinition: { id: 'other_event_definition_id' },
            terminateEventDefinition: { id: 'event_definition_id' },
            process: {
              id: '0',
              task: { id: 'task_id_0_0' },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                eventDefinitionRef: ['event_definition_id', 'other_event_definition_id'],
                signalEventDefinition: '',
                terminateEventDefinition: '',
                attachedToRef: 'task_id_0_0',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing 2 process with non-interrupting boundary event', () => {
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT };
        const json = buildDefinitions({
          process: [
            {
              event: [
                {
                  bpmnKind: 'boundaryEvent',
                  isInterrupting: false,
                  eventDefinitionParameter,
                  attachedToRef: 'task_id_0_0',
                },
              ],
            },
            {
              event: [
                {
                  bpmnKind: 'boundaryEvent',
                  isInterrupting: false,
                  eventDefinitionParameter,
                  attachedToRef: 'task_id_0_0',
                },
              ],
            },
          ],
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: [
              {
                id: '0',
                boundaryEvent: {
                  id: 'event_id_0_0',
                  messageEventDefinition: '',
                  cancelActivity: false,
                  attachedToRef: 'task_id_0_0',
                },
              },
              {
                id: '1',
                boundaryEvent: {
                  id: 'event_id_1_0',
                  messageEventDefinition: '',
                  cancelActivity: false,
                  attachedToRef: 'task_id_0_0',
                },
              },
            ],
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_1_0',
                    bpmnElement: 'event_id_1_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });
    });
  });

  describe.each(['startEvent', 'endEvent', 'intermediateCatchEvent', 'intermediateThrowEvent'] as (OtherBuildEventKind | 'startEvent')[])(
    'build json with %s',
    (bpmnKind: OtherBuildEventKind | 'startEvent') => {
      it(`build json of definitions containing one process with ${bpmnKind} (without eventDefinition, name & id)`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.NONE, eventDefinition: { id: '9' } },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              [bpmnKind]: { id: 'event_id_0_0' },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing one process with ${bpmnKind} (with one messageEventDefinition, name & id)`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                name: 'name',
                id: 'another_id',
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              [bpmnKind]: {
                id: 'another_id',
                messageEventDefinition: '',
                name: 'name',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_another_id',
                  bpmnElement: 'another_id',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing one process with ${bpmnKind} (with several messageEventDefinitions (empty string & empty object))`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'message',
                  eventDefinitionOn: EventDefinitionOn.EVENT,
                  withMultipleDefinitions: true,
                },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              [bpmnKind]: {
                id: 'event_id_0_0',
                messageEventDefinition: ['', {}],
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing one process with ${bpmnKind} (with messageEventDefinition & signalEventDefinition) when eventDefinitionKind='message'`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'message',
                  eventDefinitionOn: EventDefinitionOn.EVENT,
                  withDifferentDefinition: true,
                },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              [bpmnKind]: {
                id: 'event_id_0_0',
                messageEventDefinition: '',
                signalEventDefinition: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing one process with ${bpmnKind} (with messageEventDefinition & signalEventDefinition) when eventDefinitionKind='signal'`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'signal',
                  eventDefinitionOn: EventDefinitionOn.EVENT,
                  withDifferentDefinition: true,
                },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              [bpmnKind]: {
                id: 'event_id_0_0',
                messageEventDefinition: '',
                signalEventDefinition: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing one messageEventDefinition, one process with ${bpmnKind} (with eventDefinitionRef)`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: { id: 'event_definition_id' },
            process: {
              id: '0',
              [bpmnKind]: {
                id: 'event_id_0_0',
                eventDefinitionRef: 'event_definition_id',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing several messageEventDefinitions, one process with ${bpmnKind} (with eventDefinitionRef)`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'message',
                  eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
                  withMultipleDefinitions: true,
                },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: [{ id: 'event_definition_1_id' }, { id: 'event_definition_2_id' }],
            process: {
              id: '0',
              [bpmnKind]: {
                id: 'event_id_0_0',
                eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing messageEventDefinition & signalEventDefinition, one process with ${bpmnKind} (with eventDefinitionRef) when eventDefinitionKind='message'`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'message',
                  eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
                  withDifferentDefinition: true,
                },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: { id: 'event_definition_id' },
            signalEventDefinition: { id: 'other_event_definition_id' },
            process: {
              id: '0',
              [bpmnKind]: {
                id: 'event_id_0_0',
                eventDefinitionRef: ['event_definition_id', 'other_event_definition_id'],
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing messageEventDefinition & signalEventDefinition, one process with ${bpmnKind} (with eventDefinitionRef) when eventDefinitionKind='signal'`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'signal',
                  eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
                  withDifferentDefinition: true,
                },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: { id: 'other_event_definition_id' },
            signalEventDefinition: { id: 'event_definition_id' },
            process: {
              id: '0',
              [bpmnKind]: {
                id: 'event_id_0_0',
                eventDefinitionRef: ['event_definition_id', 'other_event_definition_id'],
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing several messageEventDefinitions, one process with ${bpmnKind} (with several messageEventDefinitions and eventDefinitionRef)`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'message',
                  eventDefinitionOn: EventDefinitionOn.BOTH,
                  withMultipleDefinitions: true,
                },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: [{ id: 'event_definition_1_id' }, { id: 'event_definition_2_id' }],
            process: {
              id: '0',
              [bpmnKind]: {
                id: 'event_id_0_0',
                eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
                messageEventDefinition: ['', {}],
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing messageEventDefinition & signalEventDefinition, one process with ${bpmnKind} (with messageEventDefinition & signalEventDefinition and eventDefinitionRef)`, () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind,
                eventDefinitionParameter: {
                  eventDefinitionKind: 'message',
                  eventDefinitionOn: EventDefinitionOn.BOTH,
                  withDifferentDefinition: true,
                },
              },
            ],
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            messageEventDefinition: { id: 'event_definition_id' },
            signalEventDefinition: { id: 'other_event_definition_id' },
            process: {
              id: '0',
              [bpmnKind]: {
                id: 'event_id_0_0',
                eventDefinitionRef: ['event_definition_id', 'other_event_definition_id'],
                messageEventDefinition: '',
                signalEventDefinition: '',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing 2 process with ${bpmnKind}`, () => {
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT };
        const json = buildDefinitions({
          process: [{ event: [{ bpmnKind, eventDefinitionParameter }] }, { event: [{ bpmnKind, eventDefinitionParameter }] }],
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: [
              {
                id: '0',
                [bpmnKind]: {
                  id: 'event_id_0_0',
                  messageEventDefinition: '',
                },
              },
              {
                id: '1',
                [bpmnKind]: {
                  id: 'event_id_1_0',
                  messageEventDefinition: '',
                },
              },
            ],
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: 'shape_event_id_1_0',
                    bpmnElement: 'event_id_1_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      if (bpmnKind === 'startEvent') {
        it('build json of definitions containing one process with interrupting startEvent', () => {
          const json = buildDefinitions({
            process: {
              event: [
                {
                  bpmnKind,
                  eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.NONE, eventDefinition: {} },
                  isInterrupting: true,
                },
              ],
            },
          });

          expect(json).toEqual({
            definitions: {
              targetNamespace: '',
              collaboration: { id: 'collaboration_id_0' },
              process: {
                id: '0',
                startEvent: { id: 'event_id_0_0', cancelActivity: true },
              },
              BPMNDiagram: {
                name: 'process 0',
                BPMNPlane: {
                  BPMNShape: {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                },
              },
            },
          });
        });

        it('build json of definitions containing one process with non-interrupting startEvent', () => {
          const json = buildDefinitions({
            process: {
              event: [
                {
                  bpmnKind,
                  eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.NONE, eventDefinition: {} },
                  isInterrupting: false,
                },
              ],
            },
          });

          expect(json).toEqual({
            definitions: {
              targetNamespace: '',
              collaboration: { id: 'collaboration_id_0' },
              process: {
                id: '0',
                startEvent: { id: 'event_id_0_0', cancelActivity: false },
              },
              BPMNDiagram: {
                name: 'process 0',
                BPMNPlane: {
                  BPMNShape: {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                },
              },
            },
          });
        });
      }
    },
  );

  describe.each(['task', 'businessRuleTask', 'manualTask', 'receiveTask', 'sendTask', 'serviceTask', 'scriptTask', 'userTask'] as BuildTaskKind[])(
    'build json with %s',
    (bpmnKind: BuildTaskKind) => {
      it(`build json of definitions containing one process with ${bpmnKind} (with id & name)`, () => {
        const json = buildDefinitions({
          process: {
            task: { id: '0', bpmnKind, name: 'name' },
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              [bpmnKind]: { id: '0', name: 'name' },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_0',
                  bpmnElement: '0',
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing one process with ${bpmnKind} (without id & name)`, () => {
        const json = buildDefinitions({
          process: {
            task: { bpmnKind },
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: {
              id: '0',
              [bpmnKind]: { id: `${bpmnKind}_id_0_0` },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: `shape_${bpmnKind}_id_0_0`,
                  bpmnElement: `${bpmnKind}_id_0_0`,
                  Bounds: { x: 362, y: 232, width: 36, height: 45 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing 2 processes with ${bpmnKind} (without id)`, () => {
        const json = buildDefinitions({
          process: [{ task: { bpmnKind } }, { task: { bpmnKind } }],
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: [
              {
                id: '0',
                [bpmnKind]: { id: `${bpmnKind}_id_0_0` },
              },
              {
                id: '1',
                [bpmnKind]: { id: `${bpmnKind}_id_1_0` },
              },
            ],
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: `shape_${bpmnKind}_id_0_0`,
                    bpmnElement: `${bpmnKind}_id_0_0`,
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                  {
                    id: `shape_${bpmnKind}_id_1_0`,
                    bpmnElement: `${bpmnKind}_id_1_0`,
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                ],
              },
            },
          },
        });
      });

      if (bpmnKind === 'task') {
        it(`build json of definitions containing one process with task (without bpmnKind)`, () => {
          const json = buildDefinitions({
            process: {
              task: {},
            },
          });

          expect(json).toEqual({
            definitions: {
              targetNamespace: '',
              collaboration: { id: 'collaboration_id_0' },
              process: {
                id: '0',
                task: { id: 'task_id_0_0' },
              },
              BPMNDiagram: {
                name: 'process 0',
                BPMNPlane: {
                  BPMNShape: {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: { x: 362, y: 232, width: 36, height: 45 },
                  },
                },
              },
            },
          });
        });
      }
    },
  );

  describe.each(['complexGateway', 'eventBasedGateway', 'exclusiveGateway', 'inclusiveGateway', 'parallelGateway'] as BuildGatewayKind[])(
    'build json with %s',
    (bpmnKind: BuildGatewayKind) => {
      it(`build json of definitions containing one process with ${bpmnKind} (with id & name)`, () => {
        const json = buildDefinitions({
          process: {
            gateway: {
              id: 'gateway_id_4',
              bpmnKind,
              name: `${bpmnKind} name`,
            },
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: { id: '0', [bpmnKind]: { id: 'gateway_id_4', name: `${bpmnKind} name` } },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_gateway_id_4',
                  bpmnElement: 'gateway_id_4',
                  Bounds: { x: 567, y: 345, width: 25, height: 25 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing one process with ${bpmnKind} (without id & name)`, () => {
        const json = buildDefinitions({
          process: {
            gateway: { bpmnKind },
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: { id: '0', [bpmnKind]: { id: `${bpmnKind}_id_0_0` } },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: `shape_${bpmnKind}_id_0_0`,
                  bpmnElement: `${bpmnKind}_id_0_0`,
                  Bounds: { x: 567, y: 345, width: 25, height: 25 },
                },
              },
            },
          },
        });
      });

      it(`build json of definitions containing 2 processes with ${bpmnKind} (without id)`, () => {
        const json = buildDefinitions({
          process: [{ gateway: { bpmnKind } }, { gateway: { bpmnKind } }],
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: { id: 'collaboration_id_0' },
            process: [
              { id: '0', [bpmnKind]: { id: `${bpmnKind}_id_0_0` } },
              { id: '1', [bpmnKind]: { id: `${bpmnKind}_id_1_0` } },
            ],
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: `shape_${bpmnKind}_id_0_0`,
                    bpmnElement: `${bpmnKind}_id_0_0`,
                    Bounds: { x: 567, y: 345, width: 25, height: 25 },
                  },
                  {
                    id: `shape_${bpmnKind}_id_1_0`,
                    bpmnElement: `${bpmnKind}_id_1_0`,
                    Bounds: { x: 567, y: 345, width: 25, height: 25 },
                  },
                ],
              },
            },
          },
        });
      });
    },
  );

  describe('build json with call activity', () => {
    it('build json of definitions containing one process with call activity (with id, name and expanded)', () => {
      const json = buildDefinitions({
        process: {
          callActivity: { id: '0', name: 'name', calledElement: 'called_process', isExpanded: true },
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: { id: 'collaboration_id_0' },
          process: {
            id: '0',
            callActivity: {
              id: '0',
              name: 'name',
              calledElement: 'called_process',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_0',
                bpmnElement: '0',
                Bounds: { x: 346, y: 856, width: 45, height: 56 },
                isExpanded: true,
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing one process with call activity (not expanded)', () => {
      const json = buildDefinitions({
        process: {
          callActivity: { id: '0', calledElement: 'called_process', isExpanded: false },
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: { id: 'collaboration_id_0' },
          process: {
            id: '0',
            callActivity: { id: '0', calledElement: 'called_process' },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_0',
                bpmnElement: '0',
                Bounds: { x: 346, y: 856, width: 45, height: 56 },
                isExpanded: false,
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing one process with call activity (without id, name and isExpanded)', () => {
      const json = buildDefinitions({
        process: {
          callActivity: { calledElement: 'called_process' },
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: { id: 'collaboration_id_0' },
          process: {
            id: '0',
            callActivity: { id: 'callActivity_id_0_0', calledElement: 'called_process' },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_callActivity_id_0_0',
                bpmnElement: 'callActivity_id_0_0',
                Bounds: { x: 346, y: 856, width: 45, height: 56 },
                isExpanded: false,
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing 2 processes with call activity (without id)', () => {
      const json = buildDefinitions({
        process: [{ callActivity: { calledElement: 'called_process' } }, { callActivity: { calledElement: 'called_process' } }],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: { id: 'collaboration_id_0' },
          process: [
            {
              id: '0',
              callActivity: { id: 'callActivity_id_0_0', calledElement: 'called_process' },
            },
            {
              id: '1',
              callActivity: { id: 'callActivity_id_1_0', calledElement: 'called_process' },
            },
          ],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_callActivity_id_0_0',
                  bpmnElement: 'callActivity_id_0_0',
                  Bounds: { x: 346, y: 856, width: 45, height: 56 },
                  isExpanded: false,
                },
                {
                  id: 'shape_callActivity_id_1_0',
                  bpmnElement: 'callActivity_id_1_0',
                  Bounds: { x: 346, y: 856, width: 45, height: 56 },
                  isExpanded: false,
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('build json with subProcess', () => {
    it('build json of definitions containing one process with subProcess (with id & name)', () => {
      const json = buildDefinitions({
        process: {
          subProcess: { id: '0', name: 'subProcess name' },
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: { id: 'collaboration_id_0' },
          process: {
            id: '0',
            subProcess: { id: '0', name: 'subProcess name' },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_0',
                bpmnElement: '0',
                Bounds: { x: 67, y: 23, width: 456, height: 123 },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing one process with subProcess (without id & name)', () => {
      const json = buildDefinitions({
        process: {
          subProcess: {},
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: { id: 'collaboration_id_0' },
          process: {
            id: '0',
            subProcess: { id: 'subProcess_id_0_0' },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_subProcess_id_0_0',
                bpmnElement: 'subProcess_id_0_0',
                Bounds: { x: 67, y: 23, width: 456, height: 123 },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing 2 processes with subProcess (without id)', () => {
      const json = buildDefinitions({
        process: [{ subProcess: {} }, { subProcess: {} }],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: { id: 'collaboration_id_0' },
          process: [
            {
              id: '0',
              subProcess: { id: 'subProcess_id_0_0' },
            },
            {
              id: '1',
              subProcess: { id: 'subProcess_id_1_0' },
            },
          ],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_subProcess_id_0_0',
                  bpmnElement: 'subProcess_id_0_0',
                  Bounds: { x: 67, y: 23, width: 456, height: 123 },
                },
                {
                  id: 'shape_subProcess_id_1_0',
                  bpmnElement: 'subProcess_id_1_0',
                  Bounds: { x: 67, y: 23, width: 456, height: 123 },
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('build json with message flow', () => {
    it('build json of definitions containing 2 participants and one message flow between pools', () => {
      const json = buildDefinitions({
        messageFlows: {
          id: 'message_flow_id_0',
          name: 'message flow name',
          sourceRef: 'source_id_0',
          targetRef: 'target_id_0',
        },
        process: [
          { withParticipant: true, id: 'source_id_0' },
          { withParticipant: true, id: 'target_id_0' },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
            participant: [
              { id: 'source_id_0', processRef: 'process_source_id_0' },
              { id: 'target_id_0', processRef: 'process_target_id_0' },
            ],
            messageFlow: {
              id: 'message_flow_id_0',
              name: 'message flow name',
              sourceRef: 'source_id_0',
              targetRef: 'target_id_0',
            },
          },
          process: [{ id: 'process_source_id_0' }, { id: 'process_target_id_0' }],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: `shape_source_id_0`,
                  bpmnElement: `source_id_0`,
                  Bounds: { x: 567, y: 345, width: 36, height: 45 },
                },
                {
                  id: `shape_target_id_0`,
                  bpmnElement: `target_id_0`,
                  Bounds: { x: 567, y: 345, width: 36, height: 45 },
                },
              ],
              BPMNEdge: {
                id: 'edge_message_flow_id_0',
                bpmnElement: 'message_flow_id_0',
                waypoint: [
                  { x: 567, y: 345 },
                  { x: 587, y: 345 },
                ],
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing 2 participants and one message flow between element of pools', () => {
      const json = buildDefinitions({
        messageFlows: {
          id: 'message_flow_id_0',
          name: 'message flow name',
          sourceRef: 'source_id_0',
          targetRef: 'target_id_0',
        },
        process: [
          {
            withParticipant: true,
            gateway: {
              id: 'source_id_0',
              bpmnKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
            },
          },
          {
            withParticipant: true,
            gateway: {
              id: 'target_id_0',
              bpmnKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
            },
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
            participant: [
              { id: '0', processRef: 'process_0' },
              { id: '1', processRef: 'process_1' },
            ],
            messageFlow: {
              id: 'message_flow_id_0',
              name: 'message flow name',
              sourceRef: 'source_id_0',
              targetRef: 'target_id_0',
            },
          },
          process: [
            {
              id: 'process_0',
              exclusiveGateway: { id: 'source_id_0' },
            },
            {
              id: 'process_1',
              exclusiveGateway: { id: 'target_id_0' },
            },
          ],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: `shape_0`,
                  bpmnElement: `0`,
                  Bounds: { x: 567, y: 345, width: 36, height: 45 },
                },
                {
                  id: 'shape_source_id_0',
                  bpmnElement: 'source_id_0',
                  Bounds: { x: 567, y: 345, width: 25, height: 25 },
                },
                {
                  id: `shape_1`,
                  bpmnElement: `1`,
                  Bounds: { x: 567, y: 345, width: 36, height: 45 },
                },
                {
                  id: 'shape_target_id_0',
                  bpmnElement: 'target_id_0',
                  Bounds: { x: 567, y: 345, width: 25, height: 25 },
                },
              ],
              BPMNEdge: {
                id: 'edge_message_flow_id_0',
                bpmnElement: 'message_flow_id_0',
                waypoint: [
                  { x: 567, y: 345 },
                  { x: 587, y: 345 },
                ],
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing 2 participants and 2 message flows', () => {
      const json = buildDefinitions({
        messageFlows: [
          {
            id: 'message_flow_id_0',
            name: 'message flow name',
            sourceRef: 'source_id_0',
            targetRef: 'target_id_0',
          },
          {
            id: 'message_flow_id_1',
            name: 'message flow name',
            sourceRef: 'source_id_1',
            targetRef: 'target_id_1',
          },
        ],
        process: [
          {
            withParticipant: true,
            id: 'source_id_0',
            gateway: {
              id: 'source_id_1',
              bpmnKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
            },
          },
          {
            withParticipant: true,
            id: 'target_id_0',
            gateway: {
              id: 'target_id_1',
              bpmnKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
            },
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
            participant: [
              { id: 'source_id_0', processRef: 'process_source_id_0' },
              { id: 'target_id_0', processRef: 'process_target_id_0' },
            ],
            messageFlow: [
              {
                id: 'message_flow_id_0',
                name: 'message flow name',
                sourceRef: 'source_id_0',
                targetRef: 'target_id_0',
              },
              {
                id: 'message_flow_id_1',
                name: 'message flow name',
                sourceRef: 'source_id_1',
                targetRef: 'target_id_1',
              },
            ],
          },
          process: [
            {
              id: 'process_source_id_0',
              exclusiveGateway: { id: 'source_id_1' },
            },
            {
              id: 'process_target_id_0',
              exclusiveGateway: { id: 'target_id_1' },
            },
          ],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: `shape_source_id_0`,
                  bpmnElement: `source_id_0`,
                  Bounds: { x: 567, y: 345, width: 36, height: 45 },
                },
                {
                  id: 'shape_source_id_1',
                  bpmnElement: 'source_id_1',
                  Bounds: { x: 567, y: 345, width: 25, height: 25 },
                },
                {
                  id: `shape_target_id_0`,
                  bpmnElement: `target_id_0`,
                  Bounds: { x: 567, y: 345, width: 36, height: 45 },
                },
                {
                  id: 'shape_target_id_1',
                  bpmnElement: 'target_id_1',
                  Bounds: { x: 567, y: 345, width: 25, height: 25 },
                },
              ],
              BPMNEdge: [
                {
                  id: 'edge_message_flow_id_0',
                  bpmnElement: 'message_flow_id_0',
                  waypoint: [
                    { x: 567, y: 345 },
                    { x: 587, y: 345 },
                  ],
                },
                {
                  id: 'edge_message_flow_id_1',
                  bpmnElement: 'message_flow_id_1',
                  waypoint: [
                    { x: 567, y: 345 },
                    { x: 587, y: 345 },
                  ],
                },
              ],
            },
          },
        },
      });
    });
  });
});
