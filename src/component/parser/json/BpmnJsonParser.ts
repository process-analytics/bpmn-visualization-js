import Shape from '../../../model/bpmn/shape/Shape';
import { JsonConvert, OperationMode } from 'json2typescript';
import { Definitions } from './Definitions';
import Edge from '../../../model/bpmn/edge/Edge';
import BpmnModel from '../../../model/bpmn/BpmnModel';

export default class BpmnJsonParser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parse(json: any): BpmnModel {
    const jsonConvert: JsonConvert = new JsonConvert();
    jsonConvert.operationMode = OperationMode.ENABLE;
    const definitions = jsonConvert.deserializeObject(json.definitions, Definitions);

    const lanes: Shape[] = definitions.lanes;
    const flowNodes: Shape[] = definitions.flowNodes;
    const edges: Edge[] = definitions.edges;
    return { lanes, flowNodes, edges };
  }
}
