# publish-your-pi-package

[Chinese](README_zh.md)

Want to publish your own Pi package but not sure where to start?
`publish-your-pi-package` takes you from your first `package.json` through
versioning, browser-authenticated npm publishing, and post-release checks for
extensions, skills, themes, and prompts.

## Install

```sh
pi install npm:publish-your-pi-package
```

For local development:

```sh
pi install ./
```

Restart Pi or run `/reload`, then invoke the skill explicitly with:

```text
/skill:publish-your-pi-package
```

## Package contents

```text
skills/publish-your-pi-package/
|- SKILL.md
`- scripts/npm-downloads.mjs
```

The package declares the `pi-package` keyword so it is eligible for Pi's npm
package gallery.

## Publish this package

Validate the tarball first:

```sh
npm pack --dry-run
```

Then manually run the browser-authenticated commands shown by the skill.
