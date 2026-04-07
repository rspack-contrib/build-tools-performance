# Common Steps for Rsdoctor Installation

This document contains common steps that apply to both Rspack and Webpack projects.

## Step 3: Locate the rsdoctor-data.json

First, check whether `rsdoctor-data.json` already exists in the build output (artifacts) directory. Common locations include:

- `dist/rsdoctor-data.json` (most common)
- `output/rsdoctor-data.json`
- `static/rsdoctor-data.json`
- `.rsdoctor/rsdoctor-data.json` (if using custom reportDir)

If you cannot find the file, ask the user to provide the path to `rsdoctor-data.json`. If the file truly does not exist, they will need to run a build with `RSDOCTOR=true` to generate it.

The file is typically generated in the same directory as your build output (e.g., `dist`, `output`, `static`). You can configure a custom output directory using the `output.reportDir` option:

```js
// Example for Rspack: use RsdoctorRspackPlugin
// Example for Webpack: use RsdoctorWebpackPlugin
new RsdoctorRspackPlugin({
  // or RsdoctorWebpackPlugin
  disableClientServer: true,
  output: {
    mode: 'brief',
    options: {
      type: ['json'],
    },
    reportDir: './dist', // Custom output directory (defaults to build output directory)
  },
});
```

---

## Step 4: Use JSON file for analysis

Once you have the `rsdoctor-data.json` file, you can use it for analysis. This JSON file contains all the build analysis data and can be used without starting the Rsdoctor server.

**Example usage:**

**Note:** Use the new command format `<group> <subcommand>`, not the old format `<group>:<subcommand>`.

```bash
# Analyze chunks using JSON file (calls listChunks() function)
node scripts/rsdoctor.js chunks list --data-file ./dist/rsdoctor-data.json

# Analyze packages using JSON file (calls listPackages() function)
node scripts/rsdoctor.js packages list --data-file ./dist/rsdoctor-data.json

# Analyze specific module (calls getModuleByPath() function)
node scripts/rsdoctor.js modules by-path --path "src/index.tsx" --data-file ./dist/rsdoctor-data.json

# Find large chunks (calls findLargeChunks() function, finds chunks >30% over median and >= 1MB)
node scripts/rsdoctor.js chunks large --data-file ./dist/rsdoctor-data.json

# Optimize bundle (calls optimizeBundle() function)
node scripts/rsdoctor.js bundle optimize --data-file ./dist/rsdoctor-data.json
```

**Command format:**

- New format: `<group> <subcommand>` (e.g., `chunks list`, `bundle optimize`)
- Old format (deprecated): `<group>:<subcommand>` (e.g., `chunks:list`, `bundle:optimize`)
- Script path: `scripts/rsdoctor.js` (built file)

**Benefits of JSON Mode:**

- ✅ No need to keep the build process running
- ✅ Works in CI/CD environments
- ✅ Can be shared and version controlled
- ✅ Faster analysis for large projects
- ✅ No server connection required

:::tip
The JSON file contains all the build analysis data, so it can be quite large for complex projects. Make sure to add it to `.gitignore` if you don't want to commit it to your repository.
:::
