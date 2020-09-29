# The CLI tool to generate json and/or internal model from bpmn file
You should note that there is no need to copy the result from the console as it will be directly copied into system clipboard

##Building utils module
run in the root of the project:

```npm run build-utils```

##Usage
run in the root of the project:

- to get BpmnJsonModel

```node ./scripts/utils/dist/utils.mjs RELATIVE_PATH_TO_BPMN_FILE```

- to get BpmnModel

```node ./scripts/utils/dist/utils.mjs RELATIVE_PATH_TO_BPMN_FILE model```

i.e:

```node ./scripts/utils/dist/utils.mjs test/fixtures/bpmn/parser-test.bpmn model```
