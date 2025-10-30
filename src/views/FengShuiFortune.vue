<template>
  <div class="flex-1 p-1 sm:p-2 lg:p-4 bg-gray-50 dark:bg-gray-900 min-h-screen max-h-screen overflow-y-auto">
    <!-- SEO组件 -->
    <SEO 
      title="中国传统风水布局分析 - 九宫飞星图在线专业测算 | 全国通用风水服务 | 北斗九号日历"
      pageTitle="风水布局分析"
      description="北斗九号日历提供专业的中国传统风水布局分析服务，适用全国各地。基于千年传统文化智慧，结合现代科学分析方法，提供九宫飞星图在线测算、户型风水评估、方位吉凶判断等专业服务。上传户型图，智能叠加九宫飞星方位，根据年份精准调整飞星排布，科学分析家居风水布局，助您趋吉避凶，改善运势，打造和谐宜居的生活环境。"
      keywords="中国风水,传统风水,风水布局,九宫飞星,风水分析,户型风水,飞星排布,家居风水,风水测算,方位调整,在线风水,风水服务,全国通用,传统文化,风水大师,风水咨询,住宅风水,办公室风水,风水化解,吉凶方位,风水改运,玄学文化,易经风水,风水宝地"
    />
    
    <div class="max-w-7xl mx-auto h-full flex flex-col">
      <!-- 面包屑导航 -->
      <nav class="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3" aria-label="面包屑导航">
        <a href="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">首页</a>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900 dark:text-gray-100 font-medium">风水布局分析</span>
      </nav>
      
      <!-- 页面标题 - 紧凑版 -->
      <div class="text-center mb-3 sm:mb-4">
        <div class="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-100 dark:border-gray-700 shadow-sm">
          <span class="text-xl sm:text-2xl">🏠</span>
        </div>
        <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">中国传统风水布局专业分析</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 hidden sm:block">基于千年传统文化智慧，上传户型图，智能叠加九宫飞星方位，科学精准分析家居风水布局，适用全国各地</p>
      </div>

      <!-- 控制面板 - 紧凑版 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 mb-3 sm:mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- 年份选择 -->
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              选择年份
            </label>
            <select 
              v-model="selectedYear" 
              @change="updateFlyingStars"
              class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}年
              </option>
            </select>
          </div>

          <!-- 方位调整 -->
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              房屋方位对应调整
            </label>
            <div class="flex items-center space-x-2 sm:space-x-3">
              <Button 
                size="sm" 
                variant="outline" 
                @click="rotateGrid(-45)"
                :disabled="isRotating"
                class="flex items-center transition-all duration-200 hover:scale-105 active:scale-95 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] touch-manipulation"
                :class="{ 
                  'bg-blue-50 border-blue-300': isRotating && rotationDirection === 'left',
                  'opacity-50 cursor-not-allowed': isRotating && rotationDirection !== 'left'
                }"
              >
                <RotateCcw 
                  class="w-3 h-3 sm:w-4 sm:h-4 mr-1 transition-transform duration-500" 
                  :class="{ 
                    'animate-spin': isRotating && rotationDirection === 'left',
                    'rotate-[-45deg]': isRotating && rotationDirection === 'left'
                  }"
                />
                <span class="hidden sm:inline">左转45°</span>
                <span class="sm:hidden">左转</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                @click="rotateGrid(45)"
                :disabled="isRotating"
                class="flex items-center transition-all duration-200 hover:scale-105 active:scale-95 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px] touch-manipulation"
                :class="{ 
                  'bg-blue-50 border-blue-300': isRotating && rotationDirection === 'right',
                  'opacity-50 cursor-not-allowed': isRotating && rotationDirection !== 'right'
                }"
              >
                <RotateCw 
                  class="w-3 h-3 sm:w-4 sm:h-4 mr-1 transition-transform duration-500" 
                  :class="{ 
                    'animate-spin': isRotating && rotationDirection === 'right',
                    'rotate-[45deg]': isRotating && rotationDirection === 'right'
                  }"
                />
                <span class="hidden sm:inline">右转45°</span>
                <span class="sm:hidden">右转</span>
              </Button>
            </div>
          </div>

          <!-- 透明度调整 -->
          <div class="sm:col-span-2 lg:col-span-1">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              飞星显示不透明度: {{ Math.round(overlayOpacity * 100) }}%
            </label>
            <input 
              v-model="overlayOpacity" 
              type="range" 
              min="0.1" 
              max="0.9" 
              step="0.1"
              class="w-full h-3 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 touch-manipulation"
            />
          </div>

          <!-- 太岁位和三煞位信息 -->
          <div class="sm:col-span-2 lg:col-span-1">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              {{ selectedYear }}年太岁三煞方位
            </label>
            <div class="space-y-1">
              <div class="flex items-center space-x-2 text-xs sm:text-sm">
                <div class="w-3 h-3 bg-yellow-500 rounded border border-yellow-600"></div>
                <span class="text-gray-600 dark:text-gray-300">太岁位：{{ taiSuiDirection }}</span>
              </div>
              <div class="flex items-center space-x-2 text-xs sm:text-sm">
                <div class="w-3 h-3 bg-red-500 rounded border border-red-600"></div>
                <span class="text-gray-600 dark:text-gray-300">三煞位：{{ sanShaDirection }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 - 手机端单列布局 -->
      <div class="flex flex-col lg:grid lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 flex-1 min-h-0">
        <!-- 图片上传区域 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 sm:p-3 lg:p-4 flex flex-col min-h-0">
          <h2 class="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">上传户型图 - 专业风水分析</h2>
          
          <!-- 上传区域 -->
          <div 
            v-if="!uploadedImage"
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 sm:p-4 lg:p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer flex-1 flex flex-col justify-center min-h-[150px] sm:min-h-[200px] lg:min-h-[250px]"
            @click="triggerFileInput"
          >
            <Upload class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-2 sm:mb-3 lg:mb-4" />
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">拖拽图片到此处或点击上传</p>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">支持 JPG、PNG、GIF 格式</p>
            <input 
              ref="fileInput" 
              type="file" 
              accept="image/*" 
              @change="handleFileSelect" 
              class="hidden"
            />
          </div>

          <!-- 图片预览区域 -->
          <div v-else class="relative">
            <div class="relative inline-block min-w-[400px] min-h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <img 
                :src="uploadedImage" 
                alt="上传的户型图" 
                class="w-full h-full min-w-[400px] min-h-[400px] rounded-lg shadow-md object-cover"
                @load="onImageLoad"
              />
              
              <!-- 九宫飞星遮罩层 -->
              <div 
                v-if="showOverlay"
                class="absolute inset-0 pointer-events-none transition-all duration-600 ease-out"
                :style="{ 
                  opacity: overlayOpacity,
                  transform: isRotating ? 'scale(1.03)' : 'scale(1)',
                  filter: isRotating ? 'brightness(1.2) contrast(1.2) saturate(1.3)' : 'brightness(1) contrast(1) saturate(1)',
                  animation: isRotating ? 'shake-container 600ms ease-out, background-flash 600ms ease-out' : 'none'
                }"
              >
                <!-- 旋转方向指示器 -->
                <div 
                  v-if="isRotating" 
                  class="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse"
                >
                  {{ rotationDirection === 'left' ? '← 左转45°' : '→ 右转45°' }}
                </div>
                
                <div 
                  class="w-full h-full grid grid-cols-3 grid-rows-3 gap-0 transition-all duration-600 ease-out"
                  :class="{ 'animate-pulse': isRotating }"
                  :style="{
                    animation: isRotating ? 'pulse-enhanced 600ms ease-out' : 'none',
                    background: isRotating ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)' : 'transparent',
                    minHeight: '400px'
                  }"
                >
                  <div 
                    v-for="(position, index) in rotatedFlyingStarPositions" 
                    :key="`${position.star}-${position.direction}-${index}`"
                    class="border-2 backdrop-blur-sm flex flex-col items-center justify-start text-white font-bold relative transition-all duration-500 ease-out shadow-lg p-0.5 sm:p-1 overflow-y-auto min-h-[100px] xs:min-h-[110px] sm:min-h-[130px] md:min-h-[150px]"
                    :class="{
                      'border-yellow-400 bg-gradient-to-br from-yellow-600/60 via-yellow-500/50 to-yellow-700/60': isTaiSuiPosition(position.direction),
                      'border-red-400 bg-gradient-to-br from-red-600/60 via-red-500/50 to-red-700/60': isSanShaPosition(position.direction),
                      'border-white/80 bg-gradient-to-br from-black/50 via-black/40 to-black/60': !isTaiSuiPosition(position.direction) && !isSanShaPosition(position.direction)
                    }"
                    :style="{ 
                      transitionDelay: `${index * 50}ms`,
                      transform: isRotating ? 'scale(0.95)' : 'scale(1)',
                      boxShadow: isRotating ? '0 0 20px rgba(59, 130, 246, 0.5)' : 
                        isTaiSuiPosition(position.direction) ? '0 0 15px rgba(251, 191, 36, 0.6)' :
                        isSanShaPosition(position.direction) ? '0 0 15px rgba(239, 68, 68, 0.6)' : 
                        '0 0 0 rgba(0, 0, 0, 0)'
                    }"
                  >
                    <!-- 星宿数字 - 增强可见性 -->
                    <div 
                      class="text-sm xs:text-base sm:text-lg md:text-xl mb-0.5 transition-all duration-600 ease-out relative overflow-hidden font-black text-white bg-black/50 rounded-full w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 flex items-center justify-center backdrop-blur-sm shadow-lg"
                      :style="{ 
                        transform: isRotating ? 
                          `scale(1.2) rotate(${rotationDirection === 'left' ? '-15deg' : '15deg'}) translateX(${rotationDirection === 'left' ? '-20px' : '20px'}) translateY(-10px)` : 
                          'scale(1) rotate(0deg) translateX(0px) translateY(0px)',
                        textShadow: isRotating ? 
                          '0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(59, 130, 246, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.6)' : 
                          '2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 2px rgba(0, 0, 0, 0.7), 0 0 8px rgba(0, 0, 0, 0.5), 1px 1px 0px rgba(0, 0, 0, 1)',
                        opacity: isRotating ? '0.3' : '1',
                        filter: isRotating ? 'blur(1px)' : 'blur(0px)',
                        WebkitTextStroke: '1px rgba(0, 0, 0, 0.8)'
                      }"
                    >
                      {{ position.star }}
                      <!-- 流动效果遮罩 -->
                      <div 
                        v-if="isRotating"
                        class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse"
                        :style="{
                          transform: `translateX(${rotationDirection === 'left' ? '-100%' : '100%'})`,
                          animation: 'flow-text 600ms ease-out'
                        }"
                      ></div>
                    </div>
                    <!-- 方位名称 - 增强可见性 -->
                    <div 
                      class="text-[9px] xs:text-[10px] sm:text-xs opacity-90 transition-all duration-600 ease-out relative overflow-hidden font-bold mb-0.5 sm:mb-1 text-white rounded px-0.5 sm:px-1 py-0.5 backdrop-blur-sm shadow-lg"
                      :class="{
                        'bg-black/60': isTaiSuiPosition(position.direction) || isSanShaPosition(position.direction),
                        'bg-gray-800/80': !isTaiSuiPosition(position.direction) && !isSanShaPosition(position.direction)
                      }"
                      :style="{ 
                        transform: isRotating ? 
                          `translateX(${rotationDirection === 'left' ? '15px' : '-15px'}) translateY(${rotationDirection === 'left' ? '5px' : '-5px'}) rotate(${rotationDirection === 'left' ? '10deg' : '-10deg'})` : 
                          'translateX(0px) translateY(0px) rotate(0deg)',
                        opacity: isRotating ? '0.2' : '0.9',
                        filter: isRotating ? 'blur(0.5px)' : 'blur(0px)',
                        textShadow: isRotating ? 
                          '2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 6px rgba(59, 130, 246, 0.8), 0 0 8px rgba(0, 0, 0, 0.7)' : 
                          '2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.9)',
                        WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.8)'
                      }"
                    >
                      {{ position.direction }}
                      <!-- 方位文字流动效果 -->
                      <div 
                        v-if="isRotating"
                        class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-40"
                        :style="{
                          transform: `translateX(${rotationDirection === 'left' ? '100%' : '-100%'})`,
                          animation: 'flow-direction 600ms ease-out 200ms'
                        }"
                      ></div>
                    </div>

                    <!-- 太岁位和三煞位标识 - 移到左上角 -->
                    <div v-if="isTaiSuiPosition(position.direction)" class="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 text-yellow-100 font-bold text-[7px] xs:text-[8px] sm:text-[9px] bg-yellow-600/90 rounded px-0.5 sm:px-1 py-0.5 border border-yellow-300/80 backdrop-blur-sm shadow-lg z-10" style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);">
                      太岁
                    </div>
                    <div v-if="isSanShaPosition(position.direction)" class="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 text-red-100 font-bold text-[7px] xs:text-[8px] sm:text-[9px] bg-red-600/90 rounded px-0.5 sm:px-1 py-0.5 border border-red-300/80 backdrop-blur-sm shadow-lg z-10" style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);">
                      三煞
                    </div>

                    <!-- 宜忌操作指导 -->
                    <div class="flex-1 w-full text-center space-y-0.5 sm:space-y-1 text-xs sm:text-sm mt-1 sm:mt-2">
                      
                      <!-- 特殊注意事项 - 优化文案长度和显示效果 -->
                      <div v-if="isTaiSuiPosition(position.direction)" class="text-white text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold bg-orange-600/90 rounded px-1.5 sm:px-2 py-1 sm:py-1.5 backdrop-blur-sm shadow-lg border border-orange-400/50 min-h-[20px] sm:min-h-[24px] flex items-center justify-center leading-tight" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.9);">
                        <span class="break-words text-center">⚠️ 宜静不宜动</span>
                      </div>
                      <div v-if="isSanShaPosition(position.direction)" class="text-white text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold bg-orange-600/90 rounded px-1.5 sm:px-2 py-1 sm:py-1.5 backdrop-blur-sm shadow-lg border border-orange-400/50 min-h-[20px] sm:min-h-[24px] flex items-center justify-center leading-tight" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.9);">
                        <span class="break-words text-center">⚠️ 不宜动土</span>
                      </div>
                      <div v-if="position.specialNote && !isTaiSuiPosition(position.direction) && !isSanShaPosition(position.direction)" class="text-white text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold bg-orange-600/90 rounded px-1.5 sm:px-2 py-1 sm:py-1.5 backdrop-blur-sm shadow-lg border border-orange-400/50 min-h-[20px] sm:min-h-[24px] flex items-center justify-center leading-tight" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.9);">
                        <span class="break-words text-center">⚠️ {{ position.specialNote }}</span>
                      </div>
                      
                      <!-- 宜放物品 -->
                      <div class="text-white bg-green-600/90 rounded px-1 sm:px-1.5 py-1 sm:py-1.5 backdrop-blur-sm shadow-lg border border-green-400/50 min-h-[32px] sm:min-h-[36px] flex flex-col justify-center" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.9);">
                        <div class="font-bold text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] mb-0.5">✅ 宜：</div>
                        <div class="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] leading-[1.2] font-medium break-words">
                          <span class="inline-block">
                            <!-- 小屏幕显示2个，中屏显示3个，大屏显示4个 -->
                            <span class="sm:hidden">
                              {{ position.suitable.slice(0, 2).join('、') }}
                              <span v-if="position.suitable.length > 2">等</span>
                            </span>
                            <span class="hidden sm:block lg:hidden">
                              {{ position.suitable.slice(0, 3).join('、') }}
                              <span v-if="position.suitable.length > 3">等</span>
                            </span>
                            <span class="hidden lg:block">
                              {{ position.suitable.slice(0, 4).join('、') }}
                              <span v-if="position.suitable.length > 4">等</span>
                            </span>
                          </span>
                        </div>
                      </div>
                      
                      <!-- 忌放物品 -->
                      <div class="text-white bg-red-600/90 rounded px-1 sm:px-1.5 py-1 sm:py-1.5 backdrop-blur-sm shadow-lg border border-red-400/50 min-h-[32px] sm:min-h-[36px] flex flex-col justify-center" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.9);">
                        <div class="font-bold text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] mb-0.5">❌ 忌：</div>
                        <div class="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] leading-[1.2] font-medium break-words">
                          <span class="inline-block">
                            <!-- 小屏幕显示2个，中屏显示3个，大屏显示4个 -->
                            <span class="sm:hidden">
                              {{ position.avoid.slice(0, 2).join('、') }}
                              <span v-if="position.avoid.length > 2">等</span>
                            </span>
                            <span class="hidden sm:block lg:hidden">
                              {{ position.avoid.slice(0, 3).join('、') }}
                              <span v-if="position.avoid.length > 3">等</span>
                            </span>
                            <span class="hidden lg:block">
                              {{ position.avoid.slice(0, 4).join('、') }}
                              <span v-if="position.avoid.length > 4">等</span>
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- 吉凶指示 -->
                    <div 
                      class="absolute top-1 right-1 w-2 h-2 rounded-full transition-all duration-300 ease-out"
                      :class="getStarColor(position.star)"
                      :style="{ 
                        transform: isRotating ? 'scale(1.3) pulse' : 'scale(1)',
                        boxShadow: isRotating ? '0 0 8px currentColor' : 'none'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 - 增强触摸体验，确保不被遮挡 -->
            <div class="mt-4 sm:mt-5 lg:mt-6 flex flex-wrap gap-2 sm:gap-3 relative z-10 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <Button 
                size="sm" 
                variant="outline" 
                @click="toggleOverlay"
                class="flex-1 sm:flex-none min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm px-4 py-2.5 sm:py-2 touch-manipulation"
              >
                {{ showOverlay ? '隐藏' : '显示' }}九宫图
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                @click="resetImage"
                class="flex-1 sm:flex-none min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm px-4 py-2.5 sm:py-2 touch-manipulation"
              >
                重新上传
              </Button>
            </div>
          </div>

          <!-- 使用说明 -->
          <div class="mt-3 sm:mt-4 lg:mt-6 p-2 sm:p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 class="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100 mb-1 sm:mb-2">简单四步，轻松看风水</h4>
            <ul class="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-0.5 sm:space-y-1">
              <li>• 第一步：点击上传按钮，选择房屋平面图（支持JPG、PNG格式）</li>
              <li>• 第二步：在左侧选择年份，系统自动显示当年的风水方位</li>
              <li class="hidden sm:list-item">• 第三步：用旋转按钮调整方向，让图上的方位和实际房屋朝向一致</li>
              <li class="hidden sm:list-item">• 第四步：查看每个房间的颜色提示，绿色代表好位置，红色需要注意</li>
              <li class="hidden sm:list-item">• 最后：根据下方建议调整家居摆放，让家里风水更好</li>
            </ul>
          </div>
        </div>

        <!-- 九宫飞星说明 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 sm:p-3 lg:p-4 flex flex-col min-h-0 overflow-y-auto">
          <h2 class="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">{{ selectedYear }}年九宫飞星</h2>
          
          <!-- 飞星图表 - 优化布局显示 -->
          <div class="grid grid-cols-3 grid-rows-3 gap-1 sm:gap-2 mb-3 sm:mb-4 w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[480px] mx-auto">
            <div 
              v-for="(position, index) in flyingStarPositions" 
              :key="index"
              class="border border-gray-200 dark:border-gray-600 rounded-md p-1.5 sm:p-2 lg:p-3 text-center flex flex-col justify-between min-h-[120px] sm:min-h-[150px] lg:min-h-[200px]"
              :class="getStarBgColor(position.star)"
            >
              <!-- 星宿数字 -->
              <div class="text-base sm:text-xl lg:text-3xl font-bold mb-0.5 sm:mb-1 flex-shrink-0" :class="getStarTextColor(position.star)">
                {{ position.star }}
              </div>
              
              <!-- 飞星名称 -->
              <div class="text-[9px] sm:text-xs lg:text-sm font-semibold mb-0.5 flex-shrink-0" :class="getStarTextColor(position.star)">
                {{ position.name }}
              </div>
              
              <!-- 五行属性 -->
              <div class="text-[7px] sm:text-[9px] lg:text-xs text-gray-500 dark:text-gray-400 mb-0.5 flex-shrink-0">
                属{{ position.element }}
              </div>
              
              <!-- 方位 -->
              <div class="text-[7px] sm:text-[9px] lg:text-xs text-gray-600 dark:text-gray-300 mb-1 flex-shrink-0">
                {{ position.direction }}
              </div>
              
              <!-- 完整作用描述 - 优化显示更多内容 -->
              <div class="text-[7px] sm:text-[9px] lg:text-[11px] font-medium leading-[1.2] flex-1 flex items-center justify-center min-h-0" :class="getStarTextColor(position.star)">
                <div class="break-all text-center px-0.5 overflow-hidden w-full">
                  <div class="line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
                    {{ position.effects }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 吉凶分类说明 -->
          <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">吉凶分类</h4>
            <div class="grid grid-cols-1 gap-1 sm:gap-2 text-xs sm:text-sm">
              <div class="flex items-center space-x-1 sm:space-x-2">
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                <span class="text-gray-600 dark:text-gray-300">吉星：一白、六白、八白</span>
              </div>
              <div class="flex items-center space-x-1 sm:space-x-2">
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                <span class="text-gray-600 dark:text-gray-300">凶星：二黑、三碧、五黄、七赤</span>
              </div>
              <div class="flex items-center space-x-1 sm:space-x-2">
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <span class="text-gray-600 dark:text-gray-300">中性：四绿、九紫</span>
              </div>
            </div>
          </div>

          <!-- 太岁位和三煞位风水建议 -->
          <div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ selectedYear }}年风水要位</h4>
            <div class="space-y-2 text-xs sm:text-sm">
              <div class="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                <div class="flex items-center space-x-2 mb-1">
                  <div class="w-3 h-3 bg-yellow-500 rounded border border-yellow-600"></div>
                  <span class="font-semibold text-yellow-800 dark:text-yellow-200">太岁位（{{ taiSuiDirection }}）</span>
                </div>
                <p class="text-yellow-700 dark:text-yellow-300 text-xs">宜静不宜动，不宜装修、挖掘、敲打。可放置吉祥物品镇宅。</p>
              </div>
              <div class="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <div class="flex items-center space-x-2 mb-1">
                  <div class="w-3 h-3 bg-red-500 rounded border border-red-600"></div>
                  <span class="font-semibold text-red-800 dark:text-red-200">三煞位（{{ sanShaDirection }}）</span>
                </div>
                <p class="text-red-700 dark:text-red-300 text-xs">不宜坐向此方，不宜动土。避免在此方位放置重要家具。</p>
              </div>
            </div>
          </div>




        </div>
      </div>

      <!-- 九宫飞星详细说明和风水建议 - 独立容器 -->
      <div class="w-full mt-4 sm:mt-6 lg:mt-8 space-y-4 sm:space-y-6 lg:space-y-8">
        <!-- 风水建议 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
          <div class="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
            <h4 class="text-base sm:text-lg lg:text-xl font-bold text-orange-900 dark:text-orange-100 mb-3 sm:mb-4 flex items-center">
              <span class="text-xl sm:text-2xl mr-2">🎯</span>
              {{ selectedYear }}年风水建议
            </h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <!-- 动态生成的风水建议 -->
              <div 
                v-for="(advice, index) in dynamicFengShuiAdvice" 
                :key="index"
                class="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4"
                :class="advice.borderColor"
              >
                <div class="flex items-center mb-2">
                  <span class="text-lg mr-2">{{ advice.icon }}</span>
                  <h5 class="font-semibold" :class="advice.titleColor">{{ advice.title }}</h5>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span class="font-medium text-blue-600 dark:text-blue-400">{{ advice.directions }}方位</span>
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ advice.content }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 九宫飞星详细说明 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
          <div class="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <h4 class="text-base sm:text-lg lg:text-xl font-bold text-purple-900 dark:text-purple-100 mb-3 sm:mb-4 flex items-center">
              <span class="text-xl sm:text-2xl mr-2">✨</span>
              九宫飞星详细说明
            </h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <!-- 一白星 -->
              <div class="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-green-500">
                <div class="flex items-center mb-2">
                  <span class="text-lg font-bold text-green-600 dark:text-green-400 mr-2">1</span>
                  <h5 class="font-semibold text-green-800 dark:text-green-200">一白星【吉星】</h5>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span class="font-medium text-blue-600 dark:text-blue-400">五行属水</span>
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  代表官升、名气、中状元、官运和财运。失令的时候，此星为桃花劫，破财损家，甚至性病、绝症，异乡流亡。
                </p>
              </div>

              <!-- 二黑星 -->
              <div class="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-red-500">
                <div class="flex items-center mb-2">
                  <span class="text-lg font-bold text-red-600 dark:text-red-400 mr-2">2</span>
                  <h5 class="font-semibold text-red-800 dark:text-red-200">二黑星【凶星】</h5>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span class="font-medium text-blue-600 dark:text-blue-400">五行属土</span>
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  二黑星代表病符。此星在得令的时候并非病符，代表位列尊崇，能成霸业。但此星失令的时候，是一极大凶星，破财损家，代表死亡绝症、破财横祸，与五黄星并列为最凶之星。此星亦代表招来阴灵。
                </p>
              </div>

              <!-- 三碧星 -->
              <div class="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-red-500">
                <div class="flex items-center mb-2">
                  <span class="text-lg font-bold text-red-600 dark:text-red-400 mr-2">3</span>
                  <h5 class="font-semibold text-red-800 dark:text-red-200">三碧星【凶星】</h5>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span class="font-medium text-blue-600 dark:text-blue-400">五行属木</span>
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  三碧星代表是非。此星在得令时代表因口材而成名，大利律师、法官急鬼才等职。但此星失令的时候，代表是非官非，破财招刑。
                </p>
              </div>

              <!-- 四绿星 -->
              <div class="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-green-500">
                <div class="flex items-center mb-2">
                  <span class="text-lg font-bold text-green-600 dark:text-green-400 mr-2">4</span>
                  <h5 class="font-semibold text-green-800 dark:text-green-200">四绿星【吉星】</h5>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span class="font-medium text-blue-600 dark:text-blue-400">五行属木</span>
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  文曲星在得令的时代表文化艺术、才华、文思敏捷。但失令时为桃花劫星必招酒色之祸。
                </p>
              </div>

              <!-- 五黄星 -->
              <div class="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-red-500">
                <div class="flex items-center mb-2">
                  <span class="text-lg font-bold text-red-600 dark:text-red-400 mr-2">5</span>
                  <h5 class="font-semibold text-red-800 dark:text-red-200">五黄星【凶星】</h5>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span class="font-medium text-blue-600 dark:text-blue-400">五行属土</span>
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  廉贞星得令时代表位处中极、威崇无比，如皇帝之最尊最贵。但此星失令的时，称为五黄煞又名正关煞，代表死亡绝症、血光之灾，家破人亡。此星亦必招邪灵之物。
                </p>
              </div>

              <!-- 六白星 -->
              <div class="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-green-500">
                <div class="flex items-center mb-2">
                  <span class="text-lg font-bold text-green-600 dark:text-green-400 mr-2">6</span>
                  <h5 class="font-semibold text-green-800 dark:text-green-200">六白星【吉星】</h5>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span class="font-medium text-blue-600 dark:text-blue-400">五行属金</span>
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  六白是偏财星，与一白、八白合称三大财星。六白得令时丁财两旺，失令时，为失财星，可令倾家荡产。
                </p>
              </div>

              <!-- 七赤星 -->
              <div class="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-red-500">
                <div class="flex items-center mb-2">
                  <span class="text-lg font-bold text-red-600 dark:text-red-400 mr-2">7</span>
                  <h5 class="font-semibold text-red-800 dark:text-red-200">七赤星【凶星】</h5>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span class="font-medium text-blue-600 dark:text-blue-400">五行属金</span>
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  七赤星当运的时候，大利以口才工作的人，包括歌星、演说家、占卜家等，大利通讯传播。但七赤星退运时候，代表口舌是非，刀光剑影，世界大战。又代表火险、及身体上呼吸、肺部的毛病。
                </p>
              </div>

              <!-- 八白星 -->
              <div class="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-green-500">
                <div class="flex items-center mb-2">
                  <span class="text-lg font-bold text-green-600 dark:text-green-400 mr-2">8</span>
                  <h5 class="font-semibold text-green-800 dark:text-green-200">八白星【吉星】</h5>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span class="font-medium text-blue-600 dark:text-blue-400">五行属土</span>
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  八白星得令时为太白财星，能带来功名富贵。田宅科发，为九星中第一吉星。此星失令的时，为失财失义，瘟疫流行，失财于刹间。
                </p>
              </div>

              <!-- 九紫星 -->
              <div class="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-green-500">
                <div class="flex items-center mb-2">
                  <span class="text-lg font-bold text-green-600 dark:text-green-400 mr-2">9</span>
                  <h5 class="font-semibold text-green-800 dark:text-green-200">九紫星【吉星】</h5>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span class="font-medium text-blue-600 dark:text-blue-400">五行属火</span>
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  九紫星当令时为一级喜庆星及爱情星，代表桃花人缘及天乙贵人，大利置业及建筑。但此星失令的时为桃花劫星，损丁破财，亦主火灾、爆炸、心脏病、眼疾、流血等。
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Upload, RotateCw, RotateCcw } from 'lucide-vue-next'
import SEO from '@/components/SEO.vue'
import Button from '@/components/ui/Button.vue'

// 响应式数据
const selectedYear = ref(2025)
const uploadedImage = ref<string | null>(null)
const showOverlay = ref(true)
const overlayOpacity = ref(0.7)
const gridRotation = ref(0)
const isRotating = ref(false)


// 太岁位和三煞位相关数据
const taiSuiPosition = ref<string>('')
const sanShaPositions = ref<string[]>([])
const taiSuiDirection = ref<string>('')
const sanShaDirection = ref<string>('')
const rotationDirection = ref<'left' | 'right' | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// 可选年份
const availableYears = computed(() => {
  const years = []
  for (let year = 2020; year <= 2030; year++) {
    years.push(year)
  }
  return years
})

// 九宫飞星数据类型
interface FlyingStarPosition {
  star: number
  direction: string
  meaning: string
  name: string
  element: string
  effects: string
  suitable: string[]
  avoid: string[]
  specialNote?: string
}

// 飞星详细信息映射
const getStarInfo = (star: number) => {
  const starInfoMap: { [key: number]: { 
    name: string; 
    element: string; 
    effects: string; 
    meaning: string;
    suitable: string[];
    avoid: string[];
    specialNote?: string;
  } } = {
    1: { 
      name: '一白星', 
      element: '水', 
      effects: '偏财投资、桃花运、官运、财运', 
      meaning: '贪狼',
      suitable: ['鱼缸养鱼', '一杯水', '音乐盒', '流动的水', '蓝色地毯'],
      avoid: ['黄色物品', '咖啡色物品']
    },
    2: { 
      name: '二黑星', 
      element: '土', 
      effects: '病符、疾病', 
      meaning: '病符',
      suitable: ['铜葫芦', '五帝钱', '铜麒麟', '音乐盒', '铜片', '金属发声物件'],
      avoid: ['动土', '鱼缸', '植物', '红色物件']
    },
    3: { 
      name: '三碧星', 
      element: '木', 
      effects: '是非、争执', 
      meaning: '是非',
      suitable: ['红色物件'],
      avoid: ['水', '金属物件', '植物', '动土', '风扇']
    },
    4: { 
      name: '四绿星', 
      element: '木', 
      effects: '文职、文曲、读书考试', 
      meaning: '文昌',
      suitable: ['四棵富贵竹', '一杯水'],
      avoid: ['金属物件', '铜麒麟']
    },
    5: { 
      name: '五黄星', 
      element: '土', 
      effects: '灾煞、凶星', 
      meaning: '五黄',
      suitable: ['铜葫芦', '五帝钱', '音乐盒', '金属发声物件', '蓝色物品'],
      avoid: ['动土', '鱼缸', '植物', '红色物件']
    },
    6: { 
      name: '六白星', 
      element: '金', 
      effects: '偏财、武职、变动', 
      meaning: '武曲',
      suitable: ['黄色物品', '六颗白石', '一杯水'],
      avoid: ['植物', '红色物件']
    },
    7: { 
      name: '七赤星', 
      element: '金', 
      effects: '破军、盗贼', 
      meaning: '破军',
      suitable: ['一杯水', '开口陈醋'],
      avoid: ['金色物件', '白色', '金属物件']
    },
    8: { 
      name: '八白星', 
      element: '土', 
      effects: '正财运、名气提升', 
      meaning: '财星',
      suitable: ['红色物品', '一杯水', '鱼缸养鱼'],
      avoid: ['植物', '绿色物品']
    },
    9: { 
      name: '九紫星', 
      element: '火', 
      effects: '喜庆、婚嫁添丁', 
      meaning: '喜庆',
      suitable: ['植物', '红色物件', '九个利是封'],
      avoid: ['黑色物品', '蓝色物品']
    }
  }
  return starInfoMap[star] || { 
    name: '未知', 
    element: '未知', 
    effects: '未知', 
    meaning: '未知',
    suitable: [],
    avoid: []
  }
}

// 九宫飞星基础排布（以2024年为基准，三碧星入中宫）
// 按照传统风水九宫格布局：天南地北，左东右西
// 排列顺序：东南-正南-西南-正东-中央-正西-东北-正北-西北
const baseFlyingStars = ref<FlyingStarPosition[]>([
  { star: 2, direction: '东南', ...getStarInfo(2) },
  { star: 7, direction: '正南', ...getStarInfo(7) },
  { star: 9, direction: '西南', ...getStarInfo(9) },
  { star: 1, direction: '正东', ...getStarInfo(1) },
  { star: 3, direction: '中央', ...getStarInfo(3) },
  { star: 5, direction: '正西', ...getStarInfo(5) },
  { star: 6, direction: '东北', ...getStarInfo(6) },
  { star: 8, direction: '正北', ...getStarInfo(8) },
  { star: 4, direction: '西北', ...getStarInfo(4) }
])

// 当前年份的飞星排布
const flyingStarPositions = ref<FlyingStarPosition[]>([...baseFlyingStars.value])

// 根据旋转角度重新排列飞星位置
const rotatedFlyingStarPositions = computed(() => {
  // 计算旋转步数（每45°为一步）
  const steps = Math.round(gridRotation.value / 45) % 8
  
  if (steps === 0) {
    return flyingStarPositions.value
  }
  
  // 九宫格位置索引映射（顺时针旋转）
  // 传统风水布局：0=东南, 1=正南, 2=西南, 3=正东, 4=中央, 5=正西, 6=东北, 7=正北, 8=西北
  // 正确的旋转顺序：正东(3)→东南(0)→正南(1)→西南(2)→正西(5)→西北(8)→正北(7)→东北(6)
  // 旋转映射：mapping[i] 表示旋转后位置i应该显示原来位置mapping[i]的内容
  const rotationMap: { [key: number]: number[] } = {
    1: [3, 0, 1, 6, 4, 2, 7, 8, 5], // 45°: 东南(0)←正东(3), 正南(1)←东南(0), 西南(2)←正南(1), 正东(3)←东北(6), 中央(4)←中央(4), 正西(5)←西南(2), 东北(6)←正北(7), 正北(7)←西北(8), 西北(8)←正西(5)
    2: [6, 3, 0, 7, 4, 1, 8, 5, 2], // 90°: 东南(0)←东北(6), 正南(1)←正东(3), 西南(2)←东南(0), 正东(3)←正北(7), 中央(4)←中央(4), 正西(5)←正南(1), 东北(6)←西北(8), 正北(7)←正西(5), 西北(8)←西南(2)
    3: [7, 6, 3, 8, 4, 0, 5, 2, 1], // 135°: 东南(0)←正北(7), 正南(1)←东北(6), 西南(2)←正东(3), 正东(3)←西北(8), 中央(4)←中央(4), 正西(5)←东南(0), 东北(6)←正西(5), 正北(7)←西南(2), 西北(8)←正南(1)
    4: [8, 7, 6, 5, 4, 3, 2, 1, 0], // 180°: 东南(0)←西北(8), 正南(1)←正北(7), 西南(2)←东北(6), 正东(3)←正西(5), 中央(4)←中央(4), 正西(5)←正东(3), 东北(6)←西南(2), 正北(7)←正南(1), 西北(8)←东南(0)
    5: [5, 8, 7, 2, 4, 6, 1, 0, 3], // 225°: 东南(0)←正西(5), 正南(1)←西北(8), 西南(2)←正北(7), 正东(3)←西南(2), 中央(4)←中央(4), 正西(5)←东北(6), 东北(6)←正南(1), 正北(7)←东南(0), 西北(8)←正东(3)
    6: [2, 5, 8, 1, 4, 7, 0, 3, 6], // 270°: 东南(0)←西南(2), 正南(1)←正西(5), 西南(2)←西北(8), 正东(3)←正南(1), 中央(4)←中央(4), 正西(5)←正北(7), 东北(6)←东南(0), 正北(7)←正东(3), 西北(8)←东北(6)
    7: [1, 2, 5, 0, 4, 8, 3, 6, 7]  // 315°: 东南(0)←正南(1), 正南(1)←西南(2), 西南(2)←正西(5), 正东(3)←东南(0), 中央(4)←中央(4), 正西(5)←西北(8), 东北(6)←正东(3), 正北(7)←东北(6), 西北(8)←正北(7)
  }
  
  const mapping = rotationMap[steps]
  if (!mapping) return flyingStarPositions.value
  
  return mapping.map(originalIndex => flyingStarPositions.value[originalIndex])
})

// 太岁位计算函数
const calculateTaiSuiPosition = (year: number) => {
  // 十二地支对应方位（精确映射到九宫格的八个方位）
  const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  // 将十二地支映射到九宫格的八个方位，相邻地支合并到最接近的主方位
  const directions = ['正北', '东北', '东北', '正东', '东南', '东南', '正南', '西南', '西南', '正西', '西北', '西北']
  
  // 计算年份对应的地支
  const branchIndex = (year - 4) % 12
  const branch = earthlyBranches[branchIndex]
  const direction = directions[branchIndex]
  
  return { branch, direction }
}

// 三煞位计算函数
const calculateSanShaPositions = (year: number) => {
  // 计算年份对应的地支
  const branchIndex = (year - 4) % 12
  const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  const branch = earthlyBranches[branchIndex]
  
  // 三煞位规律 - 只标识主要方位（正方位）
  const sanShaRules: { [key: string]: { mainPosition: string, direction: string } } = {
    // 申子辰年三煞在南方，主要标识正南
    '申': { mainPosition: '午', direction: '南方' },
    '子': { mainPosition: '午', direction: '南方' },
    '辰': { mainPosition: '午', direction: '南方' },
    
    // 亥卯未年三煞在西方，主要标识正西
    '亥': { mainPosition: '酉', direction: '西方' },
    '卯': { mainPosition: '酉', direction: '西方' },
    '未': { mainPosition: '酉', direction: '西方' },
    
    // 寅午戌年三煞在北方，主要标识正北
    '寅': { mainPosition: '子', direction: '北方' },
    '午': { mainPosition: '子', direction: '北方' },
    '戌': { mainPosition: '子', direction: '北方' },
    
    // 巳酉丑年三煞在东方，主要标识正东
    '巳': { mainPosition: '卯', direction: '东方' },
    '酉': { mainPosition: '卯', direction: '东方' },
    '丑': { mainPosition: '卯', direction: '东方' }
  }
  
  return sanShaRules[branch] || { mainPosition: '', direction: '' }
}

// 更新太岁位和三煞位
const updateTaiSuiAndSanSha = () => {
  const year = selectedYear.value
  
  // 计算太岁位
  const taiSui = calculateTaiSuiPosition(year)
  taiSuiPosition.value = taiSui.branch
  taiSuiDirection.value = taiSui.direction
  
  // 计算三煞位
  const sanSha = calculateSanShaPositions(year)
  sanShaPositions.value = sanSha.mainPosition ? [sanSha.mainPosition] : []
  sanShaDirection.value = sanSha.direction
}

// 判断某个方位是否为太岁位
const isTaiSuiPosition = (direction: string): boolean => {
  // 将九宫格方位映射到地支方位（完整映射，包含所有十二地支）
  const directionToBranch: { [key: string]: string[] } = {
    '正北': ['子'],
    '东北': ['丑', '寅'],
    '正东': ['卯'],
    '东南': ['辰', '巳'],
    '正南': ['午'],
    '西南': ['未', '申'],
    '正西': ['酉'],
    '西北': ['戌', '亥']
  }
  
  const branches = directionToBranch[direction] || []
  return branches.includes(taiSuiPosition.value)
}

// 判断某个方位是否为三煞位
const isSanShaPosition = (direction: string): boolean => {
  // 将九宫格方位映射到地支方位（完整映射，包含所有十二地支）
  const directionToBranch: { [key: string]: string[] } = {
    '正北': ['子'],
    '东北': ['丑', '寅'],
    '正东': ['卯'],
    '东南': ['辰', '巳'],
    '正南': ['午'],
    '西南': ['未', '申'],
    '正西': ['酉'],
    '西北': ['戌', '亥']
  }
  
  const branches = directionToBranch[direction] || []
  return branches.some(branch => sanShaPositions.value.includes(branch))
}

// 计算不同年份的飞星排布
const updateFlyingStars = () => {
  // 使用正确的九宫飞星计算方法
  // 2000年后计算公式：9 - (年份后两位数字之和)
  const year = selectedYear.value
  const lastTwoDigits = year % 100
  const digitSum = Math.floor(lastTwoDigits / 10) + (lastTwoDigits % 10)
  let centerStar = 9 - digitSum
  
  // 处理特殊情况
  if (centerStar <= 0) centerStar += 9
  if (centerStar > 9) centerStar -= 9
  
  // 按照九宫格显示位置排列，符合传统八卦顺序：东北-正北-西北-正东-中央-正西-东南-正南-西南
  // 传统风水九宫格布局：天南地北，左东右西
  // 0:东南 1:正南 2:西南
  // 3:正东 4:中央 5:正西  
  // 6:东北 7:正北 8:西北
  const gridDirections = ['东南', '正南', '西南', '正东', '中央', '正西', '东北', '正北', '西北']
  
  // 洛书轨迹顺序：中-西北-正西-东北-正南-正北-西南-正东-东南
  // 新的索引对应：东南=0, 正南=1, 西南=2, 正东=3, 中央=4, 正西=5, 东北=6, 正北=7, 西北=8
  const luoshuOrder = [4, 8, 5, 6, 1, 7, 2, 3, 0] // 对应gridDirections的索引
  
  // 根据中宫星计算各方位的星
  const newPositions: FlyingStarPosition[] = []
  
  // 先按洛书轨迹计算星宿
  const starsByLuoshu: number[] = []
  for (let i = 0; i < 9; i++) {
    let star = centerStar + i
    if (star > 9) star -= 9
    starsByLuoshu.push(star)
  }
  
  // 然后按九宫格位置排列
  for (let i = 0; i < 9; i++) {
    const luoshuIndex = luoshuOrder.indexOf(i)
    const star = starsByLuoshu[luoshuIndex]
    const starInfo = getStarInfo(star)
    
    newPositions.push({
      star,
      direction: gridDirections[i],
      ...starInfo
    })
  }
  
  flyingStarPositions.value = newPositions
  
  // 同时更新太岁位和三煞位
  updateTaiSuiAndSanSha()
}

// 文件上传处理
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

const handleFile = (file: File) => {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const onImageLoad = () => {
  showOverlay.value = true
}

// 控制功能
const toggleOverlay = () => {
  showOverlay.value = !showOverlay.value
}

const resetImage = () => {
  uploadedImage.value = null
  showOverlay.value = true
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const rotateGrid = (degrees: number) => {
  if (isRotating.value) return // 防止重复点击
  
  isRotating.value = true
  rotationDirection.value = degrees > 0 ? 'right' : 'left'
  
  gridRotation.value += degrees
  if (gridRotation.value >= 360) gridRotation.value -= 360
  if (gridRotation.value < 0) gridRotation.value += 360
  
  // 动画完成后重置状态
  setTimeout(() => {
    isRotating.value = false
    rotationDirection.value = null
  }, 600) // 稍长于CSS动画时间
}

// 飞星颜色和含义
const getStarColor = (star: number): string => {
  // 五颗吉星：一白贪狼、四绿文昌、六白武曲、八白左辅、九紫右弼
  const goodStars = [1, 4, 6, 8, 9]
  // 四颗凶星：二黑巨门、三碧禄存、五黄廉贞、七赤破军
  const badStars = [2, 3, 5, 7]
  
  if (goodStars.includes(star)) return 'bg-green-500'
  if (badStars.includes(star)) return 'bg-red-500'
  return 'bg-gray-500'
}

const getStarBgColor = (star: number): string => {
  // 五颗吉星：一白贪狼、四绿文昌、六白武曲、八白左辅、九紫右弼
  const goodStars = [1, 4, 6, 8, 9]
  // 四颗凶星：二黑巨门、三碧禄存、五黄廉贞、七赤破军
  const badStars = [2, 3, 5, 7]
  
  if (goodStars.includes(star)) return 'bg-green-50 dark:bg-green-900/20'
  if (badStars.includes(star)) return 'bg-red-50 dark:bg-red-900/20'
  return 'bg-gray-50 dark:bg-gray-900/20'
}

const getStarTextColor = (star: number): string => {
  // 五颗吉星：一白贪狼、四绿文昌、六白武曲、八白左辅、九紫右弼
  const goodStars = [1, 4, 6, 8, 9]
  // 四颗凶星：二黑巨门、三碧禄存、五黄廉贞、七赤破军
  const badStars = [2, 3, 5, 7]
  
  if (goodStars.includes(star)) return 'text-green-600 dark:text-green-400'
  if (badStars.includes(star)) return 'text-red-600 dark:text-red-400'
  return 'text-gray-600 dark:text-gray-400'
}

const getStarMeaning = (star: number): string => {
  const meanings: { [key: number]: string } = {
    1: '贪狼',
    2: '病符',
    3: '是非',
    4: '文昌',
    5: '五黄',
    6: '武曲',
    7: '破军',
    8: '财星',
    9: '喜庆'
  }
  return meanings[star] || ''
}

// 动态风水建议计算属性
const dynamicFengShuiAdvice = computed(() => {
  const advice = []
  
  // 定义建议模板
  const adviceTemplates = {
    fortune: {
      icon: '💰',
      title: '财运旺盛方位',
      borderColor: 'border-green-500',
      titleColor: 'text-green-800 dark:text-green-200',
      content: '大门或睡房在{directions}的小伙伴，今年财运不错哟！'
    },
    joy: {
      icon: '🎉',
      title: '喜事连连',
      borderColor: 'border-pink-500',
      titleColor: 'text-pink-800 dark:text-pink-200',
      content: '大门或睡房在{directions}的，今年家里容易有喜事哟，结婚或生小孩，搬新家！'
    },
    health: {
      icon: '⚠️',
      title: '健康注意',
      borderColor: 'border-yellow-500',
      titleColor: 'text-yellow-800 dark:text-yellow-200',
      content: '大门或睡房在房屋{directions}的，要特别注意身体，容易生病哟。容易因为官司破财。要注意肠胃问题。'
    },
    finance: {
      icon: '💸',
      title: '财务谨慎',
      borderColor: 'border-red-500',
      titleColor: 'text-red-800 dark:text-red-200',
      content: '大门或睡房在房屋{directions}的，今年要注意不要做太大的风险投资，容易有损失哟，也要注意财务情况，容易会有意外的损失。'
    }
  }
  
  // 收集各类型飞星的方位
  const fortuneDirections: string[] = [] // 财运方位（八白财星、一白贪狼星）
  const joyDirections: string[] = [] // 喜事方位（九紫喜庆星）
  const healthDirections: string[] = [] // 健康注意方位（二黑病符星、五黄煞星）
  const financeDirections: string[] = [] // 财务谨慎方位（七赤破军星、三碧是非星）
  
  // 遍历当前年份的飞星排布
  flyingStarPositions.value.forEach(position => {
    if (position.direction === '中央') return // 跳过中央位置
    
    switch (position.star) {
      case 1: // 一白贪狼星 - 财运
      case 8: // 八白财星 - 财运
        fortuneDirections.push(position.direction)
        break
      case 9: // 九紫喜庆星 - 喜事
        joyDirections.push(position.direction)
        break
      case 2: // 二黑病符星 - 健康注意
      case 5: // 五黄煞星 - 健康注意
        healthDirections.push(position.direction)
        break
      case 3: // 三碧是非星 - 财务谨慎
      case 7: // 七赤破军星 - 财务谨慎
        financeDirections.push(position.direction)
        break
    }
  })
  
  // 生成建议
  if (fortuneDirections.length > 0) {
    const template = adviceTemplates.fortune
    advice.push({
      ...template,
      directions: fortuneDirections.join('、'),
      content: template.content.replace('{directions}', fortuneDirections.join('、'))
    })
  }
  
  if (joyDirections.length > 0) {
    const template = adviceTemplates.joy
    advice.push({
      ...template,
      directions: joyDirections.join('、'),
      content: template.content.replace('{directions}', joyDirections.join('、'))
    })
  }
  
  if (healthDirections.length > 0) {
    const template = adviceTemplates.health
    advice.push({
      ...template,
      directions: healthDirections.join('、'),
      content: template.content.replace('{directions}', healthDirections.join('、'))
    })
  }
  
  if (financeDirections.length > 0) {
    const template = adviceTemplates.finance
    advice.push({
      ...template,
      directions: financeDirections.join('、'),
      content: template.content.replace('{directions}', financeDirections.join('、'))
    })
  }
  
  return advice
})

// 初始化
onMounted(() => {
  updateFlyingStars()
})
</script>

<style scoped>
/* 自定义样式 */
.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-rows-3 {
  grid-template-rows: repeat(3, 1fr);
}

/* 文字流动动画 */
@keyframes flow-text {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes flow-direction {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* 文字行数限制 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-none {
  display: block;
  -webkit-line-clamp: unset;
  -webkit-box-orient: unset;
  overflow: visible;
}

/* 容器震动动画 */
@keyframes shake-container {
  0%, 100% { transform: translateX(0) translateY(0); }
  10% { transform: translateX(-2px) translateY(-1px); }
  20% { transform: translateX(2px) translateY(1px); }
  30% { transform: translateX(-3px) translateY(-2px); }
  40% { transform: translateX(3px) translateY(2px); }
  50% { transform: translateX(-2px) translateY(-1px); }
  60% { transform: translateX(2px) translateY(1px); }
  70% { transform: translateX(-1px) translateY(-1px); }
  80% { transform: translateX(1px) translateY(1px); }
  90% { transform: translateX(-1px) translateY(0px); }
}

/* 背景闪烁动画 */
@keyframes background-flash {
  0% { 
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 0 rgba(59, 130, 246, 0.3);
  }
  25% { 
    background: rgba(59, 130, 246, 0.2);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  50% { 
    background: rgba(59, 130, 246, 0.3);
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.7);
  }
  75% { 
    background: rgba(59, 130, 246, 0.2);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  100% { 
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 0 rgba(59, 130, 246, 0.3);
  }
}

/* 脉冲增强动画 */
@keyframes pulse-enhanced {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.aspect-square {
  aspect-ratio: 1 / 1;
}

/* 滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>