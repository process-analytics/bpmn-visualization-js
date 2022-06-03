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
import type {
  ShapeBpmnElementKind,
  ShapeBpmnCallActivityKind,
  ShapeBpmnMarkerKind,
  ShapeBpmnSubProcessKind,
  ShapeBpmnEventDefinitionKind,
  GlobalTaskKind,
} from '../../../../../src/model/bpmn/internal';
import { FlowKind, MessageVisibleKind, SequenceFlowKind } from '../../../../../src/model/bpmn/internal';
import type Shape from '../../../../../src/model/bpmn/internal/shape/Shape';
import { newBpmnJsonParser } from '../../../../../src/component/parser/json/BpmnJsonParser';
import type { Edge, Waypoint } from '../../../../../src/model/bpmn/internal/edge/edge';
import type BpmnModel from '../../../../../src/model/bpmn/internal/BpmnModel';
import { ShapeBpmnActivity, ShapeBpmnCallActivity, ShapeBpmnEvent, ShapeBpmnSubProcess } from '../../../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import type Label from '../../../../../src/model/bpmn/internal/Label';
import { SequenceFlow } from '../../../../../src/model/bpmn/internal/edge/flows';
import type { BpmnJsonModel } from '../../../../../src/model/bpmn/json/BPMN20';
import type { JsonParsingWarning } from '../../../../../src/component/parser/parsing-messages';
import { ParsingMessageCollector } from '../../../../../src/component/parser/parsing-messages';

export interface ExpectedShape {
  shapeId: string;
  bpmnElementId: string;
  bpmnElementName: string;
  bpmnElementKind: ShapeBpmnElementKind;
  parentId?: string;
  bounds?: ExpectedBounds;
  isHorizontal?: boolean;
}

export interface ExpectedActivityShape extends ExpectedShape {
  bpmnElementMarkers?: ShapeBpmnMarkerKind[];
}

export interface ExpectedCallActivityShape extends ExpectedActivityShape {
  bpmnElementGlobalTaskKind?: GlobalTaskKind;
  bpmnElementCallActivityKind?: ShapeBpmnCallActivityKind;
}

interface ExpectedEdge {
  edgeId: string;
  bpmnElementId: string;
  bpmnElementName?: string;
  bpmnElementSourceRefId: string;
  bpmnElementTargetRefId: string;
  waypoints: Waypoint[];
  messageVisibleKind?: MessageVisibleKind;
}

export interface ExpectedSequenceEdge extends ExpectedEdge {
  bpmnElementSequenceFlowKind?: SequenceFlowKind;
}

export interface ExpectedFont {
  name?: string;
  size?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikeThrough?: boolean;
}

export interface ExpectedBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

class ParsingMessageCollectorTester extends ParsingMessageCollector {
  private warnings: Array<JsonParsingWarning> = [];

  override warning(warning: JsonParsingWarning): void {
    this.warnings.push(warning);
  }

  purge(): void {
    this.warnings = [];
  }

  getWarnings(): Array<JsonParsingWarning> {
    return this.warnings;
  }
}

export const parsingMessageCollector = new ParsingMessageCollectorTester();

function checkParsingWarnings(numberOfWarnings: number): void {
  expect(parsingMessageCollector.getWarnings()).toHaveLength(numberOfWarnings);
}

export function parseJson(json: BpmnJsonModel): BpmnModel {
  parsingMessageCollector.purge();
  return newBpmnJsonParser(parsingMessageCollector).parse(json);
}

export function parseJsonAndExpect(
  json: BpmnJsonModel,
  numberOfExpectedPools: number,
  numberOfExpectedLanes: number,
  numberOfExpectedFlowNodes: number,
  numberOfExpectedEdges: number,
  numberOfWarnings = 0,
): BpmnModel {
  const model = parseJson(json);
  expect(model.lanes).toHaveLength(numberOfExpectedLanes);
  expect(model.pools).toHaveLength(numberOfExpectedPools);
  expect(model.flowNodes).toHaveLength(numberOfExpectedFlowNodes);
  expect(model.edges).toHaveLength(numberOfExpectedEdges);
  checkParsingWarnings(numberOfWarnings);
  return model;
}

export function parseJsonAndExpectOnlyLanes(json: BpmnJsonModel, numberOfExpectedLanes: number, numberOfWarnings = 0): BpmnModel {
  return parseJsonAndExpect(json, 0, numberOfExpectedLanes, 0, 0, numberOfWarnings);
}

export function parseJsonAndExpectOnlyPoolsAndLanes(json: BpmnJsonModel, numberOfExpectedPools: number, numberOfExpectedLanes: number): BpmnModel {
  return parseJsonAndExpect(json, numberOfExpectedPools, numberOfExpectedLanes, 0, 0);
}

export function parseJsonAndExpectOnlyPools(json: BpmnJsonModel, numberOfExpectedPools: number, numberOfWarnings = 0): BpmnModel {
  return parseJsonAndExpect(json, numberOfExpectedPools, 0, 0, 0, numberOfWarnings);
}

export function parseJsonAndExpectOnlyPoolsAndFlowNodes(json: BpmnJsonModel, numberOfExpectedPools: number, numberOfExpectedFlowNodes: number): BpmnModel {
  return parseJsonAndExpect(json, numberOfExpectedPools, 0, numberOfExpectedFlowNodes, 0);
}

export function parseJsonAndExpectOnlyFlowNodes(json: BpmnJsonModel, numberOfExpectedFlowNodes: number, numberOfWarnings = 0): BpmnModel {
  return parseJsonAndExpect(json, 0, 0, numberOfExpectedFlowNodes, 0, numberOfWarnings);
}

export function parseJsonAndExpectOnlyWarnings(json: BpmnJsonModel, numberOfWarnings: number): BpmnModel {
  return parseJsonAndExpect(json, 0, 0, 0, 0, numberOfWarnings);
}

export function parseJsonAndExpectOnlyEdges(json: BpmnJsonModel, numberOfExpectedEdges: number, numberOfWarnings = 0): BpmnModel {
  return parseJsonAndExpect(json, 0, 0, 0, numberOfExpectedEdges, numberOfWarnings);
}

export function parseJsonAndExpectOnlyEdgesAndFlowNodes(json: BpmnJsonModel, numberOfExpectedEdges: number, numberOfExpectedFlowNodes: number): BpmnModel {
  return parseJsonAndExpect(json, 0, 0, numberOfExpectedFlowNodes, numberOfExpectedEdges);
}

export function verifyShape(shape: Shape, expectedShape: ExpectedShape | ExpectedActivityShape | ExpectedCallActivityShape): void {
  expect(shape.id).toEqual(expectedShape.shapeId);
  expect(shape.isHorizontal).toEqual(expectedShape.isHorizontal);

  const bpmnElement = shape.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedShape.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedShape.bpmnElementName);
  expect(bpmnElement.kind).toEqual(expectedShape.bpmnElementKind);
  expect(bpmnElement.parent).toEqual(expectedShape.parentId);

  if (bpmnElement instanceof ShapeBpmnActivity) {
    const expectedActivityShape = expectedShape as ExpectedActivityShape;
    if (expectedActivityShape.bpmnElementMarkers) {
      expect(bpmnElement.markers).toEqual(expectedActivityShape.bpmnElementMarkers);
    } else {
      expect(bpmnElement.markers).toHaveLength(0);
    }

    if (bpmnElement instanceof ShapeBpmnCallActivity) {
      expect(bpmnElement.callActivityKind).toEqual((expectedActivityShape as ExpectedCallActivityShape).bpmnElementCallActivityKind);
      expect(bpmnElement.globalTaskKind).toEqual((expectedActivityShape as ExpectedCallActivityShape).bpmnElementGlobalTaskKind);
    }
  }

  const bounds = shape.bounds;
  const expectedBounds = expectedShape.bounds;
  expect(bounds.x).toEqual(expectedBounds.x);
  expect(bounds.y).toEqual(expectedBounds.y);
  expect(bounds.width).toEqual(expectedBounds.width);
  expect(bounds.height).toEqual(expectedBounds.height);
}

export function verifyEdge(edge: Edge, expectedValue: ExpectedEdge | ExpectedSequenceEdge): void {
  expect(edge.id).toEqual(expectedValue.edgeId);
  expect(edge.waypoints).toEqual(expectedValue.waypoints);

  if (expectedValue.messageVisibleKind) {
    expect(edge.messageVisibleKind).toEqual(expectedValue.messageVisibleKind);
  } else {
    expect(edge.messageVisibleKind).toEqual(MessageVisibleKind.NONE);
  }

  const bpmnElement = edge.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedValue.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedValue.bpmnElementName);
  expect(bpmnElement.sourceRefId).toEqual(expectedValue.bpmnElementSourceRefId);
  expect(bpmnElement.targetRefId).toEqual(expectedValue.bpmnElementTargetRefId);

  if (bpmnElement instanceof SequenceFlow) {
    expect(edge.bpmnElement.kind).toEqual(FlowKind.SEQUENCE_FLOW);
    const sequenceEdge = expectedValue as ExpectedSequenceEdge;
    if (sequenceEdge.bpmnElementSequenceFlowKind) {
      expect(bpmnElement.sequenceFlowKind).toEqual(sequenceEdge.bpmnElementSequenceFlowKind);
    } else {
      expect(bpmnElement.sequenceFlowKind).toEqual(SequenceFlowKind.NORMAL);
    }
  }
}

export function verifySubProcess(model: BpmnModel, kind: ShapeBpmnSubProcessKind, expectedNumber: number): void {
  const events = model.flowNodes.filter(shape => {
    const bpmnElement = shape.bpmnElement;
    return bpmnElement instanceof ShapeBpmnSubProcess && (bpmnElement as ShapeBpmnSubProcess).subProcessKind === kind;
  });
  expect(events).toHaveLength(expectedNumber);
}

export function verifyLabelFont(label: Label, expectedFont?: ExpectedFont): void {
  expect(label).toBeDefined();

  const font = label.font;
  if (expectedFont) {
    expect(font.isBold).toEqual(expectedFont.isBold);
    expect(font.isItalic).toEqual(expectedFont.isItalic);
    expect(font.isStrikeThrough).toEqual(expectedFont.isStrikeThrough);
    expect(font.isUnderline).toEqual(expectedFont.isUnderline);
    expect(font.name).toEqual(expectedFont.name);
    expect(font.size).toEqual(expectedFont.size);
  } else {
    expect(font).toBeUndefined();
  }
}

export function verifyLabelBounds(label: Label, expectedBounds?: ExpectedBounds): void {
  expect(label).toBeDefined();

  const bounds = label.bounds;
  if (expectedBounds) {
    expect(bounds.x).toEqual(expectedBounds.x);
    expect(bounds.y).toEqual(expectedBounds.y);
    expect(bounds.width).toEqual(expectedBounds.width);
    expect(bounds.height).toEqual(expectedBounds.height);
  } else {
    expect(bounds).toBeUndefined();
  }
}

export function parseJsonAndExpectEvent(json: BpmnJsonModel, eventDefinitionKind: ShapeBpmnEventDefinitionKind, expectedNumber: number): BpmnModel {
  const model = parseJson(json);

  expect(model.lanes).toHaveLength(0);
  expect(model.pools).toHaveLength(0);
  expect(model.edges).toHaveLength(0);

  const events = model.flowNodes.filter(shape => {
    const bpmnElement = shape.bpmnElement;
    return bpmnElement instanceof ShapeBpmnEvent && (bpmnElement as ShapeBpmnEvent).eventDefinitionKind === eventDefinitionKind;
  });
  expect(events).toHaveLength(expectedNumber);

  return model;
}

export function parseJsonAndExpectOnlySubProcess(json: BpmnJsonModel, kind: ShapeBpmnSubProcessKind, expectedNumber: number): BpmnModel {
  const model = parseJson(json);

  expect(model.lanes).toHaveLength(0);
  expect(model.pools).toHaveLength(0);
  expect(model.edges).toHaveLength(0);

  verifySubProcess(model, kind, expectedNumber);

  return model;
}

export function expectAsWarning<T>(instance: unknown, constructor: new (...args: never) => T): T {
  expect(instance).toBeInstanceOf(constructor);
  return instance as T;
}
