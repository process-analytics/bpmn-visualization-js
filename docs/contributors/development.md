# Development

**Note**:
- information about the library internals are available in the [architecture folder](../users/architecture) or in html form in the [documentation site](https://process-analytics.github.io/bpmn-visualization-js/#_architecture_and_development)
- additional information related to development can also be found in the [contributors guidelines page](./README.md)

## Requirements

- `Node.js`: 20.x (may work with other versions but without any guarantee). For [nvm](https://github.com/nvm-sh/nvm) users, just run `nvm use` for the repository root
- `npm` 8 (may work with other versions but without any guarantee). In particular, we use [lockfileVersion: 2](https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json#lockfileversion). To ensure you use the (latest) npm 8 version, run `npm i -g npm@8`
- `Supported OS` Windows/Linux/macOS (see the GitHub Build workflow for more details)

## Build

- `npm install`           *Install the dependencies in the local node_modules folder*
- `npm run dev`           *Start the development server and rebuild on changes* <br>
                          You can now access the project on http://localhost:10001/dev/public/index.html

## Tests

See the [testing page](./testing.md)

## Code style

Your patch should follow the same conventions & pass the same code quality checks as the rest of the project.

Project, in major line, follows the code style suggested by [airbnb](https://github.com/airbnb/javascript) which is explicit and well documented.

Typescript have been chosen as it's strongly typed and we believe it adds some syntactical benefits to the JavaScript language
More information here: [Typescript](development.md#typescript) 

To enforce best practices we use ESLint and husky.
The latter performs lint checks on pre-commit event to make sure that committed code meets standards.

### Husky settings when using Node Version Managers

On commit, if you use a Node Version Manager, the pre-commit hook may generate an `Command not found` error.
If so, create a [startup file](https://typicode.github.io/husky/how-to.html#startup-files) and add the following content (this example is given for Linux or macOS when using nvm):
```bash
# This loads nvm.sh and sets the correct PATH before running hook
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

For more details, see
- https://typicode.github.io/husky/how-to.html#node-version-managers-and-guis
- https://github.com/typicode/husky/issues/912


## Typescript
Although Linting, Sonar and Tests keeps the code in a good shape
We strongly recommend you to read following resources to be able to write code that is conform to the best practices:
- [basics](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [do's and don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
