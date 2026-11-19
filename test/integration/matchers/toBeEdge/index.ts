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

import type { ExpectedEdgeModelElement, ExpectedSequenceFlowModelElement } from '../../helpers/model-expect';
import type { ComparedBpmnCellStyle, ExpectedCell } from '../matcher-utils';
import type { BpmnCellStyle } from '@lib/component/mxgraph/style/types';

import { getDefaultParentId } from '../../helpers/model-expect';
import { buildCellMatcher, buildExpectedCellStyleWithCommonAttributes, buildReceivedCellWithCommonAttributes } from '../matcher-utils';

import { BpmnStyleIdentifier } from '@lib/component/mxgraph/style';
import { AssociationDirectionKind, FlowKind, MessageVisibleKind, SequenceFlowKind } from '@lib/model/bpmn/internal';

import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

export function buildExpectedEdgeCellStyle(expectedModel: ExpectedEdgeModelElement): ComparedBpmnCellStyle {
  const style = buildExpectedCellStyleWithCommonAttributes(expectedModel);
  style.verticalAlign = expectedModel.verticalAlign ?? 'top';
  style.align = 'center';
  style.strokeWidth = style.strokeWidth ?? 1.5;
  style.startArrow = expectedModel.startArrow;
  style.endArrow = expectedModel.endArrow;
  style.endSize = 12;
  return style;
}

function buildExpectedMessageFlowIconCellStyle(expectedModel: ExpectedEdgeModelElement): ComparedBpmnCellStyle {
  const style = buildExpectedCellStyleWithCommonAttributes(expectedModel);
  style.align = 'center';
  style.verticalAlign = 'middle';
  style.shape = BpmnStyleIdentifier.MESSAGE_FLOW_ICON;
  style.isInitiating = expectedModel.messageVisibleKind == MessageVisibleKind.INITIATING;
  return style;
}

function buildExpectedEdgeStyle(expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement): BpmnCellStyle {
  const bpmn: Record<string, unknown> = { kind: expectedModel.kind };
  // Only assert the bpmn properties set here: the cell may carry additional ones.
  const style: BpmnCellStyle = { bpmn: expect.objectContaining(bpmn) };
  const baseStyleNames: string[] = [expectedModel.kind];
  if (expectedModel.kind === FlowKind.SEQUENCE_FLOW) {
    baseStyleNames.push((expectedModel as ExpectedSequenceFlowModelElement).sequenceFlowKind ?? SequenceFlowKind.NORMAL);
  }
  if (expectedModel.kind === FlowKind.ASSOCIATION_FLOW) {
    baseStyleNames.push(
      (expectedModel as ExpectedEdgeModelElement & { associationDirectionKind?: AssociationDirectionKind }).associationDirectionKind ?? AssociationDirectionKind.NONE,
    );
  }
  style.baseStyleNames = baseStyleNames;
  // Production deletes 'extraCssClasses' from the bpmn style when there are none, so only assert it when classes are expected.
  if (expectedModel.extraCssClasses?.length > 0) {
    bpmn.extraCssClasses = expectedModel.extraCssClasses;
  }
  return style;
}

function buildExpectedCell(id: string, expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement): ExpectedCell {
  const parentId = expectedModel.parentId;
  const expectedCell: ExpectedCell = {
    id,
    value: expectedModel.label ?? null, // maxGraph sets the value to 'null' when there is no label (mxGraph used 'undefined')
    styleRawFromModelOrJestExpect: expect.objectContaining(buildExpectedEdgeStyle(expectedModel)),
    styleResolvedFromModel: buildExpectedEdgeCellStyle(expectedModel),
    styleViewState: buildExpectedEdgeCellStyle(expectedModel),
    edge: true,
    vertex: false,
    parent: { id: parentId ?? getDefaultParentId() },
    overlays: expectedModel.overlays,
  };

  // expect to have a message flow icon
  if (expectedModel.messageVisibleKind && expectedModel.messageVisibleKind !== MessageVisibleKind.NONE) {
    expectedCell.children = [
      {
        id: `messageFlowIcon_of_${id}`,
        value: null,
        styleRawFromModelOrJestExpect: expect.objectContaining({
          shape: BpmnStyleIdentifier.MESSAGE_FLOW_ICON,
          bpmn: { isInitiating: expectedModel.messageVisibleKind == MessageVisibleKind.INITIATING },
        } as BpmnCellStyle),
        styleResolvedFromModel: buildExpectedMessageFlowIconCellStyle(expectedModel),
        styleViewState: buildExpectedMessageFlowIconCellStyle(expectedModel),
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
  return buildEdgeMatcher('toBeSequenceFlow', this, received, { ...expected, kind: FlowKind.SEQUENCE_FLOW, endArrow: 'blockThin' });
}

export function toBeMessageFlow(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeMessageFlow', this, received, { ...expected, kind: FlowKind.MESSAGE_FLOW, startArrow: 'oval', endArrow: 'blockThin' });
}

export function toBeAssociationFlow(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeAssociationFlow', this, received, { ...expected, kind: FlowKind.ASSOCIATION_FLOW });
}
