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
import * as fs from 'fs';
import * as path from 'path';

export function readFileSync(relPathToSourceFile: string, encoding = 'utf8'): string {
  return fs.readFileSync(path.join(__dirname, relPathToSourceFile), encoding);
}

/** Returns the files in the given directory. The function doesn't do any recursion in sub directories. */
export function findFiles(relPathToSourceDirectory: string): string[] {
  return fs.readdirSync(path.join(__dirname, relPathToSourceDirectory));
}

/**
 * Very basic implementation, remove trailing spaces and tabs, line breaks
 * @param xml the source to linearize
 */
export function linearizeXml(xml: string): string {
  return (
    xml
      .split(/(\r\n|\n|\r)/g)
      // trim
      .map(line => {
        return line.trim();
      })
      // remove extra spaces at the end of empty node
      // <node1 attribute="value"                         />
      .map(line => {
        return line.replace(/"\s+\/>/g, '"/>');
      })
      // join without spaces
      .join('')
  );
}

export function encodeUriXml(xml: string): string {
  return encodeURIComponent(xml);
}
