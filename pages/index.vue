<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppBaseCard from '@/components/common/atom/AppBaseCard.vue'
import ChatListing from '@/components/chats/ChatListing.vue'
import ChatDetail from '@/components/chats/ChatDetail.vue'
import FriendMenu from '@/components/Friends/FriendMenu.vue'
import ListFriends from '@/components/Friends/ListFriends.vue'

const { t } = useI18n()
const { $api } = useNuxtApp()
const nuxtApp = useNuxtApp()
const { data, signOut } = useAuth()
const stompClient = nuxtApp.$stompClient
const userRecipient = ref({})
const messageReceived = ref('')
const selectedItem = ref('message')
const showSettingsMenu = ref(false)
const menu = ref(false)
const profileDialog = ref(false)
const isEditing = ref(false)
const values = ref({})
const user = ref({})
const isChangePassword = ref(false)
const avatar = ref(user.avatar)
const nameUser = ref(user.name)

const selectedMenuFriend = ref({
  title: 'Danh sách bạn bè',
  icon: 'mdi-account-details-outline',
  code: 'list-friends',
})

const fetchProfileById = async (values) => {
  await $api.users.getProfile(values).then((res) => {
    user.value = res.data
    avatar.value = user.value.avatar
    nameUser.value = user.value.name
  })
}

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
  loadData()
})

const fetchChatByUserId = (user) => {
  userRecipient.value = user
}

const logOut = async () => {
  await signOut({ callbackUrl: '/auth/login' })
}

const openProfile = () => {
  console.log('open profile')
}

const saveEdit = () => {
  isEditing.value = !isEditing.value
}

const closeDialog = () => {
  isEditing.value = false
  isChangePassword.value = false
}

const closeProfileDialog = () => {
  profileDialog.value = false
}
const openEditProfile = () => {
  isEditing.value = true
}

const openProfileDialog = () => {
  profileDialog.value = true
}
const changeMenuFriend = (menu) => {
  selectedMenuFriend.value = menu
}

onMounted(() => {
  connect()
})
const loadData = async () => {
  await fetchProfileById({})
}
</script>

<template>
  <v-navigation-drawer class="tw-bg-primary" permanent width="70">
    <v-menu location="end" offset="15">
      <template #activator="{ props }">
        <v-btn v-bind="props" class="d-block text-center mt-4 mx-2" icon @click="menu = !menu">
          <v-avatar color="grey-darken-1" size="large">
            <img alt="pro" :src="avatar ? avatar : '/images/profile/user-1.jpg'" width="54" />
          </v-avatar>
        </v-btn>
      </template>
      <v-card min-width="200">
        <v-list>
          <v-list-item>
            <h5 class="text-h6 font-weight-medium">{{ nameUser }}</h5>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list>
          <v-list-item @click="openProfileDialog">
            <label>{{ t('chats.yourProfile') }}</label>
          </v-list-item>
          <v-list-item @click="isChangePassword = true">
            <label>{{ t('changePassword.title') }}</label>
          </v-list-item>
          <v-list-item>
            <label>{{ t('chats.setting') }}</label>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-divider class="mx-3 mt-5 my-2" />

    <v-list class="tw-bg-primary" density="compact">
      <v-list-item :class="{ 'selected-item': selectedItem === 'message' }" @click="selectedItem = 'message'">
        <template #prepend>
          <v-icon class="tw-ml-[6px]" color="white">mdi-message-text</v-icon>
        </template>
      </v-list-item>

      <v-list-item :class="{ 'selected-item': selectedItem === 'friends' }" @click="selectedItem = 'friends'">
        <template #prepend>
          <v-icon class="tw-ml-[6px]" color="white">mdi-account-box-outline</v-icon>
        </template>
      </v-list-item>

      <v-list-item class="settings-button" :class="{ 'selected-item': selectedItem === 'setting' }">
        <template #prepend>
          <v-menu>
            <template #activator="{ props }">
              <v-icon v-bind="props" class="tw-ml-[6px]" color="white" @click="showSettingsMenu = !showSettingsMenu">
                mdi-cog
              </v-icon>
            </template>
            <v-list>
              <v-list-item @click="logOut()">{{ t('chats.action.logout') }}</v-list-item>
            </v-list>
          </v-menu>
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
    <app-base-card v-if="selectedItem === 'friends'">
      <template #leftpart>
        <friend-menu @change-menu="changeMenuFriend" />
      </template>
      <template #rightpart>
        <list-friends :selected-menu-friend="selectedMenuFriend" />
      </template>
    </app-base-card>
  </v-card>
  <v-dialog v-model="profileDialog" max-width="460">
    <v-card class="overflow-auto" style="height: 610px">
      <v-container>
        <v-card-title class="pa-5">
          <span class="text-h5">
            {{ t('chats.informationAccount') }}
          </span>
        </v-card-title>
        <UserProfileForm
          :close-profile-dialog="closeProfileDialog"
          :open-edit-profile="openEditProfile"
          :loadData="loadData"
        />
      </v-container>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isEditing" max-width="460">
    <v-card class="overflow-auto" style="height: 610px">
      <v-container>
        <v-card-title class="pa-5">
          <span class="text-h5">
            {{ t('profile.editInformationAccount') }}
          </span>
        </v-card-title>
        <UserEditForm
          :close-dialog="closeDialog"
          :close-profile-dialog="closeProfileDialog"
          :open-profile-dialog="openProfileDialog"
          :loadData="loadData"
        />
      </v-container>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isChangePassword" max-width="460">
    <v-card class="overflow-auto tw-max-h-[540px]">
      <v-container>
        <v-card-title class="pa-5">
          <span class="text-h5">
            {{ t('changePassword.title') }}
          </span>
        </v-card-title>
        <AuthChangePasswordForm :user="user" @close-dialog="isChangePassword = false" />
      </v-container>
    </v-card>
  </v-dialog>
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
