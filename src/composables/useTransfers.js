import { useStorage } from './useStorage'

const records = useStorage('dezhou-transfers', [])

export function useTransfers() {
  function addRecord({ type, fromId, fromName, toId, toName, amount }) {
    records.value.unshift({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type,
      fromId,
      fromName,
      toId: toId || null,
      toName: toName || null,
      amount,
    })
  }

  function removeRecord(id) {
    const idx = records.value.findIndex(r => r.id === id)
    if (idx !== -1) return records.value.splice(idx, 1)[0]
    return null
  }

  function clearRecords() {
    records.value = []
  }

  return { records, addRecord, removeRecord, clearRecords }
}
