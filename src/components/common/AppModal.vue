<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-[5000] flex items-center justify-center" @mousedown.self="$emit('close')">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div class="card relative z-10 w-full max-w-sm mx-4 p-6 shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold">{{ title }}</h3>
            <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none cursor-pointer" @click="$emit('close')">&times;</button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({ visible: Boolean, title: String })
defineEmits(['close'])
</script>

<style scoped>
.modal-enter-active { animation: modal-in 0.25s ease; }
.modal-leave-active { animation: modal-out 0.2s ease forwards; }
.modal-enter-active .absolute { animation: fade-in 0.25s ease; }
.modal-leave-active .absolute { animation: fade-out 0.2s ease forwards; }

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.92) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes modal-out {
  to { opacity: 0; transform: scale(0.95) translateY(5px); }
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes fade-out { to { opacity: 0; } }
</style>
