import { JsonConverter } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import ShapeBpmnElement from '../../../../model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind } from '../../../../model/bpmn/shape/ShapeBpmnElementKind';

const convertedFlowNodeBpmnElements: ShapeBpmnElement[] = [];
const convertedLaneBpmnElements: ShapeBpmnElement[] = [];

export function findFlowNodeBpmnElement(id: string): ShapeBpmnElement {
  return convertedFlowNodeBpmnElements.find(i => i.id === id);
}

export function findLaneBpmnElement(id: string): ShapeBpmnElement {
  return convertedLaneBpmnElements.find(i => i.id === id);
}

@JsonConverter
export default class ShapeModelConverter extends AbstractConverter<ShapeBpmnElement[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildFlowNodeBpmnElement(bpmnElements: Array<any> | any, kind: ShapeBpmnElementKind): void {
    ensureIsArray(bpmnElements).forEach(bpmnElement => convertedFlowNodeBpmnElements.push(new ShapeBpmnElement(bpmnElement.id, bpmnElement.name, kind)));
  }

  buildLaneBpmnElement(lanes: Array<any> | any): void {
    ensureIsArray(lanes).forEach(lane => {
      const laneShape = new ShapeBpmnElement(lane.id, lane.name, ShapeBpmnElementKind.LANE);
      convertedLaneBpmnElements.push(laneShape);

      ensureIsArray(lane.flowNodeRef).forEach(flowNodeRef => {
        const shapeBpmnElement = findFlowNodeBpmnElement(flowNodeRef);
        shapeBpmnElement.parentId = lane.id;
      });
    });
  }

  buildLaneSetBpmnElement(laneSet: any): void {
    if (laneSet) {
      this.buildLaneBpmnElement(laneSet.lane);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseProcess(process: { startEvent: any; userTask: any; lane: any; laneSet: any }): void {
    this.buildFlowNodeBpmnElement(process.startEvent, ShapeBpmnElementKind.EVENT_START);
    this.buildFlowNodeBpmnElement(process.userTask, ShapeBpmnElementKind.TASK_USER);

    this.buildLaneBpmnElement(process.lane);
    this.buildLaneSetBpmnElement(process.laneSet);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(processes: Array<any> | any): ShapeBpmnElement[] {
    // Deletes everything in the array, which does hit other references. More performant.
    convertedFlowNodeBpmnElements.length = 0;
    convertedLaneBpmnElements.length = 0;

    ensureIsArray(processes).forEach(process => this.parseProcess(process));
    return convertedFlowNodeBpmnElements;
  }
}
