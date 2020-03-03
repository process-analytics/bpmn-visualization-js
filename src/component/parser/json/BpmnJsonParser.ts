import Shape from '../../../model/bpmn/shape/Shape';
import { JsonConvert, OperationMode } from 'json2typescript';
import { Definitions } from './Definitions';

export default class BpmnJsonParser {
  public static parse(json: any): { shapes: Shape[] } {
    const jsonConvert: JsonConvert = new JsonConvert();
    jsonConvert.operationMode = OperationMode.ENABLE;
    const definitions = jsonConvert.deserializeObject(json.definitions, Definitions);

    const shapes: Shape[] = definitions.shapes;
    return { shapes };
  }
}
