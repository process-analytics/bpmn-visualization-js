import { JsonConvert, JsonConverter } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import ShapeBpmnElement from '../../../../model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind } from '../../../../model/bpmn/shape/ShapeBpmnElementKind';
import { Process } from '../Definitions';
import SequenceFlow from '../../../../model/bpmn/edge/SequenceFlow';
import JsonParser from '../JsonParser';

const convertedFlowNodeBpmnElements: ShapeBpmnElement[] = [];
const convertedLaneBpmnElements: ShapeBpmnElement[] = [];
const convertedProcessBpmnElements: ShapeBpmnElement[] = [];
const convertedSequenceFlows: SequenceFlow[] = [];

const flowNodeKinds = Object.values(ShapeBpmnElementKind).filter(kind => {
  return kind != ShapeBpmnElementKind.LANE;
});

export function findFlowNodeBpmnElement(id: string): ShapeBpmnElement {
  return convertedFlowNodeBpmnElements.find(i => i.id === id);
}

export function findLaneBpmnElement(id: string): ShapeBpmnElement {
  return convertedLaneBpmnElements.find(i => i.id === id);
}

export function findProcessBpmnElement(id: string): ShapeBpmnElement {
  return convertedProcessBpmnElements.find(i => i.id === id);
}

export function findSequenceFlow(id: string): SequenceFlow {
  return convertedSequenceFlows.find(i => i.id === id);
}

@JsonConverter
export default class ProcessConverter extends AbstractConverter<Process> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(processes: Array<any> | any): Process {
    try {
      // Deletes everything in the array, which does hit other references. For better performance.
      convertedFlowNodeBpmnElements.length = 0;
      convertedLaneBpmnElements.length = 0;
      convertedProcessBpmnElements.length = 0;
      convertedSequenceFlows.length = 0;

      ensureIsArray(processes).forEach(process => this.parseProcess(process));

      const sequenceFlows = convertedSequenceFlows;
      const shapeBpmnElements = convertedLaneBpmnElements.concat(convertedLaneBpmnElements);

      return { shapeBpmnElements, sequenceFlows };
    } catch (e) {
      // TODO error management
      console.log(e as Error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseProcess(process: { [index: string]: any }): void {
    const processId = process.id;
    convertedProcessBpmnElements.push(new ShapeBpmnElement(processId, process.name, ShapeBpmnElementKind.POOL));

    // flow nodes
    flowNodeKinds.forEach(kind => this.buildFlowNodeBpmnElements(processId, process[kind], kind));

    // containers
    this.buildLaneBpmnElements(processId, process[ShapeBpmnElementKind.LANE]);
    this.buildLaneSetBpmnElements(processId, process['laneSet']);

    // flows
    this.buildSequenceFlows(process['sequenceFlow']);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildFlowNodeBpmnElements(processId: string, bpmnElements: Array<any> | any, kind: ShapeBpmnElementKind): void {
    ensureIsArray(bpmnElements).forEach(bpmnElement => convertedFlowNodeBpmnElements.push(new ShapeBpmnElement(bpmnElement.id, bpmnElement.name, kind, processId)));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildLaneSetBpmnElements(processId: string, laneSet: any): void {
    if (laneSet) {
      this.buildLaneBpmnElements(processId, laneSet.lane);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildLaneBpmnElements(processId: string, lanes: Array<any> | any): void {
    ensureIsArray(lanes).forEach(lane => {
      const laneShape = new ShapeBpmnElement(lane.id, lane.name, ShapeBpmnElementKind.LANE, processId);
      convertedLaneBpmnElements.push(laneShape);
      this.assignParentOfLaneFlowNodes(lane);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private assignParentOfLaneFlowNodes(lane: any): void {
    ensureIsArray(lane.flowNodeRef).forEach(flowNodeRef => {
      const shapeBpmnElement = findFlowNodeBpmnElement(flowNodeRef);
      const laneId = lane.id;
      if (shapeBpmnElement) {
        shapeBpmnElement.parentId = laneId;
      } else {
        // TODO error management
        console.log('Unable to assign lane %s as parent: flow node %s is not found', laneId, flowNodeRef);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildSequenceFlows(bpmnElements: Array<any> | any): void {
    const jsonConvert: JsonConvert = JsonParser.getInstance().jsonConvert;
    const t = jsonConvert.deserializeArray(ensureIsArray(bpmnElements), SequenceFlow);
    convertedSequenceFlows.push(...t);
  }
}

@JsonConverter
export class SequenceFlowConverter extends AbstractConverter<SequenceFlow> {
  deserialize(data: string): SequenceFlow {
    return findSequenceFlow(data);
  }
}
