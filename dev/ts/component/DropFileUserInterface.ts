/*
Copyright 2020 Bonitasoft S.A.

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

import { logErrorAndOpenAlert } from '../shared/internal-helpers';

export class DropFileUserInterface {
  private readonly document: Document;
  private readonly head: Element;

  constructor(
    private readonly window: Window,
    private readonly outerContainerId: string,
    private readonly containerToFade: HTMLElement,
    private readonly dropCallback: (file: File) => void,
  ) {
    this.document = window.document;
    this.head = document.head;
    this.initializeDragAndDrop();
  }

  private initializeDragAndDrop(): void {
    // Add a special CSS class to the container to identify it. It doesn't always have an id, so we cannot use CSS selector involving its id
    this.containerToFade.classList.add('faded-container');
    this.addDomElements(this.containerToFade);
    this.addStyle();

    const dropContainer = document.querySelector<HTMLDivElement>(`#${this.outerContainerId}`);
    // prevent loading file by the browser
    this.preventDefaultsOnEvents(['dragover', 'drop'], this.window);
    this.preventDefaultsOnEvents(['dragover', 'dragleave', 'drop'], dropContainer);

    this.addEventsOnDropContainer(dropContainer, this.containerToFade);
    this.addEventsOnDocument(this.outerContainerId, this.containerToFade);
  }

  private preventDefaults(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private preventDefaultsOnEvents(events: string[], container: Element | Window): void {
    for (const eventName of events) container.addEventListener(eventName, this.preventDefaults.bind(this), false);
  }

  private addDomElements(containerToBeFaded: HTMLElement): void {
    const p = this.document.createElement('p');
    p.textContent = 'open BPMN diagram';
    const innerDiv = this.document.createElement('div');
    innerDiv.classList.add('drop-here-text');
    innerDiv.append(p);
    const containerDiv = this.document.createElement('div');
    containerDiv.id = this.outerContainerId;
    containerDiv.append(innerDiv);
    containerToBeFaded.parentNode.prepend(containerDiv);
  }

  private addStyle(): void {
    // region CSS
    const css = `
.faded-container {
    opacity: 1;
}
.faded-container.faded {
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
    style.append(document.createTextNode(css));
    this.head.append(style);
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
      isDocument ? (this as Document).querySelector('#' + outerContainerId).classList.add('dragging') : (this as HTMLElement).classList.add('dragging');
      containerToBeFaded.classList.add('faded');
    };
  }

  private getRemoveClassCallback(containerToBeFaded: HTMLElement, isDocument: boolean, outerContainerId?: string) {
    return function (this: Document | HTMLElement): void {
      isDocument ? (this as Document).querySelector('#' + outerContainerId).classList.remove('dragging') : (this as HTMLElement).classList.remove('dragging');
      containerToBeFaded.classList.remove('faded');
    };
  }

  private getDropCallbackForElement(containerToBeFaded: HTMLElement, isDocument: boolean, dropCallback: (file: File) => void, outerContainerId?: string) {
    return function (this: Document | HTMLElement, event: DragEvent): void {
      try {
        const dt = event.dataTransfer;
        const files = dt.files;
        dropCallback(files[0]);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logErrorAndOpenAlert(errorMessage);
      } finally {
        isDocument ? (this as Document).querySelector('#' + outerContainerId).classList.remove('dragging') : (this as HTMLElement).classList.remove('dragging');
        containerToBeFaded.classList.remove('faded');
      }
    };
  }
}
