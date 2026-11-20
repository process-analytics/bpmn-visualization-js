# SVG export: wrong overlay positions

Branch: `fix/svg_export_overlay_position`, from `master` at `f90f6d354`.

Investigation done with Claude Code (model: Claude Opus 5.5), reviewed by a maintainer.

## Symptom

When exporting to SVG from the demo (`elements-identification.html`, "display overlays" checked), the 1st overlay is
at the right position, then each following overlay is shifted further, and the shift grows with each overlay.
The export code is `dev/ts/component/SvgExporter.ts`, which already carries a `FIXME` about it.

## Root cause: a canvas scale compounding across overlays (mxGraph bug, not custom code)

`SvgExporter` sets `mxImageExport.includeOverlays = true`. mxGraph 4.2.2 then draws overlays in a second pass, after
all cells (`mxImageExport.drawState`), with:

```js
mxImageExport.prototype.drawOverlays = function(state, canvas) {
  if (state.overlays != null) {
    state.overlays.visit(function(id, shape) {
      if (shape instanceof mxShape) {
        shape.paint(canvas); // no canvas.save() / canvas.restore()
      }
    });
  }
};
```

`drawShape` and `drawText` wrap `paint` in `canvas.save()` / `canvas.restore()`, `drawOverlays` does not.
`paint` (both `mxShape.paint` and `mxText.paint`) calls `updateTransform`, which calls `c.scale(this.scale)`, and
`mxAbstractCanvas2D.scale` multiplies `state.scale` in place. The shape scale is the view scale `v`.

- The exporter starts the canvas at scale `1 / v`, so the 1st overlay is drawn at `1/v * v = 1`: correct.
- The 2nd overlay is drawn at scale `v`, the 3rd at `v²`, the k-th at `v^(k-1)`.

Since positions are computed as `(x + dx) * scale`, every overlay after the first is scaled from the canvas origin by
an extra factor `v`: toward the bottom-right when the view is zoomed in (`v > 1`), toward the top-left when zoomed out
(`v < 1`). Cells are not affected because they are all drawn before the overlay pass.

At view scale 1, the bug is invisible.

### Proof from the provided samples

Badge font sizes in the exported SVG grow or shrink geometrically, with a constant ratio equal to the view scale:

| sample | font sizes of the 3 overlays | ratio |
|---|---|---|
| `diagram.svg` | 11px, 13.473px, 16.502px | 1.2248 (zoomed in, drift to bottom-right) |
| `diagram_B.1.0_export_wrong_overlays_position.svg` | 20px, 16.595px, 13.770px | 0.8297 (zoomed out, drift to top-left) |

Rect widths follow the same ratio (20, 25, 30 in `diagram.svg`).

### Overlays sharing the cells' `<g>`

Not related. The SVG grouping only decides where nodes are appended. The positions come from the canvas state
(`dx`, `dy`, `scale`), which is what drifts.

## draw.io

- Current `origin/dev` (32.7.4, `f411a11f4f6b8994d869bdbc45f4d4d9e2284f34`) has the exact same `drawOverlays`:
  https://github.com/jgraph/drawio/blob/f411a11f4f6b8994d869bdbc45f4d4d9e2284f34/src/main/webapp/mxgraph/src/util/mxImageExport.js#L311
- The function never changed since the mxGraph source was first published in draw.io (22.0.0).
- draw.io never sets `includeOverlays`, so it never runs this code path. Nothing to port from draw.io.

## maxGraph

Same bug in `ImageExport.drawOverlays` (`origin/main` at `b612af2f016e7b18051d6b28bf9363921e75c2b2`):
https://github.com/maxGraph/maxGraph/blob/b612af2f016e7b18051d6b28bf9363921e75c2b2/packages/core/src/view/image/ImageExport.ts#L157

To consider for the mxGraph to maxGraph migration of bpmn-visualization, and as an upstream fix in maxGraph.

## Fix

`SvgExporter` uses an `mxImageExport` subclass overriding `drawOverlays` to wrap each overlay paint in
`canvas.save()` / `canvas.restore()`. The `FIXME` on overlay positions is removed.

## Tests

`test/integration/svg.export.overlays.test.ts` (jsdom) exports the same overlays at view scale 1 and at 0.5 and 2, and
compares font sizes and positions relative to the first overlay. Cases: tasks, expanded sub-process and its child,
call activities, pools, lanes and their child. All 10 cases fail without the fix, pass with it: the second line of the
former `FIXME` (sub-process and call activity) was the same bug.

## Out of scope: export translation depends on the view scale

The exporter translates the canvas by `floor((border - bounds.x) / viewScale)` while the drawing ends at scale 1, so
the border is divided by the view scale: at zoom 2, the whole diagram is shifted by about 12px to the top-left (the
left margin is 12.5px instead of 25px, the right one grows accordingly). Seen in the jsdom probe; the test compares
positions relatively to the first overlay to stay independent of it. Not fixed here.

## maxGraph issue

Draft in `ISSUE_MAXGRAPH.md` at the repository root (scratch file, not committed).
