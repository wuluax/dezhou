<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3 lg:mb-4 px-1">
      <h2 class="text-lg sm:text-xl font-bold">🃏 德州扑克筹码计分系统</h2>
      <button
        class="text-lg hover:scale-110 transition-transform cursor-pointer"
        title="使用小贴士"
        @click="showTip"
      >💡</button>
    </div>

    <!-- Table -->
    <div class="flex-1 overflow-auto card">
      <div class="overflow-x-auto h-full">
        <table class="w-full text-left min-w-[480px] h-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 sticky top-0 z-10">
              <th class="w-12 hidden lg:table-cell" />
              <th class="px-3 py-3 lg:px-5 lg:py-4 text-sm lg:text-base font-semibold text-gray-500 dark:text-gray-400 tracking-wider">♠️ 玩家</th>
              <th class="px-3 py-3 lg:px-5 lg:py-4 text-sm lg:text-base font-semibold text-gray-500 dark:text-gray-400 tracking-wider text-center">♥️ 当前筹码</th>
              <th class="px-3 py-3 lg:px-5 lg:py-4 text-sm lg:text-base font-semibold text-gray-500 dark:text-gray-400 tracking-wider text-center">♣️ 桌面筹码</th>
              <th class="px-3 py-3 lg:px-5 lg:py-4 text-sm lg:text-base font-semibold text-gray-500 dark:text-gray-400 tracking-wider text-center">♦️ 最终筹码</th>
              <th class="w-10" />
            </tr>
          </thead>
          <tbody>
            <PlayerRow
              v-for="(player, i) in players"
              :key="player.id"
              :player="player"
              :index="i"
              :drag-from="drag.active && drag.fromIndex === i"
              :drag-over="drag.active && drag.overIndex === i && drag.fromIndex !== i"
              @update-field="updatePlayerField"
              @context-menu="openContextMenu"
              @drag-start="onDragStart"
              @drag-enter="onDragEnter"
            />
          </tbody>
        </table>
      </div>
      <p v-if="!players.length" class="text-center text-sm text-gray-400 py-12">暂无玩家</p>
    </div>

    <!-- Context menu -->
    <ContextMenu
      :visible="ctx.visible"
      :pos="ctx.pos"
      :items="ctxItems"
      @close="ctx.visible = false"
      @select="handleCtxAction"
    />

    <!-- Chip modal (transfer / borrow / return) -->
    <ChipModal
      :visible="modal.visible"
      :type="modal.type"
      :player-id="modal.playerId"
      :players="players"
      @close="modal.visible = false"
      @confirm="handleModalConfirm"
    />

    <!-- Delete confirm modal -->
    <AppModal :visible="deleteConfirm.visible" title="⚠️ 确认删除" @close="deleteConfirm.visible = false">
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-5">确定要删除该玩家吗？此操作不可撤回。</p>
      <div class="flex gap-2">
        <button class="btn-ghost flex-1" @click="deleteConfirm.visible = false">取消</button>
        <button class="btn-danger flex-1" @click="confirmDelete">删除</button>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { reactive, computed, onUnmounted } from 'vue'
import { usePlayers } from '../../composables/usePlayers'
import { useToast } from '../../composables/useToast'
import PlayerRow from './PlayerRow.vue'
import ContextMenu from '../common/ContextMenu.vue'
import ChipModal from '../common/ChipModal.vue'
import AppModal from '../common/AppModal.vue'

const {
  players, updatePlayerField, reorderPlayers,
  transferToPlayer, borrowChips, returnChips, removePlayer,
} = usePlayers()

// ── Tips ──
const { addToast } = useToast()
const tips = [
  '右键玩家行也可打开操作菜单喵~',
  '双击可直接修改玩家名、筹码数喵~',
]
function showTip() {
  addToast(tips[Math.floor(Math.random() * tips.length)], 'info')
}

// ── Custom drag-to-reorder (mouse events, no HTML5 DnD) ──
const drag = reactive({ active: false, fromIndex: -1, overIndex: -1 })

function onDragStart(index) {
  drag.active = true
  drag.fromIndex = index
  drag.overIndex = index
  document.addEventListener('mouseup', onDragEnd)
  document.body.style.userSelect = 'none'
}

function onDragEnter(index) {
  if (drag.active) {
    drag.overIndex = index
  }
}

function onDragEnd() {
  document.removeEventListener('mouseup', onDragEnd)
  document.body.style.userSelect = ''
  if (drag.active && drag.fromIndex !== drag.overIndex && drag.overIndex >= 0) {
    reorderPlayers(drag.fromIndex, drag.overIndex)
  }
  drag.active = false
  drag.fromIndex = -1
  drag.overIndex = -1
}

onUnmounted(() => {
  document.removeEventListener('mouseup', onDragEnd)
  document.body.style.userSelect = ''
})

// ── Context menu ──
const ctx = reactive({ visible: false, pos: { x: 0, y: 0 }, playerId: '' })

const ctxItems = computed(() => {
  const idx = players.value.findIndex(p => p.id === ctx.playerId)
  return [
    { icon: '⬆️', label: '上移', action: 'move-up', disabled: idx <= 0 },
    { icon: '⬇️', label: '下移', action: 'move-down', disabled: idx >= players.value.length - 1 },
    { separator: true },
    { icon: '💱', label: '转给玩家', action: 'transfer' },
    { icon: '📥', label: '借入筹码', action: 'borrow' },
    { icon: '📤', label: '归还筹码', action: 'return' },
    { separator: true },
    { icon: '🗑️', label: '删除该玩家', action: 'delete', danger: true },
  ]
})

function openContextMenu({ playerId, x, y }) {
  ctx.playerId = playerId
  ctx.pos = { x, y }
  ctx.visible = true
}

// ── Modal ──
const modal = reactive({ visible: false, type: '', playerId: '' })

function handleCtxAction(action) {
  if (action === 'delete') {
    deleteConfirm.playerId = ctx.playerId
    deleteConfirm.visible = true
    return
  }
  if (action === 'move-up' || action === 'move-down') {
    const idx = players.value.findIndex(p => p.id === ctx.playerId)
    const targetIdx = action === 'move-up' ? idx - 1 : idx + 1
    if (idx >= 0 && targetIdx >= 0 && targetIdx < players.value.length) {
      reorderPlayers(idx, targetIdx)
    }
    return
  }
  modal.type = action
  modal.playerId = ctx.playerId
  modal.visible = true
}

function handleModalConfirm({ targetId, amount }) {
  switch (modal.type) {
    case 'transfer': transferToPlayer(modal.playerId, targetId, amount); break
    case 'borrow': borrowChips(modal.playerId, amount); break
    case 'return': returnChips(modal.playerId, amount); break
  }
  modal.visible = false
}

// ── Delete ──
const deleteConfirm = reactive({ visible: false, playerId: '' })

function confirmDelete() {
  removePlayer(deleteConfirm.playerId)
  deleteConfirm.visible = false
}
</script>
