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
  constructor(root: any, styleEnabled?: any) {
    super(root, styleEnabled);
  }
  addNode(filled: any, stroked: any): void {
    console.log(this);
    super.addNode(filled, stroked);
    console.log('ADDING NODE FROM EXT');
  }
}

mxShape.prototype.createSvgCanvas = function() {
  console.log(this);
  console.log(this.state.cell.id);
  console.log(this.state.cell.style);
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

  //
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
