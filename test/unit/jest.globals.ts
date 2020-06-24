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

const { mxConstants, mxPoint } = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false,
});
// to prevent TS error Property 'mxXyz' does not exist on type 'Global'.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global;

globalAny.mxPoint = mxPoint;
globalAny.mxConstants = mxConstants;
