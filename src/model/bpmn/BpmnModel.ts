import Shape from './shape/Shape';
import Edge from './edge/Edge';

export default class BpmnModel {
  constructor(readonly shapes: Shape[], readonly edges: Edge[]) {}
}
