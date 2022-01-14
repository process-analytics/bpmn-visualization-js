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
import type { TBaseElement } from './baseElement';

export interface TParticipant extends TBaseElement {
  participantMultiplicity?: TParticipantMultiplicity;
  interfaceRef?: string | string[];
  endPointRef?: string | string[];
  name?: string;
  processRef?: string;
}

export interface TParticipantAssociation extends TBaseElement {
  innerParticipantRef: string;
  outerParticipantRef: string;
}

export interface TParticipantMultiplicity extends TBaseElement {
  minimum?: number; // default="0"
  maximum?: number; // default="1"
}
