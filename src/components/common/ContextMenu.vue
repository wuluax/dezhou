<template>
  <Teleport to="body">
    <Transition name="ctx">
      <div
        v-if="visible"
        ref="menuEl"
        class="fixed z-[6000] min-w-[180px] py-1.5 card shadow-xl border border-gray-200 dark:border-gray-600"
        :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
      >
        <template v-for="(item, i) in items" :key="i">
          <div v-if="item.separator" class="my-1.5 border-t border-gray-200 dark:border-gray-700" />
          <button
            v-else
            class="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-150"
            :class="[
              item.disabled
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : item.danger
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
            ]"
            :disabled="item.disabled"
            @click="handleClick(item)"
          >
            <span v-if="item.icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  pos: { type: Object, default: () => ({ x: 0, y: 0 }) },
  items: { type: Array, default: () => [] },
})
const emit = defineEmits(['close', 'select'])

const menuEl = ref(null)

function handleClick(item) {
  if (item.disabled) return
  emit('select', item.action)
  emit('close')
}

function onClickOutside(e) {
  if (menuEl.value && !menuEl.value.contains(e.target)) {
    emit('close')
  }
}

// Adjust position if menu overflows viewport
watch(() => props.visible, async (v) => {
  if (!v) return
  await nextTick()
  if (!menuEl.value) return
  const rect = menuEl.value.getBoundingClientRect()
  if (rect.right > window.innerWidth) {
    menuEl.value.style.left = (window.innerWidth - rect.width - 8) + 'px'
  }
  if (rect.bottom > window.innerHeight) {
    menuEl.value.style.top = (window.innerHeight - rect.height - 8) + 'px'
  }
})

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  document.addEventListener('touchstart', onClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('touchstart', onClickOutside)
})
</script>

<style scoped>
.ctx-enter-active { animation: ctx-in 0.15s ease; }
.ctx-leave-active { animation: ctx-out 0.1s ease forwards; }
@keyframes ctx-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
@keyframes ctx-out { to { opacity: 0; transform: scale(0.97); } }
</style>
