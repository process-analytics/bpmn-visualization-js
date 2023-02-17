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

import type { ShapeBpmnSubProcessKind, ShapeBpmnEventDefinitionKind } from '../../../src/model/bpmn/internal';
import { newBpmnJsonParser } from '../../../src/component/parser/json/BpmnJsonParser';
import type BpmnModel from '../../../src/model/bpmn/internal/BpmnModel';
import { ShapeBpmnEvent, ShapeBpmnSubProcess } from '../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import type Label from '../../../src/model/bpmn/internal/Label';
import type { BpmnJsonModel } from '../../../src/model/bpmn/json/BPMN20';
import type { JsonParsingWarning } from '../../../src/component/parser/parsing-messages';
import { ParsingMessageCollector } from '../../../src/component/parser/parsing-messages';
import type { ExpectedBounds, ExpectedFont } from './bpmn-model-expect';

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

function expectPoolLaneEdge(model: BpmnModel, numberOfExpectedPools: number, numberOfExpectedLanes: number, numberOfExpectedEdges: number): void {
  expect(model.lanes).toHaveLength(numberOfExpectedLanes);
  expect(model.pools).toHaveLength(numberOfExpectedPools);
  expect(model.edges).toHaveLength(numberOfExpectedEdges);
}

export function expectPoolLaneEdgeFlowNode(
  model: BpmnModel,
  numberOfExpectedPools: number,
  numberOfExpectedLanes: number,
  numberOfExpectedEdges: number,
  numberOfExpectedFlowNodes: number,
): void {
  expectPoolLaneEdge(model, numberOfExpectedPools, numberOfExpectedLanes, numberOfExpectedEdges);
  expect(model.flowNodes).toHaveLength(numberOfExpectedFlowNodes);
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
  expectPoolLaneEdgeFlowNode(model, numberOfExpectedPools, numberOfExpectedLanes, numberOfExpectedEdges, numberOfExpectedFlowNodes);
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

  expectPoolLaneEdge(model, 0, 0, 0);

  const events = model.flowNodes.filter(shape => {
    const bpmnElement = shape.bpmnElement;
    return bpmnElement instanceof ShapeBpmnEvent && (bpmnElement as ShapeBpmnEvent).eventDefinitionKind === eventDefinitionKind;
  });
  expect(events).toHaveLength(expectedNumber);

  return model;
}

export function parseJsonAndExpectOnlySubProcess(json: BpmnJsonModel, kind: ShapeBpmnSubProcessKind, expectedNumber: number): BpmnModel {
  const model = parseJson(json);

  expectPoolLaneEdge(model, 0, 0, 0);
  verifySubProcess(model, kind, expectedNumber);

  return model;
}

export function expectAsWarning<T>(instance: unknown, constructor: new (...args: never) => T): T {
  expect(instance).toBeInstanceOf(constructor);
  return instance as T;
}
