---
name: publish-your-pi-package
description: Want to publish your own Pi package but not sure where to start? Guide users from their first package.json through versioning, browser-authenticated npm publishing, and post-release checks for Pi extensions, skills, themes, and prompts. Use when they need to create, update, publish, or inspect a Pi package and its npm downloads.
---

# Publish your Pi package

Turn a Pi package idea into a confident npm release. Follow the selected workflow exactly.

## First response: choose the workflow

Before inspecting files, running npm commands, or proposing a release command, ask **only**:

> Which operation do you want to perform?
> 1. I do not have a package yet and want to create one.
> 2. Update an existing package.
> 3. Inspect a published package.

Wait for the user's selection. If the selection is unclear, ask them to choose one of the three numbered options.

```text
User selection
|- 1 -> New package workflow
|- 2 -> Existing package update workflow
`- 3 -> Published package inspection workflow
```

## Shared rules

- A Pi package is an ordinary npm package. To be discoverable in the Pi package gallery, `package.json` **must** contain `"pi-package"` in `keywords`.
- Select exactly one resource type for a single-resource package: `extension`, `skill`, `theme`, or `prompt`.
- Prefer Pi's conventional resource directories. An explicit `pi` manifest is only needed when resources are outside those conventional locations or need filtering.
- `npm login` and `npm publish` may pause for Enter and open a browser for npm authentication. **Never execute either command for the user.** Print the exact command in a fenced shell block and say: "Run this command manually in your own terminal, complete browser authentication, then send me the result."
- For npm publication, use the official npm registry suffix `--registry=https://registry.npmjs.org/` on both `npm login` and `npm publish`. At the point of login or publication, ask whether the user can access it. If they require a mirror/private registry, ask for its full URL and replace the official suffix in both commands. Do not assume a mirror URL and do not claim that a read-only mirror accepts publishing.
- Commands that only inspect, validate, edit, test, or pack files can be run normally after explaining their result.

## 1. New package workflow

### 1.1 Account prerequisites

First tell the user to complete these prerequisites before publishing:

1. Register an npm account at <https://www.npmjs.com/>.
2. Enable npm two-factor authentication (2FA), with authorization required for package writes, in the npm account settings.
3. Decide the public package name. Verify its availability with `npm view <package-name> version`; an npm 404 means it is available.

Ask for the package name and which resource type they are creating: `extension`, `skill`, `theme`, or `prompt`.

### 1.2 Create the correct package shape

Create `package.json` with an initial `0.1.0` version, a clear description, license, and the mandatory gallery keyword. The `description` value must put the English original first, followed by ` / ` and its Chinese translation. Include the selected resource directory and `README_zh.md` in `files`.

```json
{
  "name": "<package-name>",
  "version": "0.1.0",
  "description": "<English description> / <Chinese translation>",
  "keywords": ["pi-package", "pi", "<extension|skill|theme|prompt>"],
  "license": "MIT",
  "files": ["<resource-directory>", "README_zh.md"]
}
```

Create an English-only `README.md`. At its top, add a link to the Chinese translation: `[Chinese](README_zh.md)`. Create `README_zh.md` as the complete Chinese translation of `README.md`, with no additional or divergent content, and add a reciprocal `[English](README.md)` link at its top.

Use this mapping and explain it to the user:

| Type | Conventional path | Required resource shape |
|---|---|---|
| `extension` | `extensions/` | A `.ts` or `.js` Pi extension module |
| `skill` | `skills/<skill-name>/SKILL.md` | `SKILL.md` starts with valid Agent Skills frontmatter containing `name` and `description` |
| `theme` | `themes/<theme-name>.json` | A Pi theme JSON file; its `name` matches the filename and is not `system` |
| `prompt` | `prompts/<prompt-name>.md` | A Markdown prompt template; the filename becomes its `/` command |

The conventional directory layout is sufficient:

```text
<package-name>/
|- package.json
|- README.md
|- README_zh.md
`- <resource-directory>/
```

When resources live elsewhere, add an explicit manifest instead of relying on conventional discovery:

```json
{
  "pi": {
    "extensions": ["./src/extension.ts"],
    "skills": ["./resources/skills"],
    "prompts": ["./resources/prompts/*.md"],
    "themes": ["./resources/themes/*.json"]
  }
}
```

For extensions, place imported runtime dependencies in `dependencies`. Declare Pi-provided modules (`@earendil-works/pi-ai`, `@earendil-works/pi-agent-core`, `@earendil-works/pi-coding-agent`, `@earendil-works/pi-tui`, and `typebox`) under `peerDependencies` with version `"*"`, never under `dependencies`.

### 1.3 Validate before release

After the resource is implemented, run and report these checks:

```sh
npm pack --dry-run
pi install ./
```

Confirm the dry-run tarball includes `package.json`, `README.md`, `README_zh.md`, and exactly the intended resource files, without source secrets or unrelated files. Confirm the `README.md` <-> `README_zh.md` links work and Pi discovers the resource after the local install.

### 1.4 Give manual publish commands

Ask: "Can you access the official npm registry at https://registry.npmjs.org/? If not, provide the full URL of a registry that supports both authentication and publishing."

If the official npm registry is usable, provide exactly:

```sh
npm login --registry=https://registry.npmjs.org/
npm publish --access public --registry=https://registry.npmjs.org/
```

If the user provides `<registry-url>`, replace the official registry URL in both commands and provide exactly:

```sh
npm login --registry=<registry-url>
npm publish --access public --registry=<registry-url>
```

State that the user must execute each command manually, press Enter when prompted, complete browser authentication, and return the terminal output. After a successful publish, verify with:

```sh
npm view <package-name> version
pi install npm:<package-name>
```

## 2. Existing package update workflow

Ask for the package directory and the intended change. Inspect `package.json`, the selected resource files, and the currently published version:

```sh
npm view <package-name> version
npm view <package-name> dist-tags --json
```

Explain the version choice before changing it:

| Change | Version command |
|---|---|
| Backward-compatible bug fix | `npm version patch` |
| Backward-compatible feature | `npm version minor` |
| Breaking resource/API/configuration change | `npm version major` |
| Prerelease | `npm version prerelease --preid=<identifier>` |

Check that `npm version` will not overwrite uncommitted changes, then run the user-selected version command. If the repository does not use Git, edit `package.json`'s `version` explicitly and verify the new value. Do not publish a version that is already present on npm.

Then:

```sh
npm pack --dry-run
```

Review the tarball contents, changelog/README accuracy, the bilingual `description`, the `README.md` <-> `README_zh.md` links, package `keywords` (including `pi-package`), and all resource paths before release. Ask about registry connectivity and give **only manual** login/publish commands using the command rules in section 1.4. For a prerelease, include the requested distribution tag:

```sh
npm publish --access public --tag=<tag> --registry=https://registry.npmjs.org/
```

If the user supplied `<registry-url>`, replace `https://registry.npmjs.org/` with that URL. After the user reports success, query npm for the new version and relevant dist-tags.

## 3. Published package inspection workflow

Ask for the npm package name. Query and clearly summarize these data:

```sh
npm view <package-name> --json
npm view <package-name> version
npm view <package-name> versions --json
npm view <package-name> dist-tags --json
npm view <package-name> time --json
```

Report the latest version, all dist-tags, publication timestamps, maintainers, repository/homepage, license, and Pi relevance (`pi-package` keyword plus any `pi` manifest/resource metadata).

For cumulative historical downloads, run the script bundled with this skill. Paths in a skill are relative to the skill directory:

```sh
node scripts/npm-downloads.mjs <package-name>
```

The bundled script has no npm dependencies. It queries npm's downloads API from 2015-01-10 through yesterday and prints the total historical downloads. Show the exact result. If the npm metadata or download query fails, report the command's error output directly and ask the user how they want to proceed; do not invent availability or download figures.
