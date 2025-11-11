import { ref } from 'vue'
import i18n from '@/i18n'

type LocaleCode = 'zh-CN' | 'en'

const currentLocale = ref<LocaleCode>(i18n.global.locale.value as LocaleCode)

const setHtmlLang = (locale: LocaleCode) => {
  document.documentElement.lang = locale === 'zh-CN' ? 'zh-CN' : 'en'
}

export const useLocale = () => {
  const setLocale = (locale: LocaleCode) => {
    i18n.global.locale.value = locale
    currentLocale.value = locale
    localStorage.setItem('locale', locale)
    setHtmlLang(locale)
  }

  const initLocale = () => {
    setHtmlLang(currentLocale.value)
  }

  return {
    currentLocale,
    setLocale,
    initLocale
  }
}