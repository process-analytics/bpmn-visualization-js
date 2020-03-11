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
      return (
        ensureIsArray(shapes)
          //.filter(shape => )
          .map(shape => {
            const bpmnElement = shape.bpmnElement;
            const shapeBpmnElement = findShapeBpmnElement(bpmnElement);

            if (shapeBpmnElement) {
              const id = shape.id;
              const bounds3 = shape.Bounds;
              const bounds2 = jsonConvert.deserializeObject(bounds3, Bounds);

              return new Shape(id, shapeBpmnElement, bounds2);
            }
          })
          // TODO manage this in another way
          .filter(shape => shape)
      );
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
    // TODO fully duplicated with ShapeConverter
    try {
      const shapes = bpmnDiagram.BPMNPlane.BPMNShape;
      return (
        ensureIsArray(shapes)
          //.filter(shape => )
          .map(shape => {
            const bpmnElement = shape.bpmnElement;
            const shapeBpmnElement = findLaneBpmnElement(bpmnElement);

            if (shapeBpmnElement) {
              const id = shape.id;
              const bounds3 = shape.Bounds;
              const bounds2 = jsonConvert.deserializeObject(bounds3, Bounds);

              return new Shape(id, shapeBpmnElement, bounds2);
            }
          })
          // TODO manage this in another way
          .filter(shape => shape)
      );
    } catch (e) {
      // TODO error management
      console.log(e as Error);
    }
  }
}
