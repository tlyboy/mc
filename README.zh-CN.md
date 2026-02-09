# mc

🎮 Minecraft 服务器宣传页面

## 安装

```bash
git clone https://github.com/tlyboy/mc.git
```

## 使用说明

```bash
pnpm install
pnpm dev
pnpm build
```

### 配置

需要在 `public/` 目录下创建以下文件：

#### `public/config.json`

```json
{
  "serverAddress": "服务器地址",
  "serverPort": 25565,
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

服务器名称、版本、在线状态、玩家列表通过 [mcsrvstat.us](https://api.mcsrvstat.us) API 自动获取。

#### `public/img/`

- `background.jpeg` - 背景图片

#### `public/upload/`

放置下载文件

## 使用许可

[MIT](https://opensource.org/licenses/MIT) © Guany
