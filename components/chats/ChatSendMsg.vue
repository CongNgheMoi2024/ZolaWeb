<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/apps/chat'

const msg = ref('')
const { data } = useAuth()
const nuxtApp = useNuxtApp()
const stompClient = nuxtApp.$stompClient
const emit = defineEmits(['chat-send-msg'])

const props = defineProps({
  recipientId: {
    type: String,
    default: '',
  },
})

const auth = data.value
function addItemAndClear(item: string) {
  if (item.length === 0) {
    return
  }
  if (stompClient) {
    const messageContent = {
      senderId: auth?.id,
      recipientId: props.recipientId,
      content: item,
      timestamp: new Date(),
    }

    stompClient.send('/app/chat', {}, JSON.stringify(messageContent))
    emit('chat-send-msg', messageContent)
    msg.value = ''
  }
}
</script>

<template>
  <form class="d-flex align-center pa-4" @submit.prevent="addItemAndClear(msg)">
    <v-btn class="text-medium-emphasis" icon variant="text"><MoodSmileIcon size="24" /></v-btn>

    <v-text-field
      v-model="msg"
      class="shadow-none"
      color="primary"
      density="compact"
      hide-details
      placeholder="Type a Message"
      variant="solo"
    />
    <v-btn class="text-medium-emphasis" :disabled="!msg" icon type="submit" variant="text">
      <SendIcon size="20" />
    </v-btn>

    <v-btn class="text-medium-emphasis" icon variant="text"><PhotoIcon size="20" /></v-btn>
    <v-btn class="text-medium-emphasis" icon variant="text"><PaperclipIcon size="20" /></v-btn>
  </form>
</template>

<style>
.shadow-none .v-field--no-label {
  --v-field-padding-top: -7px;
}
</style>
