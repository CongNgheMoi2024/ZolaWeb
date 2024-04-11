<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { formatDistanceToNowStrict } from 'date-fns'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ChatSendMsg from './ChatSendMsg.vue'
import ChatInfo from './ChatInfo.vue'
import { useChatStore } from '@/stores/apps/chat'
import messages from '@/utils/locales/messages'

const toast = useToast()
const props = defineProps({
  userRecipient: {
    type: Object,
    default: () => ({}),
  },
  messageReceived: {
    type: [Object, String],
    default: '',
  },
  reloadChatDetail: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const menu = ref('')
const myOptionsMsg = ref()
const optionsMsg = ref()
const dialogForward = ref(false)
const chatForward = ref({})
const emit = defineEmits(['chat-send-msg', 'reload-chat-listing', 'chat-withdraw-msg', 'fetch-chat-detail', 'reload-chat-detail'])
const nuxtApp = useNuxtApp()
const stompClient = nuxtApp.$stompClient
const { $api } = useNuxtApp()
const { data } = useAuth()

const auth = data.value
const messageReceived = toRef(props, 'messageReceived')
const userRecipient = toRef(props, 'userRecipient')

const { lgAndUp } = useDisplay()
const listMedia = ref([])
const listImages = ref([])
const listVideos = ref([])
const listFiles = ref([])
//
// const store = useChatStore()
// onMounted(() => {
// store.fetchChats()
// })
//
// const chatDetail: any = computed(() => {
//   return store.chats[store.chatContent - 1]
// })
//

const getImagesAndVideos = async () => {
  await $api.chats.getImagesAndVideos(auth.id, props.userRecipient.id).then((res) => {
    listMedia.value = res.data
    listImages.value = listMedia.value.filter((item) => item.type === 'IMAGE')
    listVideos.value = listMedia.value.filter((item) => item.type === 'VIDEO')
  })
}
const getFiles = async () => {
  await $api.chats.getFiles(auth.id, props.userRecipient.id).then((res) => {
    listFiles.value = res.data
  })
}

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
    emit('fetch-chat-detail')
  })
  scrollToBottom()
  setTimeout(() => {
    scrollToBottom()
  }, 1500)
}

const addChatSendMsg = (msg) => {
  chatDetail.value.push(msg)
  fetchChatDetail()
  emit('chat-send-msg', msg)
  scrollToBottom()
  getImagesAndVideos()
  getFiles()
}

watch(
  () => userRecipient,
  () => {
    fetchChatDetail()
    getImagesAndVideos()
    getFiles()
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

watch(
  () => props.reloadChatDetail,
  () => {
    if (props.reloadChatDetail) {
      fetchChatDetail()
      emit('reload-chat-detail')
    }
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

const copyMsg = (content) => {
  // copy noi dung tin nhan
  navigator.clipboard.writeText(content)
}
const deleteMsg = async (id) => {
  try {
    await $api.chats.deleteMessage(id).then(() => {
      toast.success(t('chats.message.deleteSuccess'))
      fetchChatDetail()
      emit('reload-chat-listing')
    })
  } catch (error) {
    console.log(error.message)
    toast.error(t('chats.message.deleteError'))
  }
}
const forwardMsg = (chat) => {
  dialogForward.value = true
  chatForward.value = chat
}

const closeDialogForward = () => {
  fetchChatDetail()
  dialogForward.value = false
}

const checkTypeFile = (url) => {
  const type = url.split('.').pop()
  if (type === 'pdf') {
    return 'pdf'
  } else if (type === 'docx') {
    return 'docx'
  } else if (type === 'xlsx') {
    return 'xlsx'
  } else if (type === 'mp4') {
    return 'mp4'
  }

  return 'txt'
}

const withdrawMsg = async (id) => {
  try {
    if (stompClient) {
      stompClient.send('/app/delete', {}, JSON.stringify(id))
      toast.success(t('chats.message.withdrawSuccess'))
      fetchChatDetail()
      reloadChatListing()
      emit('chat-withdraw-msg', id)
    }
  } catch (error) {
    console.log(error.message)
    toast.error(t('chats.message.withdrawError'))
  }
}

const reloadChatListing = () => {
  emit('reload-chat-listing')
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
            <img
              alt="pro"
              :src="userRecipient.avatar ? userRecipient.avatar : '/images/profile/user-1.jpg'"
              width="50"
            />
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
              <div v-for="(chat, index) in chatDetail" :key="chat.id" class="pa-5">
                <div class="messages-container" @mouseenter="showMenu(chat.id)" @mouseleave="closeMenu(chat.id)">
                  <div
                    v-if="auth?.id === chat.senderId && (chat.status === null || chat.status === 'SENT')"
                    class="justify-end d-flex text-end mb-1"
                  >
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
                                @click.stop
                              >
                                <DotsVerticalIcon size="24" />
                              </v-btn>
                            </template>
                            <v-sheet style="text-align: left">
                              <v-list>
                                <v-list-item @click="copyMsg(chat.content)">
                                  <v-icon>mdi-content-copy</v-icon>
                                  {{ t('chats.action.copy') }}
                                  <v-divider class="mt-2" />
                                </v-list-item>
                                <v-list-item @click="forwardMsg(chat)">
                                  <v-icon>mdi-forward</v-icon>
                                  {{ t('chats.action.forward') }}
                                  <v-divider class="mt-2" />
                                </v-list-item>
                                <v-list-item @click="withdrawMsg(chat.id)">
                                  <v-icon>mdi-restore</v-icon>
                                  {{ t('chats.action.withdraw') }}
                                  <v-divider class="mt-2" />
                                </v-list-item>
                                <v-list-item @click="deleteMsg(chat.id)">
                                  <v-icon>mdi-delete</v-icon>
                                  {{ t('chats.action.delete') }}
                                </v-list-item>
                              </v-list>
                            </v-sheet>
                          </v-menu>
                        </div>
                        <v-sheet v-if="chat.type === 'IMAGE'" class="mb-1">
                          <img v-viewer :alt="chat.content" class="tw-max-w-[500px]" :src="chat.content" />
                        </v-sheet>
                        <v-sheet v-else-if="chat.type === 'FILE'" class="mb-1">
                          <template v-if="checkTypeFile(chat.content) === 'pdf'">
                            <div class="bg-grey100 rounded-md px-3 py-2 mb-1">
                              <div class="d-flex align-center gap-2">
                                <img alt="pdf" class="tw-w-[100px] tw-h-[100px]" src="/images/chat/pdf.png" />
                                <div>
                                  <p class="text-body-1">{{ chat.fileName }}</p>
                                  <a download :href="chat.content">
                                    <v-icon color="primary">mdi-download</v-icon>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-else-if="checkTypeFile(chat.content) === 'docx'">
                            <div class="bg-grey100 rounded-md px-3 py-2 mb-1">
                              <div class="d-flex align-center gap-2">
                                <img alt="pdf" class="tw-w-[100px] tw-h-[100px]" src="/images/chat/docx.png" />
                                <div>
                                  <p class="text-body-1">{{ chat.fileName }}</p>
                                  <a download :href="chat.content">
                                    <v-icon color="primary">mdi-download</v-icon>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-else-if="checkTypeFile(chat.content) === 'xlsx'">
                            <div class="bg-grey100 rounded-md px-3 py-2 mb-1">
                              <div class="d-flex align-center gap-2">
                                <img alt="pdf" class="tw-w-[100px] tw-h-[100px]" src="/images/chat/xlsx.png" />
                                <div>
                                  <p class="text-body-1">{{ chat.fileName }}</p>
                                  <a download :href="chat.content">
                                    <v-icon color="primary">mdi-download</v-icon>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div class="bg-grey100 rounded-md px-3 py-2 mb-1">
                              <div class="d-flex align-center gap-2">
                                <div>
                                  <p class="text-body-1">{{ chat.fileName }}</p>
                                  <a download :href="chat.content">
                                    <v-icon color="primary">mdi-download</v-icon>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </template>
                        </v-sheet>
                        <v-sheet v-else-if="chat.type === 'VIDEO'" class="mb-1">
                          <video class="tw-max-w-[500px]" controls :src="chat.content" />
                        </v-sheet>
                        <v-sheet v-else class="bg-grey100 rounded-md px-3 py-2 mb-1 tw-max-w-[590px]">
                          <p class="text-body-1">{{ chat.content }}</p>
                        </v-sheet>
                      </v-row>
                    </div>
                  </div>
                  <div
                    v-else-if="auth?.id !== chat.senderId && (chat.status === null || chat.status === 'SENT')"
                    class="d-flex align-items-start gap-3 mb-1 tw-max-w-[700px]"
                  >
                    <!---User Avatar-->
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
                        <v-avatar v-if="index === 0 || chat.senderId !== chatDetail[index - 1].senderId">
                          <img
                            alt="pro"
                            :src="userRecipient.avatar ? userRecipient.avatar : '/images/profile/user-1.jpg'"
                            width="40"
                          />
                        </v-avatar>
                        <div v-else class="ml-10" />
                        <v-sheet v-if="chat.type === 'IMAGE'" class="mb-1 ml-5">
                          <img v-viewer :alt="chat.content" class="tw-max-w-[500px]" :src="chat.content" />
                        </v-sheet>

                        <v-sheet v-else-if="chat.type === 'FILE'" class="mb-1 tw-max-w-[630px] ml-5">
                          <template v-if="checkTypeFile(chat.content) === 'pdf'">
                            <div class="bg-grey100 rounded-md px-3 py-2 mb-1">
                              <div class="d-flex align-center gap-2">
                                <img alt="pdf" class="tw-w-[100px] tw-h-[100px]" src="/images/chat/pdf.png" />
                                <div>
                                  <p class="text-body-1">{{ chat.fileName }}</p>
                                  <a download :href="chat.content">
                                    <v-icon color="primary">mdi-download</v-icon>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-else-if="checkTypeFile(chat.content) === 'docx'">
                            <div class="bg-grey100 rounded-md px-3 py-2 mb-1">
                              <div class="d-flex align-center gap-2">
                                <img alt="pdf" class="tw-w-[100px] tw-h-[100px]" src="/images/chat/docx.png" />
                                <div>
                                  <p class="text-body-1">{{ chat.fileName }}</p>
                                  <a download :href="chat.content">
                                    <v-icon color="primary">mdi-download</v-icon>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-else-if="checkTypeFile(chat.content) === 'xlsx'">
                            <div class="bg-grey100 rounded-md px-3 py-2 mb-1">
                              <div class="d-flex align-center gap-2">
                                <img alt="pdf" class="tw-w-[100px] tw-h-[100px]" src="/images/chat/xlsx.png" />
                                <div>
                                  <p class="text-body-1">{{ chat.fileName }}</p>
                                  <a download :href="chat.content">
                                    <v-icon color="primary">mdi-download</v-icon>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div class="bg-grey100 rounded-md px-3 py-2 mb-1">
                              <div class="d-flex align-center gap-2">
                                <div>
                                  <p class="text-body-1">{{ chat.fileName }}</p>
                                  <a download :href="chat.content">
                                    <v-icon color="primary">mdi-download</v-icon>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </template>
                        </v-sheet>
                        <v-sheet v-else-if="chat.type === 'VIDEO'" class="mb-1 ml-5">
                          <video class="tw-max-w-[500px]" controls :src="chat.content" />
                        </v-sheet>
                        <v-sheet v-else class="bg-grey100 rounded-md px-3 py-2 mb-1 ml-5 tw-max-w-[640px]">
                          <p class="text-body-1">{{ chat.content }}</p>
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
                                <v-list-item @click="copyMsg(chat.content)">
                                  <v-icon>mdi-content-copy</v-icon>
                                  {{ t('chats.action.copy') }}
                                  <v-divider class="mt-2" />
                                </v-list-item>
                                <v-list-item @click="forwardMsg(chat)">
                                  <v-icon>mdi-forward</v-icon>
                                  {{ t('chats.action.forward') }}
                                  <v-divider class="mt-2" />
                                </v-list-item>
                                <v-list-item @click="deleteMsg(chat.id)">
                                  <v-icon>mdi-delete</v-icon>
                                  {{ t('chats.action.delete') }}
                                </v-list-item>
                              </v-list>
                            </v-sheet>
                          </v-menu>
                        </div>
                      </v-row>
                    </div>
                  </div>
                  <div
                    v-else-if="auth?.id !== chat.senderId && chat.status === 'DELETED'"
                    class="d-flex align-items-start gap-3 mb-1 tw-max-w-[700px]"
                  >
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
                        <v-avatar v-if="index === 0 || chat.senderId !== chatDetail[index - 1].senderId">
                          <img
                            alt="pro"
                            :src="userRecipient.avatar ? userRecipient.avatar : '/images/profile/user-1.jpg'"
                            width="40"
                          />
                        </v-avatar>
                        <div v-else class="ml-10" />
                        <v-sheet class="bg-grey100 rounded-md px-3 py-2 mb-1 ml-5 tw-max-w-[640px]">
                          <p class="text-body-1" style="color: gray">{{ t('chats.messageWithdrawed') }}</p>
                        </v-sheet>
                        <div v-show="isMenuVisible(chat.id)">
                          <v-menu v-model="myOptionsMsg[chat.id]" attach location="end">
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
                                <v-list-item @click="deleteMsg(chat.id)">
                                  <v-icon>mdi-delete</v-icon>
                                  {{ t('chats.action.delete') }}
                                </v-list-item>
                              </v-list>
                            </v-sheet>
                          </v-menu>
                        </div>
                      </v-row>
                    </div>
                  </div>
                  <div v-else class="justify-end d-flex text-end mb-1">
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
                                <v-list-item @click="deleteMsg(chat.id)">
                                  <v-icon>mdi-delete</v-icon>
                                  {{ t('chats.action.delete') }}
                                </v-list-item>
                              </v-list>
                            </v-sheet>
                          </v-menu>
                        </div>

                        <v-sheet class="bg-grey100 rounded-md px-3 py-2 mb-1 tw-max-w-[800px]">
                          <p class="text-body-1" style="color: gray">{{ t('chats.messageWithdrawed') }}</p>
                        </v-sheet>
                      </v-row>
                    </div>
                  </div>
                </div>
              </div>
            </perfect-scrollbar>
          </div>
          <div v-if="Rpart" class="right-sidebar">
            <perfect-scrollbar>
              <v-sheet>
                <chat-info
                  :chat-detail="chatDetail"
                  :list-files="listFiles"
                  :list-images="listImages"
                  :list-videos="listVideos"
                  :user-recipient="userRecipient"
                />
              </v-sheet>
            </perfect-scrollbar>
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
      <ChatsForwardDialog
        :chat-forward="chatForward"
        :close-dialog-forward="closeDialogForward"
        @reload-chat-listing="reloadChatListing"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="closeDialogForward">
          {{ t('chats.action.exit') }}
        </v-btn>
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
