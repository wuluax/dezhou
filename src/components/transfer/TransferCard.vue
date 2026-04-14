<template>
  <div
    class="group relative px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50
           border border-gray-200 dark:border-gray-600/50
           hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
  >
    <p class="text-xs text-gray-400 dark:text-gray-500 tabular-nums">{{ timeStr }}</p>
    <p class="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
      <span>{{ record.fromName }}</span>
      <span class="text-gray-400 mx-1">→</span>
      <span>{{ record.toName }}</span>
      <span class="ml-2 font-semibold" :class="amountColor">{{ record.amount }}</span>
    </p>
    <!-- Undo button: always visible on mobile, hover on desktop -->
    <button
      class="absolute right-2 top-1/2 -translate-y-1/2
             opacity-70 lg:opacity-0 lg:group-hover:opacity-100
             text-xs px-2 py-1 rounded-lg bg-white dark:bg-gray-600 shadow
             text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400
             transition-all duration-200 cursor-pointer"
      @click="$emit('undo', record.id)"
    >↩ 撤回</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ record: Object })
defineEmits(['undo'])

const timeStr = computed(() => {
  const d = new Date(props.record.timestamp)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}-${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const amountColor = computed(() => {
  switch (props.record.type) {
    case 'borrow': return 'text-orange-500'
    case 'return': return 'text-blue-500'
    default: return 'text-green-600 dark:text-green-400'
  }
})
</script>
