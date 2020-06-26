# bpmn-visualization


[![Build](https://github.com/process-analytics/bpmn-visualization-js/workflows/Build/badge.svg)](https://github.com/process-analytics/bpmn-visualization-js/actions)
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/process-analytics/bpmn-visualization-js?color=orange&include_prereleases)](https://github.com/process-analytics/bpmn-visualization-js/releases)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

`bpmn-visualization` is a TypeScript library to visualize process execution data on [BPMN](https://www.omg.org/spec/BPMN/2.0.2/)
diagrams with
- additional display options for execution data (highlight some transitions, counters, and more)
- with interactive capacities (mouse hover, click)


**Supported Browsers**: Chrome, Firefox, Safari, Edge.


# Demos

The [demo environment](https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/demo/index.html)
let you load a BPMN file to see how the lib renders it. Various versions of the lib are available. 

If you need BPMN examples, you can use resources of the [BPMN Model Interchange Working Group (BPMN MIWG)](http://www.omgwiki.org/bpmn-miwg)
- https://github.com/bpmn-miwg/bpmn-miwg-test-suite
- https://github.com/bpmn-miwg/bpmn-miwg-demos


# Roadmap

`bpmn-visualization` is in early development stages and is subject to changes prior to the `1.0.0` release.

We are currently focusing on the [BPMN support](https://github.com/process-analytics/bpmn-visualization-js/milestone/6)
to be able to render most of the BPMN elements. Notice that there is currently no plan to support `Conversation` and
`Choreography`.

Then, we will work on BPMN extensions, library extension points, display options for execution data with interactive
capacities.


# Development

To build the project, see the [Contributing guide](CONTRIBUTING.md#Build) :slightly_smiling_face:


# License

`bpmn-visualization` is released under the `Apache 2.0` license.

Some BPMN icons used by `bpmn-visualization` are derived from existing projects. See the [BPMN Support page](docs/bpmn-support.adoc)
for more details:
- [draw.io](https://github.com/jgraph/drawio) (Apache-2.0)
- [flaticon](https://www.flaticon.com) ([freepikcompany license](https://www.freepikcompany.com/legal#nav-flaticon))


# Powered by

[![statically.io logo](https://statically.io/icons/icon-96x96.png "statically.io")](https://statically.io)

**[statically.io](https://statically.io)** (demo environment)
