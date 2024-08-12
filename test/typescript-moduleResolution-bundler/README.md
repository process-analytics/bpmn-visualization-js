# Validate bpmn-visualization when `moduleResolution` is set to `bundler`

Relates to [missing types configuration in the package.json "exports" field](https://github.com/process-analytics/bpmn-visualization-js/pull/2972).

## Setup

The `bpmn-visualization` npm package must be built first:

From the repository root, run:
- `npm install`
- `npm pack`


## Run

From the folder of this test project, run:
- `npm install`
- `npm test`
