# IDE configuration

To fully benefit the ESLint and Jest testing frameworks, you must properly set up your IDE.

This document describes how to directly integrate in your IDE some tools the npm build is relying on. For the IDE not
mentioned here, the following should help you to know which extensions or plugins to add to your development environment. 

* [Gitpod](#Gitpod) 
* [Visual Studio Code](#visual-studio-code)
* [IntelliJ](#intellij)


## Gitpod

[Gitpod](https://www.gitpod.io/) provides dev environments running in the cloud for free.

It is advised to read the information written below.
If you are however familiar with Gitpod, you can jump there and start coding right away by one click: [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/process-analytics/bpmn-visualization-js)

### Settings

The best way to learn is to read the official [Gitpod documentation](https://www.gitpod.io/docs/).

Once you logged to Gitpod, don't forget to give Gitpod write access to public repositories if you want to contribute by using Gitpod:

1. Visit the : [Integrations settings](https://gitpod.io/integrations)
2. Check the box titled: **public_repo**
3. Click on **Update Permissions** button

More details are available in the [github-integration documentation](https://www.gitpod.io/docs/github-integration).

After that quick setup, you are able to contribute and create Pull Requests directly from Gitpod.

When Gitpod IDE is started, the `npm install` command is launched automatically. The workspace is ready to build and run dev server and tests.

In particular, if you start the dev server, you can access it directly in your browser, see the [Gitpod ports documentation](https://www.gitpod.io/docs/config-ports) for more details.


## Visual Studio Code

### [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

Install the EditorConfig extension. A configuration file already exists in the repository, so it will apply right after the extension installation.

### [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

After the installation, you need to explicitly tell to the ESLint extension to watch typscript files for linting errors.
  - Open the Command Palette (*`View -> Command Palette`* or *`Ctrl+Shift+P`* or *`Shift+Cmd+P`*)
  - Type `Open Settings (JSON)` and select the option `Preferences: Open Settings (JSON)`
  - Paste this code inside the opened JSON file

  ```JSON
    {
      "eslint.validate": ["typescript"]
    }
  ```
  - Open the extensions panel (Button `Extensions` on the left toolbar or `Ctrl+Shift+X` or `Shift+Cmd+X`) 
  - Open the extensions settings of the ESLint extension (using the wheel on the bottom right corner of the extension)
  - Ensure that the following properties are checked: 
    - `ESLint: Enable`
    - `ESLint > Format: Enable`
    - `ESLint > Lint Task: Enable`

Visual Studio Code is now configured correctly to use ESLint on typescript files.

*Note: make sure that ESLint is installed and [configured correctly to work with typescript](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md) on your machine.*

### [Debugging TypeScript code](https://code.visualstudio.com/docs/typescript/typescript-debugging)
The `launch.json` file is already configured to execute tests:
  - unit tests: `test:unit`
  - integration tests: `test:integration`
  - end to end tests: `test:e2e`
  
You can duplicate these configurations or create another, if you want/need.

### [Draw.io Diagram](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio)

You can create/update draw.io diagrams directly in VS Code with the draw.io extension. See the [draw.io annoucement](https://www.diagrams.net/blog/embed-diagrams-vscode) for more details.

### [AsciiDoc](https://marketplace.visualstudio.com/items?itemName=asciidoctor.asciidoctor-vscode)

We use [asciidoc](https://asciidoctor.org/docs/what-is-asciidoc/) to write the documentation.

This extension permits visualizing .adoc files directly in VSCode.

### [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)

SonarLint highlights Bugs and Security Vulnerabilities as you write code, with clear remediation guidance so you can fix them before the code is even committed.


## IntelliJ

### [EditorConfig](https://www.jetbrains.com/help/idea/configuring-code-style.html#editorconfig)

Go to `File` -> `Settings` ( `IntelliJ IDEA` -> `Preferences` on `macOS`) and `Editor` --> `Code Style`, then tick the
`Enable EditorConfig support`


### [ESLint](https://www.jetbrains.com/help/idea/eslint.html#)

Go to `File` -> `Settings` and type ESLint in search box

Enable ESLint by choosing `Automatic ESLint configuration`

If automatic configuration is not working for any reason try with `Manual ESLint configuration`, specify:
- ESLint package to point to `project\node_modules\eslint`
- Configuration file must point to `project\.eslintrc.js`

You also need to set up Coding Style rules

It is as simple as doing `right-click` on the file `.eslintrc.js` and choosing option `Apply ESLint Code Style Rules`

### [Jest tests](https://www.jetbrains.com/help/idea/running-unit-tests-on-jest.html)

You can run tests directly from IntelliJ - there is no need for any additional configuration.  
ℹ️ If something is not running well, make sure your `Run/Debug Configurations -> templates -> Jest` default is not overriding the parameter: `Configuration file`.


### [Debugging TypeScript code](https://www.jetbrains.com/help/idea/running-and-debugging-typescript.html#ws_ts_debug_client_side_on_external_dev_server)

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

### SonarLint

Additionally, it is advised to install SonarLint Plugin

It helps to avoid coding mistakes -> reduced technical debt


### AsciiDoc

We use [asciidoc](https://asciidoctor.org/docs/what-is-asciidoc/) to write the documentation.

An [AsciiDoc IntelliJ Plugin](https://plugins.jetbrains.com/plugin/7391-asciidoc) is a helpful plugin that permits visualizing .adoc files directly in IntelliJ
