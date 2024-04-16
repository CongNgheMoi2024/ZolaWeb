<script setup lang="ts">
import { ref, computed } from 'vue'
import { type } from '../../.nuxt/types/imports'
import { useChatStore } from '@/stores/apps/chat'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const msg = ref('')
const { data } = useAuth()
const nuxtApp = useNuxtApp()
const { $api } = useNuxtApp()
const stompClient = nuxtApp.$stompClient
const emit = defineEmits(['chat-send-msg', 'chat-send-msg-group', 'close-reply'])
const isEmojiPickerVisible = ref(false)

const props = defineProps({
  recipientId: {
    type: String,
    default: '',
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  groupId: {
    type: String,
    default: '',
  },
  reply: {
    type: Object,
    default: null,
  },
  userReply: {
    type: Object,
    default: null,
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
      chatId: props.groupId || null,
      senderId: auth?.id,
      recipientId: props.recipientId,
      content: item,
      timestamp: new Date(),
    }

    if (props.isGroup) {
      stompClient.send('/app/chat/group', {}, JSON.stringify(messageContent))
      emit('chat-send-msg-group', messageContent)
    } else {
      stompClient.send('/app/chat', {}, JSON.stringify(messageContent))
      emit('chat-send-msg', messageContent)
    }
    msg.value = ''
    emit('close-reply')
  }
}

async function replyMsg(item: string) {
  if (item.length === 0) {
    return
  }
  if (props.reply !== null && props.userReply !== null && props.isGroup) {
    const messageContent = {
      chatId: props.groupId || null,
      senderId: auth?.id,
      content: item,
      timestamp: new Date(),
    }
    await $api.chats.replyMessageGroup(props.reply.id, messageContent)
    emit('chat-send-msg-group', messageContent)
  } else if (props.reply !== null && props.userReply !== null && !props.isGroup) {
    const messageContent = {
      chatId: props.groupId || null,
      senderId: auth?.id,
      content: item,
      recipientId: props.recipientId,
      timestamp: new Date(),
    }
    await $api.chats.replyMessage(props.reply.id, messageContent)
    emit('chat-send-msg', messageContent)
  }
  msg.value = ''
  emit('close-reply')
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
        if (props.isGroup === false) {
          formData.append('recipientId', props.recipientId)
        } else {
          formData.append('chatId', props.groupId)
        }

        if (props.isGroup === false) {
          await $api.chats
            .sendFileMessage(formData)
            .then((res) => {
              emit('chat-send-msg', res.data[0])
            })
            .catch((error) => {
              console.error('Error sending file', error)
            })
        } else {
          await $api.chats
            .sendFileMessageGroup(formData)
            .then((res) => {
              emit('chat-send-msg-group', res.data[0])
            })
            .catch((error) => {
              console.error('Error sending file group', error)
            })
        }
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
  <div v-if="reply !== null && userReply !== null" class="mt-7 ml-8">
    <v-row class="flex items-center justify-between bg-primary-100 rounded-lg reply-container">
      <v-icon size="30">mdi-format-quote-close</v-icon>
      <div class="flex items-center justify-between rounded-lg">
        <div class="flex items -center">
          <span class="text-primary-500 text-sm">{{ t('chats.replyingTo') }}</span>
          <span class="text-primary-500 text-sm font-semibold ml-1">{{ userReply.name }}</span>
        </div>
        <div class="flex items -center">
          <span class="text-primary-600 text-ml ml-2" style="font-weight: bold">{{ reply.content }}</span>
        </div>
      </div>
      <v-spacer />
      <v-btn icon variant="text" @click="emit('close-reply')">
        <v-icon size="20">mdi-close</v-icon>
      </v-btn>
    </v-row>
  </div>
  <form class="d-flex align-center pa-4" @submit.prevent="reply === null ? addItemAndClear(msg) : replyMsg(msg)">
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

    <v-btn class="text-medium-emphasis" icon variant="text" @click="$refs.imageInput.click()">
      <PhotoIcon size="20" />
      <input ref="imageInput" accept="image/*" class="tw-hidden" type="file" @change="handleFileUpload" />
    </v-btn>
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
.reply-container {
  background-color: #f3f4f6;
  border-radius: 5px;
  margin-right: 20px;
  margin-top: -10px;
  padding: 2px;
}
</style>
