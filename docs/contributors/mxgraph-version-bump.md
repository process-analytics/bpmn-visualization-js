# Tips for `mxGraph` version bump

## Minimal check list

- check the [mxGraph changelog](https://github.com/jgraph/mxgraph/blob/master/ChangeLog) to see what could impact the lib
- review issues list, in particular in the [BPMN Rendering Improvements milestone](https://github.com/process-analytics/bpmn-visualization-js/milestone/14) which could be impacted or fixed by the version bump
- apply the version bump
- review the overridden mxgraph code, generally, we redefine prototype, so search for the `prototype` string   
- ensure we have enough visual tests to cover any regression or changes introduced
- run the [performance tests](./testing.md#performance-tests) on all OS, ensure we don't see any performance regressions and save the results


### Manual tests

In addition to e2e tests, it is safer to perform manual testing using BPMN diagrams from `bpmn-visualization-examples` or `miwg-test-suite`.

`bpmn-visualization-examples` provides usage examples that can be used for such tests
  - diagram load and navigation
  - custom behavior and css styling

In the `bpmn-visualization` repository, test pages are also available (some are not used by e2e tests).


## Resources

- Examples of visual testing failures: [Pull Request #502](https://github.com/process-analytics/bpmn-visualization-js/pull/502)
- Attempt to Bump mxgraph from 4.1.0 to 4.1.1: [Pull Request #547](https://github.com/process-analytics/bpmn-visualization-js/pull/547#issuecomment-678959718)



