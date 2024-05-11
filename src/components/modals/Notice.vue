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
const User = useUser();

const { values, errors, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: yup.object({
    title: yup.string().required(t('Value is required')),
    text: yup.string().required(t('Value is required')),
    users: yup.array().required(t('Value is required'))
  }),
  initialValues: {}
});

const emits = defineEmits(['close']);

defineExpose({
  toggle: async () => {
    try {
      records.value = await User.find({});
      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const records = ref([]);

const [title, titleAttrs] = defineField('title');
const [text, textAttrs] = defineField('text');
const [users, usersAttrs] = defineField('users');

const onSendNotice = handleSubmit(async () => {
  try {
    await createOne({
      title: values.title,
      text: values.text,
      users: values.users.map(({ id }) => id)
    });
    toast.add({
      severity: 'success',
      summary: t('Information'),
      detail: t('All messages have been sent'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
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
  <Dialog
    closable
    draggable
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[60vw] lg:w-[50vw] xl:w-[35vw] 2xl:w-[25vw]"
    @hide="onCloseModal"
  >
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

    <form class="flex flex-col gap-y-4" @submit.prevent="onSendNotice">
      <div class="flex flex-col gap-2">
        <label for="users" class="font-bold">{{ $t('Notification users') }}</label>
        <MultiSelect
          id="users"
          filter
          v-model="users"
          v-bind="usersAttrs"
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

      <div class="flex flex-col gap-2">
        <label for="title" class="font-bold">{{ $t('Notification title') }}</label>
        <InputText
          id="title"
          v-model="title"
          v-bind="titleAttrs"
          :placeholder="$t('Notification title')"
          :invalid="!!errors?.title"
          aria-describedby="title-help"
        />
        <small id="title-help" class="text-red-500" v-if="errors?.title">
          {{ $t(errors.title) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="text" class="font-bold">{{ $t('Notification text') }}</label>
        <Textarea
          rows="10"
          id="text"
          v-model="text"
          v-bind="textAttrs"
          :placeholder="$t('Notification text')"
          :invalid="!!errors?.text"
          aria-describedby="text-help"
        />
        <small id="text-help" class="text-red-500" v-if="errors?.text">
          {{ $t(errors.text) }}
        </small>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = !visible" />
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
