// https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/view/mxEdgeStyle.js#L592

SegmentConnector: function(state, sourceScaled, targetScaled, controlHints, result)
{
  // Creates array of all way- and terminalpoints
  var pts = mxEdgeStyle.scalePointArray(state.absolutePoints, state.view.scale);
  var source = mxEdgeStyle.scaleCellState(sourceScaled, state.view.scale);
  var target = mxEdgeStyle.scaleCellState(targetScaled, state.view.scale);
  var tol = 1;

  // Whether the first segment outgoing from the source end is horizontal
  var lastPushed = (result.length > 0) ? result[0] : null;
  var horizontal = true;
  var hint = null;

  // Adds waypoints only if outside of tolerance
  function pushPoint(pt)
  {
    pt.x = Math.round(pt.x * state.view.scale * 10) / 10;
    pt.y = Math.round(pt.y * state.view.scale * 10) / 10;

    if (lastPushed == null || Math.abs(lastPushed.x - pt.x) >= tol || Math.abs(lastPushed.y - pt.y) >= Math.max(1, state.view.scale))
    {
      result.push(pt);
      lastPushed = pt;
    }

    return lastPushed;
  };

  // Adds the first point
  var pt = pts[0];

  if (pt == null && source != null)
  {
    pt = new mxPoint(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source));
  }
  else if (pt != null)
  {
    pt = pt.clone();
  }

  var lastInx = pts.length - 1;

  // Adds the waypoints
  if (controlHints != null && controlHints.length > 0)
  {
    // Converts all hints and removes nulls
    var hints = [];

    for (var i = 0; i < controlHints.length; i++)
    {
      var tmp = state.view.transformControlPoint(state, controlHints[i], true);

      if (tmp != null)
      {
        hints.push(tmp);
      }
    }

    if (hints.length == 0)
    {
      return;
    }

    // Aligns source and target hint to fixed points
    if (pt != null && hints[0] != null)
    {
      if (Math.abs(hints[0].x - pt.x) < tol)
      {
        hints[0].x = pt.x;
      }

      if (Math.abs(hints[0].y - pt.y) < tol)
      {
        hints[0].y = pt.y;
      }
    }

    var pe = pts[lastInx];

    if (pe != null && hints[hints.length - 1] != null)
    {
      if (Math.abs(hints[hints.length - 1].x - pe.x) < tol)
      {
        hints[hints.length - 1].x = pe.x;
      }

      if (Math.abs(hints[hints.length - 1].y - pe.y) < tol)
      {
        hints[hints.length - 1].y = pe.y;
      }
    }

    hint = hints[0];

    var currentTerm = source;
    var currentPt = pts[0];
    var hozChan = false;
    var vertChan = false;
    var currentHint = hint;

    if (currentPt != null)
    {
      currentTerm = null;
    }

    // Check for alignment with fixed points and with channels
    // at source and target segments only
    for (var i = 0; i < 2; i++)
    {
      var fixedVertAlign = currentPt != null && currentPt.x == currentHint.x;
      var fixedHozAlign = currentPt != null && currentPt.y == currentHint.y;

      var inHozChan = currentTerm != null && (currentHint.y >= currentTerm.y &&
        currentHint.y <= currentTerm.y + currentTerm.height);
      var inVertChan = currentTerm != null && (currentHint.x >= currentTerm.x &&
        currentHint.x <= currentTerm.x + currentTerm.width);

      hozChan = fixedHozAlign || (currentPt == null && inHozChan);
      vertChan = fixedVertAlign || (currentPt == null && inVertChan);

      // If the current hint falls in both the hor and vert channels in the case
      // of a floating port, or if the hint is exactly co-incident with a
      // fixed point, ignore the source and try to work out the orientation
      // from the target end
      if (i==0 && ((hozChan && vertChan) || (fixedVertAlign && fixedHozAlign)))
      {
      }
      else
      {
        if (currentPt != null && (!fixedHozAlign && !fixedVertAlign) && (inHozChan || inVertChan))
        {
          horizontal = inHozChan ? false : true;
          break;
        }

        if (vertChan || hozChan)
        {
          horizontal = hozChan;

          if (i == 1)
          {
            // Work back from target end
            horizontal = hints.length % 2 == 0 ? hozChan : vertChan;
          }

          break;
        }
      }

      currentTerm = target;
      currentPt = pts[lastInx];

      if (currentPt != null)
      {
        currentTerm = null;
      }

      currentHint = hints[hints.length - 1];

      if (fixedVertAlign && fixedHozAlign)
      {
        hints = hints.slice(1);
      }
    }

    if (horizontal && ((pts[0] != null && pts[0].y != hint.y) ||
      (pts[0] == null && source != null &&
        (hint.y < source.y || hint.y > source.y + source.height))))
    {
      pushPoint(new mxPoint(pt.x, hint.y));
    }
    else if (!horizontal && ((pts[0] != null && pts[0].x != hint.x) ||
      (pts[0] == null && source != null &&
        (hint.x < source.x || hint.x > source.x + source.width))))
    {
      pushPoint(new mxPoint(hint.x, pt.y));
    }

    if (horizontal)
    {
      pt.y = hint.y;
    }
    else
    {
      pt.x = hint.x;
    }

    for (var i = 0; i < hints.length; i++)
    {
      horizontal = !horizontal;
      hint = hints[i];

//				mxLog.show();
//				mxLog.debug('hint', i, hint.x, hint.y);

      if (horizontal)
      {
        pt.y = hint.y;
      }
      else
      {
        pt.x = hint.x;
      }

      pushPoint(pt.clone());
    }
  }
  else
  {
    hint = pt;
    // FIXME: First click in connect preview toggles orientation
    horizontal = true;
  }

  // Adds the last point
  pt = pts[lastInx];

  if (pt == null && target != null)
  {
    pt = new mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target));
  }

  if (pt != null)
  {
    if (hint != null)
    {
      if (horizontal && ((pts[lastInx] != null && pts[lastInx].y != hint.y) ||
        (pts[lastInx] == null && target != null &&
          (hint.y < target.y || hint.y > target.y + target.height))))
      {
        pushPoint(new mxPoint(pt.x, hint.y));
      }
      else if (!horizontal && ((pts[lastInx] != null && pts[lastInx].x != hint.x) ||
        (pts[lastInx] == null && target != null &&
          (hint.x < target.x || hint.x > target.x + target.width))))
      {
        pushPoint(new mxPoint(hint.x, pt.y));
      }
    }
  }

  // Removes bends inside the source terminal for floating ports
  if (pts[0] == null && source != null)
  {
    while (result.length > 1 && result[1] != null &&
    mxUtils.contains(source, result[1].x, result[1].y))
    {
      result.splice(1, 1);
    }
  }

  // Removes bends inside the target terminal
  if (pts[lastInx] == null && target != null)
  {
    while (result.length > 1 && result[result.length - 1] != null &&
    mxUtils.contains(target, result[result.length - 1].x, result[result.length - 1].y))
    {
      result.splice(result.length - 1, 1);
    }
  }

  // Removes last point if inside tolerance with end point
  if (pe != null && result[result.length - 1] != null &&
    Math.abs(pe.x - result[result.length - 1].x) <= tol &&
    Math.abs(pe.y - result[result.length - 1].y) <= tol)
  {
    result.splice(result.length - 1, 1);

    // Lines up second last point in result with end point
    if (result[result.length - 1] != null)
    {
      if (Math.abs(result[result.length - 1].x - pe.x) < tol)
      {
        result[result.length - 1].x = pe.x;
      }

      if (Math.abs(result[result.length - 1].y - pe.y) < tol)
      {
        result[result.length - 1].y = pe.y;
      }
    }
  }
},
