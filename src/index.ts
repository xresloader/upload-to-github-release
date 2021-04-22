import * as action_core from "@actions/core";
import * as action_github from "@actions/github";
import globby from "globby";
import micromatch from 'micromatch';
import * as path from "path";
import * as fs from "fs";
import mime from "mime/lite";
// import Octokit from "@octokit/rest";
import { env } from "string-env-interpolation";
import { AsyncReturnType, ValueOf, Except } from "type-fest";

// const io = require('@actions/io');
// const tc = require('@actions/tool-cache');

function getInputAsArray(name: string): string[] {
  return env(action_core.getInput(name) || "")
    .split(";")
    .map((v) => v.trim())
    .filter((v) => !!v);
}

function getInputAsBool(name: string): boolean {
  const res = env(action_core.getInput(name) || "").toLowerCase();
  if (!res) {
    return false;
  }

  return (
    res != "false" &&
    res != "disabled" &&
    res != "0" &&
    res != "no" &&
    res != "disable"
  );
}

function getInputAsString(name: string): string {
  return env(action_core.getInput(name) || "").trim();
}

function getInputAsInteger(name: string): number {
  try{
    const str_val = getInputAsString(name);
    if (!str_val) {
      return 0;
    }
    return Number.parseInt(str_val);
  } catch(_) {
    return 0;
  }
}

export { getInputAsArray, getInputAsBool, getInputAsString };

async function run() {
  try {
    const github_token = (process.env["GITHUB_TOKEN"] || "").trim();
    const upload_files_pattern = getInputAsArray("file");
    const delete_files_pattern = getInputAsArray("delete_file");
    const is_overwrite = getInputAsBool("overwrite");
    const is_draft = getInputAsBool("draft");
    const is_prerelease = getInputAsBool("prerelease");
    const with_tags = getInputAsBool("tags");
    const with_branches = getInputAsArray("branches");
    const is_verbose = getInputAsBool("verbose");
    const custom_tag_name = getInputAsString("tag_name");
    const update_latest_release = getInputAsBool("update_latest_release");
    var release_id = getInputAsInteger("release_id");

    if (typeof github_token != "string") {
      action_core.setFailed("token is invalid");
      return;
    }

    if (!github_token) {
      action_core.setFailed("GITHUB_TOKEN is required to upload files");
      return;
    }

    // action_github.context.eventName = push
    // action_github.context.sha = ae7dc58d20ad51b3c8c37deca1bc07f3ae8526cd
    // context.ref = refs/heads/BRANCH_NAME  or refs/tags/TAG_NAME
    // action_github.context.ref = refs/heads/master
    // action_github.context.action = xresloaderupload-to-github-release
    // action_github.context.actor = owt5008137
    // action_github.context.repo.repo = upload-to-github-release-test
    // action_github.context.repo.owner = xresloader

    var release_tag_name = "Release-" + action_github.context.sha.substr(0, 8);
    var release_name = release_tag_name;
    var release_tag_name_has_ref = false;
    if (custom_tag_name) {
      release_tag_name = custom_tag_name;
      release_tag_name_has_ref = true;
    } else if ((with_branches && with_branches.length > 0) || with_tags) {
      // check branches or tags
      var match_filter = false;
      if (with_tags) {
        const match_tag = action_github.context.ref.match(/refs\/tags\/(.*)/);
        if (match_tag) {
          match_filter = true;
          release_tag_name_has_ref = true;
          release_tag_name = match_tag[1];
          console.log(`Found tag to push: ${match_tag[1]}.`);
        } else {
          console.log("Current event is not a tag push.");
        }
      }

      if (!match_filter && with_branches && with_branches.length > 0) {
        const match_branch = action_github.context.ref.match(
          /refs\/heads\/(.*)/
        );
        if (match_branch) {
          const selected_branch = with_branches.filter(
            (s) => s == match_branch[1]
          );
          if (selected_branch && selected_branch.length > 0) {
            match_filter = true;
            release_tag_name =
              match_branch[1] + "-" + action_github.context.sha.substr(0, 8);
            console.log("Found branch push: ${match_tag[1]}.");
          }
        }

        if (!match_filter) {
          console.log(
            `Current event is not one of branches [${with_branches.join(
              ", "
            )}].`
          );
        }
      }

      if (!match_filter) {
        console.log(`Current event will be skipped.`);
        return;
      }
    } else if (action_github.context.ref) {
      // try get branch name
      const match_branch = action_github.context.ref.match(/([^\/]+)$/);
      if (match_branch && match_branch.length > 1) {
        release_tag_name =
          match_branch[1] + "-" + action_github.context.sha.substr(0, 8);
      }
    }

    const upload_files = await globby(upload_files_pattern);
    if (!upload_files || upload_files.length <= 0) {
      action_core.setFailed(`Can not find any file by ${upload_files_pattern}`);
      return;
    }
    for (const file_path of upload_files) {
      console.log(`File found to upload: ${file_path}`);
    }

    // request github release
    const octokit = action_github.getOctokit(github_token);
    // const octokit = new action_github.GitHub(github_token);
    /** Can not upload assets by v4 API, so we use v3 API by now **/
    /**
        // Debug Tool: https://developer.github.com/v4/explorer
        // API Docs:   https://developer.github.com/v4/
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

        const repo_info_of_release = await octokit.graphql(`query {
                repository (owner:"${action_github.context.repo.owner}", name:"${action_github.context.repo.repo}") { 
                    release (tagName: "${release_tag_name}") {
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
        console.log(`repo_info = ${JSON.stringify(repo_info)}`);
        console.log(`repo_info_of_release = ${JSON.stringify(repo_info_of_release)}`);
        **/
    // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
    type FakeListReleaseReponse = AsyncReturnType<
      typeof octokit.repos.listReleases
    >;
    var deploy_release:
      | AsyncReturnType<typeof octokit.repos.getRelease>
      | AsyncReturnType<typeof octokit.repos.getReleaseByTag>
      | AsyncReturnType<typeof octokit.repos.updateRelease>
      | AsyncReturnType<typeof octokit.repos.getLatestRelease>
      | {
          data: ValueOf<ValueOf<FakeListReleaseReponse, "data">, 0>;
          status: ValueOf<FakeListReleaseReponse, "status">;
          headers: ValueOf<FakeListReleaseReponse, "headers">;
        }
      | undefined = undefined;
    var created_release:
      | AsyncReturnType<typeof octokit.repos.createRelease>
      | undefined = undefined;

    if (update_latest_release) {
      console.log(
        `Try to get latest release from ${action_github.context.repo.owner}/${action_github.context.repo.repo}`
      );
      try {
        deploy_release = await octokit.repos.getLatestRelease({
          owner: action_github.context.repo.owner,
          repo: action_github.context.repo.repo,
        });
      } catch (error) {
        console.log(
          `Try to get latest release from ${action_github.context.repo.owner}/${action_github.context.repo.repo} : ${error.message}`
        );
      }
    }

    if (release_id != 0 && !(deploy_release && deploy_release.data)) {
      console.log(
        `Try to get release by id ${release_id} from ${action_github.context.repo.owner}/${action_github.context.repo.repo}`
      );
      try {
        deploy_release = await octokit.repos.getRelease({
          owner: action_github.context.repo.owner,
          repo: action_github.context.repo.repo,
          release_id: release_id,
        });
      } catch (error) {
        const message = `Try to get release by id ${release_tag_name} from ${action_github.context.repo.owner}/${action_github.context.repo.repo} : ${error.message}`;
        console.error(message);
        action_core.setFailed(message);
        return;
      }
    }

    if (!(deploy_release && deploy_release.data)) {
      console.log(
        `Try to get release by tag ${release_tag_name} from ${action_github.context.repo.owner}/${action_github.context.repo.repo}`
      );
      try {
        deploy_release = await octokit.repos.getReleaseByTag({
          owner: action_github.context.repo.owner,
          repo: action_github.context.repo.repo,
          tag: release_tag_name,
        });
      } catch (error) {
        console.log(
          `Try to get release by tag ${release_tag_name} from ${action_github.context.repo.owner}/${action_github.context.repo.repo} : ${error.message}`
        );
      }
    }

    // We can not get a draft release by getReleaseByTag, so we try to find the draft release with the same name by
    if (!(deploy_release && deploy_release.data) && release_tag_name_has_ref) {
      console.log(
        `Try to get draft release ${release_tag_name} from ${action_github.context.repo.owner}/${action_github.context.repo.repo}`
      );
      try {
        const rsp = await octokit.repos.listReleases({
          owner: action_github.context.repo.owner,
          repo: action_github.context.repo.repo,
          page: 1,
          per_page: 100,
        });
        for (const release of rsp.data || []) {
          if (
            release.name == release_tag_name ||
            release.tag_name == release_tag_name
          ) {
            deploy_release = {
              data: release,
              status: rsp.status,
              headers: rsp.headers,
            };

            break;
          }
        }
      } catch (error) {
        console.log(
          `Try to get draft release ${release_tag_name} from ${action_github.context.repo.owner}/${action_github.context.repo.repo} : ${error.message}`
        );
      }
    }

    if (is_verbose) {
      console.log(
        "============================= v3 API: getReleaseByTag ============================="
      );
    }
    if (deploy_release && deploy_release.headers) {
      console.log(
        `Get release ${release_tag_name} from ${action_github.context.repo.owner}/${action_github.context.repo.repo} : ${deploy_release.headers.status}`
      );
      if (is_verbose) {
        console.log(
          `getReleaseByTag.data = ${JSON.stringify(deploy_release.data)}`
        );
      }
    }

    /**
    // action_github.context.sha will be the tag's commit, it's usual 1 commit above where the tag create from
    // This will always cause update tag's commit, which is not  what we expect, so we disable to check and update tag here
    // Check tag references
    var git_tag_ref:
      | Octokit.Octokit.Response<Octokit.Octokit.GitGetRefResponse>
      | undefined = undefined;
    try {
      if (is_verbose) {
        console.log(
          "============================= v3 API: getRef ============================="
        );
      }
      console.log(
        `Try to get git tags/${release_tag_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo}`
      );
      git_tag_ref = await octokit.git.getRef({
        owner: action_github.context.repo.owner,
        repo: action_github.context.repo.repo,
        ref: `tags/${release_tag_name}`,
      });
      console.log(
        `Get git tags/${release_tag_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} success: ${git_tag_ref.data.object.sha}`
      );
      if (is_verbose) {
        console.log(`getRef.data = ${JSON.stringify(git_tag_ref.data)}`);
      }
    } catch (error) {
      var msg = `Get git tags/${release_tag_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo}: ${error.message}`;
      console.log(msg);
    }

    if (git_tag_ref && git_tag_ref.data) {
      if (git_tag_ref.data.object.sha == action_github.context.sha) {
        console.log(
          `Ignore commit sha of refs/tags/${release_tag_name} because not changed.`
        );
      } else {
        try {
          if (is_verbose) {
            console.log(
              "============================= v3 API: updateRef ============================="
            );
          }
          console.log(
            `Try to update git refs/tags/${release_tag_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} to ${action_github.context.sha}`
          );
          const res = await octokit.git.updateRef({
            owner: action_github.context.repo.owner,
            repo: action_github.context.repo.repo,
            ref: `tags/${release_tag_name}`,
            sha: action_github.context.sha,
            force: true,
          });
          console.log(
            `Update refs/tags/${release_tag_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} success`
          );
          if (is_verbose) {
            console.log(`updateRef.data = ${JSON.stringify(res.data)}`);
          }
        } catch (error) {
          var msg = `Update git refs/tags/${release_tag_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} failed: ${error.message}`;
          msg += `\r\n${error.stack}`;
          console.log(msg);
        }
      }
    }
    **/

    type AssertArrayType =
      | ValueOf<ValueOf<ValueOf<FakeListReleaseReponse, "data">, 0>, "assets">
      | ValueOf<
          ValueOf<
            AsyncReturnType<typeof octokit.repos.getReleaseByTag>,
            "data"
          >,
          "assets"
        >
      | ValueOf<
          ValueOf<AsyncReturnType<typeof octokit.repos.updateRelease>, "data">,
          "assets"
        >
      | ValueOf<
          ValueOf<
            AsyncReturnType<typeof octokit.repos.getLatestRelease>,
            "data"
          >,
          "assets"
        >;
    type AssetType = ValueOf<AssertArrayType, 0>;
    const pending_to_delete: AssertArrayType = [];
    const pending_to_upload: string[] = [];
    var upload_url = "";
    var release_url = "";
    var release_commitish = "";
    if (deploy_release && deploy_release.data) {
      upload_url = deploy_release.data.upload_url;
      release_url = deploy_release.data.url;
      release_commitish = deploy_release.data.target_commitish;
      release_name = deploy_release.data.name;
      release_id = deploy_release.data.id;
    } else {
      release_name = release_tag_name;
    }
    // https://developer.github.com/v3/repos/releases/#create-a-release
    if (deploy_release && deploy_release.data) {
      try {
        if (is_verbose) {
          console.log(
            "============================= v3 API: updateRelease ============================="
          );
        }
        console.log(
          `Try to update release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo}`
        );
        deploy_release = await octokit.repos.updateRelease({
          owner: action_github.context.repo.owner,
          repo: action_github.context.repo.repo,
          release_id: release_id,
          tag_name: release_tag_name,
          target_commitish: action_github.context.sha,
          name: release_name,
          body: deploy_release.data.body || undefined,
          draft: is_draft,
          prerelease: is_prerelease,
        });
        release_id = deploy_release.data.id;
        release_name = deploy_release.data.name;
        upload_url = deploy_release.data.upload_url;
        release_url = deploy_release.data.url;
        release_tag_name = deploy_release.data.tag_name;
        release_commitish = deploy_release.data.target_commitish;
        console.log(
          `Update release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} success`
        );
        if (is_verbose) {
          console.log(
            `updateRelease.data = ${JSON.stringify(deploy_release.data)}`
          );
        }
      } catch (error) {
        var msg = `Try to update release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} failed: ${error.message}`;
        msg += `\r\n${error.stack}`;
        console.log(msg);
        action_core.setFailed(msg);
      }
    } else {
      try {
        if (is_verbose) {
          console.log(
            "============================= v3 API: createRelease ============================="
          );
        }
        console.log(
          `Try to create release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo}`
        );
        created_release = await octokit.repos.createRelease({
          owner: action_github.context.repo.owner,
          repo: action_github.context.repo.repo,
          tag_name: release_name,
          target_commitish: action_github.context.sha,
          name: release_name,
          // body: "",
          draft: is_draft,
          prerelease: is_prerelease,
        });
        upload_url = created_release.data.upload_url;
        release_url = created_release.data.url;
        release_tag_name = created_release.data.tag_name;
        release_commitish = created_release.data.target_commitish;
        release_id = created_release.data.id;
        release_name = created_release.data.name;
        console.log(
          `Create release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} success`
        );
        if (is_verbose) {
          console.log(
            `createRelease.data = ${JSON.stringify(created_release.data)}`
          );
        }
      } catch (error) {
        var msg = `Try to create release ${release_name} for ${action_github.context.repo.owner}/${action_github.context.repo.repo} failed: ${error.message}`;
        msg += `\r\n${error.stack}`;
        console.log(msg);
        action_core.setFailed(msg);
      }
    }

    // Collect assets to upload
    {
      const old_asset_map: Map<string, AssetType> = new Map<string, AssetType>();
      const in_delete_rule: Map<string, AssetType> = new Map<string, AssetType>();

      if (is_verbose && delete_files_pattern) {
        console.log(
          `Delete file pattern: ${delete_files_pattern}`
        );
      }

      if (deploy_release && deploy_release.data && deploy_release.data.assets) {
        for (const asset of deploy_release.data.assets) {
          const asset_name_lc = asset.name.toLowerCase();
          old_asset_map.set(asset_name_lc, asset);
          if (delete_files_pattern && micromatch.isMatch(asset.name, delete_files_pattern)) {
            in_delete_rule.set(asset_name_lc, asset);
            pending_to_delete.push(asset);

            if (is_verbose) {
              console.log(
                `Old asset file: ${asset.name} match ${delete_files_pattern}.`
              );
            }
          }
        }
      }

      for (const file_path of upload_files) {
        const file_base_name = path.basename(file_path);
        const file_base_name_lc = file_base_name.toLowerCase();
        if (old_asset_map.has(file_base_name_lc)) {
          if (in_delete_rule.has(file_base_name_lc)) {
            // Already in delete rule, do nothing.
            console.log(
              `Overwrite asset file: ${file_base_name} , because it match ${delete_files_pattern}.`
            );
          } else if (is_overwrite) {
            const asset = old_asset_map.get(file_base_name_lc);
            if (asset) {
              pending_to_delete.push(asset);
            }
            pending_to_upload.push(file_path);

            if (is_verbose) {
              console.log(
                `Overwrite old asset file: ${file_base_name}.`
              );
            }
          } else {
            console.log(
              `Skip asset file: ${file_base_name}, it's already existed.`
            );
          }
        } else {
          pending_to_upload.push(file_path);
        }
      }
    }

    // Delete old assets.
    if (is_verbose && pending_to_delete.length > 0) {
      console.log(
        "============================= v3 API: deleteReleaseAsset ============================="
      );
    }
    for (const asset of pending_to_delete) {
      try {
        // const pick_id = Buffer.from(asset.id, 'base64').toString().match(/\d+$/); // convert id from graphql v4 api to v3 rest api
        console.log(`Deleting old asset: ${asset.name} ...`);
        const delete_rsp = await octokit.repos.deleteReleaseAsset({
          owner: action_github.context.repo.owner,
          repo: action_github.context.repo.repo,
          asset_id: asset.id,
        });
        if (204 == delete_rsp.status) {
          console.log(`Delete old asset: ${asset.name} success`);
        } else {
          console.log(
            `Delete old asset: ${asset.name} => ${delete_rsp.headers.status}`
          );
        }
      } catch (error) {
        const msg = `Delete old asset: ${asset.name} failed => ${error.message}`;
        console.log(msg);
      }
    }

    // Upload new assets
    if (is_verbose && pending_to_upload.length > 0) {
      console.log(
        "============================= v3 API: uploadReleaseAsset ============================="
      );
    }
    for (const file_path of pending_to_upload) {
      const file_stats = fs.statSync(file_path);
      const file_size = (file_stats || {}).size || 0;
      const file_base_name = path.basename(file_path);
      const max_retry_times = 3;
      var failed_error_msg: string | null = null;
      for (var retry_tims = 0; retry_tims <= max_retry_times; ++retry_tims) {
        const retry_msg = 0 === retry_tims ? "" : `(${retry_tims} retry)`;
        try {
          console.log(
            `Start uploading asset${retry_msg}: ${file_path}(size: ${file_size}) ...`
          );
          // Maybe upload failed before, try to remove old incompleted file
          // Only graphql API(v4) can get bad assets
          if (0 !== retry_tims) {
            console.log(
              `============================= v4 API: query { repository (owner:"${action_github.context.repo.owner}", name:"${action_github.context.repo.repo}") } =============================`
            );
            const repo_info_of_release: any = await octokit.graphql(`query {
                            repository (owner:"${action_github.context.repo.owner}", name:"${action_github.context.repo.repo}") { 
                                release (tagName: "${release_tag_name}") {
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
            if (is_verbose) {
              console.log(
                `${retry_msg}v4 API: query = ${JSON.stringify(
                  repo_info_of_release
                )}`
              );
            }
            const assets =
              (
                (((repo_info_of_release || {}).repository || {}).release || {})
                  .releaseAssets || {}
              ).nodes || [];
            for (const asset of assets) {
              if (asset.name == file_base_name) {
                const pick_id = Buffer.from(asset.id, "base64")
                  .toString()
                  .match(/\d+$/); // convert id from graphql v4 api to v3 rest api
                const asset_v3_id = pick_id ? parseInt(pick_id[0]) : 0;
                console.log(
                  `Found old asset ${file_base_name}${retry_msg}: deleting id ${asset_v3_id} ...`
                );

                const delete_rsp = await octokit.repos.deleteReleaseAsset({
                  owner: action_github.context.repo.owner,
                  repo: action_github.context.repo.repo,
                  asset_id: asset_v3_id,
                });
                if (204 == delete_rsp.status) {
                  console.log(
                    `Delete old asset${retry_msg}: ${asset.name} success`
                  );
                } else {
                  console.log(
                    `Delete old asset${retry_msg}: ${asset.name} => ${delete_rsp.headers.status}`
                  );
                }

                break;
              }
            }
          }

          /*
          function readableToString(readable) {
            return new Promise((resolve, reject) => {
              let data = "";
              readable.on("data", function (chunk) {
                data += chunk;
              });
              readable.on("end", function () {
                resolve(data);
              });
              readable.on("error", function (err) {
                reject(err);
              });
            });
          }
          */

          const find_mime = mime.getType(path.extname(file_path));
          const file_data: any = fs.readFileSync(
            file_path
          ); /*await readableToString(
            fs.createReadStream(file_path)
          );*/
          const request_params = {
            owner: action_github.context.repo.owner,
            repo: action_github.context.repo.repo,
            release_id: release_id,
            url: upload_url,
            headers: {
              "content-type": find_mime || "application/octet-stream",
              // "content-length": file_data.length, // file_size,
            },
            name: file_base_name,
            data: file_data,
          };
          if (is_verbose) {
            console.log(
              `${retry_msg}uploadReleaseAsset with length: ${file_data.length}`
            );
          }
          const upload_rsp = await octokit.repos.uploadReleaseAsset(
            request_params
          );

          if (200 != upload_rsp.status - (upload_rsp.status % 100)) {
            const msg = `Upload asset${retry_msg}: ${file_base_name} failed => ${upload_rsp.headers.status}`;
            console.log(msg);
            if (failed_error_msg === null) {
              failed_error_msg = msg;
            }
          } else {
            console.log(`Upload asset${retry_msg}: ${file_base_name} success`);
            retry_tims = max_retry_times; // success and not need to retry
            failed_error_msg = null;
          }

          if (is_verbose) {
            console.log(
              `${retry_msg}uploadReleaseAsset.data = ${JSON.stringify(
                upload_rsp.data
              )}`
            );
          }
        } catch (error) {
          const msg = `Upload asset${retry_msg}: ${file_base_name} failed => ${error.message}\r\n${error.stack}`;
          console.log(msg);
          if (failed_error_msg === null) {
            failed_error_msg = msg;
          }
        }
      }

      if (failed_error_msg !== null) {
        action_core.setFailed(failed_error_msg);
      }
    }

    // Environment sample
    // GITHUB_ACTION=run
    // GITHUB_ACTIONS=true
    // GITHUB_ACTOR=owt5008137
    // GITHUB_BASE_REF=
    // GITHUB_EVENT_NAME=push
    // GITHUB_EVENT_PATH=/home/runner/work/_temp/_github_workflow/event.json
    // GITHUB_HEAD_REF=
    // GITHUB_REF=refs/heads/master
    // GITHUB_REPOSITORY=xresloader/upload-to-github-release-test
    // GITHUB_SHA=d3e5b42d6fdf7bfab40c5d6d7d51491d0287780f
    // GITHUB_WORKFLOW=main
    // GITHUB_WORKSPACE=/home/runner/work/upload-to-github-release-test/upload-to-github-release-test
    // set output
    action_core.setOutput("release_id", release_id);
    action_core.setOutput("release_name", release_name);
    action_core.setOutput("release_url", release_url);
    action_core.setOutput("release_tag_name", release_tag_name);
    action_core.setOutput("release_commitish", release_commitish);
  } catch (error) {
    action_core.setFailed(error.message + "\r\n" + error.stack);
  }
}

run();
