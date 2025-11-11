/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Ensure TypeScript recognizes vue-i18n module types in SFC context
declare module 'vue-i18n' {
  // re-export to satisfy IDE type resolution during SFC analysis
  export * from '@intlify/vue-i18n'
}