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
      withTask: false,
    });

    expect(json).toEqual({
      definitions: {
        targetNamespace: '',
        process: {},
        BPMNDiagram: {
          name: 'process 0',
          BPMNPlane: {},
        },
      },
    });
  });

  it('build json of definitions containing several processes with different elements', () => {
    const json = buildDefinitions([
      {
        withTask: false,
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
        withTask: true,
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
        withTask: false,
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
    ]);

    expect(json).toEqual({
      definitions: {
        targetNamespace: '',
        terminateEventDefinition: {
          id: 'event_definition_id',
        },
        timerEventDefinition: {
          id: 'event_definition_id',
        },
        process: [
          {
            endEvent: {
              cancelActivity: true,
              eventDefinitionRef: 'event_definition_id',
              id: 'event_id_1',
              name: 'endEvent',
            },
            startEvent: {
              cancelActivity: false,
              id: 'event_id_0',
              messageEventDefinition: '',
              name: 'startEvent',
            },
          },
          {
            exclusiveGateway: {
              id: 'exclusiveGateway',
            },
            startEvent: {
              cancelActivity: false,
              id: 'event_id_0',
              name: 'startEvent',
            },
            task: {
              id: 'task_id_0',
              name: 'task name',
            },
          },
          {
            intermediateCatchEvent: {
              cancelActivity: false,
              eventDefinitionRef: 'event_definition_id',
              id: 'event_id_2',
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
                Bounds: {
                  height: 45,
                  width: 36,
                  x: 362,
                  y: 232,
                },
                bpmnElement: 'event_id_0',
                id: 'shape_event_id_0',
              },
              {
                Bounds: {
                  height: 45,
                  width: 36,
                  x: 362,
                  y: 232,
                },
                bpmnElement: 'event_id_1',
                id: 'shape_event_id_1',
              },
              {
                Bounds: {
                  height: 45,
                  width: 36,
                  x: 362,
                  y: 232,
                },
                bpmnElement: 'task_id_0',
                id: 'shape_task_id_0',
              },
              {
                Bounds: {
                  height: 25,
                  width: 25,
                  x: 567,
                  y: 345,
                },
                bpmnElement: 'exclusiveGateway',
                id: 'shape_exclusiveGateway',
              },
              {
                Bounds: {
                  height: 45,
                  width: 36,
                  x: 362,
                  y: 232,
                },
                bpmnElement: 'event_id_0',
                id: 'shape_event_id_0',
              },
              {
                Bounds: {
                  height: 45,
                  width: 36,
                  x: 362,
                  y: 232,
                },
                bpmnElement: 'event_id_2',
                id: 'shape_event_id_2',
              },
            ],
          },
        },
      },
    });
  });

  describe('build json with boundary event', () => {
    describe('build json with interrupting boundary event', () => {
      it('build json of definitions containing one process with task and interrupting boundary event (with attachedToRef & empty messageEventDefinition)', () => {
        const eventDefinitionParameter: BuildEventDefinitionParameter = { eventDefinitionKind: 'message', eventDefinitionOn: EventDefinitionOn.EVENT };
        const json = buildDefinitions({
          events: [
            {
              bpmnKind: 'boundaryEvent',
              eventDefinitionParameter,
              eventParameter: {
                isInterrupting: true,
                attachedToRef: 'task_id_0',
              },
            },
          ],
          withTask: true,
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            process: {
              task: {
                id: 'task_id_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0',
                cancelActivity: true,
                attachedToRef: 'task_id_0',
                messageEventDefinition: '',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0',
                    bpmnElement: 'task_id_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0',
                    bpmnElement: 'event_id_0',
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
          withTask: true,
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            process: {
              task: {
                id: 'task_id_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_1',
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
                    id: 'shape_task_id_0',
                    bpmnElement: 'task_id_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_1',
                    bpmnElement: 'event_id_1',
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
          events: [
            {
              bpmnKind: 'boundaryEvent',
              eventDefinitionParameter,
              eventParameter: {
                isInterrupting: true,
              },
            },
          ],
          withTask: true,
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            messageEventDefinition: {
              id: 'event_definition_id',
            },
            process: {
              task: {
                id: 'task_id_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0',
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
                    id: 'shape_task_id_0',
                    bpmnElement: 'task_id_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0',
                    bpmnElement: 'event_id_0',
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
          events: [
            {
              bpmnKind: 'boundaryEvent',
              eventDefinitionParameter,
              eventParameter: {
                attachedToRef: 'task_id_0',
                name: 'name',
              },
            },
          ],
          withTask: true,
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            process: {
              task: {
                id: 'task_id_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0',
                attachedToRef: 'task_id_0',
                messageEventDefinition: '',
                name: 'name',
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0',
                    bpmnElement: 'task_id_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0',
                    bpmnElement: 'event_id_0',
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
          events: [
            {
              bpmnKind: 'boundaryEvent',
              eventDefinitionParameter,
              eventParameter: {
                isInterrupting: false,
              },
            },
          ],
          withTask: true,
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            process: {
              task: {
                id: 'task_id_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0',
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
                    id: 'shape_task_id_0',
                    bpmnElement: 'task_id_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0',
                    bpmnElement: 'event_id_0',
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
          withTask: true,
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            process: {
              task: {
                id: 'task_id_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_1',
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
                    id: 'shape_task_id_0',
                    bpmnElement: 'task_id_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_1',
                    bpmnElement: 'event_id_1',
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
          events: [
            {
              bpmnKind: 'boundaryEvent',
              eventDefinitionParameter,
              eventParameter: {
                isInterrupting: false,
                attachedToRef: 'task_id_0',
              },
            },
          ],
          withTask: true,
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            signalEventDefinition: {
              id: 'event_definition_id',
            },
            process: {
              task: {
                id: 'task_id_0',
                name: 'task name',
              },
              boundaryEvent: {
                id: 'event_id_0',
                cancelActivity: false,
                eventDefinitionRef: 'event_definition_id',
                attachedToRef: 'task_id_0',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: [
                  {
                    id: 'shape_task_id_0',
                    bpmnElement: 'task_id_0',
                    Bounds: {
                      x: 362,
                      y: 232,
                      width: 36,
                      height: 45,
                    },
                  },
                  {
                    id: 'shape_event_id_0',
                    bpmnElement: 'event_id_0',
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
        events: [
          {
            bpmnKind: 'startEvent',
            eventDefinitionParameter,
            eventParameter: {
              name: 'name',
            },
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          process: {
            startEvent: {
              id: 'event_id_0',
              messageEventDefinition: '',
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0',
                bpmnElement: 'event_id_0',
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
        events: [
          {
            bpmnKind: 'startEvent',
            eventDefinitionParameter,
            eventParameter: {
              name: 'name',
            },
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          process: {
            startEvent: {
              id: 'event_id_0',
              messageEventDefinition: ['', {}],
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0',
                bpmnElement: 'event_id_0',
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
        events: [
          {
            bpmnKind: 'endEvent',
            eventDefinitionParameter,
            eventParameter: {
              name: 'name',
            },
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          messageEventDefinition: {
            id: 'event_definition_id',
          },
          process: {
            endEvent: {
              id: 'event_id_0',
              eventDefinitionRef: 'event_definition_id',
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0',
                bpmnElement: 'event_id_0',
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
        events: [
          {
            bpmnKind: 'endEvent',
            eventDefinitionParameter,
            eventParameter: {
              name: 'name',
            },
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          messageEventDefinition: [
            {
              id: 'event_definition_1_id',
            },
            {
              id: 'event_definition_2_id',
            },
          ],
          process: {
            endEvent: {
              id: 'event_id_0',
              eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0',
                bpmnElement: 'event_id_0',
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
      const json = buildDefinitions([
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
      ]);

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          process: [
            {
              startEvent: {
                id: 'event_id_0',
                messageEventDefinition: '',
                name: 'name',
              },
            },
            {
              startEvent: {
                id: 'event_id_1',
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
                  id: 'shape_event_id_0',
                  bpmnElement: 'event_id_0',
                  Bounds: {
                    x: 362,
                    y: 232,
                    width: 36,
                    height: 45,
                  },
                },
                {
                  id: 'shape_event_id_1',
                  bpmnElement: 'event_id_1',
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
        events: [
          {
            bpmnKind: 'intermediateCatchEvent',
            eventDefinitionParameter,
            eventParameter: {
              name: 'name',
            },
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          messageEventDefinition: {
            id: 'event_definition_id',
          },
          process: {
            intermediateCatchEvent: {
              id: 'event_id_0',
              messageEventDefinition: '',
              eventDefinitionRef: 'event_definition_id',
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0',
                bpmnElement: 'event_id_0',
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
        events: [
          {
            bpmnKind: 'intermediateCatchEvent',
            eventDefinitionParameter,
            eventParameter: {
              name: 'name',
            },
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          messageEventDefinition: [
            {
              id: 'event_definition_1_id',
            },
            {
              id: 'event_definition_2_id',
            },
          ],
          process: {
            intermediateCatchEvent: {
              id: 'event_id_0',
              messageEventDefinition: ['', {}],
              eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
              name: 'name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0',
                bpmnElement: 'event_id_0',
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
        events: [
          {
            bpmnKind: 'intermediateThrowEvent',
            eventDefinitionParameter,
            eventParameter: {},
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          process: {
            intermediateThrowEvent: {
              id: 'event_id_0',
              name: undefined,
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0',
                bpmnElement: 'event_id_0',
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
        events: [
          {
            bpmnKind: 'intermediateThrowEvent',
            eventDefinitionParameter,
            eventParameter: {},
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          process: {
            intermediateThrowEvent: {
              id: 'event_id_0',
              messageEventDefinition: { id: '9' },
              name: undefined,
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0',
                bpmnElement: 'event_id_0',
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
        events: [
          {
            bpmnKind: 'intermediateThrowEvent',
            eventDefinitionParameter,
            eventParameter: {},
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          messageEventDefinition: { id: '9' },
          process: {
            intermediateThrowEvent: {
              id: 'event_id_0',
              eventDefinitionRef: '9',
              name: undefined,
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_event_id_0',
                bpmnElement: 'event_id_0',
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
          events: [
            {
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter,
              eventParameter: {},
            },
          ],
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            process: {
              intermediateThrowEvent: {
                id: 'event_id_0',
                messageEventDefinition: '',
                signalEventDefinition: '',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0',
                  bpmnElement: 'event_id_0',
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
          events: [
            {
              bpmnKind: 'intermediateThrowEvent',
              eventDefinitionParameter,
              eventParameter: {},
            },
          ],
        });

        expect(json).toEqual({
          definitions: {
            targetNamespace: '',
            process: {
              intermediateThrowEvent: {
                id: 'event_id_0',
                messageEventDefinition: '',
                signalEventDefinition: '',
                name: undefined,
              },
            },
            BPMNDiagram: {
              name: 'process 0',
              BPMNPlane: {
                BPMNShape: {
                  id: 'shape_event_id_0',
                  bpmnElement: 'event_id_0',
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
        events: [
          {
            bpmnKind: 'intermediateThrowEvent',
            eventDefinitionParameter,
            eventParameter: {},
          },
        ],
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          messageEventDefinition: {
            id: 'other_event_definition_id',
          },
          signalEventDefinition: {
            id: 'event_definition_id',
          },
          process: {
            intermediateThrowEvent: {
              id: 'event_id_0',
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
                id: 'shape_event_id_0',
                bpmnElement: 'event_id_0',
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
    it('build json of definitions containing one process with task', () => {
      const json = buildDefinitions({
        withTask: true,
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          process: {
            task: {
              id: 'task_id_0',
              name: 'task name',
            },
          },
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: {
                id: 'shape_task_id_0',
                bpmnElement: 'task_id_0',
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

    it('build json of definitions containing 2 processes with task', () => {
      const json = buildDefinitions([
        {
          withTask: true,
        },
        {
          withTask: true,
        },
      ]);

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          process: [
            {
              task: {
                id: 'task_id_0',
                name: 'task name',
              },
            },
            {
              task: {
                id: 'task_id_0',
                name: 'task name',
              },
            },
          ],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_task_id_0',
                  bpmnElement: 'task_id_0',
                  Bounds: {
                    x: 362,
                    y: 232,
                    width: 36,
                    height: 45,
                  },
                },
                {
                  id: 'shape_task_id_0',
                  bpmnElement: 'task_id_0',
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
    it('build json of definitions containing one process with exclusive gateway', () => {
      const json = buildDefinitions({
        exclusiveGateway: { id: 'exclusive_gateway_id_4' },
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          process: {
            exclusiveGateway: { id: 'exclusive_gateway_id_4' },
          },
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

    it('build json of definitions containing 2 processes with exclusive gateway', () => {
      const json = buildDefinitions([
        {
          exclusiveGateway: { id: 'exclusive_gateway_id_4' },
        },
        {
          exclusiveGateway: { id: 'exclusive_gateway_id_67' },
        },
      ]);

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          process: [
            {
              exclusiveGateway: { id: 'exclusive_gateway_id_4' },
            },
            {
              exclusiveGateway: { id: 'exclusive_gateway_id_67' },
            },
          ],
          BPMNDiagram: {
            name: 'process 0',
            BPMNPlane: {
              BPMNShape: [
                {
                  id: 'shape_exclusive_gateway_id_4',
                  bpmnElement: 'exclusive_gateway_id_4',
                  Bounds: { x: 567, y: 345, width: 25, height: 25 },
                },
                {
                  id: 'shape_exclusive_gateway_id_67',
                  bpmnElement: 'exclusive_gateway_id_67',
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
