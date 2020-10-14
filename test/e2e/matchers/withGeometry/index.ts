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
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

export function withGeometry(this: MatcherContext, received: mxCell, expected: mxGeometry): CustomMatcherResult {
  const cellGeometry = received.getGeometry();
  const receivedGeometry = { x: cellGeometry.x, y: cellGeometry.y, width: cellGeometry.width, height: cellGeometry.height, points: cellGeometry.points };

  const pass =
    receivedGeometry.x === expected.x &&
    receivedGeometry.y === expected.y &&
    receivedGeometry.width === expected.width &&
    receivedGeometry.height === expected.height &&
    // Need to do this, because the most time, there is no 'points' variable in 'expected', but 'points' is equals to 'null' in 'receivedGeometry'
    JSON.stringify(receivedGeometry.points) === JSON.stringify(expected.points);

  return {
    message: pass
      ? () =>
          this.utils.matcherHint('.not.withGeometry') +
          '\n\n' +
          `Expected geometry of the cell with id '${received.id}' not to be equals to:\n` +
          `  ${this.utils.printExpected(expected)}\n` +
          `Received:\n` +
          `  ${this.utils.printReceived(receivedGeometry)}`
      : () => {
          const diffString = this.utils.diff(expected, receivedGeometry, {
            expand: this.expand,
          });
          return (
            this.utils.matcherHint('.withGeometry') +
            '\n\n' +
            `Expected geometry of the cell with id '${received.id}' to be equals to:\n` +
            `  ${this.utils.printExpected(expected)}\n` +
            `Received:\n` +
            `  ${this.utils.printReceived(receivedGeometry)}` +
            (diffString ? `\n\nDifference:\n\n${diffString}` : '')
          );
        },
    pass,
  };
}
