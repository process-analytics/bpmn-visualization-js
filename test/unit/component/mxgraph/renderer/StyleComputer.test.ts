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

import type { ExpectedFont } from '../../../helpers/bpmn-model-expect';
import type { BpmnCellStyle } from '@lib/component/mxgraph/style/types';
import type { BpmnEventKind, GlobalTaskKind } from '@lib/model/bpmn/internal';

import { getExpectedMarkers } from '../../../helpers/bpmn-model-expect';

import StyleComputer from '@lib/component/mxgraph/renderer/StyleComputer';
import {
  FlowKind,
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
import Bounds from '@lib/model/bpmn/internal/Bounds';
import { Edge } from '@lib/model/bpmn/internal/edge/edge';
import { AssociationFlow, MessageFlow, SequenceFlow } from '@lib/model/bpmn/internal/edge/flows';
import Label, { Font } from '@lib/model/bpmn/internal/Label';
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
  function computeStyle(bpmnCell: Shape | Edge): BpmnCellStyle {
    return styleComputer.computeStyle(bpmnCell, bpmnCell.label?.bounds);
  }

  describe('compute style - shape label', () => {
    it('compute style of shape with no label', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.TASK_USER));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['userTask'], bpmn: { kind: ShapeBpmnElementKind.TASK_USER } });
    });

    it('compute style of shape with a no font label', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_END), undefined, new Label(undefined, undefined));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['endEvent'], bpmn: { kind: ShapeBpmnElementKind.EVENT_END } });
    });
    it('compute style of shape with label including bold font', () => {
      const shape = new Shape(
        'id',
        newShapeBpmnElement(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE),
        undefined,
        new Label(toFont({ name: 'Courier', size: 9, isBold: true }), undefined),
      );
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['exclusiveGateway'],
        bpmn: { kind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE },
        fontFamily: 'Courier',
        fontSize: 9,
        fontStyle: 1,
      });
    });

    it('compute style of shape with label including italic font', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH), undefined, new Label(toFont({ name: 'Arial', isItalic: true }), undefined));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['intermediateCatchEvent'],
        bpmn: { kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH },
        fontFamily: 'Arial',
        fontStyle: 2,
      });
    });

    it('compute style of shape with label including bold/italic font', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW), undefined, new Label(toFont({ isBold: true, isItalic: true }), undefined));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['intermediateThrowEvent'],
        bpmn: { kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW },
        fontStyle: 3,
      });
    });

    it('compute style of shape with label including font family only', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.TASK_SCRIPT), undefined, new Label(toFont({ name: 'Roboto' }), undefined));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['scriptTask'], bpmn: { kind: ShapeBpmnElementKind.TASK_SCRIPT }, fontFamily: 'Roboto' });
    });

    it('compute style of shape with label bounds', () => {
      const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.CALL_ACTIVITY), undefined, new Label(undefined, new Bounds(40, 200, 80, 140)));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['callActivity'],
        bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY },
        verticalAlign: 'top',
        align: 'center',
        labelWidth: 81,
        labelPosition: 'ignore',
        verticalLabelPosition: 'middle',
      });
    });
  });

  describe('compute style - edge label', () => {
    it('compute style of edge with no label', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.CONDITIONAL_FROM_GATEWAY));
      expect(computeStyle(edge)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['sequenceFlow', 'conditional_from_gateway'], bpmn: { kind: FlowKind.SEQUENCE_FLOW } });
    });

    it('compute style of edge with a no font label', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.NORMAL), undefined, new Label(undefined, undefined));
      expect(computeStyle(edge)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['sequenceFlow', 'normal'], bpmn: { kind: FlowKind.SEQUENCE_FLOW } });
    });

    it('compute style of edge with label including strike-through font', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY), undefined, new Label(toFont({ size: 14.2, isStrikeThrough: true }), undefined));
      expect(computeStyle(edge)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['sequenceFlow', 'conditional_from_activity'],
        bpmn: { kind: FlowKind.SEQUENCE_FLOW },
        fontSize: 14.2,
        fontStyle: 8,
      });
    });

    it('compute style of edge with label including underline font', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.DEFAULT), undefined, new Label(toFont({ isUnderline: true }), undefined));
      expect(computeStyle(edge)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['sequenceFlow', 'default'], bpmn: { kind: FlowKind.SEQUENCE_FLOW }, fontStyle: 4 });
    });

    it('compute style of edge with label including bold/italic/strike-through/underline font', () => {
      const edge = new Edge(
        'id',
        newSequenceFlow(SequenceFlowKind.NORMAL),
        undefined,
        new Label(toFont({ isBold: true, isItalic: true, isStrikeThrough: true, isUnderline: true }), undefined),
      );
      expect(computeStyle(edge)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['sequenceFlow', 'normal'], bpmn: { kind: FlowKind.SEQUENCE_FLOW }, fontStyle: 15 });
    });

    it('compute style of edge with label bounds', () => {
      const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.NORMAL), undefined, new Label(toFont({ name: 'Helvetica' }), new Bounds(20, 20, 30, 120)));
      expect(computeStyle(edge)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['sequenceFlow', 'normal'],
        bpmn: { kind: FlowKind.SEQUENCE_FLOW },
        fontFamily: 'Helvetica',
        verticalAlign: 'top',
        align: 'center',
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
    expect(computeStyle(edge)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['sequenceFlow', expected], bpmn: { kind: FlowKind.SEQUENCE_FLOW } });
  });

  it.each([
    [AssociationDirectionKind.NONE, 'None'],
    [AssociationDirectionKind.ONE, 'One'],
    [AssociationDirectionKind.BOTH, 'Both'],
  ])('compute style - association flows: %s', (kind: AssociationDirectionKind, expected: string) => {
    const edge = new Edge('id', newAssociationFlow(kind));
    expect(computeStyle(edge)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['association', expected], bpmn: { kind: FlowKind.ASSOCIATION_FLOW } });
  });

  it.each([
    [MessageVisibleKind.NON_INITIATING, false],
    [MessageVisibleKind.INITIATING, true],
  ])('compute style - message flow icon: %s', (messageVisibleKind: MessageVisibleKind, expected: boolean) => {
    const edge = new Edge('id', newMessageFlow(), undefined, undefined, messageVisibleKind);
    expect(styleComputer.computeMessageFlowIconStyle(edge)).toStrictEqual<BpmnCellStyle>({ shape: 'bpmn.messageFlowIcon', bpmn: { isInitiating: expected } });
  });

  describe('compute style - events kind', () => {
    it('intermediate catch conditional', () => {
      const shape = newShape(newShapeBpmnEvent(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, ShapeBpmnEventDefinitionKind.CONDITIONAL), newLabel({ name: 'Ubuntu' }));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['intermediateCatchEvent'],
        bpmn: { kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, eventDefinitionKind: ShapeBpmnEventDefinitionKind.CONDITIONAL },
        fontFamily: 'Ubuntu',
      });
    });

    it('start signal', () => {
      const shape = newShape(newShapeBpmnEvent(ShapeBpmnElementKind.EVENT_START, ShapeBpmnEventDefinitionKind.SIGNAL), newLabel({ isBold: true }));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['startEvent'],
        bpmn: { kind: ShapeBpmnElementKind.EVENT_START, eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL },
        fontStyle: 1,
      });
    });
  });
  describe('compute style - boundary events', () => {
    it('interrupting message', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventDefinitionKind.MESSAGE, true), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['boundaryEvent'],
        bpmn: { kind: ShapeBpmnElementKind.EVENT_BOUNDARY, eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE, isInterrupting: true },
        fontFamily: 'Arial',
      });
    });

    it('non interrupting timer', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventDefinitionKind.TIMER, false), newLabel({ isItalic: true }));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['boundaryEvent'],
        bpmn: { kind: ShapeBpmnElementKind.EVENT_BOUNDARY, eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER, isInterrupting: false },
        fontStyle: 2,
      });
    });

    it('cancel with undefined interrupting value', () => {
      const shape = newShape(newShapeBpmnBoundaryEvent(ShapeBpmnEventDefinitionKind.CANCEL, undefined), newLabel({ isStrikeThrough: true }));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['boundaryEvent'],
        bpmn: { kind: ShapeBpmnElementKind.EVENT_BOUNDARY, eventDefinitionKind: ShapeBpmnEventDefinitionKind.CANCEL, isInterrupting: true },
        fontStyle: 8,
      });
    });
  });

  describe('compute style - event sub-process start event', () => {
    it('interrupting message', () => {
      const shape = newShape(newShapeBpmnStartEvent(ShapeBpmnEventDefinitionKind.MESSAGE, true), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['startEvent'],
        bpmn: { kind: ShapeBpmnElementKind.EVENT_START, eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE, isInterrupting: true },
        fontFamily: 'Arial',
      });
    });

    it('non interrupting timer', () => {
      const shape = newShape(newShapeBpmnStartEvent(ShapeBpmnEventDefinitionKind.TIMER, false), newLabel({ isItalic: true }));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['startEvent'],
        bpmn: { kind: ShapeBpmnElementKind.EVENT_START, eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER, isInterrupting: false },
        fontStyle: 2,
      });
    });

    it('cancel with undefined interrupting value', () => {
      const shape = newShape(newShapeBpmnStartEvent(ShapeBpmnEventDefinitionKind.CANCEL, undefined), newLabel({ isStrikeThrough: true }));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['startEvent'],
        bpmn: { kind: ShapeBpmnElementKind.EVENT_START, eventDefinitionKind: ShapeBpmnEventDefinitionKind.CANCEL },
        fontStyle: 8,
      });
    });
  });

  describe('compute style - sub-processes', () => {
    describe.each([
      ['expanded', []],
      ['collapsed', [ShapeBpmnMarkerKind.EXPAND]],
    ])(`%s`, (_expandKind: string, markers: ShapeBpmnMarkerKind[]) => {
      describe.each(Object.values(ShapeBpmnSubProcessKind))(`%s`, (subProcessKind: ShapeBpmnSubProcessKind) => {
        markers = getExpectedMarkers(markers, subProcessKind);

        it(`${subProcessKind} sub-process without label bounds`, () => {
          const shape = newShape(newShapeBpmnSubProcess(subProcessKind, markers), newLabel({ name: 'Arial' }));
          const style: BpmnCellStyle = {
            baseStyleNames: ['subProcess'],
            bpmn: { kind: ShapeBpmnElementKind.SUB_PROCESS, subProcessKind, markers },
            fontFamily: 'Arial',
          };
          if (!markers.includes(ShapeBpmnMarkerKind.EXPAND)) {
            style.verticalAlign = 'top';
          }
          expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>(style);
        });

        it(`${subProcessKind} sub-process with label bounds`, () => {
          const shape = newShape(newShapeBpmnSubProcess(subProcessKind, markers), newLabel({ name: 'sans-serif' }, new Bounds(20, 20, 300, 200)));
          expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
            baseStyleNames: ['subProcess'],
            bpmn: { kind: ShapeBpmnElementKind.SUB_PROCESS, subProcessKind, markers },
            fontFamily: 'sans-serif',
            verticalAlign: 'top',
            align: 'center',
            labelWidth: 301,
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
          const style: BpmnCellStyle = {
            baseStyleNames: ['callActivity'],
            bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY, globalTaskKind: undefined, markers },
            fontFamily: 'Arial',
          };
          if (!markers.includes(ShapeBpmnMarkerKind.EXPAND)) {
            style.verticalAlign = 'top';
          }
          expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>(style);
        });

        it(`${expandKind} call activity with label bounds`, () => {
          const shape = newShape(newShapeBpmnCallActivityCallingProcess(markers), newLabel({ name: 'sans-serif' }, new Bounds(20, 20, 300, 200)));
          expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
            baseStyleNames: ['callActivity'],
            bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY, globalTaskKind: undefined, markers },
            fontFamily: 'sans-serif',
            verticalAlign: 'top',
            align: 'center',
            labelWidth: 301,
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
          expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
            baseStyleNames: ['callActivity'],
            bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY, globalTaskKind, markers: [] },
            fontFamily: 'Arial',
          });
        });

        it(`call activity calling ${globalTaskKind} with label bounds`, () => {
          const shape = newShape(newShapeBpmnCallActivityCallingGlobalTask(globalTaskKind), newLabel({ name: 'sans-serif' }, new Bounds(20, 20, 300, 200)));
          expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
            baseStyleNames: ['callActivity'],
            bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY, globalTaskKind, markers: [] },
            fontFamily: 'sans-serif',
            verticalAlign: 'top',
            align: 'center',
            labelWidth: 301,
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
    ])('%s receive task', (_instantiatingKind: string, instantiate: boolean) => {
      const shape = newShape(newShapeBpmnActivity(ShapeBpmnElementKind.TASK_RECEIVE, undefined, instantiate), newLabel({ name: 'Arial' }));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['receiveTask'],
        bpmn: { kind: ShapeBpmnElementKind.TASK_RECEIVE, isInstantiating: instantiate, markers: [] },
        fontFamily: 'Arial',
      });
    });
  });

  describe('compute style - text annotation', () => {
    it('without label', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.TEXT_ANNOTATION));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['textAnnotation'], bpmn: { kind: ShapeBpmnElementKind.TEXT_ANNOTATION } });
    });
    it('with label bounds', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.TEXT_ANNOTATION), newLabel({ name: 'Segoe UI' }, new Bounds(50, 50, 100, 100)));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['textAnnotation'],
        bpmn: { kind: ShapeBpmnElementKind.TEXT_ANNOTATION },
        fontFamily: 'Segoe UI',
        verticalAlign: 'top',
        labelWidth: 101,
        labelPosition: 'ignore',
        verticalLabelPosition: 'middle',
      });
    });
  });

  describe('compute style - group', () => {
    it('without label', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.GROUP));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['group'], bpmn: { kind: ShapeBpmnElementKind.GROUP } });
    });
    it('with label bounds', () => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.GROUP), newLabel({ name: 'Roboto' }, new Bounds(50, 50, 100, 100)));
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
        baseStyleNames: ['group'],
        bpmn: { kind: ShapeBpmnElementKind.GROUP },
        fontFamily: 'Roboto',
        verticalAlign: 'top',
        align: 'center',
        labelWidth: 101,
        labelPosition: 'ignore',
        verticalLabelPosition: 'middle',
      });
    });
  });

  describe('compute style - pool references a Process', () => {
    it.each([
      ['vertical', false, true],
      ['horizontal', true, false],
      ['no isHorizontal value for a', undefined, true],
    ])('%s pool references a Process', (_title: string, isHorizontal: boolean, expected: boolean) => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.POOL), undefined, isHorizontal);
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['pool'], bpmn: { kind: ShapeBpmnElementKind.POOL }, horizontal: expected });
    });
  });

  describe('compute style - lane', () => {
    it.each([
      ['vertical', false, true],
      ['horizontal', true, false],
      ['no isHorizontal value for a', undefined, true],
    ])('%s lane', (_title: string, isHorizontal: boolean, expected: boolean) => {
      const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.LANE), undefined, isHorizontal);
      expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['lane'], bpmn: { kind: ShapeBpmnElementKind.LANE }, horizontal: expected });
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
          const bpmn: BpmnCellStyle['bpmn'] = { kind: bpmnKind, markers: [markerKind] };
          if (bpmnKind === ShapeBpmnElementKind.TASK_RECEIVE) {
            bpmn.isInstantiating = false;
          }
          expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: [bpmnKind], bpmn, fontFamily: 'Arial' });
        });

        if (bpmnKind == ShapeBpmnElementKind.SUB_PROCESS) {
          it.each(Object.values(ShapeBpmnSubProcessKind))(`%s subProcess with Loop & Expand (collapsed) markers`, (subProcessKind: ShapeBpmnSubProcessKind) => {
            const markers = [markerKind, ShapeBpmnMarkerKind.EXPAND];
            const shape = newShape(newShapeBpmnSubProcess(subProcessKind, markers));
            expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
              baseStyleNames: ['subProcess'],
              bpmn: { kind: ShapeBpmnElementKind.SUB_PROCESS, subProcessKind, markers: getExpectedMarkers(markers, subProcessKind) },
            });
          });
        }

        if (bpmnKind == ShapeBpmnElementKind.CALL_ACTIVITY) {
          it(`${bpmnKind} calling process with ${markerKind} & Expand (collapsed) markers`, () => {
            const shape = newShape(newShapeBpmnCallActivityCallingProcess([markerKind, ShapeBpmnMarkerKind.EXPAND]));
            expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
              baseStyleNames: ['callActivity'],
              bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY, globalTaskKind: undefined, markers: [markerKind, ShapeBpmnMarkerKind.EXPAND] },
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
            expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
              baseStyleNames: ['callActivity'],
              bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY, globalTaskKind, markers: [markerKind] },
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
        expect(computeStyle(shape)).toStrictEqual<BpmnCellStyle>({
          baseStyleNames: ['eventBasedGateway'],
          bpmn: { kind: ShapeBpmnElementKind.GATEWAY_EVENT_BASED, isInstantiating: !!instantiate, gatewayKind },
          fontFamily: 'Arial',
        });
      },
    );
  });

  describe('compute style - ignore label styles', () => {
    describe.each([[undefined], [false], [true]])(`Ignore label styles (renderer option): %s`, (ignoreLabelStyles: boolean) => {
      const styleComputer = new StyleComputer(ignoreLabelStyles === undefined ? {} : { ignoreLabelStyles });
      const expectFontStyles = !(ignoreLabelStyles ?? false);

      function computeStyleWithIgnoreLabelStyles(element: Shape | Edge): BpmnCellStyle {
        return styleComputer.computeStyle(element, element.label?.bounds);
      }

      describe('shapes', () => {
        it('shape with font family only', () => {
          const shape = new Shape('id', newShapeBpmnElement(ShapeBpmnElementKind.TASK_SCRIPT), undefined, new Label(toFont({ name: 'Roboto' }), undefined));
          const style: BpmnCellStyle = { baseStyleNames: ['scriptTask'], bpmn: { kind: ShapeBpmnElementKind.TASK_SCRIPT } };
          if (expectFontStyles) {
            style.fontFamily = 'Roboto';
          }
          expect(computeStyleWithIgnoreLabelStyles(shape)).toStrictEqual<BpmnCellStyle>(style);
        });

        it('shape with bold font', () => {
          const shape = new Shape(
            'id',
            newShapeBpmnElement(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE),
            undefined,
            new Label(toFont({ name: 'Courier', size: 9, isBold: true }), undefined),
          );
          const style: BpmnCellStyle = { baseStyleNames: ['exclusiveGateway'], bpmn: { kind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE } };
          if (expectFontStyles) {
            style.fontFamily = 'Courier';
            style.fontSize = 9;
            style.fontStyle = 1;
          }
          expect(computeStyleWithIgnoreLabelStyles(shape)).toStrictEqual<BpmnCellStyle>(style);
        });

        it('shape with italic font', () => {
          const shape = new Shape(
            'id',
            newShapeBpmnElement(ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH),
            undefined,
            new Label(toFont({ name: 'Arial', isItalic: true }), undefined),
          );
          const style: BpmnCellStyle = { baseStyleNames: ['intermediateCatchEvent'], bpmn: { kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH } };
          if (expectFontStyles) {
            style.fontFamily = 'Arial';
            style.fontStyle = 2;
          }
          expect(computeStyleWithIgnoreLabelStyles(shape)).toStrictEqual<BpmnCellStyle>(style);
        });
      });

      describe('edges', () => {
        it('edge with strike-through font', () => {
          const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY), undefined, new Label(toFont({ size: 14.2, isStrikeThrough: true }), undefined));
          const style: BpmnCellStyle = { baseStyleNames: ['sequenceFlow', 'conditional_from_activity'], bpmn: { kind: FlowKind.SEQUENCE_FLOW } };
          if (expectFontStyles) {
            style.fontSize = 14.2;
            style.fontStyle = 8;
          }
          expect(computeStyleWithIgnoreLabelStyles(edge)).toStrictEqual<BpmnCellStyle>(style);
        });

        it('edge with underline font', () => {
          const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.DEFAULT), undefined, new Label(toFont({ isUnderline: true }), undefined));
          const style: BpmnCellStyle = { baseStyleNames: ['sequenceFlow', 'default'], bpmn: { kind: FlowKind.SEQUENCE_FLOW } };
          if (expectFontStyles) {
            style.fontStyle = 4;
          }
          expect(computeStyleWithIgnoreLabelStyles(edge)).toStrictEqual<BpmnCellStyle>(style);
        });
      });
    });
  });

  describe('compute style - colors', () => {
    describe.each([[undefined], [false], [true]])(`Ignore BPMN colors: %s`, (ignoreBpmnColors: boolean) => {
      // 'undefined' RendererOptions tested in other tests in this file
      const styleComputer = new StyleComputer(ignoreBpmnColors === undefined ? {} : { ignoreBpmnColors: ignoreBpmnColors });
      const expectAdditionalColorsStyle = !(ignoreBpmnColors ?? true);

      function computeStyleWithRendererOptions(element: Shape | Edge): BpmnCellStyle {
        return styleComputer.computeStyle(element, element.label?.bounds);
      }

      function computeMessageFlowIconStyleWithRendererOptions(edge: Edge): BpmnCellStyle {
        return styleComputer.computeMessageFlowIconStyle(edge);
      }

      describe('shapes', () => {
        it.each(Object.values(ShapeUtil.flowNodeKinds()))('%s', (kind: ShapeBpmnElementKind) => {
          const shape = newShape(newShapeBpmnElement(kind), newLabelExtension('#010101'));
          shape.extensions.fillColor = '#000003';
          shape.extensions.strokeColor = '#FF0203';
          const style: BpmnCellStyle = { baseStyleNames: [kind], bpmn: { kind } };
          if (expectAdditionalColorsStyle) {
            style.fillColor = '#000003';
            style.strokeColor = '#FF0203';
            style.fontColor = '#010101';
          }
          expect(computeStyleWithRendererOptions(shape)).toStrictEqual<BpmnCellStyle>(style);
        });

        it.each([ShapeBpmnElementKind.LANE, ShapeBpmnElementKind.POOL])('%s', (kind: ShapeBpmnElementKind) => {
          const shape = newShape(newShapeBpmnElement(kind), newLabelExtension('#aa0101'));
          shape.extensions.fillColor = '#AA0003';
          shape.extensions.strokeColor = '#FF02AA';
          const style: BpmnCellStyle = { baseStyleNames: [kind], bpmn: { kind }, horizontal: true };
          if (expectAdditionalColorsStyle) {
            style.fillColor = '#AA0003';
            style.swimlaneFillColor = '#AA0003';
            style.strokeColor = '#FF02AA';
            style.fontColor = '#aa0101';
          }
          expect(computeStyleWithRendererOptions(shape)).toStrictEqual<BpmnCellStyle>(style);
        });

        it.each([ShapeBpmnElementKind.GROUP, ShapeBpmnElementKind.TEXT_ANNOTATION])('%s', (kind: ShapeBpmnElementKind) => {
          const shape = newShape(newShapeBpmnElement(kind), newLabelExtension('#aa0101'));
          shape.extensions.fillColor = '#AA0003';
          shape.extensions.strokeColor = '#FF02AA';
          const style: BpmnCellStyle = { baseStyleNames: [kind], bpmn: { kind } };
          if (expectAdditionalColorsStyle) {
            style.fillColor = '#AA0003';
            style.strokeColor = '#FF02AA';
            style.fontColor = '#aa0101';
          }
          expect(computeStyleWithRendererOptions(shape)).toStrictEqual<BpmnCellStyle>(style);
        });

        it('no extension', () => {
          const shape = newShape(newShapeBpmnElement(ShapeBpmnElementKind.TASK));
          expect(computeStyleWithRendererOptions(shape)).toStrictEqual<BpmnCellStyle>({ baseStyleNames: ['task'], bpmn: { kind: ShapeBpmnElementKind.TASK } });
        });
      });

      describe('edges', () => {
        it('sequence flow', () => {
          const edge = new Edge('id', newSequenceFlow(SequenceFlowKind.DEFAULT), undefined, newLabelExtension('#aaaaaa'));
          edge.extensions.strokeColor = '#111111';
          const style: BpmnCellStyle = { baseStyleNames: ['sequenceFlow', 'default'], bpmn: { kind: FlowKind.SEQUENCE_FLOW } };
          if (expectAdditionalColorsStyle) {
            style.strokeColor = '#111111';
            style.fontColor = '#aaaaaa';
          }
          expect(computeStyleWithRendererOptions(edge)).toStrictEqual<BpmnCellStyle>(style);
        });
        it('message flow', () => {
          const edge = new Edge('id', newMessageFlow(), undefined, newLabelExtension('#aaaabb'));
          edge.extensions.strokeColor = '#1111bb';
          const style: BpmnCellStyle = { baseStyleNames: ['messageFlow'], bpmn: { kind: FlowKind.MESSAGE_FLOW } };
          if (expectAdditionalColorsStyle) {
            style.strokeColor = '#1111bb';
            style.fontColor = '#aaaabb';
          }
          expect(computeStyleWithRendererOptions(edge)).toStrictEqual<BpmnCellStyle>(style);
        });
        it('message flow icon', () => {
          const edge = new Edge('id', newMessageFlow());
          edge.extensions.strokeColor = '#11aabb';
          const style: BpmnCellStyle = { shape: 'bpmn.messageFlowIcon', bpmn: { isInitiating: false } };
          if (expectAdditionalColorsStyle) {
            style.strokeColor = '#11aabb';
          }
          expect(computeMessageFlowIconStyleWithRendererOptions(edge)).toStrictEqual<BpmnCellStyle>(style);
        });
        it('association flow', () => {
          const edge = new Edge('id', newAssociationFlow(AssociationDirectionKind.ONE), undefined, newLabelExtension('#aaaacc'));
          edge.extensions.strokeColor = '#1111cc';
          const style: BpmnCellStyle = { baseStyleNames: ['association', 'One'], bpmn: { kind: FlowKind.ASSOCIATION_FLOW } };
          if (expectAdditionalColorsStyle) {
            style.strokeColor = '#1111cc';
            style.fontColor = '#aaaacc';
          }
          expect(computeStyleWithRendererOptions(edge)).toStrictEqual<BpmnCellStyle>(style);
        });
      });
    });
  });
});
