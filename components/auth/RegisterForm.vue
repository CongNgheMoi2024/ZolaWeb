<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import * as yup from 'yup'
import { useToast } from 'vue-toastification'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useForm } from 'vee-validate'
import TextInput from '@/components/forms/form-validation/TextInput.vue'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const loading = ref(false)
const sex = ref('Nam')
const { $api } = useNuxtApp()
const date = ref(new Date())

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

const schema = yup.object({
  name: yup.string().required(t('register.validation.name')).label(t('register.model.name')),
  phone: yup
    .string()
    .required(t('login.validation.requiredPhone'))
    .label(t('chats.model.phone'))
    .matches(/^[0-9]+$/, t('login.validation.phone'))
    .min(10, t('login.validation.minPhone'))
    .max(20, t('login.validation.maxPhone')),
  password: yup
    .string()
    .required(t('forgotPassword.validation.requiredPassword'))
    .label(t('forgotPassword.model.verifyCode'))
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, t('login.validation.regexPassword')),
  retype_password: yup
    .string()
    .required(t('login.validation.requiredPassword'))
    .label(t('chats.model.password'))
    .oneOf([yup.ref('password')], t('forgotPassword.validation.confirmPasswordMatch')),
})

const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
})

const { defineComponentBinds, handleSubmit, setErrors } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    phone: '',
    password: '',
    retype_password: '',
  },
})

const form = ref({
  name: defineComponentBinds('name', vuetifyConfig),
  phone: defineComponentBinds('phone', vuetifyConfig),
  password: defineComponentBinds('password', vuetifyConfig),
  retype_password: defineComponentBinds('retype_password', vuetifyConfig),
})

const register = handleSubmit(async (values) => {
  loading.value = true
  try {
    const sexValue = sex.value === 'Nam' ? 1 : 0
    await $api.auths
      .register({
        name: values.name,
        password: values.password,
        retype_password: values.retype_password,
        phone: values.phone,
        sex: sexValue,
        birthday: formatDate(date.value),
        role_id: '1',
      })
      .then(async (rest: any) => {
        toast.success(t('register.message.sendingOTP'))
        try {
          const formattedPhone = values.phone.startsWith('0') ? `+84${values.phone.slice(1)}` : values.phone
          await $api.auths.sendOTPRegister(formattedPhone)
        } catch (error) {
          toast.error(t('register.message.registerFailed'))
          router.push('/auth/register')
        }
        router.push('/auth/verifyRegister')
      })
      .catch((error) => {
        setErrors(error)
        toast.error(t('register.message.registerFailed'))
      })
  } catch (error) {
    setErrors(error)
    toast.error(t('register.message.registerFailed'))
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <v-form ref="form" class="mt-5" @submit="register">
    <v-label class="text-subtitle-1 font-weight-medium pb-2">
      {{ t('register.model.name') }}
    </v-label>
    <text-input v-model="form.name" name="name" type="text" />
    <v-label class="text-subtitle-1 font-weight-medium pb-2">
      {{ t('register.model.phone') }}
    </v-label>
    <text-input v-model="form.phone" name="phone" type="text" />
    <v-label class="text-subtitle-1 font-weight-medium pb-2">
      {{ t('register.model.password') }}
    </v-label>
    <text-input
      v-model="form.password"
      name="password"
      color="primary"
      :counter="10"
      required
      type="password"
      variant="outlined"
    />
    <v-label class="text-subtitle-1 font-weight-medium pb-2">
      {{ t('register.model.retypePassword') }}
    </v-label>
    <text-input
      v-model="form.retype_password"
      name="retype_password"
      color="primary"
      :counter="10"
      required
      type="password"
      variant="outlined"
    />
    <!-- gioi tinh -->
    <v-label class="text-subtitle-1 font-weight-medium pb-2">
      {{ t('register.model.sex') }}
    </v-label>
    <v-radio-group v-model="sex" inline name="sex">
      <v-radio label="Nam" value="Nam" color="primary" />
      <v-radio label="Nữ" value="Nữ" color="primary" />
    </v-radio-group>
    <v-label class="text-subtitle-1 font-weight-medium pb-2">
      {{ t('register.model.birthday') }}
    </v-label>
    <vue-date-picker v-model="date" :enable-time-picker="false" :format="formatDate" :max-date="new Date()" />
    <div class="d-flex align-center text-center mb-6" />
    <v-btn block color="primary" flat :loading="loading" size="large" type="submit">
      {{ t('register.action.confirm') }}
    </v-btn>
  </v-form>
</template>
