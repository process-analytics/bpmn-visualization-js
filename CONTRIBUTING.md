# Contributing

You are here to help on `bpmn-visualization`? Awesome, feel welcome and read the following guidelines in order to know how to contribute, to ask questions and to make `bpmn-visualization` such a great tool.

All members of our community are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please make sure you are welcoming and friendly in all of our spaces.

## Contributions 

There are many ways to contribute:

- help people with the questions they ask on the [Github Issues](https://github.com/process-analytics/bpmn-visualization-js/issues)
- submitting bug reports and feature requests in the [Github Issues](https://github.com/process-analytics/bpmn-visualization-js/issues/new)
- [writing code](CONTRIBUTING.md#code-and-documentation-changes-guidelines) which can be incorporated into `bpmn-visualization` itself
- [improving](CONTRIBUTING.md#code-and-documentation-changes-guidelines) the documentation
- improve the existing [example applications](https://github.com/process-analytics/bpmn-visualization-examples) to demonstrate features in `bpmn-visualization`

## Code and documentation changes guidelines

For all contributions, please respect the following guidelines:

1. If you've noticed a bug or have a feature request, let us know in the [GitHub Issue tracker](https://github.com/process-analytics/bpmn-visualization-js/issues/new )! So we can confirm the bug or approve your feature, and provide feedback, before starting to code 🙂  
If you start working on one of the existing [issues](https://github.com/process-analytics/bpmn-visualization-js/issues), please leave a comment below the issue so everyone knows that the issue is taken.

2. Do the changes in your own [fork](CONTRIBUTING.md#fork--create-a-branch) of the code

3. Do not commit changes to files that are irrelevant to your feature or bugfix (eg: `.gitignore`).

4. Provide [tests](./docs/contributors/development.md#tests) and documentation whenever possible.

5. Be sure you have followed the [code style](./docs/contributors/development.md#code-style) for the project.

6. Prior opening a Pull Request, ensure the build is fully working by locally running `npm run all` (build, check and
test everything)

7. Open a [GitHub Pull Request](./docs/contributors/pull-request.md#open-a-pull-request) with your patches. (**1** pull request = **1** feature or bug)
   We will review your contribution and respond as quickly as possible. Keep in mind that this is an open source project, and it may take us some time to get back to you. Your patience is very much appreciated.

8. If this is your 1st Pull Request, sign the [Contributor License Agreement](./docs/contributors/pull-request.md#sign-the-contributor-license-agreement)

9. Be willing to accept criticism and work on improving your code. 

**Working on your first Pull Request?** You can learn how from this *free* series [How to Contribute to an Open Source Project on  GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)    

### Fork & create a branch

[Fork bpmn-visualization](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name. 

A good branch name would be (where issue #25 is the ticket you're working on): **25-annotations_to_tasks**  

ℹ️ Please don't forget to leave a comment under the issue to let other contributors know that this issue is under the development \[i.e "in progress", "i am on it"\]

```sh
git checkout -b 25-annotations_to_tasks
```

### IDE configuration
To know how configure your development environment, see [IDE configuration](./docs/contributors/ide-configuration.md).

### Development

You'll find [here](./docs/contributors/development.md) the necessary information to build, test, lint your code, and some tips too. 

### Commit in your branch
There is no convention for the commit message in your branch.
The most important part is the title of the Pull Request, because:
- Everyone must use Pull Request, no direct commit allowed on master branch
- The commits of a Pull Request are almost always squashed
- The title of the Pull Request is used as proposal for the maintainer merging the Pull Request

### Pull Request

After your development finished, you need to open a Pull Request. You'll find [here](./docs/contributors/pull-request.md) all the necessary information to open it and to keep it updated.


At this point, you're ready to make your changes! Feel free to ask for help. Everyone is a beginner at first 😸

## Maintainers

See the necessary information for the [Maintainers](./docs/contributors/maintainers.md)
