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
import G6, { Graph, IG6GraphEvent } from '@antv/g6/es';
import { GlobalOptions } from '../../options';
import NodeConfigurator from './NodeConfigurator';
import EdgeConfigurator from './EdgeConfigurator';

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
    new EdgeConfigurator().configureEdges();

    const width = this.container.scrollWidth;
    const height = this.container.scrollHeight || 700;

    /*    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 700;*/

    this.graph = new G6.Graph({
      container: this.container,
      width,
      height,
      /*   fitCenter: true,
      fitView: true,*/

      renderer: 'svg',

      // Not working; Fix: https://github.com/antvis/G6/issues/2379
      modes: {
        default: [
          'drag-node',
          // 'drag-node-with-group',
          {
            type: 'drag-canvas',
            // https://github.com/antvis/G6/issues/2419
            // https://github.com/antvis/G6/issues/2366
            enableOptimize: true, // enable the optimize to hide the shapes beside nodes' keyShape
          },
          {
            type: 'zoom-canvas',
            enableOptimize: true, // enable the optimize to hide the shapes beside nodes' keyShape
          },
        ],
      },
      defaultNode: {
        type: 'star',
        size: [20],
        color: '#5B8FF9',
        style: {
          fill: '#9EC9FF',
          lineWidth: 2,
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
          lineAppendWidth: 2,
        },
      },
      nodeStateStyles: {
        // The node style when the state 'hover' is true
        hover: {
          fill: 'lightsteelblue',
        },
        // The node style when the state 'click' is true
        click: {
          stroke: '#000',
          lineWidth: 3,
        },
      },
      // The edge styles in different states
      edgeStateStyles: {
        // The edge style when the state 'click' is true
        click: {
          stroke: 'steelblue',
        },
      },
    });

    this.updateItemStateOnEvent();


    // this.enableDraggingOnNodesAndEdges(this.graph);

    if (typeof window !== 'undefined') {
      window.onresize = () => {
        if (!this.graph || this.graph.get('destroyed')) return;
        if (!this.container || !this.container.scrollWidth || !this.container.scrollHeight) return;
        this.graph.changeSize(this.container.scrollWidth, this.container.scrollHeight);
      };
    }

    return this.graph;
  }

  private updateItemStateOnEvent() {
    // Mouse enter a node
    this.graph.on('node:mouseenter', (e) => {
      const nodeItem = e.item; // Get the target item
      this.graph.setItemState(nodeItem, 'hover', true); // Set the state 'hover' of the item to be true
    });

    // Mouse leave a node
    this. graph.on('node:mouseleave', (e) => {
      const nodeItem = e.item; // Get the target item
      this.graph.setItemState(nodeItem, 'hover', false); // Set the state 'hover' of the item to be false
    });

    // Click a node
    this. graph.on('node:click', (e) => {
      // Swich the 'click' state of the node to be false
      const clickNodes = this.graph.findAllByState('node', 'click');
      clickNodes.forEach((cn) => {
        this.graph.setItemState(cn, 'click', false);
      });
      const nodeItem = e.item; // et the clicked item
      this. graph.setItemState(nodeItem, 'click', true); // Set the state 'click' of the item to be true
    });

    // Click an edge
    this.graph.on('edge:click', (e) => {
      // Swich the 'click' state of the edge to be false
      const clickEdges = this.graph.findAllByState('edge', 'click');
      clickEdges.forEach((ce) => {
        this. graph.setItemState(ce, 'click', false);
      });
      const edgeItem = e.item; // Get the clicked item
      this. graph.setItemState(edgeItem, 'click', true); // Set the state 'click' of the item to be true
    });
  }

  private enableDraggingOnNodesAndEdges(graph: Graph): void {
    /**
     * Normally, edges and nodes capture any event that originate on them
     * Therefore, we need to forward those event to the canvas to enable dragging that starts on nodes or edges
     * Additionally, event.shape needs to be undefined in order work correctly with the native implementation of 'drag-canvas'
     */
    graph.on('node:dragstart', (event: IG6GraphEvent) => {
      (event.shape as any) = undefined;
      graph.emit('dragstart', event);
    });
    graph.on('node:drag', (event: IG6GraphEvent) => {
      (event.shape as any) = undefined;
      graph.emit('drag', event);
    });
    graph.on('node:dragend', (event: IG6GraphEvent) => {
      (event.shape as any) = undefined;
      graph.emit('dragend', event);
    });
    graph.on('edge:dragstart', (event: IG6GraphEvent) => {
      (event.shape as any) = undefined;
      graph.emit('dragstart', event);
    });
    graph.on('edge:drag', (event: IG6GraphEvent) => {
      (event.shape as any) = undefined;
      graph.emit('drag', event);
    });
    graph.on('edge:dragend', (event: IG6GraphEvent) => {
      (event.shape as any) = undefined;
      graph.emit('dragend', event);
    });
  }

  /*
    private configureGraph(): void {
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

    private configureNavigationSupport(options: GlobalOptions): void {
      const panningHandler = this.graph.panningHandler;
      if (options?.navigation?.enabled) {
        // Pan configuration
        panningHandler.addListener(mxgraph.mxEvent.PAN_START, this.getPanningHandler('grab'));
        panningHandler.addListener(mxgraph.mxEvent.PAN_END, this.getPanningHandler('default'));

        this.graph.panningHandler.usePopupTrigger = false; // only use the left button to trigger panning
        // Reimplement the function as we also want to trigger 'panning on cells' (ignoreCell to true) and only on left click
        // The mxGraph standard implementation doesn't ignore right click in this case, so do it by ourself
        panningHandler.isForcePanningEvent = (me): boolean => mxgraph.mxEvent.isLeftMouseButton(me.getEvent()) || mxgraph.mxEvent.isMultiTouchEvent(me.getEvent());
        this.graph.setPanning(true);

        // Zoom configuration
        this.graph.createMouseWheelZoomExperience(options?.navigation?.zoom);
      } else {
        this.graph.setPanning(false);
        // Disable gesture support for zoom
        panningHandler.setPinchEnabled(false);
        // Disable panning on touch device
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        panningHandler.isForcePanningEvent = (me: mxMouseEvent): boolean => false;
      }
    }

    private getPanningHandler(cursor: 'grab' | 'default'): OmitThisParameter<(this: BpmnMxGraph) => void> {
      return this.getPanningHandlerCallback(cursor).bind(this.graph);
    }

    private getPanningHandlerCallback(cursor: 'grab' | 'default'): () => void {
      return function (this: BpmnMxGraph): void {
        this.isEnabled() && (this.container.style.cursor = cursor);
      };
    }
  */
}
