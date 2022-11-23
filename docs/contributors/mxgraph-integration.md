# mxGraph Integration

The [mxGraph](https://jgraph.github.io/mxgraph/) integration is in charge of displaying the BPMN diagrams, by filling the
[mxGraph model](https://jgraph.github.io/mxgraph/docs/manual.html#3.1.1) from the BPMN model.

If you are new to `mxGraph` or want to know more about it, please have a look at the [mxGraph tutorial](https://jgraph.github.io/mxgraph/docs/tutorial.html)
and [mxGraph manual](https://jgraph.github.io/mxgraph/docs/manual.html).


## Logical Groups of BPMN Elements

[mxGraph Group Structure](https://jgraph.github.io/mxgraph/docs/manual.html#3.1.4) allows to define a parent-child relationship
that leverages various rendering features like collapsing/expanding, layering, drill down, group move/hide, ...
See [mxGraph Complexity Management](https://jgraph.github.io/mxgraph/docs/manual.html#3.1.5) for more details.

On `mxGraph` graph creation, the `bpmn-visualization` fills the following group of BPMN elements:
- `pool` is the parent of `lanes` and `inter-lane elements` (for instance, `sequence flows`), or any BPMN elements when there is no `lane`
- `lane` is the parent of elements it includes in the BPMN source

The default mxGraph parent is the parent of

* inter pool elements (for instance, `message flows`)
* elements when the BPMN source doesn't define any lane/pool


## BPMN elements positioning

*Note*: the following applies to both BPMN shapes and edges (including waypoints)

The bpmn input source coordinates are absolute whereas mxgraph uses coordinates in the referential of the parent cell.
As we define a parent-child relationship when inserting BPMN elements in the mxGraph model, a coordinate transformation
layer is required. See `BpmnRenderer` for more details.


## BPMN Elements rendering and style

Each BPMN Element is transformed into a `mxGraph` [Cell](https://jgraph.github.io/mxgraph/docs/manual.html#3.1.3.4) and then inserted into the `mxGraph` model:
- `vertex` for BPMN Shapes
- `edge` for BPMN Edges

At insertion, a style is passed to configure how the BPMN Element is rendered.

The [style](https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxStylesheet-js.html) (see also the [mxGraph manual](https://jgraph.github.io/mxgraph/docs/manual.html#3.1.3.1))
is defined and registered in `StyleConfigurator`. In particular, it refers to the name of a [Shape](https://jgraph.github.io/mxgraph/docs/js-api/files/shape/Shape-js.html)
used for the rendering.

The `Shape` can be a standard `mxGraph` class or a custom BPMN `Shape` defined by the `bpmn-visualization`. The custom `Shapes` are registered by `ShapeConfigurator`
which associates the `Shape` name (used in style definition) with the `Shape` class to be used.

For more details, see [BPMN Support - How To](./bpmn-support-how-to.md).


### Resources

#### mxGraph

[mxgraph Geometry](https://jgraph.github.io/mxgraph/docs/manual.html#3.1.3.2)
> The coordinate system in JavaScript is x is positive to the right and y is positive
> downwards, and in terms of the graph, the positioning is absolute to the container
> within which the mxGraph is placed.

[mxgraph Group Structure](https://jgraph.github.io/mxgraph/docs/manual.html#3.1.4)
> The x,y position of a vertex is its position relative to its parent, so in the case of
> default grouping (all cells sharing the default parent) the cell positioning is also
> the absolute co-ordinates on the graph component.


#### BPMN specification

BPMNPlane (page 371)
> BPMNPlane element is always owned by a BPMNDiagram and represents the root diagram element of that diagram.
> The plane represents a 2 dimensional surface with an origin at (0, 0) along the x and y axes with increasing coordinates
> to the right and bottom. Only positive coordinates are allowed for diagram elements that are nested in a BPMNPlane.

BPMNShape (page 372)
> All BPMNShape elements are owned directly by a BPMNPlane (that is the root element in a BPMNDiagram), i.e., shapes
> are not nested within each other in the BPMN DI model although they may appear that way when depicted. The bounds
> of a BPMNShape are always relative to that plane’s origin point and are REQUIRED to be positive coordinates. Note that
> the bounds’ x and y coordinates are the position of the upper left corner of the shape (relative to the upper left corner of
> the plane).


BPMNEdge (page 375)
> All BPMNEdge elements are owned directly by a BPMNPlane (that is the root element in a BPMNDiagram). The
> waypoints of BPMNEdge are always relative to that plane’s origin point and are REQUIRED to be positive coordinates.

BPMNLabel (page 377)
> The bounds of BPMNLabel are always relative to the containing plane’s origin point. Note that the bounds’ x and y
> coordinates are the position of the upper left corner of the label (relative to the upper left corner of the plane).


## Label Font and Bounds

The `mxGraph` integration renders labels based on the definition taken from the BPMN source. When the label style is not
or only partially defined in BPMN, the following fallback takes place:
- for labels without a font, the rendering may not be accurate: the default font used by the original modeler may differ
from the one the `bpmn-visualization` uses. As a result, the bounds set in the BPMN file may be too small or large for the `bpmn-visualization` font. So the
resulting text wrapping cannot be the same as with the original modeler.
- for labels without bounds, the `bpmn-visualization` uses an arbitrary position which depends on the type of the BPMN element (for instance, middle
centred for tasks or on the bottom for start events). As for fonts, this does not cover all use cases, but works most of
the time.

### Shape

The `mxGraph` integration uses the following to set the label bounds
- the `vertex Cell` geometry offset, see 
for more details
  - x and y position relative to the shape `vertex` itself
  - as for the  shape `vertex` position, a coordinate transformation layer is required.
- styling for the label width (for word wrapping)

### Edge

#### Overview

The mxGraph integration uses the `edge Cell` geometry to set the label bounds
- absolute geometry
- offset x and y: position related to the center of the edge and as for the Shape Position, a coordinate transformation layer is required.
  - the center depends on the 2 terminal waypoints
  - if the waypoints are not available, no position is set and the label is placed on the edge center
- width and height: for word wrapping.

see [mxGeometry](https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/model/mxGeometry.js#L60)

#### mxGraph Details

The label position is related to the 'center' of the edge, see [mxGeometry](https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/model/mxGeometry.js#L35)
for more details. The definition of 'center' differs whether the `mxGeometry` is `relative` or not:
- if relative, it is the center along the line
- if absolute, it is derived from the terminal points

This is explained in [mxGraphView.updateEdgeLabelOffset](https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/view/mxGraphView.js#L2187)
- center between the two endpoints if the geometry is absolute
- the relative distance between the center along the line, and the absolute orthogonal distance if the geometry is relative.

Check the [GitHub Pull Request #291](https://github.com/process-analytics/bpmn-visualization-js/pull/291#issuecomment-642024601)
to see various positioning methods in action.


## Overlays

We are hacking CellOverlays which originally only supports image shape. This lets us use custom shapes.

Customization main points
- `MxGraphCustomOverlay`: add extra configuration and behavior to CellOverlay
- customized `CellRenderer`: change the overlays rendering code to transform `MxGraphCustomOverlay` into specific shapes 
according to its configuration.

More details are available in [#955](https://github.com/process-analytics/bpmn-visualization-js/issues/955).


## Custom CSS classes added to svg node generated by mxGraph

In `ShapeConfigurator`, we customize the Shape rendering code to add extra CSS classes depending on BPMN Element kinds.
It allows styling to be managed with external CSS classes and it is also used for element identification and selection.

More details are available in [#942](https://github.com/process-analytics/bpmn-visualization-js/issues/942).
