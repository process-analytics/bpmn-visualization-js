import { JsonConvert, JsonConverter } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import Shape from '../../../../model/bpmn/shape/Shape';
import Bounds from '../../../../model/bpmn/Bounds';
import ShapeBpmnElement from '../../../../model/bpmn/shape/ShapeBpmnElement';
import Edge from '../../../../model/bpmn/edge/Edge';
import BpmnModel, { Shapes } from '../../../../model/bpmn/BpmnModel';
import { findFlowNodeBpmnElement, findLaneBpmnElement, findProcessBpmnElement } from './ProcessConverter';
import JsonParser from '../JsonParser';
import { findProcessRefParticipant } from './CollaborationConverter';

function findProcessElement(bpmnElement: string): ShapeBpmnElement {
  // TODO manage storage with a map to avoid looping with find by id
  const participant = findProcessRefParticipant(bpmnElement);
  if (participant) {
    const originalProcessBpmnElement = findProcessBpmnElement(participant.processRef);
    const name = participant.name || originalProcessBpmnElement.name;
    // TODO try to find a less hacky way to manage id (we could put process id to manage direct parent relation)
    // return new ShapeBpmnElement(originalProcessBpmnElement.id, name, originalProcessBpmnElement.kind, originalProcessBpmnElement.parentId);
    return new ShapeBpmnElement(participant.id, name, originalProcessBpmnElement.kind, originalProcessBpmnElement.parentId);
  }
}

@JsonConverter
export default class DiagramConverter extends AbstractConverter<BpmnModel> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private deserializeShapes(shapes: any): Shapes {
    const convertedShapes: Shapes = { flowNodes: [], lanes: [], pools: [] };

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

      // TODO logic duplication with flownode and lane management
      const pool = this.deserializeShape(shape, (bpmnElement: string) => findProcessElement(bpmnElement));
      if (pool) {
        convertedShapes.pools.push(pool);
        continue;
      }

      // TODO error management
      console.log('Not possible to find model element with id ' + shape.bpmnElement);
    }

    return convertedShapes;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private deserializeShape(shape: any, findShapeElement: (bpmnElement: string) => ShapeBpmnElement): Shape | undefined {
    const bpmnElement = findShapeElement(shape.bpmnElement);
    if (bpmnElement) {
      const id = shape.id;

      const jsonConvert: JsonConvert = JsonParser.getInstance().jsonConvert;
      const bounds = jsonConvert.deserializeObject(shape.Bounds, Bounds);

      return new Shape(id, bpmnElement, bounds);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private deserializeEdges(edges: any): Edge[] {
    const jsonConvert: JsonConvert = JsonParser.getInstance().jsonConvert;
    return jsonConvert.deserializeArray(ensureIsArray(edges), Edge);
  }
}
