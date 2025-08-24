import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 路由映射表
const routeMap: Record<string, string> = {
  'home': '/',
  'chat': '/chat',
  'analysis': '/analysis',
  'Calendar': '/calendar',
  'ZodiacFortune': '/zodiac-fortune'
}

// 反向路由映射表
const reverseRouteMap: Record<string, string> = {
  '/': 'home',
  '/chat': 'chat',
  '/analysis': 'analysis',
  '/calendar': 'Calendar',
  '/zodiac-fortune': 'ZodiacFortune'
}

export function useNavigation() {
  const router = useRouter()
  const route = useRoute()
  const activeTab = ref('home')

  // 根据路由路径更新 activeTab
  const updateActiveTabFromPath = (path: string) => {
    // 处理带参数的路径，如 /analysis/123
    const basePath = '/' + path.split('/')[1]
    activeTab.value = reverseRouteMap[basePath] || 'home'
  }

  // 设置活动标签并导航
  const setActiveTab = (tab: string) => {
    activeTab.value = tab
    const targetRoute = routeMap[tab] || '/'
    if (route.path !== targetRoute) {
      router.push(targetRoute)
    }
  }

  // 监听路由变化
  watch(
    () => route.path,
    (newPath) => {
      updateActiveTabFromPath(newPath)
    },
    { immediate: true }
  )

  return {
    activeTab,
    setActiveTab
  }
} 