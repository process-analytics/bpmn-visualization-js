# Contributing

You are here to help on BPMN Visu JS? Awesome, feel welcome and read the following guidelines in order to know how to contribute, to ask questions and to make BPMN Visu JS such a great tool.

All members of our community are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please make sure you are welcoming and friendly in all of our spaces.

## Contributions 

There are many ways to contribute:

- help people with the questions they ask on the [Github Issues](https://github.com/process-analytics/bpmn-visualization-js/issues )
- submitting bug reports and feature requests in the [Github Issues](https://github.com/process-analytics/bpmn-visualization-js/issues/new )
- [writing code](CONTRIBUTING.md#code-and-documentation-changes) which can be incorporated into BPMN Visu JS itself
- [improving](CONTRIBUTING.md#code-and-documentation-changes) the documentation
- improve the existing example applications to demonstrate features in BPMN Visu JS

## Code and documentation changes

For all contributions, please respect the following guidelines:

1. If you've noticed a bug or have a feature request, let us know in the [GitHub Issue tracker](https://github.com/process-analytics/bpmn-visualization-js/issues/new )! So we can confirm the bug or approve your feature, and provide feedback, before starting to code :slightly_smiling_face:

2. Do the changes in your own [fork](CONTRIBUTING.md#fork--create-a-branch) of the code

3. Do not commit changes to files that are irrelevant to your feature or bugfix (eg: `.gitignore`).

4. Provide [tests](CONTRIBUTING.md#running-tests) and documentation whenever possible.

5. Be sure you have followed the [code style](CONTRIBUTING.md#code-style) for the project.

6. Add a [changelog](CONTRIBUTING.md#add-a-changelog-entry) entry

7. Sign the [Contributor License Agreement](CONTRIBUTING.md#contributor-license-agreement)

8. Open a [GitHub Pull Request](CONTRIBUTING.md#open-a-pull-request) with your patches. (**1** pull request = **1** feature or bug)
   We will review your contribution and respond as quickly as possible. Keep in mind that this is an open source project, and it may take us some time to get back to you. Your patience is very much appreciated.

9. Be willing to accept criticism and work on improving your code. 

**Working on your first Pull Request?** You can learn how from  this *free* series [How to Contribute to an Open Source Project on  GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)    

### Fork & create a branch

[Fork BPMN Visu JS](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name. 

A good branch name would be (where issue #25 is the ticket you're working on): **25_add-annotations-to-tasks**

```sh
git checkout -b 25_annotations-to-tasks
```

### Development
#### Requirements

- `Node.js` >= 12.x (may work with older versions but without any guarantee)
- `Typescript` 3.x
- `Supported OS` (see the Github Build workflow for more details): Windows/Linux/MacOs

#### Build

- `npm install`           *Install the dependencies in the local node_modules folder*
- `npm run watch`         *Watch files in bundle and rebuild on changes* <br>
                          You can now access the project on http://localhost:10001

### Running tests 

- `npm run test`        *Run all tests*
- `npm run coverage`    *Run all tests and the coverage*
- `npm run e2e`         *Run all end-to-end tests*

### Code style

Your patch should follow the same conventions & pass the same code quality checks as the rest of the project.

Project, in major line, follows the code style suggested by [airbnb](https://github.com/airbnb/javascript) which is explicit and well documented.

Typescript have been chosen as it's strongly typed and we believe it adds some syntactical benefits to the JavaScript language
More information here:  [Typescript](CONTRIBUTING.md#typescript) 

To enforce best practices we use ESLint and husky.
The later performs ```eslint --fix``` on pre-commit event to make sure that committed code meets standards.

ESLint configuration extends:
- plugin:@typescript-eslint/recommended
- prettier/@typescript-eslint
- plugin:prettier/recommended

### IDE - configuration

To fully benefit the ESLint and Mocha testing framework you must properly set up your IDE.

##### IntelliJ
*ESLint* (https://www.jetbrains.com/help/idea/eslint.html#)

Go to `File` -> `Settings` and type ESLint in search box

Enable ESLint by choosing `Automatic ESLint configuration`

If automatic configuration is not working for any reason try with `Manual ESLint configuration`, specify:
- ESLint package to point to `project\node_modules\eslint`
- Configuration file must point to `project\.eslintrc.js`

You also need to set up Coding Style rules

It is as simple as doing `right-click` on the file `.eslintrc.js` and choosing option `Apply ESLint Code Style Rules`

*Mocha tests* (https://www.jetbrains.com/help/idea/running-unit-tests-on-mocha.html#)

To be able to run tests from IntelliJ, you must set up the default Mocha template in `Run/Debug Configurations`

Adjust following parameters:

Environment variables:  `TS_NODE_FILES=true;TS_NODE_COMPILER_OPTIONS={ "module": "commonjs" }`
Extra Mocha options: ` --exit --require ts-node/register --colors`

*SonarLint*

Additionally it is advised to install SonarLint Plugin

It helps to avoid coding mistakes -> reduced technical debt

### Add a changelog entry

If your PR includes user-observable changes, you'll be asked to add a changelog entry following the existing changelog format.

The changelog format is the following:

* One line per PR describing your fix or enhancement.

* Entries end with a dot, followed by "[#pr-number] by [@github-username]".

* Entries are added under the "Unreleased" section at the top of the file, under the "Bug Fixes" or "Enhancements" subsection.

* References to github usernames and pull requests use [shortcut reference links].

* Your github username reference definition is included in the correct alphabetical position at the bottom of the file.

### Sign the Contributor License Agreement

Please make sure you have signed our [Contributor License Agreement](). We are not asking you to assign copyright to us, but to give us the right to distribute your code without restriction. We ask this of all contributors in order to assure our users of the origin and continuing existence of the code. You only need to sign the CLA once.

### Open a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with BPMN Visu JS's master branch:

```sh
git remote add upstream git@github.com:bonitasoft-labs/bpmn-visu-js.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 25_annotations-to-tasks
git rebase master
git push --set-upstream origin 25_annotations-to-tasks
```

Finally, go to GitHub and [make a Pull Request](https://help.github.com/articles/creating-a-pull-request) ​with labels :smile:

:warning: ​We care about quality. So your PR won't be merged until all tests pass.

### Keeping your Pull Request updated

If a maintainer asks you to [rebase](http://git-scm.com/book/en/Git-Branching-Rebasing) your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

Here's the suggested workflow:

```sh
git checkout 25_annotations-to-tasks
git pull --rebase upstream master
git push --force-with-lease 25_annotations-to-tasks
```



At this point, you're ready to make your changes! Feel free to ask for help. Everyone is a beginner at first :smile_cat:


### Typescript
Although Linting, Sonar and Tests keeps the code in a good shape
We strongly recommend you to read following resources to be able to write code that is conform to the best practices:
- [basics](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [do's and don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)


## Maintainers

### Merging a PR (maintainers only)

A PR can only be merged into master by a maintainer, if all of these conditions are met:

* It is passing CI.
* It has been approved by at least two maintainers. If it was a maintainer who opened the PR, only one extra approval is needed.
* It has no requested changes.
* It is up to date with current master.

### Release (maintainers only)

Maintainers need to do the following to push out a release:

* Make sure all pull requests are in, and changelog is up to date
* Update changelog with new version number
* Create a [new release](https://github.com/process-analytics/bpmn-visualization-js/releases/new) on Github from the changelog




