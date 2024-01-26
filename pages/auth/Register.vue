<script setup lang="ts">
import RegisterForm from '~/components/auth/RegisterForm.vue'

definePageMeta({
  layout: 'blank',
  auth: false,
})
</script>
<template>
  <div class="pa-3">
    <v-row class="h-100vh mh-100 auth">
      <v-col class="d-lg-flex align-center justify-center authentication position-relative" cols="12" lg="7" xl="8">
        <div class="">
          <img
            alt="login-background"
            class="position-relative d-none d-lg-flex"
            height="450"
            src="/images/backgrounds/login-bg.svg"
          />
        </div>
      </v-col>
      <v-col class="d-flex align-center justify-center bg-surface" cols="12" lg="5" xl="4">
        <div class="mt-xl-0 mt-5 mw-100">
          <h2 class="text-h3 font-weight-bold mb-2">Welcome to AdminPro</h2>
          <div class="text-subtitle-1 mb-6">Your Admin Dashboard</div>
          <register-form />
          <h6 class="text-h6 d-flex justify-center align-center mt-3">
            Already have an Account?
            <v-btn class="text-primary text-body-1 opacity-1 pl-2 font-weight-medium" to="/auth/login" variant="plain">
              Sign In
            </v-btn>
          </h6>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
