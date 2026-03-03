import { ref } from 'vue'

const sidebarOpen = ref(true)
const isMobile = ref(false)
const MOBILE_BREAKPOINT = 768

export function useSidebar() {
  const getDesktopSidebarState = () => {
    const savedState = localStorage.getItem('sidebarOpen')
    return savedState !== null ? savedState === 'true' : true
  }

  const openSidebar = () => {
    sidebarOpen.value = true
  }

  const closeSidebar = () => {
    sidebarOpen.value = false
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
    if (!isMobile.value) {
      localStorage.setItem('sidebarOpen', sidebarOpen.value.toString())
    }
  }

  const initSidebar = () => {
    const syncSidebarByViewport = () => {
      const wasMobile = isMobile.value
      isMobile.value = window.innerWidth < MOBILE_BREAKPOINT

      if (isMobile.value) {
        sidebarOpen.value = false
        return
      }

      if (wasMobile) {
        sidebarOpen.value = getDesktopSidebarState()
      }
    }

    syncSidebarByViewport()

    const handleResize = () => {
      syncSidebarByViewport()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  return {
    sidebarOpen,
    isMobile,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    initSidebar
  }
}
