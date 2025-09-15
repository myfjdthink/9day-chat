import requestMain from './request-main'
import { API_CONFIG } from './config'

// 考试运势分析请求参数
export interface ExamFortuneRequest {
  analysis_type: 'monthly' | 'yearly'
  birth_datetime: string
  current_datetime: string
  gender: '男' | '女'
}

// 流运分析数据结构
export interface FlowAnalysis {
  流年: {
    天干: {
      原字: string
      五行: string
      十神: string
      关系: string
    }
    地支: {
      原字: string
      五行: string
      十神: string
      关系: string
    }
  }
  流月: {
    天干: {
      原字: string
      五行: string
      十神: string
      关系: string
    }
    地支: {
      原字: string
      五行: string
      十神: string
      关系: string
    }
  }
}

// 考试评分数据结构
export interface ExamScore {
  总分: number
  等级: string
  总结: string
  有利因素: string[]
  不利因素: string[]
  详细分析: string[]
  特别提醒: string[]
}

// 月份分析数据结构
export interface MonthAnalysis {
  分析时间: string
  流运分析: FlowAnalysis
  考试评分: ExamScore
  考试建议: string[]
  分析依据: Record<string, string>
}

// 年份分析数据结构
export interface YearAnalysis {
  分析时间: string
  流运分析: {
    流年: {
      天干: {
        原字: string
        五行: string
        十神: string
        关系: string
      }
      地支: {
        原字: string
        五行: string
        十神: string
        关系: string
      }
    }
  }
  考试评分: ExamScore
  考试建议: string[]
  分析依据: Record<string, string>
}

// 考试运势分析响应数据结构
export interface ExamFortuneResponse {
  success: boolean
  message: string
  data: {
    分析时间: string
    分析类型: string
    基准年份: number
    月份分析?: Record<string, MonthAnalysis>
    年份分析?: Record<string, YearAnalysis>
    分析依据: Record<string, string>
  }
}

/**
 * 分析考试运势
 * @param params 分析参数
 * @returns 考试运势分析结果
 */
export async function analyzeExamFortune(params: ExamFortuneRequest): Promise<ExamFortuneResponse> {
  try {
    const response = await requestMain.post<ExamFortuneResponse>('/bazi/exam', params)
    return response.data
  } catch (error) {
    console.error('考试运势分析失败:', error)
    throw new Error('考试运势分析失败，请稍后重试')
  }
}

/**
 * 格式化考试运势数据（如果需要额外处理）
 * @param data 原始数据
 * @returns 格式化后的数据
 */
export const formatExamFortuneData = (data: ExamFortuneResponse['data']) => {
  if (data.分析类型 === 'monthly' && data.月份分析) {
    // 按月份排序
    const sortedMonths = Object.keys(data.月份分析).sort((a, b) => {
      const monthA = parseInt(a.replace('月', ''))
      const monthB = parseInt(b.replace('月', ''))
      return monthA - monthB
    })
    
    const sortedAnalysis: Record<string, MonthAnalysis> = {}
    sortedMonths.forEach(month => {
      sortedAnalysis[month] = data.月份分析![month]
    })
    
    return {
      ...data,
      月份分析: sortedAnalysis
    }
  } else if (data.分析类型 === 'yearly' && data.年份分析) {
    // 按年份排序
    const sortedYears = Object.keys(data.年份分析).sort((a, b) => {
      const yearA = parseInt(a.replace('年', ''))
      const yearB = parseInt(b.replace('年', ''))
      return yearA - yearB
    })
    
    const sortedAnalysis: Record<string, YearAnalysis> = {}
    sortedYears.forEach(year => {
      sortedAnalysis[year] = data.年份分析![year]
    })
    
    return {
      ...data,
      年份分析: sortedAnalysis
    }
  }
  
  return data
}

/**
 * 获取考试运势等级颜色
 * @param grade 等级
 * @returns 颜色类名
 */
export const getGradeColor = (grade: string): string => {
  switch (grade) {
    case '优秀':
      return 'text-green-600'
    case '良好':
      return 'text-blue-600'
    case '一般':
      return 'text-yellow-600'
    case '较弱':
      return 'text-orange-600'
    case '很弱':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

/**
 * 获取考试分数等级
 * @param score 分数
 * @returns 等级描述
 */
export const getScoreGrade = (score: number): string => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '一般'
  if (score >= 60) return '较弱'
  return '很弱'
}

/**
 * 获取最佳考试月份
 * @param monthAnalysis 月份分析数据
 * @returns 最佳考试月份列表
 */
export const getBestExamMonths = (monthAnalysis: Record<string, MonthAnalysis>): string[] => {
  const months = Object.entries(monthAnalysis)
    .sort(([, a], [, b]) => b.考试评分.总分 - a.考试评分.总分)
    .slice(0, 3)
    .map(([month]) => month)
  
  return months
}

/**
 * 获取需要避免的考试月份
 * @param monthAnalysis 月份分析数据
 * @returns 需要避免的考试月份列表
 */
export const getWorstExamMonths = (monthAnalysis: Record<string, MonthAnalysis>): string[] => {
  const months = Object.entries(monthAnalysis)
    .filter(([, data]) => data.考试评分.总分 < 65)
    .sort(([, a], [, b]) => a.考试评分.总分 - b.考试评分.总分)
    .slice(0, 3)
    .map(([month]) => month)
  
  return months
}