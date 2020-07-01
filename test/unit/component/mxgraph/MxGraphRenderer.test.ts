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
import ShapeBpmnElement, { ShapeBpmnBoundaryEvent, ShapeBpmnEvent, ShapeBpmnSubProcess } from '../../../../src/model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import Label, { Font } from '../../../../src/model/bpmn/Label';
import { ExpectedFont } from '../parser/json/JsonTestUtils';
import Edge from '../../../../src/model/bpmn/edge/Edge';
import SequenceFlow from '../../../../src/model/bpmn/edge/SequenceFlow';
import { SequenceFlowKind } from '../../../../src/model/bpmn/edge/SequenceFlowKind';
import Bounds from '../../../../src/model/bpmn/Bounds';
import { ShapeBpmnEventKind } from '../../../../src/model/bpmn/shape/ShapeBpmnEventKind';
import { BpmnEventKind } from '../../../../src/model/bpmn/shape/ShapeUtil';
import { ShapeBpmnSubProcessKind } from '../../../../src/model/bpmn/shape/ShapeBpmnSubProcessKind';
import each from 'jest-each';

function toFont(font: ExpectedFont): Font {
  return new Font(font.name, font.size, font.isBold, font.isItalic, font.isUnderline, font.isStrikeThrough);
}

function newLabel(font: ExpectedFont, bounds?: Bounds): Label {
  return new Label(toFont(font), bounds);
}

/**
 * Returns a new `Shape` instance with arbitrary id and `undefined` bounds.
 * @param kind the `ShapeBpmnElementKind` to set in the new `ShapeBpmnElement` instance
 */
function newShape(bpmnElement: ShapeBpmnElement, label?: Label, isExpanded = false): Shape {
  return new Shape('id', bpmnElement, undefined, label, isExpanded);
}

/**
 * Returns a new `ShapeBpmnElement` instance with arbitrary id and name.
 * @param kind the `ShapeBpmnElementKind` to set in the new `ShapeBpmnElement` instance
 */
function newShapeBpmnElement(kind: ShapeBpmnElementKind): ShapeBpmnElement {
  return new ShapeBpmnElement('id', 'name', kind);
}

function newShapeBpmnEvent(bpmnElementKind: BpmnEventKind, eventKind: ShapeBpmnEventKind): ShapeBpmnEvent {
  return new ShapeBpmnEvent('id', 'name', bpmnElementKind, eventKind, null);
}

function newShapeBpmnBoundaryEvent(eventKind: ShapeBpmnEventKind, isInterrupting: boolean): ShapeBpmnBoundaryEvent {
  return new ShapeBpmnBoundaryEvent('id', 'name', eventKind, null, isInterrupting);
}

function newShapeBpmnSubProcess(subPorcessKind: ShapeBpmnSubProcessKind): ShapeBpmnSubProcess {
  return new ShapeBpmnSubProcess('id', 'name', subPorcessKind, null);
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
    expect(computeStyle(shape)).toEqual('callActivity;verticalAlign=top;align=center;labelWidth=81;labelPosition=top;verticalLabelPosition=left');
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

  it('compute style of edge with label bounds', () => {
    const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.NORMAL), undefined, new Label(toFont({ name: 'Helvetica' }), new Bounds(20, 20, 30, 120)));
    expect(computeStyle(edge)).toEqual('normal;fontFamily=Helvetica;verticalAlign=top;align=center');
  });

  describe('compute style - events kind', () => {
    it('intermediate catch conditional', () => {
      const shape = newShape(newShapeBpmnEvent(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, ShapeBpmnEventKind.CONDITIONAL), newLabel({ name: 'Ubuntu' }));
      expect(computeStyle(shape)).toEqual('intermediateCatchEvent;fontFamily=Ubuntu;bpmn.eventKind=conditional');
    });

    it('start signal', () => {
      const shape = newShape(newShapeBpmnEvent(ShapeBpmnElementKind.EVENT_START, ShapeBpmnEventKind.SIGNAL), newLabel({ isBold: true }));
      expect(computeStyle(shape)).toEqual('startEvent;fontStyle=1;bpmn.eventKind=signal');
    });
  });
  describe('compute style - boundary events', () => {
    it('interrupting message', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventKind.MESSAGE, true), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toEqual('boundaryEvent;fontFamily=Arial;bpmn.eventKind=message;bpmn.isInterrupting=true');
    });

    it('non interrupting timer', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventKind.TIMER, false), newLabel({ isItalic: true }));
      expect(computeStyle(shape)).toEqual('boundaryEvent;fontStyle=2;bpmn.eventKind=timer;bpmn.isInterrupting=false');
    });

    it('cancel with undefined interrupting value', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventKind.CANCEL, undefined), newLabel({ isStrikeThrough: true }));
      expect(computeStyle(shape)).toEqual('boundaryEvent;fontStyle=8;bpmn.eventKind=cancel;bpmn.isInterrupting=true');
    });
  });
  describe('compute style - sub-processes', () => {
    each([
      ['expanded', true],
      ['collapsed', false],
    ]).it('%s embedded sub-process without label bounds', (testName, isExpanded: boolean) => {
      const shape = newShape(newShapeBpmnSubProcess(ShapeBpmnSubProcessKind.EMBEDDED), newLabel({ name: 'Arial' }), isExpanded);
      const additionalTerminalStyle = isExpanded ? ';verticalAlign=top' : '';
      expect(computeStyle(shape)).toEqual(`subProcess;fontFamily=Arial;bpmn.subProcessKind=embedded;bpmn.isExpanded=${isExpanded}${additionalTerminalStyle}`);
    });

    each([
      ['expanded', true],
      ['collapsed', false],
    ]).it('%s embedded sub-process with label bounds', (testName, isExpanded: boolean) => {
      const shape = newShape(newShapeBpmnSubProcess(ShapeBpmnSubProcessKind.EMBEDDED), newLabel({ name: 'sans-serif' }, new Bounds(20, 20, 300, 200)), isExpanded);
      expect(computeStyle(shape)).toEqual(
        `subProcess;fontFamily=sans-serif;bpmn.subProcessKind=embedded;bpmn.isExpanded=${isExpanded};verticalAlign=top;align=center;labelWidth=301;labelPosition=top;verticalLabelPosition=left`,
      );
    });
  });
});
