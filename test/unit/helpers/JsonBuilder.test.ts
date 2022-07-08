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

import type { BuildEventDefinitionParameter } from './JsonBuilder';
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
      withParticipant: true,
      messageFlows: {
        id: 'message_flow_id_0',
        name: 'message flow name',
        sourceRef: 'source_id_0',
        targetRef: 'target_id_0',
      },
      process: [
        {
          id: 'participant_0',
          task: {},
          event: [
            {
              bpmnKind: 'startEvent',
              name: 'startEvent',
              isInterrupting: false,
              eventDefinitionParameter: {
                eventDefinitionKind: 'message',
                eventDefinitionOn: EventDefinitionOn.EVENT,
              },
            },
            {
              bpmnKind: 'endEvent',
              name: 'endEvent',
              isInterrupting: true,
              eventDefinitionParameter: {
                eventDefinitionKind: 'terminate',
                eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
              },
            },
          ],
        },
        {
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
          exclusiveGateway: {
            id: 'exclusiveGateway',
          },
        },
        {
          id: 'participant_2',
          event: [
            {
              bpmnKind: 'intermediateCatchEvent',
              name: 'intermediateCatchEvent',
              isInterrupting: false,
              eventDefinitionParameter: {
                eventDefinitionKind: 'timer',
                eventDefinitionOn: EventDefinitionOn.BOTH,
              },
            },
          ],
          callActivity: {},
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
            { id: 'participant_2', processRef: 'process_participant_2' },
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
              name: 'task name',
            },
            endEvent: {
              cancelActivity: true,
              eventDefinitionRef: 'event_definition_id',
              id: 'event_id_0_1',
              name: 'endEvent',
            },
            startEvent: {
              cancelActivity: false,
              id: 'event_id_0_0',
              messageEventDefinition: '',
              name: 'startEvent',
            },
          },
          {
            id: 'process_participant_1',
            exclusiveGateway: {
              id: 'exclusiveGateway',
              name: 'exclusiveGateway name',
            },
            startEvent: {
              cancelActivity: false,
              id: 'event_id_1_0',
              name: 'startEvent',
            },
            task: {
              id: 'task_id_1',
              name: 'task name',
            },
          },
          {
            id: 'process_participant_2',
            intermediateCatchEvent: {
              cancelActivity: false,
              eventDefinitionRef: 'event_definition_id',
              id: 'event_id_2_0',
              name: 'intermediateCatchEvent',
              timerEventDefinition: '',
            },
            callActivity: {
              id: 'callActivity_id_2_0',
              name: 'callActivity name',
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
                id: `shape_participant_2`,
                bpmnElement: `participant_2`,
                Bounds: { x: 567, y: 345, width: 36, height: 45 },
              },
              {
                bpmnElement: 'callActivity_id_2_0',
                id: 'shape_callActivity_id_2_0',
                Bounds: { x: 346, y: 856, height: 56, width: 45 },
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
              Bounds: { x: 567, y: 345, width: 36, height: 45 },
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
        withParticipant: true,
        process: {
          id: 'participant_id_0',
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
        withParticipant: true,
        process: [
          {
            id: 'participant_id_0',
          },
          {
            id: 'participant_id_1',
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
        withParticipant: false,
        process: {
          id: 'process_id_0',
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
  });

  describe('build json with boundary event', () => {
    describe('build json with interrupting boundary event', () => {
      it('build json of definitions containing one process with task and interrupting boundary event (with attachedToRef & empty messageEventDefinition)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                attachedToRef: 'task_id_0_0',
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT },
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: {
              id: 'collaboration_id_0',
            },
            process: {
              id: '0',
              task: {
                id: 'task_id_0_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                attachedToRef: 'task_id_0_0',
                messageEventDefinition: '',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
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
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: {
              id: 'collaboration_id_0',
            },
            process: {
              id: '0',
              task: {
                id: 'task_id_0_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                attachedToRef: undefined,
                signalEventDefinition: '',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing one messageEventDefinition (with id), one process with task and interrupting boundary event (with eventDefinitionRef)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: true,
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS },
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: {
              id: 'collaboration_id_0',
            },
            messageEventDefinition: {
              id: 'event_definition_id',
            },
            process: {
              id: '0',
              task: {
                id: 'task_id_0_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: true,
                eventDefinitionRef: 'event_definition_id',
                attachedToRef: undefined,
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                ],
              },
            },
          },
        });
      });
    });

    describe('build json with non-interrupting boundary event', () => {
      it('build json of definitions containing one process with task and non-interrupting boundary event (with attachedToRef, empty messageEventDefinition and name, without cancelActivity)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                attachedToRef: 'task_id_0_0',
                name: 'name',
                eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT },
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: {
              id: 'collaboration_id_0',
            },
            process: {
              id: '0',
              task: {
                id: 'task_id_0_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0_0',
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
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
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
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: {
              id: 'collaboration_id_0',
            },
            process: {
              id: '0',
              task: {
                id: 'task_id_0_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                attachedToRef: undefined,
                signalEventDefinition: '',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
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
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: {
              id: 'collaboration_id_0',
            },
            process: {
              id: '0',
              task: {
                id: 'task_id_0_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                attachedToRef: undefined,
                signalEventDefinition: '',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                ],
              },
            },
          },
        });
      });

      it('build json of definitions containing one signalEventDefinition (with id), one process with task and non-interrupting boundary event (with attachedToRef & eventDefinitionRef)', () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'boundaryEvent',
                isInterrupting: false,
                attachedToRef: 'task_id_0_0',
                eventDefinitionParameter: { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.DEFINITIONS },
              },
            ],
            task: {},
          },
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            collaboration: {
              id: 'collaboration_id_0',
            },
            signalEventDefinition: {
              id: 'event_definition_id',
            },
            process: {
              id: '0',
              task: {
                id: 'task_id_0_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0_0',
                cancelActivity: false,
                eventDefinitionRef: 'event_definition_id',
                attachedToRef: 'task_id_0_0',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0_0',
                    bpmnElement: 'task_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0_0',
                    bpmnElement: 'event_id_0_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                ],
              },
            },
          },
        });
      });
    });
  });

  describe('build json with start event', () => {
    it('build json of definitions containing one process with start event (with one messageEventDefinition & name)', () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              bpmnKind: 'startEvent',
              name: 'name',
              eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT },
            },
          ],
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: {
            id: '0',
            startEvent: {
              id: 'event_id_0_0',
              messageEventDefinition: '',
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0_0',
                bpmnElement: 'event_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing one process with start event (with several messageEventDefinitions (empty string & empty object) & name)', () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              bpmnKind: 'startEvent',
              name: 'name',
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
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: {
            id: '0',
            startEvent: {
              id: 'event_id_0_0',
              messageEventDefinition: ['', {}],
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0_0',
                bpmnElement: 'event_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing one messageEventDefinition (with id), one process with start event (with name)', () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              bpmnKind: 'endEvent',
              name: 'name',
              eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS },
            },
          ],
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          messageEventDefinition: {
            id: 'event_definition_id',
          },
          process: {
            id: '0',
            endEvent: {
              id: 'event_id_0_0',
              eventDefinitionRef: 'event_definition_id',
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0_0',
                bpmnElement: 'event_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing several messageEventDefinitions (with id), one process with start event (with name)', () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              bpmnKind: 'endEvent',
              name: 'name',
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
          collaboration: {
            id: 'collaboration_id_0',
          },
          messageEventDefinition: [
            {
              id: 'event_definition_1_id',
            },
            {
              id: 'event_definition_2_id',
            },
          ],
          process: {
            id: '0',
            endEvent: {
              id: 'event_id_0_0',
              eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0_0',
                bpmnElement: 'event_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing 2 process with start event', () => {
      const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT };
      const json = buildDefinitions({
        process: [
          {
            event: [
              {
                bpmnKind: 'startEvent',
                name: 'name',
                eventDefinitionParameter,
              },
            ],
          },
          {
            event: [
              {
                bpmnKind: 'startEvent',
                name: 'name',
                eventDefinitionParameter,
              },
            ],
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: [
            {
              id: '0',
              startEvent: {
                id: 'event_id_0_0',
                messageEventDefinition: '',
                name: 'name',
              },
            },
            {
              id: '1',
              startEvent: {
                id: 'event_id_1_0',
                messageEventDefinition: '',
                name: 'name',
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
                  Bounds: {
                    x: 362,
                    y: 232,
                    width: 36,
                    height: 45,
                  },
                },
                {
                  id: 'shape_event_id_1_0',
                  bpmnElement: 'event_id_1_0',
                  Bounds: {
                    x: 362,
                    y: 232,
                    width: 36,
                    height: 45,
                  },
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('build json with intermediate catch event', () => {
    it('build json of definitions containing one messageEventDefinition (with id), one process with intermediate catch event (with one messageEventDefinition & eventDefinitionRef & name)', () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              bpmnKind: 'intermediateCatchEvent',
              name: 'name',
              eventDefinitionParameter: { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.BOTH },
            },
          ],
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          messageEventDefinition: {
            id: 'event_definition_id',
          },
          process: {
            id: '0',
            intermediateCatchEvent: {
              id: 'event_id_0_0',
              messageEventDefinition: '',
              eventDefinitionRef: 'event_definition_id',
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0_0',
                bpmnElement: 'event_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing several messageEventDefinitions (with id), one process with intermediate catch event (with several messageEventDefinitions (empty string & empty object) & eventDefinitionRef & name)', () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              bpmnKind: 'intermediateCatchEvent',
              name: 'name',
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
          collaboration: {
            id: 'collaboration_id_0',
          },
          messageEventDefinition: [
            {
              id: 'event_definition_1_id',
            },
            {
              id: 'event_definition_2_id',
            },
          ],
          process: {
            id: '0',
            intermediateCatchEvent: {
              id: 'event_id_0_0',
              messageEventDefinition: ['', {}],
              eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0_0',
                bpmnElement: 'event_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });
  });

  describe('build json with intermediate throw event', () => {
    it('build json of definitions containing one process with intermediate throw event (without eventDefinition)', () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'message',
                eventDefinitionOn: EventDefinitionOn.NONE,
                eventDefinition: { id: '9' },
              },
            },
          ],
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: {
            id: '0',
            intermediateThrowEvent: {
              id: 'event_id_0_0',
              name: undefined,
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0_0',
                bpmnElement: 'event_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing one process with intermediate throw event (with messageEventDefinition)', () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'message',
                eventDefinitionOn: EventDefinitionOn.EVENT,
                eventDefinition: { id: '9' },
              },
            },
          ],
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: {
            id: '0',
            intermediateThrowEvent: {
              id: 'event_id_0_0',
              messageEventDefinition: { id: '9' },
              name: undefined,
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0_0',
                bpmnElement: 'event_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing one messageEventDefinition and one process with intermediate throw event (with eventDefinitionRef)', () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'message',
                eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
                eventDefinition: { id: '9' },
              },
            },
          ],
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          messageEventDefinition: { id: '9' },
          process: {
            id: '0',
            intermediateThrowEvent: {
              id: 'event_id_0_0',
              eventDefinitionRef: '9',
              name: undefined,
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0_0',
                bpmnElement: 'event_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });

    it(
      'build json of definitions containing one process with intermediate throw event (with messageEventDefinition & signalEventDefinition) ' +
        "when eventDefinitionKind='message' and withDifferentDefinition=true",
      () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'intermediateThrowEvent',
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
            collaboration: {
              id: 'collaboration_id_0',
            },
            process: {
              id: '0',
              intermediateThrowEvent: {
                id: 'event_id_0_0',
                messageEventDefinition: '',
                signalEventDefinition: '',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: {
                    x: 362,
                    y: 232,
                    width: 36,
                    height: 45,
                  },
                },
              },
            },
          },
        });
      },
    );

    it(
      'build json of definitions containing one process with intermediate throw event (with messageEventDefinition & signalEventDefinition) ' +
        "when eventDefinitionKind='signal' and withDifferentDefinition=true",
      () => {
        const json = buildDefinitions({
          process: {
            event: [
              {
                bpmnKind: 'intermediateThrowEvent',
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
            collaboration: {
              id: 'collaboration_id_0',
            },
            process: {
              id: '0',
              intermediateThrowEvent: {
                id: 'event_id_0_0',
                messageEventDefinition: '',
                signalEventDefinition: '',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0_0',
                  bpmnElement: 'event_id_0_0',
                  Bounds: {
                    x: 362,
                    y: 232,
                    width: 36,
                    height: 45,
                  },
                },
              },
            },
          },
        });
      },
    );

    it('build json of definitions containing messageEventDefinition & signalEventDefinition (with id), one process with intermediate throw event (with messageEventDefinition & signalEventDefinition & eventDefinitionRefs)', () => {
      const json = buildDefinitions({
        process: {
          event: [
            {
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'signal',
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
          collaboration: {
            id: 'collaboration_id_0',
          },
          messageEventDefinition: {
            id: 'other_event_definition_id',
          },
          signalEventDefinition: {
            id: 'event_definition_id',
          },
          process: {
            id: '0',
            intermediateThrowEvent: {
              id: 'event_id_0_0',
              messageEventDefinition: '',
              signalEventDefinition: '',
              eventDefinitionRef: ['event_definition_id', 'other_event_definition_id'],
              name: undefined,
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0_0',
                bpmnElement: 'event_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });
  });

  describe('build json with task', () => {
    it('build json of definitions containing one process with task (with id)', () => {
      const json = buildDefinitions({
        process: {
          task: { id: '0' },
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: {
            id: '0',
            task: {
              id: '0',
              name: 'task name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_0',
                bpmnElement: '0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing one process with task (without id)', () => {
      const json = buildDefinitions({
        process: {
          task: {},
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: {
            id: '0',
            task: {
              id: 'task_id_0_0',
              name: 'task name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_task_id_0_0',
                bpmnElement: 'task_id_0_0',
                Bounds: {
                  x: 362,
                  y: 232,
                  width: 36,
                  height: 45,
                },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing 2 processes with task (without id)', () => {
      const json = buildDefinitions({
        process: [{ task: {} }, { task: {} }],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: [
            {
              id: '0',
              task: {
                id: 'task_id_0_0',
                name: 'task name',
              },
            },
            {
              id: '1',
              task: {
                id: 'task_id_1_0',
                name: 'task name',
              },
            },
          ],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_task_id_0_0',
                  bpmnElement: 'task_id_0_0',
                  Bounds: {
                    x: 362,
                    y: 232,
                    width: 36,
                    height: 45,
                  },
                },
                {
                  id: 'shape_task_id_1_0',
                  bpmnElement: 'task_id_1_0',
                  Bounds: {
                    x: 362,
                    y: 232,
                    width: 36,
                    height: 45,
                  },
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('build json with exclusive gateway', () => {
    it('build json of definitions containing one process with exclusive gateway (with id)', () => {
      const json = buildDefinitions({
        process: {
          exclusiveGateway: {
            id: 'exclusive_gateway_id_4',
          },
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: { id: '0', exclusiveGateway: { id: 'exclusive_gateway_id_4', name: 'exclusiveGateway name' } },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_exclusive_gateway_id_4',
                bpmnElement: 'exclusive_gateway_id_4',
                Bounds: { x: 567, y: 345, width: 25, height: 25 },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing one process with exclusive gateway (without id)', () => {
      const json = buildDefinitions({
        process: {
          exclusiveGateway: {},
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: { id: '0', exclusiveGateway: { id: 'exclusiveGateway_id_0_0', name: 'exclusiveGateway name' } },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_exclusiveGateway_id_0_0',
                bpmnElement: 'exclusiveGateway_id_0_0',
                Bounds: { x: 567, y: 345, width: 25, height: 25 },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing 2 processes with exclusive gateway (without id)', () => {
      const json = buildDefinitions({
        process: [{ exclusiveGateway: {} }, { exclusiveGateway: {} }],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: [
            { id: '0', exclusiveGateway: { id: 'exclusiveGateway_id_0_0', name: 'exclusiveGateway name' } },
            { id: '1', exclusiveGateway: { id: 'exclusiveGateway_id_1_0', name: 'exclusiveGateway name' } },
          ],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_exclusiveGateway_id_0_0',
                  bpmnElement: 'exclusiveGateway_id_0_0',
                  Bounds: { x: 567, y: 345, width: 25, height: 25 },
                },
                {
                  id: 'shape_exclusiveGateway_id_1_0',
                  bpmnElement: 'exclusiveGateway_id_1_0',
                  Bounds: { x: 567, y: 345, width: 25, height: 25 },
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('build json with call activity', () => {
    it('build json of definitions containing one process with call activity (with id)', () => {
      const json = buildDefinitions({
        process: {
          callActivity: { id: '0' },
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: {
            id: '0',
            callActivity: {
              id: '0',
              name: 'callActivity name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_0',
                bpmnElement: '0',
                Bounds: { x: 346, y: 856, width: 45, height: 56 },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing one process with call activity (without id)', () => {
      const json = buildDefinitions({
        process: {
          callActivity: {},
        },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: {
            id: '0',
            callActivity: {
              id: 'callActivity_id_0_0',
              name: 'callActivity name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_callActivity_id_0_0',
                bpmnElement: 'callActivity_id_0_0',
                Bounds: { x: 346, y: 856, width: 45, height: 56 },
              },
            },
          },
        },
      });
    });

    it('build json of definitions containing 2 processes with call activity (without id)', () => {
      const json = buildDefinitions({
        process: [{ callActivity: {} }, { callActivity: {} }],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          collaboration: {
            id: 'collaboration_id_0',
          },
          process: [
            {
              id: '0',
              callActivity: {
                id: 'callActivity_id_0_0',
                name: 'callActivity name',
              },
            },
            {
              id: '1',
              callActivity: {
                id: 'callActivity_id_1_0',
                name: 'callActivity name',
              },
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
                },
                {
                  id: 'shape_callActivity_id_1_0',
                  bpmnElement: 'callActivity_id_1_0',
                  Bounds: { x: 346, y: 856, width: 45, height: 56 },
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
        withParticipant: true,
        messageFlows: {
          id: 'message_flow_id_0',
          name: 'message flow name',
          sourceRef: 'source_id_0',
          targetRef: 'target_id_0',
        },
        process: [{ id: 'source_id_0' }, { id: 'target_id_0' }],
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
                Bounds: { x: 567, y: 345, width: 36, height: 45 },
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
        withParticipant: true,
        messageFlows: {
          id: 'message_flow_id_0',
          name: 'message flow name',
          sourceRef: 'source_id_0',
          targetRef: 'target_id_0',
        },
        process: [
          {
            exclusiveGateway: {
              id: 'source_id_0',
            },
          },
          {
            exclusiveGateway: {
              id: 'target_id_0',
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
              exclusiveGateway: {
                id: 'source_id_0',
                name: 'exclusiveGateway name',
              },
            },
            {
              id: 'process_1',
              exclusiveGateway: {
                id: 'target_id_0',
                name: 'exclusiveGateway name',
              },
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
                Bounds: { x: 567, y: 345, width: 36, height: 45 },
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
        withParticipant: true,
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
            id: 'source_id_0',
            exclusiveGateway: {
              id: 'source_id_1',
            },
          },
          {
            id: 'target_id_0',
            exclusiveGateway: {
              id: 'target_id_1',
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
              exclusiveGateway: {
                id: 'source_id_1',
                name: 'exclusiveGateway name',
              },
            },
            {
              id: 'process_target_id_0',
              exclusiveGateway: {
                id: 'target_id_1',
                name: 'exclusiveGateway name',
              },
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
                  Bounds: { x: 567, y: 345, width: 36, height: 45 },
                  waypoint: [
                    { x: 567, y: 345 },
                    { x: 587, y: 345 },
                  ],
                },
                {
                  id: 'edge_message_flow_id_1',
                  bpmnElement: 'message_flow_id_1',
                  Bounds: { x: 567, y: 345, width: 36, height: 45 },
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
