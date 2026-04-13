<template>
  <div class="h-screen flex flex-col lg:flex-row overflow-hidden">
    <!-- Transfer records panel -->
    <div
      v-show="activeTab === 'transfers'"
      class="panel-section flex-1 overflow-hidden sidebar-panel p-4
             lg:flex-initial lg:w-72 lg:shrink-0 lg:border-r"
    >
      <TransferSidebar />
    </div>

    <!-- Chip table panel -->
    <div
      v-show="activeTab === 'table'"
      class="panel-section flex-1 overflow-hidden p-3 sm:p-4 lg:p-5
             lg:min-w-0"
    >
      <ChipTable />
    </div>

    <!-- Operations panel -->
    <div
      v-show="activeTab === 'operations'"
      class="panel-section flex-1 overflow-hidden sidebar-panel p-4
             lg:flex-initial lg:w-80 lg:shrink-0 lg:border-l"
    >
      <OperationSidebar />
    </div>

    <!-- Mobile bottom tab bar -->
    <nav class="mobile-tabbar lg:hidden shrink-0 flex border-t border-gray-200 dark:border-gray-800
                bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex-1 flex flex-col items-center justify-center py-2 transition-colors cursor-pointer"
        :class="activeTab === tab.key
          ? 'text-blue-500 dark:text-blue-400'
          : 'text-gray-400 dark:text-gray-500'"
        @click="activeTab = tab.key"
      >
        <span class="text-xl leading-none">{{ tab.icon }}</span>
        <span class="text-[10px] mt-1 font-medium">{{ tab.label }}</span>
      </button>
    </nav>

    <!-- Toast notifications -->
    <ToastContainer />

    <!-- Sakura falling petals (only in sakura theme) -->
    <SakuraEffect v-if="theme === 'sakura'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TransferSidebar from './components/transfer/TransferSidebar.vue'
import ChipTable from './components/table/ChipTable.vue'
import OperationSidebar from './components/operation/OperationSidebar.vue'
import ToastContainer from './components/common/ToastContainer.vue'
import SakuraEffect from './components/common/SakuraEffect.vue'
import { useTheme } from './composables/useTheme'

const { theme } = useTheme()

const activeTab = ref('table')
const tabs = [
  { key: 'transfers', icon: '📋', label: '记录' },
  { key: 'table', icon: '🃏', label: '筹码' },
  { key: 'operations', icon: '⚙️', label: '操作' },
]
</script>
