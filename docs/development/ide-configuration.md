# IDE configuration

To fully benefit the ESLint and Jest testing frameworks, you must properly set up your IDE.

### Intellij

#### [EditorConfig](https://www.jetbrains.com/help/idea/configuring-code-style.html#editorconfig)

Go to `File` -> `Settings` ( `IntelliJ IDEA` -> `Preferences` on `macOS`) and `Editor` --> `Code Style`, then tick the
`Enable EditorConfig support`


#### [ESLint](https://www.jetbrains.com/help/idea/eslint.html#)

Go to `File` -> `Settings` and type ESLint in search box

Enable ESLint by choosing `Automatic ESLint configuration`

If automatic configuration is not working for any reason try with `Manual ESLint configuration`, specify:
- ESLint package to point to `project\node_modules\eslint`
- Configuration file must point to `project\.eslintrc.js`

You also need to set up Coding Style rules

It is as simple as doing `right-click` on the file `.eslintrc.js` and choosing option `Apply ESLint Code Style Rules`

#### [Jest tests](https://www.jetbrains.com/help/idea/running-unit-tests-on-jest.html)

To be able to run tests from IntelliJ, you must set up the default Jest template in `Run/Debug Configurations`

Adjust following parameters:
- Configuration files: it depends on the type of tests you want to run 
  - unit tests: `<project_dir>/jest.config.unit.js`
  - end to end tests: `<project_dir>/jest.config.e2e.js`


#### [Debugging TypeScript code](https://www.jetbrains.com/help/idea/running-and-debugging-typescript.html#ws_ts_debug_client_side_on_external_dev_server)

- create a new `JavaScript Debug` configuration as described in the [Intellij documentation](https://www.jetbrains.com/help/idea/running-and-debugging-typescript.html#ws_ts_debug_client_side_on_external_dev_server)
  - the targeted url is: 
    - For `npm run start` or `npm run watch`: http://localhost:10001/ \
    It's possible to override the port value with the environment variable _SERVER_PORT_.
    - For `npm run test:e2e`: http://localhost:10002/
  - use `Chrome` as browser
  - check `Ensure breakpoints are detected when loading scripts`  
- start the application in development mode by running `npm run start` or `npm run watch`
- select the `JavaScript Debug` configuration and run it with Debug Runner
- the browser opens, and debug session starts (see [Intellij documentation](https://www.jetbrains.com/help/idea/running-and-debugging-typescript.html#ws_ts_debug_client_side_on_external_dev_server)
documentation for more details) 

#### SonarLint

Additionally, it is advised to install SonarLint Plugin

It helps to avoid coding mistakes -> reduced technical debt


#### AsciiDoc

We use [asciidoc](https://asciidoctor.org/docs/what-is-asciidoc/) to write the documentation.

An [AsciiDoc IntelliJ Plugin](https://plugins.jetbrains.com/plugin/7391-asciidoc) is a helpful plugin that permits visualizing .adoc files directly in IntelliJ



### Visual Studio Code

#### [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

Install the EditorConfig extension. A configuration file already exists in the repository so it will apply right after the extension installation.

#### [Debugging TypeScript code](https://code.visualstudio.com/docs/typescript/typescript-debugging)
The `launch.json` file is already configured to execute tests:
  - unit tests: `test:unit`
  - end to end tests: `test:e2e`
  
You can duplicate these configurations or create another, if you want/need.

#### [Draw.io Diagram](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio)

You can create/update draw.io diagrams directly in VS Code with the draw.io extension. See the [draw.io annoucement](https://www.diagrams.net/blog/embed-diagrams-vscode) for more details.

#### [AsciiDoc](https://marketplace.visualstudio.com/items?itemName=asciidoctor.asciidoctor-vscode)

We use [asciidoc](https://asciidoctor.org/docs/what-is-asciidoc/) to write the documentation.

This extension permits visualizing .adoc files directly in VSCode.

#### [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)

Additionally, it is advised to install the SonarLint extension.

It helps to avoid coding mistakes -> reduced technical debt.
