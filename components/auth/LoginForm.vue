<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useForm } from 'vee-validate'
import * as Yup from 'yup'
import { useI18n } from 'vue-i18n'
import TextInput from '@/components/forms/form-validation/TextInput.vue'

const router = useRouter()
const checkbox = ref(false)
const { signIn, data } = useAuth()
const toast = useToast()
const { t } = useI18n()
const loading = ref(false)

const { values, handleSubmit } = useForm({
  validationSchema: Yup.object().shape({
    phone: Yup.string()
      .required('Please enter your phone number')
      .matches(/^[0-9]+$/, 'Please enter a valid phone number')
      .min(10, 'Phone number must be exactly 10 characters')
      .max(10, 'Phone number must be exactly 10 characters'),
    password: Yup.string()
      .required('Please enter your password')
      .min(6, 'Password must be at least 6 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~\-={}[\]:;"'<>,.?/]).*$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  }),
  initialValues: {
    phone: '',
    password: '',
  },
})

const login = () => {
  loading.value = true
  signIn('credentials', {
    phone: values.phone,
    password: values.password,
    redirect: false,
    callbackUrl: '/api/v1/auth/login',
  }).then(({ error, ok }) => {
    if (error) {
      toast.error(t('login.message.error'))
      loading.value = false
    } else {
      router.push({ path: '/' })
    }
  })
}
</script>

<template>
  <div class="d-flex align-center text-center mb-6"></div>
  <v-form v-slot="{ errors, isSubmitting }" class="mt-5" @submit="login">
    <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">Phone number</v-label>
    <text-input name="phone" success-message="Got it, we won't spam you!" />
    <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">Password</v-label>
    <text-input name="password" success-message="Nice and secure!" type="password" />
    <div class="d-flex flex-wrap align-center my-3 ml-n2">
      <div class="ml-sm-auto">
        <NuxtLink class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium" to="">
          Forgot Password ?
        </NuxtLink>
      </div>
    </div>
    <v-btn block color="primary" :disabled="!values.password" flat :loading="loading" size="large" type="submit">
      Sign In
    </v-btn>
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </v-form>
</template>
