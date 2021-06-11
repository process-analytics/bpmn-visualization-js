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

SegmentConnector:function (state, sourceScaled, targetScaled, d, result) {
  function pushPoint(pt) {
    pt.x = Math.round(pt.x * state.view.scale * 10) / 10;
    pt.y = Math.round(pt.y * state.view.scale * 10) / 10;
    if (null == lastPushed || 1 <= Math.abs(lastPushed.x - pt.x) || Math.abs(lastPushed.y - pt.y) >= Math.max(1, state.view.scale)) result.push(pt), lastPushed = pt;
    return lastPushed
  }

  var pts = mxEdgeStyle.scalePointArray(state.absolutePoints, state.view.scale);
  var source = mxEdgeStyle.scaleCellState(sourceScaled, state.view.scale);
  var target = mxEdgeStyle.scaleCellState(targetScaled, state.view.scale);
  var lastPushed = 0 < result.length ? result[0] : null, l = !0, m = null, pt = pts[0];
  null == pt && null != source ? pt = new mxPoint(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source)) : null != pt && (pt = pt.clone());
  var lastInx = pts.length - 1;
  if (null != d && 0 < d.length) {
    for (var q = [], r = 0; r < d.length; r++) {
      var t = state.view.transformControlPoint(state, d[r], !0);
      null != t && q.push(t)
    }
    if (0 == q.length) return;
    null != pt && null != q[0] && (1 > Math.abs(q[0].x - pt.x) && (q[0].x = pt.x), 1 > Math.abs(q[0].y - pt.y) && (q[0].y = pt.y));
    t = pts[lastInx];
    null != t && null != q[q.length - 1] && (1 > Math.abs(q[q.length - 1].x - t.x) && (q[q.length - 1].x =
      t.x), 1 > Math.abs(q[q.length - 1].y - t.y) && (q[q.length - 1].y = t.y));
    var m = q[0], u = source;
    d = pts[0];
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
      u = target;
      d = pts[lastInx];
      null != d && (u = null);
      x = q[q.length - 1];
      B && A && (q = q.slice(1))
    }
    l && (null != pts[0] && pts[0].y != m.y || null ==
      pts[0] && null != source && (m.y < source.y || m.y > source.y + source.height)) ? pushPoint(new mxPoint(pt.x, m.y)) : !l && (null != pts[0] && pts[0].x != m.x || null == pts[0] && null != source && (m.x < source.x || m.x > source.x + source.width)) && pushPoint(new mxPoint(m.x, pt.y));
    l ? pt.y = m.y : pt.x = m.x;
    for (r = 0; r < q.length; r++) l = !l, m = q[r], l ? pt.y = m.y : pt.x = m.x, pushPoint(pt.clone())
  } else m = pt, l = !0;
  pt = pts[lastInx];
  null == pt && null != target && (pt = new mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target)));
  null != pt && null != m && (l && (null != pts[lastInx] && pts[lastInx].y != m.y || null == pts[lastInx] && null != target && (m.y < target.y || m.y > target.y + target.height)) ? pushPoint(new mxPoint(pt.x, m.y)) : !l && (null !=
    pts[lastInx] && pts[lastInx].x != m.x || null == pts[lastInx] && null != target && (m.x < target.x || m.x > target.x + target.width)) && pushPoint(new mxPoint(m.x, pt.y)));
  if (null == pts[0] && null != source) for (; 1 < result.length && null != result[1] && mxUtils.contains(source, result[1].x, result[1].y);) result.splice(1, 1);
  if (null == pts[lastInx] && null != target) for (; 1 < result.length && null != result[result.length - 1] && mxUtils.contains(target, result[result.length - 1].x, result[result.length - 1].y);) result.splice(result.length - 1, 1);
  null != t && null != result[result.length - 1] && 1 >= Math.abs(t.x - result[result.length - 1].x) && 1 >= Math.abs(t.y - result[result.length - 1].y) && (result.splice(result.length - 1, 1), null != result[result.length - 1] && (1 > Math.abs(result[result.length - 1].x -
    t.x) && (result[result.length - 1].x = t.x), 1 > Math.abs(result[result.length - 1].y - t.y) && (result[result.length - 1].y = t.y)))
}
