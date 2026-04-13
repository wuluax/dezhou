import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  function addToast(message, type = 'success', duration = 3000) {
    const id = ++toastId
    const toast = { id, message, type, duration, paused: false, startedAt: Date.now(), remaining: duration, timerId: null }
    toast.timerId = setTimeout(() => removeToast(id), duration)
    toasts.value.push(toast)
    return id
  }

  function removeToast(id) {
    const t = toasts.value.find(t => t.id === id)
    if (t?.timerId) clearTimeout(t.timerId)
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function pauseToast(id) {
    const t = toasts.value.find(t => t.id === id)
    if (!t || t.paused) return
    clearTimeout(t.timerId)
    t.remaining -= (Date.now() - t.startedAt)
    t.paused = true
  }

  function resumeToast(id) {
    const t = toasts.value.find(t => t.id === id)
    if (!t || !t.paused) return
    t.paused = false
    t.startedAt = Date.now()
    t.timerId = setTimeout(() => removeToast(id), t.remaining)
  }

  return { toasts, addToast, removeToast, pauseToast, resumeToast }
}
