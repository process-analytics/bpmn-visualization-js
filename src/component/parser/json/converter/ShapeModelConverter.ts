import { JsonConverter } from 'json2typescript';
import { AbstractConverter } from './AbstractConverter';
import ShapeBpmnElement from '../../../../model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind } from '../../../../model/bpmn/shape/ShapeBpmnElementKind';

const convertedShapeBpmnElements: ShapeBpmnElement[] = [];

function findShapeBpmnElement(id: string): ShapeBpmnElement {
  return convertedShapeBpmnElements.find(i => i.id === id);
}

@JsonConverter
export default class ShapeModelConverter extends AbstractConverter<ShapeBpmnElement[]> {
  buildShapeBpmnElement(bpmnElements: Array<any> | any, kind: ShapeBpmnElementKind) {
    if (bpmnElements !== undefined && bpmnElements !== null && bpmnElements !== '') {
      // TODO : Move check in AbstractConverter.ensureIsArray
      AbstractConverter.ensureIsArray(bpmnElements).map(bpmnElement => convertedShapeBpmnElements.push(new ShapeBpmnElement(bpmnElement.id, bpmnElement.name, kind)));
    }
  }

  parseProcess(process: { startEvent: any; userTask: any }) {
    this.buildShapeBpmnElement(process.startEvent, ShapeBpmnElementKind.EVENT_START);
    this.buildShapeBpmnElement(process.userTask, ShapeBpmnElementKind.TASK_USER);
  }

  deserialize(processes: Array<any> | any): ShapeBpmnElement[] {
    // Deletes everything in the array, which does hit other references. More performant.
    convertedShapeBpmnElements.length = 0;

    AbstractConverter.ensureIsArray(processes).map(process => this.parseProcess(process));
    return convertedShapeBpmnElements;
  }
}

@JsonConverter
export class ShapeBpmnElementConverter extends AbstractConverter<ShapeBpmnElement> {
  deserialize(data: string): ShapeBpmnElement {
    return findShapeBpmnElement(data);
  }
}
