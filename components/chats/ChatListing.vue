<script setup>
import { ref, onMounted } from 'vue'
import { useModal } from 'vue-final-modal'
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash'
import { useChatStore } from '@/stores/apps/chat'
import AddFriendModal from '~/components/chats/addFriend/AddFriendModal.vue'
import AppLoading from '@/components/common/AppLoading.vue'

const emit = defineEmits(['chatDetail'])
const { $api } = useNuxtApp()
const store = useChatStore()
const users = ref([])
const searchValue = ref('')
const { t } = useI18n()
const { data } = useAuth()
const auth = data.value
const userFriends = ref([])
const menuOpen = ref(false)
const loadingSearchFriend = ref(false)

const fetch = async () => {
  await $api.rooms.getRoomByUser(auth.id).then((res) => {
    users.value = res.data.map((item) => {
      return item.userRecipient
    })
  })
}

const fetchChatByUserId = (userRecipient) => {
  emit('chatDetail', userRecipient)
}

onMounted(() => {
  fetch()
})

const { open, close } = useModal({
  component: AddFriendModal,
  attrs: {
    title: t('chats.addFriend'),
    submitText: t('common.action.search'),
    cancelText: t('common.action.cancel'),
    width: '500px',
    zIndexFn: () => 1010,
    onClosed() {
      close()
    },
  },
})

const formatStatusUser = (status) => {
  if (status === false) {
    return 'error'
  } else if (status === true) {
    return 'success'
  } else {
    return 'containerBg'
  }
}

const toggleMenu = (event) => {
  event.stopPropagation()
  menuOpen.value = true
}

const closeMenu = () => {
  searchValue.value = ''
  menuOpen.value = false
  userFriends.value = []
}

const searchFriend = debounce((value) => {
  if (value !== '') {
    loadingSearchFriend.value = true
    $api.users
      .getFriendByName(auth.id, value)
      .then((res) => {
        userFriends.value = res.data
      })
      .finally(() => {
        loadingSearchFriend.value = false
      })
  } else {
    userFriends.value = []
  }
}, 1000)
</script>
<template>
  <v-sheet>
    <div class="px-3 pt-3 tw-flex">
      <v-menu v-model="menuOpen" class="elevation-0" :offset="[5, 12]" offset-y :persistent="true" width="279">
        <template #activator="{ props }">
          <v-text-field
            v-bind="props"
            v-model="searchValue"
            append-inner-icon="mdi-magnify"
            class="shrink tw-w-3/4"
            dense
            density="compact"
            filled
            hide-details
            placeholder="Search Contact"
            rounded
            single-line
            variant="outlined"
            @click="toggleMenu"
            @update:model-value="searchFriend"
          />
        </template>
        <v-list class="elevation-0">
          <v-list class="elevation-0">
            <template v-if="userFriends.length > 0">
              <app-loading v-if="loadingSearchFriend" />
              <v-list-item
                v-for="(user, index) in userFriends"
                :key="index"
                :value="index"
                @click="fetchChatByUserId(user)"
              >
                <template #prepend>
                  <v-avatar>
                    <img alt="pro" :src="'https://randomuser.me/api/portraits/women/8.jpg'" width="50" />
                  </v-avatar>
                </template>
                <!---Name-->
                <v-list-item-title class="text-subtitle-1 textPrimary w-100 font-weight-semibold">
                  {{ user.name }}
                </v-list-item-title>
              </v-list-item>
            </template>
            <template v-else>
              <v-list-item>
                <v-list-item-title class="text-center text-subtitle-1">Vui lòng nhập tên để tìm</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-list>
      </v-menu>

      <div v-if="menuOpen === false" class="tw-flex">
        <v-btn class="tw-ml-1" size="40" variant="text" @click="open">
          <v-icon>mdi-account-plus-outline</v-icon>
        </v-btn>

        <v-btn class="tw-ml-1" size="40" variant="text">
          <v-icon>mdi-account-multiple-plus-outline</v-icon>
        </v-btn>
      </div>
      <div v-else class="tw-ml-1">
        <v-btn size="40" variant="text" @click="closeMenu">
          <template #default>
            <span class="tw-text-sm">{{ t('common.action.close') }}</span>
          </template>
        </v-btn>
      </div>
    </div>
  </v-sheet>
  <perfect-scrollbar class="lgScroll">
    <v-list>
      <!---Single Item-->
      <v-list-item
        v-for="user in users"
        :key="user.id"
        class="text-no-wrap chatItem"
        color="primary"
        lines="two"
        :value="user.id"
        @click="fetchChatByUserId(user)"
      >
        <!---Avatar-->
        <template #prepend>
          <v-avatar>
            <img alt="pro" :src="'https://randomuser.me/api/portraits/women/8.jpg'" width="50" />
          </v-avatar>

          <v-badge class="badg-dotDetail" :color="formatStatusUser(user.onlineStatus)" dot />
        </template>
        <!---Name-->
        <v-list-item-title class="text-subtitle-1 textPrimary w-100 font-weight-semibold">
          {{ user.name }}
        </v-list-item-title>
        <!---Subtitle-->
        <!--                <v-sheet v-if="chat.chatHistory.slice(-1)[0].type == 'img'">-->
        <!--                  <small class="textPrimary text-subtitle-2">Sent a Photo</small>-->
        <!--                </v-sheet>-->
        <!--                <div v-else class="text-subtitle-2 textPrimary mt-1 text-truncate w-100">-->
        <!--                  {{ chat.chatHistory.slice(-1)[0].msg }}-->
        <!--                </div>-->
        <!---Last seen--->
        <!--        <template #append>-->
        <!--          <div class="d-flex flex-column text-right w-25">-->
        <!--            <small class="textPrimary text-subtitle-2">-->
        <!--              {{-->
        <!--                formatDistanceToNowStrict(new Date(lastActivity(chat)), {-->
        <!--                  addSuffix: false,-->
        <!--                })-->
        <!--              }}-->
        <!--            </small>-->
        <!--          </div>-->
        <!--        </template>-->
      </v-list-item>
    </v-list>
  </perfect-scrollbar>
</template>
<style scoped>
.chatItem {
  padding: 16px 24px !important;
  border-bottom: 1px solid rgb(var(--v-theme-inputBorder), 0.1);
}
.lgScroll {
  height: 670px;
}
.badg-dotDetail {
  left: -9px;
  position: relative;
  bottom: -10px;
}
:deep(.v-text-field input.v-field__input) {
  padding-left: 6px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}
</style>
