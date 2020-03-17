import { mxgraph, mxgraphFactory } from 'ts-mxgraph';
import BpmnModel from '../../../src/model/bpmn/BpmnModel';
import MxGraphRenderer from '../../../src/component/mxgraph/MxGraphRenderer';
import { ShapeBpmnElementKind } from '../../../src/model/bpmn/shape/ShapeBpmnElementKind';
import Bounds from '../../../src/model/bpmn/Bounds';
import ShapeBpmnElement from '../../../src/model/bpmn/shape/ShapeBpmnElement';
import Shape from '../../../src/model/bpmn/shape/Shape';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

// const { mxGraph, mxGraphModel } = mxgraphFactory({
//   mxLoadResources: false,
//   mxLoadStylesheets: false,
// });

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

describe('mxgraph renderer', function() {
  // const windowRef = global.window;
  beforeEach('stub global window', function() {
    // runs before each test in this block
    // global.window
    console.info('before');

    // Object.defineProperty(global, 'document', {});
    // Object.defineProperty(global, 'window', {});
  });
  afterEach('restore global window', function() {
    // global.window = windowRef;
    console.info('after');
  });

  it('elements in lane using absolute coordinates are placed at the right relative coordinates in the lane', function() {
    const dom = new JSDOM(`<!DOCTYPE html><div id="graph">here comes the graph</div>`);
    console.log(dom.window.document.querySelector('div').textContent);

    const container = dom.window.document.querySelector('div');
    // const container = dom.window.document.createElement('<div>');
    // container.id = 'graph';
    // console.log(container);

    // Object.defineProperty(global, 'window', {});
    //window = dom.window;
    window = null; //dom.window;

    // const mxGraphRenderer: MxGraphRenderer = null;

    const { mxGraph, mxGraphModel } = mxgraphFactory({
      mxLoadResources: false,
      mxLoadStylesheets: false,
    });
    //
    // const container: any = null;
    const graph = new mxGraph(container, new mxGraphModel());
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
