/*
Copyright 2022 Bonitasoft S.A.

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore use a shared js file with commonjs export
// eslint-disable-next-line @typescript-eslint/no-require-imports -- use a shared js file with commonjs export
import environmentUtils = require('@test/shared/environment-utils.cjs');

const onCi = environmentUtils.isRunningOnCi();
jest.retryTimes(onCi ? 3 : 0, { logErrorsBeforeRetry: true });
