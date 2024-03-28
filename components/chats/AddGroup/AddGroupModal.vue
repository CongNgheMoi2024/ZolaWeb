<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import * as yup from 'yup'
import AppModal from '@/components/common/AppModal.vue'
import AddGroupForm from '@/components/chats/AddGroup/AddGroupForm.vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      phone: null,
    }),
  },
  title: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['closed', 'submit', 'update:modelValue'])
const { $api } = useNuxtApp()
const isSubmitting = ref(false)
const { t } = useI18n()
const toast = useToast()
const user = ref(null)

const schema = yup.object({
  name: yup.string().nullable().required().label(t('chats.model.nameGroup')),
  phone: yup.string().nullable().label(t('chats.model.phone')),
})

const { defineComponentBinds, handleSubmit, setErrors, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    name: null,
    phone: null,
  },
})

const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
})

const form = ref({
  name: defineComponentBinds('name', vuetifyConfig),
  phone: defineComponentBinds('phone', vuetifyConfig),
})

const submit = handleSubmit(async (values) => {
  isSubmitting.value = true
  try {
    console.log(111)
  } catch (error) {
    setErrors(error.error)
  } finally {
    isSubmitting.value = false
  }
})

const closed = () => {
  emit('closed')
}
</script>

<template>
  <app-modal
    :loading="isSubmitting"
    :title="title"
    width="800px"
    @cancel="emit('closed')"
    @submit="submit"
  >
    <add-group-form :set-field-value="setFieldValue" :value="form" @closed="closed" />
  </app-modal>
</template>

<style scoped></style>
