import { mxgraph } from 'ts-mxgraph';
import Shape from '../../model/bpmn/shape/Shape';

export default class MxGraphConverter {
  constructor(readonly graph: mxgraph.mxGraph) {}

  public insertShapes(shapes: Shape[]): void {
    shapes.forEach(shape => {
      //const bounds = shape.bounds;
      const bpmnElement = shape.bpmnElement;
      if (bpmnElement !== undefined && bpmnElement !== null) {
        //this.graph.insertVertex(lane, bpmnElement.id, bpmnElement.name, bounds.x, bounds.y, bounds.width, bounds.height, bpmnElement.kind);
        this.graph.insertVertex(this.graph.getDefaultParent(), bpmnElement.id, bpmnElement.name, 0, 0, 20, 20, bpmnElement.kind);
      }
    });
  }
}
