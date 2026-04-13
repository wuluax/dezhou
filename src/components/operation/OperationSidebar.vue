<template>
  <aside class="sidebar">
    <h2 class="sidebar-title mb-4 px-1">⚙️ 操作栏</h2>
    <div class="border-t border-gray-200 dark:border-gray-700 mb-4 " />
    <div class="flex-1 overflow-y-auto space-y-6 pr-1">
      <QuickActions />
      <Settlement />
      <ThemeSettings />
      <SystemInfo />
    </div>
  </aside>
</template>

<script setup>
import QuickActions from './QuickActions.vue'
import Settlement from './Settlement.vue'
import ThemeSettings from './ThemeSettings.vue'
import SystemInfo from './SystemInfo.vue'
</script>
