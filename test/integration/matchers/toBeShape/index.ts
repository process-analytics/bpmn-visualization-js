/**
 * Copyright 2020 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { ShapeValue } from '@maxgraph/core';

import type { ExpectedCell, ExpectedStateStyle } from '../matcher-utils';
import { buildCellMatcher, buildCommonExpectedStateStyle, buildReceivedCellWithCommonAttributes } from '../matcher-utils';
import type {
  ExpectedBoundaryEventModelElement,
  ExpectedCallActivityModelElement,
  ExpectedEventBasedGatewayModelElement,
  ExpectedEventModelElement,
  ExpectedShapeModelElement,
  ExpectedStartEventModelElement,
  ExpectedSubProcessModelElement,
} from '../../helpers/model-expect';
import { getDefaultParentId } from '../../helpers/model-expect';
import { ShapeBpmnElementKind, ShapeBpmnEventBasedGatewayKind } from '../../../../src/model/bpmn/internal';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;
import type { BPMNCellStyle } from '../../../../src/component/mxgraph/renderer/StyleComputer';

function expectedStrokeWidth(kind: ShapeBpmnElementKind): number {
  return [
    ShapeBpmnElementKind.EVENT_BOUNDARY,
    ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
    ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW,
    ShapeBpmnElementKind.EVENT_START,
    ShapeBpmnElementKind.GATEWAY_EVENT_BASED,
    ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
    ShapeBpmnElementKind.GATEWAY_INCLUSIVE,
    ShapeBpmnElementKind.GATEWAY_PARALLEL,
    ShapeBpmnElementKind.GROUP,
    ShapeBpmnElementKind.SUB_PROCESS,
    ShapeBpmnElementKind.TASK,
    ShapeBpmnElementKind.TASK_BUSINESS_RULE,
    ShapeBpmnElementKind.TASK_MANUAL,
    ShapeBpmnElementKind.TASK_RECEIVE,
    ShapeBpmnElementKind.TASK_SCRIPT,
    ShapeBpmnElementKind.TASK_SERVICE,
    ShapeBpmnElementKind.TASK_SEND,
    ShapeBpmnElementKind.TASK_USER,
    ShapeBpmnElementKind.TEXT_ANNOTATION,
  ].includes(kind)
    ? 2
    : [ShapeBpmnElementKind.CALL_ACTIVITY, ShapeBpmnElementKind.EVENT_END].includes(kind)
    ? 5
    : undefined;
}

function buildExpectedStateStyle(expectedModel: ExpectedShapeModelElement): ExpectedStateStyle {
  const expectedStateStyle = buildCommonExpectedStateStyle(expectedModel);
  // TODO remove forcing type when maxGraph fixes its types
  expectedStateStyle.shape = <ShapeValue>(<unknown>(!expectedModel.styleShape ? expectedModel.kind : expectedModel.styleShape));
  expectedStateStyle.verticalAlign = expectedModel.verticalAlign ? expectedModel.verticalAlign : 'middle';
  expectedStateStyle.align = expectedModel.align ? expectedModel.align : 'center';
  expectedStateStyle.strokeWidth = expectedStrokeWidth(expectedModel.kind);

  expectedStateStyle.fillColor = [ShapeBpmnElementKind.LANE, ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.TEXT_ANNOTATION, ShapeBpmnElementKind.GROUP].includes(
    expectedModel.kind,
  )
    ? 'none'
    : expectedStateStyle.fillColor;

  if ('isHorizontal' in expectedModel) {
    expectedStateStyle.horizontal = expectedModel.isHorizontal;
  }

  return expectedStateStyle;
}

/**
 * Here we don't check all properties
 * @param expectedModel
 */
function buildExpectedStyle(
  expectedModel:
    | ExpectedShapeModelElement
    | ExpectedSubProcessModelElement
    | ExpectedEventModelElement
    | ExpectedStartEventModelElement
    | ExpectedBoundaryEventModelElement
    | ExpectedEventBasedGatewayModelElement
    | ExpectedCallActivityModelElement,
): BPMNCellStyle {
  const style: BPMNCellStyle = { bpmn: {} };
  // TODO share with edge
  // let expectedStyle: string = expectedModel.kind;
  style.baseStyleNames = [expectedModel.kind];
  style.bpmn.kind = expectedModel.kind;

  if ('eventDefinitionKind' in expectedModel) {
    // expectedStyle = expectedStyle + `.*bpmn.eventDefinitionKind=${expectedModel.eventDefinitionKind}`;
    style.bpmn.eventDefinitionKind = expectedModel.eventDefinitionKind;
  }
  if ('subProcessKind' in expectedModel) {
    // expectedStyle = expectedStyle + `.*bpmn.subProcessKind=${expectedModel.subProcessKind}`;
    style.bpmn.subProcessKind = expectedModel.subProcessKind;
  }
  if ('globalTaskKind' in expectedModel) {
    // expectedStyle = expectedStyle + `.*bpmn.globalTaskKind=${expectedModel.globalTaskKind}`;
    style.bpmn.globalTaskKind = expectedModel.globalTaskKind;
  }
  if (expectedModel.isInstantiating !== undefined) {
    // expectedStyle = expectedStyle + `.*bpmn.isInstantiating=${expectedModel.isInstantiating}`;
    style.bpmn.isInstantiating = expectedModel.isInstantiating;
  }
  // if (expectedModel.markers?.length > 0) {
  //   expectedStyle = expectedStyle + `.*bpmn.markers=${expectedModel.markers.join(',')}`;
  // }
  if (expectedModel.markers) {
    style.bpmn.markers = expectedModel.markers;
  }
  if ('isInterrupting' in expectedModel) {
    // expectedStyle = expectedStyle + `.*bpmn.isInterrupting=${expectedModel.isInterrupting}`;
    style.bpmn.isInterrupting = expectedModel.isInterrupting;
  }
  if ('gatewayKind' in expectedModel) {
    // expectedStyle = expectedStyle + `.*bpmn.gatewayKind=${expectedModel.gatewayKind}`;
    style.bpmn.gatewayKind = expectedModel.gatewayKind;
  }
  // return expectedStyle + '.*';

  return style;
}

function buildExpectedCell(id: string, expectedModel: ExpectedShapeModelElement): ExpectedCell {
  // TODO refactor, duplication with buildExpectedCell in edge matchers
  const parentId = expectedModel.parentId;
  return {
    id,
    value: expectedModel.label ?? null, // maxGraph now set to 'null', mxGraph set to 'undefined'
    style: expect.objectContaining(buildExpectedStyle(expectedModel)),
    edge: false,
    vertex: true,
    parent: { id: parentId ? parentId : getDefaultParentId() },
    state: {
      style: buildExpectedStateStyle(expectedModel),
    },
    overlays: expectedModel.overlays,
  };
}

function buildShapeMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildCellMatcher(matcherName, matcherContext, received, expected, 'Shape', buildExpectedCell, buildReceivedCellWithCommonAttributes);
}

export function toBeShape(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildShapeMatcher('toBeShape', this, received, expected);
}

function buildContainerMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  // const isHorizontal = 'isHorizontal' in expected ? expected.isHorizontal : false;
  'isHorizontal' in expected && (expected.isHorizontal = expected.isHorizontal);

  // TODO maxGraph "TS2748: Cannot access ambient const enums when the '--isolatedModules' flag is provided." constants.SHAPE.SWIMLANE
  return buildShapeMatcher(matcherName, matcherContext, received, { ...expected, styleShape: 'swimlane' });
}

export function toBePool(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildContainerMatcher('toBePool', this, received, { ...expected, kind: ShapeBpmnElementKind.POOL });
}

export function toBeLane(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildContainerMatcher('toBeLane', this, received, { ...expected, kind: ShapeBpmnElementKind.LANE });
}

export function toBeCallActivity(this: MatcherContext, received: string, expected: ExpectedCallActivityModelElement): CustomMatcherResult {
  // TODO introduce common code for activity kinds
  expected.markers ??= [];
  return buildShapeMatcher('toBeCallActivity', this, received, { ...expected, kind: ShapeBpmnElementKind.CALL_ACTIVITY });
}

export function toBeSubProcess(this: MatcherContext, received: string, expected: ExpectedSubProcessModelElement): CustomMatcherResult {
  // TODO introduce common code for activity kinds
  expected.markers ??= [];
  return buildShapeMatcher('toBeSubProcess', this, received, { ...expected, kind: ShapeBpmnElementKind.SUB_PROCESS });
}

export function toBeTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  // TODO introduce common code for activity kinds
  expected.markers ??= [];
  return buildShapeMatcher('toBeTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK });
}

export function toBeServiceTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  // TODO introduce common code for activity kinds
  expected.markers ??= [];
  return buildShapeMatcher('toBeServiceTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_SERVICE });
}

export function toBeUserTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  // TODO introduce common code for activity kinds
  expected.markers ??= [];
  return buildShapeMatcher('toBeUserTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_USER });
}

export function toBeReceiveTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  // TODO introduce common code for activity kinds
  expected.markers ??= [];
  return buildShapeMatcher('toBeReceiveTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_RECEIVE });
}

export function toBeSendTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  // TODO introduce common code for activity kinds
  expected.markers ??= [];
  return buildShapeMatcher('toBeSendTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_SEND });
}

export function toBeManualTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  // TODO introduce common code for activity kinds
  expected.markers ??= [];
  return buildShapeMatcher('toBeManualTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_MANUAL });
}

export function toBeScriptTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  // TODO introduce common code for activity kinds
  expected.markers ??= [];
  return buildShapeMatcher('toBeScriptTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_SCRIPT });
}

export function toBeBusinessRuleTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  // TODO introduce common code for activity kinds
  expected.markers ??= [];
  return buildShapeMatcher('toBeBusinessRuleTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE });
}

function buildEventMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedStartEventModelElement): CustomMatcherResult {
  return buildShapeMatcher(matcherName, matcherContext, received, { ...expected, verticalAlign: expected.label ? 'top' : 'middle' });
}

export function toBeStartEvent(this: MatcherContext, received: string, expected: ExpectedStartEventModelElement): CustomMatcherResult {
  return buildEventMatcher('toBeStartEvent', this, received, { ...expected, kind: ShapeBpmnElementKind.EVENT_START });
}

export function toBeEndEvent(this: MatcherContext, received: string, expected: ExpectedEventModelElement): CustomMatcherResult {
  return buildEventMatcher('toBeStartEvent', this, received, { ...expected, kind: ShapeBpmnElementKind.EVENT_END });
}

export function toBeIntermediateThrowEvent(this: MatcherContext, received: string, expected: ExpectedEventModelElement): CustomMatcherResult {
  return buildEventMatcher('toBeIntermediateThrowEvent', this, received, { ...expected, kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW });
}

export function toBeIntermediateCatchEvent(this: MatcherContext, received: string, expected: ExpectedEventModelElement): CustomMatcherResult {
  return buildEventMatcher('toBeIntermediateCatchEvent', this, received, { ...expected, kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH });
}

export function toBeBoundaryEvent(this: MatcherContext, received: string, expected: ExpectedBoundaryEventModelElement): CustomMatcherResult {
  return buildEventMatcher('toBeBoundaryEvent', this, received, { ...expected, kind: ShapeBpmnElementKind.EVENT_BOUNDARY });
}

export function toBeEventBasedGateway(this: MatcherContext, received: string, expected: ExpectedEventBasedGatewayModelElement): CustomMatcherResult {
  expected.gatewayKind ??= ShapeBpmnEventBasedGatewayKind.None;
  return buildShapeMatcher('toBeEventBasedGateway', this, received, { ...expected, kind: ShapeBpmnElementKind.GATEWAY_EVENT_BASED });
}
