import { defineStore } from 'pinia'

export const useSquareStore = defineStore('square', {
  state: () => ({
    showSquare: false, // 共享的状态
    risk: false,
  }),
  actions: {
    // 切换 showSquare 的状态
    toggleSquare() {
      this.showSquare = !this.showSquare
    },
    // 设置 showSquare 为 true
    openSquare() {
      this.showSquare = true
    },
    // 设置 showSquare 为 false
    closeSquare() {
      this.showSquare = false
    },
    openRisk() {
      this.risk = true
    },
    closeRisk() {
      this.risk = false
    },
  },
})
