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

export default class MxClientConfigurator {
  public configureMxCodec(): void {
    mxCodec.prototype.decode = function(node: Element, into: Element) {
      // Check for the existence of global constructor, throw explicit Error if not
      if (node !== null && node.nodeType === mxConstants.NODETYPE_ELEMENT) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ctor = (window as any)[node.nodeName];
        if (!ctor) {
          throw new Error(`Missing constructor for ${node.nodeName}`);
        }
        const dec = mxCodecRegistry.getCodec(ctor);
        if (dec !== null) {
          return dec.decode(this, node, into);
        }
        const obj = node.cloneNode(true) as Element;
        obj.removeAttribute('as');
        return obj;
      }
      return null;
    };
  }
}
