import { Definitions } from './Definitions';
import BpmnModel from '../../../model/bpmn/BpmnModel';
import { JsonConvert } from 'json2typescript';
import JsonParser from './JsonParser';

export default class BpmnJsonParser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parse(json: any): BpmnModel {
    const jsonConvert: JsonConvert = JsonParser.getInstance().jsonConvert;
    const definitions = jsonConvert.deserializeObject(json.definitions, Definitions);

    return definitions.bpmnModel;
  }
}
