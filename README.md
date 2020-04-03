# BPMN Visu JS
A JavaScript library to visualize [BPMN](https://www.omg.org/spec/BPMN/2.0.2/PDF) diagrams as well as meta-information about process execution, which the user can interact with.
  - BPMN diagrams are read from .bpmn files that may not only come from Bonita but rather be created from any BPM tool or even created manually. This means that it will be able to display more BPMN 2.0 elements than those supported by Bonita.
  - Process execution information can be real-time or over a period of time in the past. It encompasses information on cardinality (counters), relative frequencies (color density, transition thickness) or durations. 
  - Interactivity is brought by the means of mouse hover, clicks, and runtime configuration options to define.

This library will be created and offered as an Open Source project.

[![Build](https://github.com/bonitasoft-labs/bpmn-visu-js/workflows/Build/badge.svg)](https://github.com/bonitasoft-labs/bpmn-visu-js/actions)
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/bonitasoft-labs/bpmn-visu-js?color=orange&include_prereleases)](https://github.com/bonitasoft-labs/bpmn-visu-js/releases)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

# Acceptance criteria

## Reads BPMN files from major BPM vendors complying with BPMN (list TBD)

## Internationalized and multi-language support
Users from any country can insert their translations and use several languages in one application if the application allows.

## Extension points
  * Visual properties of the BPMN elements
  * Visual properties of the meta-information
  * Vendor-specific extensions (e.g. Bonita connectors)
  
## Supported Browsers
Chrome, Firefox, Safari, Edge. This means: no Internet Explorer 11.

## USable in multiple development frameworks
Embeddable as a web component

## Suitable for mobile use
Offer alternatives to mouse hover.
Adapt display to mobile-specific screen sizes.

## Easy to contribute to
Project and code readable.

# Demos

You currently must build the project prior to use it (see below).

If you need BPMN examples, you can use resources from the from [BPMN Model Interchange Working Group (BPMN MIWG)](http://www.omgwiki.org/bpmn-miwg)
- https://github.com/bpmn-miwg/bpmn-miwg-test-suite
- https://github.com/bpmn-miwg/bpmn-miwg-demos


# Roadmap

`BPMN Visu JS` is in early development stages and is subject to changes until the `1.0.0` version is released.

We are currently focusing on the [BPMN support](docs/bpmn-support-roadmap.adoc) to be able to render most of the BPMN
elements.

Then, we will work on BPMN extensions, library extension points.

# Architecture
- [Internal model](docs/architecture/internal-model.adoc)
- [BPMN Parsing](docs/architecture/bpmn-parsing.adoc)

# Development

To build the project, see the [Contributing guide](CONTRIBUTING.md#Build) :slightly_smiling_face:

## Release

## Issues and milestones update

Milestone names are based on version
- Clean the opened milestone if some issues are still opened (move them to a new one or discard milestone from them)
- Close the milestone
- Clean the [Day to Day Board](https://github.com/bonitasoft-labs/bpmn-visu-js/projects/1): archive all cards of the
`Done` column related to the milestone


## Git Tag

- Ensures you’re on master and don’t have local, un-commited changes: `git checkout master && git pull --tags`
- Bumps the version number in package.json based on major, minor or patch (see https://docs.npmjs.com/cli/version, type:
 [new-version | major | minor | patch]): `npm version [type] --message "[RELEASE] %s"`
- Push to GitHub: `git push && git push --tags`

## GitHub update

- Ensure the latest closed milestone matches the name of the tag/version that has just been pushed
- Create a new GitHub release
  - Open [github releases](https://github.com/bonitasoft-labs/bpmn-visu-js/releases)
  - Create a new release based on the newly created tags. Check `This is a pre-release`
  - In the description, at least add a link to the related milestone
