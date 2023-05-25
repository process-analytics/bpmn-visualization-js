/**
 * @jest-environment jsdom
 */
/*
Copyright 2020 Bonitasoft S.A.

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

import StyleComputer from '@lib/component/mxgraph/renderer/StyleComputer';
import Shape from '@lib/model/bpmn/internal/shape/Shape';
import ShapeBpmnElement, {
  ShapeBpmnActivity,
  ShapeBpmnBoundaryEvent,
  ShapeBpmnCallActivity,
  ShapeBpmnEvent,
  ShapeBpmnEventBasedGateway,
  ShapeBpmnStartEvent,
  ShapeBpmnSubProcess,
} from '@lib/model/bpmn/internal/shape/ShapeBpmnElement';
import type { BpmnEventKind, GlobalTaskKind } from '@lib/model/bpmn/internal';
import {
  AssociationDirectionKind,
  MessageVisibleKind,
  SequenceFlowKind,
  ShapeBpmnCallActivityKind,
  ShapeBpmnElementKind,
  ShapeBpmnEventBasedGatewayKind,
  ShapeBpmnEventDefinitionKind,
  ShapeBpmnMarkerKind,
  ShapeBpmnSubProcessKind,
  ShapeUtil,
} from '@lib/model/bpmn/internal';
import Label, { Font } from '@lib/model/bpmn/internal/Label';
import { Edge } from '@lib/model/bpmn/internal/edge/edge';
import { AssociationFlow, MessageFlow, SequenceFlow } from '@lib/model/bpmn/internal/edge/flows';
import Bounds from '@lib/model/bpmn/internal/Bounds';
import type { ExpectedFont } from '../../../helpers/bpmn-model-expect';

function toFont(font: ExpectedFont): Font {
  return new Font(font.name, font.size, font.isBold, font.isItalic, font.isUnderline, font.isStrikeThrough);
}

function newLabel(font: ExpectedFont, bounds?: Bounds): Label {
  return new Label(toFont(font), bounds);
}

function newLabelExtension(color: string): Label {
  const label = new Label(undefined, undefined);
  label.extensions.color = color;
  return label;
}

/**
 * Returns a new `Shape` instance with arbitrary id and `undefined` bounds.
 */
function newShape(bpmnElement: ShapeBpmnElement, label?: Label, isHorizontal?: boolean): Shape {
  return new Shape('id', bpmnElement, undefined, label, isHorizontal);
}

/**
 * Returns a new `ShapeBpmnElement` instance with arbitrary id and name.
 * `kind` is the `ShapeBpmnElementKind` to set in the new `ShapeBpmnElement` instance
 */
function newShapeBpmnElement(kind: ShapeBpmnElementKind): ShapeBpmnElement {
  return new ShapeBpmnElement('id', 'name', kind);
}

function newShapeBpmnActivity(kind: ShapeBpmnElementKind, markers?: ShapeBpmnMarkerKind[], instantiate?: boolean): ShapeBpmnElement {
  return new ShapeBpmnActivity('id', 'name', kind, undefined, instantiate, markers);
}

function newShapeBpmnCallActivityCallingProcess(markers?: ShapeBpmnMarkerKind[]): ShapeBpmnElement {
  return new ShapeBpmnCallActivity('id', 'name', ShapeBpmnCallActivityKind.CALLING_PROCESS, undefined, markers);
}

function newShapeBpmnCallActivityCallingGlobalTask(globalTaskKind: GlobalTaskKind, markers?: ShapeBpmnMarkerKind[]): ShapeBpmnElement {
  return new ShapeBpmnCallActivity('id', 'name', ShapeBpmnCallActivityKind.CALLING_GLOBAL_TASK, undefined, markers, globalTaskKind);
}

function newShapeBpmnEvent(bpmnElementKind: BpmnEventKind, eventDefinitionKind: ShapeBpmnEventDefinitionKind): ShapeBpmnEvent {
  return new ShapeBpmnEvent('id', 'name', bpmnElementKind, eventDefinitionKind, null);
}

function newShapeBpmnBoundaryEvent(eventDefinitionKind: ShapeBpmnEventDefinitionKind, isInterrupting: boolean): ShapeBpmnBoundaryEvent {
  return new ShapeBpmnBoundaryEvent('id', 'name', eventDefinitionKind, null, isInterrupting);
}

function newShapeBpmnStartEvent(eventDefinitionKind: ShapeBpmnEventDefinitionKind, isInterrupting: boolean): ShapeBpmnStartEvent {
  return new ShapeBpmnStartEvent('id', 'name', eventDefinitionKind, null, isInterrupting);
}

function newShapeBpmnSubProcess(subProcessKind: ShapeBpmnSubProcessKind, marker?: ShapeBpmnMarkerKind[]): ShapeBpmnSubProcess {
  return new ShapeBpmnSubProcess('id', 'name', subProcessKind, null, marker);
}

function newShapeBpmnEventBasedGateway(instantiate: boolean, gatewayKind: ShapeBpmnEventBasedGatewayKind): ShapeBpmnElement {
  return new ShapeBpmnEventBasedGateway('id', 'name', null, instantiate, gatewayKind);
}

/**
 * Returns a new `SequenceFlow` instance with arbitrary id and name.
 * @param kind the `SequenceFlowKind` to set in the new `SequenceFlow` instance
 */
function newSequenceFlow(kind: SequenceFlowKind): SequenceFlow {
  return new SequenceFlow('id', 'name', undefined, undefined, kind);
}

function newMessageFlow(): MessageFlow {
  return new MessageFlow('id', 'name', undefined, undefined);
}

function newAssociationFlow(kind: AssociationDirectionKind): AssociationFlow {
  return new AssociationFlow('id', 'name', undefined, undefined, kind);
}

describe('Style Computer', () => {
  // use a shared instance to check that there is no state stored in the implementation
  const styleComputer = new StyleComputer();

  // shortcut as the current computeStyle implementation requires to pass the BPMN label bounds as extra argument
  function computeStyle(bpmnCell: Shape | Edge): string {
    return styleComputer.computeStyle(bpmnCell, bpmnCell.label?.bounds);
  }

  describe('compute style - shape label', () => {
    it('compute style of shape with no label', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.TASK_USER));
      expect(computeStyle(shape)).toBe('userTask');
    });

    it('compute style of shape with a no font label', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_END), undefined, new Label(undefined, undefined));
      expect(computeStyle(shape)).toBe('endEvent');
    });
    it('compute style of shape with label including bold font', () => {
      const shape = new Shape(
        'id',
        newShapeBpmnElement(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE),
        undefined,
        new Label(toFont({ name: 'Courier', size: 9, isBold: true }), undefined),
      );
      expect(computeStyle(shape)).toBe('exclusiveGateway;fontFamily=Courier;fontSize=9;fontStyle=1');
    });

    it('compute style of shape with label including italic font', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH), undefined, new Label(toFont({ name: 'Arial', isItalic: true }), undefined));
      expect(computeStyle(shape)).toBe('intermediateCatchEvent;fontFamily=Arial;fontStyle=2');
    });

    it('compute style of shape with label including bold/italic font', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW), undefined, new Label(toFont({ isBold: true, isItalic: true }), undefined));
      expect(computeStyle(shape)).toBe('intermediateThrowEvent;fontStyle=3');
    });

    it('compute style of shape with label bounds', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.CALL_ACTIVITY), undefined, new Label(undefined, new Bounds(40, 200, 80, 140)));
      expect(computeStyle(shape)).toBe('callActivity;verticalAlign=top;align=center;labelWidth=81;labelPosition=ignore;verticalLabelPosition=middle');
    });
  });

  describe('compute style - edge label', () => {
    it('compute style of edge with no label', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.CONDITIONAL_FROM_GATEWAY));
      expect(computeStyle(edge)).toBe('sequenceFlow;conditional_from_gateway');
    });

    it('compute style of edge with a no font label', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.NORMAL), undefined, new Label(undefined, undefined));
      expect(computeStyle(edge)).toBe('sequenceFlow;normal');
    });

    it('compute style of edge with label including strike-through font', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY), undefined, new Label(toFont({ size: 14.2, isStrikeThrough: true }), undefined));
      expect(computeStyle(edge)).toBe('sequenceFlow;conditional_from_activity;fontSize=14.2;fontStyle=8');
    });

    it('compute style of edge with label including underline font', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.DEFAULT), undefined, new Label(toFont({ isUnderline: true }), undefined));
      expect(computeStyle(edge)).toBe('sequenceFlow;default;fontStyle=4');
    });

    it('compute style of edge with label including bold/italic/strike-through/underline font', () => {
      const edge = new Edge(
        'id',
        newSequenceFlow(SequenceFlowKind.NORMAL),
        undefined,
        new Label(toFont({ isBold: true, isItalic: true, isStrikeThrough: true, isUnderline: true }), undefined),
      );
      expect(computeStyle(edge)).toBe('sequenceFlow;normal;fontStyle=15');
    });

    it('compute style of edge with label bounds', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.NORMAL), undefined, new Label(toFont({ name: 'Helvetica' }), new Bounds(20, 20, 30, 120)));
      expect(computeStyle(edge)).toBe('sequenceFlow;normal;fontFamily=Helvetica;verticalAlign=top;align=center');
    });
  });

  it.each([
    [SequenceFlowKind.CONDITIONAL_FROM_GATEWAY, 'conditional_from_gateway'],
    [SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY, 'conditional_from_activity'],
    [SequenceFlowKind.DEFAULT, 'default'],
    [SequenceFlowKind.NORMAL, 'normal'],
  ])('compute style - sequence flows: %s', (kind: SequenceFlowKind, expected: string) => {
    const edge = new Edge('id', newSequenceFlow(kind));
    expect(computeStyle(edge)).toBe(`sequenceFlow;${expected}`);
  });

  it.each([
    [AssociationDirectionKind.NONE, 'None'],
    [AssociationDirectionKind.ONE, 'One'],
    [AssociationDirectionKind.BOTH, 'Both'],
  ])('compute style - association flows: %s', (kind: AssociationDirectionKind, expected: string) => {
    const edge = new Edge('id', newAssociationFlow(kind));
    expect(computeStyle(edge)).toBe(`association;${expected}`);
  });

  it.each([
    [MessageVisibleKind.NON_INITIATING, 'false'],
    [MessageVisibleKind.INITIATING, 'true'],
  ])('compute style - message flow icon: %s', (messageVisibleKind: MessageVisibleKind, expected: string) => {
    const edge = new Edge('id', newMessageFlow(), undefined, undefined, messageVisibleKind);
    expect(styleComputer.computeMessageFlowIconStyle(edge)).toBe(`shape=bpmn.messageFlowIcon;bpmn.isInitiating=${expected}`);
  });

  describe('compute style - events kind', () => {
    it('intermediate catch conditional', () => {
      const shape = newShape(newShapeBpmnEvent(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, ShapeBpmnEventDefinitionKind.CONDITIONAL), newLabel({ name: 'Ubuntu' }));
      expect(computeStyle(shape)).toBe('intermediateCatchEvent;bpmn.eventDefinitionKind=conditional;fontFamily=Ubuntu');
    });

    it('start signal', () => {
      const shape = newShape(newShapeBpmnEvent(ShapeBpmnElementKind.EVENT_START, ShapeBpmnEventDefinitionKind.SIGNAL), newLabel({ isBold: true }));
      expect(computeStyle(shape)).toBe('startEvent;bpmn.eventDefinitionKind=signal;fontStyle=1');
    });
  });
  describe('compute style - boundary events', () => {
    it('interrupting message', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventDefinitionKind.MESSAGE, true), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toBe('boundaryEvent;bpmn.eventDefinitionKind=message;bpmn.isInterrupting=true;fontFamily=Arial');
    });

    it('non interrupting timer', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventDefinitionKind.TIMER, false), newLabel({ isItalic: true }));
      expect(computeStyle(shape)).toBe('boundaryEvent;bpmn.eventDefinitionKind=timer;bpmn.isInterrupting=false;fontStyle=2');
    });

    it('cancel with undefined interrupting value', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventDefinitionKind.CANCEL, undefined), newLabel({ isStrikeThrough: true }));
      expect(computeStyle(shape)).toBe('boundaryEvent;bpmn.eventDefinitionKind=cancel;bpmn.isInterrupting=true;fontStyle=8');
    });
  });

  describe('compute style - event sub-process start event', () => {
    it('interrupting message', () => {
      const shape = newShape(newShapeBpmnStartEvent(ShapeBpmnEventDefinitionKind.MESSAGE, true), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toBe('startEvent;bpmn.eventDefinitionKind=message;bpmn.isInterrupting=true;fontFamily=Arial');
    });

    it('non interrupting timer', () => {
      const shape = newShape(newShapeBpmnStartEvent(ShapeBpmnEventDefinitionKind.TIMER, false), newLabel({ isItalic: true }));
      expect(computeStyle(shape)).toBe('startEvent;bpmn.eventDefinitionKind=timer;bpmn.isInterrupting=false;fontStyle=2');
    });

    it('cancel with undefined interrupting value', () => {
      const shape = newShape(newShapeBpmnStartEvent(ShapeBpmnEventDefinitionKind.CANCEL, undefined), newLabel({ isStrikeThrough: true }));
      expect(computeStyle(shape)).toBe('startEvent;bpmn.eventDefinitionKind=cancel;fontStyle=8');
    });
  });

  describe('compute style - sub-processes', () => {
    describe.each([
      ['expanded', []],
      ['collapsed', [ShapeBpmnMarkerKind.EXPAND]],
    ])(`compute style - %s sub-processes`, (expandKind: string, markers: ShapeBpmnMarkerKind[]) => {
      it(`${expandKind} embedded sub-process without label bounds`, () => {
        const shape = newShape(newShapeBpmnSubProcess(ShapeBpmnSubProcessKind.EMBEDDED, markers), newLabel({ name: 'Arial' }));
        const additionalMarkerStyle = markers.includes(ShapeBpmnMarkerKind.EXPAND) ? ';bpmn.markers=expand' : '';
        const additionalTerminalStyle = !markers.includes(ShapeBpmnMarkerKind.EXPAND) ? ';verticalAlign=top' : '';
        expect(computeStyle(shape)).toBe(`subProcess;bpmn.subProcessKind=embedded${additionalMarkerStyle};fontFamily=Arial${additionalTerminalStyle}`);
      });

      it(`${expandKind} embedded sub-process with label bounds`, () => {
        const shape = newShape(newShapeBpmnSubProcess(ShapeBpmnSubProcessKind.EMBEDDED, markers), newLabel({ name: 'sans-serif' }, new Bounds(20, 20, 300, 200)));
        const additionalMarkerStyle = markers.includes(ShapeBpmnMarkerKind.EXPAND) ? ';bpmn.markers=expand' : '';
        expect(computeStyle(shape)).toBe(
          `subProcess;bpmn.subProcessKind=embedded${additionalMarkerStyle};fontFamily=sans-serif;verticalAlign=top;align=center;labelWidth=301;labelPosition=ignore;verticalLabelPosition=middle`,
        );
      });
    });
  });

  describe('compute style - call activities', () => {
    describe('compute style - call activities calling process', () => {
      describe.each([
        ['expanded', []],
        ['collapsed', [ShapeBpmnMarkerKind.EXPAND]],
      ])(`compute style - %s call activities`, (expandKind: string, markers: ShapeBpmnMarkerKind[]) => {
        it(`${expandKind} call activity without label bounds`, () => {
          const shape = newShape(newShapeBpmnCallActivityCallingProcess(markers), newLabel({ name: 'Arial' }));
          const additionalMarkerStyle = markers.includes(ShapeBpmnMarkerKind.EXPAND) ? ';bpmn.markers=expand' : '';
          const additionalTerminalStyle = !markers.includes(ShapeBpmnMarkerKind.EXPAND) ? ';verticalAlign=top' : '';
          expect(computeStyle(shape)).toBe(`callActivity${additionalMarkerStyle};fontFamily=Arial${additionalTerminalStyle}`);
        });

        it(`${expandKind} call activity with label bounds`, () => {
          const shape = newShape(newShapeBpmnCallActivityCallingProcess(markers), newLabel({ name: 'sans-serif' }, new Bounds(20, 20, 300, 200)));
          const additionalMarkerStyle = markers.includes(ShapeBpmnMarkerKind.EXPAND) ? ';bpmn.markers=expand' : '';
          expect(computeStyle(shape)).toBe(
            `callActivity${additionalMarkerStyle};fontFamily=sans-serif;verticalAlign=top;align=center;labelWidth=301;labelPosition=ignore;verticalLabelPosition=middle`,
          );
        });
      });
    });

    describe('compute style - call activities calling global task', () => {
      describe.each([
        [ShapeBpmnElementKind.GLOBAL_TASK as GlobalTaskKind],
        [ShapeBpmnElementKind.GLOBAL_TASK_MANUAL as GlobalTaskKind],
        [ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT as GlobalTaskKind],
        [ShapeBpmnElementKind.GLOBAL_TASK_USER as GlobalTaskKind],
        [ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE as GlobalTaskKind],
      ])(`compute style - call activities calling %s`, (globalTaskKind: GlobalTaskKind) => {
        it(`call activity calling ${globalTaskKind} without label bounds`, () => {
          const shape = newShape(newShapeBpmnCallActivityCallingGlobalTask(globalTaskKind), newLabel({ name: 'Arial' }));
          expect(computeStyle(shape)).toBe(`callActivity;bpmn.globalTaskKind=${globalTaskKind};fontFamily=Arial`);
        });

        it(`call activity calling ${globalTaskKind} with label bounds`, () => {
          const shape = newShape(newShapeBpmnCallActivityCallingGlobalTask(globalTaskKind), newLabel({ name: 'sans-serif' }, new Bounds(20, 20, 300, 200)));
          expect(computeStyle(shape)).toBe(
            `callActivity;bpmn.globalTaskKind=${globalTaskKind};fontFamily=sans-serif;verticalAlign=top;align=center;labelWidth=301;labelPosition=ignore;verticalLabelPosition=middle`,
          );
        });
      });
    });
  });

  describe('compute style - receive tasks', () => {
    it.each([
      ['non-instantiating', false],
      ['instantiating', true],
    ])('%s receive task', (instantiatingKind: string, instantiate: boolean) => {
      const shape = newShape(newShapeBpmnActivity(ShapeBpmnElementKind.TASK_RECEIVE, undefined, instantiate), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toBe(`receiveTask;bpmn.isInstantiating=${instantiate};fontFamily=Arial`);
    });
  });

  describe('compute style - text annotation', () => {
    it('without label', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.TEXT_ANNOTATION));
      expect(computeStyle(shape)).toBe('textAnnotation');
    });
    it('with label bounds', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.TEXT_ANNOTATION), newLabel({ name: 'Segoe UI' }, new Bounds(50, 50, 100, 100)));
      expect(computeStyle(shape)).toBe('textAnnotation;fontFamily=Segoe UI;verticalAlign=top;labelWidth=101;labelPosition=ignore;verticalLabelPosition=middle');
    });
  });

  describe('compute style - group', () => {
    it('without label', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.GROUP));
      expect(computeStyle(shape)).toBe('group');
    });
    it('with label bounds', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.GROUP), newLabel({ name: 'Roboto' }, new Bounds(50, 50, 100, 100)));
      expect(computeStyle(shape)).toBe('group;fontFamily=Roboto;verticalAlign=top;align=center;labelWidth=101;labelPosition=ignore;verticalLabelPosition=middle');
    });
  });

  describe('compute style - pool references a Process', () => {
    it.each([
      ['vertical', false, '1'],
      ['horizontal', true, '0'],
    ])('%s pool references a Process', (title: string, isHorizontal: boolean, expected: string) => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.POOL), undefined, isHorizontal);
      expect(computeStyle(shape)).toBe(`pool;horizontal=${expected}`);
    });
  });

  describe('compute style - lane', () => {
    it.each([
      ['vertical', false, '1'],
      ['horizontal', true, '0'],
    ])('%s lane', (title: string, isHorizontal: boolean, expected: string) => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.LANE), undefined, isHorizontal);
      expect(computeStyle(shape)).toBe(`lane;horizontal=${expected}`);
    });
  });

  describe.each([
    [ShapeBpmnElementKind.CALL_ACTIVITY],
    [ShapeBpmnElementKind.SUB_PROCESS],
    // To uncomment when it's supported
    // [ShapeBpmnElementKind.SUB_PROCESS_AD_HOC], // this is a special case, as an additional marker should be added
    // [ShapeBpmnElementKind.SUB_PROCESS_TRANSACTION],
    [ShapeBpmnElementKind.TASK],
    [ShapeBpmnElementKind.TASK_SERVICE],
    [ShapeBpmnElementKind.TASK_USER],
    [ShapeBpmnElementKind.TASK_RECEIVE],
    [ShapeBpmnElementKind.TASK_SEND],
    [ShapeBpmnElementKind.TASK_MANUAL],
    [ShapeBpmnElementKind.TASK_SCRIPT],
    [ShapeBpmnElementKind.TASK_BUSINESS_RULE],
  ])('compute style - markers for %s', (bpmnKind: ShapeBpmnElementKind) => {
    describe.each([[ShapeBpmnMarkerKind.LOOP], [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL], [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL]])(
      `compute style - %s marker for ${bpmnKind}`,
      (markerKind: ShapeBpmnMarkerKind) => {
        it(`${bpmnKind} with ${markerKind} marker`, () => {
          const shape = newShape(newShapeBpmnActivity(bpmnKind, [markerKind]), newLabel({ name: 'Arial' }));
          const additionalReceiveTaskStyle = bpmnKind === ShapeBpmnElementKind.TASK_RECEIVE ? ';bpmn.isInstantiating=false' : '';
          expect(computeStyle(shape)).toBe(`${bpmnKind}${additionalReceiveTaskStyle};bpmn.markers=${markerKind};fontFamily=Arial`);
        });

        if (bpmnKind == ShapeBpmnElementKind.SUB_PROCESS) {
          it(`${bpmnKind} with Loop & Expand (collapsed) markers`, () => {
            const shape = newShape(newShapeBpmnSubProcess(ShapeBpmnSubProcessKind.EMBEDDED, [markerKind, ShapeBpmnMarkerKind.EXPAND]));
            expect(computeStyle(shape)).toBe(`subProcess;bpmn.subProcessKind=embedded;bpmn.markers=${markerKind},expand`);
          });
        }

        if (bpmnKind == ShapeBpmnElementKind.CALL_ACTIVITY) {
          it(`${bpmnKind} calling process with ${markerKind} & Expand (collapsed) markers`, () => {
            const shape = newShape(newShapeBpmnCallActivityCallingProcess([markerKind, ShapeBpmnMarkerKind.EXPAND]));
            expect(computeStyle(shape)).toBe(`callActivity;bpmn.markers=${markerKind},expand`);
          });

          it.each([
            [ShapeBpmnElementKind.GLOBAL_TASK as GlobalTaskKind],
            [ShapeBpmnElementKind.GLOBAL_TASK_MANUAL as GlobalTaskKind],
            [ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT as GlobalTaskKind],
            [ShapeBpmnElementKind.GLOBAL_TASK_USER as GlobalTaskKind],
            [ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE as GlobalTaskKind],
          ])(`${bpmnKind} calling global task with ${markerKind} marker`, (globalTaskKind: GlobalTaskKind) => {
            const shape = newShape(newShapeBpmnCallActivityCallingGlobalTask(globalTaskKind, [markerKind]));
            expect(computeStyle(shape)).toBe(`callActivity;bpmn.globalTaskKind=${globalTaskKind};bpmn.markers=${markerKind}`);
          });
        }
      },
    );
  });

  describe('compute style - event-based gateway', () => {
    it.each`
      instantiate  | gatewayKind
      ${undefined} | ${undefined}
      ${false}     | ${undefined}
      ${true}      | ${undefined}
      ${true}      | ${'Exclusive'}
      ${true}      | ${'Parallel'}
    `(
      'event-based gateway when instantiate: $instantiate for gatewayKind: $gatewayKind',
      ({ instantiate, gatewayKind }: { instantiate: boolean; gatewayKind: ShapeBpmnEventBasedGatewayKind }) => {
        const shape = newShape(newShapeBpmnEventBasedGateway(instantiate, gatewayKind), newLabel({ name: 'Arial' }));
        gatewayKind ??= ShapeBpmnEventBasedGatewayKind.None;
        expect(computeStyle(shape)).toBe(`eventBasedGateway;bpmn.isInstantiating=${!!instantiate};bpmn.gatewayKind=${gatewayKind};fontFamily=Arial`);
      },
    );
  });

  describe('compute style - colors', () => {
    describe.each([[undefined], [false], [true]])(`Ignore BPMN colors: %s`, (ignoreBpmnColors: boolean) => {
      // 'undefined' RendererOptions tested in other tests in this file
      const styleComputer = new StyleComputer(ignoreBpmnColors === undefined ? {} : { ignoreBpmnColors: ignoreBpmnColors });
      const expectAdditionalColorsStyle = !(ignoreBpmnColors ?? true);

      function computeStyleWithRendererOptions(element: Shape | Edge): string {
        return styleComputer.computeStyle(element, element.label?.bounds);
      }

      function computeMessageFlowIconStyleWithRendererOptions(edge: Edge): string {
        return styleComputer.computeMessageFlowIconStyle(edge);
      }

      describe('shapes', () => {
        it.each(Object.values(ShapeUtil.flowNodeKinds()))('%s', (kind: ShapeBpmnElementKind) => {
          const shape = newShape(newShapeBpmnElement(kind), newLabelExtension('#010101'));
          shape.extensions.fillColor = '#000003';
          shape.extensions.strokeColor = '#FF0203';
          const additionalColorsStyle = expectAdditionalColorsStyle ? ';fillColor=#000003;strokeColor=#FF0203;fontColor=#010101' : '';
          expect(computeStyleWithRendererOptions(shape)).toBe(`${kind}${additionalColorsStyle}`);
        });
        it.each([ShapeBpmnElementKind.LANE, ShapeBpmnElementKind.POOL])('%s', (kind: ShapeBpmnElementKind) => {
          const shape = newShape(newShapeBpmnElement(kind), newLabelExtension('#aa0101'));
          shape.extensions.fillColor = '#AA0003';
          shape.extensions.strokeColor = '#FF02AA';
          const additionalColorsStyle = expectAdditionalColorsStyle ? ';fillColor=#AA0003;swimlaneFillColor=#AA0003;strokeColor=#FF02AA;fontColor=#aa0101' : '';
          expect(computeStyleWithRendererOptions(shape)).toBe(`${kind};horizontal=1${additionalColorsStyle}`);
        });
        it('no extension', () => {
          const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.TASK));
          expect(computeStyleWithRendererOptions(shape)).toBe(`task`);
        });
      });

      describe('edges', () => {
        it('sequence flow', () => {
          const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.DEFAULT), undefined, newLabelExtension('#aaaaaa'));
          edge.extensions.strokeColor = '#111111';
          const additionalColorsStyle = expectAdditionalColorsStyle ? ';strokeColor=#111111;fontColor=#aaaaaa' : '';
          expect(computeStyleWithRendererOptions(edge)).toBe(`sequenceFlow;default${additionalColorsStyle}`);
        });
        it('message flow', () => {
          const edge = new Edge('id', newMessageFlow(), undefined, newLabelExtension('#aaaabb'));
          edge.extensions.strokeColor = '#1111bb';
          const additionalColorsStyle = expectAdditionalColorsStyle ? ';strokeColor=#1111bb;fontColor=#aaaabb' : '';
          expect(computeStyleWithRendererOptions(edge)).toBe(`messageFlow${additionalColorsStyle}`);
        });
        it('message flow icon', () => {
          const edge = new Edge('id', newMessageFlow());
          edge.extensions.strokeColor = '#11aabb';
          const additionalColorsStyle = expectAdditionalColorsStyle ? ';strokeColor=#11aabb' : '';
          expect(computeMessageFlowIconStyleWithRendererOptions(edge)).toBe(`shape=bpmn.messageFlowIcon;bpmn.isInitiating=false${additionalColorsStyle}`);
        });
        it('association flow', () => {
          const edge = new Edge('id', newAssociationFlow(AssociationDirectionKind.ONE), undefined, newLabelExtension('#aaaacc'));
          edge.extensions.strokeColor = '#1111cc';
          const additionalColorsStyle = expectAdditionalColorsStyle ? ';strokeColor=#1111cc;fontColor=#aaaacc' : '';
          expect(computeStyleWithRendererOptions(edge)).toBe(`association;One${additionalColorsStyle}`);
        });
      });
    });
  });
});
