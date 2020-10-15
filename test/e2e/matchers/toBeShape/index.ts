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
import { ExpectedStateStyle, ExpectedCell, buildCommonExpectedStateStyle, buildCellMatcher, buildReceivedCellWithCommonAttributes } from '../matcherUtils';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;
import { ExpectedShapeModelElement, getDefaultParentId } from '../../ExpectModelUtils';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/internal/shape';

function buildExpectedStateStyle(expectedModel: ExpectedShapeModelElement): ExpectedStateStyle {
  const expectedStateStyle = buildCommonExpectedStateStyle(expectedModel);
  expectedStateStyle.shape = !expectedModel.styleShape ? expectedModel.kind : expectedModel.styleShape;
  expectedStateStyle.verticalAlign = expectedModel.verticalAlign ? expectedModel.verticalAlign : 'middle';
  expectedStateStyle.align = expectedModel.align ? expectedModel.align : 'center';
  expectedStateStyle.strokeWidth = undefined;

  return expectedStateStyle;
}

function buildExpectedStyle(expectedModel: ExpectedShapeModelElement): string {
  let expectedStyle: string = expectedModel.kind;
  if (expectedModel.isInstantiating !== undefined) {
    expectedStyle = expectedStyle + `.*bpmn.isInstantiating=${expectedModel.isInstantiating}`;
  }
  if (expectedModel.markers?.length > 0) {
    expectedStyle = expectedStyle + `.*bpmn.markers=${expectedModel.markers.join(',')}`;
  }
  return expectedStyle + '.*';
}

function buildExpectedCell(id: string, expectedModel: ExpectedShapeModelElement): ExpectedCell {
  const parentId = expectedModel.parentId;
  const styleRegexp = buildExpectedStyle(expectedModel);

  return {
    id,
    value: expectedModel.label,
    style: expect.stringMatching(styleRegexp),
    edge: false,
    vertex: true,
    parent: { id: parentId ? parentId : getDefaultParentId() },
    state: {
      style: buildExpectedStateStyle(expectedModel),
    },
  };
}

export function toBeShape(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildCellMatcher('toBeShape', this, received, expected, 'Shape', buildExpectedCell, buildReceivedCellWithCommonAttributes);
}

export function toBeCallActivity(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildCellMatcher(
    'toBeCallActivity',
    this,
    received,
    { ...expected, kind: ShapeBpmnElementKind.CALL_ACTIVITY },
    'Shape',
    buildExpectedCell,
    buildReceivedCellWithCommonAttributes,
  );
}

export function toBeTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildCellMatcher('toBeTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK }, 'Shape', buildExpectedCell, buildReceivedCellWithCommonAttributes);
}

export function toBeServiceTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildCellMatcher(
    'toBeServiceTask',
    this,
    received,
    { ...expected, kind: ShapeBpmnElementKind.TASK_SERVICE },
    'Shape',
    buildExpectedCell,
    buildReceivedCellWithCommonAttributes,
  );
}

export function toBeUserTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildCellMatcher('toBeUserTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_USER }, 'Shape', buildExpectedCell, buildReceivedCellWithCommonAttributes);
}

export function toBeReceiveTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildCellMatcher(
    'toBeReceiveTask',
    this,
    received,
    { ...expected, kind: ShapeBpmnElementKind.TASK_RECEIVE },
    'Shape',
    buildExpectedCell,
    buildReceivedCellWithCommonAttributes,
  );
}

export function toBeSendTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildCellMatcher('toBeSendTask', this, received, { ...expected, kind: ShapeBpmnElementKind.TASK_SEND }, 'Shape', buildExpectedCell, buildReceivedCellWithCommonAttributes);
}

export function toBeManualTask(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildCellMatcher(
    'toBeManualTask',
    this,
    received,
    { ...expected, kind: ShapeBpmnElementKind.TASK_MANUAL },
    'Shape',
    buildExpectedCell,
    buildReceivedCellWithCommonAttributes,
  );
}
