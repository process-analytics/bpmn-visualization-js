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
  function pushPoint(pt) {
    pt.x = Math.round(pt.x * state.view.scale * 10) / 10;
    pt.y = Math.round(pt.y * state.view.scale * 10) / 10;
    if (null == lastPushed || 1 <= Math.abs(lastPushed.x - pt.x) || Math.abs(lastPushed.y - pt.y) >= Math.max(1, state.view.scale)) result.push(pt), (lastPushed = pt);
    return lastPushed;
  }
  var pts = mxEdgeStyle.scalePointArray(state.absolutePoints, state.view.scale),
    source = mxEdgeStyle.scaleCellState(sourceScaled, state.view.scale),
    target = mxEdgeStyle.scaleCellState(targetScaled, state.view.scale),
    lastPushed = 0 < result.length ? result[0] : null,
    n = !0,
    p = null,
    q = pts[0];
  null == q && null != source ? (q = new mxPoint(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source))) : null != q && (q = q.clone());
  var t = pts.length - 1;
  if (null != controlHints && 0 < controlHints.length) {
    for (var r = [], u = 0; u < controlHints.length; u++) (p = state.view.transformControlPoint(state, controlHints[u], !0)), null != p && r.push(p);
    if (0 == r.length) return;
    null != q && null != r[0] && (1 > Math.abs(r[0].x - q.x) && (r[0].x = q.x), 1 > Math.abs(r[0].y - q.y) && (r[0].y = q.y));
    var x = pts[t];
    null != x &&
      null != r[r.length - 1] &&
      (1 > Math.abs(r[r.length - 1].x - x.x) && (r[r.length - 1].x = x.x), 1 > Math.abs(r[r.length - 1].y - x.y) && (r[r.length - 1].y = x.y));
    var p = r[0],
      y = source;
    controlHints = pts[0];
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
      y = target;
      controlHints = pts[t];
      null != controlHints && (y = null);
      B = r[r.length - 1];
      z && C && (r = r.slice(1));
    }
    n && ((null != pts[0] && pts[0].y != p.y) || (null == pts[0] && null != source && (p.y < source.y || p.y > source.y + source.height)))
      ? pushPoint(new mxPoint(q.x, p.y))
      : !n && ((null != pts[0] && pts[0].x != p.x) || (null == pts[0] && null != source && (p.x < source.x || p.x > source.x + source.width))) && pushPoint(new mxPoint(p.x, q.y));
    n ? (q.y = p.y) : (q.x = p.x);
    for (u = 0; u < r.length; u++) (n = !n), (p = r[u]), n ? (q.y = p.y) : (q.x = p.x), pushPoint(q.clone());
  } else (p = q), (n = !0);
  q = pts[t];
  null == q && null != target && (q = new mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target)));
  null != q &&
    null != p &&
    (n && ((null != pts[t] && pts[t].y != p.y) || (null == pts[t] && null != target && (p.y < target.y || p.y > target.y + target.height)))
      ? pushPoint(new mxPoint(q.x, p.y))
      : !n && ((null != pts[t] && pts[t].x != p.x) || (null == pts[t] && null != target && (p.x < target.x || p.x > target.x + target.width))) && pushPoint(new mxPoint(p.x, q.y)));
  if (null == pts[0] && null != sourceScaled) for (; 1 < result.length && null != result[1] && mxUtils.contains(sourceScaled, result[1].x, result[1].y); ) result.splice(1, 1);
  if (null == pts[t] && null != targetScaled)
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
