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

// API Extractor does not support module augmentation: it drops the `declare module` blocks when it rolls up the
// declarations, so consumers would not see the BPMN properties added to the maxGraph style types.
// Copy the blocks emitted by tsc in the intermediate declarations to the end of the rolled-up declaration file.

import assert from 'node:assert';
import { appendFileSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { getTypeFilesInformation } from './shared/types-info.mjs';

const intermediateTypesDirectory = 'build/types';
const { typesFilePath } = getTypeFilesInformation();

// tsc emits the closing brace of a top-level block at the beginning of a line, and indents its content
const moduleAugmentationRegex = /^declare module ["']@maxgraph\/core["'] \{\n[\s\S]*?^\}$/gm;

const moduleAugmentations = readdirSync(intermediateTypesDirectory, { recursive: true })
  .filter(file => file.endsWith('.d.ts'))
  .sort()
  .flatMap(file => readFileSync(path.join(intermediateTypesDirectory, file), 'utf8').match(moduleAugmentationRegex) ?? []);

// Fail rather than silently ship declarations without the augmentation, for instance if tsc changes its output format
assert(moduleAugmentations.length > 0, `No module augmentation of '@maxgraph/core' found in ${intermediateTypesDirectory}`);
assert(!readFileSync(typesFilePath, 'utf8').includes("declare module '@maxgraph/core'"), `${typesFilePath} already contains the module augmentation`);

appendFileSync(typesFilePath, `\n${moduleAugmentations.join('\n\n')}\n`);
// eslint-disable-next-line no-console
console.info(`Added ${moduleAugmentations.length} module augmentation(s) of '@maxgraph/core' to ${typesFilePath}`);
