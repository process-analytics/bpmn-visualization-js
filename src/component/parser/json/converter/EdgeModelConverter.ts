import { JsonConvert, JsonConverter, OperationMode, ValueCheckingMode } from 'json2typescript';
import SequenceFlow from '../../../../model/bpmn/edge/SequenceFlow';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';

const convertedSequenceFlows: SequenceFlow[] = [];

function findSequenceFlow(id: string): SequenceFlow {
  return convertedSequenceFlows.find(i => i.id === id);
}

// TODO : To move in a singleton object to use here and in the BpmnJsonParser
const jsonConvert: JsonConvert = new JsonConvert();
jsonConvert.operationMode = OperationMode.ENABLE;
jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
//////////////////////////////////////////////////////////////

@JsonConverter
export default class EdgeModelConverter extends AbstractConverter<SequenceFlow[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildSequenceFlow(bpmnElements: Array<any> | any): void {
    const t = jsonConvert.deserializeArray(ensureIsArray(bpmnElements), SequenceFlow);
    convertedSequenceFlows.push(...t);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseProcess(process: { sequenceFlow: any }): void {
    this.buildSequenceFlow(process.sequenceFlow);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(processes: Array<any> | any): SequenceFlow[] {
    // Deletes everything in the array, which does hit other references. More performant.
    convertedSequenceFlows.length = 0;

    ensureIsArray(processes).map(process => this.parseProcess(process));
    return convertedSequenceFlows;
  }
}

@JsonConverter
export class SequenceFlowConverter extends AbstractConverter<SequenceFlow> {
  deserialize(data: string): SequenceFlow {
    return findSequenceFlow(data);
  }
}
