<template>
  <section>
    <h3 class="section-title">⚡ 快捷功能</h3>
    <div class="grid grid-cols-2 gap-2">
      <button class="action-btn" @click="clearAllChips">🧹 清空所有筹码</button>
      <button class="action-btn" @click="addPlayer">👤 添加新玩家</button>
      <button class="action-btn" @click="clearTableChips">♣️ 清空桌面筹码</button>
      <button class="action-btn" @click="clearFinalChips">♦️ 清空最终筹码</button>
    </div>
  </section>
</template>

<script setup>
import { usePlayers } from '../../composables/usePlayers'

const { clearAllChips, addPlayer, clearTableChips, clearFinalChips } = usePlayers()
</script>
