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


## 🎮 Demo

Give a try to the [__:fast_forward: demo live environment__][demo-live-environment].
The demo let you load a BPMN file to see how `bpmn-visualization` renders it. Various versions of the lib are available. 

If you need BPMN examples, you can use resources from 
- the [BPMN Model Interchange Working Group (BPMN MIWG)](http://www.omgwiki.org/bpmn-miwg)
  - https://github.com/bpmn-miwg/bpmn-miwg-test-suite
  - https://github.com/bpmn-miwg/bpmn-miwg-demos
- [bpmn-visualization BPMN test diagrams](https://github.com/process-analytics/bpmn-visualization-examples/blob/master/bpmn-files/README.md)


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


## 📋 Requirements

- `Node.js`: 12.16.x and 14.11.x (may work with other versions but without any guarantee)
- `Supported OS`: Windows/Linux/MacOs (see the Github Build workflow for more details)


## ♻️ Usage
For now, we don't put the released library on npm. So you need to clone the repository in local, get the last tag, and build it.

* Load necessary scripts 
```
    <!-- load global settings -->
    <script src="./static/js/configureMxGraphGlobals.js"></script>
    <!-- load mxGraph client library -->
    <script src="./static/js/mxClient.min.js"></script>
    <!-- load BPMN Visualiztion library -->
    <script src="../../demo/0.3.0/index.es.js"></script>
```
* Define your bpmn content
```
    const bpmnContent = `<?xml version="1.0" encoding="UTF-8"?>
                         <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                           xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                           xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                           xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                           xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                           id="Definitions_12nbmjq" 
                           targetNamespace="http://example.bpmn.com/schema/bpmn" 
                           exporter="bpmn-js (https://demo.bpmn.io)" 
                           exporterVersion="7.2.0">

                           <bpmn:collaboration id="Collaboration_1cajy2f">
                             <bpmn:participant id="Participant_0zyusbn" name="Pool" processRef="Process_1duwsyj" />
                           </bpmn:collaboration>

                           <bpmn:process id="Process_1duwsyj" isExecutable="false">
                             <bpmn:startEvent id="StartEvent_05jmofc" name="Start">
                               <bpmn:outgoing>Flow_1bic2fy</bpmn:outgoing>
                             </bpmn:startEvent>
                             <bpmn:endEvent id="Event_1o095l8" name="End">
                               <bpmn:incoming>Flow_12gqqr8</bpmn:incoming>
                             </bpmn:endEvent>
                             <bpmn:userTask id="Activity_13y9ou5" name="User Task 2">
                               <bpmn:incoming>Flow_1bic2fy</bpmn:incoming>
                               <bpmn:outgoing>Flow_12gqqr8</bpmn:outgoing>
                             </bpmn:userTask>
                             <bpmn:sequenceFlow id="Flow_1bic2fy" sourceRef="StartEvent_05jmofc" targetRef="Activity_13y9ou5" />
                             <bpmn:sequenceFlow id="Flow_12gqqr8" sourceRef="Activity_13y9ou5" targetRef="Event_1o095l8" />
                           </bpmn:process>

                           <bpmndi:BPMNDiagram id="BPMNDiagram_1">
                             <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1cajy2f">
                               <bpmndi:BPMNShape id="Participant_0zyusbn_di" bpmnElement="Participant_0zyusbn" isHorizontal="true">
                                 <dc:Bounds x="152" y="39" width="760" height="121" />
                               </bpmndi:BPMNShape>
                               <bpmndi:BPMNEdge id="Flow_12gqqr8_di" bpmnElement="Flow_12gqqr8">
                                 <di:waypoint x="590" y="99" />
                                 <di:waypoint x="852" y="99" />
                               </bpmndi:BPMNEdge>
                               <bpmndi:BPMNEdge id="Flow_1bic2fy_di" bpmnElement="Flow_1bic2fy">
                                 <di:waypoint x="242" y="99" />
                                 <di:waypoint x="490" y="99" />
                               </bpmndi:BPMNEdge>
                               <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_05jmofc">
                                 <dc:Bounds x="206" y="81" width="36" height="36" />
                                 <bpmndi:BPMNLabel>
                                   <dc:Bounds x="210" y="124" width="28" height="14" />
                                 </bpmndi:BPMNLabel>
                               </bpmndi:BPMNShape>
                               <bpmndi:BPMNShape id="Event_1o095l8_di" bpmnElement="Event_1o095l8">
                                 <dc:Bounds x="852" y="81" width="36" height="36" />
                                 <bpmndi:BPMNLabel>
                                   <dc:Bounds x="864" y="124" width="12" height="14" />
                                 </bpmndi:BPMNLabel>
                               </bpmndi:BPMNShape>
                               <bpmndi:BPMNShape id="Activity_0jp7sxr_di" bpmnElement="Activity_13y9ou5">
                                 <dc:Bounds x="490" y="59" width="100" height="80" />
                               </bpmndi:BPMNShape>
                             </bpmndi:BPMNPlane>
                           </bpmndi:BPMNDiagram>

                         </bpmn:definitions>`;
```
* Define the mxGraph container
```
    <div id="graph"></div>
```
* Initialize BpmnVisualization from the container
```
    console.log(`Initializing BpmnVisualization with container '${container}'...`);
    const bpmnVisualization = new BpmnVisualization(window.document.getElementById(container));  
```
* Load the bpmn content from BpmnVisualization
```
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
