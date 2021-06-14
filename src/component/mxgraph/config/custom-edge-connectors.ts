/**
 * Copyright 2021 Bonitasoft S.A.
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
import { mxgraph } from '../initializer';
import { mxCellState, mxPoint } from 'mxgraph'; // for types

// original JS code taken from https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/view/mxEdgeStyle.js#L592
// adapted to TS
// fix

function log(msg: string): void {
  // eslint-disable-next-line no-console
  console.info(`[customSegmentConnector] ${msg}`);
}

/* eslint-disable @typescript-eslint/ban-ts-comment */

export function configureCustomEdgeConnector(): void {
  // @ts-ignore not the same signature in mxgraph@4.1.0
  mxgraph.mxGraphView.prototype.transformControlPoint = function (state: mxCellState, pt: mxPoint, ignoreScale: true): mxPoint {
    // eslint-disable-next-line no-console
    console.info('@@@called custom mxGraphView.prototype.transformControlPoint');
    if (state != null && pt != null) {
      const orig = state.origin;
      const scale = ignoreScale ? 1 : this.scale;

      return new mxgraph.mxPoint(scale * (pt.x + this.translate.x + orig.x), scale * (pt.y + this.translate.y + orig.y));
    }
    return null;
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore error in typed-mxgraph, should be static as mxStyleRegistry is a singleton
  mxgraph.mxStyleRegistry.putValue(mxgraph.mxConstants.EDGESTYLE_SEGMENT, customSegmentConnector);
}

function customSegmentConnector(state: mxCellState, sourceScaled: mxCellState, targetScaled: mxCellState, controlHints: mxPoint[], result: mxPoint[]): void {
  log('start');
  // Creates array of all way- and terminalpoints
  // START bpmn-visualization customization (functions not available in mxgraph@4.1.0)
  const pts: Array<mxPoint> = scalePointArray(state.absolutePoints, state.view.scale);
  const source: mxCellState = scaleCellState(sourceScaled, state.view.scale);
  const target: mxCellState = scaleCellState(targetScaled, state.view.scale);
  // END bpmn-visualization customization
  const tol = 1;

  // Whether the first segment outgoing from the source end is horizontal
  let lastPushed = result.length > 0 ? result[0] : null;
  let horizontal = true;
  let hint = null;

  // Adds waypoints only if outside of tolerance
  function pushPoint(pt: mxPoint): mxPoint {
    pt.x = Math.round(pt.x * state.view.scale * 10) / 10;
    pt.y = Math.round(pt.y * state.view.scale * 10) / 10;

    if (lastPushed == null || Math.abs(lastPushed.x - pt.x) >= tol || Math.abs(lastPushed.y - pt.y) >= Math.max(1, state.view.scale)) {
      result.push(pt);
      lastPushed = pt;
    }

    return lastPushed;
  }

  // Adds the first point
  let pt = pts[0];

  if (pt == null && source != null) {
    pt = new mxgraph.mxPoint(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source));
  } else if (pt != null) {
    pt = pt.clone();
  }

  const lastInx = pts.length - 1;
  // START bpmn-visualization customization
  const pe = pts[lastInx];
  // END bpmn-visualization customization

  // Adds the waypoints
  if (controlHints != null && controlHints.length > 0) {
    // Converts all hints and removes nulls
    let hints = [];

    for (let i = 0; i < controlHints.length; i++) {
      // @ts-ignore last parameter is missing in typed-mxgraph (introduced in mxgraph@4.1.1)
      const tmp = state.view.transformControlPoint(state, controlHints[i], true);

      if (tmp != null) {
        hints.push(tmp);
      }
    }

    if (hints.length == 0) {
      return;
    }

    // Aligns source and target hint to fixed points
    if (pt != null && hints[0] != null) {
      if (Math.abs(hints[0].x - pt.x) < tol) {
        hints[0].x = pt.x;
      }

      if (Math.abs(hints[0].y - pt.y) < tol) {
        hints[0].y = pt.y;
      }
    }

    // START bpmn-visualization customization
    // move out of the if, otherwise TS error
    // const pe = pts[lastInx];
    // END bpmn-visualization customization

    if (pe != null && hints[hints.length - 1] != null) {
      if (Math.abs(hints[hints.length - 1].x - pe.x) < tol) {
        hints[hints.length - 1].x = pe.x;
      }

      if (Math.abs(hints[hints.length - 1].y - pe.y) < tol) {
        hints[hints.length - 1].y = pe.y;
      }
    }

    hint = hints[0];

    let currentTerm = source;
    let currentPt = pts[0];
    let hozChan = false;
    let vertChan = false;
    let currentHint = hint;

    if (currentPt != null) {
      currentTerm = null;
    }

    // Check for alignment with fixed points and with channels
    // at source and target segments only
    for (let i = 0; i < 2; i++) {
      const fixedVertAlign = currentPt != null && currentPt.x == currentHint.x;
      const fixedHozAlign = currentPt != null && currentPt.y == currentHint.y;

      const inHozChan = currentTerm != null && currentHint.y >= currentTerm.y && currentHint.y <= currentTerm.y + currentTerm.height;
      const inVertChan = currentTerm != null && currentHint.x >= currentTerm.x && currentHint.x <= currentTerm.x + currentTerm.width;

      hozChan = fixedHozAlign || (currentPt == null && inHozChan);
      vertChan = fixedVertAlign || (currentPt == null && inVertChan);

      // If the current hint falls in both the hor and vert channels in the case
      // of a floating port, or if the hint is exactly co-incident with a
      // fixed point, ignore the source and try to work out the orientation
      // from the target end
      if (i == 0 && ((hozChan && vertChan) || (fixedVertAlign && fixedHozAlign))) {
      } else {
        if (currentPt != null && !fixedHozAlign && !fixedVertAlign && (inHozChan || inVertChan)) {
          horizontal = inHozChan ? false : true;
          break;
        }

        if (vertChan || hozChan) {
          horizontal = hozChan;

          if (i == 1) {
            // Work back from target end
            horizontal = hints.length % 2 == 0 ? hozChan : vertChan;
          }

          break;
        }
      }

      currentTerm = target;
      currentPt = pts[lastInx];

      if (currentPt != null) {
        currentTerm = null;
      }

      currentHint = hints[hints.length - 1];

      if (fixedVertAlign && fixedHozAlign) {
        hints = hints.slice(1);
      }
    }

    if (horizontal && ((pts[0] != null && pts[0].y != hint.y) || (pts[0] == null && source != null && (hint.y < source.y || hint.y > source.y + source.height)))) {
      pushPoint(new mxgraph.mxPoint(pt.x, hint.y));
    } else if (!horizontal && ((pts[0] != null && pts[0].x != hint.x) || (pts[0] == null && source != null && (hint.x < source.x || hint.x > source.x + source.width)))) {
      pushPoint(new mxgraph.mxPoint(hint.x, pt.y));
    }

    if (horizontal) {
      pt.y = hint.y;
    } else {
      pt.x = hint.x;
    }

    for (let i = 0; i < hints.length; i++) {
      horizontal = !horizontal;
      hint = hints[i];

      //				mxLog.show();
      //				mxLog.debug('hint', i, hint.x, hint.y);

      if (horizontal) {
        pt.y = hint.y;
      } else {
        pt.x = hint.x;
      }

      pushPoint(pt.clone());
    }
  } else {
    hint = pt;
    // FIXME: First click in connect preview toggles orientation
    horizontal = true;
  }

  // Adds the last point
  pt = pts[lastInx];

  if (pt == null && target != null) {
    pt = new mxgraph.mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target));
  }

  if (pt != null) {
    if (hint != null) {
      if (
        horizontal &&
        ((pts[lastInx] != null && pts[lastInx].y != hint.y) || (pts[lastInx] == null && target != null && (hint.y < target.y || hint.y > target.y + target.height)))
      ) {
        pushPoint(new mxgraph.mxPoint(pt.x, hint.y));
      } else if (
        !horizontal &&
        ((pts[lastInx] != null && pts[lastInx].x != hint.x) || (pts[lastInx] == null && target != null && (hint.x < target.x || hint.x > target.x + target.width)))
      ) {
        pushPoint(new mxgraph.mxPoint(hint.x, pt.y));
      }
    }
  }

  // Removes bends inside the source terminal for floating ports
  // START bpmn-visualization customization
  // Fix attempt: source --> sourceScaled
  if (pts[0] == null && sourceScaled != null) {
    while (result.length > 1 && result[1] != null && mxgraph.mxUtils.contains(sourceScaled, result[1].x, result[1].y)) {
      result.splice(1, 1);
    }
  }
  // END bpmn-visualization customization

  // Removes bends inside the target terminal
  // START bpmn-visualization customization
  // Fix attempt: target --> targetScaled
  if (pts[lastInx] == null && targetScaled != null) {
    while (result.length > 1 && result[result.length - 1] != null && mxgraph.mxUtils.contains(targetScaled, result[result.length - 1].x, result[result.length - 1].y)) {
      result.splice(result.length - 1, 1);
    }
  }
  // END bpmn-visualization customization

  // Removes last point if inside tolerance with end point
  if (pe != null && result[result.length - 1] != null && Math.abs(pe.x - result[result.length - 1].x) <= tol && Math.abs(pe.y - result[result.length - 1].y) <= tol) {
    result.splice(result.length - 1, 1);

    // Lines up second last point in result with end point
    if (result[result.length - 1] != null) {
      if (Math.abs(result[result.length - 1].x - pe.x) < tol) {
        result[result.length - 1].x = pe.x;
      }

      if (Math.abs(result[result.length - 1].y - pe.y) < tol) {
        result[result.length - 1].y = pe.y;
      }
    }
  }
}

/**
 * Function: scalePointArray
 *
 * Scales an array of <mxPoint>
 *
 * Parameters:
 *
 * points - array of <mxPoint> to scale
 * scale - the scaling to divide by
 *
 */
function scalePointArray(points: mxPoint[], scale: number): mxPoint[] {
  // We must have the implementation here as it has been introduced in mxgraph@4.1.1 and we are still using 4.1.0
  // It is also missing in typed-mxgraph@1.0.2 mxEdgeStyle
  let result: mxPoint[] = [];

  if (points != null) {
    for (let i = 0; i < points.length; i++) {
      if (points[i] != null) {
        result[i] = new mxgraph.mxPoint(Math.round((points[i].x / scale) * 10) / 10, Math.round((points[i].y / scale) * 10) / 10);
      } else {
        result[i] = null;
      }
    }
  } else {
    result = null;
  }

  return result;
}

/**
 * Function: scaleCellState
 *
 * Scales an <mxCellState>
 *
 * Parameters:
 *
 * state - <mxCellState> to scale
 * scale - the scaling to divide by
 *
 */
function scaleCellState(state: mxCellState, scale: number): mxCellState {
  // We must have the implementation here as it has been  introduced in mxgraph@4.1.1 and we are still using 4.1.0
  // It is also missing in typed-mxgraph@1.0.2 mxEdgeStyle
  let result: mxCellState = null;

  if (state != null) {
    result = state.clone();
    result.setRect(
      Math.round((state.x / scale) * 10) / 10,
      Math.round((state.y / scale) * 10) / 10,
      Math.round((state.width / scale) * 10) / 10,
      Math.round((state.height / scale) * 10) / 10,
    );
  } else {
    result = null;
  }

  return result;
}
