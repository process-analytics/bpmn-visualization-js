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

import type { ShapeValue } from '@maxgraph/core';
import type { BPMNCellStyle } from '@lib/component/mxgraph/renderer/StyleComputer';
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
  FlowKind,
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
import { getExpectedMarkers } from '../../../helpers/bpmn-model-expect';

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

// TODO maxgraph@0.1.0 order properties alphabetically in expected style

describe('Style Computer', () => {
  // use a shared instance to check that there is no state stored in the implementation
  const styleComputer = new StyleComputer();

  // shortcut as the current computeStyle implementation requires to pass the BPMN label bounds as extra argument
  function computeStyle(bpmnCell: Shape | Edge): BPMNCellStyle {
    return styleComputer.computeStyle(bpmnCell, bpmnCell.label?.bounds);
  }

  describe('compute style - shape label', () => {
    it('compute style of shape with no label', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.TASK_USER));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{ baseStyleNames: ['userTask'], bpmn: { kind: ShapeBpmnElementKind.TASK_USER } });
    });

    it('compute style of shape with a no font label', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_END), undefined, new Label(undefined, undefined));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{ baseStyleNames: ['endEvent'], bpmn: { kind: ShapeBpmnElementKind.EVENT_END } });
    });

    it('compute style of shape with label including bold font', () => {
      const shape = new Shape(
        'id',
        newShapeBpmnElement(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE),
        undefined,
        new Label(toFont({ name: 'Courier', size: 9, isBold: true }), undefined),
      );
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['exclusiveGateway'],
        fontFamily: 'Courier',
        fontSize: 9,
        fontStyle: 1,
        bpmn: { kind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE },
      });
    });

    it('compute style of shape with label including italic font', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH), undefined, new Label(toFont({ name: 'Arial', isItalic: true }), undefined));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['intermediateCatchEvent'],
        fontFamily: 'Arial',
        fontStyle: 2,
        bpmn: { kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH },
      });
    });

    it('compute style of shape with label including bold/italic font', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW), undefined, new Label(toFont({ isBold: true, isItalic: true }), undefined));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['intermediateThrowEvent'],
        fontStyle: 3,
        bpmn: { kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW },
      });
    });

    it('compute style of shape with label including font family only', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.TASK_SCRIPT), undefined, new Label(toFont({ name: 'Roboto' }), undefined));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['scriptTask'],
        fontFamily: 'Roboto',
        bpmn: { kind: ShapeBpmnElementKind.TASK_SCRIPT },
      });
    });

    it('compute style of shape with label bounds', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.CALL_ACTIVITY), undefined, new Label(undefined, new Bounds(40, 200, 80, 140)));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['callActivity'],
        align: 'center',
        verticalAlign: 'top',
        labelWidth: 81,
        labelPosition: 'ignore',
        verticalLabelPosition: 'middle',
        bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY },
      });
    });
  });

  describe('compute style - edge label', () => {
    it('compute style of edge with no label', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.CONDITIONAL_FROM_GATEWAY));
      expect(computeStyle(edge)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['sequenceFlow', 'conditional_from_gateway'],
        bpmn: { kind: FlowKind.SEQUENCE_FLOW },
      });
    });

    it('compute style of edge with a no font label', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.NORMAL), undefined, new Label(undefined, undefined));
      expect(computeStyle(edge)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['sequenceFlow', 'normal'],
        bpmn: { kind: FlowKind.SEQUENCE_FLOW },
      });
    });

    it('compute style of edge with label including strike-through font', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY), undefined, new Label(toFont({ size: 14.2, isStrikeThrough: true }), undefined));
      expect(computeStyle(edge)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['sequenceFlow', 'conditional_from_activity'],
        fontSize: 14.2,
        fontStyle: 8,
        bpmn: { kind: FlowKind.SEQUENCE_FLOW },
      });
    });

    it('compute style of edge with label including underline font', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.DEFAULT), undefined, new Label(toFont({ isUnderline: true }), undefined));
      expect(computeStyle(edge)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['sequenceFlow', 'default'],
        fontStyle: 4,
        bpmn: { kind: FlowKind.SEQUENCE_FLOW },
      });
    });

    it('compute style of edge with label including bold/italic/strike-through/underline font', () => {
      const edge = new Edge(
        'id',
        newSequenceFlow(SequenceFlowKind.NORMAL),
        undefined,
        new Label(toFont({ isBold: true, isItalic: true, isStrikeThrough: true, isUnderline: true }), undefined),
      );
      expect(computeStyle(edge)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['sequenceFlow', 'normal'],
        fontStyle: 15,
        bpmn: { kind: FlowKind.SEQUENCE_FLOW },
      });
    });

    it('compute style of edge with label bounds', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.NORMAL), undefined, new Label(toFont({ name: 'Helvetica' }), new Bounds(20, 20, 30, 120)));
      expect(computeStyle(edge)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['sequenceFlow', 'normal'],
        fontFamily: 'Helvetica',
        align: 'center',
        verticalAlign: 'top',
        bpmn: { kind: FlowKind.SEQUENCE_FLOW },
      });
    });
  });

  it.each([
    [SequenceFlowKind.CONDITIONAL_FROM_GATEWAY, 'conditional_from_gateway'],
    [SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY, 'conditional_from_activity'],
    [SequenceFlowKind.DEFAULT, 'default'],
    [SequenceFlowKind.NORMAL, 'normal'],
  ])('compute style - sequence flows: %s', (kind: SequenceFlowKind, expected: string) => {
    const edge = new Edge('id', newSequenceFlow(kind));
    expect(computeStyle(edge)).toStrictEqual(<BPMNCellStyle>{
      baseStyleNames: ['sequenceFlow', expected],
      bpmn: { kind: FlowKind.SEQUENCE_FLOW },
    });
  });

  it.each([
    [AssociationDirectionKind.NONE, 'None'],
    [AssociationDirectionKind.ONE, 'One'],
    [AssociationDirectionKind.BOTH, 'Both'],
  ])('compute style - association flows: %s', (kind: AssociationDirectionKind, expected: string) => {
    const edge = new Edge('id', newAssociationFlow(kind));
    expect(computeStyle(edge)).toStrictEqual(<BPMNCellStyle>{
      baseStyleNames: ['association', expected],
      bpmn: { kind: FlowKind.ASSOCIATION_FLOW },
    });
  });

  it.each([
    [MessageVisibleKind.NON_INITIATING, false],
    [MessageVisibleKind.INITIATING, true],
  ])('compute style - message flow icon: %s', (messageVisibleKind: MessageVisibleKind, expected: boolean) => {
    const edge = new Edge('id', newMessageFlow(), undefined, undefined, messageVisibleKind);
    expect(styleComputer.computeMessageFlowIconStyle(edge)).toStrictEqual(<BPMNCellStyle>{
      bpmn: { isInitiating: expected },
      // TODO maxgraph@0.1.0 remove forcing type when maxGraph fixes its types
      shape: <ShapeValue>'bpmn.messageFlowIcon',
    });
  });

  describe('compute style - events kind', () => {
    it('intermediate catch conditional', () => {
      const shape = newShape(newShapeBpmnEvent(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, ShapeBpmnEventDefinitionKind.CONDITIONAL), newLabel({ name: 'Ubuntu' }));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['intermediateCatchEvent'],
        fontFamily: 'Ubuntu',
        bpmn: { kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL },
      });
    });

    it('start signal', () => {
      const shape = newShape(newShapeBpmnEvent(ShapeBpmnElementKind.EVENT_START, ShapeBpmnEventDefinitionKind.SIGNAL), newLabel({ isBold: true }));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['startEvent'],
        fontStyle: 1,
        bpmn: { kind: ShapeBpmnElementKind.EVENT_START, eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL },
      });
    });
  });

  describe('compute style - boundary events', () => {
    it('interrupting message', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventDefinitionKind.MESSAGE, true), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['boundaryEvent'],
        fontFamily: 'Arial',
        bpmn: { kind: ShapeBpmnElementKind.EVENT_BOUNDARY, eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE, isInterrupting: true },
      });
    });

    it('non interrupting timer', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventDefinitionKind.TIMER, false), newLabel({ isItalic: true }));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['boundaryEvent'],
        fontStyle: 2,
        bpmn: { kind: ShapeBpmnElementKind.EVENT_BOUNDARY, eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER, isInterrupting: false },
      });
    });

    it('cancel with undefined interrupting value', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventDefinitionKind.CANCEL, undefined), newLabel({ isStrikeThrough: true }));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['boundaryEvent'],
        fontStyle: 8,
        bpmn: { kind: ShapeBpmnElementKind.EVENT_BOUNDARY, eventDefinitionKind: ShapeBpmnEventDefinitionKind.CANCEL, isInterrupting: true },
      });
    });
  });

  describe('compute style - event sub-process start event', () => {
    it('interrupting message', () => {
      const shape = newShape(newShapeBpmnStartEvent(ShapeBpmnEventDefinitionKind.MESSAGE, true), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['startEvent'],
        fontFamily: 'Arial',
        bpmn: { kind: ShapeBpmnElementKind.EVENT_START, eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE, isInterrupting: true },
      });
    });

    it('non interrupting timer', () => {
      const shape = newShape(newShapeBpmnStartEvent(ShapeBpmnEventDefinitionKind.TIMER, false), newLabel({ isItalic: true }));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['startEvent'],
        fontStyle: 2,
        bpmn: { kind: ShapeBpmnElementKind.EVENT_START, eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER, isInterrupting: false },
      });
    });

    it('cancel with undefined interrupting value', () => {
      const shape = newShape(newShapeBpmnStartEvent(ShapeBpmnEventDefinitionKind.CANCEL, undefined), newLabel({ isStrikeThrough: true }));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['startEvent'],
        fontStyle: 8,
        bpmn: { kind: ShapeBpmnElementKind.EVENT_START, eventDefinitionKind: ShapeBpmnEventDefinitionKind.CANCEL },
      });
    });
  });

  describe('compute style - sub-processes', () => {
    describe.each([
      ['expanded', []],
      ['collapsed', [ShapeBpmnMarkerKind.EXPAND]],
    ])(`%s`, (expandKind: string, markers: ShapeBpmnMarkerKind[]) => {
      describe.each(Object.values(ShapeBpmnSubProcessKind))(`%s`, (subProcessKind: ShapeBpmnSubProcessKind) => {
        markers = getExpectedMarkers(markers, subProcessKind);

        it(`${subProcessKind} sub-process without label bounds`, () => {
          const shape = newShape(newShapeBpmnSubProcess(subProcessKind, markers), newLabel({ name: 'Arial' }));
          const expectedStyle = <BPMNCellStyle>{
            baseStyleNames: ['subProcess'],
            bpmn: { kind: ShapeBpmnElementKind.SUB_PROCESS, subProcessKind, markers },
            fontFamily: 'Arial',
          };
          !markers.includes(ShapeBpmnMarkerKind.EXPAND) && (expectedStyle.verticalAlign = 'top');

          expect(computeStyle(shape)).toStrictEqual(expectedStyle);
        });

        it(`${subProcessKind} sub-process with label bounds`, () => {
          const shape = newShape(newShapeBpmnSubProcess(subProcessKind, markers), newLabel({ name: 'sans-serif' }, new Bounds(20, 20, 300, 200)));
          expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
            align: 'center',
            baseStyleNames: ['subProcess'],
            bpmn: { kind: ShapeBpmnElementKind.SUB_PROCESS, subProcessKind, markers },
            fontFamily: 'sans-serif',
            labelWidth: 301,
            verticalAlign: 'top',
            labelPosition: 'ignore',
            verticalLabelPosition: 'middle',
          });
        });
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
          const expectedStyle = <BPMNCellStyle>{
            baseStyleNames: ['callActivity'],
            bpmn: {
              kind: ShapeBpmnElementKind.CALL_ACTIVITY,
              globalTaskKind: undefined, // TODO maxgraph@0.1.0 decide if we set globalTaskKind to undefined or if we omit the property
              markers,
            },
            fontFamily: 'Arial',
          };
          !markers.includes(ShapeBpmnMarkerKind.EXPAND) && (expectedStyle.verticalAlign = 'top');
          expect(computeStyle(shape)).toStrictEqual(expectedStyle);
        });

        it(`${expandKind} call activity with label bounds`, () => {
          const shape = newShape(newShapeBpmnCallActivityCallingProcess(markers), newLabel({ name: 'sans-serif' }, new Bounds(20, 20, 300, 200)));
          expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
            align: 'center',
            baseStyleNames: ['callActivity'],
            bpmn: {
              kind: ShapeBpmnElementKind.CALL_ACTIVITY,
              globalTaskKind: undefined, // TODO maxgraph@0.1.0 decide if we set globalTaskKind to undefined or if we omit the property
              markers,
            },
            fontFamily: 'sans-serif',
            labelWidth: 301,
            verticalAlign: 'top',
            labelPosition: 'ignore',
            verticalLabelPosition: 'middle',
          });
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
          const expectedStyle = <BPMNCellStyle>{
            baseStyleNames: ['callActivity'],
            bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY, globalTaskKind: globalTaskKind, markers: [] },
            fontFamily: 'Arial',
          };
          expect(computeStyle(shape)).toStrictEqual(expectedStyle);
        });

        it(`call activity calling ${globalTaskKind} with label bounds`, () => {
          const shape = newShape(newShapeBpmnCallActivityCallingGlobalTask(globalTaskKind), newLabel({ name: 'sans-serif' }, new Bounds(20, 20, 300, 200)));
          expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
            align: 'center',
            baseStyleNames: ['callActivity'],
            bpmn: {
              globalTaskKind: globalTaskKind,
              kind: ShapeBpmnElementKind.CALL_ACTIVITY,
              markers: [],
            },
            fontFamily: 'sans-serif',
            labelWidth: 301,
            verticalAlign: 'top',
            labelPosition: 'ignore',
            verticalLabelPosition: 'middle',
          });
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
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['receiveTask'],
        bpmn: { kind: ShapeBpmnElementKind.TASK_RECEIVE, isInstantiating: instantiate, markers: [] },
        fontFamily: 'Arial',
      });
    });
  });

  describe('compute style - text annotation', () => {
    it('without label', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.TEXT_ANNOTATION));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['textAnnotation'],
        bpmn: { kind: ShapeBpmnElementKind.TEXT_ANNOTATION },
      });
    });
    it('with label bounds', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.TEXT_ANNOTATION), newLabel({ name: 'Segoe UI' }, new Bounds(50, 50, 100, 100)));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['textAnnotation'],
        bpmn: {
          kind: ShapeBpmnElementKind.TEXT_ANNOTATION,
        },
        fontFamily: 'Segoe UI',
        labelWidth: 101,
        verticalAlign: 'top',
        labelPosition: 'ignore',
        verticalLabelPosition: 'middle',
      });
    });
  });

  describe('compute style - group', () => {
    it('without label', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.GROUP));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['group'],
        bpmn: { kind: ShapeBpmnElementKind.GROUP },
      });
    });
    it('with label bounds', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.GROUP), newLabel({ name: 'Roboto' }, new Bounds(50, 50, 100, 100)));
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        align: 'center',
        baseStyleNames: ['group'],
        bpmn: {
          kind: ShapeBpmnElementKind.GROUP,
        },
        fontFamily: 'Roboto',
        labelPosition: 'ignore',
        labelWidth: 101,
        verticalAlign: 'top',
        verticalLabelPosition: 'middle',
      });
    });
  });

  describe('compute style - pool references a Process', () => {
    it.each([
      ['vertical', false, true],
      ['horizontal', true, false],
      ['undefined', undefined, true], // the parser set a default value in the shape, so this shouldn't be used
    ])('%s pool references a Process', (title: string, isHorizontal: boolean, expectedStyleIsHorizontal: boolean) => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.POOL), undefined, isHorizontal);
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['pool'],
        horizontal: expectedStyleIsHorizontal,
        bpmn: { kind: ShapeBpmnElementKind.POOL },
      });
    });
  });

  describe('compute style - lane', () => {
    it.each([
      ['vertical', false, true],
      ['horizontal', true, false],
      ['undefined', undefined, true], // the parser set a default value in the shape, so this shouldn't be used
    ])('%s lane', (title: string, isHorizontal: boolean, expectedStyleIsHorizontal: boolean) => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.LANE), undefined, isHorizontal);
      expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
        baseStyleNames: ['lane'],
        horizontal: expectedStyleIsHorizontal,
        bpmn: { kind: ShapeBpmnElementKind.LANE },
      });
    });
  });

  describe.each([
    [ShapeBpmnElementKind.CALL_ACTIVITY],
    [ShapeBpmnElementKind.SUB_PROCESS],
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
          const expectedStyle = <BPMNCellStyle>{
            baseStyleNames: [bpmnKind],
            bpmn: { kind: bpmnKind, markers: [markerKind] },
            fontFamily: 'Arial',
          };
          bpmnKind === ShapeBpmnElementKind.TASK_RECEIVE && (expectedStyle.bpmn.isInstantiating = false);
          expect(computeStyle(shape)).toStrictEqual(expectedStyle);
        });

        if (bpmnKind == ShapeBpmnElementKind.SUB_PROCESS) {
          it.each(Object.values(ShapeBpmnSubProcessKind))(`%s subProcess with Loop & Expand (collapsed) markers`, (subProcessKind: ShapeBpmnSubProcessKind) => {
            const markers = [markerKind, ShapeBpmnMarkerKind.EXPAND];
            const shape = newShape(newShapeBpmnSubProcess(subProcessKind, markers));
            expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
              baseStyleNames: ['subProcess'],
              bpmn: { kind: ShapeBpmnElementKind.SUB_PROCESS, markers: getExpectedMarkers(markers, subProcessKind), subProcessKind },
            });
          });
        }

        if (bpmnKind == ShapeBpmnElementKind.CALL_ACTIVITY) {
          it(`${bpmnKind} calling process with ${markerKind} & Expand (collapsed) markers`, () => {
            const shape = newShape(newShapeBpmnCallActivityCallingProcess([markerKind, ShapeBpmnMarkerKind.EXPAND]));
            expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
              baseStyleNames: ['callActivity'],
              bpmn: {
                kind: ShapeBpmnElementKind.CALL_ACTIVITY,
                globalTaskKind: undefined, // TODO maxgraph@0.1.0 decide if we omit the globalTaskKind property when not set
                markers: [markerKind, ShapeBpmnMarkerKind.EXPAND],
              },
            });
          });

          it.each([
            [ShapeBpmnElementKind.GLOBAL_TASK as GlobalTaskKind],
            [ShapeBpmnElementKind.GLOBAL_TASK_MANUAL as GlobalTaskKind],
            [ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT as GlobalTaskKind],
            [ShapeBpmnElementKind.GLOBAL_TASK_USER as GlobalTaskKind],
            [ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE as GlobalTaskKind],
          ])(`${bpmnKind} calling global task with ${markerKind} marker`, (globalTaskKind: GlobalTaskKind) => {
            const shape = newShape(newShapeBpmnCallActivityCallingGlobalTask(globalTaskKind, [markerKind]));
            expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
              baseStyleNames: ['callActivity'],
              bpmn: {
                kind: ShapeBpmnElementKind.CALL_ACTIVITY,
                globalTaskKind,
                markers: [markerKind],
              },
            });
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
        expect(computeStyle(shape)).toStrictEqual(<BPMNCellStyle>{
          baseStyleNames: ['eventBasedGateway'],
          bpmn: { kind: ShapeBpmnElementKind.GATEWAY_EVENT_BASED, gatewayKind, isInstantiating: !!instantiate },
          fontFamily: 'Arial',
        });
      },
    );
  });

  describe('compute style - colors', () => {
    describe.each([[undefined], [false], [true]])(`Ignore BPMN colors: %s`, (ignoreBpmnColors: boolean) => {
      // 'undefined' RendererOptions tested in other tests in this file
      const styleComputer = new StyleComputer(ignoreBpmnColors === undefined ? {} : { ignoreBpmnColors: ignoreBpmnColors });
      const expectAdditionalColorsStyle = !(ignoreBpmnColors ?? true);

      function computeStyleWithRendererOptions(element: Shape | Edge): BPMNCellStyle {
        return styleComputer.computeStyle(element, element.label?.bounds);
      }

      function computeMessageFlowIconStyleWithRendererOptions(edge: Edge): BPMNCellStyle {
        return styleComputer.computeMessageFlowIconStyle(edge);
      }

      describe('shapes', () => {
        it.each(Object.values(ShapeUtil.flowNodeKinds()))('%s', (kind: ShapeBpmnElementKind) => {
          const shape = newShape(newShapeBpmnElement(kind), newLabelExtension('#010101'));
          shape.extensions.fillColor = '#000003';
          shape.extensions.strokeColor = '#FF0203';
          const expectedStyle = <BPMNCellStyle>{
            baseStyleNames: [kind],
            bpmn: { kind: kind },
          };
          if (expectAdditionalColorsStyle) {
            expectedStyle.fillColor = '#000003';
            expectedStyle.fontColor = '#010101';
            expectedStyle.strokeColor = '#FF0203';
          }
          expect(computeStyleWithRendererOptions(shape)).toStrictEqual(expectedStyle);
        });
        it.each([ShapeBpmnElementKind.LANE, ShapeBpmnElementKind.POOL])('%s', (kind: ShapeBpmnElementKind) => {
          const shape = newShape(newShapeBpmnElement(kind), newLabelExtension('#aa0101'), true);
          shape.extensions.fillColor = '#AA0003';
          shape.extensions.strokeColor = '#FF02AA';
          const expectedStyle = <BPMNCellStyle>{
            baseStyleNames: [kind],
            bpmn: { kind: kind },
            horizontal: false,
          };
          if (expectAdditionalColorsStyle) {
            expectedStyle.fillColor = '#AA0003';
            expectedStyle.fontColor = '#aa0101';
            expectedStyle.strokeColor = '#FF02AA';
            expectedStyle.swimlaneFillColor = '#AA0003';
          }
          expect(computeStyleWithRendererOptions(shape)).toStrictEqual(expectedStyle);
        });
        it('no extension', () => {
          const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.TASK));
          expect(computeStyleWithRendererOptions(shape)).toStrictEqual(<BPMNCellStyle>{
            baseStyleNames: ['task'],
            bpmn: { kind: ShapeBpmnElementKind.TASK },
          });
        });
      });

      describe('edges', () => {
        it('sequence flow', () => {
          const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.DEFAULT), undefined, newLabelExtension('#aaaaaa'));
          edge.extensions.strokeColor = '#111111';
          const expectedStyle = <BPMNCellStyle>{
            baseStyleNames: ['sequenceFlow', 'default'],
            bpmn: { kind: FlowKind.SEQUENCE_FLOW },
          };
          if (expectAdditionalColorsStyle) {
            expectedStyle.fontColor = '#aaaaaa';
            expectedStyle.strokeColor = '#111111';
          }

          expect(computeStyleWithRendererOptions(edge)).toStrictEqual(expectedStyle);
        });
        it('message flow', () => {
          const edge = new Edge('id', newMessageFlow(), undefined, newLabelExtension('#aaaabb'));
          edge.extensions.strokeColor = '#1111bb';
          const expectedStyle = <BPMNCellStyle>{
            baseStyleNames: ['messageFlow'],
            bpmn: { kind: FlowKind.MESSAGE_FLOW },
          };
          if (expectAdditionalColorsStyle) {
            expectedStyle.fontColor = '#aaaabb';
            expectedStyle.strokeColor = '#1111bb';
          }
          expect(computeStyleWithRendererOptions(edge)).toStrictEqual(expectedStyle);
        });
        it('message flow icon', () => {
          const edge = new Edge('id', newMessageFlow());
          edge.extensions.strokeColor = '#11aabb';
          const expectedStyle = <BPMNCellStyle>{
            bpmn: { isInitiating: false },
            // TODO maxGraph@0.1.0 force conversion to ShapeValue + decide if we use BpmnStyleIdentifier const instead
            shape: <ShapeValue>'bpmn.messageFlowIcon',
          };
          if (expectAdditionalColorsStyle) {
            expectedStyle.strokeColor = '#11aabb';
          }
          expect(computeMessageFlowIconStyleWithRendererOptions(edge)).toStrictEqual(expectedStyle);
        });
        it('association flow', () => {
          const edge = new Edge('id', newAssociationFlow(AssociationDirectionKind.ONE), undefined, newLabelExtension('#aaaacc'));
          edge.extensions.strokeColor = '#1111cc';
          const expectedStyle = <BPMNCellStyle>{
            baseStyleNames: ['association', 'One'],
            bpmn: { kind: FlowKind.ASSOCIATION_FLOW },
          };
          if (expectAdditionalColorsStyle) {
            expectedStyle.fontColor = '#aaaacc';
            expectedStyle.strokeColor = '#1111cc';
          }
          expect(computeStyleWithRendererOptions(edge)).toStrictEqual(expectedStyle);
        });
      });
    });
  });
});
