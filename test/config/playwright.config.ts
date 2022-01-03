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
import { devices, PlaywrightTestConfig, PlaywrightTestOptions, PlaywrightWorkerOptions, Project } from '@playwright/test';
import { isMacOS, isRunningOnCi, isWindowsOS, log } from '../helpers/environment';

const onCi = isRunningOnCi();

const computeProjectsConfiguration = (): Project<PlaywrightTestOptions, PlaywrightWorkerOptions>[] => {
  log('Computing projects configuration');

  const projects: Project<PlaywrightTestOptions, PlaywrightWorkerOptions>[] = [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ];

  if (onCi) {
    projects.push({
      name: 'chrome',
      use: { channel: 'chrome' },
    });
  }

  if (isMacOS()) {
    projects.push({
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    });
  } else if (isWindowsOS()) {
    projects.push({
      name: 'msedge',
      use: { channel: 'msedge' },
    });
  }

  log(
    'Computed projects configuration',
    projects.map(project => project.name),
  );
  return projects;
};

export const computeConfiguration = (resultDirName: string, startWebServer = true): PlaywrightTestConfig => {
  const resultDirPath = `build/test/${resultDirName}`;

  const configuration: PlaywrightTestConfig = {
    forbidOnly: onCi,
    globalSetup: '../config/global.setup.ts',
    retries: onCi ? 2 : undefined,
    testIgnore: '(data|helpers|static|**-snapshots|config)/**',
    timeout: 200_000, // TODO seems to large
    maxFailures: onCi ? 10 : undefined,
    outputDir: `../../${resultDirPath}/results`,
    snapshotDir: 'snapshots',
    use: {
      trace: 'on-first-retry',
      viewport: { width: 800, height: 600 },
      baseURL: 'http://localhost:10002',
      // TODO to large actionTimeout
      // Default timeout for each Playwright action in milliseconds, defaults to 0 (no timeout).
      // This is a default timeout for all Playwright actions, same as configured via page.setDefaultTimeout(timeout)
      actionTimeout: 60_000,
      screenshot: 'only-on-failure',
      launchOptions: {
        headless: process.env.HEADLESS !== 'false',
        slowMo: process.env.SLOWMO ? Number(process.env.SLOWMO) : 0,
        timeout: onCi ? 60_000 : 30_000, // default is 30 seconds,
        logger: {
          isEnabled: () => true,
          log: (name: string, severity: 'verbose' | 'info' | 'warning' | 'error', message: string | Error) => {
            if (name === 'bv:test:browser') {
              // eslint-disable-next-line no-console
              console.log(`${severity} - ${name}: ${message}`);
            }
          },
        },
      },
    },
    projects: computeProjectsConfiguration(),
    expect: {
      timeout: 10_000, // defaults to 5000ms
      toMatchSnapshot: {
        threshold: 0.005, // between zero (strict) and one (lax)
      },
    },
    reporter: [['html', { outputFolder: `${resultDirPath}/report`, open: 'never' }], [onCi ? 'github' : 'list']],
  };

  if (startWebServer) {
    configuration.webServer = {
      command: `npm run start -- --config-server-port 10002`,
      port: 10002,
      timeout: 60_000, // high value mainly for GitHub Workflows running on macOS (slow machines) and to build the bundle before start
      reuseExistingServer: !onCi, // your tests are executed, we assume that the server is already started
    };
    log('Use a webserver');
  }

  log('Computed Playwright configuration', configuration);
  return configuration;
};
