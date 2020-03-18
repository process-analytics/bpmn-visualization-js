import { expect } from 'chai';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import { parseJson, parseJsonAndExpectOnlyLanes, parseJsonAndExpectOnlyPoolsAndLanes, verifyShape } from './JsonTestUtils';

// TODO here name set in both participant and process / add test when name only available in process
describe('parse bpmn as json for process/pool', () => {
  it('json containing one process with a single lane without flowNodeRef', () => {
    const json = `{
  "definitions":{
    "collaboration": {
      "participant": { "id": "Participant_0nuvj8r", "name": "Pool 1", "processRef": "Process_0vbjbkf" }
    },
    "process": {
      "id": "Process_0vbjbkf",
      "name": "RequestLoan",
      "isExecutable": false,
      "lane": { "id":"Lane_12u5n6x" }
    },
    "BPMNDiagram":{
      "BPMNPlane":{
        "BPMNShape": [
          {
            "id": "Participant_0nuvj8r_di",
            "bpmnElement": "Participant_0nuvj8r",
            "isHorizontal": true,
            "Bounds": { "x": 158, "y": 50, "width": 1620, "height": 430 }
          },
          {
            "id":"Lane_1h5yeu4_di",
            "bpmnElement":"Lane_12u5n6x",
            "isHorizontal":true,
            "Bounds": { "x":362, "y":232, "width":36, "height":45 }
          }
        ]
      }
    }
  }
}`;

    const model = parseJsonAndExpectOnlyPoolsAndLanes(json, 1, 1);
    const pool = model.pools[0];
    verifyShape(pool, {
      shapeId: 'Participant_0nuvj8r_di',
      bpmnElementId: 'Participant_0nuvj8r',
      bpmnElementName: 'Pool 1',
      bpmnElementKind: ShapeBpmnElementKind.POOL,
      boundsX: 158,
      boundsY: 50,
      boundsWidth: 1620,
      boundsHeight: 430,
    });
    // TODO expect parent id is not set/defined
    //expect(pool.bpmnElement.parentId).to.be.undefined('string', 'pool bpmn element parent');

    const lane = model.lanes[0];
    verifyShape(lane, {
      shapeId: 'Lane_1h5yeu4_di',
      bpmnElementId: 'Lane_12u5n6x',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    // TODO expect lane parent id is set/defined
    // expect(lane.bpmnElement.parentId).to.be.equal('Participant_0nuvj8r', 'lane bpmn element parent');
  });

  it('json containing several processes and participants (with lane or laneset)', () => {
    const json = `{
  "definitions":{
    "collaboration": {
      "participant": [
        { "id": "Participant_1", "name": "Pool 1", "processRef": "Process_1" },
        { "id": "Participant_2", "name": "Pool 2", "processRef": "Process_2" }
      ]
    },
    "process": [
      {
        "id": "Process_1",
        "name": "process 1",
        "isExecutable": false,
        "lane": { "id":"Lane_1_1" }
      },
      {
        "id": "Process_2",
        "name": "process 2",
        "isExecutable": true,
        "laneSet":{
          "id":"LaneSet_2",
          "lane":{ "id":"Lane_2_1" }
        }
      }
    ],
    "BPMNDiagram":{
      "BPMNPlane":{
        "BPMNShape": [
          {
            "id": "Participant_1_di",
            "bpmnElement": "Participant_1",
            "isHorizontal": true,
            "Bounds": { "x": 158, "y": 50, "width": 1620, "height": 430 }
          },
          {
            "id":"Lane_1_1_di",
            "bpmnElement":"Lane_1_1",
            "isHorizontal":true,
            "Bounds": { "x":362, "y":232, "width":36, "height":45 }
          },
          {
            "id": "Participant_2_di",
            "bpmnElement": "Participant_2",
            "isHorizontal": true,
            "Bounds": { "x": 158, "y": 1050, "width": 1620, "height": 430 }
          },
          {
            "id":"Lane_2_1_di",
            "bpmnElement":"Lane_2_1",
            "isHorizontal":true,
            "Bounds": { "x":362, "y":1232, "width":36, "height":45 }
          }
        ]
      }
    }
  }
}`;

    const model = parseJsonAndExpectOnlyPoolsAndLanes(json, 2, 2);
    verifyShape(model.pools[0], {
      shapeId: 'Participant_1_di',
      bpmnElementId: 'Participant_1',
      bpmnElementName: 'Pool 1',
      bpmnElementKind: ShapeBpmnElementKind.POOL,
      boundsX: 158,
      boundsY: 50,
      boundsWidth: 1620,
      boundsHeight: 430,
    });
    verifyShape(model.pools[1], {
      shapeId: 'Participant_2_di',
      bpmnElementId: 'Participant_2',
      bpmnElementName: 'Pool 2',
      bpmnElementKind: ShapeBpmnElementKind.POOL,
      boundsX: 158,
      boundsY: 1050,
      boundsWidth: 1620,
      boundsHeight: 430,
    });
    // TODO expect parent id is not set/defined
    //expect(pool.bpmnElement.parentId).to.be.undefined('string', 'pool bpmn element parent');

    verifyShape(model.lanes[0], {
      shapeId: 'Lane_1_1_di',
      bpmnElementId: 'Lane_1_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      boundsX: 362,
      boundsY: 232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    verifyShape(model.lanes[1], {
      shapeId: 'Lane_2_1_di',
      bpmnElementId: 'Lane_2_1',
      bpmnElementName: undefined,
      bpmnElementKind: ShapeBpmnElementKind.LANE,
      boundsX: 362,
      boundsY: 1232,
      boundsWidth: 36,
      boundsHeight: 45,
    });
    // TODO expect lane parent id is set/defined
    // expect(lane.bpmnElement.parentId).to.be.equal('Participant_0nuvj8r', 'lane bpmn element parent');
  });
});
