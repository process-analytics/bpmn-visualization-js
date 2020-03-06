/*
import { JsonConvert, JsonConverter, JsonCustomConvert, OperationMode, ValueCheckingMode } from 'json2typescript';
import Edge from '../../../../model/bpmn/edge/Edge';
import SequenceFlow from '../../../../model/bpmn/edge/SequenceFlow';

const convertedEdgeBpmnElements: SequenceFlow[] = [];

function findEdgeBpmnElement(id: string): SequenceFlow {
  return convertedEdgeBpmnElements.find(i => i.id === id);
}

// TODO : To move in a singleton object to use here and in the BpmnJsonParser
const jsonConvert: JsonConvert = new JsonConvert();
jsonConvert.operationMode = OperationMode.ENABLE;
jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
//////////////////////////////////////////////////////////////

@JsonConverter
export class EdgeModelConverter implements JsonCustomConvert<Edge[]> {
  // BPMNDiagram: Object { name: "LoanManagement",
  // BPMNPlane: { BPMNEdge: [ {…} ], BPMNShape: [ {…} ], bpmnElement: "_RLk98HH_Eei9Z4IY4QeFuA", id: "plane__RLk98HH_Eei9Z4IY4QeFuA" },
  // BPMNLabelStyle: […] }

  deserialize(data: any): Edge[] {
    const edges = data.BPMNPlane.BPMNEdge;
    if (edges === undefined || edges === null || edges === '') {
      return undefined;
    }
    return jsonConvert.deserializeArray(edges, Edge);
  }

  serialize(data: Edge[]): any {
    console.log('Not implemented !!');
  }
}


@JsonConverter
export class EdgeBpmnElementConverter implements JsonCustomConvert<SequenceFlow[]> {

    deserialize(data: any): SequenceFlow[] {
        try {
            function parseProcess(process) {
                function buildEdgeBpmnElement(sequenceFlow) {
        /!*            const sourceRef = sequenceFlow.sourceRef;
                    let source;
                    if (sourceRef !== undefined && sourceRef !== null && sourceRef !== '') {
                        source = findShapeBpmnElement(sourceRef);
                    }

                    const targetRef = sequenceFlow.targetRef;
                    let target;
                    if (targetRef !== undefined && targetRef !== null && targetRef !== '') {
                        target = findShapeBpmnElement(targetRef);
                    }*!/

                    const bpmnName = sequenceFlow.name;
                    let name;
                    if (bpmnName !== undefined && bpmnName !== null && bpmnName !== '') {
                        name = bpmnName;
                    }
                    convertedEdgeBpmnElements.push(new SequenceFlow(sequenceFlow.id, name, source, target));
                }

                const sequenceFlows = process.sequenceFlow;
                if (sequenceFlows !== undefined && sequenceFlows !== null) {
                    if (Array.isArray(sequenceFlows)) {
                        sequenceFlows.map(sequenceFlow => {
                            buildEdgeBpmnElement(sequenceFlow);
                        });
                    } else {
                        buildEdgeBpmnElement(sequenceFlows);
                    }
                }
            }

            if (Array.isArray(data)) {
                data.map(process => parseProcess(process));
            } else {
                parseProcess(data);
            }
            return convertedEdgeBpmnElements;
        } catch (e) {
            console.log(<Error>e);
        }
    }

    serialize(data: EdgeBpmnElement[]): any {
        console.log('Not implemented !!');
    }
}
*/
