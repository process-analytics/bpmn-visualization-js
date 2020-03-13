import Shape from './shape/Shape';
import Edge from './edge/Edge';

export default interface BpmnModel {
  shapes: Shape[];
  edges: Edge[];
}
