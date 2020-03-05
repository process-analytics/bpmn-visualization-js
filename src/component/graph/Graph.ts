import MxGraphConfigurator from '../mxgraph/MxGraphConfigurator';
import BpmnJsonParser from '../parser/json/BpmnJsonParser';
import BpmnXmlParser from '../parser/xml/BpmnXmlParser';
import { mxgraph, mxgraphFactory } from 'ts-mxgraph';
import MxGraphConverter from '../mxgraph/MxGraphConverter';

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

      new MxGraphConfigurator(this.graph).configureStyles();
    } catch (e) {
      mxUtils.alert('Cannot start application: ' + e.message);
      throw e;
    }
  }

  public load(xml: string): void {
    const json = new BpmnXmlParser().parse(xml);
    console.log(json);

    const { shapes } = BpmnJsonParser.parse(json);

    const model = this.graph.getModel();
    model.clear(); // ensure to remove manual changes or already loaded graphs
    model.beginUpdate();
    try {
      new MxGraphConverter(this.graph).insertShapes(shapes);
    } catch (e) {
      mxUtils.alert('Cannot load bpmn diagram: ' + e.message);
      throw e;
    } finally {
      model.endUpdate();
    }
  }
}
