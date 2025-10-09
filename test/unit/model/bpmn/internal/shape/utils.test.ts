/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { FlowKind, ShapeBpmnElementKind, ShapeUtil } from '@lib/model/bpmn/internal';

describe('ShapeUtil', () => {
  it('top level bpmn event kinds', () => {
    const events = ShapeUtil.eventKinds();
    expect(events).toContain(ShapeBpmnElementKind.EVENT_END);
    expect(events).toContain(ShapeBpmnElementKind.EVENT_START);
  });

  it('task kinds', () => {
    const tasks = ShapeUtil.taskKinds();
    expect(tasks).toContain(ShapeBpmnElementKind.TASK);
    expect(tasks).toContain(ShapeBpmnElementKind.TASK_USER);
  });

  it('flow node kinds', () => {
    const flowNodeKinds = ShapeUtil.flowNodeKinds();

    expect(flowNodeKinds).toEqual(expect.arrayContaining(ShapeUtil.activityKinds()));
    expect(flowNodeKinds).toEqual(expect.arrayContaining(ShapeUtil.eventKinds()));
    expect(flowNodeKinds).toEqual(expect.arrayContaining(ShapeUtil.gatewayKinds()));

    expect(flowNodeKinds).not.toContain(ShapeBpmnElementKind.POOL);
    expect(flowNodeKinds).not.toContain(ShapeBpmnElementKind.GROUP);
  });

  it('artifact kinds', () => {
    const artifacts = ShapeUtil.artifactKinds();
    expect(artifacts).toContain(ShapeBpmnElementKind.GROUP);
    expect(artifacts).toContain(ShapeBpmnElementKind.TEXT_ANNOTATION);
  });

  describe('Is pool or lane?', () => {
    it.each([
      [ShapeBpmnElementKind.CALL_ACTIVITY],
      [ShapeBpmnElementKind.SUB_PROCESS],
      [ShapeBpmnElementKind.TASK],
      [ShapeBpmnElementKind.TASK_SERVICE],
      [ShapeBpmnElementKind.EVENT_START],
      [ShapeBpmnElementKind.EVENT_BOUNDARY],
      [ShapeBpmnElementKind.GATEWAY_PARALLEL],
      [ShapeBpmnElementKind.GATEWAY_EVENT_BASED],
      [ShapeBpmnElementKind.GROUP],
      [ShapeBpmnElementKind.TEXT_ANNOTATION],
    ])('%s', (bpmnKind: ShapeBpmnElementKind) => {
      expect(ShapeUtil.isPoolOrLane(bpmnKind)).toBeFalsy();
    });
  });

  describe('isArtifact', () => {
    test.each`
      kind                                     | expected
      ${ShapeBpmnElementKind.EVENT_END}        | ${false}
      ${ShapeBpmnElementKind.GATEWAY_PARALLEL} | ${false}
      ${ShapeBpmnElementKind.TASK}             | ${false}
      ${ShapeBpmnElementKind.SUB_PROCESS}      | ${false}
      ${ShapeBpmnElementKind.CALL_ACTIVITY}    | ${false}
      ${ShapeBpmnElementKind.POOL}             | ${false}
      ${ShapeBpmnElementKind.LANE}             | ${false}
      ${ShapeBpmnElementKind.GROUP}            | ${true}
      ${ShapeBpmnElementKind.TEXT_ANNOTATION}  | ${true}
      ${FlowKind.MESSAGE_FLOW}                 | ${false}
      ${'unknown'}                             | ${false}
      ${'receiveTask'}                         | ${false}
    `('$kind isArtifact? $expected', ({ kind, expected }: Record<string, unknown>) => {
      expect(ShapeUtil.isArtifact(kind as string)).toBe(expected);
    });
  });

  describe('isFlowNode', () => {
    test.each`
      kind                                     | expected
      ${ShapeBpmnElementKind.EVENT_END}        | ${true}
      ${ShapeBpmnElementKind.GATEWAY_PARALLEL} | ${true}
      ${ShapeBpmnElementKind.TASK}             | ${true}
      ${ShapeBpmnElementKind.SUB_PROCESS}      | ${true}
      ${ShapeBpmnElementKind.CALL_ACTIVITY}    | ${true}
      ${ShapeBpmnElementKind.POOL}             | ${false}
      ${ShapeBpmnElementKind.LANE}             | ${false}
      ${ShapeBpmnElementKind.GROUP}            | ${false}
      ${ShapeBpmnElementKind.TEXT_ANNOTATION}  | ${false}
      ${FlowKind.MESSAGE_FLOW}                 | ${false}
      ${'unknown'}                             | ${false}
      ${'receiveTask'}                         | ${true}
    `('$kind isFlowNode? $expected', ({ kind, expected }: Record<string, unknown>) => {
      expect(ShapeUtil.isFlowNode(kind as string)).toBe(expected);
    });
  });

  describe('Reference kinds cannot be modified', () => {
    it.each`
      kind            | kindsFunction
      ${'activities'} | ${() => ShapeUtil.activityKinds()}
      ${'artifacts'}  | ${() => ShapeUtil.artifactKinds()}
      ${'events'}     | ${() => ShapeUtil.eventKinds()}
      ${'flow nodes'} | ${() => ShapeUtil.flowNodeKinds()}
      ${'gateways'}   | ${() => ShapeUtil.gatewayKinds()}
      ${'tasks'}      | ${() => ShapeUtil.taskKinds()}
    `('$kind', ({ kindsFunction }: { kindsFunction: () => string[] }) => {
      const kinds = kindsFunction();

      const initialKinds = [...kinds];
      expect(kinds).toEqual(initialKinds);
      expect(kinds).not.toBe(initialKinds);

      // ensure the reference kinds is modified
      const initialLength = kinds.length;
      expect(kinds.push(null)).toEqual(initialLength + 1);
      expect(kinds).not.toEqual(initialKinds);

      const newKinds = kindsFunction();
      expect(newKinds).not.toBe(kinds);
      expect(newKinds).toEqual(initialKinds);
    });
  });
});
