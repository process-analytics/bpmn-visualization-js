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
import debugLogger from 'debug';

const debug = debugLogger('test');

export function readFileSync(relPathToSourceFile: string, encoding = 'utf8', dirName = __dirname): string {
  return fs.readFileSync(path.join(dirName, relPathToSourceFile), encoding);
}

export function copyFileSync(relPathToSourceFile: string, relPathToDestinationDirectory: string, destinationFileName: string): void {
  const directoryPath = path.join(__dirname, relPathToDestinationDirectory);

  fs.mkdirSync(directoryPath, { recursive: true });
  fs.copyFileSync(path.join(__dirname, relPathToSourceFile), path.join(directoryPath, destinationFileName));
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

export function loadBpmnContentForUrlQueryParam(relPathToSourceFile: string): string {
  debug(`Preparing bpmn content for url query param, source: '${relPathToSourceFile}'`);
  let rawBpmn = readFileSync(relPathToSourceFile);
  debug(`Original bpmn length: ${rawBpmn.length}`);

  rawBpmn = linearizeXml(rawBpmn);
  debug(`Bpmn length after linearize: ${rawBpmn.length}`);

  const uriEncodedBpmn = encodeUriXml(rawBpmn);
  debug(`Bpmn length in URI encoded form: ${uriEncodedBpmn.length}`);
  return uriEncodedBpmn;
}
