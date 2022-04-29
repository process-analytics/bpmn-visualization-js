# The CLI tool to generate json and/or internal model from bpmn file
You should note that there is no need to copy the result from the console as it will be directly copied into system clipboard

## Building utils module

Run in the root of the project:

```npm run utils:build```

## Usage

Run in the root of the project to get BPMN content as:

-  JSON model

```node ./scripts/utils/dist/utils.mjs RELATIVE_PATH_TO_BPMN_FILE```

or (the default value for the `output` argument is `json`)

```node ./scripts/utils/dist/utils.mjs --output json RELATIVE_PATH_TO_BPMN_FILE```

- BpmnModel (internal model used by `bpmn-visualization`)

```node ./scripts/utils/dist/utils.mjs RELATIVE_PATH_TO_BPMN_FILE --output model```

i.e:

```node ./scripts/utils/dist/utils.mjs test/fixtures/bpmn/simple-start-task-end.bpmn --output model```
