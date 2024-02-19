<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import * as yup from 'yup'
import AppModal from '@/components/common/AppModal.vue'

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

const schema = yup.object({
  phone: yup.string().nullable().required().label(t('transfers.model.phone')),
})

const { defineComponentBinds, handleSubmit, setErrors, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    phone: null,
  },
})

const vuetifyConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
})

const form = ref({
  phone: defineComponentBinds('employee_id', vuetifyConfig),
})
const { open, close } = useModal({
  component: AppModal,
  attrs: {
    title: t('chats.addFriend'),
    submitText: t('common.save'),
    cancelText: t('common.cancel'),
    hideSubmit: isSubmitting.value,
    loading: isSubmitting.value,
    width: '700px',
    onConfirm() {
      close()
    },
  },
})
</script>

<template>
  <v-btn class="tw-ml-1" size="40" variant="text" @click="open">
    <v-icon>mdi-account-plus-outline</v-icon>
  </v-btn>
  <modals-container />
</template>
