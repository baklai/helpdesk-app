<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { useTask } from '@/stores/api/tasks';

const { t } = useI18n();
const toast = useToast();

const Task = useTask();

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
      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const name = defineComponentBinds('name');
const text = defineComponentBinds('text');
const users = defineComponentBinds('users');

const onUpdateTask = handleSubmit(async () => {
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
  <Dialog
    closable
    draggable
    v-model:visible="visible"
    :style="{ width: '400px' }"
    class=""
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <i class="pi pi-bell text-2xl mr-2"></i>
          <p class="text-lg font-bold line-height-2 mb-2">
            {{ $t('Task') }} - {{ $t('Clear logs') }}
          </p>
        </div>
      </div>
    </template>

    <!--orange-500
    
    
         <form @submit.prevent="onSaveRecord" class=" mx-6 py-6">
            <div class=" py-2">
              <div class="flex items-center">
                <InputSwitch
                  v-model="enabled"
                  :invalid="errorMessage }"
                  aria-describedby="text-error"
                />
                <label for="status">{{ $t('Сompany name') }}</label>
              </div>
            </div>

            <div class="">
              <label for="description">{{ $t('Month offset') }}</label>
              <InputNumber
                :min="1"
                :max="12"
                :step="1"
                showButtons
                id="offsetMonth"
                v-model="offsetMonth"
                class="min-w-full"
                aria-describedby="offsetMonth-help"
                :invalid="!!errors?.offsetMonth }"
              />
              <small id="offsetMonth-help" class="text-red-500" v-if="errors?.offsetMonth">
                {{ $t(errors.offsetMonth) }}
              </small>
            </div>
          </form>
    -->

    <form @submit.prevent="onSendNotice">
      <div class="">
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

      <div class="">
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

      <div class="">
        <label for="users">{{ $t('Notification users') }}</label>
        <MultiSelect
          id="users"
          v-bind="users"
          :options="records"
          optionLabel="fullname"
          :maxSelectedLabels="3"
          :placeholder="$t('Notification users')"
          :invalid="!!errors?.users"
          class="w-full"
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
        @click="onUpdateTask"
      />
    </template>
  </Dialog>
</template>
