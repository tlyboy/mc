import { useEffect, useState } from 'react'
import Default from './layouts/default'

interface Config {
  serverName: string
  serverAddress: string
  serverPort: number
  version: string
  github: string
  downloads: {
    name: string
    file: string
  }[]
}

function App() {
  const [config, setConfig] = useState<Config | null>(null)
  const [copied, setCopied] = useState(false)
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json())
      .then(setConfig)
  }, [])

  useEffect(() => {
    if (!config) return

    const checkOnline = async () => {
      try {
        const res = await fetch(
          `https://api.mcsrvstat.us/3/${config.serverAddress}:${config.serverPort}`,
        )
        const data = await res.json()
        setOnline(data.online ?? false)
      } catch {
        setOnline(false)
      }
    }

    checkOnline()
    const interval = setInterval(checkOnline, 60000)
    return () => clearInterval(interval)
  }, [config])

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
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* 半透明遮罩 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 主要内容 */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="text-center text-white">
          {/* 服务器名称 */}
          <h1 className="mb-2 text-5xl font-bold tracking-wide md:text-6xl">
            {config.serverName}
          </h1>

          {/* 版本信息 */}
          <p className="mb-4 text-xl text-white/80">
            Minecraft {config.version}
          </p>

          {/* 在线状态 */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2">
            {online === null ? (
              <span className="text-white/60">检测中...</span>
            ) : online ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-green-400">在线</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-red-400">离线</span>
              </>
            )}
          </div>

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
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {config.downloads.map((download) => (
              <a
                key={download.file}
                href={download.file}
                download
                className="btn"
              >
                <span className="i-carbon-download text-xl" />
                <span>{download.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Default>
  )
}

export default App
