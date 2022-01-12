# Testing

We use [jest](https://jestjs.io) as test framework, and for mocks, expectations, coverage, ...

We advise you to use [TDD](https://fr.wikipedia.org/wiki/Test_Driven_Development) or at least a Test First approach to reduce unnecessary code, improve code design and ensure good
coverage.

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
- They may be hard to apply to mxgraph integration code especially when interacting with the mxGraph API (prefer integration or at last end-to-end tests in that case)
- To facilitate _json to model_ tests there is a CLI tool to generate json and/or internal model from bpmn file - please refer to [CLI parseBpmn](../../scripts/utils/README.md)
- You can have a look at the existing tests for inspiration, the good example would be: [BpmnJsonParser.sequenceFlow](../../test/unit/component/parser/json/BpmnJsonParser.sequenceFlow.normal.test.ts)


### Integration tests

We have the following types of integration tests, to check the integration with `mxGraph`:
- model: check if the library fills the `mxGraph` model with BPMN elements. The model must contain the related vertices and
  edges, with right coordinates, dimensions and style.
- dom: `JSDOM` based, no browser, check SVG elements are created or updated accordingly. They are used for both non regression
(`mxGraph` integration) and DOM additions for custom behaviors.

Tests change frequency:
- The `dom` tests are very rarely changed, as they are testing the `mxGraph` integration at very high level.
- The model tests must be updated each time the library supports a new BPMN element.


### End-to-end tests

We use the [playwright library](https://playwright.dev/) with the [jest-playwright integration](https://github.com/playwright-community/jest-playwright) to handle
tests requiring a web browser. See the paragraph dedicated to [web browsers](#web-browsers) for more details.

We have the following types of end-to-end tests:
- `generated svg`:
  - They ensure that SVG elements are present in the DOM of pages running in a Web Browser. They mainly check `mxGraph`
    non regression, they verify that the `mxGraph` integration correctly generates correct SVG nodes/elements.
  - They are very close to the 'DOM' integration tests except that we check the DOM in the browser here instead of with
    JSDOM in integration tests.
- visual testing (see below). In visual tests, we are focussing on the actual rendering, what the user sees. We don't care
if the Diagram is rendered with SVG, HTML Canvas or something else.

Tests change frequency:
- `generated svg` tests are very rarely changed, as they are testing the `mxGraph` integration at very high level.
- The `visual tests` are updated each time the library supports a new BPMN element or when introducing the final BPMN element rendering.


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
- diagram navigation non regression tests: consistency on how diagram looks after panning
- custom behavior tests: check overlays, .... rendering
- detect mxgraph behavior changes (see [mxGraph version bump](./mxgraph-version-bump.md)) or unexpected changes introduced by refactoring in
the rendering code of the lib
- see [issue 526]( https://github.com/process-analytics/bpmn-visualization-js/issues/526) for more context


#### Details

We use [jest-image-snapshot](https://www.npmjs.com/package/jest-image-snapshot) for the test snapshot comparison.

The following details are based on the [POC done to introduce visual tests](https://github.com/process-analytics/bpmn-visualization-js/pull/523#issuecomment-674049031).

#### General guidelines

##### When and how to add tests

You should add visual tests when:

* You aim supporting a new BPMN elements or when the rendering of the BPMN elements change (existing
tests are supposed to fail in that case).
<br/><br/>
`bpmn.rendering.test.ts` drives all visual tests for this part. A visual test only requires a BPMN diagram as input, stored in the
`test/fixtures/bpmn/non-regression` folder. It is automatically considered and use as test input.
<br/><br/>
* You have added an interface for handling custom behaviors that manipulates the visible diagram.
<br/><br/>
`diagram.navigation.zoom.pan.test.ts` drives all visual tests for that part. A visual test only requires a BPMN diagram as input.
* You have changed the fit mechanism.
<br/><br/>
`diagram.navigation.fit.test.ts` drives all visual tests for that part. A visual test requires a BPMN diagram and FitOptions as an input. Different Fit options are tested here.
* You have added changes in overlays: i.e. positioning, shapes, styling.
<br/><br/>
`overlays.rendering.test.ts` drives all visual tests for that part. A visual test only requires a BPMN diagram as input.

You should add DOM tests when:
* You have changed the way the BPMN elements are displayed: i.e. the associated css classes, shapes, nodes order.
  <br/><br/>
  `generated.svg.test.ts` drives tests for that part. A test only requires a BPMN diagram as input. The DOM hierarchy is verified here as well as the nodes types and their attributes.

In both cases the reference images have to be stored in the `test/e2e/__image_snapshots__` folder.

##### Tips

##### Test scope

As for any tests, keep visual tests small and focussed, first think about the use case you want to test and then create
the BPMN diagram accordingly.

This means that the input BPMN diagram should contain few different elements contain few elements and only elements
related to the tested scenario.
Otherwise, changes in non-related elements would break the test whereas it has no relation with the changes.

This particularly applies to BPMN elements with icons and markers which are more subject to changes

For instance, don't add 
- message event in the diagram if the scenario under test is task rendering
- activity markers when testing the task rendering in a lane 

##### Labels

Avoid labels and create dedicated tests for labels.

Labels involve font rendering and depending on the OS, the display result differs. 

Label tests require to configure an [image diff threshold](#image-diff-threshold), so for simplicity, keep them in dedicated
BPMN diagram.


#### Special configuration

All configurations described here can be done in `bpmn.rendering.test.ts`.


<a name="image-diff-threshold"></a>
##### Image diff threshold

The ideal scenario generates SVG that does not involve font: SVG is supposed to be rendered in the same way on all OS, so
in that case, the actual rendering exactly matches the reference image.

As font rendering differs depending on the OS, BPMN diagram containing label won't be rendered exactly as the reference
image on all OS. In that case, a diff threshold image must be configured: the test will fail if the diff is above the
threshold.

To be able to detect most of the unwanted changes, this threshold must be set as small as possible but large enough to
manage small variations and not produce false positive errors.

The threshold can be configured by test and by os, we generally find the threshold by
- making the GitHub build workflow fails to get the detected diff
- then using a threshold just above the value detected during the failing test   


##### Loading BPMN diagrams

The diagrams used by tests are located in the `test/fixtures/bpmn` folder and sub-folders. In practice, the pages used
by tests are in charge of loading the BPMN diagrams.

To load a diagram, just pass a relative path to the diagram as query parameter. The page is able to fetch the diagram content
as the diagrams are served by the dev server.
Convenient methods exist to only pass the name of the diagram without having to manage the folder tree to the file.

If you add a new sub-folder of BPMN files and want the test pages to be able to fetch them, you need to update test configuration
in `test/e2e/config/copy.bpmn.diagram.ts`.


### Performance tests
For now these tests are defined under `/test/performance/` as the performance is being measured for complex (end-to-end) tasks:
- display diagram
- zoom in / zoom out loaded diagram

#### Why?
To have visibility if new changes have impact on current performance.

#### Run the performance tests
For the moment we have decided to run them only manually, in the future they may be run automatically - this however, depends on received results.
How to run? Check the next [section](#Running tests).

#### Results
The results are under `/test/performance/data/`. \
Preview is available in the browser, simply open file `/bpmn-visu-js/test/performance/index.html` in your favourite browser.


### Bundles tests

They ensure that the bundles provided in the npm package are working, and they are defined under `/test/bundles/`.


## Running tests 

See `package.json` for extra available scripts
- `npm run test`                        *Run all tests*
- `npm run test:unit`                   *Run unit tests*
- `npm run test:unit:coverage`          *Run unit tests with coverage*
- `npm run test:e2e`                    *Run end-to-end tests*.
- `npm run test:e2e:coverage`           *Run end-to-end tests with coverage*
- `npm run test:e2e:verbose`            *Run end-to-end tests with debug logs*
- `npm run test:integration`            *Run integration tests*.
- `npm run test:integration:coverage`   *Run integration tests with coverage*
- `npm run test:perf`                   *Run performance tests*
- `npm run test:perf:verbose`           *Run performance tests with debug logs*
- `npm run test:bundles`                *Run bundles tests*
- `npm run test:bundles:verbose`        *Run bundles tests with debug logs*

### Test reports

Html reports are generated for test execution and coverage in
- `build/test-report/unit` for unit tests
- `build/test-report/integration` for integration tests
- `build/test-report/e2e` for end-to-end tests


<a name="web-browsers"></a>
### Web Browser choice for end-to-end and bundle tests

Web browsers are installed by `playwright` when running `npm install`. For more details about browsers management, see the [Playwright documentation](https://playwright.dev/docs/browsers#installing-browsers).

By default, 
- end-to-end tests use Chromium.
- bundle tests use both Chromium, Firefox and WebKit.

To use Firefox instead, use a `BROWSERS` environment variable:
- on Linux or macOS
```bash
BROWSERS=firefox npm run test:e2e
```
- on Windows using `cmd` ⚠️ there is no space between `firefox` and `&&`
```batch
set BROWSERS=firefox&& npm run test:e2e
```

It is also possible to make tests use several browsers, pass the list of browsers separated by a comma when setting the
`BROWSERS` environment variable. For instance, on Linux or macOS:
```bash
BROWSERS=chromium,firefox
```

Chrome and Edge can also be used to run tests. Configure the `BROWSERS` environment variable with `chrome` or `msedge`
respectively. If you configure several browsers, only one is taken into account with first `chrome` then `msedge`.

### Debugging end-to-end, performance and bundle tests

To see what is happening in your local web browser used by the tests
- disable the `headless` mode by setting the `HEADLESS` environment variable to `false`
- set the `SLOWMO` environment variable to a positive millisecond value (between `200` and `500` should be enough). This
slows Playwright down by milliseconds that we specify. So we will be able to observe what it actually does.

For more debugging tools, see the [Playwright documentation](https://playwright.dev/docs/debug).

### Logs

Some extra logs are available and are generated by the [debug library](https://www.npmjs.com/package/debug).

They can be activated by setting the `DEBUG` environment variable with `DEBUG=bv:test:*`. They are configured by default when
running the npm script starting the end-to-end tests. Think about it when running tests in your IDE.

More fine-tuning:
- `bv:test:config`: test configuration logs
- `bv:test:browser`: browser console logs
