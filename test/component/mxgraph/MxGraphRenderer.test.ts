import { mxgraphFactory } from 'ts-mxgraph';
import BpmnModel from '../../../src/model/bpmn/BpmnModel';
import MxGraphRenderer from '../../../src/component/mxgraph/MxGraphRenderer';
import { ShapeBpmnElementKind } from '../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import Bounds from '../../../src/model/bpmn/Bounds';
import ShapeBpmnElement from '../../../src/model/bpmn/shape/ShapeBpmnElement';
import Shape from '../../../src/model/bpmn/shape/Shape';
import { expect } from 'chai';

const { mxGraph, mxGraphModel } = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false,
});

interface ElementConfig {
  bpmnElementId: string;
  bpmnElementName: string;
  boundsX: number;
  boundsY: number;
  boundsWidth: number;
  boundsHeight: number;
}

interface ChildElementConfig extends ElementConfig {
  parentId: string;
}

function bounds(config: ElementConfig): Bounds {
  return new Bounds(config.boundsX, config.boundsY, config.boundsWidth, config.boundsHeight);
}

function bpmnElement(config: ElementConfig, kind: ShapeBpmnElementKind, parentId?: string): ShapeBpmnElement {
  return new ShapeBpmnElement(config.bpmnElementId, config.bpmnElementName, kind, parentId);
}

function lane(config: ElementConfig): Shape {
  // TODO shape id randomly generated? as we do not care about it
  return new Shape(null, bpmnElement(config, ShapeBpmnElementKind.LANE), bounds(config));
}

function startEvent(config: ChildElementConfig): Shape {
  // TODO shape id randomly generated? as we do not care about it
  return new Shape(null, bpmnElement(config, ShapeBpmnElementKind.EVENT_START, config.parentId), bounds(config));
}

describe('mxgraph renderer', () => {
  it('elements in lane using absolute coordinates are placed at the right relative coordinates in the lane', () => {
    const graph = new mxGraph(null, new mxGraphModel());
    const mxGraphRenderer = new MxGraphRenderer(graph);

    let model: BpmnModel;
    model.lanes = [
      lane({
        bpmnElementId: 'Lane_id_1',
        bpmnElementName: 'Lane 1',
        boundsX: 100,
        boundsY: 100,
        boundsWidth: 100,
        boundsHeight: 100,
      }),
    ];

    model.flowNodes = [
      startEvent({
        bpmnElementId: 'StartEvent_id_1',
        bpmnElementName: 'StartEvent 1',
        boundsX: 100,
        boundsY: 100,
        boundsWidth: 100,
        boundsHeight: 100,
        parentId: 'Lane_id_1',
      }),
    ];

    // When
    mxGraphRenderer.render(model);

    // Then
    const startEventMxCell = mxGraphRenderer.getCell('StartEvent_id_1');
    expect(startEventMxCell).to.be.not.null('mx cell', 'start event');
  });
});
