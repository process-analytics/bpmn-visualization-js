import { JsonConvert, JsonConverter, OperationMode, ValueCheckingMode } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import Shape from '../../../../model/bpmn/shape/Shape';

//////////////////////////////////////////////////////////////
// TODO : To move in a singleton object to use here and in the BpmnJsonParser
const jsonConvert: JsonConvert = new JsonConvert();
jsonConvert.operationMode = OperationMode.ENABLE;
jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
//////////////////////////////////////////////////////////////

@JsonConverter
export class ShapeConverter extends AbstractConverter<Shape[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(bpmnDiagram: Array<any> | any): Shape[] {
    try {
      const shapes = bpmnDiagram.BPMNPlane.BPMNShape;
      return jsonConvert.deserializeArray(ensureIsArray(shapes), Shape);
    } catch (e) {
      // TODO error management
      console.log(e as Error);
    }
  }
}
