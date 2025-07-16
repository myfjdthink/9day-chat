/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 你的 VITE_ 开头的环境变量类型
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}