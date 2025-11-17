<template>
  <!-- 这是一个无渲染组件，只用于设置meta标签 -->
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as vueI18n from 'vue-i18n'

interface SEOProps {
  title?: string
  pageTitle?: string  // 用于GA显示的简洁页面标题
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

// 默认值 - 优化后的SEO内容
const defaultTitle = '北斗九号日历 - 专业AI八字运势分析平台 | 智能命理预测服务'
const defaultDescription = '北斗九号日历提供专业的AI八字运势分析、智能择日推荐、生肖运势查询等服务。基于传统命理学理论，结合现代AI技术，为用户提供精准的运势预测、人生指导和决策建议。支持在线八字排盘、用神分析、流年运势等功能。'
const defaultKeywords = '八字分析,AI智能命理,择日推荐,生肖运势,命理预测,八字排盘,用神分析,流年运势,黄道吉日,运势分析,命理咨询,在线算命'
const defaultImage = 'https://www.9day.tech/favicon.png'
const defaultUrl = 'https://www.9day.tech/'
const defaultType = 'website'

const props = withDefaults(defineProps<SEOProps>(), {
  title: defaultTitle,
  pageTitle: undefined,  // 默认不设置，使用原有逻辑
  description: defaultDescription,
  keywords: defaultKeywords,
  image: defaultImage,
  url: defaultUrl,
  type: defaultType
})

const route = useRoute()
const { useI18n } = vueI18n as any
const { t, locale } = useI18n()

// 更新页面标题和meta标签
const updateSEO = () => {
  // 如果提供了pageTitle，使用简洁格式；否则使用原有逻辑
  let fullTitle: string
  if (props.pageTitle) {
    fullTitle = `${props.pageTitle} - 北斗九号日历`
  } else {
    fullTitle = props.title.includes('北斗九号日历') ? props.title : `${props.title} - 北斗九号日历`
  }
  
  // 更新页面标题
  document.title = fullTitle
  
  // 更新canonical链接标签
  updateCanonical()
  
  // 更新meta description
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', props.description)
  
  // 更新meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]')
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.setAttribute('name', 'keywords')
    document.head.appendChild(metaKeywords)
  }
  metaKeywords.setAttribute('content', props.keywords)
  
  // 更新Open Graph标签
  updateOpenGraph()
  
  // 更新Twitter Cards
  updateTwitterCards()
  
  // 更新结构化数据
  updateStructuredData()
}

// 更新Open Graph标签
const updateOpenGraph = () => {
  const ogTags = {
    'og:title': props.title,
    'og:description': props.description,
    'og:image': props.image,
    'og:url': props.url + route.path,
    'og:type': props.type
  }
  
  Object.entries(ogTags).forEach(([property, content]) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  })
}

// 更新canonical链接标签
const updateCanonical = () => {
  // 构建规范URL，确保不包含尾部斜杠（除了根路径）
  let canonicalPath = route.path
  if (canonicalPath !== '/' && canonicalPath.endsWith('/')) {
    canonicalPath = canonicalPath.slice(0, -1)
  }
  const canonicalUrl = props.url.replace(/\/$/, '') + canonicalPath
  
  // 移除旧的canonical链接
  const oldCanonical = document.querySelector('link[rel="canonical"]')
  if (oldCanonical) {
    oldCanonical.remove()
  }
  
  // 添加新的canonical链接
  const canonical = document.createElement('link')
  canonical.setAttribute('rel', 'canonical')
  canonical.setAttribute('href', canonicalUrl)
  document.head.appendChild(canonical)
}

// 更新Twitter Cards
const updateTwitterCards = () => {
  const twitterTags = {
    'twitter:title': props.title,
    'twitter:description': props.description,
    'twitter:image': props.image,
    'twitter:url': props.url + route.path
  }
  
  Object.entries(twitterTags).forEach(([property, content]) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  })
}

// 更新结构化数据
const updateStructuredData = () => {
  // 移除旧的结构化数据
  const oldStructuredData = document.querySelectorAll('script[type="application/ld+json"]')
  oldStructuredData.forEach(script => {
    if (script.textContent && script.textContent.includes('"@type":"WebPage"')) {
      script.remove()
    }
  })
  
  // 获取面包屑导航数据
  const breadcrumbs = getBreadcrumbs()
  
  // 添加新的结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": props.title,
    "description": props.description,
    "url": props.url + route.path,
    "mainEntity": {
      "@type": "Service",
      "name": "AI智能八字运势分析",
      "description": props.description,
      "provider": {
        "@type": "Organization",
        "name": "北斗九号日历",
        "url": props.url,
        "logo": {
          "@type": "ImageObject",
          "url": props.url + "/logo.png"
        }
      },
      "areaServed": "中国",
      "availableLanguage": locale?.value || 'zh-CN'
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".description"]
    },
    "publisher": {
      "@type": "Organization",
      "name": "北斗九号日历",
      "logo": {
        "@type": "ImageObject",
        "url": props.url + "/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString()
  }
  
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)
}

// 获取面包屑导航数据
const getBreadcrumbs = () => {
  const paths = route.path.split('/').filter(Boolean)
  const breadcrumbs = []
  let currentPath = ''
  
  // 添加首页（国际化）
  breadcrumbs.push({
    "@type": "ListItem",
    "position": 1,
    "name": t('common.breadcrumb.home'),
    "item": props.url
  })
  
  // 添加其他路径
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    breadcrumbs.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": getPageTitle(path),
      "item": props.url + currentPath
    })
  })
  
  return breadcrumbs
}

// 获取页面标题
const getPageTitle = (path: string) => {
  // 优先使用国际化映射：pages.<segment>
  const key = `pages.${path}`
  const translated = t(key)
  // 如果未配置对应键，回退为原始路径
  return translated && translated !== key ? translated : path
}

// 监听路由变化
watch(() => route.path, () => {
  updateSEO()
}, { immediate: true })

// 监听语言变化，确保国际化内容更新到 meta 和标题
watch(locale, () => {
  updateSEO()
})

// 监听传入 props 的变化（标题、描述、关键词等）
watch(() => [props.title, props.pageTitle, props.description, props.keywords, props.image, props.url, props.type], () => {
  updateSEO()
})

// 组件挂载时更新SEO
onMounted(() => {
  updateSEO()
})
</script>