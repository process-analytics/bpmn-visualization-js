import { JsonConvert, JsonConverter, OperationMode, ValueCheckingMode } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import ShapeBpmnElement from '../../../../model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind } from '../../../../model/bpmn/shape/ShapeBpmnElementKind';
import { Collaboration, Semantic } from '../Definitions';

const convertedPoolBpmnElements: ShapeBpmnElement[] = [];

export function findPoolBpmnElement(id: string): ShapeBpmnElement {
  return convertedPoolBpmnElements.find(i => i.id === id);
}

// TODO : To move in a singleton object to use here and in the BpmnJsonParser
const jsonConvert: JsonConvert = new JsonConvert();
jsonConvert.operationMode = OperationMode.ENABLE;
jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
//////////////////////////////////////////////////////////////

@JsonConverter
export default class CollaborationConverter extends AbstractConverter<Collaboration> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(collaboration: any): Collaboration {
    try {
      // Deletes everything in the array, which does hit other references. For better performance.
      convertedPoolBpmnElements.length = 0;

      const participant = collaboration['participant'];

      const poolShape = new ShapeBpmnElement(participant.id, participant.name, ShapeBpmnElementKind.POOL);
      convertedPoolBpmnElements.push(poolShape);

      return {};
    } catch (e) {
      // TODO error management
      console.log(e as Error);
    }
  }
}
