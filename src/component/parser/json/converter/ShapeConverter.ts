import { JsonConvert, JsonConverter, OperationMode, ValueCheckingMode } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import Shape from '../../../../model/bpmn/shape/Shape';
import Bounds from '../../../../model/bpmn/Bounds';
import { findLaneBpmnElement, findShapeBpmnElement } from './ShapeModelConverter';

//////////////////////////////////////////////////////////////
// TODO : To move in a singleton object to use here and in the BpmnJsonParser
const jsonConvert: JsonConvert = new JsonConvert();
jsonConvert.operationMode = OperationMode.ENABLE;
jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
//////////////////////////////////////////////////////////////

@JsonConverter
export class ShapeConverter extends AbstractConverter<Shape[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(bpmnDiagram: Array<any> | any): Shape[] {
    try {
      const shapes = bpmnDiagram.BPMNPlane.BPMNShape;
      const bpmnElement = shapes.bpmnElement;
      const shapeBpmnElement = findShapeBpmnElement(bpmnElement);

      if (shapeBpmnElement) {
        const id = shapes.id;
        const bounds3 = shapes.Bounds;
        const bounds2 = jsonConvert.deserializeObject(bounds3, Bounds);

        return [new Shape(id, shapeBpmnElement, bounds2)];
      }
      return [];
    } catch (e) {
      // TODO error management
      console.log(e as Error);
    }
  }
}

@JsonConverter
export class LaneConverter extends AbstractConverter<Shape[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(bpmnDiagram: Array<any> | any): Shape[] {
    try {
      const shapes = bpmnDiagram.BPMNPlane.BPMNShape;
      const bpmnElement = shapes.bpmnElement;
      const laneBpmnElement = findLaneBpmnElement(bpmnElement);

      if (laneBpmnElement) {
        const id = shapes.id;
        const bounds3 = shapes.Bounds;
        const bounds2 = jsonConvert.deserializeObject(bounds3, Bounds);

        return [new Shape(id, laneBpmnElement, bounds2)];
      }
      return [];
    } catch (e) {
      // TODO error management
      console.log(e as Error);
    }
  }
}
