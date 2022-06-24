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
  it(
    'build json with definitions, process, task, interrupting boundary event with attachedToRef & empty messageEventDefinition, ' +
      "when bpmnKind='boundaryEvent', eventDefinitionKind='message', eventDefinitionOn=EVENT, isInterrupting=true, attachedToRef is defined",
    () => {
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
    },
  );

  it(
    'build json with definitions, process, task, boundary event with attachedToRef & empty messageEventDefinition & name, without cancelActivity, ' +
      "when bpmnKind='boundaryEvent', eventDefinitionKind='message', eventDefinitionOn=EVENT, isInterrupting is not defined, attachedToRef & name are defined",
    () => {
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
    },
  );

  it(
    'build json with definitions with messageEventDefinition with id, process, task, interrupting boundary event with eventDefinitionRef, ' +
      "when bpmnKind='boundaryEvent', eventDefinitionKind='message', eventDefinitionOn=DEFINITIONS, isInterrupting=true, attachedToRef is not defined",
    () => {
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
    },
  );

  it(
    'build json with definitions, process, task, non-interrupting boundary event with empty signalEventDefinition, ' +
      "when bpmnKind='boundaryEvent', eventDefinitionKind='signal', eventDefinitionOn=EVENT, isInterrupting=false, attachedToRef is NOT defined",
    () => {
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
    },
  );

  it(
    'build json with definitions, process, task, non-interrupting boundary event with empty signalEventDefinition and increased id, ' +
      "when bpmnKind='boundaryEvent', eventDefinitionKind='signal', eventDefinitionOn=EVENT, isInterrupting=false, attachedToRef is not defined, index=1",
    () => {
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
    },
  );

  it(
    'build json with definitions with signalEventDefinition with id, process, task, non-interrupting boundary event with attachedToRef & eventDefinitionRef, ' +
      "when bpmnKind='boundaryEvent', eventDefinitionKind='signal', eventDefinitionOn=DEFINITIONS, isInterrupting=false, attachedToRef is defined",
    () => {
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
    },
  );

  it(
    'build json with definitions, process, task, start event with messageEventDefinition & name, ' +
      "when bpmnKind='startEvent', eventDefinitionKind='message', eventDefinitionOn=EVENT, name is defined, attachedToRef & isInterrupting is not defined",
    () => {
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
            startEvent: {
              id: 'event_id_0',
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
    },
  );

  it(
    'build json with definitions with messageEventDefinition with id, process, task, start event with name, ' +
      "when bpmnKind='endEvent', eventDefinitionKind='message', eventDefinitionOn=DEFINITIONS, name is defined, attachedToRef & isInterrupting is not defined",
    () => {
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
            endEvent: {
              id: 'event_id_0',
              eventDefinitionRef: 'event_definition_id',
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
    },
  );

  it(
    'build json with definitions with messageEventDefinition with id, process, task, intermediate catch event with messageEventDefinition & eventDefinitionRef & name, ' +
      "when bpmnKind='intermediateCatchEvent', eventDefinitionKind='message', eventDefinitionOn=BOTH, name is defined, attachedToRef & isInterrupting is not defined",
    () => {
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
    },
  );

  it(
    'build json with definitions, process, task, start event with messageEventDefinitions (empty string & empty object) & name, ' +
      "when bpmnKind='startEvent', eventDefinitionKind='message', eventDefinitionOn=EVENT, withMultipleDefinitions=true, name is defined, attachedToRef & isInterrupting is not defined",
    () => {
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
            startEvent: {
              id: 'event_id_0',
              messageEventDefinition: ['', {}],
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
    },
  );

  it(
    'build json with definitions with messageEventDefinitions with id, process, task, start event with name, ' +
      "when bpmnKind='endEvent', eventDefinitionKind='message', eventDefinitionOn=DEFINITIONS, withMultipleDefinitions=true, name is defined, attachedToRef & isInterrupting is not defined",
    () => {
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
        withTask: true,
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
            task: {
              id: 'task_id_0',
              name: 'task name',
            },
            endEvent: {
              id: 'event_id_0',
              eventDefinitionRef: ['event_definition_1_id', 'event_definition_2_id'],
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
    },
  );

  it(
    'build json with definitions with messageEventDefinitions with id, process, task, intermediate catch event with messageEventDefinitions (empty string & empty object) & eventDefinitionRef & name, ' +
      "when bpmnKind='intermediateCatchEvent', eventDefinitionKind='message', eventDefinitionOn=BOTH, withMultipleDefinitions=true, name is defined, attachedToRef & isInterrupting is not defined",
    () => {
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
        withTask: true,
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
            task: {
              id: 'task_id_0',
              name: 'task name',
            },
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
    },
  );

  it(
    'build json with definitions, process, task, intermediate throw event, ' +
      "when bpmnKind='intermediateThrowEvent', eventDefinitionKind='message', eventDefinitionOn=NONE, eventDefinition is defined, name & attachedToRef & isInterrupting is not defined",
    () => {
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
            intermediateThrowEvent: {
              id: 'event_id_0',
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
    },
  );

  it(
    'build json with definitions, process, task, intermediate throw event with defined messageEventDefinition, ' +
      "when bpmnKind='intermediateThrowEvent', eventDefinitionKind='message', eventDefinitionOn=EVENT, eventDefinition is defined, name & attachedToRef & isInterrupting is not defined",
    () => {
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
            intermediateThrowEvent: {
              id: 'event_id_0',
              messageEventDefinition: { id: '9' },
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
    },
  );

  it(
    'build json with definitions with defined messageEventDefinition, process, task, intermediate throw event with eventDefinitionRef, ' +
      "when bpmnKind='intermediateThrowEvent', eventDefinitionKind='message', eventDefinitionOn=DEFINITIONS, eventDefinition is defined, name & attachedToRef & isInterrupting is not defined",
    () => {
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
        withTask: true,
      });

      expect(json).toEqual({
        definitions: {
          targetNamespace: '',
          messageEventDefinition: { id: '9' },
          process: {
            task: {
              id: 'task_id_0',
              name: 'task name',
            },
            intermediateThrowEvent: {
              id: 'event_id_0',
              eventDefinitionRef: '9',
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
    },
  );

  it(
    'build json with definitions, process, task, intermediate throw event with messageEventDefinition & signalEventDefinition, ' +
      "when bpmnKind='intermediateThrowEvent', eventDefinitionKind='message', eventDefinitionOn=EVENT, withDifferentDefinition=true, name & attachedToRef & isInterrupting is not defined",
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
    },
  );

  it(
    'build json with definitions, process, task, intermediate throw event with messageEventDefinition & signalEventDefinition, ' +
      "when bpmnKind='intermediateThrowEvent', eventDefinitionKind='signal', eventDefinitionOn=EVENT, withDifferentDefinition=true, name & attachedToRef & isInterrupting is not defined",
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
    },
  );

  it(
    'build json with definitions with messageEventDefinition & signalEventDefinition with ids, process, task, intermediate throw event with messageEventDefinition & signalEventDefinition & eventDefinitionRefs, ' +
      "when bpmnKind='intermediateThrowEvent', eventDefinitionKind='signal', eventDefinitionOn=BOTH, withDifferentDefinition=true, name & attachedToRef & isInterrupting is not defined",
    () => {
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
        withTask: true,
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
            task: {
              id: 'task_id_0',
              name: 'task name',
            },
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
    },
  );
});
