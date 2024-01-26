<script setup>
import { ref, onMounted, computed } from 'vue'
import { formatDistanceToNowStrict } from 'date-fns'
import { last } from 'lodash'
import { useChatStore } from '@/stores/apps/chat'

const store = useChatStore()

onMounted(() => {
  store.fetchChats()
})

const getChats = computed(() => {
  return store.chats
})

const chatItem = getChats
const searchValue = ref('')
const filteredChats = computed(() => {
  return chatItem.value.filter((chat) => {
    return chat.name.toLowerCase().includes(searchValue.value.toLowerCase())
  })
})
const lastActivity = (chat) => last(chat.chatHistory).createdAt

const items = ref([{ title: 'Sort by time' }, { title: 'Sort by Unread' }, { title: 'Mark all as read' }])
</script>
<template>
  <v-sheet>
    <div class="px-6 pt-3">
      <v-text-field
        v-model="searchValue"
        append-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        placeholder="Search Contact"
        variant="outlined"
      />
      <v-menu>
        <template #activator="{ props }">
          <v-btn class="mt-4 text-medium-emphasis" color="white" variant="flat" v-bind="props">
            Recent Chats
            <ChevronDownIcon class="ml-2" size="18" />
          </v-btn>
        </template>
        <v-list class="elevation-10">
          <v-list-item v-for="(item, index) in items" :key="index" :value="index">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-sheet>
  <perfect-scrollbar class="lgScroll">
    <v-list>
      <!---Single Item-->
      <v-list-item
        v-for="chat in filteredChats"
        :key="chat.id"
        :active="store.chatContent === chat.id"
        class="text-no-wrap chatItem"
        color="primary"
        lines="two"
        :value="chat.id"
        @click="store.SelectChat(chat.id)"
      >
        <!---Avatar-->
        <template #prepend>
          <v-avatar>
            <img alt="pro" :src="chat.thumb" width="50" />
          </v-avatar>
          <v-badge
            class="badg-dot"
            :color="
              chat.status === 'away'
                ? 'warning'
                : chat.status === 'busy'
                ? 'error'
                : chat.status === 'online'
                ? 'success'
                : 'containerBg'
            "
            dot
          />
        </template>
        <!---Name-->
        <v-list-item-title class="text-subtitle-1 textPrimary w-100 font-weight-semibold">
          {{ chat.name }}
        </v-list-item-title>
        <!---Subtitle-->
        <v-sheet v-if="chat.chatHistory.slice(-1)[0].type == 'img'">
          <small class="textPrimary text-subtitle-2">Sent a Photo</small>
        </v-sheet>
        <div v-else class="text-subtitle-2 textPrimary mt-1 text-truncate w-100">
          {{ chat.chatHistory.slice(-1)[0].msg }}
        </div>
        <!---Last seen--->
        <template #append>
          <div class="d-flex flex-column text-right w-25">
            <small class="textPrimary text-subtitle-2">
              {{
                formatDistanceToNowStrict(new Date(lastActivity(chat)), {
                  addSuffix: false,
                })
              }}
            </small>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </perfect-scrollbar>
</template>
<style>
.chatItem {
  padding: 16px 24px !important;
  border-bottom: 1px solid rgb(var(--v-theme-inputBorder), 0.1);
}
.badg-dot {
  left: -17px;
  position: relative;
  bottom: -10px;
}
.lgScroll {
  height: 670px;
}
</style>
