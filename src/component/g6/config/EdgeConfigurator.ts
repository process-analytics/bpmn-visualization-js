/**
 * Copyright 2020 Bonitasoft S.A.
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
import G6 from '@antv/g6';
import { FlowKind } from '../../../model/bpmn/internal/edge/FlowKind';
import { getSequenceFlowDefinition } from '../node/flow-edges';

export default class EdgeConfigurator {
  public configureEdges(): void {
    this.registerEdges();
  }

  private registerEdges(): void {
    G6.registerEdge(FlowKind.SEQUENCE_FLOW, getSequenceFlowDefinition, 'polyline');
    G6.registerEdge(FlowKind.ASSOCIATION_FLOW, getSequenceFlowDefinition);
    G6.registerEdge(FlowKind.MESSAGE_FLOW, getSequenceFlowDefinition);

    // shapes for flows
    // TODO Add to Edge registry
    // mxCellRenderer.registerShape(StyleIdentifier.BPMN_STYLE_MESSAGE_FLOW_ICON, MessageFlowIconShape);
  }
}
