<template>
  <section>
    <h3 class="section-title">🎨 主题设置</h3>
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="item in themes"
        :key="item.value"
        class="action-btn"
        :class="{ 'theme-active': theme === item.value }"
        @click="setTheme(item.value)"
      >{{ item.icon }} {{ item.label }}</button>
    </div>
  </section>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme'
import { useToast } from '../../composables/useToast'

const { theme, setTheme: setThemeRaw } = useTheme()
const { addToast } = useToast()

const themes = [
  { value: 'light', icon: '☀️', label: '浅色模式' },
  { value: 'dark', icon: '🌙', label: '深色模式' },
  { value: 'cyberpunk', icon: '🌆', label: '赛博朋克' },
  { value: 'sakura', icon: '🌸', label: '少女之心' },
]

const toastMsg = {
  light: '已切换至浅色模式',
  dark: '已切换至深色模式',
  cyberpunk: '已切换至赛博朋克模式',
  sakura: '已切换至少女之心模式',
}

function setTheme(mode) {
  setThemeRaw(mode)
  addToast(toastMsg[mode], 'info')
}
</script>
