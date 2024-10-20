<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useEvent } from '@/stores/api/events';
import { capitalizeFirstLetter } from '@/service/DataFilters';

const toast = useToast();
const confirm = useConfirm();

const { findOne, createOne, updateOne, removeOne } = useEvent();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      title: yup.string().required('Потрібно вказати значення'),
      datetime: yup.string().required('Потрібно вказати значення'),
      eventType: yup.string().required('Потрібно вказати значення')
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
    label: 'Створити запис',
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
  {
    label: 'Зберегти запис',
    icon: 'pi pi-save',
    command: async () => await onSaveRecord()
  },
  {
    label: 'Видалити запис',
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
    summary: 'Інформація',
    detail: 'Введіть новий запис',
    life: 5000
  });
};

const onRemoveRecord = async () => {
  if (!values?.id) {
    return toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Запис не вибрано',
      life: 5000
    });
  }
  confirm.require({
    message: 'Ви бажаєте видалити цей запис?',
    header: 'Підтвердити видалення запису',
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne(values);
        toast.add({
          severity: 'success',
          summary: 'Інформація',
          detail: 'Запис видалено',
          life: 5000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Запис не видалено',
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення запису не підтверджено',
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
      summary: 'Інформація',
      detail: values?.id ? 'Запис оновлено' : 'Запис створено',
      life: 5000
    });
    visible.value = false;
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: values?.id ? 'Запис не оновлено' : 'Запис не створено',
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
            <p class="line-height-2 text-lg font-bold">Подія календаря</p>
            <p class="line-height-2 mb-0 text-base font-normal text-surface-500">
              {{ values?.id ? 'Редагувати обраний запис' : 'Створити новий запис' }}
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
            v-tooltip.bottom="'Меню опцій'"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form class="flex flex-col gap-y-4" @submit.prevent="onSaveRecord">
      <div class="flex flex-col gap-2">
        <label for="title" class="font-bold">Назва події</label>
        <InputText
          id="title"
          v-model="title"
          v-bind="titleAttrs"
          placeholder="Назва події"
          :invalid="!!errors?.title"
          aria-describedby="title-help"
        />
        <small id="title-help" class="text-red-500" v-if="errors?.title">
          {{ errors.title }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="datetime" class="font-bold">Дата та час події</label>
        <Calendar
          showIcon
          showTime
          showButtonBar
          hourFormat="24"
          dateFormat="dd.mm.yy"
          inputId="datetime"
          v-model="datetime"
          v-bind="datetimeAttrs"
          placeholder="Дата та час події"
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
          {{ errors.datetime }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="eventType" class="font-bold">Тип події</label>
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
          filterPlaceholder="Пошук"
          placeholder="Тип події"
          :invalid="!!errors?.eventType"
          aria-describedby="eventType-help"
        />
        <small id="eventType-help" class="text-red-500" v-if="errors?.eventType">
          {{ errors.eventType }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="description" class="font-bold">Опис</label>
        <Textarea
          rows="5"
          cols="12"
          id="description"
          v-model="description"
          v-bind="descriptionAttrs"
          placeholder="Опис"
        />
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" label="Скасувати" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" label="Зберегти" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
