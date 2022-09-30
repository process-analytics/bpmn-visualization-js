# Supported TypeScript version

`bpmn-visualization` uses a recent TypeScript version internally but projects integrating `bpmn-visualization` can use older TypeScript versions.

The oldest supported version of TypeScript is enforced by a specific configuration in the `package.json`. This lets projects using non-supported
TypeScript versions to get a convenient error message.

This oldest version is also verified by automatic tests located in the `test/typescript-support` directory.
They consist on a project that imports `bpmn-visualization` with the oldest supported version of TypeScript. The TypeScript compilation of this
project must pass. This is what ensures that the minimal versions of TypeScript that `bpmn-visualization` declares as functional actually work.


## Choosing the oldest supported version

Choose wisely as it may prevent projects from integrating `bpmn-visualization` if a too recent TypeScript version is required.

For more details, see the following issues
* [Document the lowest TypeScript version supported by bpmn-visualization](https://github.com/process-analytics/bpmn-visualization-js/issues/2246)
* [Downlevel the lowest TS version needed to integrate bpmn-visualization](https://github.com/process-analytics/bpmn-visualization-js/issues/2252)


## Changing the oldest TypeScript version that is supported

The README file mentions the oldest supported version of TypeScript. Update the README with the new value.

Update the `typesVersions` attribute in the `package.json` file. This attribute is central

Run the automatic tests from the `test/typescript-support` directory: `npm test`. They should fail as they are currently using a too old TypeScript version.
Update the TypeScript version in the `package.json` file and rerun the tests. They must now pass.
