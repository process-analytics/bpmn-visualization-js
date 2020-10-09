# BPMN Support - How To

## Introduction

We manage the BPMN Support very incrementally as we prefer small changes, because they are easier and faster to review
and less risky.

So we proceed using several steps:
- `detection`:
  - first, being able to extract the BPMN elements from the BPMN source
  - then, being able to display BPMN elements in an arbitrary form
  - this ensures that the whole infrastructure is put in place for the newly introduced elements support, from parsing to rendering,
  and that tests have been added or updated.
- `rendering`: then we setup the BPMN shape, styles, icons and we polish the display

On the development flow side, this means that there is at least one Pull Request for the `detection` and another one for the `rendering`.

Remember that we prefer small changes . So, `detection` can be splitted into several Pull Requests to cover
various aspects of the BPMN elements.
For instance:
- for a `Pool`, first detect horizontal elements, then vertical elements.
- for a given `BPMN Event` (let's say `Signal`), we have a detection issue for start, catch, throw, ...



## Elements detection

Overview of tasks to be achieved:
* update the BPMN model if the BPMN element is not already defined
* update the json parsing to store the new element in the BPMN model
* add arbitrary rendering
* add/update tests
* update the BPMN support documentation

Refer to existing Pull Requests to have a better view about the work to do, for instance:
- [Link Event Detection Pull Request](https://github.com/process-analytics/bpmn-visualization-js/pull/501/files)
- [Manual Task Detection Pull Request](https://github.com/process-analytics/bpmn-visualization-js/pull/582/files)


### What to change?

Except for special container elements like `Pool`, `Lane` and `Subprocess`, detecting a new BPMN element only requires to
add a new value in the `ShapeBpmnElementKind` enum.

The `ProcessConverter` uses the `ShapeBpmnElementKind` values to detect elements in the BPMN source.

### Elements requiring special attention 

- For BPMN Events, the actual type in controlled by `EventDefinition` fields in the BPMN specification. Detecting new event
types requires changes in `ShapeBpmnEventKind` to add the newly supported BPMN Event Definition.
- For BPMN SubProcesses, the actual type is controlled by `ShapeBpmnSubProcessKind` which is set accordingly during the BPMN parsing.

### Initial Shape Rendering

Overview
* the work to do depends on the BPMN types (events and tasks)
* add a new `mxGraph` shape for totally new elements (see architecture)
* use an arbitrary color to fill the new BPMN element
  * Purpose: uniquely identify a BPMN element on the BPMN diagram even if the rendering is not implemented.
  * this is directly managed in the BPMN mxGraph shape class
* refer to provided examples above for more details


### Tests for elements detection 

**IMPORTANT**: **_Please first refer to the [testing documentation](testing.md) for a clear view of the testing strategy_** 


#### Unit tests

* Add json parsing tests related to the new BPMN element to ensure that the parser is able to make it available to the
`ProcessConverter`. The convention is to have a test file per BPMN element, please follow the existing file name scheme.
* Depending on the BPMN element, you may also have to add tests about `default sequence flow` and/or `conditional sequence
flow` support (see `ShapeBpmnElementKind` for more details)
* No need to create specific XML tests, the XML parsing is tested globally using BPMN files for various BPMN vendors.
* the `mxGraph` style for the shape must be tested as well, see `StyleConfigurator`

#### End To End tests

* update model test, mainly to ensure that the new BPMN element is now stored in the `mxGraph model`, see `mxGraph.model.test.ts`.
* fixtures bpmn diagrams used by model tests
  * name starts with `model-`
  * generally, update the `test/fixtures/model-complete-semantic.bpmn` file with the newly introduced file and update the model expectation accordingly.
  in this file, please adjust shape coordinates to ensure new elements can be easily shown with a viewer and don't overlap with existing elements
  * for special cases, a dedicated test using a specific file. Please communicate with the Core Development Team if you think you need a dedicated file.


#### Visual testing

* sometimes the new BPMN element already exists in the test BPMN diagram, so it will be rendered and test will fail. In that case, update the reference snapshot
* otherwise, add the new element (follow practices described in the [./testing.md](testing) documentation)


## Elements rendering

Overview of tasks to be achieved:
- use the final icon chosen for the BPMN Elements.
- add/update visual tests
- update the BPMN support documentation (see also [icons license](#icons-license))

Refer to existing Pull Requests to have a better view about the work to do, for instance:
- [Error Event Rendering Pull Request](https://github.com/process-analytics/bpmn-visualization-js/pull/505/files)
- [Message Flow with initiating & non-initiating message Rendering Pull Request](https://github.com/process-analytics/bpmn-visualization-js/pull/569/files)


### Tests for elements rendering 

All tests should have been introduced during the detection phase. Please review there is no missing tests.

Visual tests introduced when adding the detection support should fail for the BPMN Element after the rendering has changed.
Please update the reference snapshot image accordingly.


### BPMN icon and marker tips

The icon and markers of the BPMN elements must be defined in the mxGraph custom shapes and this currently must be done using
`TypeScript` code. The `IconPainter` class manages all icons rendering/painting.  

It is possible to adapt an SVG icon thanks to [mxgraph-svg2shape](https://github.com/process-analytics/mxgraph-svg2shape),
a Java tool that will let you transform your SVG file into a set of `TypeScript` commands.

Please be aware that the tool is not able to support all SVG files, and you may need to adapt the SVG definition prior the
tool can transform it. See [PR #210](https://github.com/process-analytics/bpmn-visualization-js/pull/210) for instance.


#### Integration Example

Let's say we want to use this svg content as an icon or marker:

![bpmn icon example](images/bpmn-icon-example.png)

 ```xml
<svg width="250" height="350" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" stroke-width="5"/>
</svg>
```

Running the `Svg2Js` CLI, this will produce something like:
```typescript
// shape: path-blue
// width: 70
// height: 50
// foreground
canvas.begin();
canvas.moveTo(0, 25);
canvas.quadTo(20, 0, 30, 25);
canvas.quadTo(40, 50, 70, 25);
canvas.stroke();
```

Then you can directly use the produced code in the `IconPainter` functions.

The height and width in the comments should be used as original icon size when creating the `canvas` instance like in
the following. The values may differ from the svg viewport as `Svg2Js` resize the SVG source.
```typescript
const originalIconSize = { width: 70, height: 50 };
const canvas = this.newBpmnCanvas({ c, ratioFromParent, setIconOrigin, shape, icon }, originalIconSize);
```

**Note**: The canvas used in the `IconPainter` may not support all mxGraph drawing functions. In that case, please open
a Pull Request or an Issue to add the missing functions. 


#### <a name="icons-license"></a> Reusing existing icons

If you integrate icons that you have not designed by yourself, please don't forget to credit its author and reproduction
conditions. Please try to use materials covered by a Free License to avoid any license compliance issues.

In that case, you must add credit in the following docs: 
- in the source code
- in the BPMN support documentation: at the same place or close to the BPMN supported element 
- in the main README: we don't list all icons there, but we reference projects where the icons come from
