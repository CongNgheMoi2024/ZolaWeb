<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { uniq, flatten } from 'lodash'
import { useChatStore } from '@/stores/apps/chat'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { $api } = useNuxtApp()
const { data } = useAuth()
const isOpenVideo = ref(false)
const haveCanvas = ref()

const props = defineProps({
  chatDetail: Object,
  userRecipient: Object,
  listImages: Array,
  listVideos: Array,
  listFiles: Array,
})
const auth = data.value
console.log('file', props.listFiles)

const fileExtensionImages: Record<string, string> = {
  docx: '/images/chat/docx.png',
  xlsx: '/images/chat/xlsx.png',
  pdf: '/images/chat/pdf.png',
}

const getFileTypeImage = (extension: string) => {
  const type = extension.split('.').pop()
  return fileExtensionImages[type.toLowerCase()] || '/images/chat/docx.png'
}

const createGroup = () => {
  console.log('createGroup')
}
const deleteChatHistory = () => {
  console.log('deleteChatHistory')
}

const capture = async (videoLink: string, canvasId: string): Promise<void> => {
  const video = document.createElement('video')
  video.src = videoLink
  video.currentTime = 1

  await new Promise<void>((resolve, reject) => {
    video.onloadeddata = () => resolve()
    video.onerror = (error) => reject(error)
  })

  const canvas = (await document.getElementById(canvasId)) as HTMLCanvasElement

  if (canvas) {
    canvas.width = 57
    canvas.height = 57
    canvas.getContext('2d').drawImage(video, 0, 0, 57, 57)
  }
  video.remove()
}

const openVideo = (videoLink: string) => {
  const video = document.createElement('video')
  video.src = videoLink
  video.controls = true
  video.autoplay = true
  video.style.marginLeft = 'auto'
  video.style.width = '100%'
  video.style.height = '100%'
  video.style.position = 'fixed'
  video.style.top = '0'
  video.style.left = '0'
  video.style.zIndex = '9999'
  video.style.backgroundColor = 'black'
  video.style.transition = 'all 0.5s'
  video.style.padding = '20px'
  video.style.boxSizing = 'border-box'
  video.style.cursor = 'pointer'
  video.style.borderRadius = '10px'
  video.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'
  video.style.overflow = 'hidden'
  video.style.display = 'flex'
  video.style.alignItems = 'center'
  video.style.justifyContent = 'center'

  video.onclick = () => {
    video.remove()
    isOpenVideo.value = false
  }

  document.body.appendChild(video)
}
const captureAll = () => {
  props.listVideos.forEach((video) => {
    capture(video.content, video.id)
  })
}
captureAll()

onMounted(() => {
  captureAll()
})
</script>
<template>
  <div v-if="chatDetail" class="container">
    <div class="container-info">
      <v-avatar color="grey-darken-1 mt-5" size="70">
        <img
          alt="pro"
          :src="userRecipient.avatar ? userRecipient.avatar : '/images/profile/user-1.jpg'"
          style="height: 70px; width: 70px; border-radius: 50%; border-color: lightgray; border-style: solid"
          width="70"
        />
      </v-avatar>
      <h5 class="text-h6 font-weight-medium mt-5 mb-5">{{ userRecipient.name }}</h5>
    </div>
    <div class="container-media mt-1">
      <v-list>
        <v-list-item class="list-item" @click="createGroup">
          <v-icon class="mr-3">mdi-account-multiple-plus</v-icon>
          {{ t('chats.action.createGroup') }}
        </v-list-item>
        <v-list-item class="list-item" @click="deleteChatHistory">
          <v-icon class="mr-3">mdi-delete</v-icon>
          {{ t('chats.action.deleteChatHistory') }}
        </v-list-item>
        <v-list-item class="list-item" @click="deleteChatHistory">
          <v-icon class="mr-3">mdi-magnify</v-icon>
          {{ t('chats.action.search') }}
        </v-list-item>
      </v-list>
    </div>
    <div class="container-media mt-1">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title class="text-h6">
            {{ t('chats.image') }} ({{ listImages.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-if="listImages && listImages.length > 0" v-viewer>
              <div class="image-grid">
                <v-avatar
                  v-for="{ content } in listImages"
                  :key="content"
                  class="image-item"
                  :data-source="content"
                  rounded="sm"
                  size="57"
                  style="border: 1px solid #cecece"
                >
                  <img :src="content" width="90" />
                </v-avatar>
              </div>
            </div>
            <h6 v-else style="color: gray">{{ t('chats.haveNotImageSended') }}</h6>
          </v-expansion-panel-text>
          <v-divider />
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title class="text-h6">
            {{ t('chats.video') }} ({{ listVideos.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-if="listVideos && listVideos.length > 0" class="file-list">
              <div>{{ captureAll() }}</div>
              <div class="image-grid">
                <v-avatar
                  class="image-item"
                  rounded="sm"
                  size="57"
                  style="border: 1px solid #cecece"
                  v-for="{ id, content } in listVideos"
                  :key="id"
                >
                  <div @click="openVideo(content)">
                    <canvas :id="id" height="57" width="57" />
                  </div>
                </v-avatar>
              </div>
            </div>
            <h6 v-else style="color: gray">{{ t('chats.haveNotVideoSended') }}</h6>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title class="text-h6">
            {{ t('chats.file') }} ({{ listFiles.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-if="listFiles && listFiles.length > 0" class="file-list">
              <div v-for="{ content, fileName, id } in listFiles" :key="id" class="file-item">
                <v-row class="file-thumbnail mt-4 mb-4" style="align-items: center">
                  <img alt="File type" height="30" :src="getFileTypeImage(content)" width="30" />
                  <div class="file-name ml-2" style="max-width: 205px">{{ fileName }}</div>
                  <v-spacer />
                  <a download :href="content">
                    <v-icon color="primary" size="20">mdi-download</v-icon>
                  </a>
                </v-row>
                <v-divider />
              </div>
            </div>
            <h6 v-else style="color: gray">{{ t('chats.haveNotFileSended') }}</h6>
          </v-expansion-panel-text>
          <v-divider />
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>
<style lang="scss">
.container {
  display: flex;
  background-color: #f5f5f5;
  overflow-y: auto;
  overflow-x: none;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  max-height: 540px;
  max-width: 100%;
  padding: 5px;
}
.container-info {
  background-color: #ffffff;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
}

.list-item {
  width: 100%;
  align-items: left;
  padding: 5px;
}
.container-media {
  background-color: #ffffff;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: top;
}
.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}

.image-item {
  display: flex;
  align-items: center;
}
</style>
