import { JsonConverter } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import ShapeBpmnElement from '../../../../model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind } from '../../../../model/bpmn/shape/ShapeBpmnElementKind';

const convertedShapeBpmnElements: ShapeBpmnElement[] = [];
const convertedLaneBpmnElements: ShapeBpmnElement[] = [];

export function findShapeBpmnElement(id: string): ShapeBpmnElement {
  return convertedShapeBpmnElements.find(i => i.id === id);
}

export function findLaneBpmnElement(id: string): ShapeBpmnElement {
  return convertedLaneBpmnElements.find(i => i.id === id);
}

@JsonConverter
export default class ShapeModelConverter extends AbstractConverter<ShapeBpmnElement[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildShapeBpmnElement(bpmnElements: Array<any> | any, kind: ShapeBpmnElementKind): void {
    ensureIsArray(bpmnElements).map(bpmnElement => convertedShapeBpmnElements.push(new ShapeBpmnElement(bpmnElement.id, bpmnElement.name, kind)));
  }

  buildLaneBpmnElement(lanes: Array<any> | any, kind: ShapeBpmnElementKind): void {
    ensureIsArray(lanes).map(lane => {
      const laneShape = new ShapeBpmnElement(lane.id, lane.name, kind);
      convertedLaneBpmnElements.push(laneShape);

      ensureIsArray(lane.flowNodeRef).map(flowNodeRef => {
        const shapeBpmnElement = findShapeBpmnElement(flowNodeRef);
        shapeBpmnElement.parentId = lane.id;
      });
    });
  }

  buildLaneSetBpmnElement(laneSet: any, kind: ShapeBpmnElementKind): void {
    if (laneSet) {
      // this.buildLaneBpmnElement(laneSet.lane);
      ensureIsArray(laneSet.lane).map(bpmnElement => convertedLaneBpmnElements.push(new ShapeBpmnElement(bpmnElement.id, bpmnElement.name, kind)));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseProcess(process: { startEvent: any; userTask: any; lane: any; laneSet: any }): void {
    this.buildShapeBpmnElement(process.startEvent, ShapeBpmnElementKind.EVENT_START);
    this.buildShapeBpmnElement(process.userTask, ShapeBpmnElementKind.TASK_USER);

    this.buildLaneBpmnElement(process.lane, ShapeBpmnElementKind.LANE);
    this.buildLaneSetBpmnElement(process.laneSet, ShapeBpmnElementKind.LANE);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(processes: Array<any> | any): ShapeBpmnElement[] {
    // Deletes everything in the array, which does hit other references. More performant.
    convertedShapeBpmnElements.length = 0;
    convertedLaneBpmnElements.length = 0;

    ensureIsArray(processes).map(process => this.parseProcess(process));
    return convertedShapeBpmnElements;
  }
}
