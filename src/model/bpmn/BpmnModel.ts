import Shape from './shape/Shape';
import Edge from './edge/Edge';

export default interface BpmnModel {
  edges: Edge[];
  flowNodes: Shape[];
  lanes: Shape[];
}
