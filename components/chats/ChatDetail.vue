<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { formatDistanceToNowStrict } from 'date-fns'
import { useDisplay } from 'vuetify'
import ChatSendMsg from './ChatSendMsg.vue'
import ChatInfo from './ChatInfo.vue'
import { useChatStore } from '@/stores/apps/chat'

const props = defineProps({
  recipientId: {
    type: String,
    default: '',
  },
  messageReceived: {
    type: [Object, String],
    default: '',
  },
})

const { $api } = useNuxtApp()
const { data } = useAuth()

const auth = data.value
const messageReceived = computed(() => props.messageReceived)
// const { lgAndUp } = useDisplay()
//
// const store = useChatStore()
// onMounted(() => {
//   store.fetchChats()
// })
//
// const chatDetail: any = computed(() => {
//   return store.chats[store.chatContent - 1]
// })
//
// const Rpart = ref(!!lgAndUp)
//
// function toggleRpart() {
//   Rpart.value = !Rpart.value
// }

const chatDetail = ref([])
const chatContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      const element = chatContainer.value.$el || chatContainer.value
      element.scrollTop = element.scrollHeight
    }
  })
}

const fetchChatDetail = async () => {
  await $api.chats.chat(auth?.id, props.recipientId).then((res) => {
    chatDetail.value = res.data
  })
}

const addChatSendMsg = (msg) => {
  chatDetail.value.push(msg)
}

watch(
  () => props.recipientId,
  () => {
    fetchChatDetail()
  }
)

watch(
  () => messageReceived.value,
  () => {
    chatDetail.value.push(messageReceived.value)
  }
)

// Cuộn xuống mỗi khi chatDetail thay đổi
watch(chatDetail, scrollToBottom, { deep: true })

onMounted(() => {
  fetchChatDetail()
  scrollToBottom()
})
</script>
<template>
  <div v-if="chatDetail">
    <div>
      <div class="d-flex align-center gap-3 pa-4">
        <!---Topbar Row-->
        <div class="d-flex gap-2 align-center">
          <!---User Avatar-->
          <!--          <v-avatar>-->
          <!--            <img alt="pro" :src="chatDetail.thumb" width="50" />-->
          <!--          </v-avatar>-->

          <!--          <v-badge-->
          <!--            class="badg-dotDetail"-->
          <!--            :color="-->
          <!--              chatDetail.status === 'away'-->
          <!--                ? 'warning'-->
          <!--                : chatDetail.status === 'busy'-->
          <!--                ? 'error'-->
          <!--                : chatDetail.status === 'online'-->
          <!--                ? 'success'-->
          <!--                : 'containerBg'-->
          <!--            "-->
          <!--            dot-->
          <!--          />-->
          <!---Name & Last seen-->
          <!--          <div>-->
          <!--            <h5 class="text-h5 mb-n1">{{ chatDetail.name }}</h5>-->
          <!--            <small class="textPrimary">{{ chatDetail.status }}</small>-->
          <!--          </div>-->
        </div>
        <!---Topbar Icons-->
        <!--        <div class="ml-auto d-flex">-->
        <!--          <v-btn class="text-medium-emphasis" icon variant="text">-->
        <!--            <PhoneIcon size="24" />-->
        <!--          </v-btn>-->
        <!--          <v-btn class="text-medium-emphasis" icon variant="text">-->
        <!--            <VideoPlusIcon size="24" />-->
        <!--          </v-btn>-->
        <!--          <v-btn class="text-medium-emphasis" icon variant="text" @click="toggleRpart">-->
        <!--            <DotsVerticalIcon size="24" />-->
        <!--          </v-btn>-->
        <!--        </div>-->
        <!---Topbar Icons-->
      </div>
      <v-divider />
      <!---Chat History-->
      <perfect-scrollbar ref="chatContainer" class="rightpartHeight">
        <div class="d-flex">
          <div class="w-100">
            <div v-for="chat in chatDetail" :key="chat.id" class="pa-5">
              <div v-if="auth?.id === chat.senderId" class="justify-end d-flex text-end mb-1">
                <div>
                  <small v-if="chat.createdAt" class="text-medium-emphasis text-subtitle-2">
                    {{
                      formatDistanceToNowStrict(new Date(chat.timestamp), {
                        addSuffix: false,
                      })
                    }}
                    ago
                  </small>

                  <v-sheet v-if="chat.attachments == null" class="bg-grey100 rounded-md px-3 py-2 mb-1">
                    <p class="text-body-1">{{ chat.content }}</p>
                  </v-sheet>
                  <v-sheet v-else class="mb-1">
                    <img alt="pro" class="rounded-md" :src="chat.msg" width="250" />
                  </v-sheet>
                </div>
              </div>
              <div v-else class="d-flex align-items-start gap-3 mb-1">
                <!---User Avatar-->
                <!--                <v-avatar>-->
                <!--                  <img alt="pro" :src="chatDetail.thumb" width="40" />-->
                <!--                </v-avatar>-->
                <div>
                  <small v-if="chat.createdAt" class="text-medium-emphasis text-subtitle-2">
                    {{
                      formatDistanceToNowStrict(new Date(chat.timestamp), {
                        addSuffix: false,
                      })
                    }}
                    ago
                  </small>

                  <v-sheet v-if="chat.attachments == null" class="bg-grey100 rounded-md px-3 py-2 mb-1">
                    <p class="text-body-1">{{ chat.content }}</p>
                  </v-sheet>
                  <v-sheet v-else class="mb-1">
                    <img alt="pro" class="rounded-md" :src="chat.msg" width="250" />
                  </v-sheet>
                </div>
              </div>
            </div>
          </div>
          <!--          <div v-if="Rpart" class="right-sidebar">-->
          <!--            <v-sheet>-->
          <!--              <chat-info :chat-detail="chatDetail" />-->
          <!--            </v-sheet>-->
          <!--          </div>-->
        </div>
      </perfect-scrollbar>
    </div>
    <v-divider />
    <!---Chat send-->
    <chat-send-msg :recipient-id="recipientId" @chat-send-msg="addChatSendMsg" />
  </div>
</template>
<style lang="scss">
.rightpartHeight {
  height: 87vh;
}
.badg-dotDetail {
  left: -9px;
  position: relative;
  bottom: -10px;
}

.toggleLeft {
  position: absolute;
  right: 15px;
  top: 15px;
}
.right-sidebar {
  width: 320px;
  border-left: 1px solid rgb(var(--v-theme-borderColor));
  transition: 0.1s ease-in;
  flex-shrink: 0;
}

.HideLeftPart {
  display: none;
}

@media (max-width: 960px) {
  .right-sidebar {
    position: absolute;
    right: -320px;
    &.showLeftPart {
      right: 0;
      z-index: 2;
      box-shadow: 2px 1px 20px rgba(0, 0, 0, 0.1);
    }
  }
  .boxoverlay {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1;
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
