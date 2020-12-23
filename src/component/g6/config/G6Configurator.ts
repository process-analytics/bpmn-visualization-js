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
import G6, { Graph } from '@antv/g6';
import { GlobalOptions } from '../../options';
import NodeConfigurator from './NodeConfigurator';
import { ShapeBpmnElementKind } from '../../../model/bpmn/internal/shape';
import { IShape } from '@antv/g-canvas/lib/interfaces';

/**
 * Configure the BpmnMxGraph graph that can be used by the lib
 * <ul>
 *     <li>styles
 *     <li>shapes
 *     <li>markers
 */
export default class G6Configurator {
  private graph: Graph;

  constructor(readonly container: HTMLElement) {}

  public configure(options?: GlobalOptions): Graph {
    /*    this.configureGraph();
    this.configureMouseNavigationSupport(options);
    new StyleConfigurator(this.graph).configureStyles();
    new MarkerConfigurator().configureMarkers();
    new MxClientConfigurator().configureMxCodec();*/
    new NodeConfigurator().configureNodes();

    const width = this.container.scrollWidth;
    const height = this.container.scrollHeight || 500;

    this.graph = new G6.Graph({
      container: this.container,
      width,
      height,
      fitCenter: true,
      fitView: true,
      defaultNode: {
        type: 'star',
        size: [20],
        color: '#5B8FF9',
        style: {
          fill: '#9EC9FF',
          lineWidth: 10,
        },
        labelCfg: {
          style: {
            fill: '#fff',
            fontSize: 20,
          },
        },
      },
      defaultEdge: {
        style: {
          stroke: '#e2e2e2',
        },
      },
    });

    if (typeof window !== 'undefined') {
      window.onresize = () => {
        if (!this.graph || this.graph.get('destroyed')) return;
        if (!this.container || !this.container.scrollWidth || !this.container.scrollHeight) return;
        this.graph.changeSize(this.container.scrollWidth, this.container.scrollHeight);
      };
    }

    return this.graph;
  }

  /*private configureGraph(): void {
    this.graph.setCellsLocked(true);
    this.graph.setCellsSelectable(false);
    this.graph.setEdgeLabelsMovable(false);

    this.graph.setHtmlLabels(true); // required for wrapping

    // To have the boundary event on the border of a task
    this.graph.setConstrainChildren(false);
    this.graph.setExtendParents(false);

    // Disable folding for container mxCell (pool, lane, sub process, call activity) because we don't need it.
    // This also prevents requesting unavailable images (see #185) as we don't override BpmnMxGraph folding default images.
    this.graph.foldingEnabled = false;
  }

  private configureMouseNavigationSupport(options?: GlobalOptions): void {
    const mouseNavigationSupport = options?.mouseNavigationSupport;
    // Pan configuration
    if (mouseNavigationSupport) {
      this.graph.panningHandler.useLeftButtonForPanning = true;
      this.graph.panningHandler.ignoreCell = true; // ok here as we cannot select cells
      this.graph.panningHandler.addListener(mxEvent.PAN_START, this.getPanningHandler('grab'));
      this.graph.panningHandler.addListener(mxEvent.PAN_END, this.getPanningHandler('default'));
      this.graph.setPanning(true);

      // Zoom configuration
      this.graph.createMouseWheelZoomExperience(options.zoomConfiguration);
    } else {
      this.graph.setPanning(false);
      this.graph.panningHandler.setPinchEnabled(false); // ensure gesture support is disabled (zoom only for now!)
    }
  }

  private getPanningHandler(cursor: 'grab' | 'default'): OmitThisParameter<(this: BpmnMxGraph) => void> {
    return this.getPanningHandlerCallback(cursor).bind(this.graph);
  }

  private getPanningHandlerCallback(cursor: 'grab' | 'default'): () => void {
    return function (this: BpmnMxGraph): void {
      this.isEnabled() && (this.container.style.cursor = cursor);
    };
  }*/
}
