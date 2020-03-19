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
    // this.mxGraph.prototype.cellsLocked = true;
    // this.mxGraph.prototype.cellsSelectable = false;
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
