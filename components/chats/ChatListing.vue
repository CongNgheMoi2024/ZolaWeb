<script setup>
import { ref, onMounted } from 'vue'
import { useChatStore } from '@/stores/apps/chat'
import AddFriendModal from '@/components/chats/atom/AddFriendModal.vue'

const emit = defineEmits(['chatDetail'])
const { $api } = useNuxtApp()
const store = useChatStore()
const users = ref([])
const searchValue = ref('')

const fetch = async () => {
  const { data } = await $api.users.getUsers()
  users.value = data
}

const fetchChatByUserId = (id) => {
  emit('chatDetail', id)
}

onMounted(() => {
  fetch()
})
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

      <add-friend-modal />

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
        <!--        <template #prepend>-->
        <!--          <v-avatar>-->
        <!--            <img alt="pro" :src="chat.thumb" width="50" />-->
        <!--          </v-avatar>-->
        <!--          <v-badge-->
        <!--            class="badg-dot"-->
        <!--            :color="-->
        <!--              chat.status === 'away'-->
        <!--                ? 'warning'-->
        <!--                : chat.status === 'busy'-->
        <!--                ? 'error'-->
        <!--                : chat.status === 'online'-->
        <!--                ? 'success'-->
        <!--                : 'containerBg'-->
        <!--            "-->
        <!--            dot-->
        <!--          />-->
        <!--        </template>-->
        <!---Name-->
        <v-list-item-title class="text-subtitle-1 textPrimary w-100 font-weight-semibold">
          {{ user.name }}
        </v-list-item-title>
        <!---Subtitle-->
        <!--        <v-sheet v-if="chat.chatHistory.slice(-1)[0].type == 'img'">-->
        <!--          <small class="textPrimary text-subtitle-2">Sent a Photo</small>-->
        <!--        </v-sheet>-->
        <!--        <div v-else class="text-subtitle-2 textPrimary mt-1 text-truncate w-100">-->
        <!--          {{ chat.chatHistory.slice(-1)[0].msg }}-->
        <!--        </div>-->
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
