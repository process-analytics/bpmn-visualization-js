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
import { buildReceivedCell, getCell, EXPECTED_LABEL, RECEIVED_LABEL, ExpectedStateStyle, getFontStyleValue, ExpectedCell } from '../matcherUtils';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;
import { FlowKind } from '../../../../src/model/bpmn/internal/edge/FlowKind';
import { ExpectedEdgeModelElement, ExpectedSequenceFlowModelElement, getDefaultParentId } from '../../ExpectModelUtils';
import { MessageVisibleKind } from '../../../../src/model/bpmn/internal/edge/MessageVisibleKind';
import { StyleIdentifier } from '../../../../src/component/mxgraph/StyleUtils';

function buildExpectedStateStyle(expectedModel: ExpectedEdgeModelElement): ExpectedStateStyle {
  const font = expectedModel.font;
  return {
    verticalAlign: 'top',
    align: 'center',
    strokeWidth: 1.5,
    strokeColor: 'Black',
    fillColor: 'White',
    rounded: 1,
    fontFamily: font?.name ? font.name : 'Arial, Helvetica, sans-serif',
    fontSize: font?.size ? font.size : 11,
    fontColor: 'Black',
    fontStyle: getFontStyleValue(font),
    startArrow: expectedModel.startArrow,
    endArrow: expectedModel.endArrow,
    endSize: 12,
  };
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
  const options = {
    isNot: matcherContext.isNot,
    promise: matcherContext.promise,
  };
  const utils = matcherContext.utils;
  const expand = matcherContext.expand;

  const expectedCell = buildExpectedCell(received, expected);

  const cell = getCell(received);
  if (!cell) {
    return {
      message: () =>
        utils.matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        utils.printDiffOrStringify(expectedCell, undefined, `${EXPECTED_LABEL}: Edge with id '${expectedCell.id}'`, `${RECEIVED_LABEL}`, expand),
      pass: false,
    };
  }

  const receivedCell = buildReceivedCell(cell);
  const pass = matcherContext.equals(receivedCell, expectedCell, [utils.iterableEquality, utils.subsetEquality]);
  const message = pass
    ? () =>
        utils.matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        `${EXPECTED_LABEL}: Edge with id '${received}' not to be found with the configuration:\n` +
        `${utils.printExpected(expectedCell)}`
    : () =>
        utils.matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        utils.printDiffOrStringify(expectedCell, receivedCell, `${EXPECTED_LABEL}: Edge with id '${expectedCell.id}'`, `${RECEIVED_LABEL}: Edge with id '${received}'`, expand);
  return {
    message,
    pass,
  };
}

export function toBeSequenceFlow(this: MatcherContext, received: string, expected: ExpectedSequenceFlowModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeSequenceFlow', this, received, { ...expected, kind: FlowKind.SEQUENCE_FLOW, endArrow: 'blockThin' });
}

export function toBeMessageFlow(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeMessageFlow', this, received, { ...expected, kind: FlowKind.MESSAGE_FLOW, startArrow: mxConstants.ARROW_OVAL, endArrow: 'blockThin' });
}

export function toBeAssociationFlow(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeAssociationFlow', this, received, { ...expected, kind: FlowKind.ASSOCIATION_FLOW });
}
