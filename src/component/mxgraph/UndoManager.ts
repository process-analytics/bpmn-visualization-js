/*
Copyright 2023 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import type { mxCell, mxUndoableEdit } from 'mxgraph';
import { mxgraph } from './initializer';

export class UndoManager extends mxgraph.mxEventSource {
  /**
   * Variable: history
   *
   * Array that contains the steps of the command history.
   */
  private history: Map<mxCell, mxUndoableEdit> = new Map();

  constructor() {
    super();
  }

  /**
   * Function: undo
   *
   * Undoes the last change.
   */
  undo(cell: mxCell): void {
    if (this.history.get(cell)) {
      const undoableEdit = this.history.get(cell);
      undoableEdit.undo();

      if (undoableEdit.isSignificant()) {
        this.fireEvent(new mxgraph.mxEventObject(mxgraph.mxEvent.UNDO, 'edit', undoableEdit), this);
      }
      this.history.delete(cell);
    }
  }

  /**
   * Function: undoableEditHappened
   *
   * Method to be called to add new undoable edits to the <history>.
   */
  registerUndoable(cell: mxCell, undoableEdit: mxUndoableEdit): void {
    if (!this.history.get(cell)) {
      this.history.set(cell, undoableEdit);
      this.fireEvent(new mxgraph.mxEventObject(mxgraph.mxEvent.ADD, 'edit', undoableEdit), this);
    }
  }
}
