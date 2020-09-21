<h1 align="center">BPMN Visualization</h1> <br>
<p align="center">
   <img title="BPMN Visualization" src="docs/diagram-example.png" width="812" height="170">
</p>

[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/process-analytics/bpmn-visualization-js?color=orange&include_prereleases)](https://github.com/process-analytics/bpmn-visualization-js/releases)
[![Live Demo](https://img.shields.io/badge/demo-online-blueviolet.svg)][demo-live-environment]
[![Build](https://github.com/process-analytics/bpmn-visualization-js/workflows/Build/badge.svg)](https://github.com/process-analytics/bpmn-visualization-js/actions)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square)](CONTRIBUTING.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![License](https://img.shields.io/github/license/process-analytics/bpmn-visualization-js?color=blue)](LICENSE)

`bpmn-visualization` is a TypeScript library to visualize process execution data on [BPMN](https://www.omg.org/spec/BPMN/2.0.2/)
diagrams with:
- additional display options for execution data (highlight some transitions, counters, and more)
- interactive capacities (mouse hover, click)


## 🎮 Demo

Give a try to the [__:fast_forward: demo live environment__][demo-live-environment].
The demo let you load a BPMN file to see how `bpmn-visualization` renders it. Various versions of the lib are available. 

If you need BPMN examples, you can use resources from 
- the [BPMN Model Interchange Working Group (BPMN MIWG)](http://www.omgwiki.org/bpmn-miwg)
  - https://github.com/bpmn-miwg/bpmn-miwg-test-suite
  - https://github.com/bpmn-miwg/bpmn-miwg-demos
- [bpmn-visualization BPMN test diagrams](https://github.com/process-analytics/bpmn-visualization-examples/blob/master/bpmn-files/README.md)


## 🌏 Browser Support

| <img src="https://www.google.com/chrome/static/images/chrome-logo.svg" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://user-media-prod-cdn.itsre-sumo.mozilla.net/uploads/products/2020-04-14-08-36-13-8dda6f.png" alt="Firefox" width="16px" height="16px" /> Firefox | <img src="https://developer.apple.com/assets/elements/icons/safari/safari-96x96.png" alt="Safari" width="16px" height="16px" /> Safari | <img src="https://avatars0.githubusercontent.com/u/11354582?s=200&v=4" alt="Edge" width="16px" height="16px" /> Edge |
| :---------: | :---------: | :---------: | :---------: |
| Yes | Yes | Yes | Yes |

**Note**: Internet Explorer won't never be supported. \
The library may work with the other browsers, currently not list, if they support ES6.

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
For now, we don't put the released library on npm. So you need to clone the repository in local, get the last tag, and build it.

* Load necessary scripts 
```javascript
    <!-- load global settings -->
    <script src="./static/js/configureMxGraphGlobals.js"></script>
    <!-- load mxGraph client library -->
    <script src="./static/js/mxClient.min.js"></script>
    <!-- load BPMN Visualiztion library -->
    <script src="../../demo/0.3.0/index.es.js"></script>
```
* Define your bpmn content
```javascript
    const bpmnContent = 
        `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
            xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
            xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
            xmlns:di="http://www.omg.org/spec/DD/20100524/DI">

            <bpmn:collaboration id="collaboration_1">
                <bpmn:participant id="participant_1" name="Pool" processRef="process_1" />
            </bpmn:collaboration>

            <bpmn:process id="process_1" isExecutable="false">
                <bpmn:startEvent id="start_event_1" name="Start">
                    <bpmn:outgoing>flow_1</bpmn:outgoing>
                </bpmn:startEvent>
                <bpmn:endEvent id="end_event_1" name="End">
                    <bpmn:incoming>flow_2</bpmn:incoming>
                </bpmn:endEvent>
                <bpmn:userTask id="user_task_1" name="User Task">
                    <bpmn:incoming>flow_1</bpmn:incoming>
                    <bpmn:outgoing>flow_2</bpmn:outgoing>
                </bpmn:userTask>
                <bpmn:sequenceFlow id="flow_1" sourceRef="start_event_1" targetRef="user_task_1" />
                <bpmn:sequenceFlow id="flow_2" sourceRef="user_task_1" targetRef="end_event_1" />
            </bpmn:process>

            <bpmndi:BPMNDiagram id="BPMNDiagram_1">
                <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="collaboration_1">
                    <bpmndi:BPMNShape id="participant_1_di" bpmnElement="participant_1" isHorizontal="true">
                        <dc:Bounds x="152" y="39" width="760" height="121" />
                    </bpmndi:BPMNShape>
                    <bpmndi:BPMNEdge id="edge_flow_2" bpmnElement="flow_2">
                        <di:waypoint x="590" y="99" />
                        <di:waypoint x="852" y="99" />
                    </bpmndi:BPMNEdge>
                    <bpmndi:BPMNEdge id="edge_flow_1" bpmnElement="flow_1">
                        <di:waypoint x="242" y="99" />
                        <di:waypoint x="490" y="99" />
                    </bpmndi:BPMNEdge>
                    <bpmndi:BPMNShape id="shape_start_event_1" bpmnElement="start_event_1">
                        <dc:Bounds x="206" y="81" width="36" height="36" />
                        <bpmndi:BPMNLabel>
                            <dc:Bounds x="210" y="124" width="28" height="14" />
                        </bpmndi:BPMNLabel>
                    </bpmndi:BPMNShape>
                    <bpmndi:BPMNShape id="shape_end_event_1" bpmnElement="end_event_1">
                        <dc:Bounds x="852" y="81" width="36" height="36" />
                        <bpmndi:BPMNLabel>
                            <dc:Bounds x="864" y="124" width="12" height="14" />
                        </bpmndi:BPMNLabel>
                    </bpmndi:BPMNShape>
                        <bpmndi:BPMNShape id="shape_user_task_1" bpmnElement="user_task_1">
                        <dc:Bounds x="490" y="59" width="100" height="80" />
                    </bpmndi:BPMNShape>
                </bpmndi:BPMNPlane>
            </bpmndi:BPMNDiagram>
    
        </bpmn:definitions>`;
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
[__:fast_forward: live examples site__](https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/examples/index.html).

For more technical details and how-to, go to the [bpmn-visualization-examples](https://github.com/process-analytics/bpmn-visualization-examples/)
repository.

## 🔧 Contributing

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


## ⚡ Powered by

[![statically.io logo](https://statically.io/icons/icon-96x96.png "statically.io")](https://statically.io)

**[statically.io](https://statically.io)** (<kbd>demo</kbd> and <kbd>examples</kbd> live environments)


[demo-live-environment]: https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/master/demo/index.html
