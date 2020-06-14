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
import { mxgraph } from 'ts-mxgraph';
import Shape from '../../model/bpmn/shape/Shape';
import Edge from '../../model/bpmn/edge/Edge';
import BpmnModel from '../../model/bpmn/BpmnModel';
import ShapeBpmnElement, { ShapeBpmnEvent } from '../../model/bpmn/shape/ShapeBpmnElement';
import { MxGraphFactoryService } from '../../service/MxGraphFactoryService';
import Waypoint from '../../model/bpmn/edge/Waypoint';
import { StyleConstant } from './StyleConfigurator';
import { Font } from '../../model/bpmn/Label';
import Bounds from '../../model/bpmn/Bounds';
import ShapeUtil from '../../model/bpmn/shape/ShapeUtil';

interface Coordinate {
  x: number;
  y: number;
}

export default class MxGraphRenderer {
  private mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');
  private mxPoint: typeof mxgraph.mxPoint = MxGraphFactoryService.getMxGraphProperty('mxPoint');
  constructor(readonly graph: mxgraph.mxGraph) {}

  public render(bpmnModel: BpmnModel): void {
    const model = this.graph.getModel();
    model.clear(); // ensure to remove manual changes or already loaded graphs
    model.beginUpdate();
    try {
      this.insertShapes(bpmnModel.pools);
      this.insertShapes(bpmnModel.lanes);
      this.insertShapes(bpmnModel.flowNodes);
      this.insertEdges(bpmnModel.edges);
    } finally {
      model.endUpdate();
    }
  }

  private insertShapes(shapes: Shape[]): void {
    shapes.forEach(shape => {
      this.insertShape(shape);
    });
  }

  private getParent(bpmnElement: ShapeBpmnElement): mxgraph.mxCell {
    const bpmnElementParent = this.getCell(bpmnElement.parentId);
    if (bpmnElementParent) {
      return bpmnElementParent;
    }
    return this.graph.getDefaultParent();
  }

  private insertShape(shape: Shape): void {
    const bpmnElement = shape.bpmnElement;
    if (bpmnElement) {
      const parent = this.getParent(bpmnElement);

      const bounds = shape.bounds;
      let labelBounds = shape.label?.bounds;
      // TODO pool/lane not managed for now
      labelBounds = ShapeUtil.isPoolOrLane(bpmnElement.kind) ? undefined : labelBounds;
      const style = this.computeStyle(shape, labelBounds);

      this.insertVertex(parent, bpmnElement.id, bpmnElement.name, bounds, labelBounds, style);
    }
  }

  computeStyle(bpmnCell: Shape | Edge, labelBounds?: Bounds): string {
    const styleValues = new Map<string, string | number>();

    const font = bpmnCell.label?.font;
    if (font) {
      styleValues.set(this.mxConstants.STYLE_FONTFAMILY, font.name);
      styleValues.set(this.mxConstants.STYLE_FONTSIZE, font.size);
      styleValues.set(this.mxConstants.STYLE_FONTSTYLE, this.getFontStyleValue(font));
    }

    const bpmnElement = bpmnCell.bpmnElement;
    if (bpmnElement instanceof ShapeBpmnEvent) {
      styleValues.set(StyleConstant.BPMN_STYLE_EVENT_KIND, bpmnElement.eventKind);
    }

    if (labelBounds) {
      styleValues.set(this.mxConstants.STYLE_VERTICAL_ALIGN, this.mxConstants.ALIGN_TOP);
      styleValues.set(this.mxConstants.STYLE_ALIGN, this.mxConstants.ALIGN_MIDDLE);
      styleValues.set(this.mxConstants.STYLE_LABEL_BORDERCOLOR, 'red'); // TODO only for detection in this POC
      // erase eventual style configuration for BPMN element
      styleValues.set(this.mxConstants.STYLE_LABEL_POSITION, this.mxConstants.NONE);
      styleValues.set(this.mxConstants.STYLE_VERTICAL_LABEL_POSITION, this.mxConstants.NONE);
      // arbitrarily increase width to relax too small bounds (for instance for reference diagrams from miwg-test-suite)
      styleValues.set(this.mxConstants.STYLE_LABEL_WIDTH, labelBounds.width + 1); // TODO how do we manage height constraints?
      //styleValues.set(this.mxConstants.STYLE_LABEL_PADDING, 0); // todo adjust
      // only apply to vertex
      // style[this.mxConstants.STYLE_SPACING_TOP] = 55;
      // style[this.mxConstants.STYLE_SPACING_RIGHT] = 110;
      // add negative STYLE_SPACING to relax too small bounds (ref miwg-test-suite)
      // TODO adjust the value
      // TODO warn apply only to vertex, not edge
      // styleValues.set(this.mxConstants.STYLE_SPACING_LEFT, -5);
      // styleValues.set(this.mxConstants.STYLE_SPACING_RIGHT, -5);
    }

    return [bpmnElement.kind as string] //
      .concat([...styleValues].filter(([, v]) => v).map(([key, value]) => key + '=' + value))
      .join(';');
  }

  private getFontStyleValue(font: Font): number {
    let value = 0;
    if (font.isBold) {
      value += this.mxConstants.FONT_BOLD;
    }
    if (font.isItalic) {
      value += this.mxConstants.FONT_ITALIC;
    }
    if (font.isStrikeThrough) {
      value += this.mxConstants.FONT_STRIKETHROUGH;
    }
    if (font.isUnderline) {
      value += this.mxConstants.FONT_UNDERLINE;
    }
    return value;
  }

  private insertEdges(edges: Edge[]): void {
    edges.forEach(edge => {
      const bpmnElement = edge.bpmnElement;
      if (bpmnElement) {
        const parent = this.graph.getDefaultParent();
        const source = this.getCell(bpmnElement.sourceRefId);
        const target = this.getCell(bpmnElement.targetRefId);

        const labelBounds = edge.label?.bounds;
        const style = this.computeStyle(edge, labelBounds);

        const labelText = bpmnElement.name;
        // eslint-disable-next-line no-console
        console.info('###Processing edge with label:', labelText);
        const mxEdge = this.graph.insertEdge(parent, bpmnElement.id, labelText, source, target, style);
        this.insertWaypoints(edge.waypoints, mxEdge);

        // eslint-disable-next-line no-console
        console.info('###geometry prior applying info from label bounds');
        const geometry = mxEdge.geometry;
        // eslint-disable-next-line no-console
        console.info(geometry);
        // eslint-disable-next-line no-console
        console.info('###center: %s / %s', geometry.getCenterX(), geometry.getCenterY());

        // demonstrate how to set label position using the cell geometry offset
        // label relative coordinates to the cell
        if (labelBounds) {
          // mxEdge.geometry.relative = false;
          const relativeCoordinate = this.getRelativeCoordinates(mxEdge.parent, { x: labelBounds.x, y: labelBounds.y });
          // mxEdge.geometry.x = relativeCoordinate.x;
          // mxEdge.geometry.y = relativeCoordinate.y;

          // described in the doc
          // "The width and height parameter for edge geometries can be used to set the label width and height
          // (eg. for word wrapping)."
          mxEdge.geometry.width = labelBounds.width;
          mxEdge.geometry.height = labelBounds.height;

          // TODO ensure we do not need offset here
          // const relativeLabelX = labelBounds.x - bounds.x;
          // const relativeLabelY = labelBounds.y - bounds.y;
          // mxEdge.geometry.offset = new this.mxPoint(relativeLabelX, relativeLabelY);

          // eslint-disable-next-line no-console
          console.info('###geometry AFTER applying info from label bounds');
          // eslint-disable-next-line no-console
          console.info(mxEdge.geometry);
        }
      }
    });
  }

  private insertWaypoints(waypoints: Waypoint[], mxEdge: mxgraph.mxCell): void {
    if (waypoints) {
      mxEdge.geometry.points = waypoints.map(waypoint => {
        const relativeCoordinate = this.getRelativeCoordinates(mxEdge.parent, { x: waypoint.x, y: waypoint.y });
        return new this.mxPoint(relativeCoordinate.x, relativeCoordinate.y);
      });
    }
  }

  private getCell(id: string): mxgraph.mxCell {
    return this.graph.getModel().getCell(id);
  }

  private insertVertex(parent: mxgraph.mxCell, id: string | null, value: string, bounds: Bounds, labelBounds: Bounds, style?: string): mxgraph.mxCell {
    const relativeCoordinate = this.getRelativeCoordinates(parent, { x: bounds.x, y: bounds.y });
    const mxCell = this.graph.insertVertex(parent, id, value, relativeCoordinate.x, relativeCoordinate.y, bounds.width, bounds.height, style);

    // demonstrate how to set label position using the cell geometry offset
    // label relative coordinates to the cell
    if (labelBounds) {
      const relativeLabelX = labelBounds.x - bounds.x;
      const relativeLabelY = labelBounds.y - bounds.y;
      mxCell.geometry.offset = new this.mxPoint(relativeLabelX, relativeLabelY);
    }
    return mxCell;
  }

  // ===================================================================================================================
  // TODO move to a dedicated class
  // ===================================================================================================================
  //
  // https://jgraph.github.io/mxgraph/docs/js-api/files/model/mxGeometry-js.html#mxGeometry
  // Edge Labels
  //
  // Using the x- and y-coordinates of a cell’s geometry, it is possible to position the label on edges on a specific
  // location on the actual edge shape as it appears on the screen.  The x-coordinate of an edge’s geometry is used to
  // describe the distance from the center of the edge from -1 to 1 with 0 being the center of the edge and the default value.
  // The y-coordinate of an edge’s geometry is used to describe the absolute, orthogonal distance in pixels from that point.
  // In addition, the mxGeometry.offset is used as an absolute offset vector from the resulting point.
  //
  // This coordinate system is applied if relative is true, otherwise the offset defines the absolute vector from the edge’s center point to the label and the values for <x> and <y> are ignored.
  //
  // The width and height parameter for edge geometries can be used to set the label width and height (eg. for word wrapping).

  // coordinate in the same referential as the mxCell, so here, relative to its parent
  private computeEgeCenter(mxEdge: mxgraph.mxCell): Coordinate {
    // TODO final impl should ensure we have an edge
    const wayPoints = mxEdge.geometry.points;

    return null;
  }

  private getRelativeCoordinates(parent: mxgraph.mxCell, absoluteCoordinate: Coordinate): Coordinate {
    const translateForRoot = this.getTranslateForRoot(parent);
    const relativeX = absoluteCoordinate.x + translateForRoot.x;
    const relativeY = absoluteCoordinate.y + translateForRoot.y;
    return { x: relativeX, y: relativeY };
  }

  // Returns the translation to be applied to a cell whose mxGeometry x and y values are expressed with absolute coordinates
  // (i.e related to the graph default parent) you want to assign as parent to the cell passed as argument of this function.
  // That way, you will be able to express the cell coordinates as relative to its parent cell.
  //
  // The implementation taken from the example described in the documentation of mxgraph#getTranslateForRoot
  // The translation is generally negative
  private getTranslateForRoot(cell: mxgraph.mxCell): mxgraph.mxPoint {
    const model = this.graph.getModel();
    const offset = new this.mxPoint(0, 0);

    while (cell != null) {
      const geo = model.getGeometry(cell);
      if (geo != null) {
        offset.x -= geo.x;
        offset.y -= geo.y;
      }
      cell = model.getParent(cell);
    }

    return offset;
  }
}
