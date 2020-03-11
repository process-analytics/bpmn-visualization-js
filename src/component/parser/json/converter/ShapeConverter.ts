import { JsonConvert, JsonConverter, OperationMode, ValueCheckingMode } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import Shape from '../../../../model/bpmn/shape/Shape';
import Bounds from '../../../../model/bpmn/Bounds';
import { findLaneBpmnElement, findFlowNodeBpmnElement } from './ShapeModelConverter';
import ShapeBpmnElement from '../../../../model/bpmn/shape/ShapeBpmnElement';

//////////////////////////////////////////////////////////////
// TODO : To move in a singleton object to use here and in the BpmnJsonParser
const jsonConvert: JsonConvert = new JsonConvert();
jsonConvert.operationMode = OperationMode.ENABLE;
jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
//////////////////////////////////////////////////////////////

abstract class ShapeConverter extends AbstractConverter<Shape[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(bpmnDiagram: Array<any> | any): Shape[] {
    try {
      const shapes = bpmnDiagram.BPMNPlane.BPMNShape;
      return ensureIsArray(shapes)
        .filter(shape => this.findShapeElement(shape.bpmnElement))
        .map(shape => {
          const id = shape.id;
          const bpmnElement = this.findShapeElement(shape.bpmnElement);
          const bounds = jsonConvert.deserializeObject(shape.Bounds, Bounds);
          return new Shape(id, bpmnElement, bounds);
        });
    } catch (e) {
      // TODO error management
      console.log(e as Error);
    }
  }

  protected abstract findShapeElement(bpmnElement: string): ShapeBpmnElement;
}

@JsonConverter
export class FlowNodeConverter extends ShapeConverter {
  protected findShapeElement(bpmnElement: string): ShapeBpmnElement {
    return findFlowNodeBpmnElement(bpmnElement);
  }
}

@JsonConverter
export class LaneConverter extends ShapeConverter {
  protected findShapeElement(bpmnElement: string): ShapeBpmnElement {
    return findLaneBpmnElement(bpmnElement);
  }
}
