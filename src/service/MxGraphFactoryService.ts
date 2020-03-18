import { mxgraphFactory } from 'ts-mxgraph';

type MxGraphProperty = 'mxClient' | 'mxGraph' | 'mxGraphModel' | 'mxUtils' | 'mxConstants' | 'mxPerimeter' | 'mxPoint';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class MxGraphFactoryService {
  private static instance: MxGraphFactoryService = null;
  private constructor(private readonly mxGraphLib: any) {}

  private static getInstance(): MxGraphFactoryService {
    if (MxGraphFactoryService.instance === null) {
      const mxGraphLib = mxgraphFactory({
        mxLoadResources: false,
        mxLoadStylesheets: false,
      });
      MxGraphFactoryService.instance = new MxGraphFactoryService(mxGraphLib);
    }
    return MxGraphFactoryService.instance;
  }
  public static getMxGraphProperty(propertyName: MxGraphProperty): any {
    return MxGraphFactoryService.getInstance().mxGraphLib[propertyName];
  }
}
