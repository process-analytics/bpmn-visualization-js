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
import { ExpectedShapeModelElement, getDefaultParentId } from '../../ExpectModelUtils';

function buildExpectedStateStyle(expectedModel: ExpectedShapeModelElement): ExpectedStateStyle {
  const font = expectedModel.font;

  const styleShape = !expectedModel.styleShape ? expectedModel.kind : expectedModel.styleShape;

  return {
    shape: styleShape,
    verticalAlign: expectedModel.verticalAlign ? expectedModel.verticalAlign : 'middle',
    align: expectedModel.align ? expectedModel.align : 'center',
    strokeWidth: undefined,
    strokeColor: 'Black',
    fillColor: 'White',
    rounded: undefined,
    fontFamily: font?.name ? font.name : 'Arial, Helvetica, sans-serif',
    fontSize: font?.size ? font.size : 11,
    fontColor: 'Black',
    fontStyle: getFontStyleValue(font),
  };
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

function buildShapeMatcher(matcherName: string, matcherContext: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
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
        utils.printDiffOrStringify(expectedCell, undefined, `${EXPECTED_LABEL}: Shape with id '${expectedCell.id}'`, `${RECEIVED_LABEL}`, expand),
      pass: false,
    };
  }

  const receivedCell = buildReceivedCell(cell);
  const pass = matcherContext.equals(receivedCell, expectedCell, [utils.iterableEquality, utils.subsetEquality]);
  const message = pass
    ? () =>
        utils.matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        `${EXPECTED_LABEL}: Shape with id '${received}' not to be found with the configuration:\n` +
        `${utils.printExpected(expectedCell)}`
    : () =>
        utils.matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        utils.printDiffOrStringify(expectedCell, receivedCell, `${EXPECTED_LABEL}: Shape with id '${expectedCell.id}'`, `${RECEIVED_LABEL}: Shape with id '${received}'`, expand);
  return {
    message,
    pass,
  };
}

export function toBeShape(this: MatcherContext, received: string, expected: ExpectedShapeModelElement): CustomMatcherResult {
  return buildShapeMatcher('toBeShape', this, received, expected);
}
