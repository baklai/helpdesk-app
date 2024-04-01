<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { useNotice } from '@/stores/api/notices';
import { useUser } from '@/stores/api/users';

const { t } = useI18n();
const toast = useToast();

const { createOne } = useNotice();
const { find } = useUser();

const { values, errors, handleSubmit, resetForm, defineComponentBinds } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(t('Value is required')),
    text: yup.string().required(t('Value is required')),
    users: yup.array().required(t('Value is required'))
  }),
  initialValues: {}
});

const emits = defineEmits(['close']);

defineExpose({
  toggle: async () => {
    try {
      records.value = await find();
      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const records = ref([]);

const name = defineComponentBinds('name');
const text = defineComponentBinds('text');
const users = defineComponentBinds('users');

const onSendNotice = handleSubmit(async () => {
  try {
    await Promise.allSettled[
      values.users.map(({ id }) =>
        createOne({
          name: values.name,
          text: values.text,
          userId: id
        })
      )
    ];
    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t('All messages have been sent'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(err?.message),
      life: 3000
    });
  } finally {
    visible.value = false;
  }
});

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};
</script>

<template>
  <Dialog closable draggable v-model:visible="visible" class="w-[40rem]" @hide="onCloseModal">
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <i class="pi pi-bell text-4xl mr-4"></i>
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('HD Notification') }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500">
              {{ $t('Helpdesk system notifications') }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <form
      @submit.prevent="onSendNotice"
      class="flex flex-col justify-center gap-3 text-surface-800 dark:text-surface-100"
    >
      <div class="flex flex-col gap-2">
        <label for="name">{{ $t('Notification name') }}</label>
        <InputText
          id="name"
          v-bind="name"
          :placeholder="$t('Notification name')"
          :invalid="!!errors?.name"
          aria-describedby="name-help"
        />
        <small id="name-help" class="text-red-500" v-if="errors?.name">
          {{ $t(errors.name) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="text">{{ $t('Notification text') }}</label>
        <Textarea
          rows="5"
          id="text"
          v-bind="text"
          :placeholder="$t('Notification text')"
          :invalid="!!errors?.text"
          aria-describedby="text-help"
        />
        <small id="text-help" class="text-red-500" v-if="errors?.text">
          {{ $t(errors.text) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="users">{{ $t('Notification users') }}</label>
        <MultiSelect
          id="users"
          v-bind="users"
          :options="records"
          optionLabel="fullname"
          :maxSelectedLabels="3"
          :placeholder="$t('Notification users')"
          :invalid="!!errors?.users"
          aria-describedby="users-help"
        >
          <template #option="slotProps">
            <div class="flex items-center">
              <Avatar icon="pi pi-user" shape="circle" class="mr-2" />
              <p class="font-semibold">{{ slotProps.option.fullname }}</p>
            </div>
          </template>
        </MultiSelect>
        <small id="users-help" class="text-red-500" v-if="errors?.users">
          {{ $t(errors.users) }}
        </small>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = false" />
      <Button
        text
        plain
        icon="pi pi-send"
        :label="$t('Send')"
        v-tooltip.bottom="$t('Send notice')"
        @click="onSendNotice"
      />
    </template>
  </Dialog>
</template>
