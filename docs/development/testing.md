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
- model: check the library fills the `mxGraph` model with BPMN elements. The model must contain the related vertices and
edges, with right coordinates, dimensions and style.
- dom: `JSDOM` based, no browser, check SVG nodes as in view tests
- view: ensure SVG elements are present on the web page (mainly non regression, to verify that the `mxGraph` integration uses SVG for rendering)
- visual testing (see below)

Tests change frequency:
- The `dom` and `view` tests are very rarely changed, as they are testing the `mxGraph` integration at very high level.
- The model tests must be updated each time the library supports a new BPMN element. 
- The visual tests are updated each time the library supports a new BPMN element or when introducing the final BPMN element rendering.


### Visual Testing

#### What is this?

Quote from [storybook.js](https://storybook.js.org/docs/react/workflows/visual-testing)
> Visual tests, also called visual regression tests, catch bugs in UI appearance.
> They work by taking screenshots of every story and comparing them commit-to-commit to identify changes.
>
> This is ideal for verifying what the user sees: layout, color, size, and contrast.


Quote from [cypress.io](https://docs.cypress.io/guides/tooling/visual-testing.html#Functional-vs-visual-testing)
> [These tests] take an image snapshot of the entire application under test or a specific element,
> and then compare the image to a previously approved baseline image.
>
> If the images are the same (within a set pixel tolerance), it is determined that the web application looks the same
> to the user. If there are differences, then there has been some change to the DOM layout, fonts, colors or other visual
> properties that needs to be investigated.


#### Goals for `bpmn-visualization`

- tests the BPMN Diagram visual rendering 
- visual non regression tests: keep consistent rendering across versions
- useful to detect mxgraph behaviour changes (see [mxGraph version bump](./mxgraph-version-bump.md)) or unexpected changes introduced by refactoring in
the rendering code of the lib
- see [issue 526]( https://github.com/process-analytics/bpmn-visualization-js/issues/526) for more context


#### Details

We use [jest-image-snapshot](https://www.npmjs.com/package/jest-image-snapshot) for the test snapshot comparison.

The following details are based on the [POC done to introduce visual tests](https://github.com/process-analytics/bpmn-visualization-js/pull/523#issuecomment-674049031).

TODO
`bpmn.rendering.test.ts` drives all visual tests


#### Tips for visual testing

**TODO guide lines**

    when and how to add tests
    avoid labels in tests, avoid markers and icons on BPMN elements when not related to the test (more subject to changes, so tests will break whereas they are not testing this feature)
    how and when to configure diff image threshold (some explanations are present in the code, but is this enough?)
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

