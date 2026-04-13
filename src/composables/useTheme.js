import { computed } from 'vue'
import { useStorage } from './useStorage'

const theme = useStorage('dezhou-theme', 'dark')

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark' || theme.value === 'cyberpunk')

  function applyTheme() {
    const html = document.documentElement
    html.classList.remove('dark', 'theme-cyberpunk', 'theme-sakura')

    switch (theme.value) {
      case 'dark':
        html.classList.add('dark')
        break
      case 'cyberpunk':
        html.classList.add('dark', 'theme-cyberpunk')
        break
      case 'sakura':
        html.classList.add('theme-sakura')
        break
    }
  }

  function setTheme(mode) {
    theme.value = mode
    applyTheme()
  }

  applyTheme()

  return { isDark, theme, setTheme }
}
