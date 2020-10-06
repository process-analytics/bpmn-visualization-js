<h1 align="center">BPMN Visualization</h1>
<div align="center">
    <p align="center"> <img title="BPMN Visualization" src="docs/images/diagram-hacktoberfest-example.png"></p>
    <p align="center"> 
        <a href="https://npmjs.org/package/bpmn-visualization">
          <img alt="npm package" src="https://img.shields.io/npm/v/bpmn-visualization.svg?color=orange"> 
        </a> 
        <a href="https://github.com/process-analytics/bpmn-visualization-js/releases">
          <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/process-analytics/bpmn-visualization-js?color=orange&include_prereleases"> 
        </a> 
        <a href="https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/demo/index.html">
          <img alt="Live Demo" src="https://img.shields.io/badge/demo-online-blueviolet.svg"> 
        </a> 
        <a href="https://github.com/process-analytics/bpmn-visualization-js/actions">
        <img alt="Build" src="https://github.com/process-analytics/bpmn-visualization-js/workflows/Build/badge.svg"> 
        </a> 
        <a href="https://gitpod.io/#https://github.com/process-analytics/bpmn-visualization-js" target="_blank">
        <img alt="Gitpod" src="https://img.shields.io/badge/Gitpod-ready--to--code-chartreuse?logo=gitpod"> 
        </a> 
        <br>
        <a href="CONTRIBUTING.md">
        <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square"> 
        </a> 
        <a href="CODE_OF_CONDUCT.md">
        <img alt="Contributor Covenant" src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg"> 
        </a> 
        <a href="LICENSE">
        <img alt="License" src="https://img.shields.io/github/license/process-analytics/bpmn-visualization-js?color=blue"> 
        </a>
    </p>
</div>  
<br>

`bpmn-visualization` is a TypeScript library to visualize process execution data on [BPMN](https://www.omg.org/spec/BPMN/2.0.2/) diagrams with:
- additional display options for execution data (highlight some transitions, counters, and more)
- interactive capacities (mouse hover, click)

<br>


## 🎮 Demo

Give a try to the [__⏩ demo live environment__][demo-live-environment].
The demo let you load a BPMN file to see how `bpmn-visualization` renders it. Various versions of the lib are available. 

If you need BPMN examples, you can use resources from 
- the [BPMN Model Interchange Working Group (BPMN MIWG)](http://www.omgwiki.org/bpmn-miwg)
  - https://github.com/bpmn-miwg/bpmn-miwg-test-suite
  - https://github.com/bpmn-miwg/bpmn-miwg-demos
- [bpmn-visualization BPMN test diagrams](https://github.com/process-analytics/bpmn-visualization-examples/blob/master/bpmn-files/README.md)


## 🌏 Browser Support

| <img src="https://www.google.com/chrome/static/images/chrome-logo.svg" alt="Chrome" width="18px" height="18px" /> Chrome | <img src="https://user-media-prod-cdn.itsre-sumo.mozilla.net/uploads/products/2020-04-14-08-36-13-8dda6f.png" alt="Firefox" width="18px" height="18px" /> Firefox | <img src="https://developer.apple.com/assets/elements/icons/safari/safari-96x96.png" alt="Safari" width="18px" height="18px" /> Safari | <img src="https://avatars0.githubusercontent.com/u/11354582?s=200&v=4" alt="Edge" width="18px" height="18px" /> Edge |
| :---------: | :---------: | :---------: | :---------: |
|  ✔️ |  ✔️ |  ✔️ |  ✔️ |

**Note**: Internet Explorer will never be supported. \
The library may work with the other browsers. They must at least support ES6.

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


## ♻️ Usage
For now, we don't put the released library on npm. So you need to clone the repository in local, get the last tag, and build it. \
⚠️ WE ARE CURRENTLY WORKING ON THE PACKAGING ⚠️

* Load necessary scripts 
```html
    <!-- load global settings -->
    <script src="./static/js/configureMxGraphGlobals.js"></script>
    <!-- load mxGraph client library -->
    <script src="./static/js/mxClient.min.js"></script>
    <!-- load BPMN Visualization library -->
    <script src="<YOUR_PATH>/bpmn-visualization-js/dist/index.es.js"></script>
```
* Define your BPMN content using one of the following ways:
  * Copy/Paste directly the XML content in a variable
  * Load it from a url, like this [example](https://github.com/process-analytics/bpmn-visualization-examples/blob/master/examples/load-remote-bpmn-diagrams/index.html)
  * Load from your computer, like the [demo example](https://github.com/process-analytics/bpmn-visualization-js/blob/master/src/demo/index.ts)
```javascript
    const bpmnContent = ``; // your BPMN 2.0 XML content
```
* Define the mxGraph container
```html
    <div id="graph"></div>
```
* Initialize BpmnVisualization from the container
```javascript
    console.log(`Initializing BpmnVisualization with container '${container}'...`);
    const bpmnVisualization = new BpmnVisualization(window.document.getElementById(container));  
```
* Load the bpmn content from BpmnVisualization
```javascript
    console.log('Loading bpmn....');
    bpmnVisualization.load(bpmnContent);
    console.log('BPMN loaded');
```

💡 Want to know more about `bpmn-visualization` usage and extensibility? Have a look at the
[__⏩ live examples site__](https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/examples/index.html).

For more technical details and how-to, go to the [bpmn-visualization-examples](https://github.com/process-analytics/bpmn-visualization-examples/)
repository.

## 🔧 Contributing

To contribute to `bpmn-visualization`, fork and clone this repository locally and commit your code on a separate branch. \
Please write tests for your code before opening a pull-request:

```sh
npm run test  # run all unit & e2e tests
```

You can find more detail in our [Contributing guide](CONTRIBUTING.md). Participation in this open source project is subject to a [Code of Conduct](CODE_OF_CONDUCT.md).

✨ A BIG thanks to all our contributors 🙂


## 📃 License

`bpmn-visualization` is released under the [Apache 2.0](LICENSE) license. \
Copyright &copy; 2020, Bonitasoft S.A.

Some BPMN icons used by `bpmn-visualization` are derived from existing projects. See the [BPMN Support page](docs/bpmn-support.adoc)
for more details:
- [draw.io](https://github.com/jgraph/drawio) (Apache-2.0)
- [flaticon](https://www.flaticon.com) ([freepikcompany license](https://www.freepikcompany.com/legal#nav-flaticon))
- [noun project](https://thenounproject.com/) (mainly Creative Commons CCBY 3.0)


## ⚡ Powered by

[![statically.io logo](https://statically.io/icons/icon-96x96.png "statically.io")](https://statically.io)

**[statically.io](https://statically.io)** (<kbd>demo</kbd> and <kbd>examples</kbd> live environments)


[demo-live-environment]: https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/demo/index.html
