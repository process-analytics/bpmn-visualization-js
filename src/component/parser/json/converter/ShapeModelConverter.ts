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
    AbstractConverter.ensureIsArray(bpmnElements).map(bpmnElement => convertedShapeBpmnElements.push(new ShapeBpmnElement(bpmnElement.id, bpmnElement.name, kind)));
  }

  parseProcess(process: { startEvent: any }) {
    this.buildShapeBpmnElement(process.startEvent, ShapeBpmnElementKind.EVENT_START);
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
