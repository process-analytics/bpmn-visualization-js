# Tips for `mxGraph` version bump

## Minimal check list

- check the mxGraph changelog to see what could impact the lib: https://github.com/jgraph/mxgraph2/blob/master/ChangeLog
- review issues list, in particular in the BPMN Rendering Improvements milestones which could be impacted or fixed by the version bump
- apply the version bump
- ensure we have enough visual tests to cover any regression or changes introduced
- perform manual testing using BPMN diagrams from `bpmn-visualization-examples` or `miwg-test-suite`


## Resources

- Examples of visual testing failures: [Pull Request #502](https://github.com/process-analytics/bpmn-visualization-js/pull/502)
- Attempt to Bump mxgraph from 4.1.0 to 4.1.1: [Pull Request #547](https://github.com/process-analytics/bpmn-visualization-js/pull/547#issuecomment-678959718)



