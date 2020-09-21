# bpmn-visualization


[![Build](https://github.com/process-analytics/bpmn-visualization-js/workflows/Build/badge.svg)](https://github.com/process-analytics/bpmn-visualization-js/actions)
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/process-analytics/bpmn-visualization-js?color=orange&include_prereleases)](https://github.com/process-analytics/bpmn-visualization-js/releases)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![License](https://img.shields.io/github/license/process-analytics/bpmn-visualization-js?color=blue)](LICENSE)

`bpmn-visualization` is a TypeScript library to visualize process execution data on [BPMN](https://www.omg.org/spec/BPMN/2.0.2/)
diagrams with
- additional display options for execution data (highlight some transitions, counters, and more)
- with interactive capacities (mouse hover, click)


**Supported Browsers**: Chrome, Firefox, Safari, Edge.


# Demo and examples

## Demo

Give a try to the [__:fast_forward: demo live environment__](https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/demo/index.html).
The demo let you load a BPMN file to see how `bpmn-visualization` renders it. Various versions of the lib are available. 

If you need BPMN examples, you can use resources from 
- the [BPMN Model Interchange Working Group (BPMN MIWG)](http://www.omgwiki.org/bpmn-miwg)
  - https://github.com/bpmn-miwg/bpmn-miwg-test-suite
  - https://github.com/bpmn-miwg/bpmn-miwg-demos
- [bpmn-visualization BPMN test diagrams](https://github.com/process-analytics/bpmn-visualization-examples/blob/master/bpmn-files/README.md)


## Examples

Want to know more about `bpmn-visualization` usage and extensibility? Have a look at the
[__:fast_forward: live examples site__](https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/examples/index.html).

For more technical details and how-to, go to the [bpmn-visualization-examples](https://github.com/process-analytics/bpmn-visualization-examples/)
repository.


# Roadmap

`bpmn-visualization` is in early development stages and is subject to changes prior to the `1.0.0` release.

For now, we render the most common BPMN elements. Notice that there is currently no plan to support `Conversation` and `Choreography`.

We are currently focusing on the [packaging](https://github.com/process-analytics/bpmn-visualization-js/milestone/18) of the library.

Then, we will work on BPMN extensions, library extension points, display options for execution data with interactive
capacities.


# Contributing

To contribute to `bpmn-visualization`, fork and clone this repository locally and commit your code on a separate branch. \
Please write tests for your code before opening a pull-request:

```sh
npm run test  # run all unit & e2e tests
```

You can find more detail in our [Contributing guide](CONTRIBUTING.md). Participation in this open source project is subject to a [Code of Conduct](CODE_OF_CONDUCT.md).

:sparkles: A BIG thanks to all our contributors :slightly_smiling_face:

# License

`bpmn-visualization` is released under the [Apache 2.0](LICENSE) license. \
Copyright &copy; 2020, Bonitasoft S.A.

Some BPMN icons used by `bpmn-visualization` are derived from existing projects. See the [BPMN Support page](docs/bpmn-support.adoc)
for more details:
- [draw.io](https://github.com/jgraph/drawio) (Apache-2.0)
- [flaticon](https://www.flaticon.com) ([freepikcompany license](https://www.freepikcompany.com/legal#nav-flaticon))
- [noun project](https://thenounproject.com/) (mainly Creative Commons CCBY 3.0)


# Powered by

[![statically.io logo](https://statically.io/icons/icon-96x96.png "statically.io")](https://statically.io)

**[statically.io](https://statically.io)** (<kbd>demo</kbd> and <kbd>examples</kbd> live environments)
