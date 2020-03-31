/**
 * Copyright 2020 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { mxgraphFactory } from 'ts-mxgraph';

type MxGraphProperty =
  | 'mxCellRenderer'
  | 'mxClient'
  | 'mxConstants'
  | 'mxEllipse'
  | 'mxGeometry'
  | 'mxGraph'
  | 'mxGraphModel'
  | 'mxPerimeter'
  | 'mxPoint'
  | 'mxShape'
  | 'mxSvgCanvas2D'
  | 'mxUtils';

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
