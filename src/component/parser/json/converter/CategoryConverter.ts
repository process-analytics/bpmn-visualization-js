/*
Copyright 2021 Bonitasoft S.A.

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

import type { ConvertedElements } from './utils';
import type { TCategory } from '../../../../model/bpmn/json/baseElement/rootElement/rootElement';
import type { TDefinitions } from '../../../../model/bpmn/json/bpmn20';

import { ensureIsArray } from '../../../helpers/array-utils';

/**
 * @internal
 */
export default class CategoryConverter {
  constructor(private convertedElements: ConvertedElements) {}

  deserialize(definitions: TDefinitions): void {
    const categoryValues = ensureIsArray<TCategory>(definitions.category)
      .map(category => ensureIsArray(category.categoryValue))
      .flat();
    for (const categoryValue of categoryValues) {
      this.convertedElements.registerCategoryValue(categoryValue.id, categoryValue.value);
    }
  }
}
