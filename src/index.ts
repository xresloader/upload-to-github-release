import * as action_core from "@actions/core";
import * as action_github from "@actions/github";
import { globby } from "globby";
import micromatch from 'micromatch';
import * as path from "path";
import * as fs from "fs";
import * as mime from "mime";
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

function getInputAsBool(name: string, default_value: boolean = false): boolean {
  const res = env(action_core.getInput(name) || "").toLowerCase();
  if (!res) {
    return default_value;
  }

  return (
    res != "false" &&
    res != "disabled" &&
    res != "0" &&
    res != "no" &&
    res != "disable"
  );
}

function isInputEmpty(name: string): boolean {
  const res = env(action_core.getInput(name) || "").toLowerCase();
  return res.trim().length == 0;
}

function getInputAsString(name: string): string {
  return env(action_core.getInput(name) || "").trim();
}

function getInputAsInteger(name: string): number {
  try {
    const str_val = getInputAsString(name);
    if (!str_val) {
      return 0;
    }
    return Number.parseInt(str_val);
  } catch (_) {
    return 0;
  }
}

export { getInputAsArray, getInputAsBool, getInputAsString };

async function run() {
  try {
    const github_token = (process.env["GITHUB_TOKEN"] || getInputAsString("token") || "").trim();
    const upload_files_pattern = getInputAsArray("file").map((path: string) => {
      return path.replaceAll('\\', '/');
    });
    const delete_files_pattern = getInputAsArray("delete_file");
    const is_overwrite = getInputAsBool("overwrite");
    let is_draft = getInputAsBool("draft", true);
    let is_prerelease = getInputAsBool("prerelease");
    const with_tags = getInputAsBool("tags");
    const with_branches = getInputAsArray("branches");
    const is_verbose = getInputAsBool("verbose");
    const custom_tag_name = getInputAsString("tag_name");
    const update_latest_release = getInputAsBool("update_latest_release");
    var release_id = getInputAsInteger("release_id");
    var target_owner = getInputAsString("target_owner");
    let target_repo = getInputAsString("target_repo");
    let release_name = getInputAsString("default_release_name");
    let default_release_body = getInputAsString("default_release_body");
    let update_release_body = getInputAsString("update_release_body");
    const update_release_body_append = getInputAsBool("update_release_body_append");
    const find_draft_release_count = getInputAsInteger("find_draft_release_count") || 32;

    if (typeof github_token != "string") {
      action_core.setFailed("token is invalid");
      return;
    }

    if (!github_token) {
      action_core.setFailed("GITHUB_TOKEN is required to upload files");
      return;
    }

    if (!default_release_body) {
      const release_body_path = getInputAsString("default_release_body");
      if (release_body_path) {
        default_release_body = fs.readFileSync(release_body_path, { encoding: "utf8" });
      }
    }
    if (!update_release_body) {
      const release_body_path = getInputAsString("update_release_body_path");
      if (release_body_path) {
        update_release_body = fs.readFileSync(release_body_path, { encoding: "utf8" });
      }
    }

    if (!target_owner) {
      target_owner = action_github.context.repo.owner;
    }
    if (!target_repo) {
      target_repo = action_github.context.repo.repo;
    }

    // action_github.context.eventName = push
    // action_github.context.sha = ae7dc58d20ad51b3c8c37deca1bc07f3ae8526cd
    // context.ref = refs/heads/BRANCH_NAME  or refs/tags/TAG_NAME
    // action_github.context.ref = refs/heads/master
    // action_github.context.action = xresloaderupload-to-github-release
    // action_github.context.actor = owt5008137
    // action_github.context.repo.repo = upload-to-github-release-test
    // action_github.context.repo.owner = xresloader

    let release_tag_name = "Release-" + action_github.context.sha.substring(0, 8);
    if (custom_tag_name) {
      release_tag_name = custom_tag_name;
    } else if ((with_branches && with_branches.length > 0) || with_tags) {
      // check branches or tags
      let match_filter = false;
      if (with_tags) {
        const match_tag = action_github.context.ref.match(/refs\/tags\/(.*)/);
        if (match_tag) {
          match_filter = true;
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
              match_branch[1] + "-" + action_github.context.sha.substring(0, 8);
            console.log(`Found branch push: ${match_branch[1]}, we will use tag name ${release_tag_name}.`);
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
          match_branch[1] + "-" + action_github.context.sha.substring(0, 8);
      }
    }
    if (!release_name) {
      release_name = release_tag_name;
    }

    const upload_files: string[] = [];
    for (const upload_pattern of upload_files_pattern) {
      const select_files = await globby(upload_pattern, { absolute: true, onlyFiles: true });
      if (!select_files) {
        console.warn(`Can not find any file by file pattern ${upload_pattern}.`);
        continue;
      }
      for (const upload_file of select_files) {
        upload_files.push(upload_file);
      }
    }

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
                repository (owner:"${target_owner}", name:"${target_repo}") { 
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
      typeof octokit.rest.repos.listReleases
    >;
    let deploy_release: {
      data: ValueOf<ValueOf<FakeListReleaseReponse, "data">, 0>;
      status: ValueOf<FakeListReleaseReponse, "status">;
      headers: ValueOf<FakeListReleaseReponse, "headers">;
    } | undefined = undefined;

    if (update_latest_release) {
      console.log(
        `Try to get latest release from ${target_owner}/${target_repo}`
      );
      deploy_release = await octokit.rest.repos.getLatestRelease({
        owner: target_owner,
        repo: target_repo,
      }).catch((error) => {
        console.log(
          `Try to get latest release from ${target_owner}/${target_repo} : ${error.message}`
        );

        return undefined;
      });

      if (deploy_release) {
        if (is_verbose) {
          console.log(
            `getLatestRelease and the target release = ${JSON.stringify(deploy_release.data)}`
          );
        }
      } else if (is_verbose) {
        console.log(`Call getLatestRelease but not found`);
      }
    }

    if (release_id != 0 && !(deploy_release && deploy_release.data)) {
      console.log(
        `Try to get release by id ${release_id} from ${target_owner}/${target_repo}`
      );
      const release_content_by_id = await octokit.rest.repos.getRelease({
        owner: target_owner,
        repo: target_repo,
        release_id: release_id,
      }).catch((error) => {
        const message = `Try to get release by id ${release_id} from ${target_owner}/${target_repo} : ${error.message}`;
        console.error(message);
        action_core.setFailed(message);
      });

      if (release_content_by_id) {
        deploy_release = release_content_by_id;

        if (is_verbose) {
          console.log(
            `getRelease and the target release = ${JSON.stringify(release_content_by_id.data)}`
          );
        }
      } else if (is_verbose) {
        console.log(`Call getRelease but not found`);
      }
    }

    if (!(deploy_release && deploy_release.data)) {
      console.log(
        `Try to get release by tag ${release_tag_name} from ${target_owner}/${target_repo}`
      );

      const release_context_by_tag = await octokit.rest.repos.getReleaseByTag({
        owner: target_owner,
        repo: target_repo,
        tag: release_tag_name,
      }).catch((error) => {
        console.log(
          `Try to get release by tag ${release_tag_name} from ${target_owner}/${target_repo} : ${error.message}`
        );
      });

      if (release_context_by_tag) {
        deploy_release = release_context_by_tag;
        if (is_verbose) {
          console.log(
            `getReleaseByTag and the target release = ${JSON.stringify(release_context_by_tag.data)}`
          );
        }
      } else if (is_verbose) {
        console.log(`Call getReleaseByTag but not found`);
      }
    }

    // We can not get a draft release by getReleaseByTag, so we try to find the draft release with the same name by
    if (!(deploy_release && deploy_release.data)) {
      let try_draft_release: typeof deploy_release;
      console.log(
        `Try to get draft release name ${release_name} or tag name ${release_tag_name} from ${target_owner}/${target_repo}`
      );
      try_draft_release = await octokit.rest.repos.listReleases({
        owner: target_owner,
        repo: target_repo,
        page: 1,
        per_page: find_draft_release_count,
      }).then((rsp) => {
        for (const release of rsp.data || []) {
          if (
            release.name == release_name ||
            release.tag_name == release_tag_name
          ) {
            return {
              data: release,
              status: rsp.status,
              headers: rsp.headers,
            };
          }
        }

        return undefined;
      }).catch((error) => {
        console.log(
          `Try to get draft release name ${release_name} or tag name ${release_tag_name} from ${target_owner}/${target_repo} : ${error.message}`
        );

        return undefined;
      });

      if (try_draft_release && try_draft_release.headers) {
        deploy_release = try_draft_release;
        console.log(
          `Get release ${release_tag_name} from ${target_owner}/${target_repo} : ${deploy_release.headers.status || ("HTTP Code: " + deploy_release.status)}`
        );
        if (is_verbose) {
          console.log(
            `listReleases and the target release = ${JSON.stringify(try_draft_release.data)}`
          );
        }
      } else if (is_verbose) {
        console.log(`Call listReleases but no matched release`);
      }
    }

    if (deploy_release && deploy_release.data) {
      release_tag_name = deploy_release.data.tag_name;
      if (deploy_release.data.name) {
        release_name = deploy_release.data.name;
      }
      if (isInputEmpty("draft")) {
        is_draft = deploy_release.data.draft;
      }
      if (isInputEmpty("prerelease")) {
        is_prerelease = deploy_release.data.prerelease;
      }
    }

    type AssertArrayType =
      | ValueOf<ValueOf<ValueOf<FakeListReleaseReponse, "data">, 0>, "assets">
      | ValueOf<
        ValueOf<
          AsyncReturnType<typeof octokit.rest.repos.getReleaseByTag>,
          "data"
        >,
        "assets"
      >
      | ValueOf<
        ValueOf<AsyncReturnType<typeof octokit.rest.repos.updateRelease>, "data">,
        "assets"
      >
      | ValueOf<
        ValueOf<
          AsyncReturnType<typeof octokit.rest.repos.getLatestRelease>,
          "data"
        >,
        "assets"
      >;
    type AssetType = ValueOf<AssertArrayType, 0>;
    const pending_to_delete: AssertArrayType = [];
    const pending_to_upload: string[] = [];
    let upload_url = "";
    let release_url = "";
    let release_commitish = "";
    if (deploy_release && deploy_release.data) {
      upload_url = deploy_release.data.upload_url;
      release_url = deploy_release.data.url;
      release_commitish = deploy_release.data.target_commitish;
      if (deploy_release.data.name) {
        release_name = deploy_release.data.name;
      }
      release_id = deploy_release.data.id;
    }
    // https://developer.github.com/v3/repos/releases/#create-a-release
    if (deploy_release && deploy_release.data) {
      if (is_verbose) {
        console.log(
          "============================= v3 API: updateRelease ============================="
        );
      }
      console.log(
        `Try to update release ${release_name} for ${target_owner}/${target_repo}`
      );
      let deploy_release_body;
      if (update_release_body) {
        if (update_release_body_append && deploy_release.data.body) {
          deploy_release_body = deploy_release.data.body.toString() + update_release_body;
        } else {
          deploy_release_body = update_release_body;
        }
      } else {
        deploy_release_body = deploy_release.data.body || undefined;
      }
      const update_rsp = await octokit.rest.repos.updateRelease({
        owner: target_owner,
        repo: target_repo,
        release_id: release_id,
        tag_name: release_tag_name,
        target_commitish: action_github.context.sha,
        name: release_name,
        body: deploy_release_body,
        draft: is_draft,
        prerelease: is_prerelease,
      }).catch((error) => {
        let msg = `Try to update release ${release_name} for ${target_owner}/${target_repo} failed: ${error.message}`;
        msg += `\r\n${error.stack}`;
        console.log(msg);
        action_core.setFailed(msg);
      });
      if (update_rsp && update_rsp.data) {
        deploy_release = update_rsp;
        release_id = deploy_release.data.id;
        release_name = deploy_release.data.name || "";
        upload_url = deploy_release.data.upload_url;
        release_url = deploy_release.data.url;
        release_tag_name = deploy_release.data.tag_name;
        release_commitish = deploy_release.data.target_commitish;
        console.log(
          `Update release ${release_name} for ${target_owner}/${target_repo} success`
        );
        if (is_verbose) {
          console.log(
            `updateRelease.data = ${JSON.stringify(deploy_release.data)}`
          );
        }
      }
    } else {
      if (is_verbose) {
        console.log(
          "============================= v3 API: createRelease ============================="
        );
      }
      console.log(
        `Try to create release ${release_name} for ${target_owner}/${target_repo}`
      );
      await octokit.rest.repos.createRelease({
        owner: target_owner,
        repo: target_repo,
        tag_name: release_tag_name,
        target_commitish: action_github.context.sha,
        name: release_name,
        body: default_release_body || update_release_body || undefined,
        draft: is_draft,
        prerelease: is_prerelease,
      }).then((created_release) => {
        upload_url = created_release.data.upload_url;
        release_url = created_release.data.url;
        release_tag_name = created_release.data.tag_name;
        release_commitish = created_release.data.target_commitish;
        release_id = created_release.data.id;
        release_name = created_release.data.name || "";
        console.log(
          `Create release ${release_name} for ${target_owner}/${target_repo} success`
        );
        if (is_verbose) {
          console.log(
            `createRelease.data = ${JSON.stringify(created_release.data)}`
          );
        }
      }).catch((error) => {
        let msg = `Try to create release ${release_name} for ${target_owner}/${target_repo} failed: ${error.message}`;
        msg += `\r\n${error.stack}`;
        console.log(msg);
        action_core.setFailed(msg);
      });
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
      // const pick_id = Buffer.from(asset.id, 'base64').toString().match(/\d+$/); // convert id from graphql v4 api to v3 rest api
      console.log(`Deleting old asset: ${asset.name} ...`);
      await octokit.rest.repos.deleteReleaseAsset({
        owner: target_owner,
        repo: target_repo,
        asset_id: asset.id,
      }).then((delete_rsp) => {
        if (204 == delete_rsp.status) {
          console.log(`Delete old asset: ${asset.name} success`);
        } else {
          console.log(
            `Delete old asset: ${asset.name} => ${delete_rsp.headers.status}`
          );
        }
      }).catch((error) => {
        const msg = `Delete old asset: ${asset.name} failed => ${error.message}`;
        console.log(msg);
      });
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
      if (file_size <= 0) {
        console.log(
          `Ignore uploading asset ${file_path}(size: ${file_size}).`
        );
        continue;
      }
      let failed_error_msg: string | null = null;
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
              `============================= v4 API: query { repository (owner:"${target_owner}", name:"${target_repo}") } =============================`
            );
            const repo_info_of_release: any = await octokit.graphql(`query {
                            repository (owner:"${target_owner}", name:"${target_repo}") { 
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

                const delete_rsp = await octokit.rest.repos.deleteReleaseAsset({
                  owner: target_owner,
                  repo: target_repo,
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

          const find_mime = mime.default.getType(path.extname(file_path));
          const file_length = fs.statSync(file_path).size;
          const file_data: any = fs.readFileSync(
            file_path
          ); /* await readableToString(
            fs.createReadStream(file_path)
          );*/
          const request_params = {
            owner: target_owner,
            repo: target_repo,
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
              `${retry_msg}uploadReleaseAsset with length: ${file_length}`
            );
          }
          const upload_rsp = await octokit.rest.repos.uploadReleaseAsset(
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
          let msg;
          if (error instanceof Error) {
            msg = `Upload asset${retry_msg}: ${file_base_name} failed => ${error.message}\r\n${error.stack}`;
          } else {
            msg = `Upload asset${retry_msg}: ${file_base_name} failed => ${error}`;
          }
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
    // GITHUB_ACTOR=owent
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
    if (error instanceof Error) {
      action_core.setFailed(error.message + "\r\n" + error.stack);
    } else {
      action_core.setFailed(`Unknown error ${error}`);
    }
  }
}

run();
