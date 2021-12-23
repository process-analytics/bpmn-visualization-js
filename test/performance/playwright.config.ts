/**
 * Copyright 2021 Bonitasoft S.A.
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
import { devices, PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  forbidOnly: Boolean(process.env.CI),
  globalSetup: '../config/copy.bpmn.diagram.ts',
  retries: process.env.CI ? 2 : 1,
  testIgnore: '(data|helpers)/**',
  timeout: 200000,
  use: {
    trace: 'on-first-retry',
    viewport: { width: 800, height: 600 },
    baseURL: 'http://localhost:10002',
    /* screenshot: 'only-on-failure',*/
    launchOptions: {
      headless: process.env.HEADLESS !== 'false',
      slowMo: process.env.SLOWMO ? Number(process.env.SLOWMO) : 0,
    },
  },
  webServer: {
    command: `npm run start -- --config-server-port 10002`,
    port: 10002,
    timeout: 60000,
    reuseExistingServer: !process.env.CI,
    // , cwd: string, env: object
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /*    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/
  ],
  /* snapshotDir: 'build/test-report/performance',*/
  reporter: [['html', { outputFolder: 'build/test-report/performance', open: 'never' }], [process.env.CI ? 'github' : 'list']],
};
export default config;
