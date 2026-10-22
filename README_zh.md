# publish-your-pi-package

[English](README.md)

想发布自己的 Pi package 但不知道如何开始？
`publish-your-pi-package` 会带你完成从第一个 `package.json`、版本管理，到
需要浏览器认证的 npm 发布和发布后检查的全过程，适用于 extension、skill、theme
和 prompt。

## 安装

```sh
pi install npm:publish-your-pi-package
```

用于本地开发：

```sh
pi install ./
```

重启 Pi 或运行 `/reload`，然后使用以下命令显式调用该 skill：

```text
/skill:publish-your-pi-package
```

## 包内容

```text
skills/publish-your-pi-package/
|- SKILL.md
`- scripts/npm-downloads.mjs
```

该 package 声明了 `pi-package` keyword，因此有资格被 Pi 的 npm package
gallery 发现。

## 发布这个包

先验证 tarball：

```sh
npm pack --dry-run
```

然后手动运行该 skill 给出的需要浏览器认证的命令。
