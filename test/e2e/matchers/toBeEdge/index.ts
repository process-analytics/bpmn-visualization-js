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
import { buildExpectedCell, buildReceivedCell, getCell, EXPECTED_LABEL, RECEIVED_LABEL } from '../matcherUtils';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;
import { FlowKind } from '../../../../src/model/bpmn/internal/edge/FlowKind';
import { ExpectedEdgeModelElement, ExpectedSequenceFlowModelElement } from '../../ExpectModelUtils';

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

export function toBeEdge(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeEdge', this, received, expected);
}

export function toBeSequenceFlow(this: MatcherContext, received: string, expected: ExpectedSequenceFlowModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeSequenceFlow', this, received, { ...expected, kind: FlowKind.SEQUENCE_FLOW, endArrow: 'blockThin' });
}

export function toBeMessageFlow(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  return buildEdgeMatcher('toBeMessageFlow', this, received, { ...expected, kind: FlowKind.MESSAGE_FLOW, startArrow: mxConstants.ARROW_OVAL, endArrow: 'blockThin' });
}
