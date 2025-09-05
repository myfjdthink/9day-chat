/**
 * 百度链接主动推送工具
 */

const BAIDU_PUSH_URL = 'http://data.zz.baidu.com/urls'
const SITE = 'https://www.9day.tech'
const TOKEN = 'Iokt7qn8wTcW19tW'

interface BaiduPushResponse {
  remain: number
  success: number
  not_same_site?: string[]
  not_valid?: string[]
}

/**
 * 推送单个URL到百度
 * @param url 要推送的URL
 * @returns 推送结果
 */
export const pushUrlToBaidu = async (url: string): Promise<BaiduPushResponse> => {
  try {
    const response = await fetch(`${BAIDU_PUSH_URL}?site=${SITE}&token=${TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: url
    })

    if (!response.ok) {
      throw new Error(`推送失败: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('百度推送出错:', error)
    throw error
  }
}

/**
 * 批量推送URL到百度
 * @param urls URL数组
 * @returns 推送结果
 */
export const pushUrlsToBaidu = async (urls: string[]): Promise<BaiduPushResponse> => {
  try {
    const response = await fetch(`${BAIDU_PUSH_URL}?site=${SITE}&token=${TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: urls.join('\n')
    })

    if (!response.ok) {
      throw new Error(`批量推送失败: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('百度批量推送出错:', error)
    throw error
  }
}

/**
 * 推送当前页面URL到百度
 * @returns 推送结果
 */
export const pushCurrentPageToBaidu = async (): Promise<BaiduPushResponse> => {
  const currentUrl = window.location.href
  return await pushUrlToBaidu(currentUrl)
}

/**
 * 推送站点地图中的所有URL到百度
 * @returns 推送结果
 */
export const pushSitemapUrlsToBaidu = async (): Promise<BaiduPushResponse> => {
  try {
    // 获取站点地图
    const response = await fetch('/sitemap.xml')
    const text = await response.text()
    
    // 解析XML
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'text/xml')
    
    // 提取所有URL
    const urls = Array.from(xmlDoc.getElementsByTagName('loc')).map(
      (loc) => loc.textContent || ''
    ).filter(Boolean)
    
    // 批量推送
    return await pushUrlsToBaidu(urls)
  } catch (error) {
    console.error('推送站点地图URL出错:', error)
    throw error
  }
}
