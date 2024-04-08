<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { uniq, flatten } from 'lodash'
import { useChatStore } from '@/stores/apps/chat'

const props = defineProps({ chatDetail: Object })

// const totalAttachment = computed(() => {
//   return uniq(flatten(props.chatDetail?.chatHistory.map((item: any) => item.attachment))).length
// })

// const totalMedia = computed(() => {
//   return (
//     uniq(flatten(props.chatDetail?.chatHistory.map((item: any) => (item?.type === 'img' ? item.msg : null)))).length - 1
//   )
// })
</script>
<template>
  <div v-if="chatDetail" class="pa-6">
    <h6 class="text-h6 mb-3">
      Media
      <!-- ({{ totalMedia }}) -->
    </h6>
    <div v-for="chat in chatDetail.chatHistory" :key="chat.id">
      <div v-if="chat.type == 'img'">
        <img alt="img" :src="chat.msg" width="100" />
      </div>
    </div>

    <h6 class="text-h6 mb-3 mt-7">
      Attachments
      <!-- ({{ totalAttachment }}) -->
    </h6>
    <!-- <v-sheet v-if="totalAttachment != 0">
      <div v-for="chat in chatDetail.chatHistory" :key="chat.id">
        <div v-for="atch in chat.attachment" :key="atch.file" class="d-flex align-center mt-7">
          <v-avatar class="rounded-md bg-grey100" size="48">
            <img alt="file" :src="atch.icon" width="24" />
          </v-avatar>
          <div class="pl-4">
            <h6 class="text-subtitle-1 font-weight-semibold">{{ atch.file }}</h6>
            <h5 class="text-subtitle-2 mt-1">{{ atch.fileSize }}</h5>
          </div>
        </div>
      </div>
    </v-sheet> -->
    <!-- <v-sheet v-else> -->
    <v-sheet>
      <v-alert class="text-subtitle-1" color="error" density="compact" type="warning" variant="tonal">
        No Attachments Found!
      </v-alert>
    </v-sheet>
  </div>
</template>
