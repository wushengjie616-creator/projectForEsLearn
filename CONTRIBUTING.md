# Contributing

Thank you for helping improve HAiKnow's Spanish reading and writing platform.

## Governance and permissions

This is a public repository: anyone may inspect or fork the source and propose a change through an issue or pull request. A proposal does not grant write access and does not become part of the official project unless a designated maintainer accepts it.

Only the repository owner and people explicitly invited as maintainers may approve or merge changes into `main`. The current code owner is recorded in [`.github/CODEOWNERS`](.github/CODEOWNERS). Do not ask for credentials, invitation codes, deployment secrets, or direct repository access in an issue or pull request.

All changes to `main`, including maintainer changes, must go through the repository's branch rules and required CI checks. Repository collaborators must not bypass those controls or force-push the protected branch.

## Before changing code

1. Create a focused branch from the current `main` branch.
2. Keep secrets and deployment data out of Git. Copy `.env.example` to `.env.local` only on your own machine.
3. For behavior changes and bug fixes, add or update a regression test first when the existing test harness can cover the behavior.
4. Keep implementation and affected documentation in the same pull request.

## Quality checks

Run these commands in PowerShell before opening a pull request:

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Do not run `npm.cmd run verify:custom-learning-e2e` unless you own the configured DeepSeek account and explicitly accept the paid API calls.

## Adding learning content

Every proposed reading must include evidence for that specific work; another work on the same website is not enough. A content contribution must:

1. identify the author, title, exact source URL, retrieval date, and applicable license or public-domain basis;
2. record whether the text is complete or excerpted and list normalization, omission, translation, and learning-material changes;
3. preserve required attribution and ShareAlike or derivative-work notices;
4. exclude images, logos, quotations, or other third-party elements unless they are separately cleared;
5. add the source text under `content/raw/`, update `content/corpus-manifest.json`, and update `haiknow-doc/docs/content-sources.md`;
6. avoid sending content to DeepSeek or another generative-AI provider when the source notice prohibits or restricts that use;
7. pass the corpus integrity and reading-content tests.

Project Gutenberg materials must be checked for the intended deployment jurisdiction. OpenStax materials must retain the original-source notice and keep DeepSeek disabled unless the contributor supplies documented permission from OpenStax and the maintainers approve the policy change.

## Pull requests

Describe the user-visible outcome, the evidence used for content or licensing decisions, tests run, and any remaining risk. Avoid unrelated formatting or dependency changes in the same pull request.
