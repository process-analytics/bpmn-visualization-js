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
import { readFileSync as fsReadFileSync, readdirSync } from 'fs';
import { join } from 'path';

export function readFileSync(relPathToSourceFile: string, encoding = 'utf8', dirName = __dirname): string {
  return fsReadFileSync(join(dirName, relPathToSourceFile), encoding);
}

/** Returns the files in the given directory. The function doesn't do any recursion in sub directories. */
export function findFiles(relPathToSourceDirectory: string): string[] {
  return readdirSync(join(__dirname, relPathToSourceDirectory));
}
