<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import TextInput from '@/components/forms/form-validation/TextInput.vue'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const loading = ref(false)
const { $api } = useNuxtApp()

const schema = yup.object({
  otp: yup
    .string()
    .required(t('forgotPassword.model.requiredOTP'))
    .label(t('forgotPassword.model.verifyCode'))
    .matches(/^\d{6}$/, t('forgotPassword.validation.otpLength')),
  password: yup
    .string()
    .required(t('forgotPassword.model.requiredOTP'))
    .label(t('forgotPassword.model.verifyCode'))
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, t('login.validation.regexPassword')),
  confirmPassword: yup
    .string()
    .required(t('login.validation.requiredPassword'))
    .label(t('chats.model.password'))
    .oneOf([yup.ref('password')], t('forgotPassword.validation.confirmPasswordMatch')),
})

const { defineComponentBinds, handleSubmit, setErrors } = useForm({
  validationSchema: schema,
  initialValues: {
    otp: '',
    password: '',
    confirmPassword: '',
  },
})

const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
})

const form = ref({
  otp: defineComponentBinds('otp', vuetifyConfig),
  password: defineComponentBinds('password', vuetifyConfig),
  confirm_password: defineComponentBinds('confirmPassword', vuetifyConfig),
})

const changePassword = handleSubmit(async (values) => {
  loading.value = true
  try {
    await $api.users.verifyOTPForgetPassword(values).then(
      (response) => {
        toast.success(t('forgotPassword.message.forgotPasswordSuccess'))
        router.push('/auth/login')
      },
      (error) => {
        setErrors(error.error)
      }
    )
  } catch (error) {
    toast.error(t('forgotPassword.message.forgotPasswordFailed'))
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="d-flex align-center text-center mb-6" />
  <v-form class="mt-5" @submit="changePassword">
    <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">
      {{ t('forgotPassword.model.verifyCode') }}
    </v-label>
    <text-input v-model="form.otp" name="otp" type="text" />
    <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">
      {{ t('forgotPassword.model.newPassword') }}
    </v-label>
    <text-input v-model="form.password" name="password" type="password" />
    <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">
      {{ t('forgotPassword.model.confirmPassword') }}
    </v-label>
    <text-input v-model="form.confirmPassword" name="confirmPassword" type="password" />

    <div class="d-flex align-center text-center mb-6" />
    <v-btn block color="primary" flat :loading="loading" size="large" type="submit">
      {{ t('forgotPassword.action.confirm') }}
    </v-btn>
  </v-form>
</template>
