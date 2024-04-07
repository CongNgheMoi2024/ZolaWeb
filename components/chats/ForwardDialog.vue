<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import profileBg from '@/images/backgrounds/profilebg.jpg'
const router = useRouter()

const { t } = useI18n()
const toast = useToast()
const { data } = useAuth()
const { $api } = useNuxtApp()
const user = ref({})
const auth = data.value
const loading = ref(false)
const search = ref('')
const friends = ref([])
const selectedFriends = ref([])
const widthDialog = ref(700)
const message = ref(props.chatForward.content)

const props = defineProps({
  chatForward: {
    type: Object,
    default: () => ({}),
  },
  closeDialogForward: {
    type: Function,
    default: () => {},
  },
})

const fetchProfile = async () => {
  await $api.users.getProfile(auth.id).then((res) => {
    user.value = res.data
  })
}

const fetchFriends = async () => {
  loading.value = true
  await $api.users
    .getFriends()
    .then((res) => {
      friends.value = res.data
    })
    .catch((error) => {
      toast.error(error.message)
    })
    .finally(() => {
      loading.value = false
    })
}

const searchName = (value) => {
  if (value !== '') {
    friends.value = friends.value.filter((friend) => friend.name.toLowerCase().includes(value.toLowerCase()))
  } else {
    fetchFriends()
  }
}

const sendMsgTo = async (list) => {
  try {
    await $api.chats.forwardMessage(props.chatForward.id, list).then((res) => {
      toast.success(t('chats.message.forwardSuccess'))
      props.closeDialogForward()
    })
  } catch (error) {
    toast.error(t('chats.message.forwardError'))
    console.log('Error:', error.message)
  } finally {
    loading.value = false
  }
  selectedFriends.value = []
  console.log('Forwarded to:', list, 'msg:', props.chatForward)
}

const removeSelectedFriend = (index) => {
  // Xóa bạn bè khỏi danh sách đã chọn khi nhấn vào biểu tượng xóa trên mỗi dòng
  selectedFriends.value.splice(index, 1)
}

watch(selectedFriends, (newValue) => {
  widthDialog.value = newValue.length !== null ? 700 : 350
})

onMounted(() => {
  fetchProfile()
  fetchFriends()
})
</script>
<template>
  <v-card class="overflow-hidden" elevation="10" :style="{ height: '500px', width: widthDialog + 'px' }">
    <v-row>
      <!-- Danh sách bạn bè -->
      <v-col :cols="selectedFriends.length === 0 || !selectedFriends ? 12 : 6" class="overflow-auto">
        <v-text-field
          v-model="search"
          class="mt-4 ml-6 mr-6"
          :label="t('chats.model.findPeopleAndGroup')"
          type="text"
          prepend-inner-icon="mdi-magnify"
          @update:modelValue="searchName"
        />

        <perfect-scrollbar :style="{ width: '99%', height: '300px' }">
          <v-list class="ml-3">
            <v-list-item
              v-for="recipient in friends"
              :key="recipient.id"
              class="text-no-wrap chatItem"
              color="primary"
              lines="two"
              :value="recipient.id"
            >
              <template #prepend>
                <v-avatar>
                  <img alt="pro" :src="recipient.avatar ?? '/images/profile/user-1.jpg'" width="50" />
                </v-avatar>
              </template>

              <v-list-item-title class="text-subtitle-1 textPrimary w-100 font-weight-semibold">
                {{ recipient.name }}
              </v-list-item-title>

              <template #append>
                <v-checkbox v-model="selectedFriends" :value="recipient" />
              </template>
            </v-list-item>
          </v-list>
        </perfect-scrollbar>
      </v-col>
      <v-col v-if="selectedFriends.length > 0" class="overflow-auto" cols="6">
        <v-card class="mt-4 mr-3" style="width: 320px">
          <v-card-title>{{ t('chats.friendsSelected') }}</v-card-title>
          <perfect-scrollbar style="height: 320px">
            <v-list>
              <v-list-item v-for="(friend, index) in selectedFriends" :key="friend.id">
                <v-row align="center" justify="space-between" style="width: 100%">
                  <v-col>{{ friend.name }}</v-col>
                  <v-col cols="auto">
                    <v-btn icon size="24" @click="removeSelectedFriend(index)">
                      <v-icon size="24">mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9">
        <v-textarea
          v-model="message"
          class="ml-7"
          color="primary"
          disabled
          :label="t('chats.model.message')"
          prepend-inner-icon="mdi-message"
          rows="3"
          type="text"
        />
      </v-col>
      <v-col cols="3">
        <v-btn
          class="mr-2"
          color="primary"
          :disabled="selectedFriends.length === 0"
          style="width: 130px; height: 80px"
          @click="sendMsgTo(selectedFriends)"
        >
          {{ t('chats.action.forward') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>
<style></style>
