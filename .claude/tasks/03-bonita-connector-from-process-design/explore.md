# Task: Bonita connector data from the process design

Exploration of an alternative source of connector data, outside the feasibility POC of the Bonita connector extension
(`01-poc-bonita-connector-extension`), and out of the scope of ADR 001. Not decided: recorded to keep the options and
their trade-offs.

The BPMN export only carries connectors on service tasks, so the POC cannot flag a user or script task holding one. The
process design lists the connectors of every activity.

At runtime, the BPMN diagram itself is retrieved with the Bonita REST API
[`API/bpm/diagram/{id}`](https://api-documentation.ofelia.com/latest/#tag/Diagram), available in the Enterprise edition
only. Otherwise, the diagram has to be exported manually from Bonita Studio, and the application needs another way to
retrieve it at runtime.

## The data source

The Bonita REST API `API/bpm/process/{id}/design` returns the deployed process definition as JSON. Every activity lists
its connectors, whatever its kind, where the BPMN export keeps them on service tasks only.

- **No BPMN identifier**: activities are matched to the diagram by name. Bonita Studio keeps names unique within a pool,
  and Bonita displays a single pool at a time.
- **Large response**: connectors carry their full inputs, scripts included, and make up about half of it, while the
  extension only needs to know whether an activity has connectors.
- **Fetched by the caller**: calling the Bonita engine is not a BPMN extension concern. The data has to be provided to
  the library, it cannot be parsed from the diagram.

The JSON is the serialization of the engine `DesignProcessDefinition` Java object: one key per getter, no schema, and
no field giving the kind of an activity.

**To investigate: the exact format.** The example below is reconstructed from the getters of the engine Java interfaces,
not captured from a real response. A sample seen in an older internal Bonita implementation does not match it exactly
(additional keys, duplicated data, keys that depend on the engine version). Before implementing, capture real
responses on the targeted Bonita versions and check at least the `activities`, `name`, `connectors` and
`subProcessContainer` keys the mapping relies on.

Trimmed to what matters here, with illustrative values:

```json
{
  "id": "6488297458201435785",
  "name": "Claim",
  "version": "1.0",
  "flowElementContainer": {
    "activities": [
      {
        "id": "-5257689827438055744",
        "name": "Validate claim",
        "connectors": [
          {
            "name": "notify manager",
            "connectorId": "email",
            "version": "1.3.0",
            "activationEvent": "ON_ENTER",
            "failAction": "FAIL",
            "inputs": { "subject": { "content": "...", "expressionType": "TYPE_CONSTANT" } },
            "outputs": []
          }
        ],
        "operations": [],
        "incomingTransitions": [],
        "outgoingTransitions": []
      },
      {
        "id": "7312655841022364981",
        "name": "Handle timeout",
        "connectors": [],
        "triggeredByEvent": true,
        "subProcessContainer": { "activities": [] }
      }
    ],
    "connectors": [],
    "startEvents": [],
    "endEvents": [],
    "transitions": []
  }
}
```

- `id` is the engine identifier of the element, unrelated to the `id` of the BPMN element.
- `connectors` is set on every activity, empty when it has none. The process-level `connectors` of
  `flowElementContainer` are not attached to a task and are ignored.
- An event subprocess is an activity whose `subProcessContainer` holds its own `activities`, to be walked recursively.

**Mapping.** Walk `flowElementContainer.activities`, recursing into `subProcessContainer.activities`, and keep the
`name` of every activity whose `connectors` array is not empty. Then match each name against the names of the BPMN
elements of the displayed pool, which gives the BPMN identifier of the element to decorate. Only the names and the
emptiness of `connectors` are read: everything else, scripts included, is ignored.

## Option A: a connector service injected into the style extension point

An external service provides the process design. The style extension point builds a map from element name to "has
connectors", and queries it with the name of each element while computing its style, then applies the connector style
property as today.

- The configuration needs a new function returning the extension points, so that the caller can build them with the
  service.
- **Drawback**: the service must be updated with the design of the right process before every `load()`, which couples
  the loading of the design to the loading of the diagram, in a strict order.

## Option B: a rendering-only extension, plus an updater applied after loading

The extension keeps only the rendering part: the icon painter method, and the decoration of the task shapes painting
the icon when the connector style property is set. The parsing code is no longer needed.

An external updater fetches the process design, then sets the connector style property on the cells of the activities
holding connectors, in a batch update, the same way the internal `StyleUpdater` does (`mxUtils.setStyle` then
`model.setStyle`). The graph redraws and the icons appear.

- **Advantage**: asynchronous. One request loads the diagram, another fetches the design and updates the rendering
  when it arrives.
- **Packaging**: a standalone object, or a plugin of
  [bpmn-visualization-addons](https://github.com/process-analytics/bpmn-visualization-addons) attached to
  `BpmnVisualization`. A plugin can also clear its cached data each time a new diagram is loaded.
- **Name to identifier matching**, to decide at implementation time:
  - list all the tasks and match on their name;
  - keep an in-memory mapping between names and identifiers of all the elements, as the addons plugins providing
    name-based APIs do. Then either compute an identifier to "has connectors" map when the design arrives and loop on
    it to apply the style, or loop on the names when applying the style and resolve each identifier then.

## Hybrid: keep the current extension, enrich it with the updater

Keep the extension as implemented in the POC, parsing included: the service tasks get their icon as soon as the diagram
is loaded. The updater of option B then optionally enriches the other activities from the process design.

- Some code is redundant: when the design is available, most of the parsing result is not needed.
- But there is a single way to declare the extension, which is simpler to maintain and for the user.
- **The updater only adds**: it sets the style of the activities holding connectors, and never removes it from the
  others. An icon set from the BPMN export is therefore kept even if the process design lists no connector for that
  activity. This is not expected to happen, and is not handled to keep the updater simple.
