/*
Copyright 2024 Bonitasoft S.A.

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

import { expect } from '@jest/globals';
import toMatchImageSnapshot from 'jest-image-snapshot';

// TODO magraph@0.10.3 should not be needed in a more recent bpmn-visualization version (0.44.0+), see https://github.com/process-analytics/bpmn-visualization-js/pull/3145
// This is a temporary fix, image attachment is currently not working in the POC

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore not the right signature, but works at runtime
expect.extend(toMatchImageSnapshot);
