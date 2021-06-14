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
  function f(b) {
    b.x = Math.round(b.x * state.view.scale * 10) / 10;
    b.y = Math.round(b.y * state.view.scale * 10) / 10;
    if (null == m || 1 <= Math.abs(m.x - b.x) || Math.abs(m.y - b.y) >= Math.max(1, state.view.scale)) result.push(b), (m = b);
    return m;
  }
  var g = mxEdgeStyle.scalePointArray(state.absolutePoints, state.view.scale),
    k = mxEdgeStyle.scaleCellState(sourceScaled, state.view.scale),
    l = mxEdgeStyle.scaleCellState(targetScaled, state.view.scale),
    m = 0 < result.length ? result[0] : null,
    n = !0,
    p = null,
    q = g[0];
  null == q && null != k ? (q = new mxPoint(state.view.getRoutingCenterX(k), state.view.getRoutingCenterY(k))) : null != q && (q = q.clone());
  var t = g.length - 1;
  if (null != controlHints && 0 < controlHints.length) {
    for (var r = [], u = 0; u < controlHints.length; u++) (p = state.view.transformControlPoint(state, controlHints[u], !0)), null != p && r.push(p);
    if (0 == r.length) return;
    null != q && null != r[0] && (1 > Math.abs(r[0].x - q.x) && (r[0].x = q.x), 1 > Math.abs(r[0].y - q.y) && (r[0].y = q.y));
    var x = g[t];
    null != x &&
      null != r[r.length - 1] &&
      (1 > Math.abs(r[r.length - 1].x - x.x) && (r[r.length - 1].x = x.x), 1 > Math.abs(r[r.length - 1].y - x.y) && (r[r.length - 1].y = x.y));
    var p = r[0],
      y = k;
    controlHints = g[0];
    var B = !1,
      A = !1,
      B = p;
    null != controlHints && (y = null);
    for (u = 0; 2 > u; u++) {
      var z = null != controlHints && controlHints.x == B.x,
        C = null != controlHints && controlHints.y == B.y,
        v = null != y && B.y >= y.y && B.y <= y.y + y.height,
        y = null != y && B.x >= y.x && B.x <= y.x + y.width,
        B = C || (null == controlHints && v),
        A = z || (null == controlHints && y);
      if (0 != u || !((B && A) || (z && C))) {
        if (null != controlHints && !C && !z && (v || y)) {
          n = v ? !1 : !0;
          break;
        }
        if (A || B) {
          n = B;
          1 == u && (n = 0 == r.length % 2 ? B : A);
          break;
        }
      }
      y = l;
      controlHints = g[t];
      null != controlHints && (y = null);
      B = r[r.length - 1];
      z && C && (r = r.slice(1));
    }
    n && ((null != g[0] && g[0].y != p.y) || (null == g[0] && null != k && (p.y < k.y || p.y > k.y + k.height)))
      ? f(new mxPoint(q.x, p.y))
      : !n && ((null != g[0] && g[0].x != p.x) || (null == g[0] && null != k && (p.x < k.x || p.x > k.x + k.width))) && f(new mxPoint(p.x, q.y));
    n ? (q.y = p.y) : (q.x = p.x);
    for (u = 0; u < r.length; u++) (n = !n), (p = r[u]), n ? (q.y = p.y) : (q.x = p.x), f(q.clone());
  } else (p = q), (n = !0);
  q = g[t];
  null == q && null != l && (q = new mxPoint(state.view.getRoutingCenterX(l), state.view.getRoutingCenterY(l)));
  null != q &&
    null != p &&
    (n && ((null != g[t] && g[t].y != p.y) || (null == g[t] && null != l && (p.y < l.y || p.y > l.y + l.height)))
      ? f(new mxPoint(q.x, p.y))
      : !n && ((null != g[t] && g[t].x != p.x) || (null == g[t] && null != l && (p.x < l.x || p.x > l.x + l.width))) && f(new mxPoint(p.x, q.y)));
  if (null == g[0] && null != sourceScaled) for (; 1 < result.length && null != result[1] && mxUtils.contains(sourceScaled, result[1].x, result[1].y); ) result.splice(1, 1);
  if (null == g[t] && null != targetScaled)
    for (; 1 < result.length && null != result[result.length - 1] && mxUtils.contains(targetScaled, result[result.length - 1].x, result[result.length - 1].y); )
      result.splice(result.length - 1, 1);
  null != x &&
    null != result[result.length - 1] &&
    1 >= Math.abs(x.x - result[result.length - 1].x) &&
    1 >= Math.abs(x.y - result[result.length - 1].y) &&
    (result.splice(result.length - 1, 1),
    null != result[result.length - 1] &&
      (1 > Math.abs(result[result.length - 1].x - x.x) && (result[result.length - 1].x = x.x),
      1 > Math.abs(result[result.length - 1].y - x.y) && (result[result.length - 1].y = x.y)));
}
