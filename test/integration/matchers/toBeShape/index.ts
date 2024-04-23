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

import type { ExpectedCell, ComparedBpmnCellStyle } from '../matcher-utils';
import { buildCellMatcher, buildExpectedCellStyleWithCommonAttributes, buildReceivedCellWithCommonAttributes } from '../matcher-utils';
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
import { ShapeBpmnElementKind, ShapeBpmnEventBasedGatewayKind, ShapeBpmnMarkerKind, ShapeBpmnSubProcessKind } from '@lib/model/bpmn/internal';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;
import type { BpmnCellStyle } from '@lib/component/mxgraph/style/types';

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

export function buildExpectedShapeCellStyle(expectedModel: ExpectedShapeModelElement): ComparedBpmnCellStyle {
  const style = buildExpectedCellStyleWithCommonAttributes(expectedModel);
  // TODO maxgraph@0.1.0 remove forcing type when maxGraph fixes its types
  // expectedStateStyle.shape = <ShapeValue>(<unknown>(!expectedModel.styleShape ? expectedModel.kind : expectedModel.styleShape));
  style.shape = expectedModel.styleShape ?? expectedModel.kind;
  style.verticalAlign = expectedModel.verticalAlign ?? 'middle';
  style.align = expectedModel.align ?? 'center';
  style.strokeWidth = style.strokeWidth ?? expectedStrokeWidth(expectedModel.kind);

  style.fillColor =
    expectedModel.fill?.color ??
    ([ShapeBpmnElementKind.LANE, ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.TEXT_ANNOTATION, ShapeBpmnElementKind.GROUP].includes(expectedModel.kind)
      ? 'none'
      : style.fillColor);
  style.swimlaneFillColor = [ShapeBpmnElementKind.POOL, ShapeBpmnElementKind.LANE].includes(expectedModel.kind) && style.fillColor !== 'none' ? style.fillColor : undefined;

  style.fillOpacity = expectedModel.fill?.opacity;
  'isSwimLaneLabelHorizontal' in expectedModel && (style.horizontal = expectedModel.isSwimLaneLabelHorizontal);

  // ignore marker order, which is only relevant when rendering the shape (it has its own order algorithm)
  'markers' in expectedModel && (style.markers = expectedModel.markers.sort());

  return style;
}

// TODO maxgraph@0.1.0 Here we don't check all properties. This duplicates the other style check functions
function buildExpectedShapeStylePropertyRegexp(
  expectedModel:
    | ExpectedShapeModelElement
    | ExpectedSubProcessModelElement
    | ExpectedEventModelElement
    | ExpectedStartEventModelElement
    | ExpectedBoundaryEventModelElement
    | ExpectedEventBasedGatewayModelElement
    | ExpectedCallActivityModelElement,
): BpmnCellStyle {
  const style: BpmnCellStyle = { bpmn: {} };
  // TODO maxgraph@0.1.0 share with edge
  style.baseStyleNames = [expectedModel.kind];
  style.bpmn.kind = expectedModel.kind;

  if ('eventDefinitionKind' in expectedModel) {
    style.bpmn.eventDefinitionKind = expectedModel.eventDefinitionKind;
  }
  if ('subProcessKind' in expectedModel) {
    style.bpmn.subProcessKind = expectedModel.subProcessKind;
  }
  if ('globalTaskKind' in expectedModel) {
    style.bpmn.globalTaskKind = expectedModel.globalTaskKind;
  }
  if (expectedModel.isInstantiating !== undefined) {
    style.bpmn.isInstantiating = expectedModel.isInstantiating;
  }
  if (expectedModel.markers) {
    style.bpmn.markers = expectedModel.markers;
  }
  if ('isInterrupting' in expectedModel) {
    style.bpmn.isInterrupting = expectedModel.isInterrupting;
  }
  if ('gatewayKind' in expectedModel) {
    style.bpmn.gatewayKind = expectedModel.gatewayKind;
  }
  if ('extraCssClasses' in expectedModel) {
    style.bpmn.extraCssClasses = expectedModel.extraCssClasses;
  }

  return style;
}

function buildExpectedCell(id: string, expectedModel: ExpectedShapeModelElement): ExpectedCell {
  // TODO maxgraph@0.1.0 refactor, duplication with buildExpectedCell in edge matchers
  const parentId = expectedModel.parentId;
  return {
    id,
    value: expectedModel.label ?? null, // maxGraph now set to 'null', mxGraph set to 'undefined'
    styleRawFromModelOrJestExpect: expect.objectContaining(buildExpectedShapeStylePropertyRegexp(expectedModel)),
    styleResolvedFromModel: buildExpectedShapeCellStyle(expectedModel),
    styleViewState: buildExpectedShapeCellStyle(expectedModel),
    edge: false,
    vertex: true,
    parent: { id: parentId ? parentId : getDefaultParentId() },
    overlays: expectedModel.overlays,
  };
}

function buildShapeMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildCellMatcher(matcherName, matcherContext, received, expected, 'Shape', buildExpectedCell, buildReceivedCellWithCommonAttributes);
}

function buildContainerMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildShapeMatcher(matcherName, matcherContext, received, {
    ...expected,
    // TODO maxgraph@0.1.0 maxGraph "TS2748: Cannot access ambient const enums when the '--isolatedModules' flag is provided." constants.SHAPE.SWIMLANE
    styleShape: 'swimlane',
    isSwimLaneLabelHorizontal: expected.isSwimLaneLabelHorizontal ?? false,
  });
}

export function toBePool(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildContainerMatcher('toBePool', this, received, { ...expected, kind: ShapeBpmnElementKind.POOL });
}

export function toBeLane(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildContainerMatcher('toBeLane', this, received, { ...expected, kind: ShapeBpmnElementKind.LANE });
}

function buildActivityMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  // TODO maxgraph@0.1.0 - review the markers management (sometimes it is undefined by default, sometimes it is an empty array)
  expected.markers ??= [];
  return buildShapeMatcher(matcherName, matcherContext, received, expected);
}

export function toBeCallActivity(this: MatcherContext, received: string, expected: ExpectedCallActivityModelElement): CustomMatcherResult {
  return buildActivityMatcher('toBeCallActivity', this, received, { ...expected, kind: ShapeBpmnElementKind.CALL_ACTIVITY });
}

export function toBeSubProcess(this: MatcherContext, received: string, expected: ExpectedSubProcessModelElement): CustomMatcherResult {
  if (expected.subProcessKind == ShapeBpmnSubProcessKind.AD_HOC) {
    expected.markers ??= [];
    expected.markers.push(ShapeBpmnMarkerKind.ADHOC);
  }
  return buildActivityMatcher('toBeSubProcess', this, received, { ...expected, kind: ShapeBpmnElementKind.SUB_PROCESS });
}

export function toBeTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildActivityMatcher('toBeTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK });
}

export function toBeServiceTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildActivityMatcher('toBeServiceTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_SERVICE });
}

export function toBeUserTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildActivityMatcher('toBeUserTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_USER });
}

export function toBeReceiveTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildActivityMatcher('toBeReceiveTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_RECEIVE });
}

export function toBeSendTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildActivityMatcher('toBeSendTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_SEND });
}

export function toBeManualTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildActivityMatcher('toBeManualTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_MANUAL });
}

export function toBeScriptTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildActivityMatcher('toBeScriptTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_SCRIPT });
}

export function toBeBusinessRuleTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildActivityMatcher('toBeBusinessRuleTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE });
}

function buildEventMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedStartEventModelElement): CustomMatcherResult {
  return buildShapeMatcher(matcherName, matcherContext, received, { ...expected, verticalAlign: expected.label ? 'top' : 'middle' });
}

export function toBeStartEvent(this: MatcherContext, received: string, expected: ExpectedStartEventModelElement): CustomMatcherResult {
  return buildEventMatcher('toBeStartEvent', this, received, { ...expected, kind: ShapeBpmnElementKind.EVENT_START });
}

export function toBeEndEvent(this: MatcherContext, received: string, expected: ExpectedEventModelElement): CustomMatcherResult {
  return buildEventMatcher('toBeEndEvent', this, received, { ...expected, kind: ShapeBpmnElementKind.EVENT_END });
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

function buildGatewayMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedEventBasedGatewayModelElement): CustomMatcherResult {
  return buildShapeMatcher(matcherName, matcherContext, received, { ...expected, verticalAlign: expected.label ? 'top' : 'middle' });
}

export function toBeEventBasedGateway(this: MatcherContext, received: string, expected: ExpectedEventBasedGatewayModelElement): CustomMatcherResult {
  expected.gatewayKind ??= ShapeBpmnEventBasedGatewayKind.None;
  return buildGatewayMatcher('toBeEventBasedGateway', this, received, { ...expected, kind: ShapeBpmnElementKind.GATEWAY_EVENT_BASED });
}

export function toBeExclusiveGateway(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildGatewayMatcher('toBeExclusiveGateway', this, received, { ...expected, kind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE });
}

export function toBeInclusiveGateway(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildGatewayMatcher('toBeInclusiveGateway', this, received, { ...expected, kind: ShapeBpmnElementKind.GATEWAY_INCLUSIVE });
}

export function toBeParallelGateway(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildGatewayMatcher('toBeParallelGateway', this, received, { ...expected, kind: ShapeBpmnElementKind.GATEWAY_PARALLEL });
}

export function toBeGroup(this: MatcherContext, received: string, expected: ExpectedSubProcessModelElement): CustomMatcherResult {
  return buildShapeMatcher('toBeGroup', this, received, { ...expected, kind: ShapeBpmnElementKind.GROUP });
}

export function toBeTextAnnotation(this: MatcherContext, received: string, expected: ExpectedSubProcessModelElement): CustomMatcherResult {
  return buildShapeMatcher('toBeTextAnnotation', this, received, { ...expected, kind: ShapeBpmnElementKind.TEXT_ANNOTATION });
}
