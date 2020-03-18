import { mxgraphFactory } from 'ts-mxgraph';

const { mxClient, mxUtils, mxGraph, mxGraphModel, mxConstants, mxPerimeter, mxPoint } = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false,
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export class MxGraphFactoryService {
  private static instance: MxGraphFactoryService = null;
  private constructor(
    public mxClient: any,
    public mxGraph: any,
    public mxGraphModel: any,
    public mxUtils: any,
    public mxConstants: any,
    public mxPerimeter: any,
    public mxPoint: any,
  ) {}

  public static getInstance(): MxGraphFactoryService {
    if (MxGraphFactoryService.instance === null) {
      MxGraphFactoryService.instance = new MxGraphFactoryService(mxClient, mxGraph, mxGraphModel, mxUtils, mxConstants, mxPerimeter, mxPoint);
    }
    return MxGraphFactoryService.instance;
  }
}
