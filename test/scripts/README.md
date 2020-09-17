# Tool to facilitate tests writing to parsing .bpmn
##Building utils module
run in the root of the project:

```npm run build-utils```

##Usage
run in the root of the project:

```node ./test/scripts/dist/utils.mjs RELATIVE_PATH_TO_BPMN_FILE```

i.e:

```node ./test/scripts/dist/utils.mjs test/fixtures/bpmn/parser-test.bpmn```
