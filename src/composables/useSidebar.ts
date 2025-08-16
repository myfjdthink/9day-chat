import { computed, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useBaziStore } from '@/stores/bazi'
import boyAvatar from '@/assets/boy.png'
import girlAvatar from '@/assets/girl.png'

type EmitType = {
  (event: 'set-active-tab', tab: string): void
  (event: 'select-chat', id: string): void
  (event: 'delete-chat', id: string): void
  (event: 'select-analysis', id: string): void
  (event: 'delete-analysis', id: string): void
}

export function useSidebar(emit: EmitType) {
  const chatStore = useChatStore()
  const router = useRouter()
  const userStore = useUserStore()
  const baziStore = useBaziStore()
  const showDropdown = ref(false)

  // 默认头像计算属性
  const defaultAvatar = computed(() => 
    userStore.user?.gender === 'female' ? girlAvatar : boyAvatar
  )

  // 导航处理函数
  const handleNewChat = () => {
    chatStore.createConversation()
    emit('set-active-tab', 'ai-chat')
    router.push('/chat')
  }

  const handleNewAnalysis = () => {
    emit('set-active-tab', 'analysis')
    router.push('/analysis')
  }

  const handleGoHome = () => {
    emit('set-active-tab', 'home')
    router.push('/')
  }

  const handleGoAIChat = () => {
    emit('set-active-tab', 'ai-chat')
    router.push('/chat')
  }

  const handleGoAnalysis = () => {
    emit('set-active-tab', 'analysis')
    router.push('/analysis')
  }

  const handleGoCalendar = () => {
    emit('set-active-tab', 'calendar')
    router.push('/calendar')
  }

  const handleGoZodiacFortune = () => {
    emit('set-active-tab', 'zodiac-fortune')
    router.push('/zodiac-fortune')
  }

  // 历史记录处理函数
  const handleSelectChat = (id: string) => {
    chatStore.selectConversation(id)
    emit('set-active-tab', 'ai-chat')
    emit('select-chat', id)
  }

  const handleDeleteChat = (id: string) => {
    chatStore.removeConversation(id)
    emit('delete-chat', id)
  }

  const handleSelectAnalysis = (id: string) => {
    router.push({ path: '/analysis', query: { analysisId: id } })
    emit('select-analysis', id)
  }

  const handleDeleteAnalysis = async (id: string) => {
    await baziStore.removeAnalysis(id)
    emit('delete-analysis', id)
  }

  // 用户相关处理函数
  const handleLogout = () => {
    userStore.logout()
    router.push('/login')
  }

  const handleGoProfile = async () => {
    showDropdown.value = false
    await nextTick()
    if (router.currentRoute.value.path !== '/profile') {
      router.push('/profile')
    }
  }

  const handleGoAdmin = async () => {
    showDropdown.value = false
    await nextTick()
    if (router.currentRoute.value.path !== '/admin') {
      router.push('/admin')
    }
  }

  // 初始化函数
  const initialize = () => {
    userStore.init()
    if (userStore.token) {
      userStore.fetchUser()
    }
    chatStore.initializeStore()
    baziStore.initializeStore()
  }

  return {
    userStore,
    defaultAvatar,
    showDropdown,
    handleNewChat,
    handleNewAnalysis,
    handleGoHome,
    handleGoAIChat,
    handleGoAnalysis,
    handleGoCalendar,
    handleGoZodiacFortune,
    handleSelectChat,
    handleDeleteChat,
    handleSelectAnalysis,
    handleDeleteAnalysis,
    handleLogout,
    handleGoProfile,
    handleGoAdmin,
    initialize
  }
}