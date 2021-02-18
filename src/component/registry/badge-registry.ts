/**
 * Copyright 2021 Bonitasoft S.A.
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

import { ensureIsArray } from '../helpers/array-utils';

export enum Position {
  LEFT_BOTTOM,
  LEFT_TOP,
  RIGHT_BOTTOM,
  RIGHT_TOP,
}

export interface Badge {
  position: Position;
  value: string;
}

export class BadgeRegistry {
  private badgesByBPMNId = new Map<string, Set<Badge>>();

  /**
   * Get the Badge for a specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @return the registered Badge
   */
  getBadges(bpmnElementId: string): Badge[] {
    return Array.from(this.badgesByBPMNId.get(bpmnElementId) || []);
  }

  /**
   * Register the Badge for a specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @param badges the Badge  to register
   * @return true if at least one class name from parameters has been added; false otherwise
   */
  addBadges(bpmnElementId: string, badges: Badge[]): boolean {
    return this.updateBadges(bpmnElementId, badges, (element, set) => set.add(element));
  }

  // return `true` if at least one class has been removed
  removeBadges(bpmnElementId: string, badges: Badge[]): boolean {
    return this.updateBadges(bpmnElementId, badges, (element, set) => set.delete(element));
  }

  // return true if passed classes array has at least one element - as toggle will always trigger changes in that case
  toggleBadges(bpmnElementId: string, badges: Badge[]): boolean {
    this.updateBadges(bpmnElementId, badges, (element, set) => (set.has(element) ? set.delete(element) : set.add(element)));
    return badges && badges.length > 0;
  }

  private updateBadges(bpmnElementId: string, badges: Badge[], updateSet: (element: Badge, set: Set<Badge>) => void): boolean {
    const currentBadges = this.getOrInitializeBadges(bpmnElementId);
    const initialBadgesNumber = currentBadges.size;
    ensureIsArray(badges).forEach(badge => updateSet(badge, currentBadges));
    return currentBadges.size != initialBadgesNumber;
  }

  private getOrInitializeBadges(bpmnElementId: string): Set<Badge> {
    let badges = this.badgesByBPMNId.get(bpmnElementId);
    if (badges == null) {
      badges = new Set();
      this.badgesByBPMNId.set(bpmnElementId, badges);
    }
    return badges;
  }
}
