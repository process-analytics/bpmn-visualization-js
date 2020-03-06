import { mxgraph } from 'ts-mxgraph';
import Shape from '../../model/bpmn/shape/Shape';

export default class MxGraphConverter {
  constructor(readonly graph: mxgraph.mxGraph) {}

  public insertShapes(shapes: Shape[]): void {
    shapes.forEach(shape => {
      const bounds = shape.bounds;
      const bpmnElement = shape.bpmnElement;
      if (bpmnElement !== undefined && bpmnElement !== null) {
        const parent = this.graph.getDefaultParent();
        this.graph.insertVertex(parent, bpmnElement.id, bpmnElement.name, bounds.x, bounds.y, bounds.width, bounds.height, bpmnElement.kind);
      }
    });
  }
}
