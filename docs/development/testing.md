# Testing

We use [jest](https://jestjs.io) as test framework, and for mocks, expectations, coverage, ...

We advise you to use [TDD](https://fr.wikipedia.org/wiki/Test_Driven_Development) or at least a Test First approach to reduce unnecessary code, improve code design and ensure good
coverage 

## Test types 

Here are the tests we are using to develop the `bpmn-visualization` library.

### Unit tests

Used:
- mainly for parsing: xml to json, json to model
- string transformation/computation
- mxGraph
  - dynamic style
  - coordinates translation


Tips
- Try to always add such tests, they are fast, they cover a lot of use cases as they run at low level 
- They may be hard to apply to mxgraph integration code especially when interacting with the mxGraph API (prefer e2e tests in that case)


### End to end tests

We use the [puppeteer library](https://github.com/puppeteer/puppeteer/) with the [puppeteer jest integration](https://jestjs.io/docs/en/puppeteer) to handle
tests requiring a web browser (Chromium only for now).

We have the following types of end to end tests:
- model: check the library fills the `mxGraph` model with BPMN elements.
- dom: jsdom base, no browser, check svg nodes as in view tests
- view: ensure SVG elements are present on the web page (mainly non regression, to verify that the `mxGraph` integration uses SVG for rendering)
- visual testing (see below)

Tests change frequency:
- The `dom` and `view` tests are very rarely changed, as they are testing the `mxGraph` integration at very high level.
- The model tests must be updated each time the library supports a new BPMN element. 
- The visual tests are updated each time the library supports a new BPMN element or when introducing the final BPMN element rendering.



### Visual Testing

**TODO: choose a name for that kind of tests and use it everywhere**

- Add ref to resources about this kind of tests
- see also
 - bpmn how to
  - see also conclusion of the POC and elements for strategy for 'visual testing': https://github.com/process-analytics/bpmn-visualization-js/pull/523#issuecomment-674049031
  - see also information in https://github.com/process-analytics/bpmn-visualization-js/issues/526


Goals
- tests the visual rendering of the BPMN Diagram
- non regression tests
- useful to detect mxgraph behaviour changes (see [mxGraph version bump](./mxgraph-version-bump.md)) or unexpected changes introduced by refactoring in
the rendering code of the lib


#### Tips for visual testing

**TODO guide lines**

    when and how to add tests
    how and when to configure diff image threshold (some explanations are present in the code, but is this enough?)
    avoid labels in tests, avoid markers and icons on BPMN elements when not related to the test (more subject to changes, so tests will break whereas they are not testing this feature)
    load method: explain when choosing a dedicated method and how to configure
        default: pass content via url
    larger file: via fetch



## Running tests 

See `package.json` for extra available scripts
- `npm run test`                *Run all tests*
- `npm run test:unit`           *Run unit tests*
- `npm run test:unit:coverage`  *Run unit tests with coverage*
- `npm run test:e2e`            *Run end-to-end tests*.
- `npm run test:e2e:coverage`   *Run end-to-end tests with coverage*

### Debugging end-to-end tests

To see what is happening in the web browser used by the tests
- disable the `headless` mode by setting the `HEADLESS` environment variable to `false`
- set the `SLOWMO` environment variable to a positive millisecond value (between `200` and `500` should be enough). This
slows Puppeteer down by milliseconds that we specify. So we will be able to observe what it actually does.
- set the `DEBUG` environment variable with `DEBUG=test` to activate debug logs. This is activated by default when
running the npm task. Think about it when running tests in your IDE.

