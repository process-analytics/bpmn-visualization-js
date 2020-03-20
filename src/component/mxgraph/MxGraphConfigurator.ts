import { mxgraph } from 'ts-mxgraph';
import { MxGraphFactoryService } from '../../service/MxGraphFactoryService';
import StyleConfigurator from './StyleConfigurator';
import ShapeConfigurator from './ShapeConfigurator';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Configure mxgraph
 * <ul>
 *     <li>styles
 *     <li>shapes
 */
export default class MxGraphConfigurator {
  private mxClient: any = MxGraphFactoryService.getMxGraphProperty('mxClient');
  private mxGraph: any = MxGraphFactoryService.getMxGraphProperty('mxGraph');
  private mxGraphModel: any = MxGraphFactoryService.getMxGraphProperty('mxGraphModel');

  private readonly graph: mxgraph.mxGraph;

  constructor(container: Element) {
    this.initMxGraphPrototype();
    this.graph = new this.mxGraph(container, new this.mxGraphModel());
    const styleConfigurator = new StyleConfigurator(this.graph);
    styleConfigurator.configureStyles();
    const shapeConfigurator = new ShapeConfigurator();
    shapeConfigurator.initMxShapePrototype(this.mxClient.IS_FF);
  }

  public getGraph(): mxgraph.mxGraph {
    return this.graph;
  }

  private initMxGraphPrototype(): void {
    this.mxGraph.prototype.edgeLabelsMovable = false;
    this.mxGraph.prototype.cellsLocked = true;
    this.mxGraph.prototype.cellsSelectable = false;
  }
}
