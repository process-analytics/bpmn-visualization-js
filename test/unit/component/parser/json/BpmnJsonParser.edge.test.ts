/**
 * Copyright 2021 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { parseJsonAndExpectOnlyEdges } from './JsonTestUtils';

describe('parse bpmn as json for edges', () => {
  jest.spyOn(console, 'warn');

  afterEach(() => {
    jest.clearAllMocks();
  });

  // this also covers unsupported bpmn element types that are then not retrieved during the parsing
  it('should not convert as Edge without related BPMN element', () => {
    console.warn = jest.fn();
    const json = {
      definitions: {
        targetNamespace: '',
        process: '',
        BPMNDiagram: {
          id: 'BpmnDiagram_1',
          BPMNPlane: {
            id: 'BpmnPlane_1',
            BPMNEdge: {
              id: 'BPMNEdge_id_0',
              bpmnElement: 'edge-bpmnElement-unknown',
              waypoint: [{ x: 10, y: 10 }],
            },
          },
        },
      },
    };

    parseJsonAndExpectOnlyEdges(json, 0);
    expect(console.warn).toHaveBeenCalledWith('Edge json deserialization: unable to find bpmn element with id %s', 'edge-bpmnElement-unknown');
  });
});
