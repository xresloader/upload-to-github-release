import * as action_core from '@actions/core';
import * as action_github from '@actions/github';
import globby from 'globby';

// const io = require('@actions/io');
// const tc = require('@actions/tool-cache');

async function run() {
    try {
        const github_token = (process.env['GITHUB_TOKEN'] || '').trim();
        const upload_files_pattern = (action_core.getInput('file') || '').split(";").map(v => v.trim()).filter(v => !!v);
        const is_overwrite = action_core.getInput('overwrite');
        const is_draft = action_core.getInput('draft');
        const with_tags = action_core.getInput('tags');
        const with_branches = (action_core.getInput('branches') || '').split(";").map(v => v.trim()).filter(v => !!v);

        if (typeof (github_token) != 'string') {
            action_core.setFailed("token is invalid");
            return;
        }

        if (!github_token) {
            action_core.setFailed("GITHUB_TOKEN is required to upload files");
            return;
        }

        console.log(`context.payload = ${JSON.stringify(action_github.context.payload, undefined, 2)}`);
        console.log(`context.eventName = ${action_github.context.eventName}`);
        console.log(`context.sha = ${action_github.context.sha}`);
        console.log(`context.ref = ${action_github.context.ref}`);
        console.log(`context.action = ${action_github.context.action}`);
        console.log(`context.actor = ${action_github.context.actor}`);
        console.log(`context.repo.repo = ${action_github.context.repo.repo}`);
        console.log(`context.repo.owner = ${action_github.context.repo.owner}`);

        // if (with_branches)
        // if (with_tags)

        const upload_files = await globby(upload_files_pattern);
        console.log(`Files to upload: ${upload_files}!`);
        if (!upload_files) {
            action_core.setFailed("file is required");
            return;
        }

        // request github release
        const octokit = new action_github.GitHub(github_token);
        // Debug Tool: https://developer.github.com/v4/explorer
        const repo_info = await octokit.graphql(`
            query {
                repository (owner:"xresloader", name:"xresloader") { 
                    release (tagName: "v2.5.0") {
                    id,
                    name,
                    isDraft,
                    resourcePath,
                    tag {
                        id, 
                        name,
                        prefix
                    },
                    updatedAt,
                    url,
                    releaseAssets(last: 5) {
                        nodes {
                        id,
                        name,
                        size,
                        downloadUrl
                        }
                    }
                    }
                }
            }`);

        console.log("============================= v4 API: graphql(query {repository}) =============================");
        action_core.debug(repo_info);
        // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
        const check_release = await octokit.repos.getReleaseByTag({
            owner: "xresloader",
            repo: "xresloader",
            tag: "v2.5.0"
        });

        console.log("============================= v3 API: getReleaseByTag =============================");
        action_core.debug(`getReleaseByTag.headers = ${JSON.stringify(check_release.headers)}`);
        action_core.debug(`getReleaseByTag.status = ${check_release.status}`);
        action_core.debug(`getReleaseByTag.data = ${JSON.stringify(check_release.data)}`);
        // set output
        const time = (new Date()).toTimeString();
        action_core.setOutput("time", time);
    } catch (error) {
        action_core.setFailed(error.message);
    }
}

run();