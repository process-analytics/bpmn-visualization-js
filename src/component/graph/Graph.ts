import MxGraphConfigurator from '../mxgraph/MxGraphConfigurator';
import { mxgraph, mxgraphFactory } from 'ts-mxgraph';
import MxGraphRenderer from '../mxgraph/MxGraphRenderer';
import BpmnParser from '../parser/BpmnParser';

const { mxClient, mxUtils, mxGraph, mxGraphModel, mxShape, mxSvgCanvas2D } = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false,
});

mxGraph.prototype.edgeLabelsMovable = false;
mxGraph.prototype.cellsLocked = true;
mxGraph.prototype.cellsSelectable = false;

class MySvgCanvas2D extends mxSvgCanvas2D {
  public minStrokeWidth: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(root: any, styleEnabled?: any) {
    super(root, styleEnabled);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addNode(filled: any, stroked: any): void {
    super.addNode(filled, stroked);
  }
}

mxShape.prototype.createSvgCanvas = function() {
  const canvas = new MySvgCanvas2D(this.node, false);
  canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
  canvas.pointerEventsValue = this.svgPointerEvents;
  canvas.blockImagePointerEvents = mxClient.IS_FF;
  const off = this.getSvgScreenOffset();

  if (off != 0) {
    this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
  } else {
    this.node.removeAttribute('transform');
  }

  // add attributes to be able to identify elements in DOM
  this.node.setAttribute('class', 'class-state-cell-style-' + this.state.cell.style);
  this.node.setAttribute('data-cell-id', this.state.cell.id);
  //
  canvas.minStrokeWidth = this.minSvgStrokeWidth;

  if (!this.antiAlias) {
    // Rounds all numbers in the SVG output to integers
    canvas.format = function(value) {
      return Math.round(parseFloat(value));
    };
  }

  return canvas;
};

export default class Graph {
  readonly graph: mxgraph.mxGraph;

  constructor(protected container: Element) {
    try {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
      }
      // Instantiate Graph
      this.graph = new mxGraph(this.container, new mxGraphModel());

      new MxGraphConfigurator(this.graph).configureStyles();
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot start application: ' + e.message);
      throw e;
    }
  }

  public load(xml: string): void {
    try {
      const bpmnModel = new BpmnParser().parse(xml);
      new MxGraphRenderer(this.graph).render(bpmnModel);
    } catch (e) {
      // TODO error handling
      mxUtils.alert('Cannot load bpmn diagram: ' + e.message);
      throw e;
    }
  }
}
