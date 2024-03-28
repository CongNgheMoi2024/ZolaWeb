<script setup lang="ts">
import { useToast } from 'vue-toastification'
import Maintenance from '@/pages/auth/Maintenance.vue'

const props = defineProps({
  selectedMenuFriend: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const { $api } = useNuxtApp()
const toast = useToast()
const loading = ref(false)

const friends = ref([])
const search = ref('')

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
  if (value) {
    friends.value = friends.value.filter((friend) => friend.name.toLowerCase().includes(value.toLowerCase()))
  } else {
    fetchFriends()
  }
}

onMounted(() => {
  fetchFriends()
})
</script>

<template>
  <div v-if="selectedMenuFriend.code !== 'invitation'" class="tw-p-3">
    <span>Bạn bè({{ friends.length }})</span>
    <div>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="tw-mt-3"
        hide-details="auto"
        label="Search"
        @update:modelValue="searchName"
      />
    </div>
    <perfect-scrollbar>
      <v-list>
        <v-list-item
          v-for="user in friends"
          :key="user.id"
          class="text-no-wrap chatItem"
          color="primary"
          lines="two"
          :value="user.id"
        >
          <template #prepend>
            <v-avatar>
              <img alt="pro" :src="'https://randomuser.me/api/portraits/women/8.jpg'" width="50" />
            </v-avatar>
          </template>

          <v-list-item-title class="text-subtitle-1 textPrimary w-100 font-weight-semibold">
            {{ user.name }}
          </v-list-item-title>

          <template #append>
            <v-btn variant="text">
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </div>
  <template v-if="selectedMenuFriend.code === 'invitation'">
    <div>
      <maintenance />
    </div>
  </template>
</template>
