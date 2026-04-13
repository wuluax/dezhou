<template>
  <AppModal :visible="visible" :title="modalTitle" @close="$emit('close')">
    <!-- Player selector (transfer only) -->
    <div v-if="type === 'transfer'" class="mb-4">
      <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block">选择玩家</label>
      <select v-model="targetId" class="input">
        <option value="" disabled>请选择转入的玩家</option>
        <option v-for="p in otherPlayers" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
    </div>

    <!-- Amount input -->
    <div class="mb-3">
      <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block">数值</label>
      <input
        ref="amountInput"
        v-model.number="amount"
        type="number"
        min="1"
        class="input"
        placeholder="请输入数值"
        @keyup.enter="confirm"
      />
    </div>

    <!-- Preset buttons -->
    <div class="grid grid-cols-4 gap-2 mb-5">
      <button
        v-for="val in [50, 100, 150, 200]"
        :key="val"
        class="btn-ghost text-center"
        @click="amount = val"
      >{{ val }}</button>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button class="btn-ghost flex-1" @click="$emit('close')">取消</button>
      <button class="btn-primary flex-1" :disabled="!canConfirm" @click="confirm">确认</button>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import AppModal from './AppModal.vue'

const props = defineProps({
  visible: Boolean,
  type: String,       // 'transfer' | 'borrow' | 'return'
  playerId: String,
  players: Array,
})
const emit = defineEmits(['close', 'confirm'])

const targetId = ref('')
const amount = ref(null)
const amountInput = ref(null)

const modalTitle = computed(() => {
  const map = { transfer: '💱 转给玩家', borrow: '📥 借入筹码', return: '📤 归还筹码' }
  return map[props.type] || ''
})

const otherPlayers = computed(() =>
  props.players?.filter(p => p.id !== props.playerId) || []
)

const canConfirm = computed(() => {
  if (!amount.value || amount.value <= 0) return false
  if (props.type === 'transfer' && !targetId.value) return false
  return true
})

function confirm() {
  if (!canConfirm.value) return
  emit('confirm', { targetId: targetId.value, amount: amount.value })
}

// Reset on open
watch(() => props.visible, async (v) => {
  if (v) {
    targetId.value = ''
    amount.value = null
    await nextTick()
    amountInput.value?.focus()
  }
})
</script>
