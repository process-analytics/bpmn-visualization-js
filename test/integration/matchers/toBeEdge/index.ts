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
import { AssociationDirectionKind, FlowKind, MessageVisibleKind, SequenceFlowKind } from '../../../../src/model/bpmn/internal';
import type { ExpectedAssociationFlowModelElement, ExpectedEdgeModelElement, ExpectedSequenceFlowModelElement } from '../../helpers/model-expect';
import { getDefaultParentId } from '../../helpers/model-expect';
import { BpmnShapeIdentifier } from '../../../../src/component/mxgraph/style';
import type { BPMNCellStyle } from '../../../../src/component/mxgraph/renderer/StyleComputer';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

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

function buildExpectedStyle(expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement | ExpectedAssociationFlowModelElement): BPMNCellStyle {
  const style: BPMNCellStyle = { bpmn: {} };
  // TODO share with edge
  // let expectedStyle: string = expectedModel.kind;
  style.baseStyleNames = [expectedModel.kind];
  style.bpmn.kind = expectedModel.kind;

  // let expectedStyle: string = expectedModel.kind;
  if ('sequenceFlowKind' in expectedModel) {
    // expectedStyle = expectedStyle + `;${(expectedModel as ExpectedSequenceFlowModelElement).sequenceFlowKind}`;
    style.baseStyleNames.push((expectedModel as ExpectedSequenceFlowModelElement).sequenceFlowKind);
  }
  if ('associationDirectionKind' in expectedModel) {
    style.baseStyleNames.push((expectedModel as ExpectedAssociationFlowModelElement).associationDirectionKind);
  }

  // return expectedStyle + '.*';
  return style;
}

function buildExpectedCell(id: string, expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement): ExpectedCell {
  // TODO refactor, duplication with buildExpectedCell in shape matchers
  const parentId = expectedModel.parentId;
  const expectedCell: ExpectedCell = {
    id,
    value: expectedModel.label ?? null, // maxGraph now set to 'null', mxGraph set to 'undefined'
    style: expect.objectContaining(buildExpectedStyle(expectedModel)),
    edge: true,
    vertex: false,
    parent: { id: parentId ? parentId : getDefaultParentId() }, // TODO use ?? instead (in master branch)
    state: {
      style: buildExpectedStateStyle(expectedModel),
    },
    overlays: expectedModel.overlays,
  };

  if (expectedModel.messageVisibleKind && expectedModel.messageVisibleKind !== MessageVisibleKind.NONE) {
    expectedCell.children = [
      {
        value: null, // maxGraph now set to 'null', mxGraph set to 'undefined'
        style: {
          // TODO remove forcing type when maxGraph fixes its types
          shape: <ShapeValue>BpmnShapeIdentifier.MESSAGE_FLOW_ICON,
          // TODO duplicated logic to compute the 'isNonInitiating' property. Update the expectedModel to store a boolean instead of a string
          bpmn: { isNonInitiating: expectedModel.messageVisibleKind === MessageVisibleKind.NON_INITIATING },
        },
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
  expected.sequenceFlowKind ??= SequenceFlowKind.NORMAL;
  return buildEdgeMatcher('toBeSequenceFlow', this, received, { ...expected, kind: FlowKind.SEQUENCE_FLOW, endArrow: 'blockThin' });
}

export function toBeMessageFlow(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeMessageFlow', this, received, { ...expected, kind: FlowKind.MESSAGE_FLOW, startArrow: 'oval', endArrow: 'blockThin' });
}

export function toBeAssociationFlow(this: MatcherContext, received: string, expected: ExpectedAssociationFlowModelElement): CustomMatcherResult {
  expected.associationDirectionKind ??= AssociationDirectionKind.NONE;
  return buildEdgeMatcher('toBeAssociationFlow', this, received, { ...expected, kind: FlowKind.ASSOCIATION_FLOW });
}
