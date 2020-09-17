# Tool to facilitate tests writing to parsing .bpmn
##Building utils module
run in the root of the project:

```npm run build-utils```

##Usage
run in the root of the project:

- to get BpmnJsonModel

```node ./test/scripts/dist/utils.mjs RELATIVE_PATH_TO_BPMN_FILE```

- to get BpmnModel

```node ./test/scripts/dist/utils.mjs RELATIVE_PATH_TO_BPMN_FILE bpmn```

i.e:

```node ./test/scripts/dist/utils.mjs test/fixtures/bpmn/parser-test.bpmn bpmn```
