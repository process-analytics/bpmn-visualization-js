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
import { ModelConfig, IGroup, IShape } from '@antv/g6/es';

export function drawSwinlane(): (cfg?: ModelConfig, group?: IGroup) => IShape {
  return (cfg, group): IShape => {
    const width = (cfg.size as number[])[0];
    const height = (cfg.size as number[])[1];
    const shape = group.addShape('rect', {
      attrs: {
        width,
        height,
        stroke: 'black',
        anchorPoints: cfg.anchorPoints,
      },
      name: 'main-box',
      draggable: true,
    });

    group.addShape('rect', {
      attrs: {
        width,
        height: 20,
      },
      name: 'title-box',
      draggable: true,
    });

    // title text
    group.addShape('text', {
      attrs: {
        textBaseline: 'top',
        x: cfg.labelCfg.refX,
        y: cfg.labelCfg.refY,
        lineHeight: width - 20, // or height if pool/lane horizontal
        text: cfg.label,
        fill: 'black',
      },
      name: 'title',
    });

    /*    if (cfg.nodeLevel > 0) {
      group.addShape('marker', {
        attrs: {
          x: 184,
          y: 30,
          r: 6,
          cursor: 'pointer',
          symbol: cfg.collapse ? G6.Marker.expand : G6.Marker.collapse,
          stroke: '#666',
          lineWidth: 1,
        },
        name: 'collapse-icon',
      });
    }*/

    return shape;
  };
}
