import { defineStore } from 'pinia'
export let adminStore = defineStore('admin', {
    state() {
        return {
            bookData: [],
            userData: [],
        }
    },
})
