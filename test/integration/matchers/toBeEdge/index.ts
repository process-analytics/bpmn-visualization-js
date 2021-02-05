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
import { ExpectedStateStyle, ExpectedCell, buildCommonExpectedStateStyle, buildCellMatcher, buildReceivedCellWithCommonAttributes } from '../matcher-utils';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;
import { FlowKind } from '../../../../src/model/bpmn/internal/edge/FlowKind';
import { ExpectedEdgeModelElement, ExpectedSequenceFlowModelElement, getDefaultParentId } from '../../helpers/model-expect';
import { MessageVisibleKind } from '../../../../src/model/bpmn/internal/edge/MessageVisibleKind';
import { StyleIdentifier } from '../../../../src/component/g6/StyleUtils';

function buildExpectedStateStyle(expectedModel: ExpectedEdgeModelElement): ExpectedStateStyle {
  const expectedStateStyle = buildCommonExpectedStateStyle(expectedModel);
  expectedStateStyle.verticalAlign = expectedModel.verticalAlign ? expectedModel.verticalAlign : 'top';
  expectedStateStyle.align = 'center';
  expectedStateStyle.strokeWidth = 1.5;
  expectedStateStyle.startArrow = expectedModel.startArrow;
  expectedStateStyle.endArrow = expectedModel.endArrow;
  expectedStateStyle.endSize = 12;

  return expectedStateStyle;
}

function buildExpectedStyle(expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement): string {
  let expectedStyle: string = expectedModel.kind;
  if ('sequenceFlowKind' in expectedModel) {
    expectedStyle = expectedStyle + `;${(expectedModel as ExpectedSequenceFlowModelElement).sequenceFlowKind}`;
  }
  return expectedStyle + '.*';
}

function buildExpectedCell(id: string, expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement): ExpectedCell {
  const parentId = expectedModel.parentId;
  const styleRegexp = buildExpectedStyle(expectedModel);
  const expectedCell: ExpectedCell = {
    id,
    value: expectedModel.label,
    style: expect.stringMatching(styleRegexp),
    edge: true,
    vertex: false,
    parent: { id: parentId ? parentId : getDefaultParentId() },
    state: {
      style: buildExpectedStateStyle(expectedModel),
    },
    overlays: expectedModel.overlays,
  };

  if (expectedModel.messageVisibleKind && expectedModel.messageVisibleKind !== MessageVisibleKind.NONE) {
    expectedCell.children = [
      {
        value: undefined,
        style: `shape=${StyleIdentifier.BPMN_STYLE_MESSAGE_FLOW_ICON};${StyleIdentifier.BPMN_STYLE_IS_INITIATING}=${expectedModel.messageVisibleKind}`,
        id: `messageFlowIcon_of_${id}`,
        vertex: true,
      },
    ];
  }

  return expectedCell;
}

function buildEdgeMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildCellMatcher(matcherName, matcherContext, received, expected, 'Edge', buildExpectedCell, buildReceivedCellWithCommonAttributes);
}

export function toBeSequenceFlow(this: MatcherContext, received: string, expected: ExpectedSequenceFlowModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeSequenceFlow', this, received, { ...expected, kind: FlowKind.SEQUENCE_FLOW, endArrow: 'blockThin' });
}

export function toBeMessageFlow(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeMessageFlow', this, received, { ...expected, kind: FlowKind.MESSAGE_FLOW, startArrow: mxgraph.mxConstants.ARROW_OVAL, endArrow: 'blockThin' });
}

export function toBeAssociationFlow(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeAssociationFlow', this, received, { ...expected, kind: FlowKind.ASSOCIATION_FLOW });
}
