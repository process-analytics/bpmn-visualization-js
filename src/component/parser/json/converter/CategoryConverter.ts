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

import { TDefinitions } from '../../../../model/bpmn/json/BPMN20';
import { ConvertedElements } from './utils';
import { ensureIsArray } from '../../../helpers/array-utils';
import { TCategory } from '../../../../model/bpmn/json/baseElement/rootElement/rootElement';

/**
 * @internal
 */
export default class CategoryConverter {
  constructor(private convertedElements: ConvertedElements) {}

  deserialize(definitions: TDefinitions): void {
    ensureIsArray<TCategory>(definitions.category).forEach(category => {
      ensureIsArray(category.categoryValue).forEach(categoryValue => {
        this.convertedElements.registerCategoryValues(categoryValue.id, categoryValue.value);
      });
    });
  }
}
