# Development

**Note**:
- information about the library internals are available in the [architecture folder](../users/architecture) or in html form in the [documentation site](https://process-analytics.github.io/bpmn-visualization-js/#_architecture_and_development)
- additional information related to development can also be found in the [contributors guidelines page](./README.md)

## Requirements

- `Node.js` 14.x (may work with other versions but without any guarantee)
- `npm` 6 (may work with other versions but without any guarantee). In particular, we use [lockfileVersion: 1](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json#lockfileversion). To ensure you use the (latest) npm 6 version, run `npm i -g npm@6`
- `Supported OS` Windows/Linux/macOS (see the GitHub Build workflow for more details)

## Build

- `npm install`           *Install the dependencies in the local node_modules folder*
- `npm run watch`         *Watch files in bundle and rebuild on changes* <br>
                          You can now access the project on http://localhost:10001

## Tests

See the [testing page](./testing.md)

## Code style

Your patch should follow the same conventions & pass the same code quality checks as the rest of the project.

Project, in major line, follows the code style suggested by [airbnb](https://github.com/airbnb/javascript) which is explicit and well documented.

Typescript have been chosen as it's strongly typed and we believe it adds some syntactical benefits to the JavaScript language
More information here: [Typescript](development.md#typescript) 

To enforce best practices we use ESLint and husky.
The latter performs ```eslint --fix``` on pre-commit event to make sure that committed code meets standards.

### Husky settings for nvm user

On commit, if the pre-commit hook generates an `Command not found` error, create a `.huskyrc` file in your home
directory and add the following content:
```bash
# This loads nvm.sh and sets the correct PATH before running hook
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```
For more details, see
- https://typicode.github.io/husky/#/?id=command-not-found
- https://github.com/typicode/husky/issues/912


## Typescript
Although Linting, Sonar and Tests keeps the code in a good shape
We strongly recommend you to read following resources to be able to write code that is conform to the best practices:
- [basics](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [do's and don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
