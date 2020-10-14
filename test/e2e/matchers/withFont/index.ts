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
import { StyleDefault } from '../../../../src/component/mxgraph/StyleUtils';
import { bpmnVisualization, ExpectedFont } from '../../ExpectModelUtils';
import MatcherContext = jest.MatcherContext;
import { getFontStyleValue } from '../matcherUtils';
import CustomMatcherResult = jest.CustomMatcherResult;

export function withFont(this: MatcherContext, received: mxCell, expected: ExpectedFont): CustomMatcherResult {
  const style = bpmnVisualization.graph.getView().getState(received).style;
  const receivedFont = { fontStyle: style[mxConstants.STYLE_FONTSTYLE], fontFamily: style[mxConstants.STYLE_FONTFAMILY], fontSize: style[mxConstants.STYLE_FONTSIZE] };

  let expectedFont: unknown;
  if (expected) {
    expectedFont = { fontStyle: getFontStyleValue(expected), fontFamily: expected.name, fontSize: expected.size };
  } else {
    expectedFont = { fontStyle: undefined, fontFamily: StyleDefault.DEFAULT_FONT_FAMILY, fontSize: StyleDefault.DEFAULT_FONT_SIZE };
  }

  const pass = JSON.stringify(receivedFont) === JSON.stringify(expectedFont);
  return {
    message: pass
      ? () =>
          this.utils.matcherHint('.not.withFont') +
          '\n\n' +
          `Expected font of the cell with id '${received.id}' not to be equals to:\n` +
          `  ${this.utils.printExpected(expectedFont)}\n` +
          `Received:\n` +
          `  ${this.utils.printReceived(receivedFont)}`
      : () => {
          const diffString = this.utils.diff(expectedFont, receivedFont, {
            expand: this.expand,
          });
          return (
            this.utils.matcherHint('.withFont') +
            '\n\n' +
            `Expected font of the cell with id '${received.id}' to be equals to:\n` +
            `  ${this.utils.printExpected(expectedFont)}\n` +
            `Received:\n` +
            `  ${this.utils.printReceived(receivedFont)}` +
            (diffString ? `\n\nDifference:\n\n${diffString}` : '')
          );
        },
    pass,
  };
}
