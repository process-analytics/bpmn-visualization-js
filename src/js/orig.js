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

SegmentConnector:function (a, b, c, d, e) {
  function f(b) {
    b.x = Math.round(b.x * a.view.scale * 10) / 10;
    b.y = Math.round(b.y * a.view.scale * 10) / 10;
    if (null == k || 1 <= Math.abs(k.x - b.x) || Math.abs(k.y - b.y) >= Math.max(1, a.view.scale)) e.push(b), k = b;
    return k
  }

  var g = mxEdgeStyle.scalePointArray(a.absolutePoints, a.view.scale);
  b = mxEdgeStyle.scaleCellState(b, a.view.scale);
  c = mxEdgeStyle.scaleCellState(c, a.view.scale);
  var k = 0 < e.length ? e[0] : null, l = !0, m = null, n = g[0];
  null == n && null != b ? n = new mxPoint(a.view.getRoutingCenterX(b), a.view.getRoutingCenterY(b)) : null != n && (n = n.clone());
  var p = g.length - 1;
  if (null != d && 0 < d.length) {
    for (var q = [], r = 0; r < d.length; r++) {
      var t = a.view.transformControlPoint(a, d[r], !0);
      null != t && q.push(t)
    }
    if (0 == q.length) return;
    null != n && null != q[0] && (1 > Math.abs(q[0].x - n.x) && (q[0].x = n.x), 1 > Math.abs(q[0].y - n.y) && (q[0].y = n.y));
    t = g[p];
    null != t && null != q[q.length - 1] && (1 > Math.abs(q[q.length - 1].x - t.x) && (q[q.length - 1].x =
      t.x), 1 > Math.abs(q[q.length - 1].y - t.y) && (q[q.length - 1].y = t.y));
    var m = q[0], u = b;
    d = g[0];
    var x = !1, y = !1, x = m;
    null != d && (u = null);
    for (r = 0; 2 > r; r++) {
      var B = null != d && d.x == x.x, A = null != d && d.y == x.y, z = null != u && x.y >= u.y && x.y <= u.y + u.height, u = null != u && x.x >= u.x && x.x <= u.x + u.width,
        x = A || null == d && z, y = B || null == d && u;
      if (0 != r || !(x && y || B && A)) {
        if (null != d && !A && !B && (z || u)) {
          l = z ? !1 : !0;
          break
        }
        if (y || x) {
          l = x;
          1 == r && (l = 0 == q.length % 2 ? x : y);
          break
        }
      }
      u = c;
      d = g[p];
      null != d && (u = null);
      x = q[q.length - 1];
      B && A && (q = q.slice(1))
    }
    l && (null != g[0] && g[0].y != m.y || null ==
      g[0] && null != b && (m.y < b.y || m.y > b.y + b.height)) ? f(new mxPoint(n.x, m.y)) : !l && (null != g[0] && g[0].x != m.x || null == g[0] && null != b && (m.x < b.x || m.x > b.x + b.width)) && f(new mxPoint(m.x, n.y));
    l ? n.y = m.y : n.x = m.x;
    for (r = 0; r < q.length; r++) l = !l, m = q[r], l ? n.y = m.y : n.x = m.x, f(n.clone())
  } else m = n, l = !0;
  n = g[p];
  null == n && null != c && (n = new mxPoint(a.view.getRoutingCenterX(c), a.view.getRoutingCenterY(c)));
  null != n && null != m && (l && (null != g[p] && g[p].y != m.y || null == g[p] && null != c && (m.y < c.y || m.y > c.y + c.height)) ? f(new mxPoint(n.x, m.y)) : !l && (null !=
    g[p] && g[p].x != m.x || null == g[p] && null != c && (m.x < c.x || m.x > c.x + c.width)) && f(new mxPoint(m.x, n.y)));
  if (null == g[0] && null != b) for (; 1 < e.length && null != e[1] && mxUtils.contains(b, e[1].x, e[1].y);) e.splice(1, 1);
  if (null == g[p] && null != c) for (; 1 < e.length && null != e[e.length - 1] && mxUtils.contains(c, e[e.length - 1].x, e[e.length - 1].y);) e.splice(e.length - 1, 1);
  null != t && null != e[e.length - 1] && 1 >= Math.abs(t.x - e[e.length - 1].x) && 1 >= Math.abs(t.y - e[e.length - 1].y) && (e.splice(e.length - 1, 1), null != e[e.length - 1] && (1 > Math.abs(e[e.length - 1].x -
    t.x) && (e[e.length - 1].x = t.x), 1 > Math.abs(e[e.length - 1].y - t.y) && (e[e.length - 1].y = t.y)))
}
