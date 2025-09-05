import { ref, onMounted } from 'vue'

// 全局侧边栏状态管理
const sidebarOpen = ref(true)

export function useSidebar() {
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
    // 保存折叠状态到本地存储
    localStorage.setItem('sidebarOpen', sidebarOpen.value.toString())
  }

  const initSidebar = () => {
    // 从本地存储恢复折叠状态
    const savedState = localStorage.getItem('sidebarOpen')
    if (savedState !== null) {
      sidebarOpen.value = savedState === 'true'
    }
    
    // 监听窗口变化
    const handleResize = () => {
      // 移动端自动关闭侧边栏
      if (window.innerWidth <= 640) {
        sidebarOpen.value = false
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    // 返回清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  return {
    sidebarOpen,
    toggleSidebar,
    initSidebar
  }
}