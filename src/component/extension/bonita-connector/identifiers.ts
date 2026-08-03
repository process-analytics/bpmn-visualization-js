/*
Copyright 2026 Bonitasoft S.A.

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

/**
 * mxGraph style key set on the cells of the elements holding at least one Bonita connector.
 *
 * Kept in a dedicated file, and not added to `BpmnStyleIdentifier`, for two reasons: `BpmnStyleIdentifier` is public
 * API and must stay free of vendor specific keys, and the renderer needs this key without pulling in the whole
 * extension.
 *
 * @internal
 */
export const bonitaHasConnectorStyleIdentifier = 'bonita.hasConnector';

/**
 * Value of the `implementation` attribute set by Bonita on the service tasks holding connectors.
 *
 * @internal
 */
export const bonitaConnectorImplementation = 'BonitaConnector';
