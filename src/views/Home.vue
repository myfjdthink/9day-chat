<template>
  <div class="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
    <!-- SEO组件 -->
    <SEO 
      :title="t('home.seo.title')"
      :pageTitle="t('home.seo.pageTitle')"
      :description="t('home.seo.description')"
      :keywords="t('home.seo.keywords')"
    />
    
    <div class="max-w-6xl mx-auto">
      <!-- 面包屑导航 -->
      <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-4" aria-label="面包屑导航">
        <a href="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ t('common.home') }}</a>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900 dark:text-gray-100 font-medium">{{ t('home.breadcrumb.platform') }}</span>
      </nav>
      
      <!-- Welcome Section -->
      <div class="text-center mb-6 md:mb-8">
        <div class="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <img src="@/assets/logo.png" :alt="t('sidebar.logoAlt')" class="w-16 h-16 object-contain" />
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-3">{{ t('home.hero.title') }}</h1>
        <p class="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 md:mb-6">{{ t('home.hero.subtitle') }}</p>



        <!-- 首页直接提问入口（ChatGPT 风格） -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <!-- 左侧：八字分析输入组件 -->
          <div class="flex flex-col h-full">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
              <User class="w-4 h-4 text-green-500 mr-2" />
              {{ t('home.input.title') }}
            </h3>
            <Card class="bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 shadow-lg h-full">
              <CardContent class="p-4 sm:p-6 flex flex-col justify-between space-y-4">
                <!-- 性别选择 -->
                <div>
                  <label class="block text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('home.input.gender.label') }} <span class="text-red-500">*</span></label>
                  <div class="flex space-x-3">
                    <Button :variant="gender === '男' ? 'default' : 'outline'" @click="gender = '男'">{{ t('home.input.gender.male') }}</Button>
                    <Button :variant="gender === '女' ? 'default' : 'outline'" @click="gender = '女'">{{ t('home.input.gender.female') }}</Button>
                  </div>
                </div>

                <!-- 出生日期时间 -->
                <div>
                  <label class="block text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('home.input.birth.label') }} <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <Input type="datetime-local" v-model="birthDateTime" class="w-full" />
                    <CalendarIcon class="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                  <div class="mt-3 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
                    <div class="flex items-center space-x-2">
                      <CalendarIcon class="w-4 h-4 text-green-600" />
                      <span class="text-xs sm:text-sm text-green-800 dark:text-green-200">
                        {{ t('home.input.birth.selected') }}：{{ formatDateTime(birthDateTime) }} <span class="text-green-600">({{ t('home.input.birth.newCalendar') }})</span>
                      </span>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-300 mt-2">{{ t('home.input.birth.hint') }}</p>
                </div>

                <!-- 开始分析与十年运势按钮 -->
                <div class="pt-2 pb-2 flex flex-wrap gap-3">
                  <Button size="lg" variant="default" :disabled="isAnalyzing" @click="handleStartAnalysisHome">
                    <Star class="w-5 h-5 mr-2" />
                    {{ isAnalyzing ? t('common.loading.analyzing') : t('common.startAnalysisButton') }}
                  </Button>
                  <Button size="lg" variant="default" :disabled="isAnalyzing" @click="handleStartTenYearsHome">
                    <Star class="w-5 h-5 mr-2" />
                    {{ t('home.tenYears.cta') }}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- 右侧：对话输入组件 -->
          <div class="flex flex-col h-full">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
              <MessageCircle class="w-4 h-4 text-purple-500 mr-2" />
              {{ t('common.aiChatLabel') }}
            </h3>
            <Card class="bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 shadow-lg h-full">
              <CardContent class="p-4 sm:p-6 flex flex-col justify-between">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <MessageCircle class="w-4 h-4 mr-2 text-purple-500" />
                    {{ t('common.enterToSend') }}
                  </div>
                </div>
                <div class="relative">
                  <textarea
                    ref="homeChatInputRef"
                    v-model="homeChatInput"
                    @keydown="handleHomeKeydown"
                    @input="handleHomeInput"
                    rows="7"
                    :placeholder="t('common.askPlaceholder')"
                    class="w-full resize-none rounded-2xl bg-transparent border border-gray-300 dark:border-gray-700 px-4 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[10rem] sm:min-h-[13rem] overflow-y-auto"
                  />
                </div>
                <div class="pt-2 pb-2">
                  <Button size="lg" variant="default" :disabled="isChatSending" @click="handleHomeChatSubmit">
                    <Send class="w-5 h-5 mr-2" />
                    {{ isChatSending ? t('common.loading.sending') : t('common.startChatCTA') }}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div class="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 md:hidden">{{ t('home.chat.carryHint') }}</div>
          </div>
        </div>
      </div>

      <!-- 功能展示区域 -->
      <div class="mb-8">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">{{ t('home.coreFeaturesTitle') }}</h2>
        
        <!-- 功能卡片网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <!-- AI智能对话 -->
          <Card class="hover:shadow-lg transition-shadow dark:bg-gray-800 group cursor-pointer" @click="router.push('/chat')">
            <CardContent class="p-4 md:p-6">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MessageCircle class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('home.card.chat.title') }}</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">{{ t('home.card.chat.desc') }}</p>
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
                <div class="text-xs text-blue-600 dark:text-blue-300 font-medium mb-1">{{ t('home.card.examples.label') }}</div>
                <div class="text-xs text-blue-700 dark:text-blue-200">
                  "{{ t('home.card.examples.q1') }}"<br>
                  "{{ t('home.card.examples.q2') }}"<br>
                  "{{ t('home.card.examples.q3') }}"
                </div>
              </div>
              <div class="flex items-center text-sm text-blue-600 dark:text-blue-300">
                <span>{{ t('home.card.cta.chat') }}</span>
                <ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>

          <!-- 八字运势分析 -->
          <Card class="hover:shadow-lg transition-shadow dark:bg-gray-800 group cursor-pointer" @click="router.push('/analysis')">
            <CardContent class="p-4 md:p-6">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Star class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('home.card.analysis.title') }}</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">{{ t('home.card.analysis.desc') }}</p>
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-3">
                <div class="text-xs text-green-600 dark:text-green-300 font-medium mb-1">{{ t('home.analysis.content.title') }}</div>
                <div class="text-xs text-green-700 dark:text-green-200">
                  • {{ t('home.analysis.content.items.basic') }}<br>
                  • {{ t('home.analysis.content.items.elements') }}<br>
                  • {{ t('home.analysis.content.items.aiPrediction') }}<br>
                  • {{ t('home.analysis.content.items.score') }}
                </div>
              </div>
              <div class="flex items-center text-sm text-green-600 dark:text-green-300">
                <span>{{ t('home.card.cta.analysis') }}</span>
                <ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>

          <!-- 择日推荐 -->
          <Card class="hover:shadow-lg transition-shadow dark:bg-gray-800 group cursor-pointer" @click="router.push('/calendar')">
            <CardContent class="p-4 md:p-6">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Calendar class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('home.card.calendar.title') }}</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">{{ t('home.card.calendar.desc') }}</p>
              <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-3">
                <div class="text-xs text-purple-600 dark:text-purple-300 font-medium mb-1">{{ t('home.calendar.scenarios.title') }}</div>
                <div class="text-xs text-purple-700 dark:text-purple-200">
                  • {{ t('home.calendar.scenarios.items.love') }}<br>
                  • {{ t('home.calendar.scenarios.items.opening') }}<br>
                  • {{ t('home.calendar.scenarios.items.moving') }}<br>
                  • {{ t('home.calendar.scenarios.items.travel') }}
                </div>
              </div>
              <div class="flex items-center text-sm text-purple-600 dark:text-purple-300">
                <span>{{ t('home.card.cta.calendar') }}</span>
                <ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>

          <!-- 生肖运势 -->
          <Card class="hover:shadow-lg transition-shadow dark:bg-gray-800 group cursor-pointer" @click="router.push('/zodiac-fortune')">
            <CardContent class="p-4 md:p-6">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Zap class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('home.card.zodiac.title') }}</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">{{ t('home.card.zodiac.desc') }}</p>
              <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mb-3">
                <div class="text-xs text-orange-600 dark:text-orange-300 font-medium mb-1">{{ t('home.zodiac.content.title') }}</div>
                <div class="text-xs text-orange-700 dark:text-orange-200">
                  • {{ t('home.zodiac.content.items.todayScore') }}<br>
                  • {{ t('home.zodiac.content.items.careerFinance') }}<br>
                  • {{ t('home.zodiac.content.items.healthLove') }}<br>
                  • {{ t('home.zodiac.content.items.advice') }}
                </div>
              </div>
              <div class="flex items-center text-sm text-orange-600 dark:text-orange-300">
                <span>{{ t('home.card.cta.zodiac') }}</span>
                <ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- 新增功能区域 -->
        <div class="mb-8">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">{{ t('home.fengshui.title') }}</h2>
          
          <!-- 流年风水卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-8">
            <Card class="hover:shadow-lg transition-shadow dark:bg-gray-800 group cursor-pointer" @click="router.push('/fengshui-fortune')">
              <CardContent class="p-4 md:p-6">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <span class="text-white text-lg">🏠</span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('home.fengshui.card.title') }}</h3>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mb-3">{{ t('home.fengshui.card.desc') }}</p>
                <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 mb-3">
                  <div class="text-xs text-indigo-600 dark:text-indigo-300 font-medium mb-1">{{ t('home.fengshui.card.features.title') }}</div>
                  <div class="text-xs text-indigo-700 dark:text-indigo-200">
                    • {{ t('home.fengshui.card.features.items.upload') }}<br>
                    • {{ t('home.fengshui.card.features.items.overlay') }}<br>
                    • {{ t('home.fengshui.card.features.items.adjust') }}<br>
                    • {{ t('home.fengshui.card.features.items.mapping') }}
                  </div>
                </div>
                <div class="flex items-center text-sm text-indigo-600 dark:text-indigo-300">
                  <span>{{ t('home.fengshui.card.cta') }}</span>
                  <ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- 今日黄历动态展示 -->
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">{{ t('home.almanac.title') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span class="text-yellow-500 mr-2">🌅</span>
                {{ t('home.almanac.yiji.title') }}
              </h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="text-green-600 dark:text-green-400 font-medium mr-2">{{ t('home.almanac.yiji.yi') }}：</span>
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.almanac.yiji.sampleYi') }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-red-600 dark:text-red-400 font-medium mr-2">{{ t('home.almanac.yiji.ji') }}：</span>
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.almanac.yiji.sampleJi') }}</span>
                </div>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span class="text-purple-500 mr-2">🔮</span>
                {{ t('home.almanac.gua.title') }}
              </h4>
              <div class="text-center">
                <div class="text-2xl mb-2">☰☲</div>
                <div class="font-medium text-gray-900 dark:text-gray-100">{{ t('home.almanac.gua.name') }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mt-2">{{ t('home.almanac.gua.desc') }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 命理知识科普 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">{{ t('home.knowledge.title') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span class="text-blue-500 mr-2">🎯</span>
                {{ t('home.knowledge.items.whatIsBazi.title') }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{{ t('home.knowledge.items.whatIsBazi.desc') }}</p>
              <div class="text-xs text-blue-600 dark:text-blue-400">
                <span class="font-medium">{{ t('home.knowledge.items.whatIsBazi.keywordsLabel') }}</span>{{ t('home.knowledge.items.whatIsBazi.keywords') }}
              </div>
            </div>
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span class="text-green-500 mr-2">⚡</span>
                {{ t('home.knowledge.items.fiveElements.title') }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{{ t('home.knowledge.items.fiveElements.desc') }}</p>
              <div class="text-xs text-green-600 dark:text-green-400">
                <span class="font-medium">{{ t('home.knowledge.items.fiveElements.keywordsLabel') }}</span>{{ t('home.knowledge.items.fiveElements.keywords') }}
              </div>
            </div>
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span class="text-purple-500 mr-2">🌟</span>
                {{ t('home.knowledge.items.usefulElements.title') }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{{ t('home.knowledge.items.usefulElements.desc') }}</p>
              <div class="text-xs text-purple-600 dark:text-purple-400">
                <span class="font-medium">{{ t('home.knowledge.items.usefulElements.keywordsLabel') }}</span>{{ t('home.knowledge.items.usefulElements.keywords') }}
              </div>
            </div>
          </div>
        </div>

        <!-- 使用流程说明 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">{{ t('home.steps.title') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white font-bold text-lg">1</span>
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.steps.items.register.title') }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.steps.items.register.descPrefix') }}<a href="/register" class="text-blue-600 dark:text-blue-400 hover:underline">{{ t('home.steps.links.register') }}</a>{{ t('home.steps.items.register.descSuffix') }}</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white font-bold text-lg">2</span>
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.steps.items.chart.title') }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.steps.items.chart.descPrefix') }}<a href="/analysis" class="text-blue-600 dark:text-blue-400 hover:underline">{{ t('home.steps.links.analysis') }}</a>{{ t('home.steps.items.chart.descSuffix') }}</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white font-bold text-lg">3</span>
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.steps.items.services.title') }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300"><a href="/chat" class="text-blue-600 dark:text-blue-400 hover:underline">{{ t('home.steps.links.chat') }}</a>问答、<a href="/zodiac-fortune" class="text-blue-600 dark:text-blue-400 hover:underline">{{ t('home.steps.links.zodiac') }}</a>、<a href="/calendar" class="text-blue-600 dark:text-blue-400 hover:underline">{{ t('home.steps.links.calendar') }}</a>{{ t('home.steps.items.services.descSuffix') }}</p>
            </div>
          </div>
        </div>

        <!-- 效果预览区域 -->
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 md:p-8 mb-8">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">{{ t('home.testimonials.title') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white text-sm font-bold">{{ t('home.testimonials.items.1.nameAbbr') }}</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-gray-100">{{ t('home.testimonials.items.1.nameFull') }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('home.testimonials.items.1.job') }}</div>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300">"{{ t('home.testimonials.items.1.quote') }}"</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white text-sm font-bold">{{ t('home.testimonials.items.2.nameAbbr') }}</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-gray-100">{{ t('home.testimonials.items.2.nameFull') }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('home.testimonials.items.2.job') }}</div>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300">"{{ t('home.testimonials.items.2.quote') }}"</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white text-sm font-bold">{{ t('home.testimonials.items.3.nameAbbr') }}</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-gray-100">{{ t('home.testimonials.items.3.nameFull') }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('home.testimonials.items.3.job') }}</div>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300">"{{ t('home.testimonials.items.3.quote') }}"</p>
            </div>
          </div>
        </div>

        <!-- FAQ常见问题 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">{{ t('home.faq.title') }}</h3>
          <div class="space-y-6">
            <!-- 八字分析相关 -->
            <div class="border-l-4 border-blue-500 pl-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.faq.sections.bazi.title') }}</h4>
              <div class="space-y-3">
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">{{ t('home.faq.sections.bazi.qa1.q') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.faq.sections.bazi.qa1.a') }}</p>
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">{{ t('home.faq.sections.bazi.qa2.q') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.faq.sections.bazi.qa2.a') }}</p>
                </div>
              </div>
            </div>

            <!-- 择日推荐相关 -->
            <div class="border-l-4 border-green-500 pl-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.faq.sections.calendar.title') }}</h4>
              <div class="space-y-3">
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">{{ t('home.faq.sections.calendar.qa1.q') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.faq.sections.calendar.qa1.a') }}</p>
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">{{ t('home.faq.sections.calendar.qa2.q') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.faq.sections.calendar.qa2.a') }}</p>
                </div>
              </div>
            </div>

            <!-- 生肖运势相关 -->
            <div class="border-l-4 border-purple-500 pl-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.faq.sections.zodiac.title') }}</h4>
              <div class="space-y-3">
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">{{ t('home.faq.sections.zodiac.qa1.q') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.faq.sections.zodiac.qa1.a') }}</p>
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">{{ t('home.faq.sections.zodiac.qa2.q') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.faq.sections.zodiac.qa2.a') }}</p>
                </div>
              </div>
            </div>

            <!-- 在线算命相关 -->
            <div class="border-l-4 border-orange-500 pl-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.faq.sections.ai.title') }}</h4>
              <div class="space-y-3">
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">{{ t('home.faq.sections.ai.qa1.q') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.faq.sections.ai.qa1.a') }}</p>
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">{{ t('home.faq.sections.ai.qa2.q') }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('home.faq.sections.ai.qa2.a') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 社交媒体信息区块 -->
      <div class="mt-6 md:mt-8">
        <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 text-center">
          <h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">{{ t('home.contact.title') }}</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-3 md:mb-4">{{ t('home.contact.description') }}</p>
          <div class="flex flex-wrap justify-center gap-2 md:gap-4">
            <!-- QQ 复制 -->
            <button
              @click="copyQQ"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 transition cursor-pointer"
            >
              <span class="text-xl">🐧</span>
              <span>{{ t('home.contact.qq') }}</span>
            </button>
            <!-- 邮箱 -->
            <a
              href="mailto:3960688438@qq.com"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-800 transition"
            >
              <span class="text-xl">📧</span>
              <span>{{ t('home.contact.email') }}</span>
            </a>
            <!-- Twitter -->
            <a
              href="https://twitter.com/WaterJ3201"
              target="_blank" rel="noopener"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <span class="text-xl">𝕏</span>
              <span>{{ t('home.contact.twitter') }}</span>
            </a>
            <!-- 小红书 -->
            <a
              href="https://www.xiaohongshu.com/user/profile/621b22980000000010004579"
              target="_blank" rel="noopener"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-pink-50 dark:bg-pink-900 text-pink-700 dark:text-pink-200 rounded-lg border border-pink-200 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-800 transition"
            >
              <span class="text-xl">🍠</span>
              <span>{{ t('home.contact.xhs') }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Home, MessageCircle, Star, User, Users, BarChart3, TrendingUp, ArrowRight, Calendar, Zap, Send, CalendarIcon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
// 采用自定义 textarea 实现更贴近 ChatGPT 的输入体验
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import SEO from '@/components/SEO.vue' // 导入 SEO 组件
import Input from '@/components/ui/Input.vue'
import dayjs from 'dayjs'
import { ref } from 'vue'
import * as I18n from 'vue-i18n'

const router = useRouter()
const { useI18n } = I18n as any
const { t } = useI18n()

// 首页提问入口状态与提交
const homeChatInput = ref('')
const isChatSending = ref(false)
const homeChatInputRef = ref<HTMLTextAreaElement | null>(null)
const handleHomeInput = (e: Event) => {
  const el = e.target as HTMLTextAreaElement
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 240) + 'px'
}
const handleHomeChatSubmit = async () => {
  const q = homeChatInput.value.trim()
  if (!q) return
  isChatSending.value = true
  await router.push({ path: '/chat', query: { q } })
  setTimeout(() => { isChatSending.value = false }, 600)
}

 // 首页输入框键盘行为：Enter 发送，Shift+Enter 换行
 const handleHomeKeydown = (e: KeyboardEvent) => {
   if (e.key === 'Enter' && !e.shiftKey) {
     e.preventDefault()
     handleHomeChatSubmit()
   }
 }

// 八字分析输入区域状态
const gender = ref<'男' | '女'>('男')
const birthDateTime = ref<string>('1999-09-09T09:09')
const isAnalyzing = ref(false)
const formatDateTime = (dt: string): string => dayjs(dt).format('YYYY-MM-DD HH:mm:ss')
const handleStartAnalysisHome = async () => {
  if (!birthDateTime.value) { alert('请选择出生日期时间'); return }
  isAnalyzing.value = true
  await router.push({ path: '/analysis', query: { gender: gender.value, birth: birthDateTime.value, auto: '1' } })
  setTimeout(() => { isAnalyzing.value = false }, 800)
}

const handleStartTenYearsHome = async () => {
  if (!birthDateTime.value) { alert('请选择出生日期时间'); return }
  isAnalyzing.value = true
  await router.push({ path: '/analysis', query: { gender: gender.value, birth: birthDateTime.value, auto10y: '1' } })
  setTimeout(() => { isAnalyzing.value = false }, 800)
}

 // 复制QQ号码到剪贴板
 function copyQQ() {
   const qq = '3960688438'
   navigator.clipboard.writeText(qq).then(() => {
     // 简单提示，实际项目可用 ElMessage 或自定义弹窗
     alert('QQ号码已复制到剪贴板：' + qq)
   }).catch(() => {
     alert('复制失败，请手动复制：' + qq)
   })
 }
</script>
