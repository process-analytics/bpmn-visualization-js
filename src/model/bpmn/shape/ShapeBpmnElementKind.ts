/**
 * Describes kind of Bpmn elements.
 *
 * Values are the same as in the BPMN MODEL namespace (http://www.omg.org/spec/BPMN/20100524/MODEL) to allow automatic
 * detection of elements in the BPMN source.
 */
export enum ShapeBpmnElementKind {
  LANE = 'lane',
  TASK_USER = 'userTask',
  GATEWAY_PARALLEL = 'parallelGateway',
  GATEWAY_EXCLUSIVE = 'exclusiveGateway',
  EVENT_START = 'startEvent',
}
