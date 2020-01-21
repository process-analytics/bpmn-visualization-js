# Contributing

You are here to help on BPMN JS? Awesome, feel welcome and read the following guidelines in order to know how to contribute, to ask questions and to make BPMN JS such a great tool.

All members of our community are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please make sure you are welcoming and friendly in all of our spaces.

## Contributions 

There are many ways to contribute:

- help people with the questions they ask on the [Github Issues](https://github.com/bonitasoft-labs/bpmn-js/issues )
- submitting bug reports and feature requests in the [Github Issues](https://github.com/bonitasoft-labs/bpmn-js/issues/new )
- [writing code](CONTRIBUTING.md#code-and-documentation-changes) which can be incorporated into BPMN JS itself
- [improving](CONTRIBUTING.md#code-and-documentation-changes) the documentation
- improve the existing example applications to demonstrate features in BPMN JS

## Code and documentation changes

For all contributions, please respect the following guidelines:

1. If you've noticed a bug or have a feature request, let us know in the [GitHub Issue tracker](https://github.com/bonitasoft-labs/bpmn-js/issues/new )! So we can confirm the bug or approve your feature, and provide feedback, before starting to code :slightly_smiling_face:

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

[Fork BPMN JS](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name. 

A good branch name would be (where issue #25 is the ticket you're working on): **25_add-annotations-to-tasks**

```sh
git checkout -b 25-annotations-to-tasks
```

### Running tests



### Code style

Your patch should follow the same conventions & pass the same code quality checks as the rest of the project.

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

At this point, you should switch back to your master branch and make sure it's up to date with BPMN JS's master branch:

```sh
git remote add upstream git@github.com:bonitasoft-labs/bpmn-js.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 25-annotations-to-tasks
git rebase master
git push --set-upstream origin 25-annotations-to-tasks
```

Finally, go to GitHub and [make a Pull Request](https://help.github.com/articles/creating-a-pull-request) ​with labels :smile:

:warning: ​We care about quality. So your PR won't be merged until all tests pass.

### Keeping your Pull Request updated

If a maintainer asks you to [rebase](http://git-scm.com/book/en/Git-Branching-Rebasing) your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

Here's the suggested workflow:

```sh
git checkout 25-annotations-to-tasks
git pull --rebase upstream master
git push --force-with-lease 25-annotations-to-tasks
```



At this point, you're ready to make your changes! Feel free to ask for help. Everyone is a beginner at first :smile_cat:



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
* Create a [new release](https://github.com/bonitasoft-labs/bpmn-js/releases/new) on Github from the changelog




