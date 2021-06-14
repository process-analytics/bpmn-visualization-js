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

function SegmentConnector(a, b, c, d, e) {
  var f = mxEdgeStyle.scalePointArray(a.absolutePoints, a.view.scale);
  b = mxEdgeStyle.scaleCellState(b, a.view.scale);
  var g = mxEdgeStyle.scaleCellState(c, a.view.scale);
  c = [];
  var k = 0 < e.length ? e[0] : null,
    l = !0,
    m = f[0];
  null == m && null != b ? (m = new mxPoint(a.view.getRoutingCenterX(b), a.view.getRoutingCenterY(b))) : null != m && (m = m.clone());
  var n = f.length - 1;
  if (null != d && 0 < d.length) {
    for (var p = [], q = 0; q < d.length; q++) {
      var r = a.view.transformControlPoint(a, d[q], !0);
      null != r && p.push(r);
    }
    if (0 == p.length) return;
    null != m && null != p[0] && (1 > Math.abs(p[0].x - m.x) && (p[0].x = m.x), 1 > Math.abs(p[0].y - m.y) && (p[0].y = m.y));
    r = f[n];
    null != r &&
      null != p[p.length - 1] &&
      (1 > Math.abs(p[p.length - 1].x - r.x) && (p[p.length - 1].x = r.x), 1 > Math.abs(p[p.length - 1].y - r.y) && (p[p.length - 1].y = r.y));
    d = p[0];
    var t = b,
      u = f[0],
      x;
    x = d;
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
      t = g;
      u = f[n];
      null != u && (t = null);
      x = p[p.length - 1];
      y && B && (p = p.slice(1));
    }
    l && ((null != f[0] && f[0].y != d.y) || (null == f[0] && null != b && (d.y < b.y || d.y > b.y + b.height)))
      ? c.push(new mxPoint(m.x, d.y))
      : !l && ((null != f[0] && f[0].x != d.x) || (null == f[0] && null != b && (d.x < b.x || d.x > b.x + b.width))) && c.push(new mxPoint(d.x, m.y));
    l ? (m.y = d.y) : (m.x = d.x);
    for (q = 0; q < p.length; q++) (l = !l), (d = p[q]), l ? (m.y = d.y) : (m.x = d.x), c.push(m.clone());
  } else (d = m), (l = !0);
  m = f[n];
  null == m && null != g && (m = new mxPoint(a.view.getRoutingCenterX(g), a.view.getRoutingCenterY(g)));
  null != m &&
    null != d &&
    (l && ((null != f[n] && f[n].y != d.y) || (null == f[n] && null != g && (d.y < g.y || d.y > g.y + g.height)))
      ? c.push(new mxPoint(m.x, d.y))
      : !l && ((null != f[n] && f[n].x != d.x) || (null == f[n] && null != g && (d.x < g.x || d.x > g.x + g.width))) && c.push(new mxPoint(d.x, m.y)));
  if (null == f[0] && null != b) for (; 0 < c.length && null != c[0] && mxUtils.contains(b, c[0].x, c[0].y); ) c.splice(0, 1);
  if (null == f[n] && null != g) for (; 0 < c.length && null != c[c.length - 1] && mxUtils.contains(g, c[c.length - 1].x, c[c.length - 1].y); ) c.splice(c.length - 1, 1);
  for (q = 0; q < c.length; q++)
    if (
      ((f = c[q]),
      (f.x = Math.round(f.x * a.view.scale * 10) / 10),
      (f.y = Math.round(f.y * a.view.scale * 10) / 10),
      null == k || 1 <= Math.abs(k.x - f.x) || Math.abs(k.y - f.y) >= Math.max(1, a.view.scale))
    )
      e.push(f), (k = f);
  null != r &&
    null != e[e.length - 1] &&
    1 >= Math.abs(r.x - e[e.length - 1].x) &&
    1 >= Math.abs(r.y - e[e.length - 1].y) &&
    (e.splice(e.length - 1, 1),
    null != e[e.length - 1] && (1 > Math.abs(e[e.length - 1].x - r.x) && (e[e.length - 1].x = r.x), 1 > Math.abs(e[e.length - 1].y - r.y) && (e[e.length - 1].y = r.y)));
}
