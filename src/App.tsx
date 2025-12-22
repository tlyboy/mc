import { useEffect, useState } from 'react'
import Default from './layouts/default'

interface Config {
  serverAddress: string
  serverPort: number
  github: string
  downloads: {
    name: string
    file: string
  }[]
}

interface ServerStatus {
  online: boolean
  serverName?: string
  version?: string
  players?: {
    online: number
    max: number
  }
  playerNames?: string[]
}

function App() {
  const [config, setConfig] = useState<Config | null>(null)
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<ServerStatus | null>(null)

  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json())
      .then(setConfig)
  }, [])

  useEffect(() => {
    if (!config) return

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `https://api.mcsrvstat.us/3/${config.serverAddress}:${config.serverPort}`,
        )
        const data = await res.json()
        const playerNames = [
          ...(data.players?.list?.map((p: { name: string }) => p.name) ?? []),
          ...(data.info?.clean ?? []),
        ]
        setStatus({
          online: data.online ?? false,
          serverName: data.motd?.clean?.[0],
          version: data.version,
          players: data.players,
          playerNames: playerNames.length > 0 ? playerNames : undefined,
        })
      } catch {
        setStatus({ online: false })
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 60000)
    return () => clearInterval(interval)
  }, [config])

  useEffect(() => {
    const defaultTitle = document.title
    return () => {
      document.title = defaultTitle
    }
  }, [])

  useEffect(() => {
    if (status?.online && status.serverName) {
      document.title = status.serverName
    }
  }, [status?.online, status?.serverName])

  const copyToClipboard = async () => {
    if (!config) return
    try {
      await navigator.clipboard.writeText(config.serverAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = config.serverAddress
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!config) return null

  return (
    <Default github={config.github}>
      {/* 背景图 */}
      <img
        src="/img/background.jpeg"
        alt="background"
        className="fixed inset-0 h-full w-full object-cover"
      />

      {/* 半透明遮罩 */}
      <div className="fixed inset-0 bg-black/50" />

      {/* 主要内容 */}
      <div className="relative z-10 min-h-full overflow-y-auto px-4 py-16 md:flex md:items-center md:justify-center md:py-8">
        <div className="mx-auto max-w-2xl text-center text-white">
          {/* 服务器名称 */}
          <h1 className="mb-2 text-3xl font-bold tracking-wide sm:text-5xl md:text-6xl">
            {status === null
              ? '...'
              : status.online
                ? status.serverName
                : '服务器离线'}
          </h1>

          {/* 版本信息 */}
          {status?.online && status.version && (
            <p className="mb-4 text-xl text-white/80">
              Minecraft {status.version}
            </p>
          )}

          {/* 在线状态 */}
          <div className="mb-2 inline-flex items-center gap-2 rounded-full px-4 py-2">
            {status === null ? (
              <span className="text-white/60">检测中...</span>
            ) : status.online ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-green-400">
                  在线 {status.players?.online ?? 0}/{status.players?.max ?? 0}
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-red-400">离线</span>
              </>
            )}
          </div>

          {/* 在线玩家列表 */}
          {status?.online &&
            status.playerNames &&
            status.playerNames.length > 0 && (
              <div className="mb-8">
                <p className="mb-2 text-sm text-white/60">当前玩家</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {status.playerNames.map((name) => (
                    <span
                      key={name}
                      className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* 无玩家时的间距 */}
          {(!status?.online ||
            !status.playerNames ||
            status.playerNames.length === 0) && <div className="mb-6" />}

          {/* 服务器地址 */}
          <div className="mb-8">
            <p className="mb-2 text-sm text-white/60">服务器地址</p>
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <code className="font-mono text-lg">{config.serverAddress}</code>
              <button
                onClick={copyToClipboard}
                className="btn-copy"
                title="复制地址"
              >
                <span
                  className={
                    copied
                      ? 'i-carbon-checkmark text-green-400'
                      : 'i-carbon-copy'
                  }
                />
              </button>
            </div>
            {copied && (
              <p className="mt-2 text-sm text-green-400">已复制到剪贴板!</p>
            )}
          </div>

          {/* 下载按钮 */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
            {config.downloads.map((download) => (
              <a
                key={download.file}
                href={download.file}
                download
                className="btn whitespace-nowrap px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-base"
              >
                <span className="i-carbon-download text-lg sm:text-xl" />
                <span>{download.name}</span>
              </a>
            ))}
          </div>

          {/* 使用说明 */}
          <div className="mt-8 rounded-xl border border-white/20 bg-black/30 p-4 text-left backdrop-blur-sm sm:mt-12 sm:p-6">
            <h2 className="mb-3 text-center text-base font-semibold sm:mb-4 sm:text-lg">
              如何加入服务器
            </h2>
            <ol className="space-y-2 text-xs text-white/80 sm:space-y-3 sm:text-sm">
              <li className="flex gap-2 sm:gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
                  1
                </span>
                <span>
                  下载上方的<strong className="text-white">启动器</strong>和
                  <strong className="text-white">整合包</strong>
                </span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
                  2
                </span>
                <span>
                  打开启动器，导入整合包（
                  <code className="rounded bg-white/10 px-1">.mrpack</code>{' '}
                  文件）
                </span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
                  3
                </span>
                <span>启动游戏，等待加载完成</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
                  4
                </span>
                <span>
                  点击<strong className="text-white">多人游戏</strong> →{' '}
                  <strong className="text-white">添加服务器</strong>
                </span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
                  5
                </span>
                <span>
                  输入服务器地址{' '}
                  <code className="rounded bg-white/10 px-1">
                    {config.serverAddress}
                  </code>{' '}
                  并保存
                </span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
                  6
                </span>
                <span>双击服务器即可加入游戏！</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Default>
  )
}

export default App
