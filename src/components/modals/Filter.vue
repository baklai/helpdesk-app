<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { capitalizeFirstLetter } from '@/service/DataFilters';
import { useFilter } from '@/stores/api/filters';

const toast = useToast();
const confirm = useConfirm();

const { findAll, createOne, updateOne, removeOne } = useFilter();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      regex: yup.string().required('Потрібно вказати значення'),
      type: yup.string().required('Потрібно вказати значення'),
      status: yup.string().required('Потрібно вказати значення')
    }),
    initialValues: {}
  });

const emits = defineEmits(['close']);

const groupBy = (array, property) => {
  const result = [];
  const obj = array.reduce(
    (grouped, element) => ({
      ...grouped,
      [element[property]]: [...(grouped[element[property]] || []), element]
    }),
    {}
  );

  Object.entries(obj).forEach(([key, value]) => {
    result.push({
      label: key?.toUpperCase(),
      code: key,
      items: value
    });
  });

  return result;
};

const visible = ref(true);

const refMenu = ref();
const options = ref([
  {
    label: 'Створити запис',
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
  {
    label: 'Видалити запис',
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  },
  {
    label: 'Оновити записи',
    icon: 'pi pi-sync',
    command: async () => await onUpdateRecords()
  }
]);

const records = ref([]);

const [regex, regexAttrs] = defineField('regex');
const [type, typeAttrs] = defineField('type');
const [status, statusAttrs] = defineField('status');
const [description, descriptionAttrs] = defineField('description');

const onShowModal = async () => {
  records.value = await findAll({});
  records.value = groupBy(records.value, 'type');
};

const onUpdateRecords = async () => {
  resetForm({ values: {} }, { force: true });
  try {
    records.value = await findAll({});
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Записи оновлені',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Записи не оновлено',
      life: 3000
    });
  }
};

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
    closable
    draggable
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw]"
    @show="onShowModal"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <i class="pi pi-filter mr-4 text-4xl"></i>
          <div>
            <p class="line-height-2 text-lg font-bold">Системні фільтри</p>
            <p class="line-height-2 text-base font-normal text-surface-500">
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

    <div class="flex flex-col gap-2">
      <Dropdown
        filter
        autofocus
        :options="records"
        @change="event => setValues({ ...event.value })"
        optionGroupLabel="label"
        optionGroupChildren="items"
        :optionLabel="({ regex }) => regex"
        filterPlaceholder="Пошук у списку"
        placeholder="Пошук у базі даних"
      >
        <template #optiongroup="slotProps">
          <div class="flex items-center">
            <span class="text-lg font-bold text-primary-500">{{ slotProps?.option?.label }}</span>
          </div>
        </template>

        <template #option="slotProps">
          <div class="flex items-center">
            <span class="text-base font-semibold">
              {{ slotProps?.option?.regex }}
              <sup
                class="text-xs font-bold"
                :class="slotProps?.option?.status === 'deny' ? 'text-yellow-500' : 'text-green-600'"
              >
                {{ slotProps?.option?.status?.toUpperCase() }}
              </sup>
            </span>
          </div>
        </template>
      </Dropdown>
    </div>

    <Divider type="solid" class="my-6" />

    <form class="flex flex-col gap-y-4" @submit.prevent="onSaveRecord">
      <div class="flex flex-col gap-2">
        <label for="regex" class="font-bold">Регулярний вираз для фільтру</label>
        <InputText
          id="regex"
          v-model="regex"
          v-bind="regexAttrs"
          placeholder="Регулярний вираз для фільтру"
          :invalid="!!errors?.regex"
          aria-describedby="regex-help"
        />
        <small id="regex-help" class="text-red-500" v-if="errors?.regex">
          {{ errors.regex }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="type" class="font-bold">Тип фільтру</label>
        <Dropdown
          filter
          autofocus
          showClear
          resetFilterOnHide
          inputId="type"
          v-model="type"
          v-bind="typeAttrs"
          :options="['account', 'software', 'share']"
          :optionLabel="item => capitalizeFirstLetter($t(item))"
          filterPlaceholder="Пошук"
          placeholder="Тип фільтру"
          :invalid="!!errors?.type"
          aria-describedby="type-help"
        />
        <small id="type-help" class="text-red-500" v-if="errors?.type">
          {{ errors.type }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="status" class="font-bold">Статус фільтру</label>
        <Dropdown
          filter
          autofocus
          showClear
          resetFilterOnHide
          inputId="status"
          v-model="status"
          v-bind="statusAttrs"
          :options="['allow', 'deny']"
          :optionLabel="item => capitalizeFirstLetter($t(item))"
          filterPlaceholder="Пошук"
          placeholder="Статус фільтру"
          :invalid="!!errors?.status"
          aria-describedby="status-help"
        />
        <small id="status-help" class="text-red-500" v-if="errors?.status">
          {{ errors.status }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="description" class="font-bold">Опис фільтру</label>
        <Textarea
          rows="5"
          id="description"
          v-model="description"
          v-bind="descriptionAttrs"
          placeholder="Опис фільтру"
        />
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" label="Скасувати" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" label="Зберегти" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
