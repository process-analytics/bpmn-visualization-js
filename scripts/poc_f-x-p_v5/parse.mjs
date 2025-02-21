/*
Copyright 2025 Bonitasoft S.A.

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

import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const xml = `<?xml version="1.0"?>
<any_name>
    <person>
        <phone>+122233344550</phone>
        <name>Jack</name>
    </person>
    <person>
        <phone>+122233344553</phone>
        <name>Boris</name>
    </person>
</any_name>`;

const parser = new XMLParser();
const parsedObject = parser.parse(xml);
// eslint-disable-next-line no-console -- CLI
console.log('parsedObject', JSON.stringify(parsedObject, null, 2));

const builder = new XMLBuilder();
const xmlContent = builder.build({ note: 'hello' });
// eslint-disable-next-line no-console -- CLI
console.log('xmlContent', xmlContent);
