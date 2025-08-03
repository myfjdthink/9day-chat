<template>
  <!-- 这是一个无渲染组件，只用于设置meta标签 -->
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

const props = withDefaults(defineProps<SEOProps>(), {
  title: '北斗九号日历 - AI智能八字运势分析平台',
  description: '北斗九号日历提供专业的AI智能八字运势分析、择日推荐、生肖运势等服务。基于传统命理学，结合AI技术，为您提供精准的运势预测和人生指导。',
  keywords: '八字分析,AI智能对话,择日推荐,生肖运势,命理预测,风水大师,黄道吉日,运势分析,AI助手,命理服务',
  image: 'https://www.9day.tech/logo.png',
  url: 'https://www.9day.tech',
  type: 'website'
})

const route = useRoute()

// 更新页面标题和meta标签
const updateSEO = () => {
  const fullTitle = props.title.includes('北斗九号日历') ? props.title : `${props.title} - 北斗九号日历`
  
  // 更新页面标题
  document.title = fullTitle
  
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
      "description": props.description
    }
  }
  
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)
}

// 监听路由变化
watch(() => route.path, () => {
  updateSEO()
}, { immediate: true })

// 组件挂载时更新SEO
onMounted(() => {
  updateSEO()
})
</script> 