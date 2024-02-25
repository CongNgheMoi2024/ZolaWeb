<script setup lang="ts">
import AppBaseCard from '@/components/common/atom/AppBaseCard.vue'
import ChatListing from '@/components/chats/ChatListing.vue'
import ChatDetail from '@/components/chats/ChatDetail.vue'
import ChatProfile from '@/components/chats/ChatProfile.vue'

const { $api } = useNuxtApp()
const nuxtApp = useNuxtApp()
const { data } = useAuth()
const stompClient = nuxtApp.$stompClient
const userRecipient = ref({})
const messageReceived = ref('')
const selectedItem = ref('message')

const auth = data.value
const connect = () => {
  stompClient.connect({}, onConnected, onError)
}

const onConnected = () => {
  stompClient.subscribe(`/user/${auth?.id}/queue/messages`, onMessageReceived)
}

const onError = () => {
  console.log('error')
}
const onMessageReceived = (payload) => {
  messageReceived.value = JSON.parse(payload.body)
}

onMounted(() => {
  connect()
})

const fetchChatByUserId = (user) => {
  userRecipient.value = user
}
</script>

<template>
  <v-navigation-drawer class="tw-bg-primary" permanent width="70">
    <v-avatar class="d-block text-center mt-4 mx-2" color="grey-darken-1" size="large">
      <img alt="pro" src="/images/profile/user-1.jpg" width="54" />
    </v-avatar>

    <v-divider class="mx-3 mt-5 my-2" />

    <v-list class="tw-bg-primary" density="compact">
      <v-list-item :class="{ 'selected-item': selectedItem === 'message' }" @click="selectedItem = 'message'">
        <template #prepend>
          <v-icon class="tw-ml-[6px]" color="white">mdi-message-text</v-icon>
        </template>
      </v-list-item>

      <v-list-item :class="{ 'selected-item': selectedItem === 'account' }" @click="selectedItem = 'account'">
        <template #prepend>
          <v-icon class="tw-ml-[6px]" color="white">mdi-account-box-outline</v-icon>
        </template>
      </v-list-item>

      <v-list-item :class="{ 'selected-item': selectedItem === 'setting' }" @click="selectedItem = 'setting'">
        <template #prepend>
          <v-icon class="tw-ml-[6px]" color="white">mdi-cog</v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-card class="overflow-hidden tw-pl-[70px]" elevation="10">
    <app-base-card v-if="selectedItem === 'message'">
      <template #leftpart>
        <chat-listing @chat-detail="fetchChatByUserId" />
      </template>
      <template #rightpart>
        <chat-detail :message-received="messageReceived" :user-recipient="userRecipient" />
      </template>
    </app-base-card>
    <div v-else>empty</div>
  </v-card>
</template>

<style scoped>
.selected-item {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
:deep(.v-navigation-drawer__content) {
  border-right: none !important;
}

:deep(.v-list-item__prepend) {
  .v-icon {
    opacity: 1 !important;
  }
}
</style>
