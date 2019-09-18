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
        // context.ref = refs/heads/BRANCH_NAME  or refs/tags/TAG_NAME   
        console.log(`context.ref = ${action_github.context.ref}`);
        console.log(`context.action = ${action_github.context.action}`);
        console.log(`context.actor = ${action_github.context.actor}`);
        console.log(`context.repo.repo = ${action_github.context.repo.repo}`);
        console.log(`context.repo.owner = ${action_github.context.repo.owner}`);
        // context.eventName = push
        // context.sha = ae7dc58d20ad51b3c8c37deca1bc07f3ae8526cd
        // context.ref = refs/heads/master
        // context.action = xresloaderupload-to-github-release
        // context.actor = owt5008137
        // context.repo.repo = upload-to-github-release-test
        // context.repo.owner = xresloader

        var release_name = action_github.context.sha.substr(0, 8);
        if (with_branches || with_tags) {
            // check branches or tags
            var match_filter = false;
            if (with_tags) {
                const match_tag = action_github.context.ref.match(/refs\/tags\/(.*)/);
                if (match_tag) {
                    match_filter = true;
                    release_name = match_tag[1];
                } else {
                    console.log('Current event is not a tag push.');
                }
            }

            if (!match_filter && with_branches) {
                const match_branch = action_github.context.ref.match(/refs\/heads\/(.*)/);
                if (match_branch) {
                    const selected_branch = with_branches.filter((s) => s == match_branch[1]);
                    if (selected_branch) {
                        match_filter = true;
                        release_name = match_branch[1] + '-' + release_name;
                    }
                }

                if (!match_filter) {
                    console.log(`Current event is not one of branches [${with_branches.join(", ")}].`);
                }
            }

            if (!match_filter) {
                console.log(`Current event will be skipped.`);
                return;
            }
        }

        const upload_files = await globby(upload_files_pattern);
        console.log(`Files to upload: ${upload_files}!`);
        if (!upload_files) {
            action_core.setFailed("file is required");
            return;
        }

        // request github release
        const octokit = new action_github.GitHub(github_token);
        // Debug Tool: https://developer.github.com/v4/explorer
        const repo_info = await octokit.graphql(`query {
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
        console.log(`repo_info = ${repo_info} => ${JSON.stringify(repo_info)}`);
        // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
        const check_release = await octokit.repos.getReleaseByTag({
            owner: "xresloader",
            repo: "xresloader",
            tag: "v2.5.0"
        });

        console.log("============================= v3 API: getReleaseByTag =============================");
        console.log(`getReleaseByTag.headers = ${JSON.stringify(check_release.headers)}`);
        console.log(`getReleaseByTag.status = ${check_release.status}`);
        console.log(`getReleaseByTag.data = ${JSON.stringify(check_release.data)}`);
        // set output
        const time = (new Date()).toTimeString();
        action_core.setOutput("time", time);
    } catch (error) {
        action_core.setFailed(error.message);
    }
}

run();