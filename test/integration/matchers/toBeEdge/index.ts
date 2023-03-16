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

import type { BpmnCellStyle, ExpectedCell } from '../matcher-utils';
import { buildCellMatcher, buildExpectedCellStyleWithCommonAttributes, buildReceivedCellWithCommonAttributes } from '../matcher-utils';
import { FlowKind, MessageVisibleKind } from '../../../../src/model/bpmn/internal';
import type { ExpectedEdgeModelElement, ExpectedSequenceFlowModelElement } from '../../helpers/model-expect';
import { getDefaultParentId } from '../../helpers/model-expect';
import { BpmnStyleIdentifier } from '../../../../src/component/mxgraph/style';
import { mxgraph } from '../../../../src/component/mxgraph/initializer';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

function buildExpectedEdgeCellStyle(expectedModel: ExpectedEdgeModelElement): BpmnCellStyle {
  const style = buildExpectedCellStyleWithCommonAttributes(expectedModel);
  style.verticalAlign = expectedModel.verticalAlign ?? 'top';
  style.align = 'center';
  style.strokeWidth = style.strokeWidth ?? 1.5;
  style.startArrow = expectedModel.startArrow;
  style.endArrow = expectedModel.endArrow;
  style.endSize = 12;
  return style;
}

function buildExpectedEdgeStylePropertyRegexp(expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement): string {
  let expectedStyle: string = expectedModel.kind;
  if ('sequenceFlowKind' in expectedModel) {
    expectedStyle = expectedStyle + `;${(expectedModel as ExpectedSequenceFlowModelElement).sequenceFlowKind}`;
  }
  return expectedStyle + '.*';
}

function buildExpectedCell(id: string, expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement): ExpectedCell {
  const parentId = expectedModel.parentId;
  const expectedCell: ExpectedCell = {
    id,
    value: expectedModel.label,
    styleRawFromModelOrJestExpect: expect.stringMatching(buildExpectedEdgeStylePropertyRegexp(expectedModel)),
    styleResolvedFromModel: buildExpectedEdgeCellStyle(expectedModel),
    styleViewState: buildExpectedEdgeCellStyle(expectedModel),
    edge: true,
    vertex: false,
    parent: { id: parentId ? parentId : getDefaultParentId() },
    overlays: expectedModel.overlays,
  };

  // expect to have a message flow icon
  if (expectedModel.messageVisibleKind && expectedModel.messageVisibleKind !== MessageVisibleKind.NONE) {
    expectedCell.children = [
      {
        value: undefined,
        styleRawFromModelOrJestExpect: `shape=${BpmnStyleIdentifier.MESSAGE_FLOW_ICON};${BpmnStyleIdentifier.IS_INITIATING}=${
          expectedModel.messageVisibleKind == MessageVisibleKind.INITIATING
        }`,
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
