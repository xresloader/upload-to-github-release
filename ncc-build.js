const path = require("path");
const fs = require("fs");
const ncc = require("@vercel/ncc");

ncc(path.join(__dirname, "src", "index.ts"), {
  // provide a custom cache path or disable caching
  cache: false,
  // externals to leave as requires of the build
  externals: [],
  // directory outside of which never to emit assets
  filterAssetBase: process.cwd(), // default
  minify: false, // default
  sourceMap: true, // default
  sourceMapBasePrefix: "", // default treats sources as output-relative
  // when outputting a sourcemap, automatically include
  // source-map-support in the output file (increases output by 32kB).
  sourceMapRegister: false, // default
  watch: false, // default
  v8cache: false, // default
  quiet: false, // default
  debugLog: false, // default
}).then(({ code, map, assets }) => {
  const output_dir = path.join(__dirname, "lib");
  fs.mkdir(
    output_dir,
    {
      recursive: true,
      mode: 0o777,
    },
    (err) => {
      if (err) {
        console.error(err.toString());
        return;
      }

      fs.writeFile(
        path.join(output_dir, "index.js"),
        code,
        {
          encoding: "utf8",
          mode: 0o777,
        },
        (err) => {
          if (err) {
            console.error(err.toString());
          } else {
            console.log("Written to " + path.join(output_dir, "index.js"));
          }
        }
      );

      if (map) {
        fs.writeFile(
          path.join(output_dir, "index.js.map"),
          code,
          {
            encoding: "utf8",
            mode: 0o777,
          },
          (err) => {
            if (err) {
              console.error(err.toString());
            } else {
              console.log(
                "Written to " + path.join(output_dir, "index.js.map")
              );
            }
          }
        );
      }
    }
  );
  // Assets is an object of asset file names to { source, permissions, symlinks }
  // expected relative to the output code (if any)
});
