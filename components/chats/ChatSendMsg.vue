<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/apps/chat'
import { type } from '../../.nuxt/types/imports'

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
const handleImage = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files as FileList
  if (files.length > 0) {
    const file = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const image = e.target?.result
      if (image) {
        const messageContent = {
          senderId: auth?.id,
          recipientId: props.recipientId,
          content: image,
          timestamp: new Date(),
          type: 'image',
        }
        stompClient.send('/app/chat', {}, JSON.stringify(messageContent))
        emit('chat-send-msg', messageContent)
      }
    }
    reader.readAsDataURL(file)
  }
}

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

    <v-btn class="text-medium-emphasis" icon variant="text">
      <v-label>
        <PhotoIcon size="20" />
        <v-file-input
          accept="image/png, image/jpeg, image/jpg"
          class="file-input"
          multiple
          style="position: absolute; opacity: 0; width: 100%; height: 100%; top: 0; left: 0; cursor: pointer"
          @change="handleImage"
        />
      </v-label>
    </v-btn>
    <v-btn class="text-medium-emphasis" icon variant="text"><PaperclipIcon size="20" /></v-btn>
  </form>
</template>

<style scoped>
.shadow-none .v-field--no-label {
  --v-field-padding-top: -7px;
}

.file-input:deep().v-input__control,
.file-input:deep().v-input__details {
  display: none;
}
</style>
