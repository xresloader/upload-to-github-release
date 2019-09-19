# Upload To Github Release

Github Action to deploy files to github release

[![GitHub Actions status](https://github.com/xresloader/upload-to-github-release/workflows/NPM%20Publish/badge.svg)](https://github.com/xresloader/upload-to-github-release/actions)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/xresloader/upload-to-github-release)](https://github.com/xresloader/upload-to-github-release/releases)
[![GitHub](https://img.shields.io/github/license/xresloader/upload-to-github-release)](LICENSE)

![Dependency: @actions/core](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/@actions/core)
![Dependency: @actions/github](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/@actions/github)
![Dependency: @actions/globby](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/globby)
![Dependency: mime](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/mime)

![Dev dependency: typescript](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/dev/typescript)
![Dev dependency: @types/jest](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/dev/@types/jest)
![Dev dependency: @types/node](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/dev/@types/node)
![Dev dependency: @zeit/ncc](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/dev/@zeit/ncc)
![Dev dependency: jest](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/dev/jest)
![Dev dependency: jest-circus](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/dev/jest-circus)
![Dev dependency: ts-jest](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/dev/ts-jest)

![npm](https://img.shields.io/npm/v/upload-to-github-release)
![npm downloads](https://img.shields.io/npm/dt/upload-to-github-release)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/xresloader/upload-to-github-release)
![GitHub repo size](https://img.shields.io/github/repo-size/xresloader/upload-to-github-release)
![GitHub forks](https://img.shields.io/github/forks/xresloader/upload-to-github-release)
![GitHub stars](https://img.shields.io/github/stars/xresloader/upload-to-github-release)

## Example usage

```yml
uses: xresloader/upload-to-github-release@v1
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
with:
  file: "*.md"
  tags: true
  draft: true
```

You can find more samples on https://github.com/xresloader/upload-to-github-release-test/blob/master/.github/workflows/ .

## Environments

### `GITHUB_TOKEN`

**Required** The github token. You can set it to [`"${{ secrets.GITHUB_TOKEN }}"`][1] to use default token.

See https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line for details.

## Inputs

### `file`

**Required** The files or file patterns to upload. You can upload multiple files by split them by semicolon. You can use the glob pattern to find the files.

### `overwrite`

**Optional** If you need to overwrite existing files, add overwrite: true.

**Default** : false

### `draft`

**Optional** The resultant deployment is a draft Release that only repository collaborators can see. This gives you an opportunity to examine and edit the draft release.

**Default** : true

### `prerelease`

**Optional** The resultant deployment is a Prerelease that only repository collaborators can see. This gives you an opportunity to examine and edit the prerelease.

**Default** : false

### `tags`

**Optional** With tags: true, your Releases deployment will trigger if and only if the build is a tagged build.

**Default** : false

### `branches`

**Optional** Only work on these branches, set to nothing to accept all branches.

**Default** : []

## Outputs

### `release_name`

The release name.

### `release_url`

The release url.

### `release_tag_name`

The release tag name.

### `release_commitish`

The release commitish.

## For Developer

We can use [npm][3] or [yarn][4] to build this action.

```bash
# for npm
npm install
npm run build

# for yarn
npm i -g yarn
yarn install
yarn run build

# commit
git add lib/* src/*
git commit -m "COMMIT MESSAGE"
```

### Reference

| title                                             |                                                      link                                                         |
|:--------------------------------------------------|:------------------------------------------------------------------------------------------------------------------|
| GitHub Actions                                    | https://github.com/features/actions                                                                               |
| Creating a javascript action                      | https://help.github.com/en/articles/creating-a-javascript-action#testing-out-your-action-in-a-workflow            |
| Events that trigger workflows - GitHub Help       | https://help.github.com/en/articles/events-that-trigger-workflows                                                 |
| The GitHub ToolKit for developing GitHub Actions  | https://github.com/actions/toolkit                                                                                |
| GitHub GraphQL API v4                             | https://developer.github.com/v4/                                                                                  |
| GitHub Rest API v3 for Release                    | https://developer.github.com/v3/repos/releases/                                                                   |
| GitHub GraphQL API client for browsers and Node   | https://github.com/octokit/graphql.js                                                                             |
| GitHub REST API client for JavaScript             | https://octokit.github.io/rest.js/                                                                                |


[1]: https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret
[2]: https://github.com/zeit/ncc
[3]: https://www.npmjs.com/
[4]: https://yarnpkg.com/lang/en/
