Description of the supported BPMN elements progression in BPMN-visu-js.

You can track related issues and pull requests with the following labels
- [BPMN support](https://github.com/bonitasoft-labs/bpmn-visu-js/issues?q=label%3A%22BPMN+support%22+is%3Aclosed): BPMN
elements recognized by the lib
- [BPMN rendering](https://github.com/bonitasoft-labs/bpmn-visu-js/issues?q=label%3A%22BPMN+rendering%22+is%3Aclosed):
BPMN elements rendered with their final design


# Opened implementation steps

The step content is subject to change and is provided for information

## Step 1 - minimal Bpmn support

lib version: `0.1.x`

Note that the bpmn elements listed here may not be rendered with their final design at part of the initial support. 

BPMN elements
- pool
- lane
- activities
  - task
  - service task
  - :heavy_check_mark: user task (0.1.0)
- events
  - :heavy_check_mark: start event (0.1.0)
  - end event
  - terminate end event
- flows
  - :heavy_check_mark: sequence flow (0.1.0)
- gateways
  - exclusive gateway
  - parallel gateway
- BPMN artifacts
  - text annotation


## Step 2

- activities
  - call activity
  - manual task
- activity boundaries (to be refined)
- activity markers
  - loop
  - multi instantiation parallel
  - multi instantiation sequential
- events
  - timer start event
  - signal start event
- flows
  - message flow
- gateways
  - inclusive gateway
- BPMN artifacts
    - group


## Step 3

- activities
  - Send task
  - Receive task


## Step 4

- subprocess
- activities
  - business rules task
  - script task
- BPMN extensions support


## To be continued

...

# Already completed steps

none
