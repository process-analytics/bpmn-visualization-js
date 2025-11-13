# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`bpmn-visualization` is a TypeScript library for visualizing process execution data on BPMN diagrams. It parses BPMN 2.0 XML, builds an internal model, and renders interactive diagrams using mxGraph with extensive customization capabilities.

## Common Development Commands

### Setup and Development
```bash
npm install                    # Install dependencies
npm run dev                    # Start dev server at http://localhost:10001/dev/public/index.html
npm run all                    # Full check: clean, lint, build, test (run before PRs)
```

### Building
```bash
npm run build                  # TypeScript compilation check (no output)
npm run build-bundles          # Create distribution bundles (ESM, IIFE)
npm run prepack                # Full build: generate types + bundles (runs before npm pack)
```

### Testing
```bash
npm test                       # Run all tests (unit + integration + e2e)
npm run test:unit              # Jest unit tests (parsers, converters, utilities)
npm run test:unit:coverage     # Unit tests with coverage
npm run test:unit:watch        # Watch mode for unit tests
npm run test:integration       # Integration tests (parser → renderer)
npm run test:e2e               # Playwright E2E with visual regression
npm run test:e2e:verbose       # E2E tests with debug output
npm run test:perf              # Performance benchmarks
npm run test:bundles           # Validate distribution bundles
```

To run a single test file:
```bash
# Unit test
npx jest test/unit/path/to/test-file.test.ts --config=./test/unit/jest.config.cjs

# Integration test
npx jest test/integration/path/to/test-file.test.ts --config=./test/integration/jest.config.cjs

# E2E test
npx jest test/e2e/path/to/test-file.test.ts --config=./test/e2e/jest.config.cjs
```

### Linting and Code Quality
```bash
npm run lint                   # Auto-fix linting issues
npm run lint-check             # Check linting without fixing
```

### Documentation
```bash
npm run docs                   # Generate all documentation
npm run docs:user              # Generate user documentation
npm run docs:api               # Generate API documentation with typedoc
```

## Architecture Overview

The library follows a **3-layer pipeline architecture** with clear separation of concerns:

```
BpmnVisualization.load(xml)
  ├─ 1. Parse:    XML → BpmnModel (internal representation)
  ├─ 2. Register: BpmnModel → RenderedModel (prepare for rendering)
  └─ 3. Render:   RenderedModel → mxGraph cells (visual display)
```

### 1. Parsing Layer (`src/component/parser/`)

**Two-stage parsing:**
- **Stage 1:** `BpmnXmlParser` converts BPMN XML to JSON using `fast-xml-parser`
- **Stage 2:** `BpmnJsonParser` orchestrates converters to build `BpmnModel`

**Key Converters** (in `src/component/parser/json/converter/`):
- `ProcessConverter` - Activities, events, gateways, sequence flows
- `CollaborationConverter` - Pools, lanes, message flows
- `DiagramConverter` - Visual information (shapes, edges, bounds, labels)
- `EventDefinitionConverter` - Event definitions (timer, message, error, etc.)

**Critical Pattern:** Converters populate a shared `ConvertedElements` registry during semantic parsing, then `DiagramConverter` links visual bounds/waypoints to semantic elements.

### 2. Model Layer (`src/model/bpmn/internal/`)

**Core types:**
- `BpmnModel` - Top-level container (pools, lanes, flowNodes, edges)
- `Shape` - Combines `ShapeBpmnElement` (semantic) + `Bounds` (visual) + `Label`
- `Edge` - Combines `EdgeBpmnElement` (semantic) + waypoints (visual) + `Label`
- `ShapeBpmnElement` hierarchy - Rich type system with markers, event definitions, subprocess kinds

**Important:** The model is **mxGraph-independent** - pure domain model of BPMN.

### 3. Rendering Layer (`src/component/mxgraph/`)

**Initialization chain:**
```
GraphConfigurator
  ├─ Creates BpmnGraph (extends mxGraph)
  ├─ StyleConfigurator.configureStyles()
  ├─ registerShapes() - Custom mxShape implementations
  └─ registerEdgeMarkers() - Custom edge markers
```

**BpmnRenderer:**
- Converts `RenderedModel` to mxGraph cells via `insertVertex()`/`insertEdge()`
- Uses `StyleComputer` to generate mxGraph style strings
- Uses `CoordinatesTranslator` for coordinate transformations (BPMN uses absolute coords, mxGraph uses relative-to-parent)
- Inserts in order: pools → lanes → subprocesses → flow nodes → boundary events → edges

**Custom Shapes** (`src/component/mxgraph/shape/`):
- Each BPMN element has custom `mxShape` subclass (EventShape, TaskShape, GatewayShape)
- `IconPainter` renders BPMN-specific icons (event definitions, task markers)
- `BpmnCanvas` extends mxGraph canvas with BPMN primitives

### 4. Registry System (`src/component/registry/`)

`BpmnElementsRegistry` provides the public API, aggregating:
- `BpmnModelRegistry` - Semantic model access via `getBpmnSemantic(id)`
- `HtmlElementRegistry` - Query DOM elements by ID or kind
- `StyleRegistry` - Update mxGraph cell styles dynamically
- `CssClassesRegistry` - Manage CSS classes on DOM elements
- `OverlaysRegistry` - Add/remove overlays on elements

**Key insight:** Bridges semantic model with rendered DOM/mxGraph, enabling runtime manipulation without re-parsing.

## Testing Architecture

**Multi-layer approach:**
- **Unit** (`test/unit/`) - Jest with jsdom, tests parsers/converters in isolation
- **Integration** (`test/integration/`) - Tests parser → renderer with real BPMN files
- **E2E** (`test/e2e/`) - Playwright visual regression with image snapshots
- **Performance** (`test/performance/`) - Load/render benchmarks
- **Bundles** (`test/bundles/`) - Validates ESM/IIFE distributions

**E2E Pattern:** Heavy use of image snapshots (in `__image_snapshots__/`) to verify visual rendering correctness across features.

## Key Architectural Patterns

### Converter Pattern
Multiple specialized converters (`ProcessConverter`, `DiagramConverter`) each handle BPMN subdomains, all populating a shared `ConvertedElements` registry. This allows semantic and visual information to be processed separately then linked.

### Coordinate Translation
`CoordinatesTranslator` is critical because:
- BPMN XML uses absolute coordinates
- mxGraph uses relative-to-parent coordinates
- Parent-child relationships (pools → lanes → flow nodes) require careful coordinate conversion
- Labels have special offset calculations

### Parent-Child Relationships
Rendering order matters:
1. Parents must be rendered before children
2. Order: pools → lanes → subprocesses → flow nodes → boundary events → edges
3. Managed through `parentId` references in the model

### mxGraph Encapsulation
mxGraph is an **implementation detail** - fully wrapped by `BpmnElementsRegistry`. Public API never exposes mxGraph types (except experimental `graph` property). This enables potential future replacement.

## Adding a New BPMN Element Type

1. **Add enum value** to `ShapeBpmnElementKind` in `src/model/bpmn/internal/shape/kinds.ts`
2. **Extend model** - Add class in `ShapeBpmnElement.ts` if new semantic properties needed
3. **Update converter** - Add parsing logic in `ProcessConverter` or relevant converter
4. **Create shape class** - Extend `mxShape` in `src/component/mxgraph/shape/`
5. **Register shape** - Add to `registerShapes()` in `register-style-definitions.ts`
6. **Add styles** - Configure in `StyleConfigurator.ts`
7. **Add tests** - Unit (parser), integration (parse→render), E2E (visual)

## Understanding Data Flow

Trace how a BPMN task flows through the system:
1. BPMN XML `<task>` → `BpmnXmlParser` → JSON object
2. JSON → `ProcessConverter.parseTask()` → creates `ShapeBpmnElement`
3. Stored in `ConvertedElements` registry
4. `DiagramConverter` finds matching `<BPMNShape>` → creates `Shape` (semantic + visual)
5. `BpmnRenderer.insertShape()` → `graph.insertVertex()` with computed style
6. `BpmnElementsRegistry` enables runtime access via ID or kind lookup

## Requirements

- **Node.js**: Version in `.nvmrc` file (run `nvm use` if using nvm)
- **npm**: Version associated with Node.js version
- **Supported OS**: Windows, Linux, macOS

## Pre-commit Hooks

The project uses Husky for pre-commit linting. If using a Node Version Manager and getting "Command not found" errors, create `~/.config/husky/init.sh` with:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

## Pull Request Guidelines

- External contributions only accepted for issues marked "PR Accepted"
- Run `npm run all` before opening PR (builds, checks, tests everything)
- PR title becomes the commit message (commits are squashed)
- First PR requires signing the Contributor License Agreement
