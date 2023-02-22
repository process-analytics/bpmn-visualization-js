/// <reference path="./lib/editor/index.d.ts" />
/// <reference path="./lib/handler/index.d.ts" />
/// <reference path="./lib/io/index.d.ts" />
/// <reference path="./lib/layout/index.d.ts" />
/// <reference path="./lib/model/index.d.ts" />
/// <reference path="./lib/util/index.d.ts" />
/// <reference path="./lib/shape/index.d.ts" />
/// <reference path="./lib/view/index.d.ts" />
/// <reference path="./lib/mxClient.d.ts" />

declare module 'mxgraph' {
  export interface mxGraphExportObject {
    mxClient: typeof mxClient;
    mxLog: typeof mxLog;
    mxObjectIdentity: typeof mxObjectIdentity;
    mxDictionary: typeof mxDictionary;
    mxResources: typeof mxResources;
    mxPoint: typeof mxPoint;
    mxRectangle: typeof mxRectangle;
    mxEffects: typeof mxEffects;
    mxUtils: typeof mxUtils;
    mxConstants: typeof mxConstants;
    mxEventObject: typeof mxEventObject;
    mxMouseEvent: typeof mxMouseEvent;
    mxEventSource: typeof mxEventSource;
    mxEvent: typeof mxEvent;
    mxXmlRequest: typeof mxXmlRequest;
    mxClipboard: typeof mxClipboard;
    mxWindow: typeof mxWindow;
    mxForm: typeof mxForm;
    mxImage: typeof mxImage;
    mxDivResizer: typeof mxDivResizer;
    mxDragSource: typeof mxDragSource;
    mxToolbar: typeof mxToolbar;
    mxUndoableEdit: typeof mxUndoableEdit;
    mxUndoManager: typeof mxUndoManager;
    mxUrlConverter: typeof mxUrlConverter;
    mxPanningManager: typeof mxPanningManager;
    mxPopupMenu: typeof mxPopupMenu;
    mxAutoSaveManager: typeof mxAutoSaveManager;
    mxAnimation: typeof mxAnimation;
    mxMorphing: typeof mxMorphing;
    mxImageBundle: typeof mxImageBundle;
    mxImageExport: typeof mxImageExport;
    mxAbstractCanvas2D: typeof mxAbstractCanvas2D;
    mxXmlCanvas2D: typeof mxXmlCanvas2D;
    mxSvgCanvas2D: typeof mxSvgCanvas2D;
    mxVmlCanvas2D: typeof mxVmlCanvas2D;
    mxGuide: typeof mxGuide;
    mxShape: typeof mxShape;
    mxStencil: typeof mxStencil;
    mxStencilRegistry: typeof mxStencilRegistry;
    mxMarker: typeof mxMarker;
    mxActor: typeof mxActor;
    mxCloud: typeof mxCloud;
    mxRectangleShape: typeof mxRectangleShape;
    mxEllipse: typeof mxEllipse;
    mxDoubleEllipse: typeof mxDoubleEllipse;
    mxRhombus: typeof mxRhombus;
    mxPolyline: typeof mxPolyline;
    mxArrow: typeof mxArrow;
    mxArrowConnector: typeof mxArrowConnector;
    mxText: typeof mxText;
    mxTriangle: typeof mxTriangle;
    mxHexagon: typeof mxHexagon;
    mxLine: typeof mxLine;
    mxImageShape: typeof mxImageShape;
    mxLabel: typeof mxLabel;
    mxCylinder: typeof mxCylinder;
    mxConnector: typeof mxConnector;
    mxSwimlane: typeof mxSwimlane;
    mxGraphLayout: typeof mxGraphLayout;
    mxStackLayout: typeof mxStackLayout;
    mxPartitionLayout: typeof mxPartitionLayout;
    mxCompactTreeLayout: typeof mxCompactTreeLayout;
    mxRadialTreeLayout: typeof mxRadialTreeLayout;
    mxFastOrganicLayout: typeof mxFastOrganicLayout;
    mxCircleLayout: typeof mxCircleLayout;
    mxParallelEdgeLayout: typeof mxParallelEdgeLayout;
    mxCompositeLayout: typeof mxCompositeLayout;
    mxEdgeLabelLayout: typeof mxEdgeLabelLayout;
    mxGraphAbstractHierarchyCell: typeof mxGraphAbstractHierarchyCell;
    mxGraphHierarchyNode: typeof mxGraphHierarchyNode;
    mxGraphHierarchyEdge: typeof mxGraphHierarchyEdge;
    mxGraphHierarchyModel: typeof mxGraphHierarchyModel;
    mxSwimlaneModel: typeof mxSwimlaneModel;
    mxHierarchicalLayoutStage: typeof mxHierarchicalLayoutStage;
    mxMedianHybridCrossingReduction: typeof mxMedianHybridCrossingReduction;
    mxMinimumCycleRemover: typeof mxMinimumCycleRemover;
    mxCoordinateAssignment: typeof mxCoordinateAssignment;
    mxSwimlaneOrdering: typeof mxSwimlaneOrdering;
    mxHierarchicalLayout: typeof mxHierarchicalLayout;
    mxSwimlaneLayout: typeof mxSwimlaneLayout;
    mxGraphModel: typeof mxGraphModel;
    mxCell: typeof mxCell;
    mxGeometry: typeof mxGeometry;
    mxCellPath: typeof mxCellPath;
    mxPerimeter: typeof mxPerimeter;
    mxPrintPreview: typeof mxPrintPreview;
    mxStylesheet: typeof mxStylesheet;
    mxCellState: typeof mxCellState;
    mxGraphSelectionModel: typeof mxGraphSelectionModel;
    mxCellEditor: typeof mxCellEditor;
    mxCellRenderer: typeof mxCellRenderer;
    mxEdgeStyle: typeof mxEdgeStyle;
    mxStyleRegistry: typeof mxStyleRegistry;
    mxGraphView: typeof mxGraphView;
    mxGraph: typeof mxGraph;
    mxCellOverlay: typeof mxCellOverlay;
    mxOutline: typeof mxOutline;
    mxMultiplicity: typeof mxMultiplicity;
    mxLayoutManager: typeof mxLayoutManager;
    mxSwimlaneManager: typeof mxSwimlaneManager;
    mxTemporaryCellStates: typeof mxTemporaryCellStates;
    mxCellStatePreview: typeof mxCellStatePreview;
    mxConnectionConstraint: typeof mxConnectionConstraint;
    mxGraphHandler: typeof mxGraphHandler;
    mxPanningHandler: typeof mxPanningHandler;
    mxPopupMenuHandler: typeof mxPopupMenuHandler;
    mxCellMarker: typeof mxCellMarker;
    mxSelectionCellsHandler: typeof mxSelectionCellsHandler;
    mxConnectionHandler: typeof mxConnectionHandler;
    mxConstraintHandler: typeof mxConstraintHandler;
    mxRubberband: typeof mxRubberband;
    mxHandle: typeof mxHandle;
    mxVertexHandler: typeof mxVertexHandler;
    mxEdgeHandler: typeof mxEdgeHandler;
    mxElbowEdgeHandler: typeof mxElbowEdgeHandler;
    mxEdgeSegmentHandler: typeof mxEdgeSegmentHandler;
    mxKeyHandler: typeof mxKeyHandler;
    mxTooltipHandler: typeof mxTooltipHandler;
    mxCellTracker: typeof mxCellTracker;
    mxCellHighlight: typeof mxCellHighlight;
    mxDefaultKeyHandler: typeof mxDefaultKeyHandler;
    mxDefaultPopupMenu: typeof mxDefaultPopupMenu;
    mxDefaultToolbar: typeof mxDefaultToolbar;
    mxEditor: typeof mxEditor;
    mxCodecRegistry: typeof mxCodecRegistry;
    mxCodec: typeof mxCodec;
    mxObjectCodec: typeof mxObjectCodec;
    mxCellCodec: mxObjectCodec;
    mxModelCodec: mxObjectCodec;
    mxRootChangeCodec: mxObjectCodec;
    mxChildChangeCodec: mxObjectCodec;
    mxTerminalChangeCodec: mxObjectCodec;
    mxGenericChangeCodec: typeof mxGenericChangeCodec;
    mxGraphCodec: mxObjectCodec;
    mxGraphViewCodec: mxObjectCodec;
    mxStylesheetCodec: mxObjectCodec;
    mxDefaultKeyHandlerCodec: mxObjectCodec;
    mxDefaultToolbarCodec: mxObjectCodec;
    mxDefaultPopupMenuCodec: mxObjectCodec;
    mxEditorCodec: mxObjectCodec;
  }

  export type mxGraphOptions = {
    mxBasePath?: string;
    mxImageBasePath?: string;
    mxLanguage?: string;
    mxDefaultLanguage?: string;
    mxLoadResources?: boolean;
    mxLoadStylesheets?: boolean;
  };

  export default function (options?: mxGraphOptions): mxGraphExportObject;
}
