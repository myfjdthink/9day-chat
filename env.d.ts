/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 你的 VITE_ 开头的环境变量类型
  VITE_APP_HOST:string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}