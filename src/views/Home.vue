<template>
  <div class="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
    <!-- SEO组件 -->
    <SEO 
      title="北斗九号日历 - 免费八字排盘|在线算命|AI智能命理分析平台"
      pageTitle="首页"
      description="北斗九号日历是专业的免费八字排盘和在线算命平台，提供AI智能命理预测、生辰八字分析、择日推荐、生肖运势查询等服务。基于传统命理学理论与现代AI技术，为用户提供精准的运势分析、人生指导和决策建议。支持四柱预测、用神分析、五行相生相克等专业功能，立即体验免费八字分析服务。"
      keywords="免费八字排盘,在线算命,AI命理分析,生辰八字,四柱预测,用神分析,五行相生相克,择日推荐,生肖运势,命理咨询,智能预测,运势分析,北斗九号日历,八字分析,命理问答,黄历择日,AI智能算命"
    />
    
    <div class="max-w-6xl mx-auto">
      <!-- 面包屑导航 -->
      <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-4" aria-label="面包屑导航">
        <a href="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">首页</a>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900 dark:text-gray-100 font-medium">AI智能八字运势分析平台</span>
      </nav>
      
      <!-- Welcome Section -->
      <div class="text-center mb-6 md:mb-8">
        <div class="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <img src="@/assets/logo.png" alt="北斗九号日历Logo - AI智能八字运势分析与择日推荐平台" class="w-16 h-16 object-contain" />
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-3">免费八字排盘 · AI智能算命平台</h1>
        <p class="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 md:mb-6">专业生辰八字分析、在线算命问答、黄历择日推荐、生肖运势预测，传统命理与AI技术完美结合</p>

        <div class="flex flex-col md:flex-row justify-center items-center md:space-x-4 space-y-2 md:space-y-0">
          <Button
            size="lg"
            variant="default"
            @click="router.push('/chat')"
          >
            <MessageCircle class="w-5 h-5 mr-2" />
            开始命理问答
          </Button>
          <Button
            size="lg"
            variant="outline"
            @click="router.push('/analysis')"
          >
            <Star class="w-5 h-5 mr-2" />
            八字运势分析
          </Button>
        </div>
      </div>

      <!-- 功能展示区域 -->
      <div class="mb-8">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">🎯 核心功能展示</h2>
        
        <!-- 功能卡片网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <!-- AI智能对话 -->
          <Card class="hover:shadow-lg transition-shadow dark:bg-gray-800 group cursor-pointer" @click="router.push('/chat')">
            <CardContent class="p-4 md:p-6">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MessageCircle class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">命理问答</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">专业解答八字运势、生活、事业等多领域问题，为您指引人生方向</p>
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
                <div class="text-xs text-blue-600 dark:text-blue-300 font-medium mb-1">💡 使用示例</div>
                <div class="text-xs text-blue-700 dark:text-blue-200">
                  "请分析我的八字用神"<br>
                  "我适合做什么工作？"<br>
                  "我的感情运势如何？"
                </div>
              </div>
              <div class="flex items-center text-sm text-blue-600 dark:text-blue-300">
                <span>立即体验</span>
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
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">八字运势分析</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">基于传统命理学的专业八字分析，精准预测你的当年当月运势与注意事项</p>
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-3">
                <div class="text-xs text-green-600 dark:text-green-300 font-medium mb-1">📊 分析内容</div>
                <div class="text-xs text-green-700 dark:text-green-200">
                  • 基础八字分析<br>
                  • 用神喜忌分析<br>
                  • AI智能预测<br>
                  • 运势评分
                </div>
              </div>
              <div class="flex items-center text-sm text-green-600 dark:text-green-300">
                <span>开始分析</span>
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
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">择日推荐</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">智能推荐黄道吉日，为重要事项选择最佳时机，趋吉避凶</p>
              <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-3">
                <div class="text-xs text-purple-600 dark:text-purple-300 font-medium mb-1">🎯 适用场景</div>
                <div class="text-xs text-purple-700 dark:text-purple-200">
                  • 感情择日<br>
                  • 开业择日<br>
                  • 搬家择日<br>
                  • 出行择日
                </div>
              </div>
              <div class="flex items-center text-sm text-purple-600 dark:text-purple-300">
                <span>选择吉日</span>
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
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">生肖运势</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-3">每日生肖运势分析，了解今日吉凶，把握良机，趋利避害</p>
              <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mb-3">
                <div class="text-xs text-orange-600 dark:text-orange-300 font-medium mb-1">📈 运势内容</div>
                <div class="text-xs text-orange-700 dark:text-orange-200">
                  • 今日运势评分<br>
                  • 事业财运分析<br>
                  • 健康感情运势<br>
                  • 吉凶建议
                </div>
              </div>
              <div class="flex items-center text-sm text-orange-600 dark:text-orange-300">
                <span>查看运势</span>
                <ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- 今日黄历动态展示 -->
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">📅 今日黄历 · 每日一卦</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span class="text-yellow-500 mr-2">🌅</span>
                今日宜忌
              </h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="text-green-600 dark:text-green-400 font-medium mr-2">宜：</span>
                  <span class="text-sm text-gray-600 dark:text-gray-300">祈福、开市、签约、出行</span>
                </div>
                <div class="flex items-center">
                  <span class="text-red-600 dark:text-red-400 font-medium mr-2">忌：</span>
                  <span class="text-sm text-gray-600 dark:text-gray-300">动土、破土、安葬</span>
                </div>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span class="text-purple-500 mr-2">🔮</span>
                每日一卦
              </h4>
              <div class="text-center">
                <div class="text-2xl mb-2">☰☲</div>
                <div class="font-medium text-gray-900 dark:text-gray-100">天火同人卦</div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mt-2">天火同人，志同道合。事业顺利，贵人相助。</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 命理知识科普 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">📚 命理知识科普</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span class="text-blue-500 mr-2">🎯</span>
                什么是八字？
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">八字又称四柱，是根据出生年、月、日、时的天干地支组合，形成八个字，用于分析人的命运轨迹。</p>
              <div class="text-xs text-blue-600 dark:text-blue-400">
                <span class="font-medium">关键词：</span>免费八字排盘、生辰八字、四柱预测
              </div>
            </div>
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span class="text-green-500 mr-2">⚡</span>
                五行相生相克
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">金、木、水、火、土五行之间存在相生相克关系，是AI命理分析的核心理论基础。</p>
              <div class="text-xs text-green-600 dark:text-green-400">
                <span class="font-medium">关键词：</span>五行分析、相生相克、命理基础
              </div>
            </div>
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <span class="text-purple-500 mr-2">🌟</span>
                用神与忌神
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">用神是八字中最需要的五行，忌神是最不利的五行。准确判断用神忌神是在线算命的关键。</p>
              <div class="text-xs text-purple-600 dark:text-purple-400">
                <span class="font-medium">关键词：</span>用神分析、忌神判断、AI智能预测
              </div>
            </div>
          </div>
        </div>

        <!-- 使用流程说明 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">🚀 三步解锁您的命运密码</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white font-bold text-lg">1</span>
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">快速注册体验</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">30秒<a href="/register" class="text-blue-600 dark:text-blue-400 hover:underline">免费注册</a>，立即开启专属AI命理分析服务</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white font-bold text-lg">2</span>
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">智能八字排盘</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">输入生辰信息，获得专业<a href="/analysis" class="text-blue-600 dark:text-blue-400 hover:underline">免费八字排盘</a>和AI智能分析</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white font-bold text-lg">3</span>
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">全方位命理服务</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300"><a href="/chat" class="text-blue-600 dark:text-blue-400 hover:underline">在线算命</a>问答、<a href="/zodiac-fortune" class="text-blue-600 dark:text-blue-400 hover:underline">生肖运势</a>、<a href="/calendar" class="text-blue-600 dark:text-blue-400 hover:underline">择日推荐</a>一站搞定</p>
            </div>
          </div>
        </div>

        <!-- 效果预览区域 -->
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 md:p-8 mb-8">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">✨ 用户真实体验</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white text-sm font-bold">张</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-gray-100">张先生</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">企业高管</div>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300">"AI对话功能很实用，帮我分析了事业运势，建议很中肯，对决策很有帮助！"</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white text-sm font-bold">李</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-gray-100">李女士</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">创业者</div>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300">"择日功能太棒了！开业选的日子确实很顺利，生意红火，感谢推荐！"</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white text-sm font-bold">王</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-gray-100">王先生</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">上班族</div>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300">"每日生肖运势很准确，帮我避开了很多麻烦，现在每天都会查看！"</p>
            </div>
          </div>
        </div>

        <!-- FAQ常见问题 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">❓ 常见问题解答 (FAQ)</h3>
          <div class="space-y-6">
            <!-- 八字分析相关 -->
            <div class="border-l-4 border-blue-500 pl-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">🎯 关于八字分析</h4>
              <div class="space-y-3">
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">Q: 免费八字排盘准确吗？</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">A: 我们的AI智能八字排盘系统基于传统命理学理论，结合现代算法，确保排盘的准确性。所有计算都经过严格验证。</p>
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">Q: 八字分析需要提供哪些信息？</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">A: 只需提供准确的出生年月日时和出生地点，我们的系统就能为您生成详细的八字分析报告。</p>
                </div>
              </div>
            </div>

            <!-- 择日推荐相关 -->
            <div class="border-l-4 border-green-500 pl-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">📅 关于个人运历择日推荐</h4>
              <div class="space-y-3">
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">Q: 择日推荐的依据是什么？</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">A: 我们综合考虑黄历宜忌、个人八字、五行相配等多个因素，为您推荐最适合的吉日良辰。</p>
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">Q: 可以为哪些事情择日？</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">A: 支持开业、结婚、搬家、出行、签约等各类重要事项的择日推荐，帮您趋吉避凶。</p>
                </div>
              </div>
            </div>

            <!-- 生肖运势相关 -->
            <div class="border-l-4 border-purple-500 pl-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">🐲 关于生肖运势</h4>
              <div class="space-y-3">
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">Q: 生肖运势多久更新一次？</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">A: 我们每日更新生肖运势，包括事业、财运、感情、健康等各方面的运势分析和建议。</p>
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">Q: 生肖运势的准确性如何？</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">A: 基于传统生肖理论和现代统计学方法，结合AI算法分析，为您提供参考性的运势指导。</p>
                </div>
              </div>
            </div>

            <!-- 在线算命相关 -->
            <div class="border-l-4 border-orange-500 pl-4">
              <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">🤖 关于AI命理问答</h4>
              <div class="space-y-3">
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">Q: AI命理分析可靠吗？</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">A: 我们的AI系统学习了大量传统命理典籍和实践案例，能够提供专业的命理分析和人生指导建议。</p>
                </div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200 mb-1">Q: 可以问哪些类型的问题？</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">A: 支持事业发展、感情婚姻、财运分析、健康状况、学业考试等各个方面的命理咨询。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 社交媒体信息区块 -->
      <div class="mt-6 md:mt-8">
        <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 text-center">
          <h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">联系我们</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-3 md:mb-4">欢迎通过以下方式与我们交流：</p>
          <div class="flex flex-wrap justify-center gap-2 md:gap-4">
            <!-- QQ 复制 -->
            <button
              @click="copyQQ"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 transition cursor-pointer"
            >
              <span class="text-xl">🐧</span>
              <span>QQ号码</span>
            </button>
            <!-- 邮箱 -->
            <a
              href="mailto:3960688438@qq.com"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-800 transition"
            >
              <span class="text-xl">📧</span>
              <span>邮件联系</span>
            </a>
            <!-- Twitter -->
            <a
              href="https://twitter.com/WaterJ3201"
              target="_blank" rel="noopener"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <span class="text-xl">𝕏</span>
              <span>Twitter</span>
            </a>
            <!-- 小红书 -->
            <a
              href="https://www.xiaohongshu.com/user/profile/621b22980000000010004579"
              target="_blank" rel="noopener"
              class="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-pink-50 dark:bg-pink-900 text-pink-700 dark:text-pink-200 rounded-lg border border-pink-200 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-800 transition"
            >
              <span class="text-xl">🍠</span>
              <span>小红书</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Home, MessageCircle, Star, User, Users, BarChart3, TrendingUp, ArrowRight, Calendar, Zap } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import SEO from '@/components/SEO.vue' // 导入 SEO 组件

// QQ号码点击复制功能
import { ref } from 'vue'

const router = useRouter()

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