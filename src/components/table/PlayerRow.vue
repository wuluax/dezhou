<template>
  <tr
    class="group border-b border-gray-100 dark:border-gray-700/50 transition-colors duration-150
           hover:bg-gray-100/80 dark:hover:bg-gray-700/40"
    :class="[
      dragFrom ? 'opacity-40' : '',
      dragOver && !dragFrom ? 'ring-2 ring-blue-400 ring-inset' : '',
      index % 2 === 0
        ? 'bg-white dark:bg-gray-800'
        : 'bg-gray-100 dark:bg-[#1e2736]'
    ]"
    @contextmenu.prevent="onContextMenu"
    @mouseenter="$emit('drag-enter', index)"
  >
    <!-- Drag handle (desktop only) -->
    <td
      class="w-12 text-center cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 select-none text-lg hidden lg:table-cell"
      @mousedown.prevent="$emit('drag-start', index)"
    >⋮⋮</td>

    <!-- Player name -->
    <td class="px-3 py-3 lg:px-5 lg:py-4" @dblclick="startEdit('name')">
      <input
        v-if="editing === 'name'"
        ref="editInput"
        v-model="editValue"
        class="input !py-1.5 !px-2 w-full max-w-[160px] text-base lg:text-lg"
        @blur="saveEdit"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
      />
      <span v-else class="text-base lg:text-lg font-medium cursor-default select-none">{{ player.name }}</span>
    </td>

    <!-- Current chips -->
    <td class="px-3 py-3 lg:px-5 lg:py-4 text-center" @dblclick="startEdit('currentChips')">
      <input
        v-if="editing === 'currentChips'"
        ref="editInput"
        v-model.number="editValue"
        type="number"
        class="input !py-1.5 !px-2 w-24 lg:w-32 text-center text-base lg:text-lg"
        @blur="saveEdit"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
      />
      <span v-else class="text-xl lg:text-2xl font-semibold tabular-nums cursor-default" :class="chipColor(player.currentChips)">
        {{ formatChip(player.currentChips) }}
      </span>
    </td>

    <!-- Table chips -->
    <td class="px-3 py-3 lg:px-5 lg:py-4 text-center" @dblclick="startEdit('tableChips')">
      <input
        v-if="editing === 'tableChips'"
        ref="editInput"
        v-model.number="editValue"
        type="number"
        class="input !py-1.5 !px-2 w-24 lg:w-32 text-center text-base lg:text-lg"
        @blur="saveEdit"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
      />
      <span v-else class="text-xl lg:text-2xl font-semibold tabular-nums cursor-default" :class="chipColor(player.tableChips)">
        {{ formatChip(player.tableChips) }}
      </span>
    </td>

    <!-- Final chips -->
    <td class="px-3 py-3 lg:px-5 lg:py-4 text-center" @dblclick="startEdit('finalChips')">
      <input
        v-if="editing === 'finalChips'"
        ref="editInput"
        v-model.number="editValue"
        type="number"
        class="input !py-1.5 !px-2 w-24 lg:w-32 text-center text-base lg:text-lg"
        @blur="saveEdit"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
      />
      <span v-else class="text-xl lg:text-2xl font-semibold tabular-nums cursor-default" :class="chipColor(player.finalChips)">
        {{ formatChip(player.finalChips) }}
      </span>
    </td>

    <!-- Action button -->
    <td class="w-10 text-center">
      <button
        class="text-gray-400 dark:text-gray-500 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-700 cursor-pointer"
        @click.stop="onMenuClick"
      >⋯</button>
    </td>
  </tr>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  player: Object,
  index: Number,
  dragFrom: Boolean,
  dragOver: Boolean,
})
const emit = defineEmits(['update-field', 'context-menu', 'drag-start', 'drag-enter'])

const editing = ref(null)
const editValue = ref(null)
const editInput = ref(null)

function chipColor(val) {
  if (val > 0) return 'text-green-600 dark:text-green-400'
  if (val < 0) return 'text-red-500 dark:text-red-400'
  return 'text-gray-400 dark:text-gray-500'
}

function formatChip(val) {
  if (val === 0) return '0'
  return val > 0 ? `+${val}` : `${val}`
}

async function startEdit(field) {
  editing.value = field
  editValue.value = props.player[field]
  await nextTick()
  editInput.value?.focus()
  editInput.value?.select()
}

function saveEdit() {
  if (editing.value === null) return
  const field = editing.value
  let val = editValue.value
  if (field === 'name') {
    val = (val || '').toString().trim() || props.player.name
  } else {
    val = Number(val) || 0
  }
  emit('update-field', props.player.id, field, val)
  editing.value = null
}

function cancelEdit() {
  editing.value = null
}

function onContextMenu(e) {
  emit('context-menu', { playerId: props.player.id, x: e.clientX, y: e.clientY })
}

function onMenuClick(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  emit('context-menu', { playerId: props.player.id, x: rect.left, y: rect.bottom + 4 })
}
</script>
