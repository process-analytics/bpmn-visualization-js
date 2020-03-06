import { JsonConvert, JsonConverter, OperationMode, ValueCheckingMode } from 'json2typescript';
import Edge from '../../../../model/bpmn/edge/Edge';
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
export class EdgeConverter extends AbstractConverter<Edge[]> {
  deserialize(data: Array<any> | any): Edge[] {
    try {
      const edges = data.BPMNPlane.BPMNEdge;
      return jsonConvert.deserializeArray(ensureIsArray(edges), Edge);
    } catch (e) {
      console.log(e);
    }
  }
}

@JsonConverter
export class EdgeModelConverter extends AbstractConverter<SequenceFlow[]> {
  buildSequenceFlow(bpmnElements: Array<any> | any) {
    const t = jsonConvert.deserializeArray(ensureIsArray(bpmnElements), SequenceFlow);
    convertedSequenceFlows.concat(t);
  }

  parseProcess(process: { sequenceFlow: any }) {
    this.buildSequenceFlow(process.sequenceFlow);
  }

  deserialize(processes: Array<any> | any): SequenceFlow[] {
    try {
      // Deletes everything in the array, which does hit other references. More performant.
      convertedSequenceFlows.length = 0;

      ensureIsArray(processes).map(process => this.parseProcess(process));
      return convertedSequenceFlows;
    } catch (e) {
      console.log(e);
    }
  }
}

@JsonConverter
export class SequenceFlowConverter extends AbstractConverter<SequenceFlow> {
  deserialize(data: string): SequenceFlow {
    try {
      return findSequenceFlow(data);
    } catch (e) {
      console.log(e);
    }
  }
}
