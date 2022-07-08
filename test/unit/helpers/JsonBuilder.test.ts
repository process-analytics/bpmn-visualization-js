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
      process: [
        {
          id: 'participant_0',
          task: {},
          events: [
            {
              bpmnKind: 'startEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'message',
                eventDefinitionOn: EventDefinitionOn.EVENT,
              },
              eventParameter: {
                index: 0,
                name: 'startEvent',
                isInterrupting: false,
              },
            },
            {
              bpmnKind: 'endEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'terminate',
                eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
              },
              eventParameter: {
                index: 1,
                name: 'endEvent',
                isInterrupting: true,
              },
            },
          ],
        },
        {
          id: 'participant_1',
          task: { id: 'task_id_1' },
          events: [
            {
              bpmnKind: 'startEvent',
              eventDefinitionParameter: {
                eventDefinitionOn: EventDefinitionOn.NONE,
              },
              eventParameter: {
                name: 'startEvent',
                isInterrupting: false,
              },
            },
          ],
          exclusiveGateway: {
            id: 'exclusiveGateway',
          },
        },
        {
          id: 'participant_2',
          events: [
            {
              bpmnKind: 'intermediateCatchEvent',
              eventDefinitionParameter: {
                eventDefinitionKind: 'timer',
                eventDefinitionOn: EventDefinitionOn.BOTH,
              },
              eventParameter: {
                index: 2,
                name: 'intermediateCatchEvent',
                isInterrupting: false,
              },
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
          participant: [
            { id: 'participant_0', processRef: 'process_participant_0' },
            { id: 'participant_1', processRef: 'process_participant_1' },
            { id: 'participant_2', processRef: 'process_participant_2' },
          ],
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
              id: 'event_id_2_2',
              name: 'intermediateCatchEvent',
              timerEventDefinition: '',
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
                bpmnElement: 'event_id_2_2',
                id: 'shape_event_id_2_2',
                Bounds: { x: 362, y: 232, height: 45, width: 36 },
              },
            ],
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
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT };
        const json = buildDefinitions({
          process: {
            events: [
              {
                bpmnKind: 'boundaryEvent',
                eventDefinitionParameter,
                eventParameter: {
                  isInterrupting: true,
                  attachedToRef: 'task_id_0_0',
                },
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

      it('build json of definitions containing one process with task and interrupting boundary event (with empty signalEventDefinition and id based on index)', () => {
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.EVENT };
        const json = buildDefinitions({
          process: {
            events: [
              {
                bpmnKind: 'boundaryEvent',
                eventDefinitionParameter,
                eventParameter: {
                  isInterrupting: true,
                  index: 1,
                },
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
                id: 'event_id_0_1',
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
                    id: 'shape_event_id_0_1',
                    bpmnElement: 'event_id_0_1',
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
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS };
        const json = buildDefinitions({
          process: {
            events: [
              {
                bpmnKind: 'boundaryEvent',
                eventDefinitionParameter,
                eventParameter: {
                  isInterrupting: true,
                },
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
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT };
        const json = buildDefinitions({
          process: {
            events: [
              {
                bpmnKind: 'boundaryEvent',
                eventDefinitionParameter,
                eventParameter: {
                  attachedToRef: 'task_id_0_0',
                  name: 'name',
                },
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
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.EVENT };
        const json = buildDefinitions({
          process: {
            events: [
              {
                bpmnKind: 'boundaryEvent',
                eventDefinitionParameter,
                eventParameter: {
                  isInterrupting: false,
                },
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

      it('build json of definitions containing one process with task and non-interrupting boundary event (with empty signalEventDefinition and id based on index)', () => {
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.EVENT };
        const json = buildDefinitions({
          process: {
            events: [
              {
                bpmnKind: 'boundaryEvent',
                eventDefinitionParameter,
                eventParameter: {
                  isInterrupting: false,
                  index: 1,
                },
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
                id: 'event_id_0_1',
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
                    id: 'shape_event_id_0_1',
                    bpmnElement: 'event_id_0_1',
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
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'signal', eventDefinitionOn: EventDefinitionOn.DEFINITIONS };
        const json = buildDefinitions({
          process: {
            events: [
              {
                bpmnKind: 'boundaryEvent',
                eventDefinitionParameter,
                eventParameter: {
                  isInterrupting: false,
                  attachedToRef: 'task_id_0_0',
                },
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
      const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT };
      const json = buildDefinitions({
        process: {
          events: [
            {
              bpmnKind: 'startEvent',
              eventDefinitionParameter,
              eventParameter: {
                name: 'name',
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
      const eventDefinitionParameter: BuildEventDefinitionParameter = {
        eventDefinitionKind: 'message',
        eventDefinitionOn: EventDefinitionOn.EVENT,
        withMultipleDefinitions: true,
      };
      const json = buildDefinitions({
        process: {
          events: [
            {
              bpmnKind: 'startEvent',
              eventDefinitionParameter,
              eventParameter: {
                name: 'name',
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
      const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.DEFINITIONS };
      const json = buildDefinitions({
        process: {
          events: [
            {
              bpmnKind: 'endEvent',
              eventDefinitionParameter,
              eventParameter: {
                name: 'name',
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
      const eventDefinitionParameter: BuildEventDefinitionParameter = {
        eventDefinitionKind: 'message',
        eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
        withMultipleDefinitions: true,
      };
      const json = buildDefinitions({
        process: {
          events: [
            {
              bpmnKind: 'endEvent',
              eventDefinitionParameter,
              eventParameter: {
                name: 'name',
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
            events: [
              {
                bpmnKind: 'startEvent',
                eventDefinitionParameter,
                eventParameter: {
                  name: 'name',
                },
              },
            ],
          },
          {
            events: [
              {
                bpmnKind: 'startEvent',
                eventDefinitionParameter,
                eventParameter: {
                  name: 'name',
                  index: 1,
                },
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
                id: 'event_id_1_1',
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
                  id: 'shape_event_id_1_1',
                  bpmnElement: 'event_id_1_1',
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
      const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.BOTH };
      const json = buildDefinitions({
        process: {
          events: [
            {
              bpmnKind: 'intermediateCatchEvent',
              eventDefinitionParameter,
              eventParameter: {
                name: 'name',
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
      const eventDefinitionParameter: BuildEventDefinitionParameter = {
        eventDefinitionKind: 'message',
        eventDefinitionOn: EventDefinitionOn.BOTH,
        withMultipleDefinitions: true,
      };
      const json = buildDefinitions({
        process: {
          events: [
            {
              bpmnKind: 'intermediateCatchEvent',
              eventDefinitionParameter,
              eventParameter: {
                name: 'name',
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
      const eventDefinitionParameter: BuildEventDefinitionParameter = {
        eventDefinitionKind: 'message',
        eventDefinitionOn: EventDefinitionOn.NONE,
        eventDefinition: { id: '9' },
      };
      const json = buildDefinitions({
        process: {
          events: [
            {
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter,
              eventParameter: {},
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
      const eventDefinitionParameter: BuildEventDefinitionParameter = {
        eventDefinitionKind: 'message',
        eventDefinitionOn: EventDefinitionOn.EVENT,
        eventDefinition: { id: '9' },
      };
      const json = buildDefinitions({
        process: {
          events: [
            {
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter,
              eventParameter: {},
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
      const eventDefinitionParameter: BuildEventDefinitionParameter = {
        eventDefinitionKind: 'message',
        eventDefinitionOn: EventDefinitionOn.DEFINITIONS,
        eventDefinition: { id: '9' },
      };
      const json = buildDefinitions({
        process: {
          events: [
            {
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter,
              eventParameter: {},
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
        const eventDefinitionParameter: BuildEventDefinitionParameter = {
          eventDefinitionKind: 'message',
          eventDefinitionOn: EventDefinitionOn.EVENT,
          withDifferentDefinition: true,
        };
        const json = buildDefinitions({
          process: {
            events: [
              {
                bpmnKind: 'intermediateThrowEvent',
                eventDefinitionParameter,
                eventParameter: {},
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
        const eventDefinitionParameter: BuildEventDefinitionParameter = {
          eventDefinitionKind: 'signal',
          eventDefinitionOn: EventDefinitionOn.EVENT,
          withDifferentDefinition: true,
        };
        const json = buildDefinitions({
          process: {
            events: [
              {
                bpmnKind: 'intermediateThrowEvent',
                eventDefinitionParameter,
                eventParameter: {},
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
      const eventDefinitionParameter: BuildEventDefinitionParameter = {
        eventDefinitionKind: 'signal',
        eventDefinitionOn: EventDefinitionOn.BOTH,
        withDifferentDefinition: true,
      };
      const json = buildDefinitions({
        process: {
          events: [
            {
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter,
              eventParameter: {},
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
        process: [
          {
            exclusiveGateway: {},
          },
          {
            exclusiveGateway: {},
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
});
