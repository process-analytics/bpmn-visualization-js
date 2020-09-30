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

import StyleConfigurator from '../../../../../src/component/mxgraph/config/StyleConfigurator';
import InternalBPMNShape from '../../../../../src/model/bpmn/internal/shape/InternalBPMNShape';
import ShapeBaseElement, {
  ShapeBpmnActivity,
  ShapeBpmnBoundaryEvent,
  ShapeBpmnCallActivity,
  ShapeBpmnEvent,
  ShapeBpmnStartEvent,
  ShapeBpmnSubProcess,
} from '../../../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import { ShapeBaseElementType, CallActivityType, MarkerType, SubProcessType, EventType } from '../../../../../src/model/bpmn/internal/shape';
import Label from '../../../../../src/model/bpmn/internal/Label';
import { ExpectedFont } from '../../parser/json/JsonTestUtils';
import InternalBPMNEdge from '../../../../../src/model/bpmn/internal/edge/InternalBPMNEdge';
import { AssociationFlow, MessageFlow, SequenceFlow } from '../../../../../src/model/bpmn/internal/edge/Flow';
import { SequenceFlowType } from '../../../../../src/model/bpmn/internal/edge/SequenceFlowType';
import { BpmnEventType } from '../../../../../src/model/bpmn/internal/shape/ShapeUtil';
import each from 'jest-each';
import { MessageVisibleKind } from '../../../../../src/model/bpmn/json/BPMNDI';
import { Bounds, Font } from '../../../../../src/model/bpmn/json/DC';
import { TAssociationDirection } from '../../../../../src/model/bpmn/json/baseElement/artifact';

function toFont(font: ExpectedFont): Font {
  return { name: font.name, size: font.size, isBold: font.isBold, isItalic: font.isItalic, isUnderline: font.isUnderline, isStrikeThrough: font.isStrikeThrough };
}

function newLabel(font: ExpectedFont, bounds?: Bounds): Label {
  return new Label(toFont(font), bounds);
}

/**
 * Returns a new `Shape` instance with arbitrary id and `undefined` bounds.
 */
function newShape(bpmnElement: ShapeBaseElement, label?: Label, isHorizontal?: boolean): InternalBPMNShape {
  return new InternalBPMNShape('id', bpmnElement, undefined, label, isHorizontal);
}

/**
 * Returns a new `ShapeBpmnElement` instance with arbitrary id and name.
 * `type` is the `ShapeBpmnElementType` to set in the new `ShapeBpmnElement` instance
 */
function newShapeBpmnElement(type: ShapeBaseElementType): ShapeBaseElement {
  return new ShapeBaseElement('id', 'name', type);
}

function newShapeBpmnActivity(type: ShapeBaseElementType, markers?: MarkerType[], instantiate?: boolean): ShapeBaseElement {
  return new ShapeBpmnActivity('id', 'name', type, undefined, instantiate, markers);
}

function newShapeBpmnCallActivity(markers?: MarkerType[]): ShapeBaseElement {
  return new ShapeBpmnCallActivity('id', 'name', CallActivityType.CALLING_PROCESS, undefined, markers);
}

function newShapeBpmnEvent(bpmnElementType: EventType, eventType: EventType): ShapeBpmnEvent {
  return new ShapeBpmnEvent('id', 'name', bpmnElementType, eventType, null);
}

function newShapeBpmnBoundaryEvent(eventType: EventType, isInterrupting: boolean): ShapeBpmnBoundaryEvent {
  return new ShapeBpmnBoundaryEvent('id', 'name', eventType, null, isInterrupting);
}

function newShapeBpmnStartEvent(eventKind: EventType, isInterrupting: boolean): ShapeBpmnStartEvent {
  return new ShapeBpmnStartEvent('id', 'name', eventKind, null, isInterrupting);
}

function newShapeBpmnSubProcess(subProcessType: SubProcessType, marker?: MarkerType[]): ShapeBpmnSubProcess {
  return new ShapeBpmnSubProcess('id', 'name', subProcessType, null, marker);
}

/**
 * Returns a new `SequenceFlow` instance with arbitrary id and name.
 * @param type the `SequenceFlowType` to set in the new `SequenceFlow` instance
 */
function newSequenceFlow(type: SequenceFlowType): SequenceFlow {
  return new SequenceFlow('id', 'name', undefined, undefined, type);
}

function newMessageFlow(): MessageFlow {
  return new MessageFlow('id', 'name', undefined, undefined);
}

function newAssociationFlow(kind: TAssociationDirection): AssociationFlow {
  return new AssociationFlow('id', 'name', undefined, undefined, kind);
}

function newBounds(width: number): Bounds {
  return { x: 20, y: 20, width, height: 200 };
}

describe('mxgraph renderer', () => {
  const styleConfigurator = new StyleConfigurator(null); // we don't care of mxgraph graph here

  // shortcut as the current computeStyle implementation requires to pass the BPMN label bounds as extra argument
  function computeStyle(bpmnCell: InternalBPMNShape | InternalBPMNEdge): string {
    return styleConfigurator.computeStyle(bpmnCell, bpmnCell.label?.bounds);
  }

  describe('compute style - shape label', () => {
    it('compute style of shape with no label', () => {
      const shape = new InternalBPMNShape('id', newShapeBpmnElement(ShapeBaseElementType.TASK_USER));
      expect(computeStyle(shape)).toEqual('userTask');
    });

    it('compute style of shape with a no font label', () => {
      const shape = new InternalBPMNShape('id', newShapeBpmnElement(ShapeBaseElementType.EVENT_END), undefined, new Label(undefined, undefined));
      expect(computeStyle(shape)).toEqual('endEvent');
    });
    it('compute style of shape with label including bold font', () => {
      const shape = new InternalBPMNShape(
        'id',
        newShapeBpmnElement(ShapeBaseElementType.GATEWAY_EXCLUSIVE),
        undefined,
        new Label(toFont({ name: 'Courier', size: 9, isBold: true }), undefined),
      );
      expect(computeStyle(shape)).toEqual('exclusiveGateway;fontFamily=Courier;fontSize=9;fontStyle=1');
    });

    it('compute style of shape with label including italic font', () => {
      const shape = new InternalBPMNShape(
        'id',
        newShapeBpmnElement(ShapeBaseElementType.EVENT_INTERMEDIATE_CATCH),
        undefined,
        new Label(toFont({ name: 'Arial', isItalic: true }), undefined),
      );
      expect(computeStyle(shape)).toEqual('intermediateCatchEvent;fontFamily=Arial;fontStyle=2');
    });

    it('compute style of shape with label including bold/italic font', () => {
      const shape = new InternalBPMNShape(
        'id',
        newShapeBpmnElement(ShapeBaseElementType.EVENT_INTERMEDIATE_THROW),
        undefined,
        new Label(toFont({ isBold: true, isItalic: true }), undefined),
      );
      expect(computeStyle(shape)).toEqual('intermediateThrowEvent;fontStyle=3');
    });

    it('compute style of shape with label bounds', () => {
      const shape = new InternalBPMNShape('id', newShapeBpmnElement(ShapeBaseElementType.CALL_ACTIVITY), undefined, new Label(undefined, newBounds(80)));
      expect(computeStyle(shape)).toEqual('callActivity;verticalAlign=top;align=center;labelWidth=81;labelPosition=top;verticalLabelPosition=left');
    });
  });

  describe('compute style - edge label', () => {
    it('compute style of edge with no label', () => {
      const edge = new InternalBPMNEdge('id', newSequenceFlow(SequenceFlowType.CONDITIONAL_FROM_GATEWAY));
      expect(computeStyle(edge)).toEqual('sequenceFlow;conditional_from_gateway');
    });

    it('compute style of edge with a no font label', () => {
      const edge = new InternalBPMNEdge('id', newSequenceFlow(SequenceFlowType.NORMAL), undefined, new Label(undefined, undefined));
      expect(computeStyle(edge)).toEqual('sequenceFlow;normal');
    });

    it('compute style of edge with label including strike-through font', () => {
      const edge = new InternalBPMNEdge(
        'id',
        newSequenceFlow(SequenceFlowType.CONDITIONAL_FROM_ACTIVITY),
        undefined,
        new Label(toFont({ size: 14.2, isStrikeThrough: true }), undefined),
      );
      expect(computeStyle(edge)).toEqual('sequenceFlow;conditional_from_activity;fontSize=14.2;fontStyle=8');
    });

    it('compute style of edge with label including underline font', () => {
      const edge = new InternalBPMNEdge('id', newSequenceFlow(SequenceFlowType.DEFAULT), undefined, new Label(toFont({ isUnderline: true }), undefined));
      expect(computeStyle(edge)).toEqual('sequenceFlow;default;fontStyle=4');
    });

    it('compute style of edge with label including bold/italic/strike-through/underline font', () => {
      const edge = new InternalBPMNEdge(
        'id',
        newSequenceFlow(SequenceFlowType.NORMAL),
        undefined,
        new Label(toFont({ isBold: true, isItalic: true, isStrikeThrough: true, isUnderline: true }), undefined),
      );
      expect(computeStyle(edge)).toEqual('sequenceFlow;normal;fontStyle=15');
    });

    it('compute style of edge with label bounds', () => {
      const edge = new InternalBPMNEdge('id', newSequenceFlow(SequenceFlowType.NORMAL), undefined, new Label(toFont({ name: 'Helvetica' }), newBounds(100)));
      expect(computeStyle(edge)).toEqual('sequenceFlow;normal;fontFamily=Helvetica;verticalAlign=top;align=center');
    });
  });

  each([
    [SequenceFlowType.CONDITIONAL_FROM_GATEWAY, 'conditional_from_gateway'],
    [SequenceFlowType.CONDITIONAL_FROM_ACTIVITY, 'conditional_from_activity'],
    [SequenceFlowType.DEFAULT, 'default'],
    [SequenceFlowType.NORMAL, 'normal'],
  ]).it('compute style - sequence flows: %s', (type, expected) => {
    const edge = new InternalBPMNEdge('id', newSequenceFlow(type));
    expect(computeStyle(edge)).toEqual(`sequenceFlow;${expected}`);
  });

  each([
    [TAssociationDirection.None, 'None'],
    [TAssociationDirection.One, 'One'],
    [TAssociationDirection.Both, 'Both'],
  ]).it('compute style - association flows: %s', (kind, expected) => {
    const edge = new InternalBPMNEdge('id', newAssociationFlow(kind));
    expect(computeStyle(edge)).toEqual(`association;${expected}`);
  });

  each([
    [MessageVisibleKind.nonInitiating, 'non_initiating'],
    [MessageVisibleKind.initiating, 'initiating'],
  ]).it('compute style - message flow icon: %s', (messageVisibleKind, expected) => {
    const edge = new InternalBPMNEdge('id', newMessageFlow(), undefined, undefined, messageVisibleKind);
    expect(styleConfigurator.computeMessageFlowIconStyle(edge)).toEqual(`shape=bpmn.messageFlowIcon;bpmn.isInitiating=${expected}`);
  });

  describe('compute style - events type', () => {
    it('intermediate catch conditional', () => {
      const shape = newShape(newShapeBpmnEvent(ShapeBaseElementType.EVENT_INTERMEDIATE_CATCH, BpmnEventType.CONDITIONAL), newLabel({ name: 'Ubuntu' }));
      expect(computeStyle(shape)).toEqual('intermediateCatchEvent;bpmn.eventKind=conditional;fontFamily=Ubuntu');
    });

    it('start signal', () => {
      const shape = newShape(newShapeBpmnEvent(ShapeBaseElementType.EVENT_START, BpmnEventType.SIGNAL), newLabel({ isBold: true }));
      expect(computeStyle(shape)).toEqual('startEvent;bpmn.eventKind=signal;fontStyle=1');
    });
  });
  describe('compute style - boundary events', () => {
    it('interrupting message', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(BpmnEventType.MESSAGE, true), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toEqual('boundaryEvent;bpmn.eventKind=message;bpmn.isInterrupting=true;fontFamily=Arial');
    });

    it('non interrupting timer', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(BpmnEventType.TIMER, false), newLabel({ isItalic: true }));
      expect(computeStyle(shape)).toEqual('boundaryEvent;bpmn.eventKind=timer;bpmn.isInterrupting=false;fontStyle=2');
    });

    it('cancel with undefined interrupting value', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(BpmnEventType.CANCEL, undefined), newLabel({ isStrikeThrough: true }));
      expect(computeStyle(shape)).toEqual('boundaryEvent;bpmn.eventKind=cancel;bpmn.isInterrupting=true;fontStyle=8');
    });
  });

  describe('compute style - event sub-process start event', () => {
    it('interrupting message', () => {
      const shape = newShape(newShapeBpmnStartEvent(BpmnEventType.MESSAGE, true), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toEqual('startEvent;bpmn.eventKind=message;bpmn.isInterrupting=true;fontFamily=Arial');
    });

    it('non interrupting timer', () => {
      const shape = newShape(newShapeBpmnStartEvent(BpmnEventType.TIMER, false), newLabel({ isItalic: true }));
      expect(computeStyle(shape)).toEqual('startEvent;bpmn.eventKind=timer;bpmn.isInterrupting=false;fontStyle=2');
    });

    it('cancel with undefined interrupting value', () => {
      const shape = newShape(newShapeBpmnStartEvent(BpmnEventType.CANCEL, undefined), newLabel({ isStrikeThrough: true }));
      expect(computeStyle(shape)).toEqual('startEvent;bpmn.eventKind=cancel;fontStyle=8');
    });
  });

  describe('compute style - sub-processes', () => {
    describe.each([
      ['expanded', []],
      ['collapsed', [MarkerType.EXPAND]],
    ])(`compute style - %s sub-processes`, (expandKind, markers: MarkerType[]) => {
      it(`${expandKind} embedded sub-process without label bounds`, () => {
        const shape = newShape(newShapeBpmnSubProcess(SubProcessType.EMBEDDED, markers), newLabel({ name: 'Arial' }));
        const additionalMarkerStyle = markers.includes(MarkerType.EXPAND) ? ';bpmn.markers=expand' : '';
        const additionalTerminalStyle = !markers.includes(MarkerType.EXPAND) ? ';verticalAlign=top' : '';
        expect(computeStyle(shape)).toEqual(`subProcess;bpmn.subProcessKind=embedded${additionalMarkerStyle};fontFamily=Arial${additionalTerminalStyle}`);
      });

      it(`${expandKind} embedded sub-process with label bounds`, () => {
        const shape = newShape(newShapeBpmnSubProcess(SubProcessType.EMBEDDED, markers), newLabel({ name: 'sans-serif' }, newBounds(300)));
        const additionalMarkerStyle = markers.includes(MarkerType.EXPAND) ? ';bpmn.markers=expand' : '';
        expect(computeStyle(shape)).toEqual(
          `subProcess;bpmn.subProcessKind=embedded${additionalMarkerStyle};fontFamily=sans-serif;verticalAlign=top;align=center;labelWidth=301;labelPosition=top;verticalLabelPosition=left`,
        );
      });
    });
  });

  describe('compute style - call activities', () => {
    describe.each([
      ['expanded', []],
      ['collapsed', [MarkerType.EXPAND]],
    ])(`compute style - %s call activities`, (expandKind, markers: MarkerType[]) => {
      it(`${expandKind} call activity without label bounds`, () => {
        const shape = newShape(newShapeBpmnCallActivity(markers), newLabel({ name: 'Arial' }));
        const additionalMarkerStyle = markers.includes(MarkerType.EXPAND) ? ';bpmn.markers=expand' : '';
        const additionalTerminalStyle = !markers.includes(MarkerType.EXPAND) ? ';verticalAlign=top' : '';
        expect(computeStyle(shape)).toEqual(`callActivity${additionalMarkerStyle};fontFamily=Arial${additionalTerminalStyle}`);
      });

      it(`${expandKind} call activity with label bounds`, () => {
        const shape = newShape(newShapeBpmnCallActivity(markers), newLabel({ name: 'sans-serif' }, newBounds(300)));
        const additionalMarkerStyle = markers.includes(MarkerType.EXPAND) ? ';bpmn.markers=expand' : '';
        expect(computeStyle(shape)).toEqual(
          `callActivity${additionalMarkerStyle};fontFamily=sans-serif;verticalAlign=top;align=center;labelWidth=301;labelPosition=top;verticalLabelPosition=left`,
        );
      });
    });
  });

  describe('compute style - receive tasks', () => {
    it.each([
      ['non-instantiating', false],
      ['instantiating', true],
    ])('%s receive task', (instantiatingKind: string, instantiate: boolean) => {
      const shape = newShape(newShapeBpmnActivity(ShapeBaseElementType.TASK_RECEIVE, undefined, instantiate), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toEqual(`receiveTask;bpmn.isInstantiating=${instantiate};fontFamily=Arial`);
    });
  });

  describe('compute style - text annotation', () => {
    it('without label', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBaseElementType.TEXT_ANNOTATION));
      expect(computeStyle(shape)).toEqual('textAnnotation');
    });
    it('with label bounds', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBaseElementType.TEXT_ANNOTATION), newLabel({ name: 'Segoe UI' }, newBounds(100)));
      expect(computeStyle(shape)).toEqual('textAnnotation;fontFamily=Segoe UI;verticalAlign=top;labelWidth=101;labelPosition=top;verticalLabelPosition=left');
    });
  });

  describe('compute style - pool references a Process', () => {
    it.each([
      ['vertical', false, '1'],
      ['horizontal', true, '0'],
    ])('%s pool references a Process', (title, isHorizontal: boolean, expected: string) => {
      const shape = newShape(newShapeBpmnElement(ShapeBaseElementType.POOL), undefined, isHorizontal);
      expect(computeStyle(shape)).toEqual(`pool;horizontal=${expected}`);
    });
  });

  describe('compute style - lane', () => {
    it.each([
      ['vertical', false, '1'],
      ['horizontal', true, '0'],
    ])('%s lane', (title, isHorizontal: boolean, expected: string) => {
      const shape = newShape(newShapeBpmnElement(ShapeBaseElementType.LANE), undefined, isHorizontal);
      expect(computeStyle(shape)).toEqual(`lane;horizontal=${expected}`);
    });
  });

  describe.each([
    [ShapeBaseElementType.CALL_ACTIVITY],
    [ShapeBaseElementType.SUB_PROCESS],
    [ShapeBaseElementType.TASK],
    [ShapeBaseElementType.TASK_SERVICE],
    [ShapeBaseElementType.TASK_USER],
    [ShapeBaseElementType.TASK_RECEIVE],
    [ShapeBaseElementType.TASK_SEND],
    [ShapeBaseElementType.TASK_MANUAL],
    [ShapeBaseElementType.TASK_SCRIPT],
    [ShapeBaseElementType.TASK_BUSINESS_RULE],

    // TODO: To uncomment when it's supported
    //[ShapeBaseElementType.AD_HOC_SUB_PROCESS],
    //[ShapeBaseElementType.TRANSACTION],
  ])('compute style - markers for %s', (bpmnKind: ShapeBaseElementType) => {
    describe.each([[MarkerType.LOOP], [MarkerType.MULTI_INSTANCE_SEQUENTIAL], [MarkerType.MULTI_INSTANCE_PARALLEL]])(
      `compute style - %s marker for ${bpmnKind}`,
      (markerKind: MarkerType) => {
        it(`${bpmnKind} with ${markerKind} marker`, () => {
          const shape = newShape(newShapeBpmnActivity(bpmnKind, [markerKind]), newLabel({ name: 'Arial' }));
          const additionalReceiveTaskStyle = bpmnKind === ShapeBaseElementType.TASK_RECEIVE ? ';bpmn.isInstantiating=false' : '';
          expect(computeStyle(shape)).toEqual(`${bpmnKind}${additionalReceiveTaskStyle};bpmn.markers=${markerKind};fontFamily=Arial`);
        });

        if (bpmnKind == ShapeBaseElementType.SUB_PROCESS) {
          it(`${bpmnKind} with Loop & Expand (collapsed) markers`, () => {
            const shape = newShape(newShapeBpmnSubProcess(SubProcessType.EMBEDDED, [markerKind, MarkerType.EXPAND]));
            expect(computeStyle(shape)).toEqual(`subProcess;bpmn.subProcessKind=embedded;bpmn.markers=${markerKind},expand`);
          });
        }

        if (bpmnKind == ShapeBaseElementType.CALL_ACTIVITY) {
          it(`${bpmnKind} with Loop & Expand (collapsed) markers`, () => {
            const shape = newShape(newShapeBpmnCallActivity([markerKind, MarkerType.EXPAND]));
            expect(computeStyle(shape)).toEqual(`callActivity;bpmn.markers=${markerKind},expand`);
          });
        }
      },
    );
  });
});
