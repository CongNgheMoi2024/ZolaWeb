<script setup lang="ts">
import AppBaseCard from '@/components/common/atom/AppBaseCard.vue'
import ChatListing from '@/components/chats/ChatListing.vue'
import ChatDetail from '@/components/chats/ChatDetail.vue'
import ChatProfile from '@/components/chats/ChatProfile.vue'
</script>

<template>
  <!-- ---------------------------------------------------- -->
  <!-- Table Basic -->
  <!-- ---------------------------------------------------- -->

  <v-card class="overflow-hidden" elevation="10">
    <app-base-card>
      <template #leftpart>
        <chat-profile />
        <chat-listing />
      </template>
      <template #rightpart>
        <chat-detail />
      </template>
    </app-base-card>
  </v-card>
</template>
