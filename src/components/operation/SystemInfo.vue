<template>
  <section>
    <h3 class="section-title">ℹ️ 系统信息</h3>
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
      <!-- 基本信息 -->
      <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
        <div class="flex justify-between"><span>当前版本</span><span class="text-gray-700 dark:text-gray-300">26.1</span></div>
        <div class="flex justify-between"><span>更新时间</span><span class="text-gray-700 dark:text-gray-300">2026-04-13</span></div>
        <div class="flex justify-between"><span>开发者</span><span class="text-gray-700 dark:text-gray-300">燕子</span></div>
        <div class="flex justify-between"><span>联系方式</span><span class="text-gray-700 dark:text-gray-300">wulua@qq.com</span></div>
      </div>

      <!-- 分隔栏 -->
      <div class="border-t border-gray-200 dark:border-gray-700 my-3" />

      <!-- 更新信息 -->
      <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">📃 更新日志</p>
      <div class="space-y-2">
        <div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 px-3 py-2.5 text-xs">
          <div class="flex items-center justify-between mb-1">
            <span class="font-semibold text-gray-700 dark:text-gray-300">v26.1</span>
            <span class="text-gray-400 dark:text-gray-500">2026-04-13</span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">📱适配手机端布局，新增拖拽功能~</p>
        </div>        
        <div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 px-3 py-2.5 text-xs">
          <div class="flex items-center justify-between mb-1">
            <span class="font-semibold text-gray-700 dark:text-gray-300">v26.0</span>
            <span class="text-gray-400 dark:text-gray-500">2026-04-10</span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">作者重装服务器不小心把代码删了喵=w=~重新用ClaudeCode做了一个全新版本 🚀</p>
        </div>
        <div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 px-3 py-2.5 text-xs">
          <div class="flex items-center justify-between mb-1">
            <span class="font-semibold text-gray-700 dark:text-gray-300">v3.x</span>
            <span class="text-gray-400 dark:text-gray-500">2025-09</span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Trae开发，使用时长最久的版本 🤖</p>
        </div>        
        <div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 px-3 py-2.5 text-xs">
          <div class="flex items-center justify-between mb-1">
            <span class="font-semibold text-gray-700 dark:text-gray-300">v2.x</span>
            <span class="text-gray-400 dark:text-gray-500">2025-08</span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">首个PC-Web版，v3.0的雏形 🐥</p>
        </div>
        <div class="rounded-lg bg-gray-50 dark:bg-gray-700/50 px-3 py-2.5 text-xs">
          <div class="flex items-center justify-between mb-1">
            <span class="font-semibold text-gray-700 dark:text-gray-300">v1.x</span>
            <span class="text-gray-400 dark:text-gray-500">2025-06</span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">用Python做的上古版本，修不完的bug 😭</p>
        </div>
      </div>
    </div>
  </section>
</template>
