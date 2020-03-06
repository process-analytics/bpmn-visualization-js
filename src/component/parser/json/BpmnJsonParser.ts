import Shape from '../../../model/bpmn/shape/Shape';
import { JsonConvert, OperationMode } from 'json2typescript';
import { Definitions } from './Definitions';
import Edge from '../../../model/bpmn/edge/Edge';

export default class BpmnJsonParser {
  public static parse(json: any): { shapes: Shape[]; edges: Edge[] } {
    const jsonConvert: JsonConvert = new JsonConvert();
    jsonConvert.operationMode = OperationMode.ENABLE;
    const definitions = jsonConvert.deserializeObject(json.definitions, Definitions);

    const shapes: Shape[] = definitions.shapes;
    const edges: Edge[] = definitions.edges;
    return { shapes, edges };
  }
}
