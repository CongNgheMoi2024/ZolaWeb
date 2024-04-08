<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { formatDistanceToNowStrict } from 'date-fns'
import { useDisplay } from 'vuetify'
import ChatSendMsg from './ChatSendMsg.vue'
import ChatInfo from './ChatInfo.vue'
import { useChatStore } from '@/stores/apps/chat'
import messages from '@/utils/locales/messages'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  userRecipient: {
    type: Object,
    default: () => ({}),
  },
  messageReceived: {
    type: [Object, String],
    default: '',
  },
})
const { t } = useI18n()
const menu = ref('')
const myOptionsMsg = ref()
const optionsMsg = ref()
const dialogForward = ref(false)
const chatForward = ref({})
const emit = defineEmits(['chat-send-msg'])

const { $api } = useNuxtApp()
const { data } = useAuth()

const auth = data.value
const messageReceived = toRef(props, 'messageReceived')
const userRecipient = toRef(props, 'userRecipient')

const { lgAndUp } = useDisplay()
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
const Rpart = ref(!!lgAndUp)

function toggleRpart() {
  Rpart.value = !Rpart.value
}

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
  await $api.chats.chat(auth?.id, props.userRecipient.id).then((res) => {
    chatDetail.value = res.data
    myOptionsMsg.value = Array(chatDetail.value.length).fill(false)
    optionsMsg.value = Array(chatDetail.value.length).fill(false)
  })
  scrollToBottom()
}

const addChatSendMsg = (msg) => {
  chatDetail.value.push(msg)
  fetchChatDetail()
  emit('chat-send-msg', msg)
  scrollToBottom()
}

watch(
  () => userRecipient,
  () => {
    fetchChatDetail()
  },
  { deep: true, immediate: true }
)

watch(
  () => messageReceived.value,
  () => {
    chatDetail.value.push(messageReceived.value)
    scrollToBottom()
  }
)

const formatStatusUser = (status) => {
  if (status === false) {
    return 'error'
  } else if (status === true) {
    return 'success'
  } else {
    return 'containerBg'
  }
}

const showMenu = (id) => {
  menu.value = id
}

const closeMenu = (id) => {
  menu.value = ''
}

const isMenuVisible = (id) => {
  return menu.value === id
}

const openOptionsMsg = (chatId) => {
  optionsMsg.value[chatId] = true
}

const openMyOptionsMsg = (chatId) => {
  myOptionsMsg.value[chatId] = true
}

const copyMsg = (id) => {
  console.log('copy', id)
}
const deleteMsg = (id) => {
  console.log('delete', id)
}
const forwardMsg = (chat) => {
  dialogForward.value = true
  chatForward.value = chat
}

const closeDialogForward = () => {
  fetchChatDetail()
  dialogForward.value = false
}
</script>
<template>
  <div v-if="chatDetail">
    <div>
      <div v-if="Object.keys(userRecipient).length > 0" class="d-flex align-center gap-3 pa-4">
        <!---Topbar Row-->
        <div class="d-flex gap-2 align-center">
          <!---User Avatar-->
          <v-avatar>
            <img alt="pro" :src="'https://randomuser.me/api/portraits/women/8.jpg'" width="50" />
          </v-avatar>

          <v-badge class="badg-dotDetail" :color="formatStatusUser(userRecipient.onlineStatus)" dot />
          <!---Name & Last seen-->
          <div>
            <h5 class="text-h5 mb-n1">{{ userRecipient.name }}</h5>
            <small class="textPrimary">{{ userRecipient.status }}</small>
          </div>
        </div>
        <!---Topbar Icons-->
        <div class="ml-auto d-flex">
          <v-btn class="text-medium-emphasis" icon variant="text">
            <PhoneIcon size="24" />
          </v-btn>
          <v-btn class="text-medium-emphasis" icon variant="text">
            <VideoPlusIcon size="24" />
          </v-btn>
          <v-btn class="text-medium-emphasis" icon variant="text" @click="toggleRpart">
            <DotsVerticalIcon size="24" />
          </v-btn>
        </div>
        <!---Topbar Icons-->
      </div>
      <v-divider />
      <!---Chat History-->
      <div class="rightpartHeight">
        <div class="d-flex">
          <div class="w-100">
            <perfect-scrollbar ref="chatContainer" class="rightpartHeight">
              <div v-for="chat in chatDetail" :key="chat.id" class="pa-5">
                <div class="messages-container" @mouseenter="showMenu(chat.id)" @mouseleave="closeMenu(chat.id)">
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
                      <v-row>
                        <div v-show="isMenuVisible(chat.id)">
                          <v-menu v-model="myOptionsMsg[chat.id]" attach location="start">
                            <template #activator="{ props }">
                              <v-btn
                                v-bind="props"
                                class="text-medium-emphasis message-menu"
                                icon
                                size="42"
                                style="margin-right: 10px"
                                variant="text"
                                @click="openMyOptionsMsg(chat.id)"
                              >
                                <DotsVerticalIcon size="24" />
                              </v-btn>
                            </template>
                            <v-sheet style="text-align: left">
                              <v-list>
                                <v-list-item @click="copyMsg(chat.id)">Copy</v-list-item>
                                <v-list-item @click="forwardMsg(chat)">Forward</v-list-item>
                                <v-list-item @click="withdrawMsg(chat.id)">Withdraw</v-list-item>
                                <v-list-item @click="deleteMsg(chat.id)">Delete</v-list-item>
                              </v-list>
                            </v-sheet>
                          </v-menu>
                        </div>
                        <v-sheet v-if="chat.attachments == null" class="bg-grey100 rounded-md px-3 py-2 mb-1">
                          <p class="text-body-1">{{ chat.content }}</p>
                        </v-sheet>
                        <v-sheet v-else class="mb-1">
                          <img alt="pro" class="rounded-md" :src="chat.msg" width="250" />
                        </v-sheet>
                      </v-row>
                    </div>
                  </div>
                  <div v-else class="d-flex align-items-start gap-3 mb-1">
                    <!---User Avatar-->
                    <!-- <v-avatar>
                    <img alt="pro" :src="chatDetail.thumb" width="40" />
                  </v-avatar> -->
                    <div>
                      <small v-if="chat.createdAt" class="text-medium-emphasis text-subtitle-2">
                        {{
                          formatDistanceToNowStrict(new Date(chat.timestamp), {
                            addSuffix: false,
                          })
                        }}
                        ago
                      </small>
                      <v-row>
                        <v-sheet v-if="chat.attachments == null" class="bg-grey100 rounded-md px-3 py-2 mb-1">
                          <p class="text-body-1">{{ chat.content }}</p>
                        </v-sheet>
                        <v-sheet v-else class="mb-1">
                          <img alt="pro" class="rounded-md" :src="chat.msg" width="250" />
                        </v-sheet>
                        <div v-show="isMenuVisible(chat.id)" class="message-menu">
                          <v-menu v-model="optionsMsg[chat.id]" attach location="end">
                            <template #activator="{ props }">
                              <v-btn
                                v-bind="props"
                                class="text-medium-emphasis"
                                icon
                                size="42"
                                style="margin-left: 10px"
                                variant="text"
                                @click="openOptionsMsg(chat.id)"
                              >
                                <DotsVerticalIcon size="24" />
                              </v-btn>
                            </template>
                            <v-sheet>
                              <v-list>
                                <v-list-item @click="copyMsg(chat.id)">Copy</v-list-item>
                                <v-list-item @click="forwardMsg(chat)">Forward</v-list-item>
                                <v-list-item @click="deleteMsg(chat.id)">Delete</v-list-item>
                              </v-list>
                            </v-sheet>
                          </v-menu>
                        </div>
                      </v-row>
                    </div>
                  </div>
                </div>
              </div>
            </perfect-scrollbar>
          </div>
          <div v-if="Rpart" class="right-sidebar">
            <v-sheet>
              <chat-info :chat-detail="chatDetail" />
            </v-sheet>
          </div>
        </div>
      </div>
    </div>
    <v-divider />
    <!---Chat send-->
    <chat-send-msg :recipient-id="userRecipient.id" @chat-send-msg="addChatSendMsg" />
  </div>
  <v-dialog v-model="dialogForward" max-width="700px">
    <v-card>
      <v-card-title>{{ t('chats.forwardMessage') }}</v-card-title>
      <ChatsForwardDialog :chatForward="chatForward" :closeDialogForward="closeDialogForward" />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="closeDialogForward">Thoát</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style lang="scss">
.rightpartHeight {
  height: 78vh;
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
