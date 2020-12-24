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
var CRp = {};

var impl;

function polygon(context, points) {
  for (var i = 0; i < points.length; i++) {
    var pt = points[i];

    context.lineTo(pt.x, pt.y);
  }
}

function triangleBackcurve(context, points, controlPoint) {
  var firstPt;

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];

    if (i === 0) {
      firstPt = pt;
    }

    context.lineTo(pt.x, pt.y);
  }

  context.quadraticCurveTo(controlPoint.x, controlPoint.y, firstPt.x, firstPt.y);
}

function triangleTee(context, trianglePoints, teePoints) {
  if (context.beginPath) {
    context.beginPath();
  }

  var triPts = trianglePoints;
  for (var i = 0; i < triPts.length; i++) {
    var pt = triPts[i];

    context.lineTo(pt.x, pt.y);
  }

  var teePts = teePoints;
  var firstTeePt = teePoints[0];
  context.moveTo(firstTeePt.x, firstTeePt.y);

  for (var i = 1; i < teePts.length; i++) {
    var pt = teePts[i];

    context.lineTo(pt.x, pt.y);
  }

  if (context.closePath) {
    context.closePath();
  }
}

function circleTriangle(context, trianglePoints, rx, ry, r) {
  if (context.beginPath) {
    context.beginPath();
  }
  context.arc(rx, ry, r, 0, Math.PI * 2, false);
  var triPts = trianglePoints;
  var firstTrPt = triPts[0];
  context.moveTo(firstTrPt.x, firstTrPt.y);
  for (var i = 0; i < triPts.length; i++) {
    var pt = triPts[i];
    context.lineTo(pt.x, pt.y);
  }
  if (context.closePath) {
    context.closePath();
  }
}

function circle(context, rx, ry, r) {
  context.arc(rx, ry, r, 0, Math.PI * 2, false);
}

CRp.arrowShapeImpl = function (name) {
  return (impl ||
    (impl = {
      polygon: polygon,

      'triangle-backcurve': triangleBackcurve,

      'triangle-tee': triangleTee,

      'circle-triangle': circleTriangle,

      'triangle-cross': triangleTee,

      circle: circle,
    }))[name];
};

export default CRp;
