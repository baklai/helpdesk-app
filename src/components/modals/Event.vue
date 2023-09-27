<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useEvent } from '@/stores/api/events';
import { dateTimeToStr, capitalizeFirstLetter } from '@/service/DataFilters';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findOne, createOne, updateOne, removeOne } = useEvent();

const {
  values,
  errors,
  handleSubmit,
  controlledValues,
  setValues,
  resetForm,
  defineComponentBinds
} = useForm({
  validationSchema: yup.object({
    title: yup.string().required(),
    datetime: yup.string().required(),
    eventType: yup.string().required()
  }),
  initialValues: {}
});

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        setValues(await findOne({ id }));
      }
      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const title = defineComponentBinds('title');
const datetime = defineComponentBinds('datetime');
const eventType = defineComponentBinds('eventType');

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

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};

const onCreateRecord = async () => {
  resetForm({ values: {} }, { force: true });
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
      if (values?.id) {
        try {
          await removeOne(values);
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

const onSaveRecord = handleSubmit(async () => {
  if (values?.id) {
    try {
      await updateOne(values.id, controlledValues.value);
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
      await createOne(controlledValues.value);
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
});
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
            <p class="text-lg font-bold line-height-2 mb-2">{{ $t('Calendar event') }}</p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
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
          v-bind="title"
          :placeholder="$t('Title event')"
          :class="{ 'p-invalid': !!errors?.title }"
        />
        <small class="p-error" v-if="errors?.title">
          {{ $t(errors.title) }}
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
          v-bind="datetime"
          :placeholder="$t('Datetime of event')"
          :class="{ 'p-invalid': !!errors?.datetime }"
        />
        <small class="p-error" v-if="errors?.datetime">
          {{ $t(errors.datetime) }}
        </small>
      </div>

      <div class="field">
        <Dropdown
          filter
          autofocus
          showClear
          resetFilterOnHide
          v-bind="eventType"
          :options="['event', 'meeting', 'deadline', 'holiday', 'birthday']"
          :optionLabel="item => capitalizeFirstLetter($t(item))"
          :filterPlaceholder="$t('Search')"
          :placeholder="$t('Event type')"
          :class="{ 'p-invalid': !!errors?.eventType }"
        />
        <small class="p-error" v-if="errors?.eventType">
          {{ $t(errors.eventType) }}
        </small>
      </div>

      <div class="field">
        <label class="font-bold">{{ $t('Description') }}</label>
        <Textarea rows="5" cols="12" v-bind="description" :placeholder="$t('Description')" />
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
