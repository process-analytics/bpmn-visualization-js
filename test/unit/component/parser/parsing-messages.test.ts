/*
Copyright 2021 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {
  EdgeUnknownBpmnElementWarning,
  GroupUnknownCategoryValueWarning,
  LaneUnknownFlowNodeRefWarning,
  LabelStyleMissingFontWarning,
  ShapeUnknownBpmnElementWarning,
  BoundaryEventNotAttachedToActivityWarning,
} from '@lib/component/parser/json/warnings';
import { ParsingMessageCollector } from '@lib/component/parser/parsing-messages';
import { ShapeBpmnElementKind } from '@lib/model/bpmn/internal';

describe('parsing message collector', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {
    // do not display actual console outputs during tests
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const parsingMessageCollector = new ParsingMessageCollector();

  describe('console.warn when warning is registered', () => {
    it('unknown edge bpmn element', () => {
      parsingMessageCollector.warning(new EdgeUnknownBpmnElementWarning('edge-bpmnElement-unknown'));
      expect(console.warn).toHaveBeenCalledWith('[bv-parser] Edge json deserialization: unable to find bpmn element with id %s', 'edge-bpmnElement-unknown');
    });
    it('unknown shape bpmn element', () => {
      parsingMessageCollector.warning(new ShapeUnknownBpmnElementWarning('shape-bpmnElement-unknown'));
      expect(console.warn).toHaveBeenCalledWith('[bv-parser] Shape json deserialization: unable to find bpmn element with id %s', 'shape-bpmnElement-unknown');
    });

    it('missing font in label style', () => {
      parsingMessageCollector.warning(new LabelStyleMissingFontWarning('BPMNEdge_id_0', 'non-existing_style_id'));
      expect(console.warn).toHaveBeenCalledWith('[bv-parser] Unable to assign font from style %s to shape/edge %s', 'non-existing_style_id', 'BPMNEdge_id_0');
    });

    it('unknown flow node ref in lane', () => {
      parsingMessageCollector.warning(new LaneUnknownFlowNodeRefWarning('lane_id', 'non-existing_flow_node_ref'));
      expect(console.warn).toHaveBeenCalledWith('[bv-parser] Unable to assign lane %s as parent: flow node %s is not found', 'non-existing_flow_node_ref', 'lane_id');
    });

    it('unknown category value ref in group', () => {
      parsingMessageCollector.warning(new GroupUnknownCategoryValueWarning('Group_0', 'non-existing_category_value_ref'));
      expect(console.warn).toHaveBeenCalledWith(
        '[bv-parser] Group json deserialization: unable to find category value ref %s for bpmn element %s',
        'non-existing_category_value_ref',
        'Group_0',
      );
    });

    it('boundary event not attached to activity', () => {
      parsingMessageCollector.warning(new BoundaryEventNotAttachedToActivityWarning('boundary_event_0', 'lane_id_ref', ShapeBpmnElementKind.LANE));
      expect(console.warn).toHaveBeenCalledWith(
        '[bv-parser] The boundary event %s must be attached to an activity, and not to %s of kind %s',
        'boundary_event_0',
        'lane_id_ref',
        'lane',
      );
    });
  });
});
