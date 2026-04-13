<template>
  <Teleport to="body">
    <div class="fixed top-4 left-4 right-4 sm:left-auto sm:w-80 z-[9999] flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="card px-4 pt-3 pb-0 shadow-lg overflow-hidden cursor-pointer"
          @mouseenter="pauseToast(toast.id)"
          @mouseleave="resumeToast(toast.id)"
        >
          <div class="flex items-start gap-2 pb-3">
            <span class="text-base mt-0.5">{{ iconMap[toast.type] }}</span>
            <p class="flex-1 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{{ toast.message }}</p>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none -mt-0.5 cursor-pointer"
              @click="removeToast(toast.id)"
            >&times;</button>
          </div>
          <div class="h-0.5 -mx-4 bg-gray-100 dark:bg-gray-700">
            <div
              class="h-full toast-bar"
              :class="barColorClass[toast.type]"
              :style="{
                animationDuration: toast.duration + 'ms',
                animationPlayState: toast.paused ? 'paused' : 'running',
              }"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../../composables/useToast'

const { toasts, removeToast, pauseToast, resumeToast } = useToast()

const iconMap = { success: '✅', info: 'ℹ️', warning: '⚠️', error: '❌' }
const barColorClass = {
  success: 'bg-green-400',
  info: 'bg-blue-400',
  warning: 'bg-yellow-400',
  error: 'bg-red-400',
}
</script>

<style scoped>
.toast-bar {
  animation: toast-progress linear forwards;
}

@keyframes toast-progress {
  from { width: 100%; }
  to { width: 0%; }
}

.toast-enter-active { animation: toast-in 0.3s ease; }
.toast-leave-active { animation: toast-out 0.25s ease forwards; }
.toast-move { transition: transform 0.3s ease; }

@keyframes toast-in {
  from { opacity: 0; transform: translateX(80px) scale(0.95); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to { opacity: 0; transform: translateX(80px) scale(0.9); }
}
</style>
