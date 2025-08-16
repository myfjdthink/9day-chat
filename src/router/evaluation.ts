import { RouteRecordRaw } from 'vue-router'

import Evaluation from '@/views/Evaluation.vue'

export const evaluationRoutes: RouteRecordRaw[] = [
  {
    path: '/evaluation',
    name: 'Evaluation',
    component: Evaluation
  },
  {
    path: '/evaluation/exam',
    name: 'ExamEvaluation',
    component: () => import('@/views/evaluation/ExamEvaluation.vue')
  },
  {
    path: '/evaluation/exam/result',
    name: 'ExamResult',
    component: () => import('@/views/evaluation/ExamResult.vue')
  }
]
