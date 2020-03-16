import { JsonConvert, JsonConverter, OperationMode, ValueCheckingMode } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import Shape from '../../../../model/bpmn/shape/Shape';
import Bounds from '../../../../model/bpmn/Bounds';
import { findLaneBpmnElement, findFlowNodeBpmnElement } from './ShapeModelConverter';
import ShapeBpmnElement from '../../../../model/bpmn/shape/ShapeBpmnElement';
import Edge from '../../../../model/bpmn/edge/Edge';
import BpmnModel, { Shapes } from '../../../../model/bpmn/BpmnModel';

//////////////////////////////////////////////////////////////
// TODO : To move in a singleton object to use here and in the BpmnJsonParser
const jsonConvert: JsonConvert = new JsonConvert();
jsonConvert.operationMode = OperationMode.ENABLE;
jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
//////////////////////////////////////////////////////////////

@JsonConverter
export default class DiagramConverter extends AbstractConverter<BpmnModel> {
  deserialize(bpmnDiagram: Array<any> | any): BpmnModel {
    try {
      const plane = bpmnDiagram.BPMNPlane;

      const edges = { edges: this.deserializeEdges(plane.BPMNEdge) };
      const shapes = this.deserializeShapes(plane.BPMNShape);

      return { ...shapes, ...edges };
    } catch (e) {
      // TODO error management
      console.log(e as Error);
    }
  }
  private deserializeShapes(shapes: any): Shapes {
    const convertedShapes: Shapes = { flowNodes: [], lanes: [] };

    shapes = ensureIsArray(shapes);

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      const flowNode = this.deserializeShape(shape, (bpmnElement: string) => findFlowNodeBpmnElement(bpmnElement));
      if (flowNode) {
        convertedShapes.flowNodes.push(flowNode);
        continue;
      }

      const lane = this.deserializeShape(shape, (bpmnElement: string) => findLaneBpmnElement(bpmnElement));
      if (lane) {
        convertedShapes.lanes.push(lane);
        continue;
      }

      // TODO error management
      console.log('Not possible to find model element with id ' + shape.bpmnElement);
    }

    return convertedShapes;
  }

  private deserializeShape(shape: any, findShapeElement: (bpmnElement: string) => ShapeBpmnElement): Shape | undefined {
    const bpmnElement = findShapeElement(shape.bpmnElement);
    if (bpmnElement) {
      const id = shape.id;
      const bounds = jsonConvert.deserializeObject(shape.Bounds, Bounds);
      return new Shape(id, bpmnElement, bounds);
    }
  }

  private deserializeEdges(edges: any): Edge[] {
    return jsonConvert.deserializeArray(ensureIsArray(edges), Edge);
  }
}
