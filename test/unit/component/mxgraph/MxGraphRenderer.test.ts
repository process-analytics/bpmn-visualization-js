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

import { defaultMxGraphRenderer } from '../../../../src/component/mxgraph/MxGraphRenderer';
import Shape from '../../../../src/model/bpmn/shape/Shape';
import ShapeBpmnElement from '../../../../src/model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import Label, { Font } from '../../../../src/model/bpmn/Label';
import { ExpectedFont } from '../parser/json/JsonTestUtils';
import Edge from '../../../../src/model/bpmn/edge/Edge';
import SequenceFlow from '../../../../src/model/bpmn/edge/SequenceFlow';
import { SequenceFlowKind } from '../../../../src/model/bpmn/edge/SequenceFlowKind';
import Bounds from '../../../../src/model/bpmn/Bounds';

function toFont(font: ExpectedFont): Font {
  return new Font(font.name, font.size, font.isBold, font.isItalic, font.isUnderline, font.isStrikeThrough);
}

/**
 * Returns a new `ShapeBpmnElement` instance with arbitrary id and name.
 * @param kind the `ShapeBpmnElementKind` to set in the new `ShapeBpmnElement` instance
 */
function newShapeBpmnElement(kind: ShapeBpmnElementKind): ShapeBpmnElement {
  return new ShapeBpmnElement('id', 'name', kind);
}

/**
 * Returns a new `SequenceFlow` instance with arbitrary id and name.
 * @param kind the `SequenceFlowKind` to set in the new `SequenceFlow` instance
 */
function newSequenceFlow(kind: SequenceFlowKind): SequenceFlow {
  return new SequenceFlow('id', 'name', undefined, undefined, kind);
}

describe('mxgraph renderer', () => {
  const mxGraphRenderer = defaultMxGraphRenderer(null); // we don't care of mxgraph graph here

  // shortcut as the current computeStyle implementation requires to pass the BPMN label bounds as extra argument
  function computeStyle(bpmnCell: Shape | Edge): string {
    return mxGraphRenderer.computeStyle(bpmnCell, bpmnCell.label?.bounds);
  }

  it('compute style of shape with no label', () => {
    const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.TASK_USER));
    expect(computeStyle(shape)).toEqual('userTask');
  });

  it('compute style of shape with a no font label', () => {
    const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_END), undefined, new Label(undefined, undefined));
    expect(computeStyle(shape)).toEqual('endEvent');
  });

  it('compute style of shape with label including bold font', () => {
    const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE), undefined, new Label(toFont({ name: 'Courier', size: 9, isBold: true }), undefined));
    expect(computeStyle(shape)).toEqual('exclusiveGateway;fontFamily=Courier;fontSize=9;fontStyle=1');
  });

  it('compute style of shape with label including italic font', () => {
    const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH), undefined, new Label(toFont({ name: 'Arial', isItalic: true }), undefined));
    expect(computeStyle(shape)).toEqual('intermediateCatchEvent;fontFamily=Arial;fontStyle=2');
  });

  it('compute style of shape with label including bold/italic font', () => {
    const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW), undefined, new Label(toFont({ isBold: true, isItalic: true }), undefined));
    expect(computeStyle(shape)).toEqual('intermediateThrowEvent;fontStyle=3');
  });

  it('compute style of shape with label bounds', () => {
    const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.CALL_ACTIVITY), undefined, new Label(undefined, new Bounds(40, 200, 80, 140)));
    expect(computeStyle(shape)).toEqual('callActivity;labelWidth=81;verticalAlign=top;align=center;labelPosition=top;verticalLabelPosition=left');
  });

  it('compute style of edge with no label', () => {
    const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.CONDITIONAL_FROM_GATEWAY));
    expect(computeStyle(edge)).toEqual('conditional_from_gateway');
  });

  it('compute style of edge with a no font label', () => {
    const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.NORMAL), undefined, new Label(undefined, undefined));
    expect(computeStyle(edge)).toEqual('normal');
  });

  it('compute style of edge with label including strike-through font', () => {
    const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY), undefined, new Label(toFont({ size: 14.2, isStrikeThrough: true }), undefined));
    expect(computeStyle(edge)).toEqual('conditional_from_activity;fontSize=14.2;fontStyle=8');
  });

  it('compute style of edge with label including underline font', () => {
    const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.DEFAULT), undefined, new Label(toFont({ isUnderline: true }), undefined));
    expect(computeStyle(edge)).toEqual('default;fontStyle=4');
  });

  it('compute style of edge with label including bold/italic/strike-through/underline font', () => {
    const edge = new Edge(
      'id',
      newSequenceFlow(SequenceFlowKind.NORMAL),
      undefined,
      new Label(toFont({ isBold: true, isItalic: true, isStrikeThrough: true, isUnderline: true }), undefined),
    );
    expect(computeStyle(edge)).toEqual('normal;fontStyle=15');
  });

  it('compute style of edge with label bounds: style kept unchanged', () => {
    const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.NORMAL), undefined, new Label(toFont({ name: 'Helvetica' }), new Bounds(20, 20, 30, 120)));
    expect(computeStyle(edge)).toEqual('normal;fontFamily=Helvetica');
  });
});
