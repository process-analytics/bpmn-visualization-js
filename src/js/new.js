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

SegmentConnector:function (state, b, c, d, e) {
  function pushPoint(b) {
    b.x = Math.round(b.x * state.view.scale * 10) / 10;
    b.y = Math.round(b.y * state.view.scale * 10) / 10;
    if (null == lastPushed || 1 <= Math.abs(lastPushed.x - b.x) || Math.abs(lastPushed.y - b.y) >= Math.max(1, state.view.scale)) e.push(b), lastPushed = b;
    return lastPushed
  }

  var pts = mxEdgeStyle.scalePointArray(state.absolutePoints, state.view.scale), k = mxEdgeStyle.scaleCellState(b, state.view.scale), l = mxEdgeStyle.scaleCellState(c, state.view.scale),
    lastPushed = 0 < e.length ? e[0] : null, n = !0, p = null, q = pts[0];
  null == q && null != k ? q = new mxPoint(state.view.getRoutingCenterX(k), state.view.getRoutingCenterY(k)) : null != q && (q = q.clone());
  var lastInx = pts.length - 1;
  if (null != d && 0 < d.length) {
    for (var r = [], u = 0; u < d.length; u++) p = state.view.transformControlPoint(state, d[u], !0), null != p && r.push(p);
    if (0 == r.length) return;
    null != q && null != r[0] && (1 > Math.abs(r[0].x - q.x) && (r[0].x = q.x), 1 > Math.abs(r[0].y - q.y) && (r[0].y = q.y));
    var x = pts[lastInx];
    null != x && null != r[r.length - 1] && (1 > Math.abs(r[r.length - 1].x - x.x) && (r[r.length - 1].x = x.x),
    1 > Math.abs(r[r.length - 1].y - x.y) && (r[r.length - 1].y = x.y));
    var p = r[0], y = k;
    d = pts[0];
    var B = !1, A = !1, B = p;
    null != d && (y = null);
    for (u = 0; 2 > u; u++) {
      var z = null != d && d.x == B.x, C = null != d && d.y == B.y, v = null != y && B.y >= y.y && B.y <= y.y + y.height, y = null != y && B.x >= y.x && B.x <= y.x + y.width,
        B = C || null == d && v, A = z || null == d && y;
      if (0 != u || !(B && A || z && C)) {
        if (null != d && !C && !z && (v || y)) {
          n = v ? !1 : !0;
          break
        }
        if (A || B) {
          n = B;
          1 == u && (n = 0 == r.length % 2 ? B : A);
          break
        }
      }
      y = l;
      d = pts[lastInx];
      null != d && (y = null);
      B = r[r.length - 1];
      z && C && (r = r.slice(1))
    }
    n && (null != pts[0] && pts[0].y != p.y || null ==
      pts[0] && null != k && (p.y < k.y || p.y > k.y + k.height)) ? pushPoint(new mxPoint(q.x, p.y)) : !n && (null != pts[0] && pts[0].x != p.x || null == pts[0] && null != k && (p.x < k.x || p.x > k.x + k.width)) && pushPoint(new mxPoint(p.x, q.y));
    n ? q.y = p.y : q.x = p.x;
    for (u = 0; u < r.length; u++) n = !n, p = r[u], n ? q.y = p.y : q.x = p.x, pushPoint(q.clone())
  } else p = q, n = !0;
  q = pts[lastInx];
  null == q && null != l && (q = new mxPoint(state.view.getRoutingCenterX(l), state.view.getRoutingCenterY(l)));
  null != q && null != p && (n && (null != pts[lastInx] && pts[lastInx].y != p.y || null == pts[lastInx] && null != l && (p.y < l.y || p.y > l.y + l.height)) ? pushPoint(new mxPoint(q.x, p.y)) : !n && (null !=
    pts[lastInx] && pts[lastInx].x != p.x || null == pts[lastInx] && null != l && (p.x < l.x || p.x > l.x + l.width)) && pushPoint(new mxPoint(p.x, q.y)));
  if (null == pts[0] && null != b) for (; 1 < e.length && null != e[1] && mxUtils.contains(b, e[1].x, e[1].y);) e.splice(1, 1);
  if (null == pts[lastInx] && null != c) for (; 1 < e.length && null != e[e.length - 1] && mxUtils.contains(c, e[e.length - 1].x, e[e.length - 1].y);) e.splice(e.length - 1, 1);
  null != x && null != e[e.length - 1] && 1 >= Math.abs(x.x - e[e.length - 1].x) && 1 >= Math.abs(x.y - e[e.length - 1].y) && (e.splice(e.length - 1, 1), null != e[e.length - 1] && (1 > Math.abs(e[e.length - 1].x -
    x.x) && (e[e.length - 1].x = x.x), 1 > Math.abs(e[e.length - 1].y - x.y) && (e[e.length - 1].y = x.y)))
}
