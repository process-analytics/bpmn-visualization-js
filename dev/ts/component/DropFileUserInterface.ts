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
import { logErrorAndOpenAlert } from '../utils/internal-helpers';

export class DropFileUserInterface {
  private document: Document;
  private head: Element;
  private body: Element;

  constructor(private window: Window, private outerContainerId: string, private containerToFadeId: string, private dropCallback: (file: File) => void) {
    this.document = window.document;
    this.head = document.head;
    this.body = document.body;
    this.initializeDragAndDrop();
  }

  private initializeDragAndDrop(): void {
    const containerToBeFaded = document.getElementById(this.containerToFadeId);
    this.addDomElements(containerToBeFaded);
    this.addStyle();

    const dropContainer = document.getElementById(this.outerContainerId);
    // prevent loading file by the browser
    this.preventDefaultsOnEvents(['dragover', 'drop'], this.window);
    this.preventDefaultsOnEvents(['dragover', 'dragleave', 'drop'], dropContainer);

    this.addEventsOnDropContainer(dropContainer, containerToBeFaded);
    this.addEventsOnDocument(this.outerContainerId, containerToBeFaded);
  }

  private preventDefaults(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private preventDefaultsOnEvents(events: string[], container: Element | Window): void {
    events.forEach(eventName => container.addEventListener(eventName, this.preventDefaults, false));
  }

  private addDomElements(containerToBeFaded: HTMLElement): void {
    const p = this.document.createElement('p');
    p.textContent = 'open BPMN diagram';
    const innerDiv = this.document.createElement('div');
    innerDiv.classList.add('drop-here-text');
    innerDiv.appendChild(p);
    const containerDiv = this.document.createElement('div');
    containerDiv.id = this.outerContainerId;
    containerDiv.appendChild(innerDiv);
    containerToBeFaded.parentNode.prepend(containerDiv);
  }

  private addStyle(): void {
    // region CSS
    const css = `
#${this.containerToFadeId} {
    opacity: 1;
}
#${this.containerToFadeId}.faded {
    opacity: 0.1;
}
#${this.outerContainerId} {
    display: none;
    overflow: hidden;
    position: absolute;
    top: 10px;
    right: 10px;
    bottom: 10px;
    left: 10px;
    font-weight: bold;
    text-align: center;
    color: #555;
    padding: 10px;
}
#${this.outerContainerId}.dragging {
    display: block;
}
#${this.outerContainerId} .drop-here-text {
    border: 2px solid transparent;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
#${this.outerContainerId} .drop-here-text p {
    font-style: normal;
    font-family: monospace;
    font-size: 40px;
    color: rgba(1,1,1,.2);
}
#${this.outerContainerId}.dragging .drop-here-text {
    cursor: default;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed rgba(0,0,0,.2);
    border-radius: 7px;
}`;
    // endregion
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    this.head.appendChild(style);
  }

  private addEventsOnDropContainer(container: HTMLElement, containerToBeFaded: HTMLElement): void {
    container.addEventListener('dragover', this.getAddClassCallback(containerToBeFaded, false), false);
    container.addEventListener('mousedown', this.getRemoveClassCallback(containerToBeFaded, false), false);
    container.addEventListener('drop', this.getDropCallbackForElement(containerToBeFaded, false, this.dropCallback), false);
  }

  private addEventsOnDocument(outerContainerId: string, containerToBeFaded: HTMLElement): void {
    this.document.addEventListener('dragover', this.getAddClassCallback(containerToBeFaded, true, outerContainerId), false);
    this.document.addEventListener('dragleave', this.getRemoveClassCallback(containerToBeFaded, true, outerContainerId), false);
    this.document.addEventListener('drop', this.getDropCallbackForElement(containerToBeFaded, true, this.dropCallback, outerContainerId), false);
  }

  private getAddClassCallback(containerToBeFaded: HTMLElement, isDocument: boolean, outerContainerId?: string) {
    return function (this: Document | HTMLElement): void {
      isDocument ? (<Document>this).querySelector('#' + outerContainerId).classList.add('dragging') : (<HTMLElement>this).classList.add('dragging');
      containerToBeFaded.classList.add('faded');
    };
  }

  private getRemoveClassCallback(containerToBeFaded: HTMLElement, isDocument: boolean, outerContainerId?: string) {
    return function (this: Document | HTMLElement): void {
      isDocument ? (<Document>this).querySelector('#' + outerContainerId).classList.remove('dragging') : (<HTMLElement>this).classList.remove('dragging');
      containerToBeFaded.classList.remove('faded');
    };
  }

  private getDropCallbackForElement(containerToBeFaded: HTMLElement, isDocument: boolean, dropCallback: (file: File) => void, outerContainerId?: string) {
    return function (this: Document | HTMLElement, event: DragEvent): void {
      try {
        const dt = event.dataTransfer;
        const files = dt.files;
        dropCallback(files[0]);
      } catch (e) {
        logErrorAndOpenAlert(e);
      } finally {
        isDocument ? (<Document>this).querySelector('#' + outerContainerId).classList.remove('dragging') : (<HTMLElement>this).classList.remove('dragging');
        containerToBeFaded.classList.remove('faded');
      }
    };
  }
}
