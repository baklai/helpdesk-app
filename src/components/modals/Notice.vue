<script setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { useNotice } from '@/stores/api/notices';
import { useUser } from '@/stores/api/users';

const { t } = useI18n();
const toast = useToast();

const { $init, createOne } = useNotice();
const { find } = useUser();

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({}) => {
    try {
      record.value = $init({});
      users.value = await find();
      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const record = ref({});
const users = ref([]);

const $validate = useVuelidate(
  {
    name: { required },
    text: { required },
    users: { required }
  },
  record
);

const onSendNotice = async () => {
  const valid = await $validate.value.$validate();
  if (valid) {
    try {
      await Promise.allSettled[
        record.value.users.map(({ id }) =>
          createOne({
            name: record.value.name,
            text: record.value.text,
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
  } else {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Fill in all required fields'),
      life: 3000
    });
  }
};

const onCloseModal = () => {
  record.value = $init({});
  $validate.value.$reset();
  emits('close', {});
};
</script>

<template>
  <Dialog
    closable
    draggable
    v-model:visible="visible"
    :style="{ width: '400px' }"
    class="p-fluid"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-content-between w-full">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-bell text-2xl mr-2"></i>
          <p class="text-lg font-bold line-height-2 mb-0">{{ $t('HD Notification') }}</p>
        </div>
      </div>
    </template>

    <form @submit.prevent="onSendNotice">
      <div class="field">
        <label for="notification-name">{{ $t('Notification name') }}</label>
        <InputText
          id="notification-name"
          v-model="record.name"
          :placeholder="$t('Notification name')"
          :class="{ 'p-invalid': !!$validate.name.$errors.length }"
        />
        <small class="p-error" v-for="error in $validate.name.$errors" :key="error.$uid">
          {{ $t(error.$message) }}
        </small>
      </div>

      <div class="field">
        <label for="notification-text">{{ $t('Notification text') }}</label>
        <Textarea
          rows="5"
          id="notification-text"
          v-model="record.text"
          :placeholder="$t('Notification text')"
          :class="{ 'p-invalid': !!$validate.text.$errors.length }"
        />
        <small class="p-error" v-for="error in $validate.text.$errors" :key="error.$uid">
          {{ $t(error.$message) }}
        </small>
      </div>

      <div class="field">
        <label for="notification-users">{{ $t('Notification users') }}</label>
        <MultiSelect
          id="notification-users"
          v-model="record.users"
          :options="users"
          optionLabel="fullname"
          :maxSelectedLabels="3"
          :placeholder="$t('Notification users')"
          :class="{ 'p-invalid': !!$validate.users.$errors.length }"
          class="w-full"
        >
          <template #option="slotProps">
            <div class="flex align-items-center">
              <Avatar icon="pi pi-user" shape="circle" class="mr-2" />
              <p class="font-semibold">{{ slotProps.option.fullname }}</p>
            </div>
          </template>
        </MultiSelect>
        <small class="p-error" v-for="error in $validate.users.$errors" :key="error.$uid">
          {{ $t(error.$message) }}
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

<style scoped>
::v-deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  color: var(--surface-400);
}
</style>
