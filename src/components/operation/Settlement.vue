<template>
  <section>
    <h3 class="section-title">💰 筹码结算与检验</h3>

    <!-- 筹码比 + 执行结算 -->
    <div class="grid grid-cols-2 gap-2 mb-2">
      <div>
        <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block">筹码比</label>
        <input v-model.number="ratio" type="number" step="0.1" min="0" class="input" />
      </div>
      <div class="flex items-end">
        <button class="action-btn w-full" @click="onSettle">🔨 执行结算</button>
      </div>
    </div>

    <!-- 筹码检验 + 平衡误差 -->
    <div class="grid grid-cols-2 gap-2">
      <button class="action-btn" @click="onVerify">🔍 筹码检验</button>
      <button class="action-btn" @click="onBalance">⚖️ 平衡误差</button>
    </div>

    <!-- Verify result modal -->
    <AppModal :visible="resultVisible" title="🔍 检验结果" @close="resultVisible = false">
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{{ resultMsg }}</p>
      <button class="btn-primary w-full" @click="resultVisible = false">确定</button>
    </AppModal>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { usePlayers } from '../../composables/usePlayers'
import AppModal from '../common/AppModal.vue'

const { settle, verify, balanceError } = usePlayers()

const ratio = ref(0.5)
const resultVisible = ref(false)
const resultMsg = ref('')

function onSettle() {
  settle(ratio.value)
}

function onVerify() {
  const r = verify()
  resultMsg.value = r.message
  resultVisible.value = true
}

function onBalance() {
  balanceError()
}
</script>
