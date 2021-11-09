<h1 align="center">BPMN Visualization</h1>
<div align="center">
    <p align="center"> <img title="BPMN Visualization" src="docs/users/images/custom-behavior-path-highlighting.gif" alt="BPMN Visualization example"></p>
    <p align="center"> 
        <a href="https://npmjs.org/package/bpmn-visualization">
          <img alt="npm package" src="https://img.shields.io/npm/v/bpmn-visualization.svg?color=orange"> 
        </a> 
        <a href="https://github.com/process-analytics/bpmn-visualization-js/releases">
          <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/process-analytics/bpmn-visualization-js?label=changelog&include_prereleases"> 
        </a> 
        <a href="https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/examples/index.html">
          <img alt="Live Demo" src="https://img.shields.io/badge/demo-online-blueviolet.svg"> 
        </a> 
        <a href="https://github.com/process-analytics/bpmn-visualization-js/actions">
          <img alt="Build" src="https://github.com/process-analytics/bpmn-visualization-js/workflows/Build/badge.svg"> 
        </a> 
        <a href="https://sonarcloud.io/dashboard?id=process-analytics_bpmn-visualization-js">
          <img alt="Coverage" src="https://sonarcloud.io/api/project_badges/measure?project=process-analytics_bpmn-visualization-js&metric=coverage"
               title="The code coverage is underestimated. It doesn't count the code that is only tested through HTML page.">
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

`bpmn-visualization` is a TypeScript library for visualizing process execution data on [BPMN](https://www.omg.org/spec/BPMN/2.0.2/) diagrams with:
- additional display options for execution data (highlight some transitions, counters, and more)
- interactive capacities (mouse hover, click)

<br>


## 🎮 Demo and examples 

Please check the [__⏩ live environment__](https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/examples/index.html). \
You will find there basic usage as well as detailed examples showing possible rendering customizations.

## 🎨 Features

The `bpmn-visualization` is in early development stage and is subject to change prior to the `1.0.0` release.\
\
Already available features:
- [Supported BPMN Elements](https://process-analytics.github.io/bpmn-visualization-js/#supported-bpmn-elements).
- [Navigate through the BPMN diagram](https://process-analytics.github.io/bpmn-visualization-js/#diagram-navigation)
- [Display options for execution data with interactive capacities](https://process-analytics.github.io/bpmn-visualization-js/#process_data)

Planned features:
- Library extension points

## 🌏 Browsers Support

**We do our best to support recent versions of major browsers**

| <img src="https://www.google.com/chrome/static/images/chrome-logo.svg" alt="Chrome" width="18px" height="18px" /> Chrome | <img src="https://user-media-prod-cdn.itsre-sumo.mozilla.net/uploads/products/2020-04-14-08-36-13-8dda6f.png" alt="Firefox" width="18px" height="18px" /> Firefox | <img src="https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg" alt="Safari" width="18px" height="18px" /> Safari | <img src="https://avatars0.githubusercontent.com/u/11354582?s=200&v=4" alt="Edge" width="18px" height="18px" /> Edge |
| :---------: | :---------: | :---------: | :---------: |
|  ✔️ |  ✔️ |  ✔️ |  ✔️ |

**Notes**:
- Internet Explorer and Legacy Edge will never be supported.
- Chromium based browsers should work (automatic tests are run with Chromium canary releases). In particular, the following
browsers are known working with `bpmn-visualization@0.13.0`:
  - Brave 1.22.70
  - Chromium 89.0.4389.114 
  - Opera 75.0.3969.93
- The library may work with the other browsers. They must at least support ES6.


## ♻️ Usage
The library is available from [NPM](https://npmjs.org/package/bpmn-visualization). \
We support various module formats such as:
- [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE): `dist/bpmn-visualization.js`
- [ESM](https://dev.to/iggredible/what-the-heck-are-cjs-amd-umd-and-esm-ikm): `dist/bpmn-visualization.esm.js`
- [CommonJS](https://www.typescriptlang.org/docs/handbook/2/modules.html#commonjs): `dist/bpmn-visualization.cjs.js`
  

### 📌 Project usage

* Install the dependency in your **package.json** file:
```shell script
npm i bpmn-visualization
```

```javascript
import { BpmnVisualization } from 'bpmn-visualization';

let bpmnContent; // your BPMN 2.0 XML content
// initialize BpmnVisualization and load the diagram
// 'bpmn-container' is the id of the HTMLElement that renders the BPMN Diagram
const bpmnVisualization = new BpmnVisualization({ container: 'bpmn-container' });
bpmnVisualization.load(bpmnContent);
```

You can set the BPMN content using one of the following ways:
  * Copy/Paste directly the XML content in a variable
  * Load it from an url, like this [example](https://github.com/process-analytics/bpmn-visualization-examples/blob/master/examples/display-bpmn-diagram/load-remote-bpmn-diagrams/index.html)
  * Load from your computer, like the [demo example](https://github.com/process-analytics/bpmn-visualization-examples/tree/master/examples/display-bpmn-diagram/load-local-bpmn-diagrams/index.html)


### 💠 Browser usage

* In the HTML page:
   * Load `bpmn-visualization` (replace `{version}` by the recent version)
   * Define the container that displays the BPMN diagram, here _bpmn-container_
```html
    <script src="https://cdn.jsdelivr.net/npm/bpmn-visualization@{version}/dist/bpmn-visualization.min.js"></script>
    ...
    <div id="bpmn-container"></div>
```
* Put this Javascript snippet within the HTML page
```javascript
    let bpmnContent; // your BPMN 2.0 XML content, see tips below
    // initialize BpmnVisualization and load the diagram
    const bpmnVisualization = new bpmnvisu.BpmnVisualization({ container: 'bpmn-container'});
    bpmnVisualization.load(bpmnContent);
```

### 👤 User documentation
The User documentation (with the feature list & the public API) is available in the [documentation site](https://process-analytics.github.io/bpmn-visualization-js/).

### ⚒️ More

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
Copyright &copy; from 2020, Bonitasoft S.A.

Some BPMN icons used by `bpmn-visualization` are derived from existing projects. See the [BPMN Support page](docs/users/bpmn-support.adoc)
for more details:
- [draw.io](https://github.com/jgraph/drawio) (Apache-2.0)
- [flaticon](https://www.flaticon.com) ([freepikcompany license](https://www.freepikcompany.com/legal#nav-flaticon))
- [noun project](https://thenounproject.com/) (mainly Creative Commons CCBY 3.0)


## ⚡ Powered by

[![statically.io logo](https://statically.io/icons/icon-96x96.png "statically.io")](https://statically.io)

**[statically.io](https://statically.io)** (<kbd>demo</kbd> and <kbd>examples</kbd> live environments)

<img src="https://surge.sh/images/logos/svg/surge-logo.svg" alt="surge.sh logo" title="surge.sh" width="110"/>

**[surge.sh](https://surge.sh)** (<kbd>demo</kbd> and <kbd>documentation</kbd> preview environments)


[demo-live-environment]: https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/demo/index.html
