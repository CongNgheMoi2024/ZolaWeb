<script setup lang="ts">
import profileBg from '~/images/backgrounds/profilebg.jpg'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const router = useRouter()
import { defineProps } from 'vue'

const { t } = useI18n()
const { data, signOut } = useAuth()
const { $api } = useNuxtApp()
const user = ref({})
const auth = data.value
const fetchProfileById = async (values) => {
  await $api.users.getProfile(values).then((res) => {
    user.value = res.data
  })
}

const props = defineProps<{
  closeProfileDialog: () => void
  openEditProfile: () => void
}>()

const closeProfileDialog = () => {
  props.closeProfileDialog()
}

const openEditProfile = () => {
  props.closeProfileDialog()
  props.openEditProfile()
}

fetchProfileById({})

const customBase64Uploader = async (event) => {
  const file = event.files[0]
  const reader = new FileReader()
  let blob = await fetch(file.objectURL).then((r) => r.blob())

  reader.readAsDataURL(blob)

  reader.onloadend = function () {
    const base64data = reader.result
  }
}
</script>
<template>
  <v-card class="overflow-hidden" elevation="10" style="height: 430px">
    <img alt="profile" class="w-100" :src="profileBg" />
    <v-btn icon size="36px" style="left: 91%; top: -50px">
      <v-file-input
        class="file-input"
        style="right: -9.5px; top: 7px; position: absolute"
        accept="image/png, image/jpeg, image/jpg"
        @change="customBase64Uploader"
        prepend-icon="mdi-camera"
      />
    </v-btn>

    <div>
      <v-row class="mt-1">
        <v-col class="d-flex justify-center order-sml-first">
          <div class="text-center top-spacer">
            <div class="avatar-border">
              <v-avatar class="userImage" size="100">
                <img alt="Mathew" src="/images/profile/user-1.jpg" width="100" />
              </v-avatar>

              <h5 class="text-h5 mt-3">{{ user.name }}</h5>
            </div>

            <v-btn icon size="36px" style="top: -40%; left: 30%">
              <v-file-input
                class="file-input"
                style="right: -9.5px; top: 7px; position: absolute"
                accept="image/png, image/jpeg, image/jpg"
                @change="customBase64Uploader"
                prepend-icon="mdi-camera"
              />
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row class="text-h6 font-weight-medium text-center justify-center">
        <h4>{{ t('profile.informationUser') }}</h4>
      </v-row>
      <v-row>
        <v-col class="text-center" cols="6" sm="4" style="margin-left: 50px">
          <v-row class="mt-1">
            <h5 style="color: gray">{{ t('profile.model.sex') }}</h5>
          </v-row>
          <v-row class="mt-5">
            <h5 style="color: gray">{{ t('profile.model.birthday') }}</h5>
          </v-row>
          <v-row class="mt-5">
            <h5 style="color: gray">
              {{ t('profile.model.phone') }}
            </h5>
          </v-row>
        </v-col>
        <v-col>
          <v-row class="mt-1">
            <h5>{{ user.sex == true ? 'Nam' : 'Nữ' }}</h5>
          </v-row>
          <v-row class="mt-5">
            <h5>{{ user.birthday }}</h5>
          </v-row>
          <v-row class="mt-5">
            <h5>{{ user.phone }}</h5>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <v-card-actions class="mt-3">
      <v-spacer />
      <v-btn color="error" flat text @click="closeProfileDialog">
        {{ t('profile.action.exit') }}
      </v-btn>
      <v-btn color="success" flat text @click="openEditProfile">
        {{ t('profile.action.edit') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style scoped>
<style lang='scss' > .avatar-border {
  background-image: linear-gradient(rgb(80, 178, 252), rgb(244, 76, 102));
  border-radius: 50%;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  .userImage {
    border: 4px solid rgb(255, 255, 255);
  }
  margin-right: 0px;
}

.edit-border {
  background-image: linear-gradient(rgba(83, 83, 83, 0.738), rgba(103, 103, 103, 0.64));
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  .userImage {
    border: 4px solid rgb(255, 255, 255);
  }
}

.top-spacer {
  margin-top: -95px;
}

.profiletab .v-slide-group__content {
  justify-content: end;
  .v-btn--variant-text .v-btn__overlay {
    background: transparent;
  }
}

.file-input:deep().v-input__control,
.file-input:deep().v-input__details {
  display: none;
}
</style>
