<script setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useEvent } from '@/stores/api/events';
import { dateTimeToStr, capitalizeFirstLetter } from '@/service/DataFilters';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const { $init, findOne, createOne, updateOne, removeOne } = useEvent();

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        record.value = $init(await findOne({ id }));
        record.value.datetime = dateTimeToStr(record.value.datetime);
      } else {
        record.value = $init({});
      }
      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const refMenu = ref();
const options = ref([
  {
    label: t('Create record'),
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
  {
    label: t('Save record'),
    icon: 'pi pi-save',
    command: async () => await onSaveRecord()
  },
  {
    label: t('Delete record'),
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const record = ref({});

const $validate = useVuelidate(
  {
    title: { required },
    datetime: { required },
    eventType: { required }
  },
  record
);

const onCreateRecord = async () => {
  record.value = $init({});
  $validate.value.$reset();
  toast.add({
    severity: 'success',
    summary: t('HD Information'),
    detail: t('Input new record'),
    life: 3000
  });
};

const onRemoveRecord = async () => {
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('HD Confirm delete record'),
    icon: 'pi pi-info-circle text-yellow-500',
    acceptIcon: 'pi pi-check',
    acceptClass: 'p-button-danger',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      if (record.value?.id) {
        try {
          await removeOne(record.value);
          toast.add({
            severity: 'success',
            summary: t('HD Information'),
            detail: t('Record is removed'),
            life: 3000
          });
        } catch (err) {
          toast.add({
            severity: 'warn',
            summary: t('HD Warning'),
            detail: t('Record not removed'),
            life: 3000
          });
        } finally {
          visible.value = false;
        }
      } else {
        toast.add({
          severity: 'warn',
          summary: t('HD Warning'),
          detail: t('Record not selected'),
          life: 3000
        });
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('HD Information'),
        detail: t('Record deletion not confirmed'),
        life: 3000
      });
    }
  });
};

const onSaveRecord = async () => {
  const valid = await $validate.value.$validate();
  if (valid) {
    if (record.value?.id) {
      try {
        await updateOne(record.value);
        visible.value = false;
        toast.add({
          severity: 'success',
          summary: t('HD Information'),
          detail: t('Record is updated'),
          life: 3000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: t('HD Warning'),
          detail: t('Record not updated'),
          life: 3000
        });
      }
    } else {
      try {
        await createOne(record.value);
        visible.value = false;
        toast.add({
          severity: 'success',
          summary: t('HD Information'),
          detail: t('Record is created'),
          life: 3000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: t('HD Warning'),
          detail: t('Record not created'),
          life: 3000
        });
      }
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
  <Menu ref="refMenu" popup :model="options" />

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
          <AppIcons name="calendar-events" :size="40" class="mr-2" />
          <div>
            <p class="text-lg font-bold line-height-2 mb-0">{{ $t('Calendar event') }}</p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ record?.id ? $t('Edit current record') : $t('Create new record') }}
            </p>
          </div>
        </div>
        <div class="flex gap-2 align-items-center">
          <Button
            text
            plain
            rounded
            class="mx-2"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form @submit.prevent="onSaveRecord">
      <div class="field">
        <label class="font-bold">{{ $t('Title event') }}</label>
        <InputText
          v-model="record.title"
          :placeholder="$t('Title event')"
          :class="{ 'p-invalid': !!$validate.title.$errors.length }"
        />
        <small class="p-error" v-for="error in $validate.title.$errors" :key="error.$uid">
          {{ $t(error.$message) }}
        </small>
      </div>

      <div class="field">
        <label class="font-bold">{{ $t('Datetime of event') }}</label>
        <Calendar
          showIcon
          showTime
          showButtonBar
          dateFormat="dd.mm.yy"
          hourFormat="24"
          v-model="record.datetime"
          :placeholder="$t('Datetime of event')"
          :class="{ 'p-invalid': !!$validate.datetime.$errors.length }"
          update:modelValue=""
        />
        <small class="p-error" v-for="error in $validate.datetime.$errors" :key="error.$uid">
          {{ $t(error.$message) }}
        </small>
      </div>

      <div class="field">
        <Dropdown
          filter
          autofocus
          showClear
          resetFilterOnHide
          v-model="record.eventType"
          :options="['event', 'meeting', 'deadline', 'holiday', 'birthday']"
          :optionLabel="item => capitalizeFirstLetter($t(item))"
          aria-describedby="eventType-help"
          :filterPlaceholder="$t('Search')"
          :placeholder="$t('Event type')"
          :class="{ 'p-invalid': !!$validate.eventType.$errors.length }"
        />
        <small class="p-error" v-for="error in $validate.eventType.$errors" :key="error.$uid">
          {{ $t(error.$message) }}
        </small>
      </div>

      <div class="field">
        <label class="font-bold">{{ $t('Description') }}</label>
        <Textarea
          rows="5"
          cols="12"
          aria-describedby="description-help"
          v-model="record.description"
          :placeholder="$t('Description')"
        />
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = false" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>

<style scoped>
::v-deep(.p-calendar-w-btn .p-datepicker-trigger.p-button) {
  color: var(--text-color-secondary);
}

::v-deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  color: var(--surface-400);
}
</style>
