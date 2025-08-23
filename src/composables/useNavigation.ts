import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 路由映射表
const routeMap: Record<string, string> = {
  'home': '/',
  'ai-chat': '/chat',
  'analysis': '/analysis',
  'calendar': '/calendar',
  'zodiac-fortune': '/zodiac-fortune'
}

export function useNavigation() {
  const router = useRouter()
  const route = useRoute()
  const activeTab = ref('home')

  // 根据当前路由更新 activeTab
  const updateActiveTabFromRoute = (routeName: string | null | undefined) => {
    if (routeName) {
      activeTab.value = routeName as string
    }
  }

  // 设置活动标签并导航
  const setActiveTab = (tab: string) => {
    activeTab.value = tab
    const targetRoute = routeMap[tab] || '/'
    if (route.path !== targetRoute) {
      router.push(targetRoute)
    }
  }

  // 初始化时根据路由设置 activeTab
  updateActiveTabFromRoute(route.name)

  return {
    activeTab,
    setActiveTab,
    updateActiveTabFromRoute
  }
} 