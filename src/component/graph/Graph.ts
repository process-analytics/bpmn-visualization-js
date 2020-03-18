import MxGraphConfigurator from '../mxgraph/MxGraphConfigurator';
import { mxgraph } from 'ts-mxgraph';
import MxGraphRenderer from '../mxgraph/MxGraphRenderer';
import BpmnParser from '../parser/BpmnParser';
import { MxGraphFactoryService } from '../../service/MxGraphFactoryService';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Graph {
  private mxClient: any = MxGraphFactoryService.getMxGraphProperty('mxClient');
  private mxUtils: any = MxGraphFactoryService.getMxGraphProperty('mxUtils');
  private mxGraph: any = MxGraphFactoryService.getMxGraphProperty('mxGraph');
  private mxGraphModel: any = MxGraphFactoryService.getMxGraphProperty('mxGraphModel');
  private mxSvgCanvas2D: any = MxGraphFactoryService.getMxGraphProperty('mxSvgCanvas2D');
  private mxShape: any = MxGraphFactoryService.getMxGraphProperty('mxShape');

  protected readonly graph: mxgraph.mxGraph;

  constructor(protected container: Element) {
    try {
      this.initMxGraphPrototype();
      if (!this.mxClient.isBrowserSupported()) {
        this.mxUtils.error('Browser is not supported!', 200, false);
      }
      // Instantiate Graph
      this.graph = new this.mxGraph(this.container, new this.mxGraphModel());

      new MxGraphConfigurator(this.graph).configureStyles();
    } catch (e) {
      // TODO error handling
      this.mxUtils.alert('Cannot start application: ' + e.message);
      throw e;
    }
  }

  // TODO move to MxGraphConfigurator
  private initMxGraphPrototype(): void {
    this.mxGraph.prototype.edgeLabelsMovable = false;
    this.mxGraph.prototype.cellsLocked = true;
    this.mxGraph.prototype.cellsSelectable = false;
    class MySvgCanvas2D extends this.mxSvgCanvas2D {
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

    this.mxShape.prototype.createSvgCanvas = function() {
      const canvas = new MySvgCanvas2D(this.node, false);
      canvas.strokeTolerance = this.pointerEvents ? this.svgStrokeTolerance : 0;
      canvas.pointerEventsValue = this.svgPointerEvents;
      canvas.blockImagePointerEvents = this.mxClient.IS_FF;
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
        canvas.format = function(value: string) {
          return Math.round(parseFloat(value));
        };
      }

      return canvas;
    };
  }

  public load(xml: string): void {
    try {
      const bpmnModel = new BpmnParser().parse(xml);
      new MxGraphRenderer(this.graph).render(bpmnModel);
    } catch (e) {
      // TODO error handling
      this.mxUtils.alert('Cannot load bpmn diagram: ' + e.message);
      throw e;
    }
  }
}
