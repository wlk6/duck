import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    totalUnread: 0
  }),
  actions: {
    updateUnread(newValue) {
      this.totalUnread = newValue
    }
  }
})