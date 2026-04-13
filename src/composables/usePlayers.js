import { useStorage } from './useStorage'
import { useTransfers } from './useTransfers'
import { useToast } from './useToast'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function createDefaultPlayers() {
  return Array.from({ length: 8 }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `玩家${LETTERS[i]}`,
    currentChips: 0,
    tableChips: 0,
    finalChips: 0,
  }))
}

const players = useStorage('dezhou-players', createDefaultPlayers())
const { records, addRecord, removeRecord, clearRecords } = useTransfers()
const { addToast } = useToast()

export function usePlayers() {
  // --- Player CRUD ---
  function addPlayer() {
    const usedLetters = new Set(
      players.value.map(p => p.name.replace('玩家', '')).filter(s => s.length === 1 && LETTERS.includes(s))
    )
    let letter = ''
    for (const l of LETTERS) {
      if (!usedLetters.has(l)) { letter = l; break }
    }
    const name = letter ? `玩家${letter}` : `玩家${players.value.length + 1}`
    players.value.push({
      id: crypto.randomUUID(),
      name,
      currentChips: 0,
      tableChips: 0,
      finalChips: 0,
    })
    addToast(`已添加 ${name}`)
  }

  function removePlayer(id) {
    const idx = players.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      const name = players.value[idx].name
      players.value.splice(idx, 1)
      addToast(`已删除 ${name}`)
    }
  }

  function updatePlayerField(id, field, value) {
    const p = players.value.find(p => p.id === id)
    if (p) p[field] = value
  }

  function reorderPlayers(fromIdx, toIdx) {
    const [moved] = players.value.splice(fromIdx, 1)
    players.value.splice(toIdx, 0, moved)
  }

  // --- Chip operations ---
  function transferToPlayer(fromId, toId, amount) {
    const from = players.value.find(p => p.id === fromId)
    const to = players.value.find(p => p.id === toId)
    if (!from || !to || amount <= 0) return
    from.currentChips += amount
    to.currentChips -= amount
    addRecord({
      type: 'transfer',
      fromId, fromName: from.name,
      toId, toName: to.name,
      amount,
    })
    addToast(`${from.name} → ${to.name}  ${amount} 筹码`)
  }

  function borrowChips(playerId, amount) {
    const p = players.value.find(p => p.id === playerId)
    if (!p || amount <= 0) return
    p.currentChips -= amount
    addRecord({
      type: 'borrow',
      fromId: '__system__', fromName: '系统',
      toId: playerId, toName: p.name,
      amount,
    })
    addToast(`${p.name} 借入 ${amount} 筹码`)
  }

  function returnChips(playerId, amount) {
    const p = players.value.find(p => p.id === playerId)
    if (!p || amount <= 0) return
    p.currentChips += amount
    addRecord({
      type: 'return',
      fromId: playerId, fromName: p.name,
      toId: '__system__', toName: '系统',
      amount,
    })
    addToast(`${p.name} 归还 ${amount} 筹码`)
  }

  function undoTransfer(recordId) {
    const record = removeRecord(recordId)
    if (!record) return
    switch (record.type) {
      case 'transfer': {
        const from = players.value.find(p => p.id === record.fromId)
        const to = players.value.find(p => p.id === record.toId)
        if (from) from.currentChips -= record.amount
        if (to) to.currentChips += record.amount
        break
      }
      case 'borrow': {
        const p = players.value.find(p => p.id === record.toId)
        if (p) p.currentChips += record.amount
        break
      }
      case 'return': {
        const p = players.value.find(p => p.id === record.fromId)
        if (p) p.currentChips -= record.amount
        break
      }
    }
    addToast('已撤回该笔记录')
  }

  // --- Batch operations ---
  function clearAllChips() {
    players.value.forEach(p => {
      p.currentChips = 0
      p.tableChips = 0
      p.finalChips = 0
    })
    addToast('已清空所有筹码')
  }

  function clearTableChips() {
    players.value.forEach(p => { p.tableChips = 0 })
    addToast('已清空桌面筹码')
  }

  function clearFinalChips() {
    players.value.forEach(p => { p.finalChips = 0 })
    addToast('已清空最终筹码')
  }

  // --- Settlement ---
  function settle(ratio) {
    players.value.forEach(p => {
      p.finalChips = (p.currentChips + p.tableChips) * ratio
    })
    addToast('已执行结算')
  }

  function verify() {
    const sum = players.value.reduce((s, p) => s + p.finalChips, 0)
    const rounded = Math.round(sum * 100) / 100
    if (rounded === 0) {
      return { sum: 0, message: '恭喜！筹码检验结果刚刚好为0，没有人偷钱喔~' }
    } else if (rounded > 0) {
      return { sum: rounded, message: `啊哦，结果为+${rounded}，有人多赢了${rounded}，或者少输了${rounded}喔~` }
    } else {
      return { sum: rounded, message: `啊哦，结果为${rounded}，有人少赢了${Math.abs(rounded)}，或者多输了${Math.abs(rounded)}喔~` }
    }
  }

  function balanceError() {
    const { sum, message } = verify()
    if (sum === 0) {
      addToast('无需平衡误差，筹码检验结果为0', 'info')
      return
    }

    if (sum < 0) {
      // Distribute among losers (negative final chips)
      const losers = players.value.filter(p => p.finalChips < 0)
      if (losers.length === 0) { addToast(message, 'warning'); return }
      const totalAbs = losers.reduce((s, p) => s + Math.abs(p.finalChips), 0)
      if (totalAbs === 0) return
      const errorAbs = Math.abs(sum)
      losers.forEach(p => {
        const share = (Math.abs(p.finalChips) / totalAbs) * errorAbs
        p.finalChips = Math.round((p.finalChips + share) * 100) / 100
      })
    } else {
      // Distribute among winners (positive final chips)
      const winners = players.value.filter(p => p.finalChips > 0)
      if (winners.length === 0) { addToast(message, 'warning'); return }
      const totalAbs = winners.reduce((s, p) => s + p.finalChips, 0)
      if (totalAbs === 0) return
      winners.forEach(p => {
        const share = (p.finalChips / totalAbs) * sum
        p.finalChips = Math.round((p.finalChips - share) * 100) / 100
      })
    }
    addToast('已平衡误差')
  }

  return {
    players,
    records,
    clearTransferRecords: clearRecords,
    addPlayer,
    removePlayer,
    updatePlayerField,
    reorderPlayers,
    transferToPlayer,
    borrowChips,
    returnChips,
    undoTransfer,
    clearAllChips,
    clearTableChips,
    clearFinalChips,
    settle,
    verify,
    balanceError,
  }
}
