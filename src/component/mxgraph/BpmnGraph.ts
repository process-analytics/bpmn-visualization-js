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

import type { IconPainter } from './shape/render';
import type { AbstractGraph, CellState, Point } from '@maxgraph/core';

import { BaseGraph, FitPlugin, GraphView, PanningHandler } from '@maxgraph/core';

import { BpmnCellRenderer } from './BpmnCellRenderer';
import { registerEdgeMarkers, registerPerimeters, registerShapes } from './config/register-style-definitions';

export class BpmnGraph extends BaseGraph {
  /**
   * @internal
   */
  constructor(container: HTMLElement, iconPainter: IconPainter) {
    // maxGraph's BaseGraph accepts its collaborators through the constructor options (dependency injection), so the
    // cell renderer holding the icon painter is built here and passed in. This removes the mxGraph factory-method
    // workaround (the module-level pendingIconPainter that was required because mxGraph called createCellRenderer()
    // during the super() constructor, before instance fields were initialized).
    super({
      container,
      view: (graph: AbstractGraph) => new BpmnGraphView(graph),
      cellRenderer: new BpmnCellRenderer(iconPainter),
      plugins: [PanningHandler, FitPlugin],
    });
    if (this.container) {
      // ensure we don't have a select text cursor on label hover, see #294
      this.container.style.cursor = 'default';
    }
  }

  /**
   * Register the BPMN custom shapes/markers/perimeters and the built-ins they rely on.
   *
   * `BaseGraph` registers nothing by default (it is tree-shakeable), so the BPMN rendering needs explicit
   * registration. Called by the `AbstractGraph` constructor.
   *
   * @internal
   */
  protected override registerDefaults(): void {
    registerShapes();
    registerEdgeMarkers();
    registerPerimeters();
  }
}

class BpmnGraphView extends GraphView {
  override getFloatingTerminalPoint(edge: CellState, start: CellState, end: CellState | null, source: boolean): Point | null {
    // some values may be null: the first and the last values are null prior computing floating terminal points
    const edgePoints = edge.absolutePoints.filter(Boolean);
    // when there is no BPMN waypoint, all values are null
    const needsFloatingTerminalPoint = edgePoints.length < 2;
    if (needsFloatingTerminalPoint) {
      return super.getFloatingTerminalPoint(edge, start, end, source);
    }
    const pts = edge.absolutePoints;
    return source ? pts[1] : (pts.at(-2) ?? null);
  }
}
