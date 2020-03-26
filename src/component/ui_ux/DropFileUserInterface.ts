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
export class DropFileUserInterface {
  private document: Document;
  private head: Element;
  private body: Element;

  constructor(private window: Window, private outerContainerId: string, private dropCallback: (file: File) => void) {
    this.document = window.document;
    this.head = document.head;
    this.body = document.body;
    this.initializeDragAndDrop();
  }

  private initializeDragAndDrop(): void {
    this.addDomElements();
    this.addStyle();

    const upload = document.getElementById(this.outerContainerId);
    // prevent loading file by the browser
    this.preventDefaultsOnEvents(['dragover', 'drop'], this.window);
    this.preventDefaultsOnEvents(['dragover', 'dragleave', 'drop'], upload);

    this.addEventsOnUpload(upload);
    this.addEventsOnDocument(this.outerContainerId);
  }

  private preventDefaults(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private preventDefaultsOnEvents(events: string[], container: Element | Window): void {
    events.forEach(eventName => {
      container.addEventListener(eventName, this.preventDefaults, false);
    });
  }

  private addDomElements(): void {
    const p = this.document.createElement('p');
    p.textContent = 'open BPMN diagram';
    const innerDiv = this.document.createElement('div');
    innerDiv.classList.add('drop-here-text');
    innerDiv.appendChild(p);
    const containerDiv = this.document.createElement('div');
    containerDiv.id = this.outerContainerId;
    containerDiv.appendChild(innerDiv);
    this.body.insertBefore(containerDiv, this.body.firstChild);
  }

  private addStyle(): void {
    // region CSS
    const css = `
#${this.outerContainerId} {
    overflow: hidden;
    position: absolute;
    top: 10px;
    right: 10px;
    bottom: 10px;
    left: 10px;
    font-weight: bold;
    text-align: center;
    color: #555;
}
#${this.outerContainerId} .drop-here-text {
    display: none;
    border: 2px solid transparent;
    width: 98%;
    height: 98%;
    margin: 1%;
    overflow: hidden;
}
#${this.outerContainerId} .drop-here-text p {
    margin-top: 45%;
    font-style: normal;
    font-family: monospace;
    font-size: 40px;
    color: rgba(1,1,1,.2);
}
#${this.outerContainerId}.dragging  .drop-here-text {
    cursor: default;
    display: block;
    border: 2px dashed #555;
    border-radius: 7px;
}`;
    // endregion
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    this.head.appendChild(style);
  }

  private addEventsOnUpload(container: HTMLElement): void {
    container.addEventListener('dragover', this.getAddClassCallback(false), false);
    container.addEventListener('mousedown', this.getRemoveClassCallback(false), false);
    container.addEventListener('drop', this.getDropCallbackForElement(false, this.dropCallback), false);
  }

  private addEventsOnDocument(outerContainerId: string): void {
    this.document.addEventListener('dragover', this.getAddClassCallback(true, outerContainerId), false);
    this.document.addEventListener('dragleave', this.getRemoveClassCallback(true, outerContainerId), false);
    this.document.addEventListener('drop', this.getDropCallbackForElement(true, this.dropCallback, outerContainerId), false);
  }

  private getAddClassCallback(isDocument: boolean, outerContainerId?: string) {
    return function(): void {
      isDocument ? this.querySelector('#' + outerContainerId).classList.add('dragging') : this.classList.add('dragging');
    };
  }

  private getRemoveClassCallback(isDocument: boolean, outerContainerId?: string) {
    return function(): void {
      isDocument ? this.querySelector('#' + outerContainerId).classList.remove('dragging') : this.classList.remove('dragging');
    };
  }

  private getDropCallbackForElement(isDocument: boolean, dropCallback: (file: File) => void, outerContainerId?: string) {
    return function(event: DragEvent): void {
      try {
        const dt = event.dataTransfer;
        const files = dt.files;
        dropCallback(files[0]);
      } catch (e) {
        // TODO error management
        console.log(e as Error);
      } finally {
        isDocument ? this.querySelector('#' + outerContainerId).classList.remove('dragging') : this.classList.remove('dragging');
      }
    };
  }
}
