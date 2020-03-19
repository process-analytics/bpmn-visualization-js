import MxGraphConfigurator from '../mxgraph/MxGraphConfigurator';
import { mxgraph } from 'ts-mxgraph';
import MxGraphRenderer from '../mxgraph/MxGraphRenderer';
import BpmnParser from '../parser/BpmnParser';
import { MxGraphFactoryService } from '../../service/MxGraphFactoryService';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Graph {
  private mxClient: any = MxGraphFactoryService.getMxGraphProperty('mxClient');
  private mxUtils: any = MxGraphFactoryService.getMxGraphProperty('mxUtils');

  public readonly graph: mxgraph.mxGraph;

  constructor(protected container: Element) {
    try {
      if (!this.mxClient.isBrowserSupported()) {
        this.mxUtils.error('Browser is not supported!', 200, false);
      }
      // Instantiate and configure Graph
      const configurator = new MxGraphConfigurator(this.container);
      this.graph = configurator.getGraph();
    } catch (e) {
      // TODO error handling
      this.mxUtils.alert('Cannot start application: ' + e.message);
      throw e;
    }
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
