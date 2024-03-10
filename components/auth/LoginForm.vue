<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'
import TextInput from '@/components/forms/form-validation/TextInput.vue'

const router = useRouter()
const { signIn, data } = useAuth()
const toast = useToast()
const { t } = useI18n()
const loading = ref(false)

const schema = yup.object({
  phone: yup
    .string()
    .required()
    .label(t('chats.model.phone'))
    .matches(/^[0-9]+$/, t('login.validation.phone'))
    .min(8, t('login.validation.minPhone'))
    .max(20, t('login.validation.maxPhone')),
  password: yup
    .string()
    .required()
    .label(t('chats.model.password'))
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, t('login.validation.regexPassword')),
})

const { defineComponentBinds, handleSubmit, setErrors, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    phone: '',
    password: '',
  },
})

const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
})

const form = ref({
  phone: defineComponentBinds('phone', vuetifyConfig),
  password: defineComponentBinds('password', vuetifyConfig),
})

const login = handleSubmit((values) => {
  loading.value = true
  signIn('credentials', {
    phone: values.phone,
    password: values.password,
    redirect: false,
    callbackUrl: '/api/v1/auth/login',
  }).then(({ error, ok }) => {
    if (error) {
      toast.error(t('login.message.loginFailed'))
      loading.value = false
      setErrors(error)
    } else {
      router.push({ path: '/' })
    }
  })
})
</script>

<template>
  <div class="d-flex align-center text-center mb-6" />
  <v-form v-slot="{ errors, isSubmitting }" class="mt-5" @submit="login">
    <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">{{ t('login.model.phone') }}</v-label>
    <text-input v-model="form.phone" name="phone" type="text" />
    <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">{{ t('login.model.password') }}</v-label>
    <text-input v-model="form.password" name="password" type="password" />
    <div class="d-flex flex-wrap align-center my-3 ml-n2">
      <div class="ml-sm-auto">
        <NuxtLink class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium" to="">
          {{ t('login.model.forgotPassword') }}
        </NuxtLink>
      </div>
    </div>
    <v-btn block color="primary" :disabled="!form.password" flat :loading="loading" size="large" type="submit">
      {{ t('login.action.login') }}
    </v-btn>
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </v-form>
</template>
