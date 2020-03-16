import { JsonConvert, OperationMode } from 'json2typescript';
import { Definitions } from './Definitions';
import BpmnModel from '../../../model/bpmn/BpmnModel';

export default class BpmnJsonParser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parse(json: any): BpmnModel {
    const jsonConvert: JsonConvert = new JsonConvert();
    jsonConvert.operationMode = OperationMode.ENABLE;
    const definitions = jsonConvert.deserializeObject(json.definitions, Definitions);

    return definitions.bpmnModel;
  }
}
