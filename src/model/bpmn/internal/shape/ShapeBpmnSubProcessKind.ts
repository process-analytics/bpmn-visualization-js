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

/**
 * Base name of the BPMN specification for sub-process kinds.
 * @category BPMN
 */
export enum ShapeBpmnSubProcessKind {
  EMBEDDED = 'embedded',
  EVENT = 'event',
  // The following may be only needed for rendering, as we have special types for adHoc and transaction subprocess in ShapeBpmnElementKind
  // TRANSACTION = 'transaction',
  // AD_HOC = 'ad_hoc',
}
