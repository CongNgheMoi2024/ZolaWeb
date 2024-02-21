<script setup>
import { ref, onMounted } from 'vue'
import { useModal } from 'vue-final-modal'
import { useI18n } from 'vue-i18n'
import { useChatStore } from '@/stores/apps/chat'
import AddFriendModal from '~/components/chats/addFriend/AddFriendModal.vue'

const emit = defineEmits(['chatDetail'])
const { $api } = useNuxtApp()
const store = useChatStore()
const users = ref([])
const searchValue = ref('')
const { t } = useI18n()
const { data } = useAuth()
const auth = data.value

const fetch = async () => {
  await $api.rooms.getRoomByUser(auth.id).then((res) => {
    users.value = res.data.map((item) => {
      return item.userRecipient
    })
  })
}

const fetchChatByUserId = (id) => {
  emit('chatDetail', id)
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
  if (status === 'away') {
    return 'warning'
  } else if (status === 'busy') {
    return 'error'
  } else if (status === 'online') {
    return 'success'
  } else {
    return 'containerBg'
  }
}
</script>
<template>
  <v-sheet>
    <div class="px-3 pt-3 tw-flex">
      <v-text-field
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
      />

      <v-btn class="tw-ml-1" size="40" variant="text" @click="open">
        <v-icon>mdi-account-plus-outline</v-icon>
      </v-btn>

      <v-btn class="tw-ml-1" size="40" variant="text">
        <v-icon>mdi-account-multiple-plus-outline</v-icon>
      </v-btn>
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
        @click="fetchChatByUserId(user.id)"
      >
        <!---Avatar-->
        <template #prepend>
          <v-avatar>
            <img alt="pro" :src="'https://randomuser.me/api/portraits/women/8.jpg'" width="50" />
          </v-avatar>
          <v-badge class="badg-dot" :color="formatStatusUser(user.status)" dot />
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
:deep(.v-text-field input.v-field__input) {
  padding-left: 6px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}
</style>
