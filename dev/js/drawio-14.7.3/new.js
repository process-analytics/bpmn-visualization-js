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

function SegmentConnector(state, sourceScaled, targetScaled, controlHints, result) {
  var pts = mxEdgeStyle.scalePointArray(state.absolutePoints, state.view.scale);
  sourceScaled = mxEdgeStyle.scaleCellState(sourceScaled, state.view.scale);
  var target = mxEdgeStyle.scaleCellState(targetScaled, state.view.scale);
  targetScaled = [];
  var k = 0 < result.length ? result[0] : null,
    l = !0,
    m = pts[0];
  null == m && null != sourceScaled ? (m = new mxPoint(state.view.getRoutingCenterX(sourceScaled), state.view.getRoutingCenterY(sourceScaled))) : null != m && (m = m.clone());
  var n = pts.length - 1;
  if (null != controlHints && 0 < controlHints.length) {
    for (var p = [], q = 0; q < controlHints.length; q++) {
      var r = state.view.transformControlPoint(state, controlHints[q], !0);
      null != r && p.push(r);
    }
    if (0 == p.length) return;
    null != m && null != p[0] && (1 > Math.abs(p[0].x - m.x) && (p[0].x = m.x), 1 > Math.abs(p[0].y - m.y) && (p[0].y = m.y));
    r = pts[n];
    null != r &&
      null != p[p.length - 1] &&
      (1 > Math.abs(p[p.length - 1].x - r.x) && (p[p.length - 1].x = r.x), 1 > Math.abs(p[p.length - 1].y - r.y) && (p[p.length - 1].y = r.y));
    controlHints = p[0];
    var t = sourceScaled,
      u = pts[0],
      x;
    x = controlHints;
    null != u && (t = null);
    for (q = 0; 2 > q; q++) {
      var y = null != u && u.x == x.x,
        B = null != u && u.y == x.y,
        A = null != t && x.y >= t.y && x.y <= t.y + t.height,
        z = null != t && x.x >= t.x && x.x <= t.x + t.width,
        t = B || (null == u && A);
      x = y || (null == u && z);
      if (0 != q || !((t && x) || (y && B))) {
        if (null != u && !B && !y && (A || z)) {
          l = A ? !1 : !0;
          break;
        }
        if (x || t) {
          l = t;
          1 == q && (l = 0 == p.length % 2 ? t : x);
          break;
        }
      }
      t = target;
      u = pts[n];
      null != u && (t = null);
      x = p[p.length - 1];
      y && B && (p = p.slice(1));
    }
    l &&
    ((null != pts[0] && pts[0].y != controlHints.y) ||
      (null == pts[0] && null != sourceScaled && (controlHints.y < sourceScaled.y || controlHints.y > sourceScaled.y + sourceScaled.height)))
      ? targetScaled.push(new mxPoint(m.x, controlHints.y))
      : !l &&
        ((null != pts[0] && pts[0].x != controlHints.x) ||
          (null == pts[0] && null != sourceScaled && (controlHints.x < sourceScaled.x || controlHints.x > sourceScaled.x + sourceScaled.width))) &&
        targetScaled.push(new mxPoint(controlHints.x, m.y));
    l ? (m.y = controlHints.y) : (m.x = controlHints.x);
    for (q = 0; q < p.length; q++) (l = !l), (controlHints = p[q]), l ? (m.y = controlHints.y) : (m.x = controlHints.x), targetScaled.push(m.clone());
  } else (controlHints = m), (l = !0);
  m = pts[n];
  null == m && null != target && (m = new mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target)));
  null != m &&
    null != controlHints &&
    (l && ((null != pts[n] && pts[n].y != controlHints.y) || (null == pts[n] && null != target && (controlHints.y < target.y || controlHints.y > target.y + target.height)))
      ? targetScaled.push(new mxPoint(m.x, controlHints.y))
      : !l &&
        ((null != pts[n] && pts[n].x != controlHints.x) || (null == pts[n] && null != target && (controlHints.x < target.x || controlHints.x > target.x + target.width))) &&
        targetScaled.push(new mxPoint(controlHints.x, m.y)));
  if (null == pts[0] && null != sourceScaled)
    for (; 0 < targetScaled.length && null != targetScaled[0] && mxUtils.contains(sourceScaled, targetScaled[0].x, targetScaled[0].y); ) targetScaled.splice(0, 1);
  if (null == pts[n] && null != target)
    for (
      ;
      0 < targetScaled.length &&
      null != targetScaled[targetScaled.length - 1] &&
      mxUtils.contains(target, targetScaled[targetScaled.length - 1].x, targetScaled[targetScaled.length - 1].y);

    )
      targetScaled.splice(targetScaled.length - 1, 1);
  for (q = 0; q < targetScaled.length; q++)
    if (
      ((pts = targetScaled[q]),
      (pts.x = Math.round(pts.x * state.view.scale * 10) / 10),
      (pts.y = Math.round(pts.y * state.view.scale * 10) / 10),
      null == k || 1 <= Math.abs(k.x - pts.x) || Math.abs(k.y - pts.y) >= Math.max(1, state.view.scale))
    )
      result.push(pts), (k = pts);
  null != r &&
    null != result[result.length - 1] &&
    1 >= Math.abs(r.x - result[result.length - 1].x) &&
    1 >= Math.abs(r.y - result[result.length - 1].y) &&
    (result.splice(result.length - 1, 1),
    null != result[result.length - 1] &&
      (1 > Math.abs(result[result.length - 1].x - r.x) && (result[result.length - 1].x = r.x),
      1 > Math.abs(result[result.length - 1].y - r.y) && (result[result.length - 1].y = r.y)));
}
