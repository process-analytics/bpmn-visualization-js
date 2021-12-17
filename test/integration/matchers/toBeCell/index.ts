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
import { buildCellMatcher, ExpectedCell, getCell } from '../matcher-utils';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;
import { ExpectedCellWithGeometry, getDefaultParentId } from '../../helpers/model-expect';
import type { mxCell } from 'mxgraph';

export function toBeCell(this: MatcherContext, received: string): CustomMatcherResult {
  const pass = getCell(received) ? true : false;
  return {
    message: () => this.utils.matcherHint(`.${pass ? 'not.' : ''}toBeCell`) + '\n\n' + `Expected cell with id '${received}' ${pass ? 'not ' : ''}to be found in the mxGraph model`,
    pass,
  };
}

function buildReceivedCell(cell: mxCell): ExpectedCell {
  return {
    id: cell.id,
    parent: { id: cell.parent.id },
    geometry: cell.geometry,
  };
}

function buildExpectedCell(id: string, expected: ExpectedCellWithGeometry): ExpectedCell {
  const parentId = expected.parentId;
  const geometry = expected.geometry;
  const expectedObject = {
    x: geometry.x,
    y: geometry.y,
    width: geometry.width,
    height: geometry.height,
    points: geometry.points,
    offset: geometry.offset,
  };
  if (!expectedObject.offset) {
    delete expectedObject.offset;
  }

  return {
    id,
    parent: { id: parentId ? parentId : getDefaultParentId() },
    geometry: expect.objectContaining(expectedObject),
  };
}

export function toBeCellWithParentAndGeometry(this: MatcherContext, received: string, expected: ExpectedCellWithGeometry): CustomMatcherResult {
  return buildCellMatcher('toBeCellWithParentAndGeometry', this, received, expected, 'Cell', buildExpectedCell, buildReceivedCell);
}
