<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { uniq, flatten } from 'lodash'
import { useChatStore } from '@/stores/apps/chat'

const { $api } = useNuxtApp()
const props = defineProps({ chatDetail: Object, userRecipient: Object })

// const totalAttachment = computed(() => {
//   return uniq(flatten(props.chatDetail?.chatHistory.map((item: any) => item.attachment))).length
// })

// const totalMedia = computed(() => {
//   return (
//     uniq(flatten(props.chatDetail?.chatHistory.map((item: any) => (item?.type === 'img' ? item.msg : null)))).length - 1
//   )
// })
const media = [
  {
    id: '1',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg',
  },
  {
    id: '2',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaefwsUtiRTN9847QrLwWfj-a8kkcM_ktrXw&s',
  },

  {
    id: '3',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaefwsUtiRTN9847QrLwWfj-a8kkcM_ktrXw&s',
  },
  {
    id: '4',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaefwsUtiRTN9847QrLwWfj-a8kkcM_ktrXw&s',
  },

  {
    id: '12',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaefwsUtiRTN9847QrLwWfj-a8kkcM_ktrXw&s',
  },
]

const createGroup = () => {
  console.log('createGroup')
}
const deleteChatHistory = () => {
  console.log('deleteChatHistory')
}
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
          <v-icon>mdi-account-multiple-plus</v-icon>
          Create Group
        </v-list-item>
        <v-list-item class="list-item" @click="deleteChatHistory">
          <v-icon>mdi-delete</v-icon>
          Delete Chat History
        </v-list-item>
        <v-list-item class="list-item" @click="deleteChatHistory">
          <v-icon>mdi-magnify</v-icon>
          Search
        </v-list-item>
      </v-list>
    </div>
    <div class="container-media mt-1">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title class="text-h6">Ảnh/Video</v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="image-grid">
              <div v-for="(image, index) in media" :key="index" class="image-item">
                <v-avatar rounded="md" size="60">
                  <img alt="pro" :src="image.src" width="70" />
                </v-avatar>
              </div>
            </div>
          </v-expansion-panel-text>
          <v-divider />
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title class="text-h6">Video</v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="image-grid">
              <div v-for="(image, index) in media" :key="index" class="image-item">
                <v-avatar rounded="md" size="60">
                  <img alt="pro" :src="image.src" width="70" />
                </v-avatar>
              </div>
            </div>
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
  gap: 8px;
}

.image-item {
  display: flex;
  align-items: center;
}
</style>
