<template>
  <aside class="sidebar">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4 px-1">
      <h2 class="sidebar-title">📋 转移记录</h2>
      <button
        v-if="records.length"
        class="text-lg hover:scale-110 transition-transform cursor-pointer"
        title="清空所有记录"
        @click="clearTransferRecords"
      >🗑️</button>
    </div>
    <div class="border-t border-gray-200 dark:border-gray-700 mb-4" />

    <!-- Record list -->
    <div class="flex-1 overflow-y-auto space-y-2 pr-1">
      <TransitionGroup name="record">
        <TransferCard
          v-for="r in records"
          :key="r.id"
          :record="r"
          @undo="undoTransfer"
        />
      </TransitionGroup>
      <p v-if="!records.length" class="text-center text-sm text-gray-400 dark:text-gray-500 mt-12">暂无转移记录</p>
    </div>
  </aside>
</template>

<script setup>
import { usePlayers } from '../../composables/usePlayers'
import TransferCard from './TransferCard.vue'

const { records, undoTransfer, clearTransferRecords } = usePlayers()
</script>

<style scoped>
.record-enter-active { animation: slide-in 0.25s ease; }
.record-leave-active { animation: slide-out 0.2s ease forwards; position: absolute; width: 100%; }
.record-move { transition: transform 0.3s ease; }

@keyframes slide-in {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slide-out {
  to { opacity: 0; transform: translateX(-20px); }
}
</style>
