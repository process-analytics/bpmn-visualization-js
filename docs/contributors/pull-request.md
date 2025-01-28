# Pull Request

## Open a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with `bpmn-visualization`
`master` branch:

```sh
git remote add upstream git@github.com:process-analytics/bpmn-visualization-js.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 25-annotations_to_tasks
git rebase master
git push --set-upstream origin 25-annotations_to_tasks
```

Finally, go to GitHub and [make a Pull Request](https://help.github.com/articles/creating-a-pull-request) ​with labels 😄 \
For the title, follow the directives of the Pull Request template.

⚠️ We care about quality. So your PR won't be merged until all tests pass.

## Sign the Contributor License Agreement

By signing the CLA, we acknowledge that your contribution is accepted as it and that you cannot be held responsible for
any impacts on its integration. You then grant us the right to modify and distribute your code without restrictions. We
ask this of all contributors in order to assure our users of the origin and continuing existence of the code.

When you contribute to the project on GitHub with a new pull request, the [cla-assistant bot](https://cla-assistant.io/)
will evaluate whether you have signed the CLA. If required, the bot will comment on the pull request, including a link
to this system to accept the agreement.

You only need to sign the CLA once or when the CLA terms have changed.

## Keeping your Pull Request updated

If a maintainer asks you to [rebase](http://git-scm.com/book/en/Git-Branching-Rebasing) your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

Here's the suggested workflow:

```sh
git checkout 25-annotations_to_tasks
git pull --rebase upstream master
git push --force-with-lease 25-annotations_to_tasks
```

## Draft Pull Request

Consider marking the PR as [a Draft](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests#draft-pull-requests) if it is still a work in progress and not ready for review.
