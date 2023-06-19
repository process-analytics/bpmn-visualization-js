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

import type { ShapeValue } from '@maxgraph/core';

import type { ExpectedCell, ExpectedStateStyle } from '../matcher-utils';
import { buildCellMatcher, buildCommonExpectedStateStyle, buildReceivedCellWithCommonAttributes } from '../matcher-utils';
import { AssociationDirectionKind, FlowKind, MessageVisibleKind, SequenceFlowKind } from '../../../../src/model/bpmn/internal';
import type { ExpectedAssociationFlowModelElement, ExpectedEdgeModelElement, ExpectedSequenceFlowModelElement } from '../../helpers/model-expect';
import { getDefaultParentId } from '../../helpers/model-expect';
import { BpmnStyleIdentifier } from '@lib/component/mxgraph/style';
import type { BPMNCellStyle } from '@lib/component/mxgraph/renderer/StyleComputer';
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

function buildExpectedMsgFlowIconCellStyle(expectedModel: ExpectedEdgeModelElement): BpmnCellStyle {
  const style = buildExpectedCellStyleWithCommonAttributes(expectedModel);
  style.align = 'center';
  style.verticalAlign = 'middle';
  style.shape = BpmnStyleIdentifier.MESSAGE_FLOW_ICON;
  style[BpmnStyleIdentifier.IS_INITIATING] = expectedModel.messageVisibleKind == MessageVisibleKind.INITIATING;
  return style;
}

function buildExpectedEdgeStylePropertyRegexp(expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement | ExpectedAssociationFlowModelElement): BPMNCellStyle {
  const style: BPMNCellStyle = { bpmn: {} };
  // TODO maxgraph@0.1.0 share with edge
  style.baseStyleNames = [expectedModel.kind];
  style.bpmn.kind = expectedModel.kind;
  if ('sequenceFlowKind' in expectedModel) {
    style.baseStyleNames.push((expectedModel as ExpectedSequenceFlowModelElement).sequenceFlowKind);
  }
  if ('associationDirectionKind' in expectedModel) {
    style.baseStyleNames.push((expectedModel as ExpectedAssociationFlowModelElement).associationDirectionKind);
  }

  return style;
}

function buildExpectedCell(id: string, expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement): ExpectedCell {
  // TODO maxgraph@0.1.0 refactor, duplication with buildExpectedCell in shape matchers
  const parentId = expectedModel.parentId;
  const expectedCell: ExpectedCell = {
    id,
    value: expectedModel.label ?? null, // maxGraph now set to 'null', mxGraph set to 'undefined'
    style: expect.objectContaining(buildExpectedStyle(expectedModel)),
    // TODO rebase make style work
    styleRawFromModelOrJestExpect: expect.stringMatching(buildExpectedEdgeStylePropertyRegexp(expectedModel)),
    styleResolvedFromModel: buildExpectedEdgeCellStyle(expectedModel),
    styleViewState: buildExpectedEdgeCellStyle(expectedModel),
    edge: true,
    vertex: false,
    parent: { id: parentId ? parentId : getDefaultParentId() }, // TODO maxgraph@0.1.0 use ?? instead (in master branch)
    state: {
      style: buildExpectedStateStyle(expectedModel),
    },
    overlays: expectedModel.overlays,
  };

  // expect to have a message flow icon
  if (expectedModel.messageVisibleKind && expectedModel.messageVisibleKind !== MessageVisibleKind.NONE) {
    expectedCell.children = [
      {
        id: `messageFlowIcon_of_${id}`,
        value: null, // maxGraph now set to 'null', mxGraph set to 'undefined'
        // TODO rebase make the style check work
        style: {
          // TODO maxgraph@0.1.0 remove forcing type when maxGraph fixes its types
          shape: <ShapeValue>BpmnStyleIdentifier.MESSAGE_FLOW_ICON,
          // TODO maxgraph@0.1.0 duplicated logic to compute the 'isNonInitiating' property. Update the expectedModel to store a boolean instead of a string
          bpmn: { isNonInitiating: expectedModel.messageVisibleKind === MessageVisibleKind.NON_INITIATING },
        },
        styleRawFromModelOrJestExpect: expect.stringMatching(
          `shape=${BpmnStyleIdentifier.MESSAGE_FLOW_ICON};${BpmnStyleIdentifier.IS_INITIATING}=${expectedModel.messageVisibleKind == MessageVisibleKind.INITIATING}`,
        ),
        styleResolvedFromModel: buildExpectedMsgFlowIconCellStyle(expectedModel),
        styleViewState: buildExpectedMsgFlowIconCellStyle(expectedModel),
        edge: false,
        vertex: true,
        parent: { id: expectedCell.id },
      },
    ];
  }

  return expectedCell;
}

function buildEdgeMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildCellMatcher(matcherName, matcherContext, received, expected, 'Edge', buildExpectedCell, buildReceivedCellWithCommonAttributes);
}

export function toBeSequenceFlow(this: MatcherContext, received: string, expected: ExpectedSequenceFlowModelElement): CustomMatcherResult {
  // TODO maxgraph@0.1.0 migration - why is it needed? move to the master branch?
  expected.sequenceFlowKind ??= SequenceFlowKind.NORMAL;
  return buildEdgeMatcher('toBeSequenceFlow', this, received, { ...expected, kind: FlowKind.SEQUENCE_FLOW, endArrow: 'blockThin' });
}

export function toBeMessageFlow(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  // TODO maxgraph@0.1.0 migration - constant or type?
  return buildEdgeMatcher('toBeMessageFlow', this, received, { ...expected, kind: FlowKind.MESSAGE_FLOW, startArrow: 'oval', endArrow: 'blockThin' });
}

export function toBeAssociationFlow(this: MatcherContext, received: string, expected: ExpectedAssociationFlowModelElement): CustomMatcherResult {
  // TODO maxgraph@0.1.0 migration - why is it needed? move to the master branch?
  expected.associationDirectionKind ??= AssociationDirectionKind.NONE;
  return buildEdgeMatcher('toBeAssociationFlow', this, received, { ...expected, kind: FlowKind.ASSOCIATION_FLOW });
}
