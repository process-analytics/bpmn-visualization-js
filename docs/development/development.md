# Development

**Note**:
- information about the library internals are available in the [architecture folder](../architecture) or in html form in the [documentation site](https://process-analytics.github.io/bpmn-visualization-js/#_architecture_and_development)
- additional information related to development can also be found in the [development details page](.//README.md)

## Requirements

- `Node.js` 12.16.x and 14.11.x (may work with other versions but without any guarantee)
- `Supported OS` (see the Github Build workflow for more details): Windows/Linux/MacOs

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
More information here:  [Typescript](development.md#typescript) 

To enforce best practices we use ESLint and husky.
The later performs ```eslint --fix``` on pre-commit event to make sure that committed code meets standards.

ESLint configuration extends:
- plugin:@typescript-eslint/recommended
- prettier/@typescript-eslint
- plugin:prettier/recommended

## Typescript
Although Linting, Sonar and Tests keeps the code in a good shape
We strongly recommend you to read following resources to be able to write code that is conform to the best practices:
- [basics](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [do's and don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

## Building the html documentation

**DISCLAIMER**:
- the documentation sources are in the AsciiDoctor format and are hosted in the [docs](..) folder. The display
may not fully work (font-awesome icons and some links) depending on the rendering engine. This is the case when
displayed directly on GitHub Web.

From the root folder of the repository, run 
```bash
npm run docs
```

The documentation is generated in the `build/docs` folder.
