import { mxgraph, mxgraphFactory } from './../../../node_modules/ts-mxgraph/index';

const { mxClient, mxUtils, mxGraph, mxGraphModel } = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false,
});

export default class Graph {
  protected readonly graph: mxgraph.mxGraph;

  constructor(protected container: Element) {
    try {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
      }
      // Instantiate Graph
      this.graph = new mxGraph(this.container, new mxGraphModel());
    } catch (e) {
      mxUtils.alert('Cannot start application: ' + e.message);
      throw e;
    }
  }
}
