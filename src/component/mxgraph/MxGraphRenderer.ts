import { mxgraph } from 'ts-mxgraph';
import Shape from '../../model/bpmn/shape/Shape';
import Edge from '../../model/bpmn/edge/Edge';
import BpmnModel from '../../model/bpmn/BpmnModel';

export default class MxGraphRenderer {
  constructor(readonly graph: mxgraph.mxGraph) {}

  public render(bpmnModel: BpmnModel) {
    const model = this.graph.getModel();
    model.clear(); // ensure to remove manual changes or already loaded graphs
    model.beginUpdate();
    try {
      this.insertShapes(bpmnModel.shapes);
      this.insertEdges(bpmnModel.edges);
    } catch (e) {
      throw e;
    } finally {
      model.endUpdate();
    }
  }

  private insertShapes(shapes: Shape[]): this {
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

  private insertEdges(edges: Edge[]): void {
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
