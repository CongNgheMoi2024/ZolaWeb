<script setup lang="ts"></script>
<template>
  <v-row class="d-flex mb-6">
    <v-col class="pr-2" cols="6" sm="6">
      <v-btn block class="border text-subtitle-1" size="large" variant="outlined">
        <img alt="google" class="mr-2" height="20" src="/images/svgs/google-icon.svg" />
        <span class="d-sm-flex d-none mr-1">Sign up with</span>
        Google
      </v-btn>
    </v-col>
    <v-col class="pl-2" cols="6" sm="6">
      <v-btn block class="border text-subtitle-1" size="large" variant="outlined">
        <img alt="facebook" class="mr-1" height="30" src="/images/svgs/facebook-icon.svg" width="25" />
        <span class="d-sm-flex d-none mr-1">Sign up with</span>
        FB
      </v-btn>
    </v-col>
  </v-row>
  <div class="d-flex align-center text-center mb-6">
    <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
      <span class="bg-surface px-5 py-3 position-relative">or sign in with</span>
    </div>
  </div>
  <v-form ref="form" class="mt-5">
    <v-label class="text-subtitle-1 font-weight-medium pb-2">Name</v-label>
    <VTextField required />
    <v-label class="text-subtitle-1 font-weight-medium pb-2">Email Adddress</v-label>
    <VTextField required />
    <v-label class="text-subtitle-1 font-weight-medium pb-2">Password</v-label>
    <VTextField color="primary" :counter="10" required type="password" variant="outlined" />
    <v-btn block class="mt-2" color="primary" flat size="large" submit>Sign Up</v-btn>
  </v-form>
</template>
