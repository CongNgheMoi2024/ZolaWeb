<script setup lang="ts">
import { ref, computed } from 'vue'
import { type } from '../../.nuxt/types/imports'
import { useChatStore } from '@/stores/apps/chat'

const msg = ref('')
const { data } = useAuth()
const nuxtApp = useNuxtApp()
const { $api } = useNuxtApp()
const stompClient = nuxtApp.$stompClient
const emit = defineEmits(['chat-send-msg'])
const isEmojiPickerVisible = ref(false)

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

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  // if (file) {
  //   const reader = new FileReader()
  //   reader.onload = async (e) => {
  //     const formData = new FormData()
  //     formData.append('files', file)
  //     formData.append('senderId', auth?.id)
  //     formData.append('recipientId', props.recipientId)
  //
  //     await $api.chats
  //       .sendFileMessage(formData)
  //       .then((res) => {
  //         console.log('File sent')
  //       })
  //       .catch((error) => {
  //         console.error('Error sending file', error)
  //       })
  //   }
  //   reader.readAsDataURL(file)
  // }
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = async (e) => {
        const formData = new FormData()
        formData.append('files', file)
        formData.append('senderId', auth?.id)
        formData.append('recipientId', props.recipientId)

        await $api.chats
          .sendFileMessage(formData)
          .then((res) => {
            emit('chat-send-msg', res.data[0])
          })
          .catch((error) => {
            console.error('Error sending file', error)
          })
      }
      reader.readAsDataURL(file)
    }
  }
}

const toggleEmojiPicker = () => {
  isEmojiPickerVisible.value = false
}

const appendEmoji = (emoji: string) => {
  msg.value += emoji.i
}
</script>

<template>
  <form class="d-flex align-center pa-4" @submit.prevent="addItemAndClear(msg)">
    <div v-click-outside="toggleEmojiPicker">
      <v-btn class="text-medium-emphasis" icon variant="text" @click="isEmojiPickerVisible = true">
        <MoodSmileIcon size="24" />
      </v-btn>

      <emoji-picker v-if="isEmojiPickerVisible" ref="emojiPicker" @select="appendEmoji" />
    </div>

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
    <v-btn class="text-medium-emphasis" icon variant="text" @click="$refs.fileInput.click()">
      <PaperclipIcon size="20" />
      <input ref="fileInput" class="tw-hidden" multiple type="file" @change="handleFileUpload" />
    </v-btn>
  </form>
</template>

<style scoped lang="scss">
.shadow-none .v-field--no-label {
  --v-field-padding-top: -7px;
}

.file-input:deep().v-input__control,
.file-input:deep().v-input__details {
  display: none;
}
.v3-emoji-picker {
  position: absolute;
  bottom: 130px;
  z-index: 1000;
}
</style>
