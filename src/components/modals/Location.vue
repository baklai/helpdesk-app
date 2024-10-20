<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useLocation } from '@/stores/api/locations';

const toast = useToast();
const confirm = useConfirm();

const { findAllGroured, createOne, updateOne, removeOne } = useLocation();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      name: yup.string().required('Потрібно вказати значення')
    }),
    initialValues: {}
  });

const emits = defineEmits(['close']);

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

const [name, nameAttrs] = defineField('name');
const [region, regionAttrs] = defineField('region');

const onShowModal = async () => {
  records.value = await findAllGroured({});
};

const onUpdateRecords = async () => {
  resetForm({ values: {} }, { force: true });
  try {
    records.value = await findAllGroured({});
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
          <i class="pi pi-map-marker mr-4 text-4xl"></i>
          <div>
            <p class="line-height-2 text-lg font-bold">Розташування</p>
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
        showClear
        autofocus
        resetFilterOnHide
        optionLabel="name"
        optionGroupLabel="group"
        optionGroupChildren="records"
        :options="records"
        filterPlaceholder="Пошук у списку"
        placeholder="Пошук у базі даних"
        :virtualScrollerOptions="{ itemSize: 32 }"
        :pt="{
          itemgroup: {
            class: [
              'font-bold m-0 py-3 px-5 cursor-auto',
              'text-surface-800 dark:text-white/80',
              'bg-surface-200 dark:bg-surface-900/80'
            ]
          }
        }"
        @change="event => setValues({ ...event.value })"
      >
        <template #optiongroup="{ option }">
          <div class="flex h-full items-center justify-center text-base uppercase">
            {{ option.group }}
          </div>
        </template>
        <template #option="{ option }">
          <div class="flex h-full items-center text-base">
            {{ option.name }}
          </div>
        </template>
      </Dropdown>
    </div>

    <Divider type="solid" class="my-6" />

    <form class="flex flex-col gap-y-4" @submit.prevent="onSaveRecord">
      <div class="flex flex-col gap-2">
        <label for="name" class="font-bold">Назва розташування</label>
        <InputText
          id="name"
          v-model="name"
          v-bind="nameAttrs"
          placeholder="Назва розташування"
          :invalid="!!errors?.name"
          aria-describedby="name-help"
        />
        <small id="name-help" class="text-red-500" v-if="errors?.name">
          {{ errors.name }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="region" class="font-bold">Регіон розташування</label>
        <InputText
          id="region"
          v-model="region"
          v-bind="regionAttrs"
          placeholder="Регіон розташування"
        />
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" label="Скасувати" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" label="Зберегти" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
