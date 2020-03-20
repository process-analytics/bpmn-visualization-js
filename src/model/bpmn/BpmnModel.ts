import Shape from './shape/Shape';
import Edge from './edge/Edge';

export default interface BpmnModel extends Shapes {
  edges: Edge[];
}

export interface Shapes {
  flowNodes: Shape[];
  lanes: Shape[];
  pools: Shape[];
}
