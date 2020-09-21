<h1 align="center">BPMN Visualization</h1> <br>
<p align="center">
   <img title="BPMN Visualization" src="https://github.com/process-analytics/bpmn-visualization-js/blob/master/config/logo.png" width="812" height="170">
</p>

[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/process-analytics/bpmn-visualization-js?color=orange&include_prereleases)](https://github.com/process-analytics/bpmn-visualization-js/releases)
[![Build](https://github.com/process-analytics/bpmn-visualization-js/workflows/Build/badge.svg)](https://github.com/process-analytics/bpmn-visualization-js/actions)
[![Live Demo](https://img.shields.io/badge/demo-online-blueviolet.svg)][demo-live-environment]

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square)](CONTRIBUTING.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![License](https://img.shields.io/github/license/process-analytics/bpmn-visualization-js?color=blue)](LICENSE)

`bpmn-visualization` is a TypeScript library to visualize process execution data on [BPMN](https://www.omg.org/spec/BPMN/2.0.2/)
diagrams with:
- additional display options for execution data (highlight some transitions, counters, and more)
- interactive capacities (mouse hover, click)

## 🌏 Browser Support

| <img src="https://user-images.githubusercontent.com/1215767/34348387-a2e64588-ea4d-11e7-8267-a43365103afe.png" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://user-images.githubusercontent.com/1215767/34348383-9e7ed492-ea4d-11e7-910c-03b39d52f496.png" alt="Firefox" width="16px" height="16px" /> Firefox | <img src="https://user-images.githubusercontent.com/1215767/34348394-a981f892-ea4d-11e7-9156-d128d58386b9.png" alt="Safari" width="16px" height="16px" /> Safari | <img src="https://user-images.githubusercontent.com/1215767/34348380-93e77ae8-ea4d-11e7-8696-9a989ddbbbf5.png" alt="Edge" width="16px" height="16px" /> Edge | <img src="https://user-images.githubusercontent.com/1215767/34348590-250b3ca2-ea4f-11e7-9efb-da953359321f.png" alt="IE" width="16px" height="16px" /> Internet Explorer |
| :---------: | :---------: | :---------: | :---------: | :---------: |
| Yes | Yes | Yes | Yes | No |

## Requirements

- `Node.js`: 12.16.x and 14.11.x (may work with other versions but without any guarantee)
- `Supported OS`: Windows/Linux/MacOs (see the Github Build workflow for more details)

## 🎨 Features

`bpmn-visualization` is in early development stages and is subject to changes prior to the `1.0.0` release.\
\
Implemented features:
- Rendering of the most common BPMN elements.  
Notice that there is currently no plan to support `Conversation` and `Choreography`.

Current implementation:
- The [packaging](https://github.com/process-analytics/bpmn-visualization-js/milestone/18) of the library.

Future features:
- BPMN extensions
- The library extension points
- Display options for execution data with interactive capacities.

## Usage
For now, we don't put the released library on npm. So you need to clone the repository in local, get the last tag, and build it.

```
<!DOCTYPE html>
<html lang="en">
<body>
    <div class="info-centered"><p>(either drop a file here)</p></div>
    <div id="graph"></div>

    <!-- load global settings -->
    <script src="./static/js/configureMxGraphGlobals.js"></script>
    <!-- load mxGraph client library -->
    <script src="./static/js/mxClient.min.js"></script>
    <!-- load BPMN Visualiztion library -->
    <script type="module">
      console.log(`Initializing BpmnVisualization with container '${container}'...`);
      bpmnVisualization = new BpmnVisualization(window.document.getElementById(container));  
    
bpmnFile

      console.log('Loading bpmn....');
      bpmnVisualization.load(bpmnFile);
      console.log('BPMN loaded');
    
      console.log('Fitting....');
      bpmnVisualization.graph.fit(0);
      console.log('Fit completed');
    </script>
</body>
</html>
```


## Demo and examples

### Demo

Give a try to the [__:fast_forward: demo live environment__][demo-live-environment].
The demo let you load a BPMN file to see how `bpmn-visualization` renders it. Various versions of the lib are available. 

If you need BPMN examples, you can use resources from 
- the [BPMN Model Interchange Working Group (BPMN MIWG)](http://www.omgwiki.org/bpmn-miwg)
  - https://github.com/bpmn-miwg/bpmn-miwg-test-suite
  - https://github.com/bpmn-miwg/bpmn-miwg-demos
- [bpmn-visualization BPMN test diagrams](https://github.com/process-analytics/bpmn-visualization-examples/blob/master/bpmn-files/README.md)

### 🐾 Examples

Want to know more about `bpmn-visualization` usage and extensibility? Have a look at the
[__:fast_forward: live examples site__](https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/examples/index.html).

For more technical details and how-to, go to the [bpmn-visualization-examples](https://github.com/process-analytics/bpmn-visualization-examples/)
repository.


## 🔧 Development

To contribute to `bpmn-visualization`, fork and clone this repository locally and commit your code on a separate branch. \
Please write tests for your code before opening a pull-request:

```sh
npm run test  # run all unit & e2e tests
```

You can find more detail in our [Contributing guide](CONTRIBUTING.md). Participation in this open source project is subject to a [Code of Conduct](CODE_OF_CONDUCT.md).

:sparkles: A BIG thanks to all our contributors :slightly_smiling_face:


## 📃 License

`bpmn-visualization` is released under the [Apache 2.0](LICENSE) license. \
Copyright &copy; 2020, Bonitasoft S.A.

Some BPMN icons used by `bpmn-visualization` are derived from existing projects. See the [BPMN Support page](docs/bpmn-support.adoc)
for more details:
- [draw.io](https://github.com/jgraph/drawio) (Apache-2.0)
- [flaticon](https://www.flaticon.com) ([freepikcompany license](https://www.freepikcompany.com/legal#nav-flaticon))
- [noun project](https://thenounproject.com/) (mainly Creative Commons CCBY 3.0)


## Powered by

[![statically.io logo](https://statically.io/icons/icon-96x96.png "statically.io")](https://statically.io)

**[statically.io](https://statically.io)** (<kbd>demo</kbd> and <kbd>examples</kbd> live environments)


[demo-live-environment]: https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/demo/index.html
