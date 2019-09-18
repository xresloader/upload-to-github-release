# Upload To Github Release

Github Action to deploy files to github release

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/xresloader/upload-to-github-release)](https://github.com/xresloader/upload-to-github-release/releases)
[![GitHub](https://img.shields.io/github/license/xresloader/upload-to-github-release)](LICENSE)

![Dependency: @actions/core](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/@actions/core)
![Dependency: @actions/github](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/@actions/github)
![Dependency: @actions/globby](https://img.shields.io/github/package-json/dependency-version/xresloader/upload-to-github-release/globby)

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/xresloader/upload-to-github-release)
![GitHub repo size](https://img.shields.io/github/repo-size/xresloader/upload-to-github-release)
![GitHub forks](https://img.shields.io/github/forks/xresloader/upload-to-github-release?style=social)
![GitHub stars](https://img.shields.io/github/stars/xresloader/upload-to-github-release?style=social)

## Environments

### `GITHUB_TOKEN`

**Required** The github token. You can set it to [`"${{ secrets.GITHUB_TOKEN }}"`][1] to use default token.

See https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line for details.

## Inputs

### `file`

**Required** The files or file patterns to upload. You can upload multiple files by split them by semicolon. You can use the glob pattern to find the files.

### `overwrite`

**Optional** If you need to overwrite existing files, add overwrite: true to the `"with"`.

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

If tags is set true, you should use the action event ```on: create``` . See https://help.github.com/en/articles/workflow-syntax-for-github-actions#on for more details.

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


## Example usage

```yml
uses: xresloader/upload-to-github-release@master
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
with:
  file: "*.md"
  tags: true
  draft: true
```

## Developer

You can use a tool called [zeit/ncc][2] to compile your code and modules into one file used for distribution.

1. Install ```zeit/ncc``` by running this command in your terminal. ```npm i @zeit/ncc -g```
2. Compile your ```index.js``` file. ```ncc build src/index.js``` .You'll see a new ```dist/index.js``` file with your code and the compiled modules.
3. Change the ```main``` keyword in your ```action.yml``` file to use the new ```dist/index.js``` file. ```main: 'dist/index.js'```
4. From your terminal, commit the updates to your ```action.yml```, ```dist/index.js```, and node_modules files. ```<pre><code class="hljs language-shell">git add action.yml dist/index.js git commit -m "Use zeit/ncc" git push</code></pre>```

Testing: https://help.github.com/en/articles/creating-a-javascript-action#testing-out-your-action-in-a-workflow

[1]: https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret
[2]: https://github.com/zeit/ncc
