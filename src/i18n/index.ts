import * as VueI18n from 'vue-i18n'
import zhCN from '@/locales/zh-CN.json'
import en from '@/locales/en.json'

const { createI18n } = VueI18n as any

const getInitialLocale = (): 'zh-CN' | 'en' => {
  const saved = localStorage.getItem('locale') as 'zh-CN' | 'en' | null
  if (saved === 'zh-CN' || saved === 'en') return saved
  const nav = navigator.language.toLowerCase()
  return nav.startsWith('zh') ? 'zh-CN' : 'en'
}

const zh: any = zhCN as any
const enMsg: any = en as any
zh.analysis = zh.home?.analysis || zh.analysis
zh.fengshui = zh.home?.fengshui || zh.fengshui
enMsg.analysis = enMsg.home?.analysis || enMsg.analysis
enMsg.fengshui = enMsg.home?.fengshui || enMsg.fengshui

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    'zh-CN': zh,
    en: enMsg
  }
})

export default i18n
