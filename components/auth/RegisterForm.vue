
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<template>
  <v-row class="d-flex mb-6" />
  <h4 class="text-h4 font-weight-medium pb-2" style="text-align: center">
    {{ t('register.model.register') }}
  </h4>
  <v-form ref="form" class="mt-5">
    <v-label class="text-subtitle-1 font-weight-medium pb-2">
      {{ t('register.model.name') }}
    </v-label>
    <VTextField required />
    <v-label class="text-subtitle-1 font-weight-medium pb-2">
      {{ t('register.model.phone') }}
    </v-label>
    <VTextField required />
    <v-label class="text-subtitle-1 font-weight-medium pb-2">
      {{ t('register.model.password') }}
    </v-label>
    <VTextField color="primary" :counter="10" required type="password" variant="outlined" />
    <v-label class="text-subtitle-1 font-weight-medium pb-2">
      {{ t('register.model.password') }}
    </v-label>
    <VTextField color="primary" :counter="10" required type="password" variant="outlined" />
    <v-btn block class="mt-2" color="primary" flat size="large" submit>Sign Up</v-btn>
  </v-form>
</template>
