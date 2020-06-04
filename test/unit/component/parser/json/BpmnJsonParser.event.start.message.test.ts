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
import { ShapeBpmnElementKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { parseJsonAndExpectOnlyEvent, parseJsonAndExpectOnlyFlowNodes, verifyShape } from './JsonTestUtils';
import { ShapeBpmnEventKind } from '../../../../../src/model/bpmn/shape/ShapeBpmnEventKind';

describe('parse bpmn as json for message start event', () => {
  it('json containing one process with a message start event defined as empty string, message start event is present', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "startEvent": {
                            "id":"event_id_0",
                            "name":"event name",
                            "messageEventDefinition": ""
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_startEvent_id_0",
                                "bpmnElement":"event_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyEvent(json, ShapeBpmnEventKind.MESSAGE, 1);

    verifyShape(
      model.flowNodes[0],
      {
        shapeId: 'shape_startEvent_id_0',
        bpmnElementId: 'event_id_0',
        bpmnElementName: 'event name',
        bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      },
      {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    );
  });

  it('json containing one process with a message start event defined as object, message start event is present', () => {
    const json = `{
                "definitions" : {
                    "process": {
                        "startEvent": {
                            "id":"event_id_0",
                            "name":"event name",
                            "messageEventDefinition": { "id": "messageEventDefinition_1" }
                        }
                    },
                    "BPMNDiagram": {
                        "name":"process 0",
                        "BPMNPlane": {
                            "BPMNShape": {
                                "id":"shape_startEvent_id_0",
                                "bpmnElement":"event_id_0",
                                "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                            }
                        }
                    }
                }
            }`;

    const model = parseJsonAndExpectOnlyEvent(json, ShapeBpmnEventKind.MESSAGE, 1);

    verifyShape(
      model.flowNodes[0],
      {
        shapeId: 'shape_startEvent_id_0',
        bpmnElementId: 'event_id_0',
        bpmnElementName: 'event name',
        bpmnElementKind: ShapeBpmnElementKind.EVENT_START,
      },
      {
        x: 362,
        y: 232,
        width: 36,
        height: 45,
      },
    );
  });

  it('json containing one process with a start event with message definition and another definition, message start end event is NOT present', () => {
    const json = `{
    "definitions" : {
        "process": {
            "startEvent": { "id":"event_id_0", "messageEventDefinition": "", "timerEventDefinition": "" }
        },
        "BPMNDiagram": {
            "name":"process 0",
            "BPMNPlane": {
                "BPMNShape": {
                    "id":"shape_startEvent_id_0",
                    "bpmnElement":"event_id_0",
                    "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                }
            }
        }
    }
}`;

    parseJsonAndExpectOnlyFlowNodes(json, 0);
  });

  it('json containing one process with a start event with several message definitions, message start end event is NOT present', () => {
    const json = `{
    "definitions" : {
        "process": {
            "startEvent": { "id":"event_id_0", "messageEventDefinition": ["", ""] }
        },
        "BPMNDiagram": {
            "name":"process 0",
            "BPMNPlane": {
                "BPMNShape": {
                    "id":"shape_startEvent_id_0",
                    "bpmnElement":"event_id_0",
                    "Bounds": { "x": 362, "y": 232, "width": 36, "height": 45 }
                }
            }
        }
    }
}`;

    parseJsonAndExpectOnlyFlowNodes(json, 0);
  });
});
