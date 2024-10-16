<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useEvent } from '@/stores/api/events';
import { capitalizeFirstLetter } from '@/service/DataFilters';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findOne, createOne, updateOne, removeOne } = useEvent();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      title: yup.string().required(t('Value is required')),
      datetime: yup.string().required(t('Value is required')),
      eventType: yup.string().required(t('Value is required'))
    }),
    initialValues: {}
  });

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        const event = await findOne({ id });
        setValues({ ...event, datetime: new Date(event.datetime) });
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

const [title, titleAttrs] = defineField('title');
const [datetime, datetimeAttrs] = defineField('datetime');
const [eventType, eventTypeAttrs] = defineField('eventType');
const [description, descriptionAttrs] = defineField('description');

const onCreateRecord = async () => {
  resetForm({ values: {} }, { force: true });
  toast.add({
    severity: 'success',
    summary: t('Information'),
    detail: t('Input new record'),
    life: 5000
  });
};

const onRemoveRecord = async () => {
  if (!values?.id) {
    return toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t('Record not selected'),
      life: 5000
    });
  }
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('Confirm delete record'),
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne(values);
        toast.add({
          severity: 'success',
          summary: t('Information'),
          detail: t('Record is removed'),
          life: 5000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: t('Warning'),
          detail: t('Record not removed'),
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('Information'),
        detail: t('Record deletion not confirmed'),
        life: 5000
      });
    }
  });
};

const onSaveRecord = handleSubmit(async values => {
  try {
    if (values?.id) {
      await updateOne(values.id, controlledValues.value);
    } else {
      await createOne(controlledValues.value);
    }
    toast.add({
      severity: 'success',
      summary: t('Information'),
      detail: values?.id ? t('Record is updated') : t('Record is created'),
      life: 5000
    });
    visible.value = false;
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: values?.id ? t('Record not updated') : t('Record not created'),
      life: 5000
    });
  }
});

const onCloseModal = async () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};
</script>

<template>
  <Menu ref="refMenu" popup :model="options">
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>

  <Dialog
    modal
    closable
    :draggable="false"
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="events-calendar" :size="40" class="mr-4" />
          <div>
            <p class="line-height-2 text-lg font-bold">
              {{ $t('Calendar event') }}
            </p>
            <p class="line-height-2 mb-0 text-base font-normal text-surface-500">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <Button
            text
            plain
            rounded
            class="h-12 w-12"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form class="flex flex-col gap-y-4" @submit.prevent="onSaveRecord">
      <div class="flex flex-col gap-2">
        <label for="title" class="font-bold">{{ $t('Title event') }}</label>
        <InputText
          id="title"
          v-model="title"
          v-bind="titleAttrs"
          :placeholder="$t('Title event')"
          :invalid="!!errors?.title"
          aria-describedby="title-help"
        />
        <small id="title-help" class="text-red-500" v-if="errors?.title">
          {{ $t(errors.title) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="datetime" class="font-bold">{{ $t('Datetime of event') }}</label>
        <Calendar
          showIcon
          showTime
          showButtonBar
          hourFormat="24"
          dateFormat="dd.mm.yy"
          inputId="datetime"
          v-model="datetime"
          v-bind="datetimeAttrs"
          :placeholder="$t('Datetime of event')"
          :invalid="!!errors?.datetime"
          aria-describedby="datetime-help"
          :pt="{
            dropdownbutton: {
              root: {
                class: [
                  'relative',
                  'items-center inline-flex text-center align-bottom',
                  'rounded-r-md',
                  'px-4 py-3 leading-none',
                  'text-surface-500 dark:text-surface-300',
                  'border border-l-0 border-surface-300 dark:border-surface-600',
                  'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
                ]
              }
            }
          }"
        />
        <small id="datetime-help" class="text-red-500" v-if="errors?.datetime">
          {{ $t(errors.datetime) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="eventType" class="font-bold">{{ $t('Event type') }}</label>
        <Dropdown
          filter
          autofocus
          showClear
          resetFilterOnHide
          inputId="eventType"
          v-model="eventType"
          v-bind="eventTypeAttrs"
          :options="['event', 'meeting', 'deadline', 'holiday', 'birthday']"
          :optionLabel="item => capitalizeFirstLetter($t(item))"
          :filterPlaceholder="$t('Search')"
          :placeholder="$t('Event type')"
          :invalid="!!errors?.eventType"
          aria-describedby="eventType-help"
        />
        <small id="eventType-help" class="text-red-500" v-if="errors?.eventType">
          {{ $t(errors.eventType) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="description" class="font-bold">{{ $t('Description') }}</label>
        <Textarea
          rows="5"
          cols="12"
          id="description"
          v-model="description"
          v-bind="descriptionAttrs"
          :placeholder="$t('Description')"
        />
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
