# mc-web

Minecraft 服务器宣传页面

## 开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
pnpm preview
```

## 配置

需要在 `public/` 目录下创建以下文件：

### `public/config.json`

```json
{
  "serverName": "服务器名称",
  "serverAddress": "服务器地址",
  "serverPort": 25565,
  "version": "1.20.1",
  "github": "https://github.com/xxx/xxx",
  "downloads": [
    {
      "name": "启动器",
      "file": "/upload/launcher.exe"
    },
    {
      "name": "整合包",
      "file": "/upload/modpack.mrpack"
    }
  ]
}
```

服务器在线状态通过 [mcsrvstat.us](https://api.mcsrvstat.us) API 自动检测。

### `public/img/`

- `background.jpeg` - 背景图片

### `public/upload/`

放置下载文件
