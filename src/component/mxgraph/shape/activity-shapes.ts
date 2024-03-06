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

import type { BpmnCanvas, IconPainter, PaintParameter, ShapeConfiguration } from './render';
import type { mxAbstractCanvas2D } from 'mxgraph';

import { ShapeBpmnElementKind, ShapeBpmnMarkerKind, ShapeBpmnSubProcessKind } from '../../../model/bpmn/internal';
import { mxRectangleShape, mxUtils } from '../initializer';
import { BpmnStyleIdentifier, StyleDefault } from '../style';
import { getBpmnIsInstantiating } from '../style/utils';

import { buildPaintParameter } from './render/icon-painter';
import { orderActivityMarkers } from './render/utils';

function getMarkerIconOriginFunction(numberOfMarkers: number, markerPosition: number): (canvas: BpmnCanvas) => void {
  // Tested with 1, 2, 3 and 4 markers

  // Middle marker - the following code is not needed, the general algorithm works for this case (the computed translation is then 0 on both x and y)
  // if (markerPosition == (numberOfMarkers + 1) / 2) {
  //   return (canvas: BpmnCanvas) => canvas.setIconOriginForIconBottomCentered();
  // }

  // General algorithm
  // it includes the fix for 2 markers
  // The previous implementation was adding too much spacing: it added SHAPE_ACTIVITY_MARKER_ICON_SIZE instead of SHAPE_ACTIVITY_MARKER_ICON_SIZE / 2
  return (canvas: BpmnCanvas) => {
    canvas.setIconOriginForIconBottomCentered();
    const xTranslation = ((2 * markerPosition - (numberOfMarkers + 1)) * (StyleDefault.SHAPE_ACTIVITY_MARKER_ICON_SIZE + StyleDefault.SHAPE_ACTIVITY_MARKER_ICON_MARGIN)) / 2;
    // Here, we must call a function that doesn't apply scaling to the translation as we are passing an absolute translation value.
    // The "translateIconOriginWithoutScaling" method had been added for the POC. An alternative could be to add a parameter to the existing "translateIconOrigin" method to indicate if the translation must be done.
    // For example: translateIconOrigin(dx: number, dy: number, useScaling = true): void
    canvas.translateIconOriginWithoutScaling(xTranslation, 0);
  };
}

/**
 * @internal
 */
export abstract class BaseActivityShape extends mxRectangleShape {
  // The actual value is injected at runtime by BpmnCellRenderer
  protected iconPainter: IconPainter = undefined;

  private iconPainters = new Map<ShapeBpmnMarkerKind, (paintParameter: PaintParameter) => void>([
    [ShapeBpmnMarkerKind.ADHOC, (paintParameter: PaintParameter) => this.iconPainter.paintAdHocIcon(paintParameter)],
    [
      ShapeBpmnMarkerKind.COMPENSATION,
      (paintParameter: PaintParameter) =>
        this.iconPainter.paintDoubleLeftArrowheadsIcon({
          ...paintParameter,
          iconWidth: 16,
          // ratioFromParent: 0.3,
          // iconStyleConfig: {
          //   ...paintParameter.iconStyleConfig,
          //   strokeWidth: 1.5,
          //   // no impact, still filled
          //   isFilled: false,
          // },
        }),
    ],
    [ShapeBpmnMarkerKind.EXPAND, (paintParameter: PaintParameter) => this.iconPainter.paintExpandIcon(paintParameter)],
    [ShapeBpmnMarkerKind.LOOP, (paintParameter: PaintParameter) => this.iconPainter.paintLoopIcon(paintParameter)],
    [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, (paintParameter: PaintParameter) => this.iconPainter.paintSequentialMultiInstanceIcon(paintParameter)],
    [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, (paintParameter: PaintParameter) => this.iconPainter.paintParallelMultiInstanceIcon(paintParameter)],
  ]);

  constructor() {
    super(undefined, undefined, undefined); // the configuration is passed with the styles at runtime
  }

  override paintForeground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintForeground(c, x, y, w, h);
    // 0 is used for ratioParent as if we pass undefined to builder function the default 0.25 value will be used instead
    const paintParameter = buildPaintParameter({ canvas: c, x, y, width: w, height: h, shape: this, ratioFromParent: 0, iconStrokeWidth: 1.5 });
    // paintParameter.iconWidth = 20;
    this.paintMarkerIcons(paintParameter);
  }

  protected paintMarkerIcons(paintParameter: PaintParameter): void {
    const markers = mxUtils.getValue(this.style, BpmnStyleIdentifier.MARKERS, undefined);
    if (markers) {
      const orderedMarkers = orderActivityMarkers(markers.split(','));
      // TODO TMP, this is an extra markers to check the behavior with 4 markers
      orderedMarkers.push(ShapeBpmnMarkerKind.COMPENSATION);
      // orderedMarkers.push(ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL);
      for (const [index, marker] of orderedMarkers.entries()) {
        paintParameter = {
          ...paintParameter,
          setIconOriginFunct: getMarkerIconOriginFunction(orderedMarkers.length, index + 1),
        };
        paintParameter.canvas.save(); // ensure we can later restore the configuration

        // refactoring: management of the painter function --> move from "switch" to "map"
        // It is inspired from event-shapes
        const markerPainter = this.iconPainters.get(marker as ShapeBpmnMarkerKind);
        markerPainter?.(paintParameter);

        // Restore original configuration to avoid side effects if the iconPainter changed the canvas configuration (colors, ....)
        paintParameter.canvas.restore();
      }
    }
  }

  protected paintEnvelopeIcon(paintParameter: PaintParameter, isFilled: boolean): void {
    this.iconPainter.paintEnvelopeIcon({
      ...paintParameter,
      setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeft(),
      ratioFromParent: 0.2,
      iconStyleConfig: { ...paintParameter.iconStyleConfig, isFilled: isFilled },
    });
  }
}

abstract class BaseTaskShape extends BaseActivityShape {
  override paintForeground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintForeground(c, x, y, w, h);
    this.paintTaskIcon(buildPaintParameter({ canvas: c, x, y, width: w, height: h, shape: this }));
  }

  protected abstract paintTaskIcon(paintParameter: PaintParameter): void;
}

/**
 * @internal
 */
export class TaskShape extends BaseTaskShape {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
  protected paintTaskIcon(_paintParameter: PaintParameter): void {
    // No symbol for the BPMN Task
    this.iconPainter.paintEmptyIcon();
  }
}

/**
 * @internal
 */
export class ServiceTaskShape extends BaseTaskShape {
  protected paintTaskIcon(paintParameter: PaintParameter): void {
    this.iconPainter.paintGearIcon({ ...paintParameter, setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(20) });
  }
}

/**
 * @internal
 */
export class UserTaskShape extends BaseTaskShape {
  protected paintTaskIcon(paintParameter: PaintParameter): void {
    this.iconPainter.paintPersonIcon({ ...paintParameter, setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(20) });
  }
}

/**
 * @internal
 */
export class ReceiveTaskShape extends BaseTaskShape {
  protected paintTaskIcon(paintParameter: PaintParameter): void {
    if (!getBpmnIsInstantiating(this.style)) {
      this.paintEnvelopeIcon(paintParameter, false);
      return;
    }

    const leftMargin = 4;
    const topMargin = 4;

    // paint a fixed size circle
    const circleShapeConfig: ShapeConfiguration = { ...paintParameter.shapeConfig, width: 20, height: 20 };
    this.iconPainter.paintCircleIcon({
      canvas: paintParameter.canvas,
      shapeConfig: circleShapeConfig,
      iconStyleConfig: { ...paintParameter.iconStyleConfig, isFilled: false },
      ratioFromParent: undefined, // ensure we will paint the icon with its original size
      setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeft(topMargin, leftMargin),
    });

    // paint an envelope centered inside the circle, with dimensions proportional to the circle dimensions
    // set the actual origin of the circle icon: this is what 'setIconOriginToShapeTopLeft' has done prior painting the circle icon
    circleShapeConfig.x += leftMargin;
    circleShapeConfig.y += topMargin;

    this.iconPainter.paintEnvelopeIcon({
      ...paintParameter,
      shapeConfig: circleShapeConfig,
      ratioFromParent: 0.65,
      setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginForIconCentered(),
    });
  }
}

/**
 * @internal
 */
export class SendTaskShape extends BaseTaskShape {
  protected paintTaskIcon(paintParameter: PaintParameter): void {
    this.paintEnvelopeIcon(paintParameter, true);
  }
}

/**
 * @internal
 */
export class ManualTaskShape extends BaseTaskShape {
  protected paintTaskIcon(paintParameter: PaintParameter): void {
    this.iconPainter.paintHandIcon({ ...paintParameter, ratioFromParent: 0.18, setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(20) });
  }
}

/**
 * @internal
 */
export class ScriptTaskShape extends BaseTaskShape {
  protected paintTaskIcon(paintParameter: PaintParameter): void {
    this.iconPainter.paintScriptIcon({
      ...paintParameter,
      ratioFromParent: 0.22,
      setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(20),
    });
  }
}

/**
 * @internal
 */
export class CallActivityShape extends BaseActivityShape {
  override paintForeground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    super.paintForeground(c, x, y, w, h);

    const paintParameter = buildPaintParameter({ canvas: c, x, y, width: w, height: h, shape: this });

    switch (mxUtils.getValue(this.style, BpmnStyleIdentifier.GLOBAL_TASK_KIND, undefined)) {
      case ShapeBpmnElementKind.GLOBAL_TASK_MANUAL: {
        this.iconPainter.paintHandIcon({
          ...paintParameter,
          ratioFromParent: 0.18,
          setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(20),
        });

        break;
      }
      case ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT: {
        this.iconPainter.paintScriptIcon({
          ...paintParameter,
          ratioFromParent: 0.22,
          setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(20),
        });

        break;
      }
      case ShapeBpmnElementKind.GLOBAL_TASK_USER: {
        this.iconPainter.paintPersonIcon({ ...paintParameter, setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(20) });
        break;
      }
      case ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE: {
        this.iconPainter.paintTableIcon({
          ...paintParameter,
          ratioFromParent: 0.6,
          setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(15),
        });
        break;
      }
      default: {
        // No symbol for the Call Activity calling a Global Task or calling a Process
        this.iconPainter.paintEmptyIcon();
      }
    }
  }
}

/**
 * @internal
 */
export class SubProcessShape extends BaseActivityShape {
  override paintBackground(c: mxAbstractCanvas2D, x: number, y: number, w: number, h: number): void {
    const subProcessKind = mxUtils.getValue(this.style, BpmnStyleIdentifier.SUB_PROCESS_KIND, undefined);
    c.save(); // ensure we can later restore the configuration
    if (subProcessKind === ShapeBpmnSubProcessKind.EVENT) {
      c.setDashed(true, false);
      c.setDashPattern('1 2');
    }

    super.paintBackground(c, x, y, w, h);

    if (subProcessKind === ShapeBpmnSubProcessKind.TRANSACTION) {
      // inspired from https://github.com/jgraph/mxgraph/blob/81dcd5cc86d48792c194ebaa3437a7ebb7a2f9d1/javascript/src/js/shape/mxRectangleShape.js#L79-L102
      // use a dedicated value for the arcSize. Using the value from the style generates an arc which is different from the arc of the outer rectangle
      const innerOffset = StyleDefault.SUB_PROCESS_TRANSACTION_INNER_RECT_OFFSET;
      const innerArcSize = StyleDefault.SUB_PROCESS_TRANSACTION_INNER_RECT_ARC_SIZE;
      c.roundrect(x + innerOffset, y + innerOffset, w - 2 * innerOffset, h - 2 * innerOffset, innerArcSize, innerArcSize);
      // don't fill to avoid to apply the color and its opacity twice. Fill is already done by the regular rectangle painting
      c.stroke();
    }

    // Restore original configuration to avoid side effects if the iconPainter changed the canvas configuration (colors, ....)
    c.restore();
  }
}

/**
 * @internal
 */
export class BusinessRuleTaskShape extends BaseTaskShape {
  protected paintTaskIcon(paintParameter: PaintParameter): void {
    this.iconPainter.paintTableIcon({
      ...paintParameter,
      ratioFromParent: 0.6,
      setIconOriginFunct: (canvas: BpmnCanvas) => canvas.setIconOriginToShapeTopLeftProportionally(15),
    });
  }
}
