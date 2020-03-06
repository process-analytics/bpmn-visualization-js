import { JsonConvert, JsonConverter, OperationMode, ValueCheckingMode } from 'json2typescript';
import Edge from '../../../../model/bpmn/edge/Edge';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';

// TODO : To move in a singleton object to use here and in the BpmnJsonParser
const jsonConvert: JsonConvert = new JsonConvert();
jsonConvert.operationMode = OperationMode.ENABLE;
jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
//////////////////////////////////////////////////////////////

@JsonConverter
export default class EdgeConverter extends AbstractConverter<Edge[]> {
  deserialize(data: Array<any> | any): Edge[] {
    const edges = data.BPMNPlane.BPMNEdge;
    return jsonConvert.deserializeArray(ensureIsArray(edges), Edge);
  }
}
