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

## Proposed fix (not implemented yet)

In `SvgExporter`, use an `mxImageExport` subclass overriding `drawOverlays` to isolate each overlay paint:

```ts
override drawOverlays(state: mxCellState, canvas: mxAbstractCanvas2D): void {
  state.overlays?.visit((_id: string, shape: mxShape) => {
    if (shape instanceof mxShape) {
      canvas.save();
      shape.paint(canvas);
      canvas.restore();
    }
  });
}
```

Then remove the `FIXME` on overlay positions.

## Open points

- The 2nd line of the `FIXME` ("overlays put on element of subprocess/call-activity are not placed correctly") is
  probably the same bug (any overlay drawn after the 1st one in traversal order), not verified yet.
- `dev/` code has no test. Options: a jsdom integration test exporting a diagram with 3 overlays at a zoom different
  from 1 and asserting badge font sizes or positions, or a manual check in the demo.
