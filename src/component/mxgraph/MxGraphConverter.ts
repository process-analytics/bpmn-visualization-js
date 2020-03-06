import { mxgraph } from 'ts-mxgraph';
import Shape from '../../model/bpmn/shape/Shape';
import Edge from '../../model/bpmn/edge/Edge';

export default class MxGraphConverter {
  constructor(readonly graph: mxgraph.mxGraph) {}

  public insertShapes(shapes: Shape[]): this {
    shapes.forEach(shape => {
      const bounds = shape.bounds;
      const bpmnElement = shape.bpmnElement;
      if (bpmnElement !== undefined && bpmnElement !== null) {
        const parent = this.graph.getDefaultParent();
        this.graph.insertVertex(parent, bpmnElement.id, bpmnElement.name, bounds.x, bounds.y, bounds.width, bounds.height, bpmnElement.kind);
      }
    });
    return this;
  }

  public insertEdges(edges: Edge[]): void {
    edges.forEach(edge => {
      const bpmnElement = edge.bpmnElement;
      if (bpmnElement) {
        const parent = this.graph.getDefaultParent();
        this.graph.insertEdge(parent, bpmnElement.id, bpmnElement.name, this.getCell(bpmnElement.sourceRefId), this.getCell(bpmnElement.targetRefId));
      }
    });
  }

  private getCell(id: string): mxgraph.mxCell {
    return this.graph.getModel().getCell(id);
  }
}
